import { beforeEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"

const { friendshipFindMany, userFindMany, userFindUnique, netBalancesForUser } =
  vi.hoisted(() => ({
    friendshipFindMany: vi.fn(),
    userFindMany: vi.fn(),
    userFindUnique: vi.fn(),
    netBalancesForUser: vi.fn(),
  }))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    friendship: { findMany: friendshipFindMany },
    user: { findMany: userFindMany, findUnique: userFindUnique },
  },
}))

vi.mock("@/queries/transactions", () => ({
  netBalancesForUser,
  maxPayableBetween: vi.fn(),
}))

const { getFriends } = await import("@/queries/friendships")

const SELF = "usr-ana"

function friendship(
  requester: { id: string; name: string; transferAlias?: string | null },
  addressee: { id: string; name: string; transferAlias?: string | null },
) {
  const shape = (u: { id: string; name: string; transferAlias?: string | null }) => ({
    id: u.id,
    name: u.name,
    username: u.name.toLowerCase(),
    avatar: null,
    transferAlias: u.transferAlias ?? null,
  })
  return {
    id: `f-${requester.id}-${addressee.id}`,
    requesterId: requester.id,
    addresseeId: addressee.id,
    createdAt: new Date("2026-01-01"),
    requester: shape(requester),
    addressee: shape(addressee),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  netBalancesForUser.mockResolvedValue(
    new Map([
      ["usr-tino", new Prisma.Decimal("5000")],
      ["usr-caro", new Prisma.Decimal("-20000")],
    ]),
  )
  friendshipFindMany.mockResolvedValue([
    friendship(
      { id: SELF, name: "Ana" },
      { id: "usr-tino", name: "Tino", transferAlias: "tino.mp" },
    ),
    friendship(
      { id: "usr-caro", name: "Caro", transferAlias: "caro.uala" },
      { id: SELF, name: "Ana" },
    ),
    friendship(
      { id: SELF, name: "Ana" },
      { id: "usr-luis", name: "Luis" },
    ),
  ])
})

describe("getFriends · alias de transferencia", () => {
  it("CASO 6: trae el alias de cada amigo en la información del amigo", async () => {
    const friends = await getFriends(SELF)

    const byId = new Map(friends.map((friend) => [friend.id, friend]))
    expect(byId.get("usr-tino")?.transferAlias).toBe("tino.mp")
    expect(byId.get("usr-caro")?.transferAlias).toBe("caro.uala")
    // Sin alias configurado viaja como null, no undefined.
    expect(byId.get("usr-luis")?.transferAlias).toBeNull()
  })

  it("CASO 11: el alias viene en la query de amistades, sin una query por amigo", async () => {
    await getFriends(SELF)

    expect(friendshipFindMany).toHaveBeenCalledTimes(1)
    expect(netBalancesForUser).toHaveBeenCalledTimes(1)

    const query = friendshipFindMany.mock.calls[0][0]
    expect(query.include.requester.select).toMatchObject({
      transferAlias: true,
    })
    expect(query.include.addressee.select).toMatchObject({
      transferAlias: true,
    })

    // N+1: ninguna consulta extra por amigo.
    expect(userFindUnique).not.toHaveBeenCalled()
    expect(userFindMany).not.toHaveBeenCalled()
  })

  it("no filtra ni expone el alias en la búsqueda de personas", async () => {
    const { searchUsers } = await import("@/queries/friendships")
    userFindMany.mockResolvedValue([])

    await searchUsers("tino", SELF)

    const query = userFindMany.mock.calls[0][0]
    expect(query.where.OR).toEqual([
      { name: { contains: "tino", mode: "insensitive" } },
      { username: { contains: "tino", mode: "insensitive" } },
    ])
    expect(JSON.stringify(query.select)).not.toContain("transferAlias")
  })
})