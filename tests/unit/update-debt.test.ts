import { beforeEach, describe, expect, it, vi } from "vitest"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { updateDebt } from "@/actions/transactions"

const { prisma: prismaMock } = vi.hoisted(() => ({
  prisma: {
    transaction: {
      findUnique: vi.fn(),
      updateMany: vi.fn(),
    },
    user: { findUnique: vi.fn() },
  },
}))

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

const SELF_ID = "usr-ana"
const FRIEND_ID = "usr-beto"
const TXN_ID = "txn-cena"

function signInAs(userId: string | null) {
  vi.mocked(auth).mockResolvedValue(
    userId ? ({ user: { id: userId } } as never) : (null as never),
  )
}

function revalidatedPaths(): string[] {
  return vi.mocked(revalidatePath).mock.calls.map((call) => call[0] as string)
}

beforeEach(() => {
  vi.clearAllMocks()
  signInAs(SELF_ID)
  prismaMock.transaction.findUnique.mockResolvedValue({
    debtorId: SELF_ID,
    creditorId: FRIEND_ID,
  })
  prismaMock.transaction.updateMany.mockResolvedValue({ count: 1 })
})

describe("updateDebt · autorización en servidor", () => {
  it("sin sesión no toca la base", async () => {
    signInAs(null)

    const result = await updateDebt({
      transactionId: TXN_ID,
      description: "Cena",
      amount: "7500",
    })

    expect(result).toEqual({
      ok: false,
      code: "unauthorized",
      message: "No estás autenticado",
    })
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled()
  })

  it("rechaza datos inválidos sin tocar la base", async () => {
    const result = await updateDebt({
      transactionId: TXN_ID,
      description: "   ",
      amount: "7500",
    })

    expect(result.ok).toBe(false)
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled()
  })

  it("la deuda inexistente responde not_found", async () => {
    prismaMock.transaction.findUnique.mockResolvedValue(null)

    const result = await updateDebt({
      transactionId: "txn-otra",
      description: "Cena",
      amount: "7500",
    })

    expect(result).toEqual({
      ok: false,
      code: "not_found",
      message: "La deuda no existe",
    })
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled()
  })

  it("si el where de autorización no matchea (ajena, PAYMENT o de juntada) responde forbidden y no revalida", async () => {
    prismaMock.transaction.updateMany.mockResolvedValue({ count: 0 })

    const result = await updateDebt({
      transactionId: TXN_ID,
      description: "Cena",
      amount: "7500",
    })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe("forbidden")
    expect(revalidatePath).not.toHaveBeenCalled()
  })

  it("el update lleva SOLO description y amount con el where completo de autorización", async () => {
    const result = await updateDebt({
      transactionId: TXN_ID,
      description: "Pizza",
      amount: "7500",
    })

    expect(result.ok).toBe(true)

    const call = prismaMock.transaction.updateMany.mock.calls[0][0]
    // El where es la autorización: creador = sesión, DEBT, manual (sin juntada).
    expect(call.where).toEqual({
      id: TXN_ID,
      creatorId: SELF_ID,
      type: "DEBT",
      expenseId: null,
    })
    // Únicos campos mutables: debtor/creditor/type/status/creator intactos.
    expect(Object.keys(call.data).sort()).toEqual(["amount", "description"])
    expect(call.data.description).toBe("Pizza")
    expect(call.data.amount.toString()).toBe("7500")
  })

  it("revalida dashboard, personas y la ficha de la contraparte", async () => {
    const result = await updateDebt({
      transactionId: TXN_ID,
      description: "Pizza",
      amount: "7500",
    })

    expect(result.ok).toBe(true)
    expect(revalidatedPaths()).toEqual([
      "/dashboard",
      "/personas",
      `/personas/${FRIEND_ID}`,
    ])
    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout")
  })

  it("comparte la validación monetaria de createDebt: 3 decimales se rechazan", async () => {
    const result = await updateDebt({
      transactionId: TXN_ID,
      description: "Pizza",
      amount: "7500.555",
    })

    expect(result.ok).toBe(false)
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled()
  })
})
