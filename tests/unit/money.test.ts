import { describe, expect, it } from "vitest"
import {
  centsToAmountString,
  parseMoneyToCents,
  splitEqualCents,
  sumCents,
} from "@/lib/gatherings/money"

describe("money helpers", () => {
  it("convierte centavos positivos y negativos sin perder el signo", () => {
    expect(centsToAmountString(0)).toBe("0.00")
    expect(centsToAmountString(1)).toBe("0.01")
    expect(centsToAmountString(-1)).toBe("-0.01")
    expect(centsToAmountString(-12345)).toBe("-123.45")
  })

  it("parsea montos con uno o dos decimales", () => {
    expect(parseMoneyToCents("10")).toBe(1000)
    expect(parseMoneyToCents("10.5")).toBe(1050)
    expect(parseMoneyToCents("10.05")).toBe(1005)
  })

  it("reparte centavos restantes de forma determinista", () => {
    const shares = splitEqualCents(10000, ["C", "A", "B"])
    expect([...shares.entries()]).toEqual([
      ["A", 3334],
      ["B", 3333],
      ["C", 3333],
    ])
    expect(sumCents(shares.values())).toBe(10000)
  })
})
