"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { friendshipIdSchema, type FriendshipIdInput } from "@/lib/validations/friendship"

export type MarkReadResult = { ok: true } | { ok: false; message: string }

async function sessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

export async function markAllNotificationsRead(): Promise<MarkReadResult> {
  const userId = await sessionUserId()
  if (!userId) return { ok: false, message: "No estás autenticado" }

  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })

  revalidatePath("/", "layout")
  return { ok: true }
}

export async function markNotificationRead(
  input: FriendshipIdInput,
): Promise<MarkReadResult> {
  const userId = await sessionUserId()
  if (!userId) return { ok: false, message: "No estás autenticado" }

  const parsed = friendshipIdSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: "Notificación inválida" }

  await prisma.notification.updateMany({
    where: { id: parsed.data.friendshipId, userId, read: false },
    data: { read: true },
  })

  revalidatePath("/", "layout")
  return { ok: true }
}