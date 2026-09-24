"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatMoney } from "@/lib/format"
import { maxPayableFrom, toDecimal } from "@/lib/transactions"
import { userIdSchema, type UserIdInput } from "@/lib/validations/friendship"
import {
  createDebtSchema,
  registerPaymentSchema,
  transactionIdSchema,
  type CreateDebtInput,
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

function firstName(name: string): string {
  return name.split(" ")[0] ?? name
}

function revalidateEconomicRoutes(friendId: string) {
  revalidatePath("/dashboard")
  revalidatePath("/personas")
  revalidatePath(`/personas/${friendId}`)
  revalidatePath("/", "layout")
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
  return {
    ok: true,
    message:
      paidBy === "me"
        ? `${firstName(friend.name)} te deberá ${formatMoney(amount)}`
        : `Le deberás ${formatMoney(amount)} a ${firstName(friend.name)}`,
  }
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
  return result
}

async function resolvePayment(
  input: TransactionIdInput,
  target: "confirm" | "reject",
): Promise<
  | { status: "done"; peerId: string }
  | { status: "not_found" | "forbidden" | "already" | "conflict" }
> {
  const selfId = await sessionUserId()
  if (!selfId) return { status: "forbidden" }

  const parsed = transactionIdSchema.safeParse(input)
  if (!parsed.success) return { status: "not_found" }

  const me = await selfName(selfId)
  const txId = parsed.data.transactionId

  return prisma.$transaction(async (tx) => {
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
    await tx.transaction.update({
      where: { id: txId },
      data:
        target === "confirm"
          ? { status: "CONFIRMED", confirmedAt: now }
          : { status: "REJECTED", rejectedAt: now },
    })

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

    return { status: "done" as const, peerId: payment.debtorId }
  })
}

export async function confirmPayment(input: TransactionIdInput): Promise<ActionResult> {
  const result = await resolvePayment(input, "confirm")
  if (result.status === "done") revalidateEconomicRoutes(result.peerId)
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
  if (result.status === "done") revalidateEconomicRoutes(result.peerId)
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