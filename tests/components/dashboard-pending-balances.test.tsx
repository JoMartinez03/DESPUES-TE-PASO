// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import { PendingBalances } from "@/components/dashboard/pending-balances"
import { toast } from "@/components/ui/toast"

vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))

// Clics que llegan al <a> de la fila. Copiar el alias tiene que frenarlos.
const { linkClicks, writeText } = vi.hoisted(() => ({
  linkClicks: [] as string[],
  writeText: vi.fn<(text: string) => Promise<void>>(),
}))

afterEach(() => cleanup())

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a
      data-testid="link"
      href={href}
      onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault() // jsdom no navega; el recorder alcanza para medir.
        linkClicks.push(href)
      }}
    >
      {children}
    </a>
  ),
}))

const ZERO = new Prisma.Decimal(0)
const D = (n: string) => new Prisma.Decimal(n)

describe("PendingBalances", () => {
  it("CASO 1: A tiene balance +5000 con B", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: D("5000"),
          },
        ]}
      />,
    )

    const bLinks = screen.getAllByText("B")
    expect(bLinks.length).toBeGreaterThan(0)
    const amount = screen.getAllByRole("link").filter((el) => {
      const t = el.textContent ?? ""
      return /Te debe \$5\.000/.test(t) && t.includes("B")
    })
    expect(amount).toHaveLength(1)
  })

  it("CASO 2: A tiene balance -5000 con B", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: D("-5000"),
          },
        ]}
      />,
    )

    const bLinks = screen.getAllByText("B")
    expect(bLinks.length).toBeGreaterThan(0)
    const amount = screen.getAllByRole("link").filter((el) => {
      const t = el.textContent ?? ""
      return /Le debés \$5\.000/.test(t) && t.includes("B")
    })
    expect(amount).toHaveLength(1)
  })

  it("CASO 3: A y B tienen balance 0", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: ZERO,
          },
        ]}
      />,
    )

    expect(screen.queryByText("B")).toBeNull()
    expect(screen.getByText("Estás al día")).toBeDefined()
  })

  it("CASO 4: suma verde coincide", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: D("10000"),
          },
          {
            friendId: "c",
            name: "C",
            avatar: null,
            transferAlias: null,
            balance: D("5000"),
          },
          {
            friendId: "d",
            name: "D",
            avatar: null,
            transferAlias: null,
            balance: D("-20000"),
          },
        ]}
      />,
    )

    const b = screen.getAllByRole("link").filter((el) =>
      el.textContent?.trim().startsWith("B"),
    )
    expect(b).toHaveLength(1)
    const c = screen.getAllByRole("link").filter((el) =>
      el.textContent?.trim().startsWith("C"),
    )
    expect(c).toHaveLength(1)
    const d = screen.getAllByRole("link").filter((el) =>
      el.textContent?.trim().startsWith("D"),
    )
    expect(d).toHaveLength(1)
    expect(screen.getByText("Te debe $10.000")).toBeDefined()
    expect(screen.getByText("Te debe $5.000")).toBeDefined()
    expect(screen.getByText("Le debés $20.000")).toBeDefined()
  })

  it("CASO 5: suma roja coincide", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: D("-20000"),
          },
          {
            friendId: "c",
            name: "C",
            avatar: null,
            transferAlias: null,
            balance: D("-10000"),
          },
        ]}
      />,
    )

    expect(screen.getByText("Le debés $20.000")).toBeDefined()
    expect(screen.getByText("Le debés $10.000")).toBeDefined()
  })

  it("CASO 6: sin compensación global", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: D("10000"),
          },
          {
            friendId: "c",
            name: "C",
            avatar: null,
            transferAlias: null,
            balance: D("-10000"),
          },
        ]}
      />,
    )

    expect(screen.getByText("Te debe $10.000")).toBeDefined()
    expect(screen.getByText("Le debés $10.000")).toBeDefined()
  })

  it("CASO 7: PAYMENT PENDING no altera saldo (balance 0 filtrado)", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: ZERO,
          },
        ]}
      />,
    )

    expect(screen.queryByText("B")).toBeNull()
    expect(screen.getByText("Estás al día")).toBeDefined()
  })

  it("CASO 8: deuda + pago confirmado -> saldo 0", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: ZERO,
          },
        ]}
      />,
    )

    expect(screen.queryByText("B")).toBeNull()
    expect(screen.getByText("Estás al día")).toBeDefined()
  })

  it("CASO 9: orden por dirección y monto absoluto", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "B",
            avatar: null,
            transferAlias: null,
            balance: D("5000"),
          },
          {
            friendId: "c",
            name: "C",
            avatar: null,
            transferAlias: null,
            balance: D("15000"),
          },
          {
            friendId: "d",
            name: "D",
            avatar: null,
            transferAlias: null,
            balance: D("-3000"),
          },
          {
            friendId: "e",
            name: "E",
            avatar: null,
            transferAlias: null,
            balance: D("-20000"),
          },
        ]}
      />,
    )

    const links = screen.getAllByTestId("link")
    expect(links).toHaveLength(4)
    const texts = links.map((el) => el.textContent)
    expect(texts[0]).toMatch(/C.*Te debe \$15\.000/)
    expect(texts[1]).toMatch(/B.*Te debe \$5\.000/)
    expect(texts[2]).toMatch(/E.*Le debés \$20\.000/)
    expect(texts[3]).toMatch(/D.*Le debés \$3\.000/)
  })

  it("CASO 10: usa name actual", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "Tino Nguyen",
            avatar: null,
            transferAlias: null,
            balance: D("5000"),
          },
        ]}
      />,
    )

    expect(screen.getByText("Tino Nguyen")).toBeDefined()
    expect(screen.getByText("Te debe $5.000")).toBeDefined()
  })
})

describe("PendingBalances · alias de transferencia", () => {
  beforeEach(() => {
    linkClicks.length = 0
    writeText.mockReset()
    writeText.mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
      writable: true,
    })
  })

  it("CASO 1: sin alias no muestra ni texto ni botón de copiar", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "Tino",
            avatar: null,
            transferAlias: null,
            balance: D("-20000"),
          },
        ]}
      />,
    )

    expect(screen.getByText("Tino")).toBeInTheDocument()
    expect(screen.getByText("Le debés $20.000")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    expect(screen.queryByText(/no configurado/i)).not.toBeInTheDocument()
  })

  it("CASO 6: el alias va debajo del nombre y no compite con el monto", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "Tino",
            avatar: null,
            transferAlias: "tino.mp",
            balance: D("15000"),
          },
        ]}
      />,
    )

    const row = screen.getAllByTestId("link")[0]
    expect(row.textContent).toMatch(/Tino\s*tino\.mp\s*Te debe \$15\.000/)
  })

  it("CASO 7: con balance negativo muestra el botón de copiar", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "c",
            name: "Montana",
            avatar: null,
            transferAlias: "montana.mp",
            balance: D("-20000"),
          },
        ]}
      />,
    )

    expect(screen.getByText("montana.mp")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Copiar alias montana.mp" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Le debés $20.000")).toBeInTheDocument()
  })

  it("CASO 8: con balance positivo el alias es sólo información secundaria", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "Tino",
            avatar: null,
            transferAlias: "tino.mp",
            balance: D("15000"),
          },
        ]}
      />,
    )

    expect(screen.getByText("tino.mp")).toBeInTheDocument()
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })

  it("CASO 9: copiar escribe en el portapapeles y no navega a /personas/[id]", async () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "c",
            name: "Montana",
            avatar: null,
            transferAlias: "montana.mp",
            balance: D("-20000"),
          },
        ]}
      />,
    )

    await userEvent.click(
      screen.getByRole("button", { name: "Copiar alias montana.mp" }),
    )

    expect(writeText).toHaveBeenCalledWith("montana.mp")
    await waitFor(() => expect(toast).toHaveBeenCalledWith({ description: "Alias copiado" }))
    expect(linkClicks).toEqual([])
  })

  it("la fila sigue navegándose cuando se toca fuera del botón de copiar", async () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "c",
            name: "Montana",
            avatar: null,
            transferAlias: "montana.mp",
            balance: D("-20000"),
          },
        ]}
      />,
    )

    await userEvent.click(screen.getByText("Montana"))

    expect(linkClicks).toEqual(["/personas/c"])
    expect(writeText).not.toHaveBeenCalled()
  })
})