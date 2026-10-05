import { beforeEach, describe, expect, it, vi } from "vitest"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { closeGathering } from "@/actions/gatherings"
import { createDebt } from "@/actions/transactions"
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/actions/friendships"
import { getFriendshipBetween } from "@/queries/friendships"

const { tx, prisma, deleteGatheringDebts } = vi.hoisted(() => {
  const tx = {
    friendship: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
    },
    gathering: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
    notification: {
      create: vi.fn(),
      createMany: vi.fn(),
      updateMany: vi.fn(),
      findFirst: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
    $queryRaw: vi.fn(),
    $queryRawUnsafe: vi.fn(),
  }
  const prisma = {
    user: { findUnique: vi.fn() },
    $transaction: vi.fn(async (fn: (arg: unknown) => unknown) => fn(tx)),
  }
  const deleteGatheringDebts = vi.fn(async () => 0)
  return { tx, prisma, deleteGatheringDebts }
})

vi.mock("@/lib/prisma", () => ({ prisma }))
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/lib/push/send", () => ({
  sendPushToUser: vi.fn(),
  sendPushToUsers: vi.fn(),
}))
vi.mock("@/lib/gatherings/debts", () => ({ deleteGatheringDebts }))
vi.mock("@/queries/friendships", () => ({ getFriendshipBetween: vi.fn() }))
vi.mock("@/queries/transactions", () => ({
  primeBalanceBetween: vi.fn(),
  primePendingOutgoingPaymentsSum: vi.fn(),
}))

const SELF_ID = "usr-ana"
const FRIEND_ID = "usr-beto"

function signInAs(userId: string | null) {
  vi.mocked(auth).mockResolvedValue(
    userId ? ({ user: { id: userId } } as never) : (null as never),
  )
}

function revalidatedPaths(): string[] {
  return vi
    .mocked(revalidatePath)
    .mock.calls.map((call) => (call.length > 1 ? `${call[0]} (${call[1]})` : call[0]))
}

beforeEach(() => {
  vi.clearAllMocks()
  signInAs(SELF_ID)
  prisma.user.findUnique.mockResolvedValue({
    id: FRIEND_ID,
    name: "Beto",
  })
  vi.mocked(getFriendshipBetween).mockResolvedValue({
    id: "frie-1",
    status: "ACCEPTED",
  } as never)
  tx.transaction.create.mockResolvedValue({ id: "txn-1" })
  tx.notification.create.mockResolvedValue({})
  tx.notification.updateMany.mockResolvedValue({ count: 1 })
  tx.notification.findFirst.mockResolvedValue(null)
  tx.friendship.findUnique.mockResolvedValue({
    id: "frie-1",
    addresseeId: SELF_ID,
    requesterId: FRIEND_ID,
    status: "PENDING",
  })
  tx.friendship.updateMany.mockResolvedValue({ count: 1 })
  tx.$queryRaw.mockResolvedValue([{ id: "gath-1" }])
  tx.gathering.findUnique.mockResolvedValue({
    id: "gath-1",
    creatorId: SELF_ID,
    status: "ACTIVE",
    creator: { name: "Ana" },
    participants: [{ userId: SELF_ID }, { userId: FRIEND_ID }],
  })
  tx.gathering.updateMany.mockResolvedValue({ count: 1 })
  tx.notification.createMany.mockResolvedValue({ count: 1 })
  deleteGatheringDebts.mockResolvedValue(2)
  prisma.$transaction.mockImplementation(async (fn) => fn(tx))
})

describe("estrategia de revalidación de mutaciones económicas", () => {
  it("createDebt invalida dashboard, personas y la ficha del amigo", async () => {
    const result = await createDebt({
      userId: FRIEND_ID,
      description: "Cena",
      amount: "1000",
      paidBy: "me",
    })

    expect(result.ok).toBe(true)
    expect(revalidatedPaths()).toEqual([
      "/dashboard",
      "/personas",
      `/personas/${FRIEND_ID}`,
    ])
  })

  it("createDebt no invalida el layout raíz", async () => {
    await createDebt({
      userId: FRIEND_ID,
      description: "Cena",
      amount: "1000",
      paidBy: "me",
    })

    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout")
  })

  it("createDebt sin amigos no revalida nada", async () => {
    vi.mocked(getFriendshipBetween).mockResolvedValue(null as never)

    const result = await createDebt({
      userId: FRIEND_ID,
      description: "Cena",
      amount: "1000",
      paidBy: "me",
    })

    expect(result.ok).toBe(false)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})

describe("estrategia de revalidación de solicitudes de amistad", () => {
  it("acceptFriendRequest invalida dashboard y personas, no el layout raíz", async () => {
    const result = await acceptFriendRequest({ friendshipId: "frie-1" })

    expect(result.ok).toBe(true)
    expect(revalidatedPaths()).toEqual(["/dashboard", "/personas"])
    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout")
  })

  it("rejectFriendRequest invalida sólo personas", async () => {
    const result = await rejectFriendRequest({ friendshipId: "frie-1" })

    expect(result.ok).toBe(true)
    expect(revalidatedPaths()).toEqual(["/personas"])
    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout")
  })
})

describe("estrategia de revalidación al cerrar una juntada", () => {
  it("invalida dashboard, juntadas, personas y la ficha de cada participante", async () => {
    const result = await closeGathering({ gatheringId: "gath-1" })

    expect(result.ok).toBe(true)
    expect(revalidatedPaths()).toEqual([
      "/dashboard",
      "/juntadas",
      "/juntadas/gath-1",
      "/personas",
      `/personas/${FRIEND_ID}`,
    ])
  })

  it("no invalida el layout raíz", async () => {
    await closeGathering({ gatheringId: "gath-1" })

    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout")
  })

  it("no revalida si el cierre falla", async () => {
    tx.gathering.updateMany.mockResolvedValue({ count: 0 })

    const result = await closeGathering({ gatheringId: "gath-1" })

    expect(result.ok).toBe(false)
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
