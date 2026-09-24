"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  createGatheringSchema,
  updateGatheringParticipantsSchema,
  type CreateGatheringInput,
  type UpdateGatheringParticipantsInput,
} from "@/lib/validations/gatherings"
import { getFriendshipBetween } from "@/queries/friendships"

type ActionResult =
  | { ok: true; message: string; gatheringId?: string }
  | { ok: false; code: string; message: string }

async function sessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

/**
 * Valida que `ids` (distintos de `selfId`) sean usuarios existentes y amigos
 * ACEPTADOS de `selfId`. Devuelve los usuarios resueltos, o null si alguno no
 * cumple. Descartar duplicados y al propio usuario evita reintentos sobre sí mismo.
 */
async function requireAcceptedFriends(
  selfId: string,
  ids: string[],
): Promise<{ id: string; name: string }[] | null> {
  const unique = [...new Set(ids)].filter((id) => id !== selfId)
  if (unique.length === 0) return []

  const users = await prisma.user.findMany({
    where: { id: { in: unique } },
    select: { id: true, name: true },
  })
  if (users.length !== unique.length) return null

  for (const user of users) {
    const friendship = await getFriendshipBetween(selfId, user.id)
    if (!friendship) return null
  }
  return users
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

  const friends = await requireAcceptedFriends(selfId, parsed.data.participantIds)
  if (!friends) {
    return {
      ok: false,
      code: "invalid_friend",
      message: "Uno de los participantes no es tu amigo",
    }
  }

  const memberIds = [selfId, ...friends.map((friend) => friend.id)]
  if (memberIds.length < 2) {
    return {
      ok: false,
      code: "min_participants",
      message: "Una juntada necesita al menos 2 personas",
    }
  }

  const gathering = await prisma.$transaction(async (tx) => {
    const created = await tx.gathering.create({
      data: { name: parsed.data.name, creatorId: selfId, date: new Date() },
      select: { id: true },
    })
    await tx.gatheringParticipant.createMany({
      data: memberIds.map((userId) => ({ gatheringId: created.id, userId })),
    })
    return created.id
  })

  revalidatePath("/juntadas")
  revalidatePath("/", "layout")
  return { ok: true, message: "Juntada creada", gatheringId: gathering }
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

  const gathering = await prisma.gathering.findUnique({
    where: { id: gatheringId },
    select: { id: true, creatorId: true },
  })
  if (!gathering) {
    return { ok: false, code: "not_found", message: "La juntada no existe" }
  }
  if (gathering.creatorId !== selfId) {
    return {
      ok: false,
      code: "forbidden",
      message: "Solo el creador puede editar los participantes",
    }
  }

  const friends = await requireAcceptedFriends(selfId, parsed.data.participantIds)
  if (!friends) {
    return {
      ok: false,
      code: "invalid_friend",
      message: "Uno de los participantes no es tu amigo",
    }
  }

  const memberIds = [...new Set([selfId, ...friends.map((friend) => friend.id)])]
  if (memberIds.length < 2) {
    return {
      ok: false,
      code: "min_participants",
      message: "Una juntada necesita al menos 2 personas",
    }
  }

  const current = await prisma.gatheringParticipant.findMany({
    where: { gatheringId },
    select: { userId: true },
  })
  const currentIds = current.map((participant) => participant.userId)
  const removedIds = currentIds.filter((id) => !memberIds.includes(id))

  if (removedIds.length > 0) {
    const used = await prisma.expense.findFirst({
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
        ok: false,
        code: "in_use",
        message: "No podés quitar a un participante que forme parte de gastos existentes",
      }
    }
  }

  const toAdd = memberIds.filter((id) => !currentIds.includes(id))

  await prisma.$transaction(async (tx) => {
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
  })

  revalidatePath("/juntadas")
  revalidatePath(`/juntadas/${gatheringId}`)
  revalidatePath("/", "layout")
  return { ok: true, message: "Participantes actualizados" }
}