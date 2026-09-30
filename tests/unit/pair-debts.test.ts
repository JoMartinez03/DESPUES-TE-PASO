import { describe, expect, it } from "vitest"
import { netPairDebtsFor, type PairDebtRow } from "@/lib/gatherings/pair-debts"

const PADRE = "padre"
const FABRICIO = "fabricio"
const LAUTI = "lauti"
const TINO = "tino"
const MONTANA = "montana"

/**
 * Settlement del producto: las DEBT derivadas de los gastos de la juntada.
 * Padre debe a Tino y a MONTANA; Fabricio idem; Lauti solo a MONTANA.
 * Tino y MONTANA son acreedores netos.
 */
const pairDebts: PairDebtRow[] = [
  { debtorId: PADRE, creditorId: TINO, amountCents: 500_000 },
  { debtorId: PADRE, creditorId: MONTANA, amountCents: 408_000 },
  { debtorId: FABRICIO, creditorId: TINO, amountCents: 674_000 },
  { debtorId: FABRICIO, creditorId: MONTANA, amountCents: 234_000 },
  { debtorId: LAUTI, creditorId: MONTANA, amountCents: 908_000 },
]

describe("netPairDebtsFor", () => {
  it("devuelve las dos obligaciones de Padre y nada de los demás", () => {
    expect(netPairDebtsFor(pairDebts, PADRE)).toEqual([
      { creditorId: TINO, amountCents: 500_000 },
      { creditorId: MONTANA, amountCents: 408_000 },
    ])
  })

  it("devuelve las dos obligaciones de Fabricio", () => {
    expect(netPairDebtsFor(pairDebts, FABRICIO)).toEqual([
      { creditorId: TINO, amountCents: 674_000 },
      { creditorId: MONTANA, amountCents: 234_000 },
    ])
  })

  it("devuelve una sola obligación a Lauti", () => {
    expect(netPairDebtsFor(pairDebts, LAUTI)).toEqual([
      { creditorId: MONTANA, amountCents: 908_000 },
    ])
  })

  it("no devuelve nada para un acreedor neto", () => {
    expect(netPairDebtsFor(pairDebts, TINO)).toEqual([])
    expect(netPairDebtsFor(pairDebts, MONTANA)).toEqual([])
  })

  it("netea DEBT en sentidos contrarios con la misma persona en una sola fila", () => {
    const rows: PairDebtRow[] = [
      { debtorId: PADRE, creditorId: TINO, amountCents: 700_000 },
      { debtorId: TINO, creditorId: PADRE, amountCents: 200_000 },
    ]

    expect(netPairDebtsFor(rows, PADRE)).toEqual([
      { creditorId: TINO, amountCents: 500_000 },
    ])
  })

  it("omite el par que queda netamente en cero", () => {
    const rows: PairDebtRow[] = [
      { debtorId: PADRE, creditorId: TINO, amountCents: 300_000 },
      { debtorId: TINO, creditorId: PADRE, amountCents: 300_000 },
    ]

    expect(netPairDebtsFor(rows, PADRE)).toEqual([])
  })

  it("invierte el sentido de la fila cuando el deudor le debe a un acreedor neto", () => {
    const rows: PairDebtRow[] = [
      { debtorId: PADRE, creditorId: TINO, amountCents: 100_000 },
      { debtorId: TINO, creditorId: PADRE, amountCents: 400_000 },
    ]

    expect(netPairDebtsFor(rows, PADRE)).toEqual([])
  })

  it("acumula varias DEBT del mismo par en la misma fila", () => {
    const rows: PairDebtRow[] = [
      { debtorId: PADRE, creditorId: TINO, amountCents: 700_000 },
      { debtorId: PADRE, creditorId: TINO, amountCents: 800 },
    ]

    expect(netPairDebtsFor(rows, PADRE)).toEqual([
      { creditorId: TINO, amountCents: 700_800 },
    ])
  })

  it("ordena de forma determinista por monto y luego por id", () => {
    const rows: PairDebtRow[] = [
      { debtorId: PADRE, creditorId: "zulo", amountCents: 100_000 },
      { debtorId: PADRE, creditorId: "alfa", amountCents: 100_000 },
      { debtorId: PADRE, creditorId: "medio", amountCents: 900_000 },
    ]

    expect(netPairDebtsFor(rows, PADRE)).toEqual([
      { creditorId: "medio", amountCents: 900_000 },
      { creditorId: "alfa", amountCents: 100_000 },
      { creditorId: "zulo", amountCents: 100_000 },
    ])
  })

  it("ignora las deudas propias consigo mismo", () => {
    const rows: PairDebtRow[] = [
      { debtorId: PADRE, creditorId: PADRE, amountCents: 100_000 },
      { debtorId: PADRE, creditorId: TINO, amountCents: 50_000 },
    ]

    expect(netPairDebtsFor(rows, PADRE)).toEqual([
      { creditorId: TINO, amountCents: 50_000 },
    ])
  })

  it("no toca las obligaciones de terceros al filtrar por el viewer", () => {
    const padreResult = netPairDebtsFor(pairDebts, PADRE)

    expect(padreResult.every((row) => row.amountCents > 0)).toBe(true)
    expect(padreResult).toHaveLength(2)
    expect(padreResult.map((row) => row.creditorId)).not.toContain(FABRICIO)
    expect(padreResult.map((row) => row.creditorId)).not.toContain(LAUTI)
  })
})
