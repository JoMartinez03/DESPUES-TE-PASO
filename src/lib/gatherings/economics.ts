import { Prisma } from "@/generated/prisma"
import type { PairDebtRow } from "@/lib/gatherings/pair-debts"
import {
  calculateSuggestedTransfers,
  type GatheringBalance as SettlementBalance,
  type SuggestedTransfer,
} from "@/lib/gatherings/settlement"

/**
 * Resultado económico de una juntada, en centavos enteros.
 *
 * `balanceCents` es la posición del ESE participante dentro de la juntada:
 *   > 0 le deben a ese participante · < 0 ese participante debe.
 * `pairDebts` son las DEBT de la juntada agrupadas por par dirigido, sin
 * netear (el panel "Tus pagos" las netea con `netPairDebtsFor`).
 */
export type GatheringEconomics =
  | {
      ok: true
      balances: SettlementBalance[]
      transfers: SuggestedTransfer[]
      pairDebts: PairDebtRow[]
    }
  | {
      ok: false
      code: "INCONSISTENT_BALANCE" | "INVALID_DATA"
      message: string
      totalBalanceCents: number
    }

/** Fila de `groupBy` de Transaction (DEBT derivadas agrupadas por par). */
export type DebtGroupRow = {
  debtorId: string
  creditorId: string
  _sum: { amount: Prisma.Decimal | null }
}

/**
 * Convierte un Prisma.Decimal a centavos enteros. Devuelve `null` si el valor
 * no admite una conversión exacta (más de 2 decimales) o excede un entero
 * seguro, para no perder ni inventar plata con aritmética de a centavo.
 */
function decimalToCents(value: Prisma.Decimal): number | null {
  const scaled = value.mul(100)
  const rounded = scaled.toDecimalPlaces(0)
  if (!scaled.equals(rounded)) return null
  const cents = rounded.toNumber()
  return Number.isSafeInteger(cents) ? cents : null
}

/**
 * Balance de una juntada ACTIVA desde las DEBT derivadas de sus gastos.
 *
 * Pura: recibe los ids de participantes (para inicializar los balances) y las
 * DEBT agrupadas por par YA leídas, y devuelve el mismo `GatheringEconomics`
 * que antes producía `getGatheringEconomics` (balances + transferencias
 * sugeridas + deudas por par). No consulta nada: quien llame decide de dónde
 * salen los datos (base real o `getGatheringView`).
 */
export function economicsFromDebtGroups(input: {
  participantUserIds: string[]
  groups: readonly DebtGroupRow[]
}): GatheringEconomics {
  const { participantUserIds, groups } = input

  const balancesByUser = new Map<string, number>(
    participantUserIds.map((userId) => [userId, 0]),
  )
  const balances: SettlementBalance[] = participantUserIds.map((userId) => ({
    userId,
    balanceCents: 0,
  }))
  const pairDebts: PairDebtRow[] = []

  for (const row of groups) {
    const amountCents = row._sum.amount ? decimalToCents(row._sum.amount) : null
    const debtorBalance = balancesByUser.get(row.debtorId)
    const creditorBalance = balancesByUser.get(row.creditorId)

    if (
      amountCents === null ||
      debtorBalance === undefined ||
      creditorBalance === undefined
    ) {
      return {
        ok: false,
        code: "INVALID_DATA",
        message: "La juntada contiene datos de balance inconsistentes",
        totalBalanceCents: 0,
      }
    }

    const nextDebtorBalance = debtorBalance - amountCents
    const nextCreditorBalance = creditorBalance + amountCents
    if (
      !Number.isSafeInteger(nextDebtorBalance) ||
      !Number.isSafeInteger(nextCreditorBalance)
    ) {
      return {
        ok: false,
        code: "INVALID_DATA",
        message: "La juntada contiene datos de balance inconsistentes",
        totalBalanceCents: 0,
      }
    }

    balancesByUser.set(row.debtorId, nextDebtorBalance)
    balancesByUser.set(row.creditorId, nextCreditorBalance)
    pairDebts.push({
      debtorId: row.debtorId,
      creditorId: row.creditorId,
      amountCents,
    })
  }

  for (const balance of balances) {
    balance.balanceCents = balancesByUser.get(balance.userId) ?? 0
  }

  const settlement = calculateSuggestedTransfers(balances)
  if (!settlement.ok) {
    return {
      ok: false,
      code: settlement.code === "UNBALANCED" ? "INCONSISTENT_BALANCE" : "INVALID_DATA",
      message: settlement.message,
      totalBalanceCents: settlement.totalBalanceCents,
    }
  }

  return { ok: true, balances, transfers: settlement.transfers, pairDebts }
}

/**
 * Balance histórico de una juntada CERRADA, reconstruido desde `Expense` +
 * `ExpenseParticipant` en lugar de `Transaction`.
 *
 * Al cerrar, las DEBT derivadas se saldan y se borran, así que la única fuente
 * confiable del panel es la de los gastos. Reproduce exactamente la misma
 * aritmética que genera las DEBT: el pagador suma lo que adelantó y cada otro
 * participante descuenta su `shareAmount`.
 *
 * Pura: recibe los participantes y los gastos ya cargados (base real o
 * `getGatheringView`) y devuelve el mismo `GatheringEconomics`.
 */
export function historicalEconomicsFromExpenses(input: {
  participantUserIds: string[]
  expenses: ReadonlyArray<{
    payerId: string
    amount: Prisma.Decimal
    participants: ReadonlyArray<{ userId: string; shareAmount: Prisma.Decimal }>
  }>
}): GatheringEconomics {
  const { participantUserIds, expenses } = input

  const centsByUser = new Map<string, number>(
    participantUserIds.map((userId) => [userId, 0]),
  )

  for (const expense of expenses) {
    const totalCents = decimalToCents(expense.amount)
    if (totalCents === null) {
      return {
        ok: false,
        code: "INVALID_DATA",
        message: "La juntada contiene datos de balance inconsistentes",
        totalBalanceCents: 0,
      }
    }

    for (const share of expense.participants) {
      const shareCents = decimalToCents(share.shareAmount)
      if (shareCents === null) {
        return {
          ok: false,
          code: "INVALID_DATA",
          message: "La juntada contiene datos de balance inconsistentes",
          totalBalanceCents: 0,
        }
      }
      // El pagador recupera su parte y cobra el resto.
      if (share.userId === expense.payerId) continue

      const nextPayer = (centsByUser.get(expense.payerId) ?? 0) + shareCents
      const nextShare = (centsByUser.get(share.userId) ?? 0) - shareCents
      if (
        !Number.isSafeInteger(nextPayer) ||
        !Number.isSafeInteger(nextShare)
      ) {
        return {
          ok: false,
          code: "INVALID_DATA",
          message: "La juntada contiene datos de balance inconsistentes",
          totalBalanceCents: 0,
        }
      }
      centsByUser.set(expense.payerId, nextPayer)
      centsByUser.set(share.userId, nextShare)
    }
  }

  const balances: SettlementBalance[] = participantUserIds.map((userId) => ({
    userId,
    balanceCents: centsByUser.get(userId) ?? 0,
  }))

  // El panel histórico valida los balances igual que el activo: si la suma no
  // cierra o los ids son inválidos, se trata como datos inconsistentes.
  const settlement = calculateSuggestedTransfers(balances)
  if (!settlement.ok) {
    return {
      ok: false,
      code: settlement.code === "UNBALANCED" ? "INCONSISTENT_BALANCE" : "INVALID_DATA",
      message: settlement.message,
      totalBalanceCents: settlement.totalBalanceCents,
    }
  }

  // Una juntada cerrada no tiene transferencias sugeridas (sus deudas quedaron
  // saldadas) ni deudas por par.
  return { ok: true, balances, transfers: [], pairDebts: [] }
}