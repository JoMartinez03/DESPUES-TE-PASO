import { describe, expect, it } from "vitest"
import {
  MAX_TRANSFER_ALIAS_LENGTH,
  transferAliasSchema,
} from "@/lib/validations/profile"

function parse(value: string) {
  return transferAliasSchema.safeParse({ transferAlias: value })
}

function alias(value: string): string | null {
  const result = parse(value)
  if (!result.success) throw new Error(`"${value}" no debería ser inválido`)
  return result.data.transferAlias
}

function message(value: string): string {
  const result = parse(value)
  if (result.success) throw new Error(`"${value}" no debería ser inválido`)
  return result.error.issues[0]?.message ?? ""
}

describe("transferAliasSchema", () => {
  it("acepta los formatos de alias que se usan en Argentina", () => {
    expect(alias("tino.mp")).toBe("tino.mp")
    expect(alias("padre.mp")).toBe("padre.mp")
    expect(alias("montana.uala")).toBe("montana.uala")
    expect(alias("alias_con-guion.2024")).toBe("alias_con-guion.2024")
    expect(alias("Tino.Nguyen")).toBe("Tino.Nguyen")
    expect(alias("a1.b2")).toBe("a1.b2")
  })

  it("hace trim y nunca guarda cadena vacía", () => {
    expect(alias("  tino.mp  ")).toBe("tino.mp")
    expect(alias("tino.mp ")).toBe("tino.mp")
    expect(alias("")).toBeNull()
    expect(alias("   ")).toBeNull()
    expect(alias("\n")).toBeNull()
  })

  it("rechaza espacios internos", () => {
    expect(parse("tino mp").success).toBe(false)
    expect(parse("tino  mp").success).toBe(false)
    expect(parse("tino .mp").success).toBe(false)
    expect(message("tino mp")).toBe(
      "El alias no puede tener espacios. Usá letras, números, punto, guion o guion bajo.",
    )
  })

  it("rechaza saltos de línea dentro del valor", () => {
    expect(parse("tino.mp\notra.linea").success).toBe(false)
    expect(parse("tino\r\nmp").success).toBe(false)
    expect(parse("linea1\nlinea2.mp").success).toBe(false)
  })

  it("rechaza caracteres fuera del alfabeto del alias", () => {
    for (const value of [
      "tino@mp",
      "tino mp",
      "tino/mp",
      "tino+mp",
      "tino#mp",
      "tino(mp)",
      "tino.mp!",
      "tino%20mp",
      "ñandu.mp",
    ]) {
      expect(parse(value).success).toBe(false)
    }
  })

  it("rechaza valores demasiado cortos", () => {
    expect(parse("a").success).toBe(false)
    expect(parse("a.").success).toBe(false)
    expect(message("a")).toBe("El alias debe tener al menos 3 caracteres")
    expect(alias("a.b")).toBe("a.b")
  })

  it("rechaza valores demasiado largos", () => {
    const largo = `${"a".repeat(MAX_TRANSFER_ALIAS_LENGTH + 1)}.mp`
    expect(parse(largo).success).toBe(false)
    expect(message(largo)).toBe(
      `El alias no puede superar los ${MAX_TRANSFER_ALIAS_LENGTH} caracteres`,
    )
    expect(alias(`a${"b".repeat(MAX_TRANSFER_ALIAS_LENGTH - 1)}`)).toHaveLength(
      MAX_TRANSFER_ALIAS_LENGTH,
    )
  })

  it("no acepta el alias fuera del objeto", () => {
    expect(transferAliasSchema.safeParse({}).success).toBe(false)
    expect(transferAliasSchema.safeParse({ transferAlias: null }).success).toBe(
      false,
    )
  })

  it("descarta el userId que venga del cliente", () => {
    const parsed = transferAliasSchema.safeParse({
      transferAlias: "tino.mp",
      userId: "usr-de-otro",
    })

    expect(parsed.success).toBe(true)
    expect(parsed.success && parsed.data).toEqual({ transferAlias: "tino.mp" })
  })
})