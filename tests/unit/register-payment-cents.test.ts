import { beforeEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import { registerPayment } from "@/actions/transactions"

const { prisma: prismaMock, tx } = vi.hoisted(() => {
  const tx = {
    $queryRaw: vi.fn(),
    transaction: { create: vi.fn(), updateMany: vi.fn() },
    notification: { create: vi.fn(), updateMany: vi.fn() },
  }
  return {
    tx,
    prisma: {
      $transaction: vi.fn(),
      user: { findUnique: vi.fn() },
    },
  }
})

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }))
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("@/lib/push/send", () => ({
  sendPushToUser: vi.fn(),
  sendPushToUsers: vi.fn(),
}))
vi.mock("@/queries/friendships", () => ({ getFriendshipBetween: vi.fn() }))
vi.mock("@/queries/transactions", () => ({
  primeBalanceBetween: vi.fn(),
  primePendingOutgoingPaymentsSum: vi.fn(),
}))

const { auth } = await import("@/lib/auth")
const { getFriendshipBetween } = await import("@/queries/friendships")
const { primeBalanceBetween, primePendingOutgoingPaymentsSum } = await import(
  "@/queries/transactions"
)

const SELF_ID = "usr-tino"
const FRIEND_ID = "usr-jose"

function signInAs(userId: string | null) {
  vi.mocked(auth).mockResolvedValue(
    userId ? ({ user: { id: userId } } as never) : (null as never),
  )
}

/** Deuda de Tino hacia José de 6600.83 (balance desde la perspectiva de Tino). */
function oweToFriend(amount = "-6600.83") {
  vi.mocked(primeBalanceBetween).mockResolvedValue(
    new Prisma.Decimal(amount) as never,
  )
  vi.mocked(primePendingOutgoingPaymentsSum).mockResolvedValue(
    new Prisma.Decimal(0) as never,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  signInAs(SELF_ID)
  vi.mocked(getFriendshipBetween).mockResolvedValue({
    id: "fr-1",
    requesterId: SELF_ID,
    addresseeId: FRIEND_ID,
  } as never)
  prismaMock.user.findUnique
    .mockResolvedValueOnce({ id: FRIEND_ID, name: "José" } as never) // requireAcceptedFriend
    .mockResolvedValueOnce({ name: "Tino" } as never) // selfName
  tx.$queryRaw.mockResolvedValue([{ id: "fr-1" }]) // lockFriendshipPair
  tx.transaction.create.mockResolvedValue({ id: "txn-pago" } as never)
  tx.notification.create.mockResolvedValue({} as never)
  prismaMock.$transaction.mockImplementation(
    async (fn: (client: typeof tx) => Promise<unknown>) => fn(tx),
  )
  oweToFriend()
})

async function lastCreatedAmount(): Promise<Prisma.Decimal> {
  const call = tx.transaction.create.mock.calls.at(-1)
  expect(call).toBeDefined()
  return (call as unknown as [{ data: { amount: Prisma.Decimal } }])[0].data
    .amount
}

describe("registerPayment · montos con centavos", () => {
  it("registra 6600,83 (coma argentina) como Decimal 6600.83", async () => {
    const result = await registerPayment({ userId: FRIEND_ID, amount: "6600,83" })

    expect(result).toEqual({
      ok: true,
      message: "Pago de $6.600,83 registrado",
    })

    const amount = await lastCreatedAmount()
    expect(amount).toBeInstanceOf(Prisma.Decimal)
    expect(amount.toString()).toBe("6600.83")
    expect(tx.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          amount: expect.any(Prisma.Decimal),
          type: "PAYMENT",
          status: "PENDING",
        }),
      }),
    )
  })

  it("acepta 6600,8 / 6600.8 y guarda 6600.8", async () => {
    for (const raw of ["6600,8", "6600.8"]) {
      vi.clearAllMocks()
      signInAs(SELF_ID)
      vi.mocked(getFriendshipBetween).mockResolvedValue({ id: "fr-1" } as never)
      prismaMock.user.findUnique
        .mockResolvedValueOnce({ id: FRIEND_ID, name: "José" } as never)
        .mockResolvedValueOnce({ name: "Tino" } as never)
      tx.$queryRaw.mockResolvedValue([{ id: "fr-1" }])
      tx.transaction.create.mockResolvedValue({ id: "txn-pago" } as never)
      tx.notification.create.mockResolvedValue({} as never)
      prismaMock.$transaction.mockImplementation(
        async (fn: (client: typeof tx) => Promise<unknown>) => fn(tx),
      )
      oweToFriend()

      const result = await registerPayment({ userId: FRIEND_ID, amount: raw })
      expect(result.ok).toBe(true)
      expect((await lastCreatedAmount()).toString()).toBe("6600.8")
    }
  })

  it("acepta 6600 sin decimales", async () => {
    const result = await registerPayment({ userId: FRIEND_ID, amount: "6600" })

    expect(result.ok).toBe(true)
    expect((await lastCreatedAmount()).toString()).toBe("6600")
  })

  it("acepta exactamente el máximo 6600,83 (no lo rechaza por comparación)", async () => {
    oweToFriend("-6600.83")

    const result = await registerPayment({
      userId: FRIEND_ID,
      amount: "6600,83",
    })

    expect(result.ok).toBe(true)
    expect(tx.transaction.create).toHaveBeenCalledTimes(1)
  })

  it("rechaza 6600,84 cuando el máximo es 6600.83 y no crea el pago", async () => {
    oweToFriend("-6600.83")

    const result = await registerPayment({
      userId: FRIEND_ID,
      amount: "6600,84",
    })

    expect(result).toEqual({
      ok: false,
      code: "over_limit",
      message: "Supera el máximo. Podés pagar hasta $6.600,83.",
    })
    expect(tx.transaction.create).not.toHaveBeenCalled()
  })

  it("descuenta pagos pendientes: pide 6500 exacto cuando debe 6600.83 y tiene 100.83 pendiente", async () => {
    vi.mocked(primeBalanceBetween).mockResolvedValue(
      new Prisma.Decimal("-6600.83") as never,
    )
    vi.mocked(primePendingOutgoingPaymentsSum).mockResolvedValue(
      new Prisma.Decimal("100.83") as never,
    )

    const exact = await registerPayment({ userId: FRIEND_ID, amount: "6500" })
    expect(exact.ok).toBe(true)
    expect((await lastCreatedAmount()).toString()).toBe("6500")
  })

  it("rechaza cero", async () => {
    const result = await registerPayment({ userId: FRIEND_ID, amount: "0" })

    expect(result).toEqual({ ok: false, code: "invalid", message: "Datos inválidos" })
    expect(tx.transaction.create).not.toHaveBeenCalled()
  })

  it("rechaza negativos", async () => {
    for (const raw of ["-1", "-6600,83"]) {
      const result = await registerPayment({ userId: FRIEND_ID, amount: raw })
      expect(result).toEqual({ ok: false, code: "invalid", message: "Datos inválidos" })
    }
    expect(tx.transaction.create).not.toHaveBeenCalled()
  })

  it("rechaza más de 2 decimales", async () => {
    for (const raw of ["6600,833", "6600.833"]) {
      const result = await registerPayment({ userId: FRIEND_ID, amount: raw })
      expect(result).toEqual({ ok: false, code: "invalid", message: "Datos inválidos" })
    }
    expect(tx.transaction.create).not.toHaveBeenCalled()
  })

  it("rechaza texto inválido", async () => {
    for (const raw of ["abc", "", "1e5", "Infinity", "NaN"]) {
      const result = await registerPayment({ userId: FRIEND_ID, amount: raw })
      expect(result).toEqual({ ok: false, code: "invalid", message: "Datos inválidos" })
    }
    expect(tx.transaction.create).not.toHaveBeenCalled()
  })
})
