import { beforeEach, describe, expect, it, vi } from "vitest"
import { revalidatePath } from "next/cache"
import { Prisma } from "@/generated/prisma"
import { auth } from "@/lib/auth"
import { deleteDebt } from "@/actions/transactions"
import { sumSigned } from "@/lib/transactions"

const { prisma: prismaMock } = vi.hoisted(() => ({
  prisma: {
    transaction: {
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
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
  prismaMock.transaction.deleteMany.mockResolvedValue({ count: 1 })
})

describe("deleteDebt · autorización en servidor (misma fuente que updateDebt)", () => {
  it("sin sesión no toca la base", async () => {
    signInAs(null)

    const result = await deleteDebt({ transactionId: TXN_ID })

    expect(result).toEqual({
      ok: false,
      code: "unauthorized",
      message: "No estás autenticado",
    })
    expect(prismaMock.transaction.deleteMany).not.toHaveBeenCalled()
  })

  it("sin transactionId válido no toca la base", async () => {
    const result = await deleteDebt({ transactionId: "" })

    expect(result.ok).toBe(false)
    expect(prismaMock.transaction.deleteMany).not.toHaveBeenCalled()
  })

  it("la deuda inexistente responde not_found", async () => {
    prismaMock.transaction.findUnique.mockResolvedValue(null)

    const result = await deleteDebt({ transactionId: "txn-otra" })

    expect(result).toEqual({
      ok: false,
      code: "not_found",
      message: "La deuda no existe",
    })
    expect(prismaMock.transaction.deleteMany).not.toHaveBeenCalled()
  })

  it("otro usuario que manipula la request no puede eliminar: count 0 => forbidden y no revalida", async () => {
    // El input sólo lleva transactionId: no hay por dónde inyectar creatorId,
    // debtorId, creditorId o monto. El where exige creatorId = sesión.
    prismaMock.transaction.deleteMany.mockResolvedValue({ count: 0 })

    const result = await deleteDebt({ transactionId: TXN_ID })

    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe("forbidden")
    expect(revalidatePath).not.toHaveBeenCalled()

    const call = prismaMock.transaction.deleteMany.mock.calls[0][0]
    expect(call.where.creatorId).toBe(SELF_ID)
  })

  it("un PAYMENT jamás matchea el where (type = DEBT obligatorio)", async () => {
    prismaMock.transaction.deleteMany.mockResolvedValue({ count: 0 })

    const result = await deleteDebt({ transactionId: "txn-pago" })

    expect(result.ok).toBe(false)
    const call = prismaMock.transaction.deleteMany.mock.calls[0][0]
    expect(call.where.type).toBe("DEBT")
    expect(call.where.expenseId).toBeNull()
  })

  it("una DEBT de juntada jamás matchea el where (expenseId = null obligatorio)", async () => {
    prismaMock.transaction.deleteMany.mockResolvedValue({ count: 0 })

    const result = await deleteDebt({ transactionId: "txn-juntada" })

    expect(result.ok).toBe(false)
    const call = prismaMock.transaction.deleteMany.mock.calls[0][0]
    expect(call.where.expenseId).toBeNull()
    expect(call.where.type).toBe("DEBT")
  })

  it("el creador elimina: where idéntico al de edición (creatorId sesión, DEBT, manual)", async () => {
    const result = await deleteDebt({ transactionId: TXN_ID })

    expect(result).toEqual({ ok: true, message: "Deuda eliminada" })

    const call = prismaMock.transaction.deleteMany.mock.calls[0][0]
    expect(call.where).toEqual({
      id: TXN_ID,
      creatorId: SELF_ID,
      type: "DEBT",
      expenseId: null,
    })
    // Sólo se usa findUnique + deleteMany: sin escrituras compensatorias ni
    // saldos almacenados (el mock no expone ninguna otra operación).
    expect(prismaMock.transaction.findUnique).toHaveBeenCalledTimes(1)
  })

  it("revalida dashboard, personas y la ficha de la contraparte", async () => {
    const result = await deleteDebt({ transactionId: TXN_ID })

    expect(result.ok).toBe(true)
    expect(revalidatedPaths()).toEqual([
      "/dashboard",
      "/personas",
      `/personas/${FRIEND_ID}`,
    ])
    expect(revalidatePath).not.toHaveBeenCalledWith("/", "layout")
  })
})

describe("deleteDebt · el balance se recalcula de las filas restantes", () => {
  it("al quitar la deuda, el par cambia exactamente en su monto (saldo derivado, no guardado)", () => {
    const dec = (value: string) => new Prisma.Decimal(value)
    const rows = [
      { type: "DEBT" as const, debtorId: SELF_ID, creditorId: FRIEND_ID, amount: dec("5000") },
      { type: "DEBT" as const, debtorId: FRIEND_ID, creditorId: SELF_ID, amount: dec("1000") },
    ]

    // Convención: deudor negativo, acreedor positivo (lib/transactions).
    const before = sumSigned(rows, SELF_ID)
    expect(before.toString()).toBe("-4000")

    // La deuda eliminada (la de 5000) ya no está entre las filas.
    const remaining = rows.filter((row) => row.amount.toString() !== "5000")
    const after = sumSigned(remaining, SELF_ID)

    expect(after.toString()).toBe("1000")
    expect(after.minus(before).toString()).toBe("5000")
  })
})
