/**
 * Determinación de "quedaron a mano" (TAREA 5).
 *
 * El flag `settled` lo calcula el SERVIDOR dentro de la transacción, con
 * `primeBalanceBetween` (misma fuente que el resto de balances). Estos tests
 * verifican la regla exacta —≠0 antes y =0 después— con la secuencia de saldos
 * simulada, para cada acción económica que puede producir esa transición.
 *
 * El detalle de "por qué es confiable" está en el informe y en los comentarios
 * de `src/actions/transactions.ts`.
 */
import { beforeEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import { auth } from "@/lib/auth"
import { confirmPayment, deleteDebt, rejectPayment, updateDebt } from "@/actions/transactions"
import { primeBalanceBetween } from "@/queries/transactions"

const { prisma: prismaMock } = vi.hoisted(() => {
  const mock = {
    transaction: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      updateMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    user: { findUnique: vi.fn() },
    notification: { updateMany: vi.fn(), create: vi.fn() },
    $queryRaw: vi.fn(),
    $transaction: vi.fn(),
  }
  mock.$transaction.mockImplementation((fn: (tx: typeof mock) => unknown) =>
    fn(mock),
  )
  return { prisma: mock }
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

const SELF_ID = "usr-ana"
const FRIEND_ID = "usr-beto"
const dec = (value: string) => new Prisma.Decimal(value)

/**
 * Simula la secuencia de lecturas de saldo: la PRIMERA es el "antes" y la
 * SEGUNDA el "después" (ambas dentro de la misma transacción). Si se pide una
 * tercera, repite la última.
 */
function balanceSequence(...values: Prisma.Decimal[]) {
  const queue = [...values]
  vi.mocked(primeBalanceBetween).mockImplementation(async () =>
    queue.length > 1 ? queue.shift()! : queue[0]!,
  )
}

function signInAs(userId: string | null) {
  vi.mocked(auth).mockResolvedValue(
    userId ? ({ user: { id: userId } } as never) : (null as never),
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  signInAs(SELF_ID)
  prismaMock.transaction.findUnique.mockResolvedValue({
    id: "txn-1",
    type: "PAYMENT",
    status: "PENDING",
    amount: dec("5000"),
    debtorId: FRIEND_ID,
    creditorId: SELF_ID,
    pendingConfirmationFromId: SELF_ID,
  })
  prismaMock.transaction.findMany.mockResolvedValue([])
  prismaMock.transaction.updateMany.mockResolvedValue({ count: 1 })
  prismaMock.transaction.deleteMany.mockResolvedValue({ count: 1 })
  prismaMock.user.findUnique.mockResolvedValue({ name: "Beto" })
  prismaMock.$queryRaw.mockResolvedValue([{ id: "txn-1" }])
  prismaMock.notification.updateMany.mockResolvedValue({ count: 1 })
  prismaMock.notification.create.mockResolvedValue({ id: "notif-1" })
})

describe("confirmPayment · settled", () => {
  it("≠0 antes y =0 después => settled con el par y el nombre", async () => {
    balanceSequence(dec("5000"), dec("0"))

    const result = await confirmPayment({ transactionId: "txn-1" })

    expect(result.ok).toBe(true)
    expect(result.ok && result.settled).toEqual({
      peerId: FRIEND_ID,
      peerName: "Beto",
    })
  })

  it("≠0 antes y ≠0 después => sin settled", async () => {
    balanceSequence(dec("5000"), dec("1500"))

    const result = await confirmPayment({ transactionId: "txn-1" })

    expect(result.ok).toBe(true)
    expect(result.ok && result.settled).toBeUndefined()
  })

  it("=0 antes (aunque quede =0) => sin settled", async () => {
    balanceSequence(dec("0"), dec("0"))

    const result = await confirmPayment({ transactionId: "txn-1" })

    expect(result.ok).toBe(true)
    expect(result.ok && result.settled).toBeUndefined()
  })

  it("error (conflict) => sin settled", async () => {
    prismaMock.transaction.updateMany.mockResolvedValue({ count: 0 })

    const result = await confirmPayment({ transactionId: "txn-1" })

    expect(result.ok).toBe(false)
    expect("settled" in result && result.settled).toBeFalsy()
  })

  it("sin sesión (forbidden) => sin settled y no lee el saldo", async () => {
    signInAs(null)

    const result = await confirmPayment({ transactionId: "txn-1" })

    expect(result.ok).toBe(false)
    expect(primeBalanceBetween).not.toHaveBeenCalled()
  })
})

describe("rejectPayment · settled", () => {
  it("rechazar nunca devuelve settled ni lee el saldo", async () => {
    const result = await rejectPayment({ transactionId: "txn-1" })

    expect(result.ok).toBe(true)
    expect(result.ok && result.settled).toBeUndefined()
    // Sólo confirmar calcula equilibrio: rechazar no toca el balance.
    expect(primeBalanceBetween).not.toHaveBeenCalled()
  })
})

describe("updateDebt · settled", () => {
  beforeEach(() => {
    prismaMock.transaction.findUnique.mockResolvedValue({
      debtorId: FRIEND_ID,
      creditorId: SELF_ID,
    })
  })

  it("editar el monto y dejar el par en 0 => settled", async () => {
    balanceSequence(dec("5000"), dec("0"))

    const result = await updateDebt({
      transactionId: "txn-1",
      description: "Cena",
      amount: "0.01",
    })

    expect(result.ok).toBe(true)
    expect(result.ok && result.settled).toEqual({
      peerId: FRIEND_ID,
      peerName: "Beto",
    })
  })

  it("editar y seguir ≠0 => sin settled", async () => {
    balanceSequence(dec("5000"), dec("3000"))

    const result = await updateDebt({
      transactionId: "txn-1",
      description: "Cena",
      amount: "2000",
    })

    expect(result.ok).toBe(true)
    expect(result.ok && result.settled).toBeUndefined()
  })

  it("forbidden (no es tu deuda) => sin settled", async () => {
    prismaMock.transaction.updateMany.mockResolvedValue({ count: 0 })

    const result = await updateDebt({
      transactionId: "txn-1",
      description: "Cena",
      amount: "2000",
    })

    expect(result.ok).toBe(false)
    expect("settled" in result && result.settled).toBeFalsy()
  })
})

describe("deleteDebt · settled", () => {
  beforeEach(() => {
    prismaMock.transaction.findUnique.mockResolvedValue({
      debtorId: FRIEND_ID,
      creditorId: SELF_ID,
    })
  })

  it("eliminar la última deuda y dejar el par en 0 => settled", async () => {
    balanceSequence(dec("5000"), dec("0"))

    const result = await deleteDebt({ transactionId: "txn-1" })

    expect(result.ok).toBe(true)
    expect(result.ok && result.settled).toEqual({
      peerId: FRIEND_ID,
      peerName: "Beto",
    })
  })

  it("eliminar pero seguir ≠0 => sin settled", async () => {
    balanceSequence(dec("5000"), dec("1000"))

    const result = await deleteDebt({ transactionId: "txn-1" })

    expect(result.ok).toBe(true)
    expect(result.ok && result.settled).toBeUndefined()
  })

  it("forbidden => sin settled", async () => {
    prismaMock.transaction.deleteMany.mockResolvedValue({ count: 0 })

    const result = await deleteDebt({ transactionId: "txn-1" })

    expect(result.ok).toBe(false)
    expect("settled" in result && result.settled).toBeFalsy()
  })
})
