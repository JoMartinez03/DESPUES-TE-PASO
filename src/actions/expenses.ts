"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/generated/prisma"
import { auth } from "@/lib/auth"
import { toDecimal } from "@/lib/transactions"
import { prisma } from "@/lib/prisma"
import {
  buildExpenseShares,
  createExpenseDebts,
  deleteExpenseDebts,
  expenseNotificationBody,
  type ShareRow,
} from "@/lib/gatherings/debts"
import {
  expenseIdSchema,
  expenseMutationSchema,
  type ExpenseIdInput,
  type ExpenseMutationInput,
} from "@/lib/validations/gatherings"

type ActionResult =
  | { ok: true; message: string }
  | { ok: false; code: string; message: string }

type GatheringContext = {
  id: string
  name: string
  creatorId: string
  status: "ACTIVE" | "CLOSED"
  memberIds: Set<string>
}

type LockedGathering =
  | { kind: "active"; id: string; creatorId: string; memberIds: Set<string> }
  | { kind: "missing" }
  | { kind: "closed" }

async function sessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

async function loadGatheringContext(
  gatheringId: string,
  selfId: string,
): Promise<GatheringContext | null> {
  const gathering = await prisma.gathering.findUnique({
    where: { id: gatheringId },
    select: {
      id: true,
      name: true,
      creatorId: true,
      status: true,
      participants: { select: { userId: true } },
    },
  })
  if (!gathering) return null

  const memberIds = new Set(gathering.participants.map((participant) => participant.userId))
  if (!memberIds.has(selfId)) return null

  return {
    id: gathering.id,
    name: gathering.name,
    creatorId: gathering.creatorId,
    status: gathering.status,
    memberIds,
  }
}

async function lockActiveGathering(
  tx: Prisma.TransactionClient,
  gatheringId: string,
  selfId: string,
): Promise<LockedGathering> {
  const rows = await tx.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "gatherings" WHERE "id" = ${gatheringId} FOR UPDATE
  `
  if (rows.length === 0) return { kind: "missing" }

  const gathering = await tx.gathering.findUnique({
    where: { id: gatheringId },
    select: {
      id: true,
      creatorId: true,
      status: true,
      participants: { select: { userId: true } },
    },
  })
  if (!gathering) return { kind: "missing" }
  if (gathering.status === "CLOSED") return { kind: "closed" }

  const memberIds = new Set(gathering.participants.map((participant) => participant.userId))
  if (!memberIds.has(selfId)) return { kind: "missing" }

  return { kind: "active", id: gathering.id, creatorId: gathering.creatorId, memberIds }
}

async function selfName(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })
  return user?.name ?? "Alguien"
}

function revalidateGatheringRoutes(
  gatheringId: string,
  participantIds: string[],
): void {
  revalidatePath("/dashboard")
  revalidatePath("/juntadas")
  revalidatePath(`/juntadas/${gatheringId}`)
  revalidatePath("/personas")
  for (const userId of participantIds) {
    revalidatePath(`/personas/${userId}`)
  }
  revalidatePath("/", "layout")
}

type ResolvedExpense =
  | { ok: false; code: string; message: string }
  | {
      ok: true
      data: ExpenseMutationInput
      context: GatheringContext
      participantIds: string[]
      payerId: string
      shares: ShareRow[]
    }

async function resolveExpensePayload(
  input: ExpenseMutationInput,
  selfId: string,
): Promise<ResolvedExpense> {
  const parsed = expenseMutationSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }
  const data = parsed.data

  const context = await loadGatheringContext(data.gatheringId, selfId)
  if (!context) {
    return { ok: false, code: "not_found", message: "La juntada no existe o no participás" }
  }
  if (context.status === "CLOSED") {
    return { ok: false, code: "closed", message: "La juntada está cerrada" }
  }

  const participantIds = [...new Set(data.participantIds)]
  if (!participantIds.every((userId) => context.memberIds.has(userId))) {
    return { ok: false, code: "invalid_participant", message: "Participante fuera de la juntada" }
  }
  if (!context.memberIds.has(data.payerId)) {
    return { ok: false, code: "invalid_payer", message: "El pagador debe participar de la juntada" }
  }

  let shares: ShareRow[]
  try {
    shares = buildExpenseShares(toDecimal(data.amount), {
      type: data.splitType,
      participantIds,
      custom: data.shares ?? {},
    })
  } catch {
    return {
      ok: false,
      code: "invalid_shares",
      message: "Revisá la división del gasto",
    }
  }

  return {
    ok: true,
    data,
    context,
    participantIds,
    payerId: data.payerId,
    shares,
  }
}

function validateLockedParticipants(
  locked: Extract<LockedGathering, { kind: "active" }>,
  participantIds: string[],
  payerId: string,
): { ok: true } | { ok: false; code: string; message: string } {
  if (!participantIds.every((userId) => locked.memberIds.has(userId))) {
    return { ok: false, code: "invalid_participant", message: "Participante fuera de la juntada" }
  }
  if (!locked.memberIds.has(payerId)) {
    return { ok: false, code: "invalid_payer", message: "El pagador debe participar de la juntada" }
  }
  return { ok: true }
}

export async function createExpense(
  input: ExpenseMutationInput,
): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "unauthorized", message: "No estás autenticado" }
  }

  const resolved = await resolveExpensePayload(input, selfId)
  if (!resolved.ok) return resolved

  const { data, context, participantIds, payerId, shares } = resolved
  const amount = toDecimal(data.amount)
  const actorName = await selfName(selfId)

  const result = await prisma.$transaction(async (tx) => {
    const locked = await lockActiveGathering(tx, context.id, selfId)
    if (locked.kind === "missing") {
      return { ok: false as const, code: "not_found", message: "La juntada no existe o no participás" }
    }
    if (locked.kind === "closed") {
      return { ok: false as const, code: "closed", message: "La juntada está cerrada" }
    }
    const validParticipants = validateLockedParticipants(locked, participantIds, payerId)
    if (!validParticipants.ok) return validParticipants

    const expense = await tx.expense.create({
      data: {
        gatheringId: context.id,
        createdById: selfId,
        payerId,
        title: data.title,
        amount,
        splitType: data.splitType,
        currency: "ARS",
        participants: {
          create: shares.map((share) => ({
            userId: share.userId,
            shareAmount: share.shareAmount,
          })),
        },
      },
      select: { id: true },
    })

    await createExpenseDebts(tx, {
      expenseId: expense.id,
      payerId,
      actorId: selfId,
      title: data.title,
      shares,
    })

    const body = expenseNotificationBody(actorName, data.title, amount, context.name)
    const affectedIds = [...new Set([...participantIds, payerId])]
    for (const userId of affectedIds) {
      if (userId === selfId) continue
      await tx.notification.create({
        data: {
          userId,
          type: "GENERAL",
          title: "Nuevo gasto",
          body,
          relatedGatheringId: context.id,
        },
      })
    }

    return { ok: true as const, message: "Gasto agregado", affectedIds }
  })

  if (!result.ok) return result
  revalidateGatheringRoutes(context.id, result.affectedIds)
  return result
}

export async function updateExpense(
  input: ExpenseMutationInput & ExpenseIdInput,
): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "unauthorized", message: "No estás autenticado" }
  }

  const idParsed = expenseIdSchema.safeParse(input)
  if (!idParsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }

  const resolved = await resolveExpensePayload(input, selfId)
  if (!resolved.ok) return resolved

  const { data, context, participantIds, payerId, shares } = resolved
  const expenseId = idParsed.data.expenseId

  const result = await prisma.$transaction(async (tx) => {
    const locked = await lockActiveGathering(tx, context.id, selfId)
    if (locked.kind === "missing") {
      return { ok: false as const, code: "not_found", message: "La juntada no existe o no participás" }
    }
    if (locked.kind === "closed") {
      return { ok: false as const, code: "closed", message: "La juntada está cerrada" }
    }

    const expense = await tx.expense.findUnique({
      where: { id: expenseId },
      select: {
        id: true,
        gatheringId: true,
        createdById: true,
        payerId: true,
        participants: { select: { userId: true } },
      },
    })
    if (!expense || expense.gatheringId !== context.id) {
      return { ok: false as const, code: "not_found", message: "El gasto no existe en esta juntada" }
    }

    const canManage = locked.creatorId === selfId || expense.createdById === selfId
    if (!canManage) {
      return {
        ok: false as const,
        code: "forbidden",
        message: "Solo el creador de la juntada o quien cargó el gasto puede editarlo",
      }
    }

    const validParticipants = validateLockedParticipants(locked, participantIds, payerId)
    if (!validParticipants.ok) return validParticipants

    await deleteExpenseDebts(tx, expenseId)
    await tx.expenseParticipant.deleteMany({ where: { expenseId } })
    await tx.expense.update({
      where: { id: expenseId },
      data: {
        payerId,
        title: data.title,
        amount: toDecimal(data.amount),
        splitType: data.splitType,
        participants: {
          create: shares.map((share) => ({
            userId: share.userId,
            shareAmount: share.shareAmount,
          })),
        },
      },
    })
    await createExpenseDebts(tx, {
      expenseId,
      payerId,
      actorId: selfId,
      title: data.title,
      shares,
    })

    const affectedIds = [
      ...new Set([
        ...expense.participants.map((participant) => participant.userId),
        expense.payerId,
        ...participantIds,
        payerId,
      ]),
    ]
    return { ok: true as const, message: "Gasto actualizado", affectedIds }
  })

  if (!result.ok) return result
  revalidateGatheringRoutes(context.id, result.affectedIds)
  return result
}

export async function deleteExpense(input: ExpenseIdInput): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "unauthorized", message: "No estás autenticado" }
  }

  const idParsed = expenseIdSchema.safeParse(input)
  if (!idParsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }
  const expenseId = idParsed.data.expenseId

  const result = await prisma.$transaction(async (tx) => {
    const expense = await tx.expense.findUnique({
      where: { id: expenseId },
      select: { id: true, gatheringId: true, createdById: true },
    })
    if (!expense) {
      return { ok: false as const, code: "not_found", message: "El gasto no existe" }
    }

    const locked = await lockActiveGathering(tx, expense.gatheringId, selfId)
    if (locked.kind === "missing") {
      return { ok: false as const, code: "not_found", message: "La juntada no existe o no participás" }
    }
    if (locked.kind === "closed") {
      return { ok: false as const, code: "closed", message: "La juntada está cerrada" }
    }

    const canManage = locked.creatorId === selfId || expense.createdById === selfId
    if (!canManage) {
      return {
        ok: false as const,
        code: "forbidden",
        message: "Solo el creador de la juntada o quien cargó el gasto puede eliminarlo",
      }
    }

    await deleteExpenseDebts(tx, expense.id)
    await tx.expenseParticipant.deleteMany({ where: { expenseId: expense.id } })
    await tx.expense.delete({ where: { id: expense.id } })

    return {
      ok: true as const,
      message: "El gasto y sus deudas se eliminaron de la juntada",
      gatheringId: expense.gatheringId,
      memberIds: [...locked.memberIds],
    }
  })

  if (!result.ok) return result
  revalidateGatheringRoutes(result.gatheringId, result.memberIds)
  return result
}
