export type GatheringBalance = {
  userId: string
  balanceCents: number
}

export type SuggestedTransfer = {
  fromUserId: string
  toUserId: string
  amountCents: number
}

export type SettlementResult =
  | { ok: true; transfers: SuggestedTransfer[] }
  | {
      ok: false
      code: "UNBALANCED" | "INVALID_INPUT"
      message: string
      totalBalanceCents: number
    }

/**
 * Calcula transferencias sugeridas en centavos enteros. El orden estable es
 * monto absoluto descendente y userId ascendente como desempate.
 */
export function calculateSuggestedTransfers(
  balances: readonly GatheringBalance[],
): SettlementResult {
  const seen = new Set<string>()
  let totalBalanceCents = 0

  for (const balance of balances) {
    if (!balance.userId || seen.has(balance.userId)) {
      return {
        ok: false,
        code: "INVALID_INPUT",
        message: "Los participantes tienen IDs inválidos o repetidos",
        totalBalanceCents,
      }
    }
    if (!Number.isSafeInteger(balance.balanceCents)) {
      return {
        ok: false,
        code: "INVALID_INPUT",
        message: "Los balances deben ser centavos enteros seguros",
        totalBalanceCents,
      }
    }
    seen.add(balance.userId)
    totalBalanceCents += balance.balanceCents
  }

  if (totalBalanceCents !== 0) {
    return {
      ok: false,
      code: "UNBALANCED",
      message: "La suma de balances de la juntada no es cero",
      totalBalanceCents,
    }
  }

  const creditors = balances
    .filter((balance) => balance.balanceCents > 0)
    .map((balance) => ({ ...balance }))
    .sort(compareBalances)
  const debtors = balances
    .filter((balance) => balance.balanceCents < 0)
    .map((balance) => ({ ...balance }))
    .sort(compareBalances)

  const transfers: SuggestedTransfer[] = []
  let creditorIndex = 0
  let debtorIndex = 0
  let creditorRemaining = creditors[0]?.balanceCents ?? 0
  let debtorRemaining = Math.abs(debtors[0]?.balanceCents ?? 0)

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const amountCents = Math.min(creditorRemaining, debtorRemaining)
    if (amountCents > 0) {
      transfers.push({
        fromUserId: debtors[debtorIndex].userId,
        toUserId: creditors[creditorIndex].userId,
        amountCents,
      })
      creditorRemaining -= amountCents
      debtorRemaining -= amountCents
    }

    if (creditorRemaining === 0) {
      creditorIndex += 1
      creditorRemaining = creditors[creditorIndex]?.balanceCents ?? 0
    }
    if (debtorRemaining === 0) {
      debtorIndex += 1
      debtorRemaining = Math.abs(debtors[debtorIndex]?.balanceCents ?? 0)
    }
  }

  return { ok: true, transfers }
}

function compareBalances(
  a: GatheringBalance,
  b: GatheringBalance,
): number {
  const amountDifference = Math.abs(b.balanceCents) - Math.abs(a.balanceCents)
  if (amountDifference !== 0) return amountDifference
  return a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0
}
