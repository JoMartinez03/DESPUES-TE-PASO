import { describe, expect, it } from "vitest"
import {
  MONEY_CANONICAL_REGEX,
  sanitizeMoneyInput,
  toCanonicalMoney,
} from "@/lib/money-input"
import {
  createDebtSchema,
  editDebtSchema,
  moneyString,
  registerPaymentSchema,
} from "@/lib/validations/transactions"
import { expenseMutationSchema } from "@/lib/validations/gatherings"

describe("toCanonicalMoney", () => {
  it("acepta coma decimal argentina y la convierte a punto", () => {
    expect(toCanonicalMoney("6600")).toBe("6600")
    expect(toCanonicalMoney("6600,8")).toBe("6600.8")
    expect(toCanonicalMoney("6600,83")).toBe("6600.83")
  })

  it("acepta punto decimal (forma canónica)", () => {
    expect(toCanonicalMoney("6600.83")).toBe("6600.83")
    expect(toCanonicalMoney("6600.8")).toBe("6600.8")
  })

  it("tolera espacios alrededor y un separador final incompleto", () => {
    expect(toCanonicalMoney("  6600,83  ")).toBe("6600.83")
    expect(toCanonicalMoney("6600,")).toBe("6600")
    expect(toCanonicalMoney("6600.")).toBe("6600")
  })

  it("convierte formato de miles pegado: el último símbolo es el decimal", () => {
    expect(toCanonicalMoney("6.600,83")).toBe("6600.83")
    expect(toCanonicalMoney("1,234.56")).toBe("1234.56")
  })

  it("rechaza texto irrecuperable", () => {
    expect(toCanonicalMoney("")).toBeNull()
    expect(toCanonicalMoney("   ")).toBeNull()
    expect(toCanonicalMoney("abc")).toBeNull()
    expect(toCanonicalMoney("12a34")).toBeNull()
    expect(toCanonicalMoney("1e5")).toBeNull()
    expect(toCanonicalMoney("Infinity")).toBeNull()
    expect(toCanonicalMoney("NaN")).toBeNull()
    expect(toCanonicalMoney("-5")).toBeNull()
    expect(toCanonicalMoney("+5")).toBeNull()
    expect(toCanonicalMoney("6 600")).toBeNull()
  })

  it("rechaza más de 2 posiciones decimales sin recortar", () => {
    expect(toCanonicalMoney("6600.833")).toBeNull()
    expect(toCanonicalMoney("6600,833")).toBeNull()
    expect(toCanonicalMoney("0,005")).toBeNull()
  })

  it("rechaza separadores de miles sueltos o repetidos de más", () => {
    expect(toCanonicalMoney("6,600,83")).toBeNull()
    expect(toCanonicalMoney("6600..83")).toBeNull()
    expect(toCanonicalMoney(",5")).toBeNull()
  })

  it("deja pasar cero y permite que Zod lo rechace después", () => {
    expect(toCanonicalMoney("0")).toBe("0")
    expect(toCanonicalMoney("0,00")).toBe("0.00")
  })
})

describe("sanitizeMoneyInput (estado del input en vivo)", () => {
  it("conserva la coma que tipeó el usuario", () => {
    expect(sanitizeMoneyInput("6600,8")).toBe("6600,8")
    expect(sanitizeMoneyInput("6600,83")).toBe("6600,83")
  })

  it("permite estados intermedios: '6600,' y '6600,8'", () => {
    expect(sanitizeMoneyInput("6600,")).toBe("6600,")
    expect(sanitizeMoneyInput("6600.")).toBe("6600.")
  })

  it("trunca el decimal a 2 posiciones mientras se escribe", () => {
    expect(sanitizeMoneyInput("6600,833")).toBe("6600,83")
    expect(sanitizeMoneyInput("6600.899")).toBe("6600.89")
  })

  it("descarta caracteres inválidos y signos", () => {
    expect(sanitizeMoneyInput("abc")).toBe("")
    expect(sanitizeMoneyInput("-5")).toBe("5")
    expect(sanitizeMoneyInput("$ 6600")).toBe("6600")
    expect(sanitizeMoneyInput("12a34")).toBe("1234")
  })

  it("un segundo separador no mezcla dígitos de los costados", () => {
    expect(sanitizeMoneyInput("6600.8.5")).toBe("6600.85")
    expect(sanitizeMoneyInput("6600,83,7")).toBe("6600,83")
  })

  it("al pegar un monto con miles conserva el valor real", () => {
    expect(sanitizeMoneyInput("6.600,83")).toBe("6600,83")
    expect(sanitizeMoneyInput("1,234.56")).toBe("1234.56")
  })
})

describe("moneyString (Zod) — validación del servidor", () => {
  const parse = (value: unknown) => moneyString.safeParse(value)

  it("acepta 6600, 6600,8, 6600,83 y 6600.83 y normaliza a punto", () => {
    expect(parse("6600")).toEqual({ success: true, data: "6600" })
    expect(parse("6600,8")).toEqual({ success: true, data: "6600.8" })
    expect(parse("6600,83")).toEqual({ success: true, data: "6600.83" })
    expect(parse("6600.83")).toEqual({ success: true, data: "6600.83" })
  })

  it("rechaza cero", () => {
    const zero = parse("0")
    expect(zero.success).toBe(false)
    expect(parse("0,00").success).toBe(false)
  })

  it("rechaza negativos", () => {
    expect(parse("-1").success).toBe(false)
    expect(parse("-6600,83").success).toBe(false)
  })

  it("rechaza más de 2 decimales", () => {
    expect(parse("6600,833").success).toBe(false)
    expect(parse("6600.833").success).toBe(false)
  })

  it("rechaza texto inválido, vacío y no-string", () => {
    expect(parse("abc").success).toBe(false)
    expect(parse("").success).toBe(false)
    expect(parse("   ").success).toBe(false)
    expect(parse("1e5").success).toBe(false)
    expect(parse("Infinity").success).toBe(false)
    expect(parse("NaN").success).toBe(false)
    expect(parse(6600.83).success).toBe(false)
    expect(parse(null).success).toBe(false)
  })

  it("rechaza montos por encima del tope del Decimal(14,2)", () => {
    expect(parse("999999999999.99")).toEqual({
      success: true,
      data: "999999999999.99",
    })
    expect(parse("1000000000000").success).toBe(false)
  })
})

describe("schemas compartidos — pago, deuda y gasto de juntada", () => {
  it("registerPaymentSchema acepta coma decimal", () => {
    const parsed = registerPaymentSchema.safeParse({ amount: "6600,83" })
    expect(parsed).toEqual({
      success: true,
      data: { amount: "6600.83" },
    })
  })

  it("createDebtSchema y editDebtSchema aceptan coma decimal", () => {
    const created = createDebtSchema.safeParse({
      description: "Cena",
      amount: "6600,83",
      paidBy: "me",
    })
    expect(created.success && created.data.amount).toBe("6600.83")

    const edited = editDebtSchema.safeParse({
      transactionId: "txn-1",
      description: "Cena",
      amount: "10,05",
    })
    expect(edited.success && edited.data.amount).toBe("10.05")
  })

  it("expenseMutationSchema acepta coma decimal en monto y partes", () => {
    const parsed = expenseMutationSchema.safeParse({
      gatheringId: "gathering-1",
      title: "Pizza",
      amount: "6600,83",
      payerId: "usr-ana",
      participantIds: ["usr-ana", "usr-beto"],
      splitType: "CUSTOM",
      shares: { "usr-ana": "3300,42", "usr-beto": "3300,41" },
    })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.amount).toBe("6600.83")
      expect(parsed.data.shares).toEqual({
        "usr-ana": "3300.42",
        "usr-beto": "3300.41",
      })
    }
  })

  it("la forma canónica es exactamente lo que espera el regex canónico", () => {
    const canonical = toCanonicalMoney("6600,83")
    expect(canonical).not.toBeNull()
    expect(MONEY_CANONICAL_REGEX.test(canonical as string)).toBe(true)
  })
})
