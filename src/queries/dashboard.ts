import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"
import type { UserSummary } from "@/queries/friendships"
import { netBalancesForUser, type NetBalances } from "@/queries/transactions"

const ZERO = new Prisma.Decimal(0)

const userSummary = {
  id: true,
  name: true,
  username: true,
  avatar: true,
} as const

export type ConfirmationItem = {
  id: string
  amount: Prisma.Decimal
  currency: string
  payer: UserSummary
}

export type DashboardSummary = {
  owed: Prisma.Decimal
  owe: Prisma.Decimal
  toConfirm: number
  confirmations: ConfirmationItem[]
}

/**
 * Resume los balances netos ya calculados. Es la FUNCIÓN pura detrás de las
 * StatCards, para que el resumen y la lista de "Cuentas pendientes" se puedan
 * afirmar contra el mismo `Map` y no contra dos lecturas distintas.
 */
export function summarizeBalances(
  balances: NetBalances,
): Omit<DashboardSummary, "toConfirm" | "confirmations"> {
  let owed = ZERO
  let owe = ZERO
  for (const net of balances.values()) {
    if (net.gt(0)) owed = owed.plus(net)
    else if (net.lt(0)) owe = owe.plus(net.abs())
  }
  return { owed, owe }
}

/**
 * Pagos PENDING cuya confirmación espera `userId`, en UNA sola query con el
 * remitente (`debtor`, quien registró el pago) poblado: sin N+1 ni lecturas
 * por fila. Es la fuente única de "Por confirmar" y de la Card del Dashboard.
 */
export async function getIncomingConfirmations(
  userId: string,
): Promise<ConfirmationItem[]> {
  const rows = await prisma.transaction.findMany({
    where: {
      type: "PAYMENT",
      status: "PENDING",
      pendingConfirmationFromId: userId,
    },
    select: {
      id: true,
      amount: true,
      currency: true,
      debtor: { select: userSummary },
    },
    orderBy: { createdAt: "desc" },
  })

  return rows.map((row) => ({
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    payer: row.debtor,
  }))
}

/**
 * Resumen del Dashboard:
 * - owed: suma de balances positivos por amigo (te deben).
 * - owe:  suma de valores absolutos de balances negativos por amigo (debés).
 * - toConfirm / confirmations: pagos PENDING donde el usuario es receptor.
 *   `toConfirm` se deriva de `confirmations.length` (misma query): única
 *   fuente de verdad entre la StatCard y la Card de Confirmaciones.
 * No compensa deudas entre sí ni mezcla categorías.
 *
 * Los balances salen de `netBalancesForUser`, que va envuelto en `cache()` de
 * React: en el mismo render, `getFriends` usa exactamente el mismo `Map`, así
 * que las StatCards y "Cuentas pendientes" son siempre coherentes entre sí y
 * cuestan una sola lectura.
 */
export async function getDashboardSummary(
  userId: string,
): Promise<DashboardSummary> {
  const [balances, confirmations] = await Promise.all([
    netBalancesForUser(userId),
    getIncomingConfirmations(userId),
  ])

  return {
    ...summarizeBalances(balances),
    toConfirm: confirmations.length,
    confirmations,
  }
}
