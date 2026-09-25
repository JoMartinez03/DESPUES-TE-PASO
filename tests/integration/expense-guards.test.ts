import { expect, it, vi } from "vitest"
import { prisma } from "@/lib/prisma"
import { closeGathering, updateGatheringParticipants } from "@/actions/gatherings"
import { createExpense, deleteExpense, updateExpense } from "@/actions/expenses"
import {
  baseExpenseInput,
  createActiveGathering,
  describeIntegration,
  seedTriangle,
  signInAs,
  useCleanDatabase,
} from "./helpers/db"

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

describeIntegration("guards de gastos con juntada cerrada", () => {
  useCleanDatabase()

  async function closedGathering() {
    const { creator, friend, third } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id, third.id])
    await signInAs(creator.id)
    await closeGathering({ gatheringId })
    return { creator, friend, third, gatheringId }
  }

  it("createExpense rechaza y no escribe nada", async () => {
    const { creator, friend, third, gatheringId } = await closedGathering()
    const input = baseExpenseInput(gatheringId, creator.id, [creator.id, friend.id, third.id])

    const result = await createExpense(input)

    expect(result).toMatchObject({ ok: false, code: "closed" })
    expect(await prisma.expense.count()).toBe(0)
    expect(await prisma.transaction.count()).toBe(0)
  })

  it("updateExpense y deleteExpense rechazan un gasto existente", async () => {
    const { creator, friend, third } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id, third.id])
    await signInAs(creator.id)
    const created = await createExpense(
      baseExpenseInput(gatheringId, creator.id, [creator.id, friend.id, third.id]),
    )
    expect(created).toMatchObject({ ok: true })
    const expense = await prisma.expense.findFirstOrThrow({ where: { gatheringId } })
    const debtsBefore = await prisma.transaction.count({ where: { expenseId: expense.id } })
    expect(debtsBefore).toBe(2)

    await signInAs(creator.id)
    await closeGathering({ gatheringId })

    const updated = await updateExpense({
      ...baseExpenseInput(gatheringId, creator.id, [creator.id, friend.id]),
      expenseId: expense.id,
    })
    const deleted = await deleteExpense({ expenseId: expense.id })

    expect(updated).toMatchObject({ ok: false, code: "closed" })
    expect(deleted).toMatchObject({ ok: false, code: "closed" })
    expect(await prisma.transaction.count({ where: { expenseId: expense.id } })).toBe(2)
  })

  it("updateGatheringParticipants rechaza con juntada cerrada", async () => {
    const { friend, gatheringId } = await closedGathering()

    const result = await updateGatheringParticipants({
      gatheringId,
      participantIds: [friend.id],
    })

    expect(result).toMatchObject({ ok: false, code: "closed" })
    const participants = await prisma.gatheringParticipant.findMany({
      where: { gatheringId },
    })
    expect(participants).toHaveLength(3)
  })
})

describeIntegration("gastos con juntada activa", () => {
  useCleanDatabase()

  it("updateExpense reemplaza participants y recalcula las DEBT", async () => {
    const { creator, friend, third } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id, third.id])
    await signInAs(creator.id)

    const created = await createExpense({
      ...baseExpenseInput(gatheringId, creator.id, [creator.id, friend.id, third.id]),
      title: "Cena",
    })
    expect(created.ok).toBe(true)
    const expense = await prisma.expense.findFirstOrThrow({ where: { gatheringId } })

    const updated = await updateExpense({
      gatheringId,
      expenseId: expense.id,
      title: "Cena corregida",
      amount: "30.00",
      payerId: friend.id,
      participantIds: [friend.id, third.id],
      splitType: "CUSTOM",
      shares: { [friend.id]: "20.00", [third.id]: "10.00" },
    })

    expect(updated).toMatchObject({ ok: true })
    const reloaded = await prisma.expense.findUniqueOrThrow({
      where: { id: expense.id },
      include: { participants: true },
    })
    expect(reloaded.title).toBe("Cena corregida")
    expect(reloaded.payerId).toBe(friend.id)
    expect(reloaded.participants.map((p) => p.userId).sort()).toEqual([friend.id, third.id].sort())
    expect(reloaded.participants.map((p) => p.shareAmount.toString()).sort()).toEqual([
      "10",
      "20",
    ])

    const debts = await prisma.transaction.findMany({
      where: { expenseId: expense.id, type: "DEBT" },
      orderBy: { debtorId: "asc" },
    })
    expect(debts).toHaveLength(1)
    expect(debts[0]).toMatchObject({
      debtorId: third.id,
      creditorId: friend.id,
      status: "CONFIRMED",
    })
    expect(debts[0].amount.toString()).toBe("10")
  })

  it("deleteExpense borra las DEBT del gasto y no toca transacciones manuales", async () => {
    const { creator, friend, third } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id, third.id])
    await signInAs(creator.id)
    await createExpense(baseExpenseInput(gatheringId, creator.id, [creator.id, friend.id, third.id]))
    const expense = await prisma.expense.findFirstOrThrow({ where: { gatheringId } })

    const manual = await prisma.transaction.create({
      data: {
        creatorId: creator.id,
        debtorId: friend.id,
        creditorId: creator.id,
        amount: "5.00",
        description: "Deuda manual",
        type: "DEBT",
        status: "CONFIRMED",
        pendingConfirmationFromId: creator.id,
        confirmedAt: new Date(),
      },
    })

    const result = await deleteExpense({ expenseId: expense.id })

    expect(result).toMatchObject({ ok: true })
    expect(await prisma.expense.count()).toBe(0)
    expect(await prisma.transaction.count({ where: { type: "DEBT", expenseId: expense.id } })).toBe(0)
    expect(await prisma.transaction.count({ where: { id: manual.id } })).toBe(1)
  })

  it("createExpense devuelve invalid_shares cuando el custom no cierra", async () => {
    const { creator, friend, third } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id, third.id])
    await signInAs(creator.id)

    const result = await createExpense({
      gatheringId,
      title: "Cena",
      amount: "30.00",
      payerId: creator.id,
      participantIds: [creator.id, friend.id, third.id],
      splitType: "CUSTOM",
      shares: { [creator.id]: "10.00", [friend.id]: "10.00", [third.id]: "5.00" },
    })

    expect(result).toMatchObject({ ok: false, code: "invalid_shares" })
    expect(await prisma.expense.count()).toBe(0)
  })
})
