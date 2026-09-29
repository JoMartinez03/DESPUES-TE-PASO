import { describe, expect, it } from "vitest"
import { Prisma } from "@/generated/prisma"
import { signedAmounts, sumSigned, type BalanceRow } from "@/lib/transactions"
import { formatSignedMoney } from "@/lib/format"

const JOSE = "jose"
const TINO = "tino"
const MAURO = "mauro"

function debt(
  debtorId: string,
  creditorId: string,
  amount: string,
): BalanceRow {
  return {
    type: "DEBT",
    debtorId,
    creditorId,
    amount: new Prisma.Decimal(amount),
  }
}

function payment(
  debtorId: string,
  creditorId: string,
  amount: string,
): BalanceRow {
  return {
    type: "PAYMENT",
    debtorId,
    creditorId,
    amount: new Prisma.Decimal(amount),
  }
}

function balance(rows: BalanceRow[], userId: string): number {
  return sumSigned(rows, userId).toNumber()
}

/**
 * Balance de `a` respecto de `b`, aislando el par. Es el mismo recorte que
 * hace `primeBalanceBetween` en src/queries/transactions.ts.
 */
function balanceOfPair(rows: BalanceRow[], a: string, b: string): number {
  const pair = rows.filter(
    (row) =>
      (row.debtorId === a && row.creditorId === b) ||
      (row.debtorId === b && row.creditorId === a),
  )
  // `+ 0` normaliza el -0 que produce la negación: `Object.is(-0, 0)` es false
  // y haría fallar el assert sin que haya una asimetría real.
  return sumSigned(pair, a).toNumber() + 0
}

describe("convención de balance", () => {
  it("DEBT: el acreedor ve positivo y el deudor negativo", () => {
    const rows = [debt(TINO, JOSE, "5000")]

    expect(balance(rows, JOSE)).toBe(5000)
    expect(balance(rows, TINO)).toBe(-5000)
  })

  it("PAYMENT: el que cobra ve negativo y el que paga positivo", () => {
    const rows = [payment(TINO, JOSE, "5000")]

    expect(balance(rows, JOSE)).toBe(-5000)
    expect(balance(rows, TINO)).toBe(5000)
  })

  it("PAYMENT cancela la DEBT que lo originó", () => {
    const rows = [debt(TINO, JOSE, "5000"), payment(TINO, JOSE, "5000")]

    expect(balance(rows, JOSE)).toBe(0)
    expect(balance(rows, TINO)).toBe(0)
  })

  it("deudas recíprocas se compensan", () => {
    const rows = [debt(TINO, JOSE, "5000"), debt(JOSE, TINO, "2000")]

    expect(balance(rows, JOSE)).toBe(3000)
    expect(balance(rows, TINO)).toBe(-3000)
  })

  it("múltiples pagadores: el pagador suma todas sus partes", () => {
    const rows = [debt(TINO, JOSE, "3000"), debt(MAURO, JOSE, "3000")]

    expect(balance(rows, JOSE)).toBe(6000)
    expect(balance(rows, TINO)).toBe(-3000)
    expect(balance(rows, MAURO)).toBe(-3000)
    expect(
      balance(rows, JOSE) + balance(rows, TINO) + balance(rows, MAURO),
    ).toBe(0)
  })

  it("ignora filas donde el usuario no participa", () => {
    const rows = [debt(TINO, JOSE, "5000")]
    expect(signedAmounts(rows, MAURO)).toHaveLength(0)
    expect(balance(rows, MAURO)).toBe(0)
  })
})

describe("simetría A/B", () => {
  const scenarios: Array<[string, BalanceRow[]]> = [
    ["DEBT simple", [debt(TINO, JOSE, "5000")]],
    ["pagador no participante", [debt(TINO, JOSE, "10000")]],
    ["tres personas", [debt(TINO, JOSE, "3000"), debt(MAURO, JOSE, "3000")]],
    [
      "recíprocas",
      [debt(TINO, JOSE, "5000"), debt(JOSE, TINO, "2000")],
    ],
    [
      "deuda + pago confirmado",
      [debt(TINO, JOSE, "5000"), payment(TINO, JOSE, "5000")],
    ],
    [
      "pago parcial",
      [debt(TINO, JOSE, "5000"), payment(TINO, JOSE, "2000")],
    ],
    [
      "mezcla completa",
      [
        debt(TINO, JOSE, "5000"),
        debt(MAURO, JOSE, "3000"),
        debt(JOSE, TINO, "2000"),
        payment(MAURO, JOSE, "1000"),
      ],
    ],
  ]

  for (const [name, rows] of scenarios) {
    it(`balance(A,B) = -balance(B,A) — ${name}`, () => {
      for (const [a, b] of [
        [JOSE, TINO],
        [JOSE, MAURO],
        [TINO, MAURO],
      ] as const) {
        // La simetría es que los dos balances suman cero. Se asserta así y no
        // con `toBe(-y)` porque la negación produce -0 y `Object.is(-0, 0)` es false.
        expect(balanceOfPair(rows, a, b) + balanceOfPair(rows, b, a)).toBe(0)
      }
    })
  }
})

describe("texto de balance", () => {
  it("positivo renderiza '+' (te deben)", () => {
    expect(formatSignedMoney(1000)).toEqual({
      symbol: "+",
      text: "$1.000",
      settled: false,
    })
  })

  it("negativo renderiza '−' con el monto absoluto (debés)", () => {
    expect(formatSignedMoney(-1000)).toEqual({
      symbol: "−",
      text: "$1.000",
      settled: false,
    })
  })

  it("cero no renderiza '+ $0' sino un saldo al día", () => {
    expect(formatSignedMoney(0)).toEqual({
      symbol: "",
      text: "$0",
      settled: true,
    })
  })
})
