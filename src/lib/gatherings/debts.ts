import { Prisma } from "@/generated/prisma"
import { formatMoney } from "@/lib/format"
import {
  centsToAmountString,
  parseMoneyToCents,
  splitEqualCents,
  sumCents,
} from "@/lib/gatherings/money"

type Db = Prisma.TransactionClient

export type ShareRow = {
  userId: string
  shareAmount: Prisma.Decimal
}

export type ShareQuery =
  | { type: "EQUAL"; participantIds: string[] }
  | {
      type: "CUSTOM"
      participantIds: string[]
      custom: Record<string, string>
    }

/**
 * Construye los shares reales de un gasto usando la regla de división de
 * `money.ts`. Para EQUAL recalcula el reparto en centavos; para CUSTOM valida
 * que la suma de las partes coincida EXACTAMENTE con el total.
 *
 * Lanza `share_missing` si falta una parte, o `share_mismatch` si la suma no
 * cierra. La suma de los shareAmount es siempre exactamente el monto.
 */
export function buildExpenseShares(
  amount: Prisma.Decimal,
  query: ShareQuery,
): ShareRow[] {
  const totalCents = parseMoneyToCents(amount.toFixed(2))

  if (query.type === "EQUAL") {
    const centsByUser = splitEqualCents(totalCents, query.participantIds)
    const rows: ShareRow[] = []
    for (const [userId, cents] of centsByUser) {
      rows.push({
        userId,
        shareAmount: new Prisma.Decimal(centsToAmountString(cents)),
      })
    }
    return rows
  }

  const entries = query.participantIds.map((userId) => {
    const value = query.custom[userId]
    if (value === undefined) throw new Error("share_missing")
    return { userId, cents: parseMoneyToCents(value) }
  })

  const assigned = sumCents(entries.map((entry) => entry.cents))
  if (assigned !== totalCents) throw new Error("share_mismatch")

  return entries.map(({ userId, cents }) => ({
    userId,
    shareAmount: new Prisma.Decimal(centsToAmountString(cents)),
  }))
}

/**
 * Genera las DEBT CONFIRMED derivadas de un gasto.
 *
 * - Un shareAmount en 0 no genera deuda.
 * - Un participante que es el pagador absorbe su share (no genera deuda
 *   hacia sí mismo).
 * - Solo los demás participantes quedan debiéndole al pagador.
 * - El actor (quien carga el gasto en la app) es el creatorId, que puede
 *   NO coincidir con el pagador.
 */
export async function createExpenseDebts(
  db: Db,
  params: {
    expenseId: string
    payerId: string
    actorId: string
    title: string
    shares: ShareRow[]
  },
): Promise<void> {
  const now = new Date()
  for (const share of params.shares) {
    if (share.shareAmount.lte(0)) continue
    if (share.userId === params.payerId) continue
    await db.transaction.create({
      data: {
        creatorId: params.actorId,
        debtorId: share.userId,
        creditorId: params.payerId,
        amount: share.shareAmount,
        currency: "ARS",
        description: params.title,
        type: "DEBT",
        status: "CONFIRMED",
        expenseId: params.expenseId,
        pendingConfirmationFromId: params.payerId,
        confirmedAt: now,
      },
    })
  }
}

/**
 * Borra SOLO las DEBT derivadas de un gasto. No toca pagos ni deudas manuales.
 */
export async function deleteExpenseDebts(
  db: Db,
  expenseId: string,
): Promise<void> {
  await db.transaction.deleteMany({
    where: { expenseId, type: "DEBT" },
  })
}

/** Cuerpo de la notificación a nivel Expense (una por participante, sin spam). */
export function expenseNotificationBody(
  actorName: string,
  title: string,
  amount: Prisma.Decimal,
  gatheringName: string,
): string {
  return `${actorName} agregó '${title}' por ${formatMoney(amount)} en ${gatheringName}`
}