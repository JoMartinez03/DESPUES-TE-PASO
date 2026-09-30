/**
 * Neteo de deudas por par dentro de una juntada.
 *
 * Responde una pregunta distinta a la de `calculateSuggestedTransfers`: en vez de
 * "cuál es la forma global de saldar la juntada con menos transferencias", acá
 * se responde "a QUIÉN le debo yo y cuánto, por ESTA juntada".
 *
 * Por eso no redistribuye entre terceros. Solo netea al usuario contra cada
 * persona: las DEBT en sentido contrario con la misma persona se cancelan y cada
 * acreedor queda en una única fila.
 */

export type PairDebtRow = {
  debtorId: string
  creditorId: string
  amountCents: number
}

export type MyPaymentRow = {
  creditorId: string
  amountCents: number
}

function compareIdsAscending(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

/**
 * Devuelve las obligaciones netas de `viewerId` contra cada persona con la que
 * tiene DEBT en esta juntada, solo aquellas donde el viewer queda deudor.
 *
 * `rows` son las DEBT ya acotadas a la juntada y agrupadas por par dirigido, así
 * que el neteo es aritmética sobre esa entrada: no consulta nada ni conoce el
 * resto de las juntadas.
 */
export function netPairDebtsFor(
  rows: readonly PairDebtRow[],
  viewerId: string,
): MyPaymentRow[] {
  const netByCounterpart = new Map<string, number>()

  for (const row of rows) {
    if (!row.debtorId || !row.creditorId) continue
    if (row.debtorId === row.creditorId) continue

    if (row.debtorId === viewerId) {
      const creditorId = row.creditorId
      netByCounterpart.set(
        creditorId,
        (netByCounterpart.get(creditorId) ?? 0) + row.amountCents,
      )
    } else if (row.creditorId === viewerId) {
      const debtorId = row.debtorId
      netByCounterpart.set(
        debtorId,
        (netByCounterpart.get(debtorId) ?? 0) - row.amountCents,
      )
    }
  }

  const payments: MyPaymentRow[] = []
  for (const [creditorId, amountCents] of netByCounterpart) {
    if (amountCents > 0) payments.push({ creditorId, amountCents })
  }

  payments.sort(
    (a, b) =>
      b.amountCents - a.amountCents ||
      compareIdsAscending(a.creditorId, b.creditorId),
  )
  return payments
}
