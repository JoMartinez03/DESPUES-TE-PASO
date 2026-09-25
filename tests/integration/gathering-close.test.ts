import { expect, it, vi } from "vitest"
import { prisma } from "@/lib/prisma"
import { closeGathering } from "@/actions/gatherings"
import {
  createActiveGathering,
  describeIntegration,
  seedTriangle,
  signInAs,
  useCleanDatabase,
} from "./helpers/db"

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

describeIntegration("closeGathering", () => {
  useCleanDatabase()

  it("el creador cierra la juntada y notifica una vez al resto", async () => {
    const { creator, friend, third } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id, third.id])
    await signInAs(creator.id)

    const result = await closeGathering({ gatheringId })

    expect(result).toEqual({ ok: true, message: "Juntada cerrada" })
    const gathering = await prisma.gathering.findUniqueOrThrow({
      where: { id: gatheringId },
    })
    expect(gathering.status).toBe("CLOSED")
    expect(gathering.closedAt).not.toBeNull()

    const notifications = await prisma.notification.findMany({
      where: { relatedGatheringId: gatheringId },
      orderBy: { userId: "asc" },
    })
    expect(notifications.map((n) => n.userId).sort()).toEqual([friend.id, third.id].sort())
    expect(notifications.every((n) => n.type === "GENERAL")).toBe(true)
    expect(notifications.every((n) => n.title === "Juntada cerrada")).toBe(true)
  })

  it("cerrar de nuevo es idempotente y no duplica notificaciones", async () => {
    const { creator, friend } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id])
    await signInAs(creator.id)

    await closeGathering({ gatheringId })
    const second = await closeGathering({ gatheringId })

    expect(second).toEqual({ ok: true, message: "La juntada ya estaba cerrada" })
    const count = await prisma.notification.count({
      where: { relatedGatheringId: gatheringId },
    })
    expect(count).toBe(1)
  })

  it("un participante que no es creador no puede cerrar", async () => {
    const { creator, friend } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id])
    await signInAs(friend.id)

    const result = await closeGathering({ gatheringId })

    expect(result.ok).toBe(false)
    expect(result).toMatchObject({ code: "forbidden" })
    const gathering = await prisma.gathering.findUniqueOrThrow({
      where: { id: gatheringId },
    })
    expect(gathering.status).toBe("ACTIVE")
    expect(gathering.closedAt).toBeNull()
  })

  it("sin sesión responde unauthorized", async () => {
    const { creator, friend } = await seedTriangle()
    const gatheringId = await createActiveGathering(creator.id, [friend.id])
    await signInAs(null)

    const result = await closeGathering({ gatheringId })

    expect(result).toMatchObject({ ok: false, code: "unauthorized" })
  })
})
