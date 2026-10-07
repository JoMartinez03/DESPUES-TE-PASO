import { beforeEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import type { Movement } from "@/queries/transactions"

const { transactionFindMany } = vi.hoisted(() => ({
  transactionFindMany: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    friendship: { findMany: vi.fn() },
    transaction: {
      findMany: transactionFindMany,
      groupBy: vi.fn(),
      count: vi.fn(),
      aggregate: vi.fn(),
    },
  },
}))

const { derivePairLedger } = await import("@/queries/transactions")

const ANA = "usr-ana"
const TINO = "usr-tino"

const dec = (value: string | number) => new Prisma.Decimal(value)

function movement(
  overrides: Partial<Movement> &
    Pick<Movement, "type" | "status" | "debtorId" | "creditorId" | "amount">,
): Movement {
  return {
    id: "m-" + Math.random().toString(36).slice(2),
    description: "Movimiento",
    currency: "ARS",
    occurredAt: new Date("2026-01-01"),
    createdAt: new Date("2026-01-01"),
    expense: null,
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("derivePairLedger", () => {
  it("no rows: balance 0, sin pendientes, historial vacío, total 0", () => {
    const ledger = derivePairLedger(ANA, [])

    expect(ledger.balance).toEqual(dec("0"))
    expect(ledger.pendingPayments).toEqual([])
    expect(ledger.history).toEqual([])
    expect(ledger.total).toBe(0)
  })

  it("la posición del par sale de TODAS las CONFIRMED (deudor negativo, acreedor positivo)", () => {
    const ledger = derivePairLedger(ANA, [
      movement({ type: "DEBT", status: "CONFIRMED", debtorId: ANA, creditorId: TINO, amount: dec("500") }),
      movement({ type: "DEBT", status: "CONFIRMED", debtorId: TINO, creditorId: ANA, amount: dec("100") }),
      movement({ type: "PAYMENT", status: "CONFIRMED", debtorId: TINO, creditorId: ANA, amount: dec("30") }),
    ])

    // Con la convención de sumSigned: DEBT deudor negativo/acreedor positivo y
    // el PAYMENT recibido descuenta el saldo de Ana. -500 + 100 - 30 = -430.
    expect(ledger.balance).toEqual(dec("-430"))
    expect(ledger.total).toBe(3)
  })

  it("el historial devuelve solo los 200 más recientes, pero el balance no los trunca", () => {
    const newest = Array.from({ length: 200 }, () =>
      movement({ type: "DEBT", status: "CONFIRMED", debtorId: ANA, creditorId: TINO, amount: dec("1") }),
    )
    const oldest = Array.from({ length: 50 }, () =>
      movement({ type: "DEBT", status: "CONFIRMED", debtorId: ANA, creditorId: TINO, amount: dec("100") }),
    )
    const all = [...newest, ...oldest]

    const ledger = derivePairLedger(ANA, all)

    // Todos los 250 suman -200 - 5000 = -5200. Si el balance dependiera del
    // historial truncado mostraría solo -200: esto prueba que se lee TODO.
    expect(ledger.balance).toEqual(dec("-5200"))
    expect(ledger.total).toBe(250)
    expect(ledger.history).toHaveLength(200)
    expect(ledger.history[0]).toBe(all[0])
    expect(ledger.history[199]).toBe(all[199])
  })

  it("solo las PAYMENT PENDING entran al pendiente, con dirección por par", () => {
    const ledger = derivePairLedger(ANA, [
      movement({ type: "PAYMENT", status: "PENDING", debtorId: ANA, creditorId: TINO, amount: dec("10"), description: "Outgoing 1" }),
      movement({ type: "PAYMENT", status: "PENDING", debtorId: ANA, creditorId: TINO, amount: dec("20"), description: "Outgoing 2" }),
      movement({ type: "PAYMENT", status: "PENDING", debtorId: TINO, creditorId: ANA, amount: dec("5"), description: "Incoming" }),
      // Estas no deberían contar.
      movement({ type: "DEBT", status: "PENDING", debtorId: ANA, creditorId: TINO, amount: dec("99") }),
      movement({ type: "PAYMENT", status: "CONFIRMED", debtorId: ANA, creditorId: TINO, amount: dec("99") }),
      movement({ type: "PAYMENT", status: "REJECTED", debtorId: ANA, creditorId: TINO, amount: dec("99") }),
    ])

    expect(ledger.pendingPayments).toHaveLength(3)
    const outgoing = ledger.pendingPayments
      .filter((p) => p.direction === "outgoing")
      .map((p) => [p.amount.toString(), p.description])
    const incoming = ledger.pendingPayments.filter((p) => p.direction === "incoming")
    expect(outgoing).toEqual([
      ["10", "Outgoing 1"],
      ["20", "Outgoing 2"],
    ])
    expect(incoming.map((p) => p.amount.toString())).toEqual(["5"])
  })

  it("conserva los datos del gasto en el historial (título y juntada)", () => {
    const row = movement({
      type: "DEBT",
      status: "CONFIRMED",
      debtorId: ANA,
      creditorId: TINO,
      amount: dec("100"),
      description: "Cena",
      expense: { title: "Cena", gathering: { name: "AFIP" } },
    })

    const ledger = derivePairLedger(ANA, [row])

    expect(ledger.history[0].expense).toEqual({ title: "Cena", gathering: { name: "AFIP" } })
  })

  it("las REJECTED no participan del balance", () => {
    const ledger = derivePairLedger(ANA, [
      movement({ type: "PAYMENT", status: "REJECTED", debtorId: ANA, creditorId: TINO, amount: dec("400") }),
      movement({ type: "DEBT", status: "CONFIRMED", debtorId: ANA, creditorId: TINO, amount: dec("50") }),
    ])

    expect(ledger.balance).toEqual(dec("-50"))
    expect(ledger.total).toBe(2)
  })
})