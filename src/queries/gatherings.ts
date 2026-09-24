import { Prisma } from "@/generated/prisma"
import { prisma } from "@/lib/prisma"
import { sumSigned } from "@/lib/transactions"

const ZERO = new Prisma.Decimal(0)

const userSummary = {
  id: true,
  name: true,
  username: true,
  avatar: true,
} as const

export type UserSummary = {
  id: string
  name: string
  username: string
  avatar: string | null
}

export type GatheringCard = {
  id: string
  name: string
  date: Date
  participantCount: number
  expenseCount: number
  total: Prisma.Decimal
}

export type ExpenseShareView = {
  userId: string
  name: string
  username: string
  avatar: string | null
  shareAmount: Prisma.Decimal
}

export type ExpenseView = {
  id: string
  title: string
  amount: Prisma.Decimal
  splitType: "EQUAL" | "CUSTOM"
  currency: string
  createdAt: Date
  payer: UserSummary
  creator: UserSummary
  participants: ExpenseShareView[]
}

export type GatheringView = {
  id: string
  name: string
  date: Date
  createdAt: Date
  creatorId: string
  creator: UserSummary
  participants: Array<UserSummary & { joinedAt: Date }>
  expenses: ExpenseView[]
}

/**
 * Juntadas en las que participa `userId`, ordenadas por fecha más reciente.
 * Totales y conteos resueltos en una sola consulta (sin N+1).
 */
export async function getGatheringsForUser(userId: string): Promise<GatheringCard[]> {
  const rows = await prisma.gathering.findMany({
    where: { participants: { some: { userId } } },
    select: {
      id: true,
      name: true,
      date: true,
      participants: { select: { userId: true } },
      expenses: { select: { amount: true } },
    },
    orderBy: { date: "desc" },
  })

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    date: row.date,
    participantCount: row.participants.length,
    expenseCount: row.expenses.length,
    total: row.expenses.reduce((acc, expense) => acc.plus(expense.amount), ZERO),
  }))
}

/**
 * Una juntada completa con creador, participantes y gastos. Devuelve `null` si
 * el id no existe o si `viewerId` no participa de la juntada.
 */
export async function getGatheringView(
  id: string,
  viewerId: string,
): Promise<GatheringView | null> {
  const gathering = await prisma.gathering.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      date: true,
      createdAt: true,
      creatorId: true,
      creator: { select: userSummary },
      participants: {
        select: {
          createdAt: true,
          user: { select: userSummary },
        },
      },
      expenses: {
        select: {
          id: true,
          title: true,
          amount: true,
          splitType: true,
          currency: true,
          createdAt: true,
          payer: { select: userSummary },
          creator: { select: userSummary },
          participants: {
            select: {
              shareAmount: true,
              user: { select: userSummary },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!gathering) return null
  if (!gathering.participants.some((participant) => participant.user.id === viewerId)) {
    return null
  }

  return {
    id: gathering.id,
    name: gathering.name,
    date: gathering.date,
    createdAt: gathering.createdAt,
    creatorId: gathering.creatorId,
    creator: gathering.creator,
    participants: gathering.participants.map((participant) => ({
      ...participant.user,
      joinedAt: participant.createdAt,
    })),
    expenses: gathering.expenses.map((expense) => ({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      splitType: expense.splitType,
      currency: expense.currency,
      createdAt: expense.createdAt,
      payer: expense.payer,
      creator: expense.creator,
      participants: expense.participants.map((participant) => ({
        userId: participant.user.id,
        name: participant.user.name,
        username: participant.user.username,
        avatar: participant.user.avatar,
        shareAmount: participant.shareAmount,
      })),
    })),
  }
}

/**
 * Balance PERSONAL dentro de una juntada, solo con las DEBT derivadas de sus
 * gastos (expenseId no nulo). Convención igual a Issue 3:
 *   > 0 te deben · < 0 debés · 0 estás al día.
 */
export async function getGatheringBalanceForUser(
  gatheringId: string,
  userId: string,
): Promise<Prisma.Decimal> {
  const expenses = await prisma.expense.findMany({
    where: { gatheringId },
    select: { id: true },
  })
  if (expenses.length === 0) return ZERO

  const rows = await prisma.transaction.findMany({
    where: {
      status: "CONFIRMED",
      expenseId: { in: expenses.map((expense) => expense.id) },
      OR: [{ debtorId: userId }, { creditorId: userId }],
    },
    select: { debtorId: true, creditorId: true, amount: true },
  })

  return sumSigned(
    rows.map((row) => ({ ...row, type: "DEBT" as const })),
    userId,
  )
}

/**
 * Total gastado en una juntada: SUM(Expense.amount). Nunca desde Transactions.
 */
export async function getGatheringTotal(gatheringId: string): Promise<Prisma.Decimal> {
  const aggregation = await prisma.expense.aggregate({
    where: { gatheringId },
    _sum: { amount: true },
  })
  return aggregation._sum.amount ?? ZERO
}