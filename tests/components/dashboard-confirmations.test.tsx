// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import { Confirmations } from "@/components/dashboard/confirmations"
import type { ConfirmationItem } from "@/queries/dashboard"
import { toast } from "@/components/ui/toast"

const { confirmPayment, rejectPayment } = vi.hoisted(() => ({
  confirmPayment: vi.fn(),
  rejectPayment: vi.fn(),
}))

vi.mock("@/actions/transactions", () => ({ confirmPayment, rejectPayment }))
vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function item(id: string, payer: string, amount: string): ConfirmationItem {
  return {
    id,
    amount: new Prisma.Decimal(amount),
    currency: "ARS",
    payer: {
      id: `usr-${payer.toLowerCase()}`,
      name: payer,
      username: payer.toLowerCase(),
      avatar: null,
    },
  }
}

describe("Confirmaciones", () => {
  it("sin confirmaciones no renderiza la Card", () => {
    const { container } = render(<Confirmations items={[]} />)

    expect(container.firstChild).toBeNull()
    expect(screen.queryByText("Confirmaciones")).toBeNull()
  })

  it("muestra remitente, monto y ambos botones por fila", () => {
    render(
      <Confirmations items={[item("txn-1", "Juanma", "5000")]} />,
    )

    expect(screen.getByText("Confirmaciones")).toBeDefined()
    expect(screen.getByText("Juanma")).toBeDefined()
    expect(screen.getByText(/Te envió un pago de \$5\.000/)).toBeDefined()
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDefined()
    expect(screen.getByRole("button", { name: "Rechazar" })).toBeDefined()
  })

  it("Confirmar reutiliza confirmPayment y muestra el resultado", async () => {
    confirmPayment.mockResolvedValue({ ok: true, message: "Pago confirmado" })
    render(<Confirmations items={[item("txn-1", "Juanma", "5000")]} />)

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    await waitFor(() =>
      expect(confirmPayment).toHaveBeenCalledWith({ transactionId: "txn-1" }),
    )
    expect(rejectPayment).not.toHaveBeenCalled()
    expect(toast).toHaveBeenCalledWith({
      title: "Pago confirmado",
      description: "Pago confirmado",
    })
  })

  it("Rechazar reutiliza rejectPayment", async () => {
    rejectPayment.mockResolvedValue({ ok: true, message: "Pago rechazado" })
    render(<Confirmations items={[item("txn-1", "Juanma", "5000")]} />)

    await userEvent.click(screen.getByRole("button", { name: "Rechazar" }))

    await waitFor(() =>
      expect(rejectPayment).toHaveBeenCalledWith({ transactionId: "txn-1" }),
    )
    expect(confirmPayment).not.toHaveBeenCalled()
  })

  it("mientras una acción está en vuelo, la fila queda bloqueada", async () => {
    confirmPayment.mockReturnValue(new Promise(() => {}))
    render(<Confirmations items={[item("txn-1", "Juanma", "5000")]} />)

    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)
    for (const button of buttons) expect(button).toBeDisabled()
  })
})
