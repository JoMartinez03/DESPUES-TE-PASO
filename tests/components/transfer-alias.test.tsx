// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Link from "next/link"
import { TransferAlias } from "@/components/shared/transfer-alias"
import { toast } from "@/components/ui/toast"

vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))

// Clics que llegan al link de la fila que contiene el alias.
const { rowClicks } = vi.hoisted(() => ({ rowClicks: [] as string[] }))

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a
      data-testid="row"
      href={href}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        rowClicks.push(href)
      }}
    >
      {children}
    </a>
  ),
}))

const writeText = vi.fn<(text: string) => Promise<void>>()

function lastToast() {
  const calls = vi.mocked(toast).mock.calls
  return calls[calls.length - 1]?.[0] as
    | { title?: string; description?: string }
    | undefined
}

beforeEach(() => {
  vi.clearAllMocks()
  rowClicks.length = 0
  writeText.mockReset()
  writeText.mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  })
})

afterEach(() => cleanup())

describe("TransferAlias", () => {
  it("muestra el alias tal cual lo declara el usuario", () => {
    render(<TransferAlias alias="tino.mp" />)

    expect(screen.getByText("tino.mp")).toBeInTheDocument()
  })

  it("CASO 1: sin alias no renderiza nada", () => {
    const { container } = render(<TransferAlias alias={null} />)
    expect(container).toBeEmptyDOMElement()

    render(<TransferAlias alias="" copyable />)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("no muestra botón de copiar cuando no es copyable", () => {
    render(<TransferAlias alias="tino.mp" />)

    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("copia el valor real del alias y avisa que se copió", async () => {
    render(<TransferAlias alias="tino.mp" copyable />)

    await userEvent.click(screen.getByRole("button", { name: /Copiar alias/ }))

    expect(writeText).toHaveBeenCalledWith("tino.mp")
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({ description: "Alias copiado" }),
    )
    // El feedback también cambia el icono del botón.
    expect(lastToast()).toEqual({ description: "Alias copiado" })
  })

  it("copia el alias completo aunque se muestre truncado", async () => {
    const largo = `${"a".repeat(40)}.mp`
    render(<TransferAlias alias={largo} copyable />)

    expect(screen.getByText(largo)).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: /Copiar alias/ }))

    expect(writeText).toHaveBeenCalledWith(largo)
  })

  it("avisa cuando el navegador no deja copiar", async () => {
    writeText.mockRejectedValue(new Error("clipboard blocked"))
    render(<TransferAlias alias="tino.mp" copyable />)

    await userEvent.click(screen.getByRole("button", { name: /Copiar alias/ }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({
        title: "No se pudo copiar",
        description: "Copiá el alias manualmente.",
      }),
    )
  })

  it("no propaga el click: la fila que lo contiene no navega", async () => {
    render(
      <Link href="/personas/usr-tino">
        <TransferAlias alias="tino.mp" copyable />
      </Link>,
    )

    await userEvent.click(screen.getByRole("button", { name: /Copiar alias/ }))

    expect(writeText).toHaveBeenCalledWith("tino.mp")
    expect(rowClicks).toEqual([])
  })

  it("la fila sigue navegándose cuando se toca fuera del botón", async () => {
    render(
      <Link href="/personas/usr-tino">
        <span>Tino</span>
        <TransferAlias alias="tino.mp" copyable />
      </Link>,
    )

    await userEvent.click(screen.getByText("Tino"))

    expect(rowClicks).toEqual(["/personas/usr-tino"])
    expect(writeText).not.toHaveBeenCalled()
  })
})