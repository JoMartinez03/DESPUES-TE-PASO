import { Prisma } from "@/generated/prisma"
import { prisma } from "@/lib/prisma"
import {
  historicalEconomicsFromExpenses,
  type DebtGroupRow,
  type GatheringEconomics,
} from "@/lib/gatherings/economics"

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
  status: "ACTIVE" | "CLOSED"
  closedAt: Date | null
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
  closedAt: Date | null
  status: "ACTIVE" | "CLOSED"
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
      status: true,
      closedAt: true,
      participants: { select: { userId: true } },
      expenses: { select: { amount: true } },
    },
    orderBy: { date: "desc" },
  })

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    date: row.date,
    status: row.status,
    closedAt: row.closedAt,
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
      closedAt: true,
      status: true,
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
    closedAt: gathering.closedAt,
    status: gathering.status,
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
 * DEBT derivadas de una juntada, agrupadas por par dirigido, para balancearlas
 * con `economicsFromDebtGroups`.
 *
 * Los `expenseIds` ya vienen cargados por `getGatheringView` (son los gastos de
 * la juntada): no se vuelven a leer las cabeceras ni los gastos. Con `expenseIds`
 * vacío no hay DEBT que agrupar: devuelve `[]` sin consultar nada.
 */
export async function getGatheringDebtGroups(
  expenseIds: string[],
): Promise<DebtGroupRow[]> {
  if (expenseIds.length === 0) return []

  return (await prisma.transaction.groupBy({
    by: ["debtorId", "creditorId"],
    where: {
      type: "DEBT",
      status: "CONFIRMED",
      expenseId: { in: expenseIds },
    },
    _sum: { amount: true },
  })) as unknown as DebtGroupRow[]
}

/**
 * Balance histórico de una juntada CERRADA, reconstruido desde
 * `Expense` + `ExpenseParticipant` en lugar de `Transaction`.
 *
 * Al cerrar, las DEBT derivadas se saldan y se borran para que dejen de
 * afectar los balances generales (regla de producto). Si reconstruyéramos la
 * juntada cerrada desde `Transaction`, el balance quedaría en cero para todos y
 * se perdería la información de quién pagó qué. Los gastos son la fuente
 * histórica, así que el panel sigue mostrando la posición real de cada
 * participante, sin efecto sobre los balances.
 */
export async function getHistoricalGatheringEconomics(
  gatheringId: string,
): Promise<GatheringEconomics> {
  const [participants, expenses] = await Promise.all([
    prisma.gatheringParticipant.findMany({
      where: { gatheringId },
      select: { userId: true },
    }),
    prisma.expense.findMany({
      where: { gatheringId },
      select: {
        payerId: true,
        amount: true,
        participants: { select: { userId: true, shareAmount: true } },
      },
    }),
  ])

  return historicalEconomicsFromExpenses({
    participantUserIds: participants.map((participant) => participant.userId),
    expenses,
  })
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
