import { beforeEach, describe, expect, it, vi } from "vitest"

const findMany = vi.fn()
const deleteMany = vi.fn()

vi.mock("@/lib/prisma", () => ({
  prisma: {
    pushSubscription: {
      findMany,
      deleteMany,
    },
  },
}))

const sendNotification = vi.fn()

vi.mock("web-push", () => ({
  default: { sendNotification },
}))

const { safeInternalUrl, sendPushToUser, sendPushToUsers } = await import(
  "@/lib/push/send"
)

const message = {
  title: "Pago pendiente",
  body: "Tino dice que te pagó $5.000.",
  url: "/personas/tino",
}

function subscription(overrides: Partial<{ id: string; endpoint: string }> = {}) {
  return {
    id: overrides.id ?? "sub-1",
    endpoint: overrides.endpoint ?? "https://fcm.example/endpoint-1",
    p256dh: "p256dh-key",
    auth: "auth-key",
  }
}

function statusError(statusCode: number) {
  return Object.assign(new Error("push rejected"), { statusCode })
}

beforeEach(() => {
  vi.clearAllMocks()
  findMany.mockResolvedValue([])
  deleteMany.mockResolvedValue({ count: 0 })
  sendNotification.mockResolvedValue({ statusCode: 201 })
  vi.stubEnv("NEXT_PUBLIC_VAPID_PUBLIC_KEY", "public-key")
  vi.stubEnv("VAPID_PRIVATE_KEY", "private-key")
  vi.stubEnv("VAPID_SUBJECT", "mailto:admin@despuestepaso.app")
})

describe("safeInternalUrl", () => {
  it("deja pasar rutas internas", () => {
    expect(safeInternalUrl("/personas/abc")).toBe("/personas/abc")
  })

  it("bloquea URLs protocol-relative y esquemas peligrosos", () => {
    expect(safeInternalUrl("//evil.example/x")).toBe("/")
    expect(safeInternalUrl("javascript:alert(1)")).toBe("/")
    expect(safeInternalUrl("https://evil.example")).toBe("/")
  })
})

describe("sendPushToUser", () => {
  it("envía a todas las suscripciones del usuario", async () => {
    findMany.mockResolvedValue([
      subscription({ id: "sub-1", endpoint: "https://fcm.example/a" }),
      subscription({ id: "sub-2", endpoint: "https://fcm.example/b" }),
    ])

    const result = await sendPushToUser("user-1", message)

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } }),
    )
    expect(sendNotification).toHaveBeenCalledTimes(2)
    expect(sendNotification.mock.calls.map((call) => call[0].endpoint)).toEqual([
      "https://fcm.example/a",
      "https://fcm.example/b",
    ])
    expect(result).toEqual({ devices: 2, sent: 2, removed: 0 })
    expect(deleteMany).not.toHaveBeenCalled()
  })

  it("envía el payload cifrado con título, cuerpo y ruta interna", async () => {
    findMany.mockResolvedValue([subscription()])

    await sendPushToUser("user-1", message)

    const [, payload, options] = sendNotification.mock.calls[0]
    expect(JSON.parse(payload as string)).toEqual(message)
    expect(options).toMatchObject({
      vapidDetails: {
        subject: "mailto:admin@despuestepaso.app",
        publicKey: "public-key",
        privateKey: "private-key",
      },
    })
  })

  it("borra la suscripción cuyo endpoint ya no existe (404)", async () => {
    findMany.mockResolvedValue([subscription({ id: "sub-dead" })])
    sendNotification.mockRejectedValue(statusError(410))

    const result = await sendPushToUser("user-1", message)

    expect(deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ["sub-dead"] } },
    })
    expect(result).toEqual({ devices: 1, sent: 0, removed: 1 })
  })

  it("no borra la suscripción ante un error que no es 404/410", async () => {
    findMany.mockResolvedValue([subscription()])
    sendNotification.mockRejectedValue(statusError(400))

    const result = await sendPushToUser("user-1", message)

    expect(deleteMany).not.toHaveBeenCalled()
    expect(result).toEqual({ devices: 1, sent: 0, removed: 0 })
  })

  it("no propaga el error cuando el push falla", async () => {
    findMany.mockResolvedValue([subscription()])
    sendNotification.mockRejectedValue(new Error("ECONNRESET"))
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    await expect(sendPushToUser("user-1", message)).resolves.toEqual({
      devices: 1,
      sent: 0,
      removed: 0,
    })
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it("un fallo en un dispositivo no impide enviar a los demás", async () => {
    findMany.mockResolvedValue([
      subscription({ id: "sub-1", endpoint: "https://fcm.example/a" }),
      subscription({ id: "sub-2", endpoint: "https://fcm.example/b" }),
    ])
    sendNotification
      .mockRejectedValueOnce(statusError(410))
      .mockResolvedValueOnce({ statusCode: 201 })

    const result = await sendPushToUser("user-1", message)

    expect(result).toEqual({ devices: 2, sent: 1, removed: 1 })
    expect(deleteMany).toHaveBeenCalledWith({ where: { id: { in: ["sub-1"] } } })
  })

  it("no borra nada cuando el usuario no tiene suscripciones", async () => {
    const result = await sendPushToUser("user-1", message)

    expect(sendNotification).not.toHaveBeenCalled()
    expect(deleteMany).not.toHaveBeenCalled()
    expect(result).toEqual({ devices: 0, sent: 0, removed: 0 })
  })

  it("omite el envío sin fallar cuando faltan las claves VAPID", async () => {
    findMany.mockResolvedValue([subscription()])
    vi.stubEnv("VAPID_PRIVATE_KEY", "")
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    const result = await sendPushToUser("user-1", message)

    expect(sendNotification).not.toHaveBeenCalled()
    expect(result).toMatchObject({ sent: 0, skipped: "not_configured" })
    consoleSpy.mockRestore()
  })

  it("no filtra el endpoint en los logs", async () => {
    findMany.mockResolvedValue([subscription({ endpoint: "https://fcm.example/secreto" })])
    sendNotification.mockRejectedValue(new Error("boom"))
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    await sendPushToUser("user-1", message)

    const logged = consoleSpy.mock.calls.flat().map(String).join(" ")
    expect(logged).not.toContain("secreto")
    expect(logged).toContain("sub-1")
    consoleSpy.mockRestore()
  })
})

describe("sendPushToUsers", () => {
  it("envía a cada destinatario y deduplica", async () => {
    findMany.mockResolvedValue([subscription()])

    await sendPushToUsers(["user-1", "user-2", "user-1"], message)

    expect(findMany).toHaveBeenCalledTimes(2)
    expect(findMany.mock.calls.map((call) => call[0].where.userId)).toEqual([
      "user-1",
      "user-2",
    ])
  })

  it("no hace nada sin destinatarios", async () => {
    await sendPushToUsers([], message)
    expect(findMany).not.toHaveBeenCalled()
  })

  it("no corta el envío de un destinatario si otro falla", async () => {
    findMany
      .mockResolvedValueOnce([subscription()])
      .mockRejectedValueOnce(new Error("db down"))

    await expect(
      sendPushToUsers(["user-1", "user-2"], message),
    ).resolves.toBeUndefined()
    expect(sendNotification).toHaveBeenCalledTimes(1)
  })
})