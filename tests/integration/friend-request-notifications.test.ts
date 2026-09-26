import { expect, it, vi } from "vitest"
import { prisma } from "@/lib/prisma"
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from "@/actions/friendships"
import { createDebt, registerPayment } from "@/actions/transactions"
import { getRecentNotifications } from "@/queries/notifications"
import {
  acceptFriendship,
  createPendingFriendship,
  createUser,
  describeIntegration,
  signInAs,
  useCleanDatabase,
} from "./helpers/db"

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

async function seedAliceAndBob() {
  const alice = await createUser("Alice")
  const bob = await createUser("Bob")
  return { alice, bob }
}

describeIntegration("notificaciones de amistad: actor y recipient", () => {
  useCleanDatabase()

  it("la solicitud nombra a quien la envía, no a quien la recibe", async () => {
    const { alice, bob } = await seedAliceAndBob()
    await signInAs(alice.id)

    const result = await sendFriendRequest({ userId: bob.id })

    expect(result).toEqual({
      ok: true,
      message: "Solicitud enviada a Bob",
    })

    const notifications = await prisma.notification.findMany()
    expect(notifications).toHaveLength(1)
    // Recipient = Bob (quien recibe), y el body habla de Alice (el actor).
    expect(notifications[0]?.userId).toBe(bob.id)
    expect(notifications[0]?.type).toBe("FRIEND_REQUEST")
    expect(notifications[0]?.title).toBe("Solicitud de amistad")
    expect(notifications[0]?.body).toBe("Alice quiere agregarte como amigo")
    expect(notifications[0]?.body).not.toContain("Bob")
  })

  it("la aceptación nombra a quien acepta, que es el actor", async () => {
    const { alice, bob } = await seedAliceAndBob()
    const { id } = await createPendingFriendship(alice.id, bob.id)
    await signInAs(bob.id)

    const result = await acceptFriendRequest({ friendshipId: id })

    expect(result).toEqual({ ok: true })

    const accepted = await prisma.notification.findMany({
      where: { title: "Solicitud aceptada" },
    })
    expect(accepted).toHaveLength(1)
    // Recipient = Alice (qu envió la solicitud), el body habla de Bob (actor).
    expect(accepted[0]?.userId).toBe(alice.id)
    expect(accepted[0]?.body).toBe("Ahora vos y Bob son amigos 🎉")
    expect(accepted[0]?.body).not.toContain("Alice")
  })

  it("al aceptar se marca como leída la solicitud que tenía el recipient", async () => {
    const { alice, bob } = await seedAliceAndBob()
    const { id } = await createPendingFriendship(alice.id, bob.id)
    await prisma.notification.create({
      data: {
        userId: bob.id,
        type: "FRIEND_REQUEST",
        title: "Solicitud de amistad",
        body: "Alice quiere agregarte como amigo",
        relatedFriendshipId: id,
      },
    })
    await signInAs(bob.id)

    await acceptFriendRequest({ friendshipId: id })

    const pending = await prisma.notification.findFirstOrThrow({
      where: { userId: bob.id, type: "FRIEND_REQUEST" },
    })
    expect(pending.read).toBe(true)
  })
})

describeIntegration("notificaciones de amistad: idempotencia", () => {
  useCleanDatabase()

  it("aceptar dos veces seguidas notifica una sola vez", async () => {
    const { alice, bob } = await seedAliceAndBob()
    const { id } = await createPendingFriendship(alice.id, bob.id)
    await signInAs(bob.id)

    const first = await acceptFriendRequest({ friendshipId: id })
    const second = await acceptFriendRequest({ friendshipId: id })

    expect(first).toEqual({ ok: true })
    expect(second).toEqual({ ok: true, message: "Ya son amigos" })
    expect(
      await prisma.notification.count({ where: { title: "Solicitud aceptada" } }),
    ).toBe(1)
  })

  it("dos aceptaciones concurrentes generan una sola notificación", async () => {
    const { alice, bob } = await seedAliceAndBob()
    const { id } = await createPendingFriendship(alice.id, bob.id)
    await signInAs(bob.id)

    // Clics simultáneos: con el update por id (sin guarda de status) ambas
    // transacciones leen PENDING y ambas notificaban.
    const [a, b] = await Promise.all([
      acceptFriendRequest({ friendshipId: id }),
      acceptFriendRequest({ friendshipId: id }),
    ])

    expect([a.ok, b.ok]).toEqual([true, true])
    const accepted = await prisma.notification.findMany({
      where: { title: "Solicitud aceptada" },
    })
    expect(accepted).toHaveLength(1)
    expect(accepted[0]?.userId).toBe(alice.id)

    const friendship = await prisma.friendship.findUniqueOrThrow({
      where: { id },
    })
    expect(friendship.status).toBe("ACCEPTED")
  })

  it("rechazar después de aceptar no pisa el estado ni notifica", async () => {
    const { alice, bob } = await seedAliceAndBob()
    const { id } = await createPendingFriendship(alice.id, bob.id)
    await signInAs(bob.id)

    await acceptFriendRequest({ friendshipId: id })
    const rejected = await rejectFriendRequest({ friendshipId: id })

    expect(rejected.ok).toBe(false)
    const friendship = await prisma.friendship.findUniqueOrThrow({
      where: { id },
    })
    expect(friendship.status).toBe("ACCEPTED")
    expect(
      await prisma.notification.count({ where: { title: "Solicitud aceptada" } }),
    ).toBe(1)
  })

  it("enviar dos veces la misma solicitud no duplica la notificación", async () => {
    const { alice, bob } = await seedAliceAndBob()
    await signInAs(alice.id)

    await sendFriendRequest({ userId: bob.id })
    await sendFriendRequest({ userId: bob.id })

    expect(await prisma.notification.count()).toBe(1)
  })

  it("reenviar una amistad rechazada crea una notificación nueva para el recipient", async () => {
    const { alice, bob } = await seedAliceAndBob()
    const { id } = await createPendingFriendship(alice.id, bob.id)
    await prisma.notification.create({
      data: {
        userId: bob.id,
        type: "FRIEND_REQUEST",
        title: "Solicitud de amistad",
        body: "Alice quiere agregarte como amigo",
        relatedFriendshipId: id,
        read: true,
      },
    })
    await signInAs(bob.id)
    await rejectFriendRequest({ friendshipId: id })

    // Ahora manda Alice al revés: reabre la amistad y hay que avisar de nuevo.
    await signInAs(alice.id)
    const result = await sendFriendRequest({ userId: bob.id })
    expect(result.ok).toBe(true)

    const requests = await prisma.notification.findMany({
      where: { type: "FRIEND_REQUEST" },
    })
    expect(requests).toHaveLength(1)
    expect(requests[0]?.read).toBe(false)
    expect(requests[0]?.body).toBe("Alice quiere agregarte como amigo")
  })
})

describeIntegration("notificaciones de amistad: autorización y destino", () => {
  useCleanDatabase()

  it("no se puede aceptar una solicitud dirigida a otro", async () => {
    const { alice, bob } = await seedAliceAndBob()
    const carol = await createUser("Carol")
    const { id } = await createPendingFriendship(alice.id, bob.id)
    await signInAs(carol.id)

    const result = await acceptFriendRequest({ friendshipId: id })

    expect(result).toEqual({
      ok: false,
      code: "not_found",
      message: "La solicitud no existe",
    })
    expect(await prisma.notification.count()).toBe(0)
    const friendship = await prisma.friendship.findUniqueOrThrow({ where: { id } })
    expect(friendship.status).toBe("PENDING")
  })

  it("no te podés agregar a vos mismo", async () => {
    const { alice } = await seedAliceAndBob()
    await signInAs(alice.id)

    const result = await sendFriendRequest({ userId: alice.id })

    expect(result).toEqual({
      ok: false,
      code: "self",
      message: "No podés agregarte a vos mismo",
    })
    expect(await prisma.notification.count()).toBe(0)
  })

  it("las notificaciones de amistad apuntan a la lista de solicitudes", async () => {
    const { alice, bob } = await seedAliceAndBob()
    await signInAs(alice.id)
    await sendFriendRequest({ userId: bob.id })

    const forBob = await getRecentNotifications(bob.id)
    expect(forBob).toHaveLength(1)
    expect(forBob[0]?.relatedFriendshipId).not.toBeNull()
    // Antes daba null y la campana caía al fallback genérico.
    expect(forBob[0]?.href).toBe("/personas")

    const forAlice = await getRecentNotifications(alice.id)
    expect(forAlice).toHaveLength(0)
  })
})

describeIntegration("auditoría: las notificaciones económicas no cambian", () => {
  useCleanDatabase()

  it("la deuda nombra a quien la registró", async () => {
    const { alice, bob } = await seedAliceAndBob()
    await acceptFriendship(alice.id, bob.id)
    await signInAs(alice.id)

    const result = await createDebt({
      userId: bob.id,
      amount: "10.00",
      description: "Cerveza",
      paidBy: "me",
    })
    expect(result.ok).toBe(true)

    const [notification] = await prisma.notification.findMany()
    expect(notification?.userId).toBe(bob.id)
    expect(notification?.body).toContain("Alice")
    expect(notification?.body).not.toContain("Bob agregó")
  })

  it("el pago pendiente nombra a quien pagó y avisa a quien debe confirmar", async () => {
    const { alice, bob } = await seedAliceAndBob()
    await acceptFriendship(alice.id, bob.id)
    await prisma.transaction.create({
      data: {
        creatorId: alice.id,
        debtorId: bob.id,
        creditorId: alice.id,
        amount: "10.00",
        description: "Cerveza",
        type: "DEBT",
        status: "CONFIRMED",
        pendingConfirmationFromId: alice.id,
        confirmedAt: new Date(),
      },
    })
    await prisma.notification.deleteMany()
    await signInAs(bob.id)

    const result = await registerPayment({
      userId: alice.id,
      amount: "10.00",
    })
    expect(result.ok).toBe(true)

    const [notification] = await prisma.notification.findMany()
    expect(notification?.userId).toBe(alice.id)
    expect(notification?.type).toBe("TRANSACTION_PENDING")
    expect(notification?.body).toContain("Bob")
  })
})
