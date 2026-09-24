import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"
import {
  maxPayableFrom,
  sumSigned,
  type BalanceRow,
} from "@/lib/transactions"

const ZERO = new Prisma.Decimal(0)

type DB = Prisma.TransactionClient

export type NetBalances = Map<string, Prisma.Decimal>

/**
 * Balance neto de `userId` con cada uno de sus contactos.
 * Solo considera movimientos CONFIRMED. Ver convención en src/lib/transactions.ts.
 */
export async function netBalancesForUser(userId: string): Promise<NetBalances> {
  const rows = await prisma.transaction.findMany({
    where: {
      status: "CONFIRMED",
      OR: [{ debtorId: userId }, { creditorId: userId }],
    },
    select: { type: true, debtorId: true, creditorId: true, amount: true },
  })

  const grouped = new Map<string, BalanceRow[]>()
  for (const row of rows) {
    const friendId = row.debtorId === userId ? row.creditorId : row.debtorId
    const list = grouped.get(friendId)
    if (list) list.push(row)
    else grouped.set(friendId, [row])
  }

  const result: NetBalances = new Map()
  for (const [friendId, list] of grouped) {
    result.set(friendId, sumSigned(list, userId))
  }
  return result
}

export async function primeBalanceBetween(
  db: DB,
  userId: string,
  friendId: string,
): Promise<Prisma.Decimal> {
  const rows = await db.transaction.findMany({
    where: {
      status: "CONFIRMED",
      OR: [
        { debtorId: userId, creditorId: friendId },
        { debtorId: friendId, creditorId: userId },
      ],
    },
    select: { type: true, debtorId: true, creditorId: true, amount: true },
  })
  return sumSigned(rows, userId)
}

export async function balanceBetween(
  userId: string,
  friendId: string,
): Promise<Prisma.Decimal> {
  return primeBalanceBetween(prisma, userId, friendId)
}

export async function primePendingOutgoingPaymentsSum(
  db: DB,
  userId: string,
  friendId: string,
): Promise<Prisma.Decimal> {
  const agg = await db.transaction.aggregate({
    where: {
      type: "PAYMENT",
      status: "PENDING",
      debtorId: userId,
      creditorId: friendId,
    },
    _sum: { amount: true },
  })
  return agg._sum.amount ?? ZERO
}

export async function pendingOutgoingPaymentsSum(
  userId: string,
  friendId: string,
): Promise<Prisma.Decimal> {
  return primePendingOutgoingPaymentsSum(prisma, userId, friendId)
}

export async function maxPayableBetween(
  userId: string,
  friendId: string,
): Promise<Prisma.Decimal> {
  const [balance, pending] = await Promise.all([
    balanceBetween(userId, friendId),
    pendingOutgoingPaymentsSum(userId, friendId),
  ])
  return maxPayableFrom(balance, pending)
}

export type MovementStatus = "PENDING" | "CONFIRMED" | "REJECTED"

export type Movement = {
  id: string
  type: "DEBT" | "PAYMENT"
  status: MovementStatus
  description: string
  amount: Prisma.Decimal
  currency: string
  debtorId: string
  creditorId: string
  occurredAt: Date
  createdAt: Date
  expense: {
    title: string
    gathering: { name: string }
  } | null
}

export async function getTransactionHistory(
  userId: string,
  friendId: string,
): Promise<Movement[]> {
  return prisma.transaction.findMany({
    where: {
      OR: [
        { debtorId: userId, creditorId: friendId },
        { debtorId: friendId, creditorId: userId },
      ],
    },
    select: {
      id: true,
      type: true,
      status: true,
      description: true,
      amount: true,
      currency: true,
      debtorId: true,
      creditorId: true,
      occurredAt: true,
      createdAt: true,
      expense: {
        select: {
          title: true,
          gathering: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  })
}

export type PendingPaymentDirection = "incoming" | "outgoing"

export type PendingPayment = {
  id: string
  direction: PendingPaymentDirection
  amount: Prisma.Decimal
  currency: string
  description: string
  createdAt: Date
}

export async function getPendingPaymentsBetween(
  userId: string,
  friendId: string,
): Promise<PendingPayment[]> {
  const rows = await prisma.transaction.findMany({
    where: {
      type: "PAYMENT",
      status: "PENDING",
      OR: [
        { debtorId: userId, creditorId: friendId },
        { debtorId: friendId, creditorId: userId },
      ],
    },
    select: {
      id: true,
      debtorId: true,
      amount: true,
      currency: true,
      description: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return rows.map((row) => ({
    id: row.id,
    direction: row.debtorId === userId ? ("outgoing" as const) : ("incoming" as const),
    amount: row.amount,
    currency: row.currency,
    description: row.description,
    createdAt: row.createdAt,
  }))
}

export { ZERO }