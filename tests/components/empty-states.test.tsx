// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { PartyPopper, UserPlus } from "lucide-react"
import { Prisma } from "@/generated/prisma"
import { PendingBalances } from "@/components/dashboard/pending-balances"
import { EmptyState } from "@/components/shared/empty-state"
import { JuntadasList } from "@/components/gatherings/juntadas-list"

// Los sheets reales son flujos completos con Server Actions; acá sólo interesa
// que el empty state los monte como acción (CTA correcto).
vi.mock("@/components/gatherings/create-gathering-sheet", () => ({
  CreateGatheringSheet: ({ triggerVariant }: { triggerVariant?: string }) => (
    <button type="button" data-testid="create-gathering" data-variant={triggerVariant}>
      Nueva juntada
    </button>
  ),
}))

vi.mock("@/components/friends/add-friend-sheet", () => ({
  AddFriendSheet: () => (
    <button type="button" data-testid="add-friend">
      Agregar amigo
    </button>
  ),
}))

vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a data-testid="link" href={href}>
      {children}
    </a>
  ),
}))

afterEach(() => cleanup())

const ZERO = new Prisma.Decimal(0)
const D = (n: string) => new Prisma.Decimal(n)

describe("EmptyState (componente compartido)", () => {
  it("renderiza icono, título y descripción", () => {
    render(
      <EmptyState icon={PartyPopper} title="Título" description="Descripción" />,
    )
    expect(screen.getByText("Título")).toBeDefined()
    expect(screen.getByText("Descripción")).toBeDefined()
  })

  it("renderiza la acción cuando se le pasa", () => {
    render(
      <EmptyState icon={UserPlus} title="Título" action={<button>Hacer algo</button>} />,
    )
    expect(screen.getByRole("button", { name: "Hacer algo" })).toBeDefined()
  })

  it("sin acción no renderiza botón", () => {
    render(<EmptyState icon={UserPlus} title="Título" />)
    expect(screen.queryByRole("button")).toBeNull()
  })
})

describe("Dashboard — Cuentas pendientes (empty state)", () => {
  it("con saldo cero muestra 'Todo saldado 🎉' y el texto acordado", () => {
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

    expect(screen.getByText("Todo saldado 🎉")).toBeDefined()
    expect(screen.getByText("No tenés cuentas pendientes.")).toBeDefined()
    expect(screen.queryByText("Cuentas pendientes")).toBeNull()
    expect(screen.queryByText("B")).toBeNull()
  })

  it("sin items también muestra el estado saldado", () => {
    render(<PendingBalances items={[]} />)
    expect(screen.getByText("Todo saldado 🎉")).toBeDefined()
  })

  it("con balances NO muestra el empty state y sí las cuentas", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "Beto",
            avatar: null,
            transferAlias: null,
            balance: D("5000"),
          },
          {
            friendId: "c",
            name: "Caro",
            avatar: null,
            transferAlias: null,
            balance: D("-2500"),
          },
        ]}
      />,
    )

    expect(screen.queryByText("Todo saldado 🎉")).toBeNull()
    expect(screen.getByText("Cuentas pendientes")).toBeDefined()
    expect(screen.getByText("Beto")).toBeDefined()
    expect(screen.getByText("Caro")).toBeDefined()
  })

  it("mezcla de cero y no-cero: sólo se listan los pendientes", () => {
    render(
      <PendingBalances
        items={[
          {
            friendId: "b",
            name: "Beto",
            avatar: null,
            transferAlias: null,
            balance: D("5000"),
          },
          {
            friendId: "c",
            name: "Saldado",
            avatar: null,
            transferAlias: null,
            balance: ZERO,
          },
        ]}
      />,
    )

    expect(screen.queryByText("Todo saldado 🎉")).toBeNull()
    expect(screen.getByText("Beto")).toBeDefined()
    expect(screen.queryByText("Saldado")).toBeNull()
  })
})

describe("Juntadas — empty state", () => {
  const friends = [
    { id: "f1", name: "Beto", username: "beto", avatar: null },
  ]

  it("sin juntadas muestra el título, la descripción y el CTA de crear", () => {
    render(<JuntadasList gatherings={[]} friends={friends} />)

    expect(screen.getByText("Todavía no hay juntadas")).toBeDefined()
    expect(
      screen.getByText("Creá una para dividir los gastos con tus amigos."),
    ).toBeDefined()
    // Un solo CTA: vive en el empty state, no se duplica en el header.
    expect(screen.getAllByTestId("create-gathering")).toHaveLength(1)
  })

  it("con juntadas NO muestra el empty state y sí la lista", () => {
    render(
      <JuntadasList
        gatherings={[
          {
            id: "g1",
            name: "Asado",
            date: new Date("2026-03-01T00:00:00Z"),
            status: "ACTIVE",
            closedAt: null,
            participantCount: 3,
            expenseCount: 2,
            total: D("12000"),
          },
        ]}
        friends={friends}
      />,
    )

    expect(screen.queryByText("Todavía no hay juntadas")).toBeNull()
    expect(screen.getByText("Asado")).toBeDefined()
    // Acá el CTA vive en el header (ya no hay empty state).
    expect(screen.getAllByTestId("create-gathering")).toHaveLength(1)
  })

  it("con showCreateAction=false (ruta /juntadas/nueva) no duplica el CTA", () => {
    render(
      <JuntadasList gatherings={[]} friends={friends} showCreateAction={false} />,
    )

    expect(screen.getByText("Todavía no hay juntadas")).toBeDefined()
    expect(screen.queryByTestId("create-gathering")).toBeNull()
  })
})
