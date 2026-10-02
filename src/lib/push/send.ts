import webpush from "web-push"
import { prisma } from "@/lib/prisma"
import type { PushMessage } from "@/lib/push/messages"

export type PushSendSummary = {
  /** Suscripciones que el usuario tenía al momento del envío. */
  devices: number
  /** Entregas aceptadas por el servicio push. */
  sent: number
  /** Suscripciones borradas porque el endpoint ya no existe. */
  removed: number
  /** Razón por la que no se intentó enviar, si corresponde. */
  skipped?: "not_configured"
}

/**
 * Timeout de socket: sin él, un endpoint muerto deja la server action colgada
 * hasta el timeout de la función y el usuario ve la acción trabada.
 */
const SEND_TIMEOUT_MS = 5_000
/** Una hora alcanza para avisos que requieren una acción del usuario. */
const TTL_SECONDS = 3_600
/** 404/410: el servicio push confirma que el endpoint murió. */
const GONE_STATUS_CODES = new Set([404, 410])

type VapidDetails = {
  subject: string
  publicKey: string
  privateKey: string
}

function readVapidDetails(): VapidDetails | null {
  const subject = process.env.VAPID_SUBJECT
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!subject || !publicKey || !privateKey) return null
  return { subject, publicKey, privateKey }
}

/**
 * El service worker solo debe poder navegar dentro de la app. Los builders ya
 * generan rutas internas, pero se blindan igual: `//evil.com` es una URL
 * protocol-relative y `javascript:` no es una ruta.
 */
export function safeInternalUrl(url: string): string {
  if (!url.startsWith("/") || url.startsWith("//")) return "/"
  return url
}

function statusCodeOf(error: unknown): number | null {
  if (typeof error !== "object" || error === null) return null
  const statusCode = (error as { statusCode?: unknown }).statusCode
  return typeof statusCode === "number" ? statusCode : null
}

/**
 * Envía un push a todos los dispositivos de un usuario.
 *
 * NUNCA tira. El push es un efecto secundario: la deuda, el pago o la amistad ya
 * están commiteados cuando esto corre, así que un fallo acá solo se loguea y se
 * sigue. Por eso el cuerpo completo va envuelto y el resultado es un resumen.
 */
export async function sendPushToUser(
  userId: string,
  message: PushMessage,
): Promise<PushSendSummary> {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
      select: { id: true, endpoint: true, p256dh: true, auth: true },
    })
    if (subscriptions.length === 0) return { devices: 0, sent: 0, removed: 0 }

    const vapidDetails = readVapidDetails()
    if (!vapidDetails) {
      console.error("push: falta VAPID_SUBJECT / VAPID_* , se omite el envío")
      return {
        devices: subscriptions.length,
        sent: 0,
        removed: 0,
        skipped: "not_configured",
      }
    }

    const payload = JSON.stringify({
      title: message.title,
      body: message.body,
      url: safeInternalUrl(message.url),
    })

    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          payload,
          { vapidDetails, TTL: TTL_SECONDS, timeout: SEND_TIMEOUT_MS },
        ),
      ),
    )

    let sent = 0
    const goneIds: string[] = []
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        sent += 1
        return
      }
      const subscription = subscriptions[index]
      const statusCode = statusCodeOf(result.reason)
      if (statusCode !== null && GONE_STATUS_CODES.has(statusCode)) {
        goneIds.push(subscription.id)
        return
      }
      // Se loguea el id de la fila, nunca el endpoint: es una credencial.
      console.error(
        `push: fallo al enviar a la suscripción ${subscription.id}`,
        result.reason,
      )
    })

    if (goneIds.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: { id: { in: goneIds } },
      })
    }

    return { devices: subscriptions.length, sent, removed: goneIds.length }
  } catch (error) {
    console.error("push: no se pudo completar el envío", error)
    return { devices: 0, sent: 0, removed: 0 }
  }
}

/**
 * Variante para eventos que abarcan a varias personas (gastos de juntada,
 * juntada cerrada). Cada usuario se resuelve por separado, así que un fallo
 * puntual no corta el envío al resto.
 */
export async function sendPushToUsers(
  userIds: string[],
  message: PushMessage,
): Promise<void> {
  const recipients = [...new Set(userIds)]
  if (recipients.length === 0) return
  await Promise.allSettled(
    recipients.map((userId) => sendPushToUser(userId, message)),
  )
}