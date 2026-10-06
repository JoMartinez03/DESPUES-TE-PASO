import { formatMoney } from "@/lib/format"
import { firstName } from "@/lib/names"

/** Payload que viaja cifrado al Service Worker. Solo texto y ruta interna. */
export type PushMessage = {
  title: string
  body: string
  /** Ruta interna del sitio. Nunca absoluta ni protocol-relative. */
  url: string
}

/**
 * `formatMoney` acepta number, string y objetos con `toString()` (los
 * `Prisma.Decimal` de la base), así que los builders no necesitan el tipo
 * exacto del monto.
 */
type Money = Parameters<typeof formatMoney>[0]

/**
 * Identidad del actor de un evento: el usuario que EJECUTÓ la acción, derivado
 * de la sesión. El nombre mostrado es su apodo (`User.name`), nunca su
 * `username`, y la notificación apunta a su perfil.
 *
 * No se puede asumir que el actor sea el deudor o el acreedor: en un gasto de
 * juntada, por ejemplo, el que carga el gasto puede ser distinto del que paga.
 */
type Actor = { actorId: string; actorName: string }

function actorProfile(actor: Actor): string {
  return `/personas/${actor.actorId}`
}

export function debtPushMessage(actor: Actor, amount: Money): PushMessage {
  return {
    title: "Deuda registrada",
    body: `${firstName(actor.actorName)} registró una deuda de ${formatMoney(amount)} con vos.`,
    url: actorProfile(actor),
  }
}

/**
 * Recordatorio de deuda: el actor le pide al destinatario que pague. El monto
 * viene calculado por servidor desde la perspectiva del actor (balance > 0),
 * así que el body habla del destinatario como deudor.
 */
export function debtReminderPushMessage(
  actor: Actor,
  amount: Money,
): PushMessage {
  return {
    title: `${firstName(actor.actorName)} te recuerda una deuda 💸`,
    body: `${firstName(actor.actorName)} te recuerda que le pases los ${formatMoney(amount)} que le debés.`,
    url: actorProfile(actor),
  }
}

export function pendingPaymentPushMessage(
  actor: Actor,
  amount: Money,
): PushMessage {
  return {
    title: "Pago pendiente",
    body: `${firstName(actor.actorName)} dice que te pagó ${formatMoney(amount)}.`,
    url: actorProfile(actor),
  }
}

export function confirmedPaymentPushMessage(
  actor: Actor,
  amount: Money,
): PushMessage {
  return {
    title: "Pago confirmado",
    body: `${firstName(actor.actorName)} confirmó tu pago de ${formatMoney(amount)}.`,
    url: actorProfile(actor),
  }
}

export function rejectedPaymentPushMessage(
  actor: Actor,
  amount: Money,
): PushMessage {
  return {
    title: "Pago rechazado",
    body: `${firstName(actor.actorName)} rechazó tu pago de ${formatMoney(amount)}.`,
    url: actorProfile(actor),
  }
}

/** Una solicitud de amistad se resuelve en el listado, no en un perfil. */
export function friendRequestPushMessage(actorName: string): PushMessage {
  return {
    title: "Solicitud de amistad",
    body: `${firstName(actorName)} quiere agregarte como amigo.`,
    url: "/personas",
  }
}

/**
 * El cuerpo lo arma `expenseNotificationBody` para que el push y la
 * notificación interna digan exactamente lo mismo.
 */
export function newExpensePushMessage(
  gatheringId: string,
  body: string,
): PushMessage {
  return { title: "Nuevo gasto", body, url: `/juntadas/${gatheringId}` }
}

export function gatheringClosedPushMessage(
  gatheringId: string,
  actorName: string,
): PushMessage {
  return {
    title: "Juntada cerrada",
    body: `${firstName(actorName)} cerró la juntada. Las deudas de sus gastos quedaron saldadas.`,
    url: `/juntadas/${gatheringId}`,
  }
}