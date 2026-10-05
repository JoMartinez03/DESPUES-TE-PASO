import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"
import { netBalancesForUser, type NetBalances } from "@/queries/transactions"

const ZERO = new Prisma.Decimal(0)

export type DashboardSummary = {
  owed: Prisma.Decimal
  owe: Prisma.Decimal
  toConfirm: number
}

/**
 * Resume los balances netos ya calculados. Es la FUNCIÓN pura detrás de las
 * StatCards, para que el resumen y la lista de "Cuentas pendientes" se puedan
 * afirmar contra el mismo `Map` y no contra dos lecturas distintas.
 */
export function summarizeBalances(balances: NetBalances): Omit<DashboardSummary, "toConfirm"> {
  let owed = ZERO
  let owe = ZERO
  for (const net of balances.values()) {
    if (net.gt(0)) owed = owed.plus(net)
    else if (net.lt(0)) owe = owe.plus(net.abs())
  }
  return { owed, owe }
}

/**
 * Resumen del Dashboard:
 * - owed: suma de balances positivos por amigo (te deben).
 * - owe:  suma de valores absolutos de balances negativos por amigo (debés).
 * - toConfirm: pagos PENDING donde el usuario es receptor.
 * No compensa deudas entre sí ni mezcla categorías.
 *
 * Los balances salen de `netBalancesForUser`, que va envuelto en `cache()` de
 * React: en el mismo render, `getFriends` usa exactamente el mismo `Map`, así
 * que las StatCards y "Cuentas pendientes" son siempre coherentes entre sí y
 * cuestan una sola lectura.
 */
export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
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

  return { ...summarizeBalances(balances), toConfirm: toConfirmCount }
}
