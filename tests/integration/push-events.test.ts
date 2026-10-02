import { beforeEach, expect, it, vi } from "vitest"
import { prisma } from "@/lib/prisma"
import { confirmPayment, createDebt, rejectPayment, registerPayment } from "@/actions/transactions"
import { sendFriendRequest } from "@/actions/friendships"
import { createExpense } from "@/actions/expenses"
import { closeGathering } from "@/actions/gatherings"
import {
  disablePushNotifications,
  enablePushNotifications,
} from "@/actions/push"
import type { PushMessage } from "@/lib/push/messages"
import {
  acceptFriendship,
  baseExpenseInput,
  createActiveGathering,
  createUser,
  describeIntegration,
  signInAs,
  useCleanDatabase,
} from "./helpers/db"

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

// vi.mock se hoistea arriba de todo el archivo: los mocks tienen que existir
// antes de que se evalúe el import de las actions.
const push = vi.hoisted(() => ({
  sendPushToUser: vi.fn<(userId: string, message: PushMessage) => Promise<void>>(),
  sendPushToUsers: vi.fn<(userIds: string[], message: PushMessage) => Promise<void>>(),
}))

vi.mock("@/lib/push/send", () => push)

const { sendPushToUser, sendPushToUsers } = push

beforeEach(() => {
  sendPushToUser.mockReset()
  sendPushToUsers.mockReset()
  sendPushToUser.mockResolvedValue(undefined)
  sendPushToUsers.mockResolvedValue(undefined)
})

function lastMessage(): PushMessage {
  const call = sendPushToUser.mock.calls.at(-1)
  if (!call) throw new Error("no se envió ningún push")
  return call[1]
}

async function seedPair() {
  const ana = await createUser("Ana")
  const tino = await createUser("Tino")
  await acceptFriendship(ana.id, tino.id)
  return { ana, tino }
}

/** Ana le presta $5.000 a Tino: Tino es el deudor y Ana la acreedora. */
async function seedDebtOwedByTino(amount = "5000.00") {
  const pair = await seedPair()
  await signInAs(pair.ana.id)
  await createDebt({
    userId: pair.tino.id,
    description: "Cerveza",
    amount,
    paidBy: "me",
  })
  return pair
}

describeIntegration("push: eventos económicos", () => {
  useCleanDatabase()

  it("CASO 1 · una deuda avisa solo al otro usuario, con el actor en el cuerpo", async () => {
    const { ana, tino } = await seedPair()
    await signInAs(ana.id)

    const result = await createDebt({
      userId: tino.id,
      description: "Cerveza",
      amount: "5000.00",
      paidBy: "me",
    })

    expect(result.ok).toBe(true)
    expect(sendPushToUser).toHaveBeenCalledTimes(1)
    // Recipient = Tino; el cuerpo habla de Ana, que es quien la registró.
    expect(sendPushToUser.mock.calls[0]?.[0]).toBe(tino.id)
    expect(lastMessage()).toEqual({
      title: "Deuda registrada",
      body: "Ana registró una deuda de $5.000 con vos.",
      url: `/personas/${ana.id}`,
    })
  })

  it("CASO 9 · el cuerpo nombra al actor aunque el acreedor sea el otro", async () => {
    const { ana, tino } = await seedPair()
    await signInAs(ana.id)

    // Ana registra que Tino pagó: Tino queda como acreedor, pero el actor sigue
    // siendo Ana porque fue quien creó el movimiento.
    await createDebt({
      userId: tino.id,
      description: "Cerveza",
      amount: "5000.00",
      paidBy: "friend",
    })

    expect(sendPushToUser.mock.calls[0]?.[0]).toBe(tino.id)
    expect(lastMessage().body).toContain("Ana")
    expect(lastMessage().body).not.toContain("Tino")
  })

  it("CASO 2 · un pago pendiente avisa al acreedor", async () => {
    const { ana, tino } = await seedDebtOwedByTino()
    await signInAs(tino.id)
    sendPushToUser.mockClear()

    const result = await registerPayment({ userId: ana.id, amount: "5000.00" })

    expect(result.ok).toBe(true)
    expect(sendPushToUser).toHaveBeenCalledTimes(1)
    expect(sendPushToUser.mock.calls[0]?.[0]).toBe(ana.id)
    expect(lastMessage()).toEqual({
      title: "Pago pendiente",
      body: "Tino dice que te pagó $5.000.",
      url: `/personas/${tino.id}`,
    })
  })

  it("CASO 3 · confirmar un pago avisa a quien lo registró", async () => {
    const { ana, tino } = await seedDebtOwedByTino()
    await signInAs(tino.id)
    await registerPayment({ userId: ana.id, amount: "5000.00" })

    const payment = await prisma.transaction.findFirstOrThrow({
      where: { type: "PAYMENT" },
    })
    sendPushToUser.mockClear()
    await signInAs(ana.id)

    const result = await confirmPayment({ transactionId: payment.id })

    expect(result.ok).toBe(true)
    // Quien confirma es Ana (la acreedora); el aviso va a Tino, que registró el pago.
    expect(sendPushToUser.mock.calls[0]?.[0]).toBe(tino.id)
    expect(lastMessage()).toEqual({
      title: "Pago confirmado",
      body: "Ana confirmó tu pago de $5.000.",
      url: `/personas/${ana.id}`,
    })
  })

  it("CASO 4 · rechazar un pago avisa a quien lo registró", async () => {
    const { ana, tino } = await seedDebtOwedByTino()
    await signInAs(tino.id)
    await registerPayment({ userId: ana.id, amount: "5000.00" })

    const payment = await prisma.transaction.findFirstOrThrow({
      where: { type: "PAYMENT" },
    })
    sendPushToUser.mockClear()
    await signInAs(ana.id)

    const result = await rejectPayment({ transactionId: payment.id })

    expect(result.ok).toBe(true)
    expect(sendPushToUser.mock.calls[0]?.[0]).toBe(tino.id)
    expect(lastMessage()).toEqual({
      title: "Pago rechazado",
      body: "Ana rechazó tu pago de $5.000.",
      url: `/personas/${ana.id}`,
    })
  })

  it("CASO 8 · el push se manda recién cuando la deuda ya está commiteada", async () => {
    const { ana, tino } = await seedPair()
    await signInAs(ana.id)

    // Dentro del mock del push se mira la base: si la deuda todavía no
    // estuviera commiteada, el aviso podría llegar por un cambio que después
    // se revierte.
    let visibleWhenPushed: string[] = []
    sendPushToUser.mockImplementation(async () => {
      const rows = await prisma.transaction.findMany({
        where: { type: "DEBT" },
        select: { description: true },
      })
      visibleWhenPushed = rows.map((row) => row.description)
    })

    const result = await createDebt({
      userId: tino.id,
      description: "Cerveza",
      amount: "5000.00",
      paidBy: "me",
    })

    expect(result.ok).toBe(true)
    expect(visibleWhenPushed).toEqual(["Cerveza"])
    const debt = await prisma.transaction.findFirstOrThrow({
      where: { type: "DEBT" },
    })
    expect(debt.amount.toString()).toBe("5000.00")
    expect(debt.debtorId).toBe(tino.id)
    expect(debt.creditorId).toBe(ana.id)
  })
})

describeIntegration("push: solicitud de amistad", () => {
  useCleanDatabase()

  it("CASO 5 · avisa al destinatario, no al solicitante", async () => {
    const ana = await createUser("Ana")
    const tino = await createUser("Tino")
    await signInAs(ana.id)

    const result = await sendFriendRequest({ userId: tino.id })

    expect(result.ok).toBe(true)
    expect(sendPushToUser).toHaveBeenCalledTimes(1)
    expect(sendPushToUser.mock.calls[0]?.[0]).toBe(tino.id)
    expect(lastMessage()).toEqual({
      title: "Solicitud de amistad",
      body: "Ana quiere agregarte como amigo.",
      url: "/personas",
    })
  })

  it("no duplica el push al reenviar la misma solicitud", async () => {
    const ana = await createUser("Ana")
    const tino = await createUser("Tino")
    await signInAs(ana.id)

    await sendFriendRequest({ userId: tino.id })
    sendPushToUser.mockClear()
    const second = await sendFriendRequest({ userId: tino.id })

    expect(second.ok).toBe(true)
    expect(sendPushToUser).not.toHaveBeenCalled()
  })
})

describeIntegration("push: juntadas", () => {
  useCleanDatabase()

  it("un gasto nuevo avisa a los demás participantes", async () => {
    const ana = await createUser("Ana")
    const tino = await createUser("Tino")
    const caro = await createUser("Caro")
    const gatheringId = await createActiveGathering(ana.id, [tino.id, caro.id])
    await signInAs(ana.id)

    const result = await createExpense(
      baseExpenseInput(gatheringId, ana.id, [tino.id, caro.id]),
    )

    expect(result.ok).toBe(true)
    expect(sendPushToUsers).toHaveBeenCalledTimes(1)
    const [recipients, message] = sendPushToUsers.mock.calls[0] as unknown as [
      string[],
      PushMessage,
    ]
    expect(recipients.sort()).toEqual([tino.id, caro.id].sort())
    expect(recipients).not.toContain(ana.id)
    expect(message.title).toBe("Nuevo gasto")
    expect(message.url).toBe(`/juntadas/${gatheringId}`)
  })

  it("cerrar la juntada avisa a los participantes, no al creador", async () => {
    const ana = await createUser("Ana")
    const tino = await createUser("Tino")
    const gatheringId = await createActiveGathering(ana.id, [tino.id])
    await signInAs(ana.id)

    const result = await closeGathering({ gatheringId })

    expect(result.ok).toBe(true)
    const [recipients, message] = sendPushToUsers.mock.calls[0] as unknown as [
      string[],
      PushMessage,
    ]
    expect(recipients).toEqual([tino.id])
    expect(message.title).toBe("Juntada cerrada")
    expect(message.body).toContain("Ana")
    expect(message.url).toBe(`/juntadas/${gatheringId}`)
  })

  it("cerrar una juntada ya cerrada no vuelve a avisar", async () => {
    const ana = await createUser("Ana")
    const tino = await createUser("Tino")
    await signInAs(ana.id)
    const gatheringId = await createActiveGathering(ana.id, [tino.id])

    await closeGathering({ gatheringId })
    sendPushToUsers.mockClear()

    const second = await closeGathering({ gatheringId })

    expect(second.ok).toBe(true)
    expect(sendPushToUsers).not.toHaveBeenCalled()
  })
})

describeIntegration("push: suscripciones y dispositivos", () => {
  useCleanDatabase()

  const subscription = (endpoint: string) => ({
    endpoint,
    keys: { p256dh: "p256dh-key", auth: "auth-key" },
  })

  it("CASO 6 · guarda una suscripción distinta por dispositivo", async () => {
    const ana = await createUser("Ana")
    await signInAs(ana.id)

    await enablePushNotifications(subscription("https://fcm.example/iphone"))
    await enablePushNotifications(subscription("https://fcm.example/notebook"))

    const rows = await prisma.pushSubscription.findMany({
      where: { userId: ana.id },
      orderBy: { endpoint: "asc" },
    })
    expect(rows.map((row) => row.endpoint)).toEqual([
      "https://fcm.example/iphone",
      "https://fcm.example/notebook",
    ])
    // El fan-out a todos los dispositivos se cubre en tests/unit/push-send.
  })

  it("no acepta un userId del cliente: la suscripción va a la sesión", async () => {
    const ana = await createUser("Ana")
    const tino = await createUser("Tino")
    await signInAs(ana.id)

    await enablePushNotifications({
      ...subscription("https://fcm.example/x"),
      userId: tino.id,
    } as never)

    const rows = await prisma.pushSubscription.findMany()
    expect(rows).toHaveLength(1)
    expect(rows[0]?.userId).toBe(ana.id)
  })

  it("reutiliza la fila si el mismo navegador vuelve a suscribirse", async () => {
    const ana = await createUser("Ana")
    await signInAs(ana.id)

    await enablePushNotifications(subscription("https://fcm.example/iphone"))
    await enablePushNotifications(subscription("https://fcm.example/iphone"))

    expect(await prisma.pushSubscription.count()).toBe(1)
  })

  it("CASO 10 · desactivar en un dispositivo no borra los demás", async () => {
    const ana = await createUser("Ana")
    await signInAs(ana.id)
    await enablePushNotifications(subscription("https://fcm.example/iphone"))
    await enablePushNotifications(subscription("https://fcm.example/notebook"))

    const result = await disablePushNotifications({
      endpoint: "https://fcm.example/iphone",
    })

    expect(result.ok).toBe(true)
    const remaining = await prisma.pushSubscription.findMany()
    expect(remaining).toHaveLength(1)
    expect(remaining[0]?.endpoint).toBe("https://fcm.example/notebook")
  })

  it("no puede dar de baja la suscripción de otro usuario", async () => {
    const ana = await createUser("Ana")
    const tino = await createUser("Tino")
    await signInAs(tino.id)
    await enablePushNotifications(subscription("https://fcm.example/ana"))
    sendPushToUser.mockClear()

    await signInAs(ana.id)
    await disablePushNotifications({ endpoint: "https://fcm.example/ana" })

    expect(
      await prisma.pushSubscription.count({ where: { userId: tino.id } }),
    ).toBe(1)
  })

  it("borrar el usuario arrastra sus suscripciones", async () => {
    const ana = await createUser("Ana")
    await signInAs(ana.id)
    await enablePushNotifications(subscription("https://fcm.example/iphone"))

    await prisma.user.delete({ where: { id: ana.id } })

    expect(await prisma.pushSubscription.count()).toBe(0)
  })
})