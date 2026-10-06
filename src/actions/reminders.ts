"use server"

import { auth } from "@/lib/auth"
import { firstName } from "@/lib/names"
import { prisma } from "@/lib/prisma"
import { debtReminderPushMessage } from "@/lib/push/messages"
import { sendPushToUser } from "@/lib/push/send"
import { userIdSchema, type UserIdInput } from "@/lib/validations/friendship"
import { getFriendshipBetween } from "@/queries/friendships"
import { balanceBetween } from "@/queries/transactions"

/**
 * Cooldown direccional por par actor → destinatario. Se persiste en la
 * `Notification` DEBT_REMINDER del destinatario: `userId` es el receptor, así
 * que un recordatorio A → B no bloquea el opuesto B → A.
 */
const REMINDER_COOLDOWN_MS = 12 * 60 * 60 * 1000

export type ReminderResult =
  | { ok: true; code: "sent" | "no_devices"; message: string }
  | {
      ok: false
      code: "unauthorized" | "invalid" | "not_found" | "no_debt" | "cooldown"
      message: string
    }

async function sessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

/**
 * Recordatorio de deuda: SOLO avisa. No crea transacciones ni toca balances.
 *
 * El cliente envía únicamente la identidad del amigo; el monto, los nombres y
 * el balance se recalculan siempre en servidor. El cooldown se valida acá,
 * nunca solo deshabilitando el botón.
 */
export async function sendDebtReminder(
  input: UserIdInput,
): Promise<ReminderResult> {
  const selfId = await sessionUserId()
  if (!selfId) {
    return { ok: false, code: "unauthorized", message: "No estás autenticado" }
  }

  const parsed = userIdSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }
  const friendId = parsed.data.userId
  if (friendId === selfId) {
    return { ok: false, code: "not_found", message: "No podés recordarte algo a vos mismo" }
  }

  const friendship = await getFriendshipBetween(selfId, friendId)
  if (!friendship) {
    return {
      ok: false,
      code: "not_found",
      message: "El usuario no existe o no son amigos",
    }
  }

  // Balance desde la perspectiva del actor autenticado: > 0 significa que el
  // amigo le debe. El motor económico es el mismo de siempre.
  const balance = await balanceBetween(selfId, friendId)
  if (balance.lte(0)) {
    return { ok: false, code: "no_debt", message: "Ya no hay deuda pendiente" }
  }

  // Cooldown en servidor. El filtro es direccional: busca la notificación
  // registrada HACIA el destinatario dentro de ESTE par, en los últimos 12 h.
  const cutoff = new Date(Date.now() - REMINDER_COOLDOWN_MS)
  const recentReminder = await prisma.notification.findFirst({
    where: {
      userId: friendId,
      type: "DEBT_REMINDER",
      relatedFriendshipId: friendship.id,
      createdAt: { gte: cutoff },
    },
    select: { id: true },
  })
  if (recentReminder) {
    return {
      ok: false,
      code: "cooldown",
      message: "Ya le enviaste un recordatorio recientemente",
    }
  }

  // Nombres actuales desde DB, nunca del cliente.
  const [actor, friend] = await Promise.all([
    prisma.user.findUnique({ where: { id: selfId }, select: { name: true } }),
    prisma.user.findUnique({ where: { id: friendId }, select: { name: true } }),
  ])
  if (!actor || !friend) {
    return { ok: false, code: "not_found", message: "El usuario no existe o no son amigos" }
  }

  const message = debtReminderPushMessage(
    { actorId: selfId, actorName: actor.name },
    balance,
  )

  // El aviso persistido cumple doble función: reclama el cooldown y deja el
  // recordatorio en la campanita del destinatario (respaldo si no tiene push).
  // Snapshot histórico: mismo texto que el push, no se reescribe.
  await prisma.notification.create({
    data: {
      userId: friendId,
      type: "DEBT_REMINDER",
      title: message.title,
      body: message.body,
      relatedFriendshipId: friendship.id,
    },
  })

  // Efecto secundario post-aviso: `sendPushToUser` nunca tira y no modifica
  // datos económicos. devices === 0 = el destinatario no tiene suscripciones.
  const summary = await sendPushToUser(friendId, message)
  const name = firstName(friend.name)

  if (summary.devices === 0) {
    return {
      ok: true,
      code: "no_devices",
      message: `${name} no tiene notificaciones activadas; le dejamos el aviso en la campanita`,
    }
  }
  return { ok: true, code: "sent", message: `Recordatorio enviado a ${name}` }
}
