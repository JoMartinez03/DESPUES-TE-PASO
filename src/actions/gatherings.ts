"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/generated/prisma"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { deleteGatheringDebts } from "@/lib/gatherings/debts"
import { gatheringClosedPushMessage } from "@/lib/push/messages"
import { sendPushToUsers } from "@/lib/push/send"
import {
  createGatheringSchema,
  gatheringIdSchema,
  updateGatheringParticipantsSchema,
  type CreateGatheringInput,
  type GatheringIdInput,
  type UpdateGatheringParticipantsInput,
} from "@/lib/validations/gatherings"

type ActionResult =
  | {
      ok: true
      message: string
      code?: "already_closed"
      settledDebts?: number
      gatheringId?: string
      /** Solo en el cierre efectivo: a quién se le avisó por push. */
      notifiedIds?: string[]
      notifiedByName?: string
    }
  | { ok: false; code: string; message: string }

type LockedGathering = {
  id: string
  creatorId: string
  status: "ACTIVE" | "CLOSED"
  creator: { name: string }
  participants: { userId: string }[]
}

async function sessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

async function requireAcceptedFriends(
  tx: Prisma.TransactionClient,
  selfId: string,
  ids: string[],
): Promise<{ id: string; name: string }[] | null> {
  const unique = [...new Set(ids)].filter((id) => id !== selfId)
  if (unique.length === 0) return []

  const users = await tx.user.findMany({
    where: { id: { in: unique } },
    select: { id: true, name: true },
  })
  if (users.length !== unique.length) return null

  const friendships = await tx.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: selfId, addresseeId: { in: unique } },
        { requesterId: { in: unique }, addresseeId: selfId },
      ],
    },
    select: { requesterId: true, addresseeId: true },
  })
  if (friendships.length !== unique.length) return null

  return users
}

async function lockGathering(
  tx: Prisma.TransactionClient,
  gatheringId: string,
): Promise<LockedGathering | null> {
  const rows = await tx.$queryRaw<{ id: string }[]>`
    SELECT "id" FROM "gatherings" WHERE "id" = ${gatheringId} FOR UPDATE
  `
  if (rows.length === 0) return null

  return tx.gathering.findUnique({
    where: { id: gatheringId },
    select: {
      id: true,
      creatorId: true,
      status: true,
      creator: { select: { name: true } },
      participants: { select: { userId: true } },
    },
  })
}

function revalidateGatheringRoutes(gatheringId?: string): void {
  revalidatePath("/juntadas")
  if (gatheringId) revalidatePath(`/juntadas/${gatheringId}`)
}

export async function createGathering(
  input: CreateGatheringInput,
): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "unauthorized", message: "No estás autenticado" }
  }

  const parsed = createGatheringSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }

  const result = await prisma.$transaction(async (tx) => {
    const friends = await requireAcceptedFriends(
      tx,
      selfId,
      parsed.data.participantIds,
    )
    if (!friends) {
      return {
        ok: false as const,
        code: "invalid_friend",
        message: "Uno de los participantes no es tu amigo",
      }
    }

    const memberIds = [selfId, ...friends.map((friend) => friend.id)]
    if (memberIds.length < 2) {
      return {
        ok: false as const,
        code: "min_participants",
        message: "Una juntada necesita al menos 2 personas",
      }
    }

    const created = await tx.gathering.create({
      data: { name: parsed.data.name, creatorId: selfId, date: new Date() },
      select: { id: true },
    })
    await tx.gatheringParticipant.createMany({
      data: memberIds.map((userId) => ({ gatheringId: created.id, userId })),
    })
    return { ok: true as const, message: "Juntada creada", gatheringId: created.id }
  })

  if (!result.ok) return result
  revalidateGatheringRoutes(result.gatheringId)
  return result
}

export async function updateGatheringParticipants(
  input: UpdateGatheringParticipantsInput,
): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "unauthorized", message: "No estás autenticado" }
  }

  const parsed = updateGatheringParticipantsSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }
  const gatheringId = parsed.data.gatheringId

  const result = await prisma.$transaction(async (tx) => {
    const gathering = await lockGathering(tx, gatheringId)
    if (!gathering) {
      return { ok: false as const, code: "not_found", message: "La juntada no existe" }
    }
    if (gathering.creatorId !== selfId) {
      return {
        ok: false as const,
        code: "forbidden",
        message: "Solo el creador puede editar los participantes",
      }
    }
    if (gathering.status === "CLOSED") {
      return {
        ok: false as const,
        code: "closed",
        message: "La juntada está cerrada",
      }
    }

    const friends = await requireAcceptedFriends(
      tx,
      selfId,
      parsed.data.participantIds,
    )
    if (!friends) {
      return {
        ok: false as const,
        code: "invalid_friend",
        message: "Uno de los participantes no es tu amigo",
      }
    }

    const memberIds = [
      ...new Set([selfId, ...friends.map((friend) => friend.id)]),
    ]
    if (memberIds.length < 2) {
      return {
        ok: false as const,
        code: "min_participants",
        message: "Una juntada necesita al menos 2 personas",
      }
    }

    const currentIds = gathering.participants.map((participant) => participant.userId)
    const removedIds = currentIds.filter((id) => !memberIds.includes(id))

    if (removedIds.length > 0) {
      const used = await tx.expense.findFirst({
        where: {
          gatheringId,
          OR: [
            { payerId: { in: removedIds } },
            { participants: { some: { userId: { in: removedIds } } } },
          ],
        },
        select: { id: true },
      })
      if (used) {
        return {
          ok: false as const,
          code: "in_use",
          message: "No podés quitar a un participante que forme parte de gastos existentes",
        }
      }
    }

    const toAdd = memberIds.filter((id) => !currentIds.includes(id))
    if (removedIds.length > 0) {
      await tx.gatheringParticipant.deleteMany({
        where: { gatheringId, userId: { in: removedIds } },
      })
    }
    if (toAdd.length > 0) {
      await tx.gatheringParticipant.createMany({
        data: toAdd.map((userId) => ({ gatheringId, userId })),
      })
    }

    return { ok: true as const, message: "Participantes actualizados" }
  })

  if (!result.ok) return result
  revalidateGatheringRoutes(gatheringId)
  return result
}

export async function closeGathering(
  input: GatheringIdInput,
): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "unauthorized", message: "No estás autenticado" }
  }

  const parsed = gatheringIdSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }
  const gatheringId = parsed.data.gatheringId

  const result = await prisma.$transaction(async (tx) => {
    const gathering = await lockGathering(tx, gatheringId)
    if (!gathering) {
      return { ok: false as const, code: "not_found", message: "La juntada no existe" }
    }
    if (gathering.creatorId !== selfId) {
      return {
        ok: false as const,
        code: "forbidden",
        message: "Solo el creador puede cerrar la juntada",
      }
    }
    if (gathering.status === "CLOSED") {
      return { ok: true as const, code: "already_closed" as const, message: "La juntada ya estaba cerrada" }
    }

    // El CAS va PRIMERO: hace de mutex y garantiza que, si llegamos a borrar,
    // la gathering es nuestra y Active. Cualquier fallo posterior lanza y
    // Prisma revierte toda la transacción (deudas incluidas).
    const claimed = await tx.gathering.updateMany({
      where: { id: gatheringId, creatorId: selfId, status: "ACTIVE" },
      data: { status: "CLOSED", closedAt: new Date() },
    })
    if (claimed.count !== 1) {
      return {
        ok: false as const,
        code: "conflict",
        message: "La juntada cambió de estado. Volvé a intentar",
      }
    }

    // Regla de producto: cerrar salda las deudas generadas por ESTA juntada.
    // Solo DEBT derivadas de sus gastos; ni DEBT manuales, ni DEBT de otras
    // juntadas, ni PAYMENT.
    const settledDebts = await deleteGatheringDebts(tx, gatheringId)

    const participantIds = gathering.participants
      .map((participant) => participant.userId)
      .filter((userId) => userId !== selfId)
    if (participantIds.length > 0) {
      const creatorName = gathering.creator.name
      await tx.notification.createMany({
        data: participantIds.map((userId) => ({
          userId,
          type: "GENERAL" as const,
          title: "Juntada cerrada",
          body: `${creatorName} cerró la juntada. Las deudas de sus gastos quedaron saldadas.`,
          relatedGatheringId: gatheringId,
        })),
      })
    }

    return {
        ok: true as const,
        message: "Juntada cerrada",
        settledDebts,
        notifiedIds: participantIds,
        notifiedByName: gathering.creator.name,
      }
    })

  if (!result.ok) return result
  revalidatePath("/dashboard")
  revalidatePath("/juntadas")
  revalidatePath(`/juntadas/${gatheringId}`)
  revalidatePath("/personas")
  for (const participantId of result.notifiedIds ?? []) {
    revalidatePath(`/personas/${participantId}`)
  }
  // La juntada ya quedó cerrada y las deudas saldadas: el aviso a los
  // participantes es un efecto secundario.
  await sendPushToUsers(
    result.notifiedIds ?? [],
    gatheringClosedPushMessage(gatheringId, result.notifiedByName ?? ""),
  )
  return result
}
