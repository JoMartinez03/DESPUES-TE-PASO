import { beforeEach, expect, it, vi } from "vitest"
import { prisma } from "@/lib/prisma"
import { createDebt } from "@/actions/transactions"
import { sendDebtReminder } from "@/actions/reminders"
import type { PushMessage } from "@/lib/push/messages"
import type { PushSendSummary } from "@/lib/push/send"
import {
  acceptFriendship,
  createUser,
  describeIntegration,
  signInAs,
  useCleanDatabase,
} from "./helpers/db"

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

// vi.mock se hoistea arriba de todo el archivo: el mock tiene que existir
// antes de que se evalúe el import de la action.
const push = vi.hoisted(() => ({
  sendPushToUser: vi.fn<(userId: string, message: PushMessage) => Promise<PushSendSummary>>(),
  sendPushToUsers: vi.fn<() => Promise<void>>(),
}))

vi.mock("@/lib/push/send", () => push)

const { sendPushToUser } = push

const NO_DEVICES: PushSendSummary = { devices: 0, sent: 0, removed: 0 }
const ONE_DEVICE: PushSendSummary = { devices: 1, sent: 1, removed: 0 }

beforeEach(() => {
  sendPushToUser.mockReset()
  sendPushToUser.mockResolvedValue(ONE_DEVICE)
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

/** Tino le debe $5.000 a Ana. */
async function seedDebtOwedByTino(amount = "5000.00") {
  const pair = await seedPair()
  await signInAs(pair.ana.id)
  await createDebt({
    userId: pair.tino.id,
    description: "Cerveza",
    amount,
    paidBy: "me",
  })
  sendPushToUser.mockClear()
  return pair
}

function reminderNotifications() {
  return prisma.notification.findMany({
    where: { type: "DEBT_REMINDER" },
    orderBy: { createdAt: "asc" },
  })
}

describeIntegration("recordatorio de deuda", () => {
  useCleanDatabase()

  it("envía el recordatorio al deudor con el monto recalculado en servidor", async () => {
    const { ana, tino } = await seedDebtOwedByTino()

    const result = await sendDebtReminder({ userId: tino.id })

    expect(result).toEqual({
      ok: true,
      code: "sent",
      message: "Recordatorio enviado a Tino",
    })
    expect(sendPushToUser).toHaveBeenCalledTimes(1)
    expect(sendPushToUser.mock.calls[0]?.[0]).toBe(tino.id)
    expect(lastMessage()).toEqual({
      title: "Ana te recuerda una deuda 💸",
      body: "Ana te recuerda que le pases los $5.000 que le debés.",
      url: `/personas/${ana.id}`,
    })

    // El aviso queda en la campanita del destinatario, con el mismo texto.
    const friendship = await prisma.friendship.findFirstOrThrow()
    const [notification] = await reminderNotifications()
    expect(notification).toBeDefined()
    expect(notification?.userId).toBe(tino.id)
    expect(notification?.relatedFriendshipId).toBe(friendship.id)
    expect(notification?.title).toBe("Ana te recuerda una deuda 💸")
    expect(notification?.body).toBe(lastMessage().body)
    expect(notification?.read).toBe(false)
  })

  it("es solo un recordatorio: no crea transacciones ni toca los balances", async () => {
    const { tino } = await seedDebtOwedByTino()
    const before = await prisma.transaction.findMany({ orderBy: { id: "asc" } })

    await sendDebtReminder({ userId: tino.id })

    const after = await prisma.transaction.findMany({ orderBy: { id: "asc" } })
    expect(after).toHaveLength(before.length)
    expect(after.map((row) => row.status)).toEqual(before.map((row) => row.status))
    expect(after[0]?.amount.toString()).toBe("5000.00")
  })

  it("no envía si no son amigos", async () => {
    const { ana } = await seedPair()
    const outsider = await createUser("Tercero")
    await signInAs(ana.id)

    const result = await sendDebtReminder({ userId: outsider.id })

    expect(result).toEqual({
      ok: false,
      code: "not_found",
      message: "El usuario no existe o no son amigos",
    })
    expect(sendPushToUser).not.toHaveBeenCalled()
    expect(await reminderNotifications()).toHaveLength(0)
  })

  it("no envía nada si al momento del click ya no hay deuda", async () => {
    const { ana, tino } = await seedPair()
    await signInAs(ana.id)

    const result = await sendDebtReminder({ userId: tino.id })

    expect(result).toEqual({
      ok: false,
      code: "no_debt",
      message: "Ya no hay deuda pendiente",
    })
    expect(sendPushToUser).not.toHaveBeenCalled()
    expect(await reminderNotifications()).toHaveLength(0)
  })

  it("no envía sin sesión", async () => {
    const { tino } = await seedDebtOwedByTino()
    await signInAs(null)

    const result = await sendDebtReminder({ userId: tino.id })

    expect(result).toEqual({
      ok: false,
      code: "unauthorized",
      message: "No estás autenticado",
    })
    expect(sendPushToUser).not.toHaveBeenCalled()
  })

  it("no permite recordarse a uno mismo", async () => {
    const { ana } = await seedDebtOwedByTino()
    await signInAs(ana.id)

    const result = await sendDebtReminder({ userId: ana.id })

    expect(result.ok).toBe(false)
    expect(sendPushToUser).not.toHaveBeenCalled()
  })

  it("el cooldown de 12 h bloquea un segundo recordatorio al mismo destinatario", async () => {
    const { tino } = await seedDebtOwedByTino()

    const first = await sendDebtReminder({ userId: tino.id })
    expect(first.ok).toBe(true)
    sendPushToUser.mockClear()

    const second = await sendDebtReminder({ userId: tino.id })

    expect(second).toEqual({
      ok: false,
      code: "cooldown",
      message: "Ya le enviaste un recordatorio recientemente",
    })
    expect(sendPushToUser).not.toHaveBeenCalled()
    expect(await reminderNotifications()).toHaveLength(1)
  })

  it("el cooldown es direccional: A → B no bloquea el recordatorio opuesto B → A", async () => {
    const { ana, tino } = await seedDebtOwedByTino()

    // 1) Ana (acreedora) recuerda a Tino (deudor): registro con userId = Tino.
    const anaToTino = await sendDebtReminder({ userId: tino.id })
    expect(anaToTino.ok).toBe(true)
    sendPushToUser.mockClear()

    // 2) La deuda se invierte: ahora Ana le debe $1.000 a Tino.
    await signInAs(tino.id)
    await createDebt({
      userId: ana.id,
      description: "Entradas",
      amount: "6000.00",
      paidBy: "me",
    })
    sendPushToUser.mockClear()

    // 3) Tino recuerda a Ana: el registro de Ana → Tino no debe bloquearlo.
    const tinoToAna = await sendDebtReminder({ userId: ana.id })

    expect(tinoToAna).toEqual({
      ok: true,
      code: "sent",
      message: "Recordatorio enviado a Ana",
    })
    expect(sendPushToUser).toHaveBeenCalledTimes(1)
    expect(sendPushToUser.mock.calls[0]?.[0]).toBe(ana.id)
    expect(lastMessage().title).toBe("Tino te recuerda una deuda 💸")
    expect(lastMessage().body).toBe(
      "Tino te recuerda que le pases los $1.000 que le debés.",
    )

    const notifications = await reminderNotifications()
    expect(notifications).toHaveLength(2)
    expect(notifications.map((row) => row.userId).sort()).toEqual(
      [ana.id, tino.id].sort(),
    )
  })

  it("pasa el cooldown cuando el último recordatorio tiene más de 12 h", async () => {
    const { tino } = await seedDebtOwedByTino()

    await sendDebtReminder({ userId: tino.id })
    sendPushToUser.mockClear()
    await prisma.notification.updateMany({
      where: { type: "DEBT_REMINDER" },
      data: { createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000) },
    })

    const result = await sendDebtReminder({ userId: tino.id })

    expect(result.ok).toBe(true)
    expect(sendPushToUser).toHaveBeenCalledTimes(1)
    expect(await reminderNotifications()).toHaveLength(2)
  })

  it("sin suscripciones push avisa en la campanita y no falla", async () => {
    const { tino } = await seedDebtOwedByTino()
    sendPushToUser.mockResolvedValue(NO_DEVICES)

    const result = await sendDebtReminder({ userId: tino.id })

    expect(result).toEqual({
      ok: true,
      code: "no_devices",
      message:
        "Tino no tiene notificaciones activadas; le dejamos el aviso en la campanita",
    })
    // El aviso in-app existe igual: es el respaldo cuando no hay push.
    const notifications = await reminderNotifications()
    expect(notifications).toHaveLength(1)
    expect(notifications[0]?.userId).toBe(tino.id)
  })
})
