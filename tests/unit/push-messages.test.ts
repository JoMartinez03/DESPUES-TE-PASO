import { describe, expect, it } from "vitest"
import {
  confirmedPaymentPushMessage,
  debtPushMessage,
  debtReminderPushMessage,
  friendRequestPushMessage,
  gatheringClosedPushMessage,
  newExpensePushMessage,
  pendingPaymentPushMessage,
  rejectedPaymentPushMessage,
} from "@/lib/push/messages"

const actor = { actorId: "actor-1", actorName: "Tino" }

describe("mensajes de push", () => {
  it("usa el apodo del actor, no el username, y apunta a su perfil", () => {
    const message = debtPushMessage(actor, "5000.00")

    expect(message.title).toBe("Deuda registrada")
    expect(message.body).toBe("Tino registró una deuda de $5.000 con vos.")
    expect(message.body).not.toContain("@")
    expect(message.url).toBe("/personas/actor-1")
  })

  it("usa solo el nombre de pila cuando el apodo tiene espacios", () => {
    const message = pendingPaymentPushMessage(
      { actorId: "actor-2", actorName: "Tino Nguyen" },
      "5000.00",
    )

    expect(message.body).toBe("Tino dice que te pagó $5.000.")
  })

  it("el nombre mostrado es el del actor, no el del destinatario", () => {
    const message = debtPushMessage(
      { actorId: "padre", actorName: "Padre" },
      "5000.00",
    )

    // El que registra la deuda es Padre, aunque Tino sea el deudor.
    expect(message.body).toContain("Padre")
    expect(message.body).not.toContain("Tino")
    expect(message.url).toBe("/personas/padre")
  })

  it("reutiliza el formatter ARS sin variantes propias", () => {
    expect(debtPushMessage(actor, "1000").body).toContain("$1.000")
    expect(debtPushMessage(actor, "5500").body).toContain("$5.500")
    expect(debtPushMessage(actor, "28445").body).toContain("$28.445")
  })

  it("describe el pago pendiente", () => {
    expect(pendingPaymentPushMessage(actor, "5000.00")).toEqual({
      title: "Pago pendiente",
      body: "Tino dice que te pagó $5.000.",
      url: "/personas/actor-1",
    })
  })

  it("describe el pago confirmado", () => {
    expect(
      confirmedPaymentPushMessage({ actorId: "p", actorName: "Padre" }, "5000.00"),
    ).toEqual({
      title: "Pago confirmado",
      body: "Padre confirmó tu pago de $5.000.",
      url: "/personas/p",
    })
  })

  it("describe el pago rechazado", () => {
    expect(
      rejectedPaymentPushMessage({ actorId: "p", actorName: "Padre" }, "5000.00"),
    ).toEqual({
      title: "Pago rechazado",
      body: "Padre rechazó tu pago de $5.000.",
      url: "/personas/p",
    })
  })

  it("la solicitud de amistad va al listado, no a un perfil", () => {
    expect(friendRequestPushMessage("Tino")).toEqual({
      title: "Solicitud de amistad",
      body: "Tino quiere agregarte como amigo.",
      url: "/personas",
    })
  })

  it("los avisos de juntada apuntan a la juntada", () => {
    expect(newExpensePushMessage("g-1", "Tino agregó 'Cena' por $5.000")).toEqual({
      title: "Nuevo gasto",
      body: "Tino agregó 'Cena' por $5.000",
      url: "/juntadas/g-1",
    })

    expect(gatheringClosedPushMessage("g-1", "Tino")).toEqual({
      title: "Juntada cerrada",
      body: "Tino cerró la juntada. Las deudas de sus gastos quedaron saldadas.",
      url: "/juntadas/g-1",
    })
  })

  it("el recordatorio de deuda nombra al actor y formatea el monto en ARS", () => {
    expect(
      debtReminderPushMessage({ actorId: "actor-1", actorName: "José Gómez" }, "6000"),
    ).toEqual({
      title: "José te recuerda una deuda 💸",
      body: "José te recuerda que le pases los $6.000 que le debés.",
      url: "/personas/actor-1",
    })
  })

  it("el recordatorio habla del destinatario como deudor, no del actor", () => {
    const message = debtReminderPushMessage(
      { actorId: "acreedor", actorName: "Tino" },
      "6000",
    )

    expect(message.body).toContain("le pases")
    expect(message.body).toContain("que le debés")
    expect(message.body).not.toContain("Tino registró")
    expect(message.url).toBe("/personas/acreedor")
  })

  it("el recordatorio reutiliza el formatter ARS sin variantes propias", () => {
    expect(debtReminderPushMessage(actor, "1000").body).toContain("$1.000")
    expect(debtReminderPushMessage(actor, "28445").body).toContain("$28.445")
  })
})