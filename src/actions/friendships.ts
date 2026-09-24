"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { friendshipPairKey } from "@/lib/friendship"
import { prisma } from "@/lib/prisma"
import {
  friendshipIdSchema,
  searchUsersSchema,
  userIdSchema,
  type FriendshipIdInput,
  type SearchUsersInput,
  type UserIdInput,
} from "@/lib/validations/friendship"
import { searchUsers, type SearchResult } from "@/queries/friendships"

type SendRequestResult =
  | { ok: true; message: string }
  | {
      ok: false
      code: "self" | "not_found" | "already_friends" | "incoming_exists"
      message: string
    }

type RequestResolutionResult =
  | { ok: true; message?: string }
  | { ok: false; code: "not_found" | "conflict"; message: string }

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  )
}

async function sessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

export async function sendFriendRequest(
  input: UserIdInput,
): Promise<SendRequestResult> {
  const selfId = await sessionUserId()
  if (!selfId) return { ok: false, code: "not_found", message: "No estás autenticado" }

  const parsed = userIdSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, code: "not_found", message: "Usuario inválido" }
  }
  const targetId = parsed.data.userId
  if (targetId === selfId) {
    return { ok: false, code: "self", message: "No podés agregarte a vos mismo" }
  }

  const target = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true, name: true },
  })
  if (!target) {
    return { ok: false, code: "not_found", message: "Ese usuario no existe" }
  }

  const pairKey = friendshipPairKey(selfId, targetId)

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.friendship.findUnique({
        where: { pairKey },
        select: { id: true, requesterId: true, status: true },
      })

      if (existing?.status === "ACCEPTED") {
        return {
          ok: false,
          code: "already_friends" as const,
          message: `Ya sos amigo de ${target.name.split(" ")[0]}`,
        }
      }

      if (existing?.status === "PENDING" && existing.requesterId !== selfId) {
        return {
          ok: false,
          code: "incoming_exists" as const,
          message: `${target.name.split(" ")[0]} ya te envió una solicitud`,
        }
      }

      let friendshipId = existing?.id
      if (existing) {
        if (existing.requesterId !== selfId || existing.status !== "PENDING") {
          await tx.friendship.update({
            where: { id: existing.id },
            data: { requesterId: selfId, addresseeId: targetId, status: "PENDING" },
          })
        }
      } else {
        const created = await tx.friendship.create({
          data: {
            requesterId: selfId,
            addresseeId: targetId,
            pairKey,
            status: "PENDING",
          },
        })
        friendshipId = created.id
      }

      if (friendshipId) {
        const duplicateNotification = await tx.notification.findFirst({
          where: {
            userId: targetId,
            relatedFriendshipId: friendshipId,
            type: "FRIEND_REQUEST",
            read: false,
          },
          select: { id: true },
        })
        if (!duplicateNotification) {
          await tx.notification.create({
            data: {
              userId: targetId,
              type: "FRIEND_REQUEST",
              title: "Solicitud de amistad",
              body: `${target.name.split(" ")[0] ?? target.name} quiere agregarte como amigo`,
              relatedFriendshipId: friendshipId,
            },
          })
        }
      }

      return {
        ok: true,
        message: `Solicitud enviada a ${target.name.split(" ")[0] ?? target.name}`,
      }
    })
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      const existing = await prisma.friendship.findUnique({
        where: { pairKey },
        select: { requesterId: true, status: true },
      })
      if (existing?.status === "PENDING" && existing.requesterId === selfId) {
        return { ok: true, message: "Ya enviaste esa solicitud" }
      }
      return {
        ok: false,
        code: "already_friends",
        message: "Ya existe una solicitud entre ustedes",
      }
    }
    console.error("Error al enviar solicitud", error)
    return {
      ok: false,
      code: "not_found",
      message: "No pudimos enviar la solicitud. Intentá de nuevo.",
    }
  }
}

export async function searchUsersAction(
  input: SearchUsersInput,
): Promise<SearchResult[]> {
  const selfId = await sessionUserId()
  if (!selfId) return []

  const parsed = searchUsersSchema.safeParse(input)
  if (!parsed.success) return []
  if (parsed.data.query.trim().length < 2) return []

  return searchUsers(parsed.data.query, selfId)
}

export async function acceptFriendRequest(
  input: FriendshipIdInput,
): Promise<RequestResolutionResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "not_found", message: "No estás autenticado" }
  }

  const parsed = friendshipIdSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, code: "not_found", message: "Solicitud inválida" }
  }

  const result = await prisma.$transaction(async (tx) => {
    const friendship = await tx.friendship.findUnique({
      where: { id: parsed.data.friendshipId },
      include: { requester: { select: { id: true, name: true } } },
    })

    if (!friendship || friendship.addresseeId !== selfId) {
      return null
    }
    if (friendship.status === "ACCEPTED") {
      return "already" as const
    }
    if (friendship.status !== "PENDING") {
      return "conflict" as const
    }

    await tx.friendship.update({
      where: { id: friendship.id },
      data: { status: "ACCEPTED" },
    })

    await tx.notification.updateMany({
      where: { userId: selfId, relatedFriendshipId: friendship.id, read: false },
      data: { read: true },
    })

    const requesterFirstName =
      friendship.requester.name.split(" ")[0] ?? friendship.requester.name
    await tx.notification.create({
      data: {
        userId: friendship.requesterId,
        type: "GENERAL",
        title: "Solicitud aceptada",
        body: `Ahora vos y ${requesterFirstName} son amigos 🎉`,
        relatedFriendshipId: friendship.id,
      },
    })

    return "accepted" as const
  })

  revalidatePath("/personas")
  revalidatePath("/", "layout")

  if (result === null) {
    return { ok: false, code: "not_found", message: "La solicitud no existe" }
  }
  if (result === "already") {
    return { ok: true, message: "Ya son amigos" }
  }
  if (result === "conflict") {
    return { ok: false, code: "conflict", message: "La solicitud ya no está pendiente" }
  }
  return { ok: true }
}

export async function rejectFriendRequest(
  input: FriendshipIdInput,
): Promise<RequestResolutionResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "not_found", message: "No estás autenticado" }
  }

  const parsed = friendshipIdSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, code: "not_found", message: "Solicitud inválida" }
  }

  const result = await prisma.$transaction(async (tx) => {
    const friendship = await tx.friendship.findUnique({
      where: { id: parsed.data.friendshipId },
      select: { id: true, addresseeId: true, status: true },
    })

    if (!friendship || friendship.addresseeId !== selfId) {
      return null
    }
    if (friendship.status === "REJECTED") {
      return "already" as const
    }
    if (friendship.status !== "PENDING") {
      return "conflict" as const
    }

    await tx.friendship.update({
      where: { id: friendship.id },
      data: { status: "REJECTED" },
    })

    await tx.notification.updateMany({
      where: { userId: selfId, relatedFriendshipId: friendship.id, read: false },
      data: { read: true },
    })

    return "rejected" as const
  })

  revalidatePath("/personas")
  revalidatePath("/", "layout")

  if (result === null) {
    return { ok: false, code: "not_found", message: "La solicitud no existe" }
  }
  if (result === "already") {
    return { ok: true }
  }
  if (result === "conflict") {
    return { ok: false, code: "conflict", message: "La solicitud ya no está pendiente" }
  }
  return { ok: true }
}