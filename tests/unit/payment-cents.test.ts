import { describe, expect, it } from "vitest"
import { Prisma } from "@/generated/prisma"
import { formatMoney, formatSignedMoney } from "@/lib/format"
import { toCanonicalMoney } from "@/lib/money-input"
import {
  maxPayableFrom,
  sumSigned,
  toDecimal,
  type BalanceRow,
} from "@/lib/transactions"

const JOSE = "jose"
const TINO = "tino"

function debt(amount: string): BalanceRow {
  return {
    type: "DEBT",
    debtorId: TINO,
    creditorId: JOSE,
    amount: new Prisma.Decimal(amount),
  }
}

function payment(amount: string): BalanceRow {
  return {
    type: "PAYMENT",
    debtorId: TINO,
    creditorId: JOSE,
    amount: new Prisma.Decimal(amount),
  }
}

/**
 * Camino exacto del pago: el texto del usuario se normaliza a canónico y de
 * ahí a Prisma.Decimal, igual que en `registerPayment`.
 */
function userAmountToDecimal(raw: string): Prisma.Decimal {
  const canonical = toCanonicalMoney(raw)
  if (canonical === null) throw new Error(`Monto inválido: ${raw}`)
  return toDecimal(canonical)
}

describe("pago con centavos — exactitud decimal", () => {
  it("deuda 6600.83 + pago 6600.83 (coma) deja el balance exactamente en 0", () => {
    const balance = sumSigned(
      [debt("6600.83"), payment(userAmountToDecimal("6600,83").toString())],
      TINO,
    )

    expect(balance.isZero()).toBe(true)
    expect(balance.equals(new Prisma.Decimal(0))).toBe(true)
    expect(balance.toString()).toBe("0")
    // Nada de restos binarios ni de centavos fantasma.
    expect(balance.abs().toNumber()).toBe(0)
  })

  it("el mismo resultado con punto decimal y sin decimales", () => {
    for (const raw of ["6600.83", "6600,83"]) {
      const rows = [debt("6600.83"), payment(userAmountToDecimal(raw).toString())]
      expect(sumSigned(rows, TINO).isZero()).toBe(true)
    }
  })

  it("el pago parcial con centavos deja el resto exacto", () => {
    const balance = sumSigned(
      [debt("6600.83"), payment(userAmountToDecimal("6600,8").toString())],
      TINO,
    )

    // 6600.83 - 6600.80 = 0.03 exacto, sin artefactos de punto flotante.
    expect(balance.toString()).toBe("-0.03")
  })

  it("formatSignedMoney muestra el saldo cero como 'al día' y sin signo", () => {
    const balance = sumSigned(
      [debt("6600.83"), payment(userAmountToDecimal("6600,83").toString())],
      TINO,
    )
    const signed = formatSignedMoney(balance)

    expect(signed.settled).toBe(true)
    expect(signed.symbol).toBe("")
    expect(signed.text).toBe(formatMoney(0))
  })

  it("formatMoney muestra los centavos en formato es-AR", () => {
    expect(formatMoney(new Prisma.Decimal("6600.83"))).toBe("$6.600,83")
    expect(formatMoney("6600.8")).toBe("$6.600,8")
    expect(formatMoney(userAmountToDecimal("6600,83"))).toBe("$6.600,83")
    expect(formatMoney(new Prisma.Decimal("0"))).toBe("$0")
  })
})

describe("maxPayable con centavos — comparación exacta", () => {
  const owed = new Prisma.Decimal("-6600.83")
  const noPending = new Prisma.Decimal(0)

  it("maxPayableFrom devuelve el máximo con centavos intactos", () => {
    const max = maxPayableFrom(owed, noPending)
    expect(max.toString()).toBe("6600.83")
    expect(formatMoney(max)).toBe("$6.600,83")
  })

  it("acepta exactamente el máximo tecleado con coma", () => {
    const max = maxPayableFrom(owed, noPending)
    const amount = userAmountToDecimal("6600,83")
    expect(amount.gt(max)).toBe(false)
    expect(amount.lte(max)).toBe(true)
  })

  it("acepta exactamente el máximo tecleado con punto y sin decimales", () => {
    const max = maxPayableFrom(owed, noPending)
    expect(userAmountToDecimal("6600.83").gt(max)).toBe(false)
    expect(userAmountToDecimal("6600").gt(max)).toBe(false)
  })

  it("rechaza un centavo de más (6600,84 > 6600.83)", () => {
    const max = maxPayableFrom(owed, noPending)
    expect(userAmountToDecimal("6600,84").gt(max)).toBe(true)
  })

  it("descuenta los pagos pendientes salientes con centavos", () => {
    const pending = new Prisma.Decimal("100.83")
    const max = maxPayableFrom(owed, pending)
    expect(max.toString()).toBe("6500")
    expect(userAmountToDecimal("6500").gt(max)).toBe(false)
    expect(userAmountToDecimal("6500,01").gt(max)).toBe(true)
  })
})

describe("toDecimal — camino a Prisma.Decimal", () => {
  it("convierte la forma canónica sin pasar por float", () => {
    const amount = userAmountToDecimal("6600,83")
    expect(amount).toBeInstanceOf(Prisma.Decimal)
    expect(amount.toString()).toBe("6600.83")
    expect(amount.toFixed(2)).toBe("6600.83")
  })

  it("representa exactamente los dos decimales pedidos", () => {
    expect(userAmountToDecimal("6600,8").toString()).toBe("6600.8")
    expect(userAmountToDecimal("6600,8").toFixed(2)).toBe("6600.80")
    expect(userAmountToDecimal("0,01").toString()).toBe("0.01")
  })
})
