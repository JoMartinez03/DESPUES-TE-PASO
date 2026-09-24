"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { toDecimal } from "@/lib/transactions"
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

async function sessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

type GatheringContext = {
  id: string
  name: string
  creatorId: string
  memberIds: Set<string>
}

/**
 * Carga el contexto mínimo de la juntada del gasto. Exige que `selfId` sea
 * participante (membresía es la llave de acceso a la juntada).
 */
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
    memberIds,
  }
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
) {
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

/** Aplica validación común de creación/edición de gasto (permisos + payload). */
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

  const participantIds = [...new Set(data.participantIds)]
  if (!participantIds.every((userId) => context.memberIds.has(userId))) {
    return { ok: false, code: "invalid_participant", message: "Participante fuera de la juntada" }
  }
  if (!context.memberIds.has(data.payerId)) {
    return { ok: false, code: "invalid_payer", message: "El pagador debe participar de la juntada" }
  }

  const shares = buildExpenseShares(toDecimal(data.amount), {
    type: data.splitType,
    participantIds,
    custom: data.shares ?? {},
  })

  return {
    ok: true,
    data,
    context,
    participantIds,
    payerId: data.payerId,
    shares,
  }
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

  await prisma.$transaction(async (tx) => {
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

    // Snapshots históricos: el cuerpo embebe el apodo del actor al momento de
    // crearse y no se reescribe si el usuario cambia su nombre después.
    const body = expenseNotificationBody(actorName, data.title, amount, context.name)
    for (const userId of participantIds) {
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
  })

  revalidateGatheringRoutes(context.id, participantIds)
  return { ok: true, message: "Gasto agregado" }
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

  const expense = await prisma.expense.findUnique({
    where: { id: expenseId },
    select: { id: true, gatheringId: true, createdById: true },
  })
  if (!expense || expense.gatheringId !== context.id) {
    return { ok: false, code: "not_found", message: "El gasto no existe en esta juntada" }
  }

  const canManage = context.creatorId === selfId || expense.createdById === selfId
  if (!canManage) {
    return {
      ok: false,
      code: "forbidden",
      message: "Solo el creador de la juntada o quien cargó el gasto puede editarlo",
    }
  }

  await prisma.$transaction(async (tx) => {
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
  })

  revalidateGatheringRoutes(context.id, participantIds)
  return { ok: true, message: "Gasto actualizado" }
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

  const expense = await prisma.expense.findUnique({
    where: { id: idParsed.data.expenseId },
    select: { id: true, gatheringId: true, createdById: true },
  })
  if (!expense) {
    return { ok: false, code: "not_found", message: "El gasto no existe" }
  }

  const context = await loadGatheringContext(expense.gatheringId, selfId)
  if (!context) {
    return { ok: false, code: "not_found", message: "La juntada no existe o no participás" }
  }

  const canManage = context.creatorId === selfId || expense.createdById === selfId
  if (!canManage) {
    return {
      ok: false,
      code: "forbidden",
      message: "Solo el creador de la juntada o quien cargó el gasto puede eliminarlo",
    }
  }

  await prisma.$transaction(async (tx) => {
    await deleteExpenseDebts(tx, expense.id)
    await tx.expenseParticipant.deleteMany({ where: { expenseId: expense.id } })
    await tx.expense.delete({ where: { id: expense.id } })
  })

  const memberIds = [...context.memberIds]
  revalidateGatheringRoutes(context.id, memberIds)
  return {
    ok: true,
    message: "El gasto y sus deudas se eliminaron de la juntada",
  }
}