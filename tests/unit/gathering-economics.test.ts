import { describe, expect, it } from "vitest"
import { Prisma } from "@/generated/prisma"
import {
  economicsFromDebtGroups,
  historicalEconomicsFromExpenses,
  type DebtGroupRow,
} from "@/lib/gatherings/economics"

const dec = (value: string | number) => new Prisma.Decimal(value)

const ANA = "usr-ana"
const TINO = "usr-tino"
const CARO = "usr-caro"
const LUIS = "usr-luis"

function group(
  debtorId: string,
  creditorId: string,
  amount: string | null,
): DebtGroupRow {
  return {
    debtorId,
    creditorId,
    _sum: { amount: amount === null ? null : dec(amount) },
  }
}

describe("economicsFromDebtGroups", () => {
  it("vacío: todos en 0, ok, sin transferencias ni deudas por par", () => {
    const result = economicsFromDebtGroups({
      participantUserIds: [ANA, TINO, CARO],
      groups: [],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.balances.every((row) => row.balanceCents === 0)).toBe(true)
    expect(result.transfers).toEqual([])
    expect(result.pairDebts).toEqual([])
  })

  it("Activa EQUAL: netea por par y mantiene las deudas sin netear", () => {
    const result = economicsFromDebtGroups({
      participantUserIds: [ANA, TINO, CARO],
      groups: [
        group(TINO, ANA, "15"),
        group(CARO, ANA, "15"),
        group(CARO, TINO, "2"),
      ],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    const balance = new Map(result.balances.map((b) => [b.userId, b.balanceCents]))
    expect(balance.get(ANA)).toBe(3000)
    expect(balance.get(TINO)).toBe(-1300)
    expect(balance.get(CARO)).toBe(-1700)
    expect(result.pairDebts).toEqual([
      { debtorId: TINO, creditorId: ANA, amountCents: 1500 },
      { debtorId: CARO, creditorId: ANA, amountCents: 1500 },
      { debtorId: CARO, creditorId: TINO, amountCents: 200 },
    ])
    // El settlement sugiere el mínimo: no se valida, solo que exista.
    expect(result.transfers.length).toBeGreaterThan(0)
  })

  it("una fila neteada a 0 no aparece en pairDebts", () => {
    const result = economicsFromDebtGroups({
      participantUserIds: [ANA, TINO],
      groups: [group(ANA, TINO, "400"), group(TINO, ANA, "400")],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.balances.every((row) => row.balanceCents === 0)).toBe(true)
    expect(result.pairDebts).toHaveLength(2)
    expect(result.transfers).toEqual([])
  })

  it("grupo que referencia a un NO participante => INVALID_DATA", () => {
    const result = economicsFromDebtGroups({
      participantUserIds: [ANA, TINO],
      groups: [group(LUIS, ANA, "500")],
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe("INVALID_DATA")
  })

  it("fila sin monto agregado => INVALID_DATA", () => {
    const result = economicsFromDebtGroups({
      participantUserIds: [ANA, TINO],
      groups: [group(ANA, TINO, null)],
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe("INVALID_DATA")
  })

  it("monto con más de 2 decimales => INVALID_DATA (aritmética de centavo)", () => {
    const result = economicsFromDebtGroups({
      participantUserIds: [ANA, TINO],
      groups: [group(ANA, TINO, "10.005")],
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe("INVALID_DATA")
  })
})

describe("historicalEconomicsFromExpenses", () => {
  const expense = (overrides: Partial<Parameters<typeof historicalEconomicsFromExpenses>[0]["expenses"][number]> = {}) => ({
    payerId: ANA,
    amount: dec("30"),
    participants: [
      { userId: ANA, shareAmount: dec("10") },
      { userId: TINO, shareAmount: dec("10") },
      { userId: CARO, shareAmount: dec("10") },
    ],
    ...overrides,
  })

  it("EQUAL: el pagador cobra el resto y los otros descuentan su parte", () => {
    const result = historicalEconomicsFromExpenses({
      participantUserIds: [ANA, TINO, CARO],
      expenses: [expense()],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    const balance = new Map(result.balances.map((b) => [b.userId, b.balanceCents]))
    expect(balance.get(ANA)).toBe(2000)
    expect(balance.get(TINO)).toBe(-1000)
    expect(balance.get(CARO)).toBe(-1000)
    expect(result.transfers).toEqual([])
    expect(result.pairDebts).toEqual([])
  })

  it("varios pagadores y CUSTOM: se acumulan las partes de cada gasto", () => {
    const result = historicalEconomicsFromExpenses({
      participantUserIds: [ANA, TINO, CARO],
      expenses: [
        expense(), // ANA pagó 30, partes de 10.
        {
          payerId: TINO,
          amount: dec("20"),
          participants: [
            { userId: ANA, shareAmount: dec("15") },
            { userId: TINO, shareAmount: dec("5") },
          ],
        },
      ],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    const balance = new Map(result.balances.map((b) => [b.userId, b.balanceCents]))
    // ANA: cobra 2000 del primero, paga 1500 del segundo.
    expect(balance.get(ANA)).toBe(500)
    // TINO: paga 1000 del primero, cobra 1500 del segundo.
    expect(balance.get(TINO)).toBe(500)
    expect(balance.get(CARO)).toBe(-1000)
  })

  it("pagador que NO participa: suma no cierra => INCONSISTENT_BALANCE", () => {
    const result = historicalEconomicsFromExpenses({
      participantUserIds: [ANA, TINO],
      expenses: [{ payerId: LUIS, amount: dec("3000"), participants: [ANA, TINO].map((userId, index) => ({ userId, shareAmount: dec(index === 0 ? "1500" : "1500") })) }],
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe("INCONSISTENT_BALANCE")
  })

  it("importe con más de 2 decimales => INVALID_DATA", () => {
    const result = historicalEconomicsFromExpenses({
      participantUserIds: [ANA, TINO],
      expenses: [expense({ amount: dec("10.001") })],
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe("INVALID_DATA")
  })

  it("shareAmount con más de 2 decimales => INVALID_DATA", () => {
    const result = historicalEconomicsFromExpenses({
      participantUserIds: [ANA, TINO],
      expenses: [
        {
          payerId: ANA,
          amount: dec("3"),
          participants: [{ userId: TINO, shareAmount: dec("1.234") }],
        },
      ],
    })

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe("INVALID_DATA")
  })

  it("sin gastos: todos en 0 y ok", () => {
    const result = historicalEconomicsFromExpenses({
      participantUserIds: [ANA, TINO],
      expenses: [],
    })

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.balances.every((row) => row.balanceCents === 0)).toBe(true)
  })
})