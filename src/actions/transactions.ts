"use server"

import { revalidatePath } from "next/cache"
import { Prisma } from "@/generated/prisma"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatMoney } from "@/lib/format"
import { firstName } from "@/lib/names"
import {
  confirmedPaymentPushMessage,
  debtPushMessage,
  pendingPaymentPushMessage,
  rejectedPaymentPushMessage,
  type PushMessage,
} from "@/lib/push/messages"
import { sendPushToUser } from "@/lib/push/send"
import { maxPayableFrom, toDecimal } from "@/lib/transactions"
import { userIdSchema, type UserIdInput } from "@/lib/validations/friendship"
import {
  createDebtSchema,
  editDebtSchema,
  registerPaymentSchema,
  transactionIdSchema,
  type CreateDebtInput,
  type EditDebtInput,
  type RegisterPaymentInput,
  type TransactionIdInput,
} from "@/lib/validations/transactions"
import { getFriendshipBetween } from "@/queries/friendships"
import {
  primeBalanceBetween,
  primePendingOutgoingPaymentsSum,
} from "@/queries/transactions"

type ActionResult =
  | { ok: true; message: string }
  | { ok: false; code: string; message: string }

async function sessionUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}

async function selfName(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  })
  return user?.name ?? "Alguien"
}

/**
 * Verifica amistad ACCEPTED entre `selfId` y `friendId` y devuelve el amigo.
 */
async function requireAcceptedFriend(
  selfId: string,
  friendId: string,
): Promise<{ id: string; name: string } | null> {
  if (friendId === selfId) return null
  const friendship = await getFriendshipBetween(selfId, friendId)
  if (!friendship) return null
  const friend = await prisma.user.findUnique({
    where: { id: friendId },
    select: { id: true, name: true },
  })
  return friend
}

async function lockFriendshipPair(
  tx: Prisma.TransactionClient,
  selfId: string,
  friendId: string,
): Promise<boolean> {
  const rows = await tx.$queryRaw<{ id: string }[]>`
    SELECT "id"
    FROM "friendships"
    WHERE "status" = 'ACCEPTED'
      AND (
        ("requesterId" = ${selfId} AND "addresseeId" = ${friendId})
        OR ("requesterId" = ${friendId} AND "addresseeId" = ${selfId})
      )
    ORDER BY "id"
    FOR UPDATE
  `
  return rows.length > 0
}

function revalidateEconomicRoutes(friendId: string) {
  revalidatePath("/dashboard")
  revalidatePath("/personas")
  revalidatePath(`/personas/${friendId}`)
}

export async function createDebt(
  input: UserIdInput & CreateDebtInput,
): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) return { ok: false, code: "unauthorized", message: "No estás autenticado" }

  const friendParsed = userIdSchema.safeParse(input)
  const dataParsed = createDebtSchema.safeParse(input)
  if (!friendParsed.success || !dataParsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }

  const friend = await requireAcceptedFriend(selfId, friendParsed.data.userId)
  if (!friend) {
    return { ok: false, code: "not_found", message: "El usuario no existe o no son amigos" }
  }

  const { description, paidBy } = dataParsed.data
  const amount = toDecimal(dataParsed.data.amount)
  const me = await selfName(selfId)

  // Los ids deudor/acreedor se derivan de la sesión y la opción elegida,
  // nunca de valores enviados por el cliente.
  const creditorId = paidBy === "me" ? selfId : friend.id
  const debtorId = paidBy === "me" ? friend.id : selfId

  const result = await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        creatorId: selfId,
        debtorId,
        creditorId,
        amount,
        currency: "ARS",
        description,
        type: "DEBT",
        status: "CONFIRMED",
        pendingConfirmationFromId: creditorId,
        confirmedAt: new Date(),
      },
      select: { id: true },
    })

    // Snapshot histórico: embebe el nombre al momento de crearse; no se reescribe.
    const body =
      paidBy === "me"
        ? `${me} agregó un gasto de ${formatMoney(amount)}: ${description}. Le debés a ${me}.`
        : `${me} registró un gasto de ${formatMoney(amount)}: ${description}. Te debe ${me}.`

    await tx.notification.create({
      data: {
        userId: friend.id,
        type: "GENERAL",
        title: "Deuda registrada",
        body,
        relatedTransactionId: transaction.id,
      },
    })

    return transaction.id
  })

  void result
  revalidateEconomicRoutes(friend.id)
  // Efecto secundario: la deuda ya está commiteada, así que un push fallido no
  // la revierte. El actor es quien registra (la sesión), no el deudor ni el
  // acreedor: los dos pueden ser el amigo.
  await sendPushToUser(
    friend.id,
    debtPushMessage({ actorId: selfId, actorName: me }, amount),
  )
  return {
    ok: true,
    message:
      paidBy === "me"
        ? `${firstName(friend.name)} te deberá ${formatMoney(amount)}`
        : `Le deberás ${formatMoney(amount)} a ${firstName(friend.name)}`,
  }
}

/**
 * Corrige el concepto y/o el monto de una deuda manual.
 *
 * La autorización vive en el SERVIDOR, dentro del WHERE de la propia
 * actualización: solo matchea si la fila existe, si la creó el usuario
 * autenticado (`creatorId`), si es `type = DEBT` y si es manual
 * (`expenseId = null`). Un PAYMENT, una deuda de juntada o una deuda ajena
 * no matchea => `count !== 1` => forbidden.
 *
 * Actualiza la MISMA fila (mismo id): no crea otra deuda y deja intactos
 * debtor, creditor, type, status y creator por construcción. Únicos campos
 * mutables: description y amount, con las mismas validaciones monetarias
 * que `createDebt` (comparten `moneyString` y `debtDescription`).
 */
export async function updateDebt(input: EditDebtInput): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) return { ok: false, code: "unauthorized", message: "No estás autenticado" }

  const parsed = editDebtSchema.safeParse(input)
  if (!parsed.success) return { ok: false, code: "invalid", message: "Datos inválidos" }

  const { transactionId, description } = parsed.data
  const amount = toDecimal(parsed.data.amount)

  const row = await prisma.transaction.findUnique({
    where: { id: transactionId },
    select: { debtorId: true, creditorId: true },
  })
  if (!row) return { ok: false, code: "not_found", message: "La deuda no existe" }

  const updated = await prisma.transaction.updateMany({
    where: {
      id: transactionId,
      creatorId: selfId,
      type: "DEBT",
      expenseId: null,
    },
    data: { description, amount },
  })
  if (updated.count !== 1) {
    return {
      ok: false,
      code: "forbidden",
      message: "Solo podés editar deudas que creaste",
    }
  }

  // La contraparte: el otro integrante del par, para revalidar su ficha también.
  const peerId = row.debtorId === selfId ? row.creditorId : row.debtorId
  revalidateEconomicRoutes(peerId)
  return { ok: true, message: "Deuda actualizada" }
}

/**
 * Elimina una deuda manual cargada por error.
 *
 * Aplica EXACTAMENTE la misma regla de autoría que `updateDebt` (misma fuente
 * de verdad): el `where` compuesto de la propia operación exige que la fila
 * exista, que la creó el usuario autenticado (`creatorId = selfId`), que sea
 * `type = DEBT` y que sea manual (`expenseId = null`). El cliente sólo envía
 * `transactionId`: debtor, creditor, monto o creatorId jamás llegan desde el
 * input. Si el where no matchea => `count !== 1` => forbidden.
 *
 * No crea transacciones compensatorias: es la corrección de un registro mal
 * cargado. El balance, el historial, el Dashboard y maxPayable se recalculan
 * solos porque se derivan de las filas de `transactions` (Etapa 1) y la
 * revalidación de rutas (Etapa 2) refresca las lecturas cacheadas.
 * Las notificaciones asociadas caen en cascada por la FK de la base.
 */
export async function deleteDebt(input: TransactionIdInput): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) return { ok: false, code: "unauthorized", message: "No estás autenticado" }

  const parsed = transactionIdSchema.safeParse(input)
  if (!parsed.success) return { ok: false, code: "invalid", message: "Datos inválidos" }

  const { transactionId } = parsed.data

  const row = await prisma.transaction.findUnique({
    where: { id: transactionId },
    select: { debtorId: true, creditorId: true },
  })
  if (!row) return { ok: false, code: "not_found", message: "La deuda no existe" }

  const deleted = await prisma.transaction.deleteMany({
    where: {
      id: transactionId,
      creatorId: selfId,
      type: "DEBT",
      expenseId: null,
    },
  })
  if (deleted.count !== 1) {
    return {
      ok: false,
      code: "forbidden",
      message: "Solo podés eliminar deudas que creaste",
    }
  }

  const peerId = row.debtorId === selfId ? row.creditorId : row.debtorId
  revalidateEconomicRoutes(peerId)
  return { ok: true, message: "Deuda eliminada" }
}

export async function registerPayment(
  input: UserIdInput & RegisterPaymentInput,
): Promise<ActionResult> {
  const selfId = await sessionUserId()
  if (!selfId) return { ok: false, code: "unauthorized", message: "No estás autenticado" }

  const friendParsed = userIdSchema.safeParse(input)
  const dataParsed = registerPaymentSchema.safeParse(input)
  if (!friendParsed.success || !dataParsed.success) {
    return { ok: false, code: "invalid", message: "Datos inválidos" }
  }

  const friend = await requireAcceptedFriend(selfId, friendParsed.data.userId)
  if (!friend) {
    return { ok: false, code: "not_found", message: "El usuario no existe o no son amigos" }
  }

  const amount = toDecimal(dataParsed.data.amount)
  const me = await selfName(selfId)

  const result = await prisma.$transaction(async (tx) => {
    const friendshipLocked = await lockFriendshipPair(tx, selfId, friend.id)
    if (!friendshipLocked) {
      return { ok: false as const, code: "not_found", message: "El usuario no existe o no son amigos" }
    }

    const [balance, pendingSum] = await Promise.all([
      primeBalanceBetween(tx, selfId, friend.id),
      primePendingOutgoingPaymentsSum(tx, selfId, friend.id),
    ])
    const max = maxPayableFrom(balance, pendingSum)

    if (max.lte(0)) {
      return { ok: false as const, code: "no_debt", message: "No tenés deuda con este amigo" }
    }
    if (amount.gt(max)) {
      return {
        ok: false as const,
        code: "over_limit",
        message: `Supera el máximo. Podés pagar hasta ${formatMoney(max)}.`,
      }
    }

    const transaction = await tx.transaction.create({
      data: {
        creatorId: selfId,
        debtorId: selfId,
        creditorId: friend.id,
        amount,
        currency: "ARS",
        description: "Pago",
        type: "PAYMENT",
        status: "PENDING",
        pendingConfirmationFromId: friend.id,
      },
      select: { id: true },
    })

    await tx.notification.create({
      data: {
        userId: friend.id,
        type: "TRANSACTION_PENDING",
        title: "Pago pendiente",
        body: `${me} dice que te pagó ${formatMoney(amount)}`,
        relatedTransactionId: transaction.id,
      },
    })

    return { ok: true as const, message: `Pago de ${formatMoney(amount)} registrado` }
  })

  revalidateEconomicRoutes(friend.id)
  if (!result.ok) return result
  // El pago ya quedó registrado: el push es solo el aviso de que hay algo que
  // confirmar.
  await sendPushToUser(
    friend.id,
    pendingPaymentPushMessage({ actorId: selfId, actorName: me }, amount),
  )
  return result
}

async function resolvePayment(
  input: TransactionIdInput,
  target: "confirm" | "reject",
): Promise<
  | { status: "done"; peerId: string; push: PushMessage }
  | { status: "not_found" | "forbidden" | "already" | "conflict" }
> {
  const selfId = await sessionUserId()
  if (!selfId) return { status: "forbidden" }

  const parsed = transactionIdSchema.safeParse(input)
  if (!parsed.success) return { status: "not_found" }

  const me = await selfName(selfId)
  const txId = parsed.data.transactionId

  return prisma.$transaction(async (tx) => {
    const lockedRows = await tx.$queryRaw<{ id: string }[]>`
      SELECT "id" FROM "transactions" WHERE "id" = ${txId} FOR UPDATE
    `
    if (lockedRows.length === 0) return { status: "not_found" as const }

    const payment = await tx.transaction.findUnique({
      where: { id: txId },
      select: {
        id: true,
        type: true,
        status: true,
        amount: true,
        debtorId: true,
        pendingConfirmationFromId: true,
      },
    })

    if (!payment) return { status: "not_found" as const }
    if (payment.type !== "PAYMENT" || payment.pendingConfirmationFromId !== selfId) {
      return { status: "forbidden" as const }
    }

    const desired = target === "confirm" ? "CONFIRMED" : "REJECTED"
    if (payment.status === desired) return { status: "already" as const }
    if (payment.status !== "PENDING") return { status: "conflict" as const }

    const now = new Date()
    const updated = await tx.transaction.updateMany({
      where: {
        id: txId,
        type: "PAYMENT",
        status: "PENDING",
        pendingConfirmationFromId: selfId,
      },
      data:
        target === "confirm"
          ? { status: "CONFIRMED", confirmedAt: now }
          : { status: "REJECTED", rejectedAt: now },
    })
    if (updated.count !== 1) return { status: "conflict" as const }

    await tx.notification.updateMany({
      where: { userId: selfId, relatedTransactionId: txId, read: false },
      data: { read: true },
    })

    await tx.notification.create({
      data: {
        userId: payment.debtorId,
        type: target === "confirm" ? "TRANSACTION_CONFIRMED" : "TRANSACTION_REJECTED",
        title: target === "confirm" ? "Pago confirmado" : "Pago rechazado",
        body:
          target === "confirm"
            ? `${me} confirmó tu pago de ${formatMoney(payment.amount)}`
            : `${me} rechazó tu pago de ${formatMoney(payment.amount)}`,
        relatedTransactionId: txId,
      },
    })

    // Quien confirma o rechaza es el acreedor (pendingConfirmationFromId), y
    // avisa al deudor. El mensaje usa SIEMPRE el nombre del actor (`me`), que
    // puede no coincidir con debtor/creditor.
    const actor = { actorId: selfId, actorName: me }
    const push =
      target === "confirm"
        ? confirmedPaymentPushMessage(actor, payment.amount)
        : rejectedPaymentPushMessage(actor, payment.amount)

    return { status: "done" as const, peerId: payment.debtorId, push }
  })
}

export async function confirmPayment(input: TransactionIdInput): Promise<ActionResult> {
  const result = await resolvePayment(input, "confirm")
  if (result.status === "done") {
    revalidateEconomicRoutes(result.peerId)
    await sendPushToUser(result.peerId, result.push)
  }
  if (result.status === "already") {
    return { ok: true, message: "El pago ya estaba confirmado" }
  }
  if (result.status === "not_found") {
    return { ok: false, code: "not_found", message: "El pago no existe" }
  }
  if (result.status === "forbidden") {
    return { ok: false, code: "forbidden", message: "Solo el receptor puede confirmar el pago" }
  }
  if (result.status === "conflict") {
    return { ok: false, code: "conflict", message: "El pago ya no está pendiente" }
  }
  return { ok: true, message: "Pago confirmado" }
}

export async function rejectPayment(input: TransactionIdInput): Promise<ActionResult> {
  const result = await resolvePayment(input, "reject")
  if (result.status === "done") {
    revalidateEconomicRoutes(result.peerId)
    await sendPushToUser(result.peerId, result.push)
  }
  if (result.status === "already") {
    return { ok: true, message: "El pago ya estaba rechazado" }
  }
  if (result.status === "not_found") {
    return { ok: false, code: "not_found", message: "El pago no existe" }
  }
  if (result.status === "forbidden") {
    return { ok: false, code: "forbidden", message: "Solo el receptor puede confirmar el pago" }
  }
  if (result.status === "conflict") {
    return { ok: false, code: "conflict", message: "El pago ya no está pendiente" }
  }
  return { ok: true, message: "Pago rechazado" }
}