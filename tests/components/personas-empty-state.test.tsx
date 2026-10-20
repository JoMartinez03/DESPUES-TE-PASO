// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import PersonasPage from "@/app/(app)/personas/page"
import type {
  FriendWithBalance,
  IncomingRequest,
  OutgoingRequest,
} from "@/queries/friendships"

const { authMock, getFriends, getIncomingRequests, getOutgoingRequests } =
  vi.hoisted(() => ({
    authMock: vi.fn(),
    getFriends: vi.fn(),
    getIncomingRequests: vi.fn(),
    getOutgoingRequests: vi.fn(),
  }))

vi.mock("@/lib/auth", () => ({ auth: authMock }))
vi.mock("@/queries/friendships", () => ({
  getFriends,
  getIncomingRequests,
  getOutgoingRequests,
}))

// Los sheets y cards reales tienen Server Actions / navegación; acá sólo
// interesa qué empty state se decide renderizar y qué CTA lleva.
vi.mock("@/components/friends/add-friend-sheet", () => ({
  AddFriendSheet: () => (
    <button type="button" data-testid="add-friend">
      Agregar amigo
    </button>
  ),
}))
vi.mock("@/components/friends/friend-card", () => ({
  FriendCard: ({ friend }: { friend: FriendWithBalance }) => (
    <div data-testid="friend-card">{friend.name}</div>
  ),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const user = { id: "u1", name: "Tino", username: "tino", avatar: null }

function friend(name: string): FriendWithBalance {
  return {
    id: `f-${name}`,
    name,
    username: name.toLowerCase(),
    avatar: null,
    transferAlias: null,
    friendshipId: `fr-${name}`,
    friendsSince: new Date("2026-01-01T00:00:00Z"),
    balance: { amount: new Prisma.Decimal(0), currency: "ARS" },
  }
}

function setup({
  friends = [] as FriendWithBalance[],
  incoming = [] as IncomingRequest[],
  outgoing = [] as OutgoingRequest[],
} = {}) {
  authMock.mockResolvedValue({ user })
  getFriends.mockResolvedValue(friends)
  getIncomingRequests.mockResolvedValue(incoming)
  getOutgoingRequests.mockResolvedValue(outgoing)
}

describe("Personas — empty state", () => {
  it("sin amigos muestra el título, el texto acordado y el CTA de agregar", async () => {
    setup()
    render(await PersonasPage())

    expect(screen.getByText("Todavía no agregaste amigos")).toBeDefined()
    expect(
      screen.getByText("Agregá a alguien para empezar a llevar sus cuentas."),
    ).toBeDefined()
    expect(screen.getAllByTestId("add-friend").length).toBeGreaterThan(0)
  })

  it("con amigos NO muestra el empty state y sí las cards", async () => {
    setup({ friends: [friend("Beto"), friend("Caro")] })
    render(await PersonasPage())

    expect(screen.queryByText("Todavía no agregaste amigos")).toBeNull()
    expect(screen.getAllByTestId("friend-card")).toHaveLength(2)
    expect(screen.getByText("Beto")).toBeDefined()
    expect(screen.getByText("Caro")).toBeDefined()
  })

  it("el CTA de agregar también está disponible en el header", async () => {
    setup()
    render(await PersonasPage())

    // Header + empty state comparten el mismo flujo de agregar amigo.
    expect(screen.getAllByTestId("add-friend")).toHaveLength(2)
  })
})
