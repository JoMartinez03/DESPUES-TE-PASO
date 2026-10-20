// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import {
  AnimatedValue,
  parseComparableAmount,
} from "@/components/shared/animated-value"

afterEach(cleanup)

/** Devuelve el span interno que dispara la animación (el que lleva data-*). */
function animatedNode() {
  return document.querySelector("[data-animated-value]")
}

describe("parseComparableAmount", () => {
  it("interpreta el formato es-AR de formatMoney ($22.650)", () => {
    expect(parseComparableAmount("$22.650")).toBe(22650)
  })

  it("interpreta decimales con coma ($1.234,50)", () => {
    expect(parseComparableAmount("$1.234,50")).toBe(1234.5)
  })

  it("interpreta el signo negativo (−$500)", () => {
    expect(parseComparableAmount("−$500")).toBe(-500)
  })

  it("devuelve null cuando no hay número comparable", () => {
    expect(parseComparableAmount("—")).toBeNull()
  })
})

describe("AnimatedValue", () => {
  it("no anima el primer render (sin flash al montar)", () => {
    render(<AnimatedValue value="$22.650" />)

    expect(screen.getByText("$22.650")).toBeDefined()
    expect(animatedNode()).toBeNull()
  })

  it("anima cuando el valor aumenta y marca la dirección hacia arriba", () => {
    const { rerender } = render(<AnimatedValue value="$22.650" />)
    rerender(<AnimatedValue value="$30.000" />)

    const node = animatedNode()
    expect(screen.getByText("$30.000")).toBeDefined()
    expect(node?.getAttribute("data-direction")).toBe("up")
  })

  it("anima cuando el valor disminuye y marca la dirección hacia abajo", () => {
    const { rerender } = render(<AnimatedValue value="$22.650" />)
    rerender(<AnimatedValue value="$16.650" />)

    const node = animatedNode()
    expect(screen.getByText("$16.650")).toBeDefined()
    expect(node?.getAttribute("data-direction")).toBe("down")
  })

  it("no anima si el valor se re-renderiza igual", () => {
    const { rerender } = render(<AnimatedValue value="$22.650" />)
    rerender(<AnimatedValue value="$22.650" />)

    expect(screen.getByText("$22.650")).toBeDefined()
    expect(animatedNode()).toBeNull()
  })

  it("deja de animar al terminar la transición", async () => {
    const { rerender } = render(<AnimatedValue value="$22.650" />)
    rerender(<AnimatedValue value="$16.650" />)
    expect(animatedNode()).not.toBeNull()

    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(animatedNode()).toBeNull()
  })

  it("expone el valor actual con aria-live y amortigua el símbolo con tabular-nums", () => {
    const { container } = render(
      <AnimatedValue value="$8.500" label="Te deben" />,
    )

    const live = container.querySelector('[aria-live="polite"]')
    expect(live).not.toBeNull()
    expect(live?.getAttribute("aria-label")).toBe("Te deben: $8.500")
    expect(live?.className).toContain("tabular-nums")
  })

  it("conserva el label accesible al cambiar el valor", () => {
    const { container, rerender } = render(
      <AnimatedValue value="$22.650" label="Debés" />,
    )
    rerender(<AnimatedValue value="$16.650" label="Debés" />)

    const live = container.querySelector('[aria-live="polite"]')
    expect(live?.getAttribute("aria-label")).toBe("Debés: $16.650")
  })
})
