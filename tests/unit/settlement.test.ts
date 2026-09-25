import { describe, expect, it } from "vitest"
import { calculateSuggestedTransfers } from "@/lib/gatherings/settlement"

describe("calculateSuggestedTransfers", () => {
  it("resuelve un acreedor y dos deudores", () => {
    const result = calculateSuggestedTransfers([
      { userId: "A", balanceCents: 12000 },
      { userId: "B", balanceCents: -7000 },
      { userId: "C", balanceCents: -5000 },
    ])

    expect(result).toEqual({
      ok: true,
      transfers: [
        { fromUserId: "B", toUserId: "A", amountCents: 7000 },
        { fromUserId: "C", toUserId: "A", amountCents: 5000 },
      ],
    })
  })

  it("ordena creditors y deudores de forma determinista", () => {
    const result = calculateSuggestedTransfers([
      { userId: "A", balanceCents: 5000 },
      { userId: "B", balanceCents: 3000 },
      { userId: "C", balanceCents: -8000 },
    ])

    expect(result).toEqual({
      ok: true,
      transfers: [
        { fromUserId: "C", toUserId: "A", amountCents: 5000 },
        { fromUserId: "C", toUserId: "B", amountCents: 3000 },
      ],
    })
  })

  it("cierra centavos sin perderlos", () => {
    const result = calculateSuggestedTransfers([
      { userId: "A", balanceCents: 3334 },
      { userId: "B", balanceCents: 3333 },
      { userId: "C", balanceCents: -6667 },
    ])

    expect(result).toEqual({
      ok: true,
      transfers: [
        { fromUserId: "C", toUserId: "A", amountCents: 3334 },
        { fromUserId: "C", toUserId: "B", amountCents: 3333 },
      ],
    })
  })

  it("devuelve cero transferencias cuando todos están saldados", () => {
    expect(
      calculateSuggestedTransfers([
        { userId: "A", balanceCents: 0 },
        { userId: "B", balanceCents: 0 },
      ]),
    ).toEqual({ ok: true, transfers: [] })
  })

  it("detecta una suma de balances distinta de cero", () => {
    const result = calculateSuggestedTransfers([
      { userId: "A", balanceCents: 100 },
      { userId: "B", balanceCents: -99 },
    ])

    expect(result).toEqual({
      ok: false,
      code: "UNBALANCED",
      message: "La suma de balances de la juntada no es cero",
      totalBalanceCents: 1,
    })
  })
})
