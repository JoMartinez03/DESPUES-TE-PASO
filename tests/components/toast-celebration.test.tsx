// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { act } from "react"
import { afterEach, describe, expect, it } from "vitest"
import { Toaster, celebrateSettled, toast } from "@/components/ui/toast"

afterEach(() => cleanup())

describe("toast · microcelebración '¡Están a mano!'", () => {
  it("muestra el título con el nombre del par y el mensaje", async () => {
    render(<Toaster />)
    act(() => celebrateSettled({ peerName: "Lauti" }))

    await waitFor(() =>
      expect(screen.getByText("¡Vos y Lauti están a mano!")).toBeDefined(),
    )
    expect(screen.getByText("Ya no tienen cuentas pendientes.")).toBeDefined()
  })

  it("sin nombre cae al copy genérico", async () => {
    render(<Toaster />)
    act(() => celebrateSettled({}))

    await waitFor(() => expect(screen.getByText("¡Están a mano!")).toBeDefined())
    expect(screen.getByText("Ya no tienen cuentas pendientes.")).toBeDefined()
  })

  it("el toast normal sigue funcionando sin el enriquecido", async () => {
    render(<Toaster />)
    act(() => toast({ title: "Deuda eliminada", description: "Listo" }))

    await waitFor(() =>
      expect(screen.getByText("Deuda eliminada")).toBeDefined(),
    )
    expect(screen.getByText("Listo")).toBeDefined()
  })
})
