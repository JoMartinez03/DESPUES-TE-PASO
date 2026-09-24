import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"
import { netBalancesForUser } from "@/queries/transactions"

const ZERO = new Prisma.Decimal(0)

/**
 * Resumen del Dashboard:
 * - owed: suma de balances positivos por amigo (te deben).
 * - owe:  suma de valores absolutos de balances negativos por amigo (debés).
 * - toConfirm: pagos PENDING donde el usuario es receptor.
 * No compensa deudas entre sí ni mezcla categorías.
 */
export async function getDashboardSummary(userId: string) {
  const [balances, toConfirmCount] = await Promise.all([
    netBalancesForUser(userId),
    prisma.transaction.count({
      where: {
        type: "PAYMENT",
        status: "PENDING",
        pendingConfirmationFromId: userId,
      },
    }),
  ])

  let owed = ZERO
  let owe = ZERO
  for (const net of balances.values()) {
    if (net.gt(0)) owed = owed.plus(net)
    else if (net.lt(0)) owe = owe.plus(net.abs())
  }

  return {
    owed,
    owe,
    toConfirm: toConfirmCount,
  }
}