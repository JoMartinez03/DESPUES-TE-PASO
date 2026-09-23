import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"

const ZERO = new Prisma.Decimal(0)

export async function getDashboardSummary(userId: string) {
  const [owedAggregate, oweAggregate, toConfirmCount] = await Promise.all([
    prisma.transaction.aggregate({
      where: { creditorId: userId, status: "CONFIRMED" },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { debtorId: userId, status: "CONFIRMED" },
      _sum: { amount: true },
    }),
    prisma.transaction.count({
      where: { pendingConfirmationFromId: userId, status: "PENDING" },
    }),
  ])

  return {
    owed: owedAggregate._sum.amount ?? ZERO,
    owe: oweAggregate._sum.amount ?? ZERO,
    toConfirm: toConfirmCount,
  }
}