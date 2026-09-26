import { describe, expect, it } from "vitest"
import { firstName } from "@/lib/names"

describe("firstName", () => {
  it("devuelve el nombre de pila", () => {
    expect(firstName("Alice")).toBe("Alice")
    expect(firstName("Bob")).toBe("Bob")
    expect(firstName("Ana María López")).toBe("Ana")
  })

  it("cae al nombre completo cuando no hay un nombre de pila usable", () => {
    expect(firstName("")).toBe("")
    expect(firstName("   ")).toBe("   ")
    expect(firstName(" Ana")).toBe("Ana")
  })
})
