// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  HAPTIC_CELEBRATION_MS,
  HAPTIC_SUCCESS_MS,
  hapticCelebrate,
  hapticSuccess,
} from "@/lib/haptics"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("haptics", () => {
  it("en un navegador compatible llama a navigator.vibrate con un pulso corto", () => {
    const vibrate = vi.fn().mockReturnValue(true)
    vi.stubGlobal("navigator", { vibrate })

    expect(hapticSuccess()).toBe(true)
    expect(vibrate).toHaveBeenCalledTimes(1)
    expect(vibrate).toHaveBeenCalledWith(HAPTIC_SUCCESS_MS)
    expect(HAPTIC_SUCCESS_MS).toBeGreaterThanOrEqual(20)
    expect(HAPTIC_SUCCESS_MS).toBeLessThanOrEqual(30)
  })

  it("la celebración también usa un pulso único y breve", () => {
    const vibrate = vi.fn().mockReturnValue(true)
    vi.stubGlobal("navigator", { vibrate })

    expect(hapticCelebrate()).toBe(true)
    expect(vibrate).toHaveBeenCalledTimes(1)
    expect(vibrate).toHaveBeenCalledWith(HAPTIC_CELEBRATION_MS)
    expect(HAPTIC_CELEBRATION_MS).toBeGreaterThanOrEqual(20)
    expect(HAPTIC_CELEBRATION_MS).toBeLessThanOrEqual(30)
  })

  it("si el navegador no tiene vibrate no falla y no hace nada", () => {
    vi.stubGlobal("navigator", {})

    expect(() => hapticSuccess()).not.toThrow()
    expect(hapticSuccess()).toBe(false)
  })

  it("es SSR-safe: no toca navigator si no existe", async () => {
    vi.resetModules()
    vi.stubGlobal("navigator", undefined)

    const mod = await import("@/lib/haptics")
    expect(() => mod.hapticSuccess()).not.toThrow()
    expect(mod.hapticSuccess()).toBe(false)
  })

  it("si vibrate lanza, se traga el error y no rompe el flujo", () => {
    const vibrate = vi.fn(() => {
      throw new Error("bloqueado")
    })
    vi.stubGlobal("navigator", { vibrate })

    expect(() => hapticSuccess()).not.toThrow()
    expect(hapticSuccess()).toBe(false)
  })
})
