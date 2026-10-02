"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  pushSubscriptionSchema,
  pushUnsubscribeSchema,
  type PushSubscriptionInput,
  type PushUnsubscribeInput,
} from "@/lib/validations/push"

export type PushActionResult = { ok: true } | { ok: false; error: string }

/**
 * Guarda (o reasigna) la suscripción de ESTE dispositivo.
 *
 * El `userId` sale exclusivamente de la sesión: el cliente nunca puede elegir
 * a quién se le guarda una suscripción. El `endpoint` es UNIQUE y es la
 * identidad real del dispositivo, así que volver a suscribirse actualiza la
 * fila existente en lugar de duplicarla.
 */
export async function enablePushNotifications(
  input: PushSubscriptionInput,
): Promise<PushActionResult> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return { ok: false, error: "No hay sesión activa." }

  const parsed = pushSubscriptionSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Suscripción inválida." }
  }

  const { endpoint, keys } = parsed.data

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: {
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    update: {
      userId,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
  })

  revalidatePath("/perfil")
  return { ok: true }
}

/**
 * Da de baja SOLO el dispositivo que está ejecutando la acción.
 *
 * Se borra por `endpoint` + `userId` de la sesión, así que las suscripciones
 * del mismo usuario en otros dispositivos (iPhone, notebook, otro navegador)
 * quedan intactas. Es idempotente: si el endpoint no estaba, tampoco falla.
 */
export async function disablePushNotifications(
  input: PushUnsubscribeInput,
): Promise<PushActionResult> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) return { ok: false, error: "No hay sesión activa." }

  const parsed = pushUnsubscribeSchema.safeParse(input)
  if (!parsed.success) return { ok: true }

  await prisma.pushSubscription.deleteMany({
    where: { endpoint: parsed.data.endpoint, userId },
  })

  revalidatePath("/perfil")
  return { ok: true }
}