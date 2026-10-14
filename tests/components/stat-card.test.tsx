// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { ArrowDownLeft } from "lucide-react"
import { StatCard } from "@/components/shared/stat-card"

afterEach(cleanup)

describe("StatCard", () => {
  it("renderiza la etiqueta y el monto", () => {
    render(<StatCard label="Te deben" amount="$5.000" icon={ArrowDownLeft} />)
    expect(screen.getByText("Te deben")).toBeDefined()
    expect(screen.getByText("$5.000")).toBeDefined()
  })

  it("aplica el tono al monto", () => {
    const { rerender } = render(
      <StatCard label="Debés" amount="$1.000" icon={ArrowDownLeft} tone="negative" />,
    )
    expect(screen.getByText("$1.000").className).toContain("text-rose-600")

    rerender(
      <StatCard label="Te deben" amount="$1.000" icon={ArrowDownLeft} tone="positive" />,
    )
    expect(screen.getByText("$1.000").className).toContain("text-emerald-600")
  })

  it("propaga el className de entrada (animación) al contenedor", () => {
    const enter =
      "animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out fill-mode-both motion-reduce:animate-none delay-75"
    const { container } = render(
      <StatCard label="Por confirmar" amount="2" icon={ArrowDownLeft} className={enter} />,
    )
    const card = container.querySelector('[data-slot="card"]')
    expect(card?.className).toContain("animate-in")
    expect(card?.className).toContain("fade-in")
    expect(card?.className).toContain("slide-in-from-bottom-2")
    expect(card?.className).toContain("fill-mode-both")
    expect(card?.className).toContain("delay-75")
    expect(card?.className).toContain("motion-reduce:animate-none")
  })
})
