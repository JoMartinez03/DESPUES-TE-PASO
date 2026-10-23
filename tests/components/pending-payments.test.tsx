// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import { PendingPaymentsList } from "@/components/transactions/pending-payments"
import type { PendingPayment } from "@/queries/transactions"
import { toast } from "@/components/ui/toast"

const { confirmPayment, rejectPayment } = vi.hoisted(() => ({
  confirmPayment: vi.fn(),
  rejectPayment: vi.fn(),
}))

const { celebrateSettled } = vi.hoisted(() => ({ celebrateSettled: vi.fn() }))

const { hapticSuccess, hapticCelebrate } = vi.hoisted(() => ({
  hapticSuccess: vi.fn(),
  hapticCelebrate: vi.fn(),
}))

vi.mock("@/actions/transactions", () => ({ confirmPayment, rejectPayment }))
vi.mock("@/components/ui/toast", () => ({
  toast: vi.fn(),
  celebrateSettled,
}))
vi.mock("@/lib/haptics", () => ({ hapticSuccess, hapticCelebrate }))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function payment(
  id: string,
  direction: PendingPayment["direction"] = "incoming",
): PendingPayment {
  return {
    id,
    direction,
    amount: new Prisma.Decimal("3000"),
    currency: "ARS",
    description: "",
    createdAt: new Date("2026-01-01T00:00:00Z"),
  }
}

describe("PendingPaymentsList", () => {
  it("sin items no renderiza la Card", () => {
    const { container } = render(
      <PendingPaymentsList friendName="Juanma" items={[]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it("Confirmar reutiliza confirmPayment y anima la salida al responder ok", async () => {
    confirmPayment.mockResolvedValue({ ok: true, message: "Pago confirmado" })
    const { container } = render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-1")]} />,
    )

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    await waitFor(() =>
      expect(confirmPayment).toHaveBeenCalledWith({ transactionId: "txn-1" }),
    )
    await waitFor(() =>
      expect(container.querySelector('[data-leaving="true"]')).not.toBeNull(),
    )
    const leaving = container.querySelector('[data-leaving="true"]')
    expect(leaving?.className).toContain("row-exit")
  })

  it("vibra una sola vez al confirmar un pago exitoso", async () => {
    confirmPayment.mockResolvedValue({ ok: true, message: "Pago confirmado" })
    render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-1")]} />,
    )

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    await waitFor(() => expect(hapticSuccess).toHaveBeenCalledTimes(1))
    expect(hapticCelebrate).not.toHaveBeenCalled()
  })

  it("si la action lanza, la fila queda visible y sin marcar", async () => {
    confirmPayment.mockRejectedValue(new Error("boom"))
    const { container } = render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-1")]} />,
    )

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({
        description: "No pudimos procesar el pago. Intentá de nuevo.",
      }),
    )
    expect(container.querySelector('[data-leaving="true"]')).toBeNull()
    expect(screen.getByText("Juanma dice que te pagó")).toBeDefined()
  })

  it("un resultado ok:false no saca la fila", async () => {
    confirmPayment.mockResolvedValue({
      ok: false,
      code: "conflict",
      message: "El pago ya no está pendiente",
    })
    const { container } = render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-1")]} />,
    )

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    await waitFor(() => expect(confirmPayment).toHaveBeenCalled())
    expect(container.querySelector('[data-leaving="true"]')).toBeNull()
  })

  it("las filas outgoing no ofrecen botones (no hay acción que animar)", () => {
    render(
      <PendingPaymentsList
        friendName="Juanma"
        items={[payment("txn-1", "outgoing")]}
      />,
    )
    expect(screen.queryByRole("button", { name: "Confirmar" })).toBeNull()
    expect(screen.getByText("Esperando confirmación · $3.000")).toBeDefined()
  })

  it("mientras una acción está en vuelo, la fila queda bloqueada", async () => {
    confirmPayment.mockReturnValue(new Promise(() => {}))
    render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-1")]} />,
    )

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled()
    }
  })

  it("celebra cuando la acción deja el par en 0 (settled)", async () => {
    confirmPayment.mockResolvedValue({
      ok: true,
      message: "Pago confirmado",
      settled: { peerId: "usr-juanma", peerName: "Juanma" },
    })
    render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-1")]} />,
    )

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    await waitFor(() =>
      expect(celebrateSettled).toHaveBeenCalledWith({ peerName: "Juanma" }),
    )
    expect(hapticCelebrate).toHaveBeenCalledTimes(1)
    expect(hapticSuccess).not.toHaveBeenCalled()
  })

  it("NO celebra si la acción no dejó el par en 0", async () => {
    confirmPayment.mockResolvedValue({ ok: true, message: "Pago confirmado" })
    render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-1")]} />,
    )

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))
    await waitFor(() => expect(confirmPayment).toHaveBeenCalled())

    expect(celebrateSettled).not.toHaveBeenCalled()
  })

  it("NO celebra si la acción falla o lanza", async () => {
    confirmPayment.mockResolvedValue({
      ok: false,
      code: "conflict",
      message: "El pago ya no está pendiente",
    })
    const { unmount } = render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-1")]} />,
    )
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))
    await waitFor(() => expect(confirmPayment).toHaveBeenCalled())
    expect(celebrateSettled).not.toHaveBeenCalled()
    unmount()

    confirmPayment.mockRejectedValue(new Error("boom"))
    render(
      <PendingPaymentsList friendName="Juanma" items={[payment("txn-2")]} />,
    )
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))
    await waitFor(() => expect(confirmPayment).toHaveBeenCalled())
    expect(celebrateSettled).not.toHaveBeenCalled()
  })
})
