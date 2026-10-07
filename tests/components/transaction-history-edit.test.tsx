// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Prisma } from "@/generated/prisma"
import { TransactionHistory } from "@/components/transactions/transaction-history"
import { toast } from "@/components/ui/toast"
import type { Movement } from "@/queries/transactions"

const { updateDebt, deleteDebt } = vi.hoisted(() => ({
  updateDebt: vi.fn(),
  deleteDebt: vi.fn(),
}))

vi.mock("@/actions/transactions", () => ({ updateDebt, deleteDebt }))
vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const VIEWER = "usr-ana"
const FRIEND = "usr-beto"

function movement(overrides: Partial<Movement> = {}): Movement {
  return {
    id: "txn-1",
    type: "DEBT",
    status: "CONFIRMED",
    description: "Pizza",
    amount: new Prisma.Decimal("6000"),
    currency: "ARS",
    debtorId: VIEWER,
    creditorId: FRIEND,
    creatorId: VIEWER,
    occurredAt: new Date("2026-01-05"),
    createdAt: new Date("2026-01-05"),
    expense: null,
    ...overrides,
  }
}

function pencilButtons() {
  return screen.queryAllByRole("button", { name: "Editar deuda" })
}

function trashButtons() {
  return screen.queryAllByRole("button", { name: /Eliminar deuda/ })
}

function renderHistory(movements: Movement[]) {
  render(
    <TransactionHistory viewerId={VIEWER} friendName="Beto" movements={movements} />,
  )
}

describe("TransactionHistory · lápiz de edición", () => {
  it("solo la deuda manual propia muestra el lápiz", () => {
    renderHistory([
      movement(),
      movement({ id: "txn-ajena", creatorId: FRIEND }),
      movement({ id: "txn-pago", type: "PAYMENT" }),
      movement({
        id: "txn-juntada",
        expense: { title: "Pizza", gathering: { name: "AFIP" } },
      }),
    ])

    expect(pencilButtons()).toHaveLength(1)
  })

  it("sin deudas editables no hay lápiz", () => {
    renderHistory([
      movement({ id: "txn-pago", type: "PAYMENT" }),
      movement({ id: "txn-ajena", creatorId: FRIEND }),
    ])

    expect(pencilButtons()).toHaveLength(0)
  })

  it("el lápiz abre el Sheet precargado y envía updateDebt con los valores", async () => {
    updateDebt.mockResolvedValue({ ok: true, message: "Deuda actualizada" })
    renderHistory([movement()])

    await userEvent.click(screen.getByRole("button", { name: "Editar deuda" }))

    const description = (await screen.findByLabelText("Concepto")) as HTMLInputElement
    const amount = screen.getByLabelText("Monto") as HTMLInputElement
    expect(description.value).toBe("Pizza")
    expect(amount.value).toBe("6000.00")

    await userEvent.clear(amount)
    await userEvent.type(amount, "7500")
    await userEvent.click(screen.getByRole("button", { name: /Guardar cambios/ }))

    await waitFor(() =>
      expect(updateDebt).toHaveBeenCalledWith({
        transactionId: "txn-1",
        description: "Pizza",
        amount: "7500",
      }),
    )
    expect(toast).toHaveBeenCalledWith({
      title: "Deuda actualizada",
      description: "Deuda actualizada",
    })
  })

  it("muestra el error del servidor en el Sheet", async () => {
    updateDebt.mockResolvedValue({
      ok: false,
      code: "forbidden",
      message: "Solo podés editar deudas que creaste",
    })
    renderHistory([movement()])

    await userEvent.click(screen.getByRole("button", { name: "Editar deuda" }))
    await userEvent.click(await screen.findByRole("button", { name: /Guardar cambios/ }))

    expect(
      await screen.findByText("Solo podés editar deudas que creaste"),
    ).toBeDefined()
    expect(toast).not.toHaveBeenCalled()
  })
})

describe("TransactionHistory · papelera de eliminación", () => {
  it("la papelera aparece solo cuando también corresponde el lápiz", () => {
    renderHistory([
      movement(),
      movement({ id: "txn-ajena", creatorId: FRIEND }),
      movement({ id: "txn-pago", type: "PAYMENT" }),
      movement({
        id: "txn-juntada",
        expense: { title: "Pizza", gathering: { name: "AFIP" } },
      }),
    ])

    expect(pencilButtons()).toHaveLength(1)
    expect(trashButtons()).toHaveLength(1)
  })

  it("sin deudas editables no hay papelera", () => {
    renderHistory([
      movement({ id: "txn-pago", type: "PAYMENT" }),
      movement({ id: "txn-ajena", creatorId: FRIEND }),
    ])

    expect(pencilButtons()).toHaveLength(0)
    expect(trashButtons()).toHaveLength(0)
  })

  it("la confirmación muestra monto y concepto; cancelar no elimina nada", async () => {
    renderHistory([movement()])

    await userEvent.click(
      screen.getByRole("button", { name: "Eliminar deuda de $6.000" }),
    )

    expect(
      await screen.findByText(
        /¿Seguro que querés eliminar esta deuda de \$6\.000\? Esta acción no se puede deshacer\./,
      ),
    ).toBeDefined()
    // Concepto para identificar qué se elimina (fila + resumen del Sheet).
    expect(screen.getAllByText("Pizza").length).toBeGreaterThan(1)

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(deleteDebt).not.toHaveBeenCalled()
    expect(screen.queryByText(/¿Seguro que querés/)).toBeNull()
  })

  it("confirmar elimina con solo transactionId y muestra el toast", async () => {
    deleteDebt.mockResolvedValue({ ok: true, message: "Deuda eliminada" })
    renderHistory([movement()])

    await userEvent.click(
      screen.getByRole("button", { name: "Eliminar deuda de $6.000" }),
    )
    await userEvent.click(
      await screen.findByRole("button", { name: "Eliminar deuda" }),
    )

    await waitFor(() =>
      expect(deleteDebt).toHaveBeenCalledWith({ transactionId: "txn-1" }),
    )
    expect(updateDebt).not.toHaveBeenCalled()
    expect(toast).toHaveBeenCalledWith({
      title: "Deuda eliminada",
      description: "Deuda eliminada",
    })
  })

  it("un error del servidor se muestra en la confirmación", async () => {
    deleteDebt.mockResolvedValue({
      ok: false,
      code: "forbidden",
      message: "Solo podés eliminar deudas que creaste",
    })
    renderHistory([movement()])

    await userEvent.click(
      screen.getByRole("button", { name: "Eliminar deuda de $6.000" }),
    )
    await userEvent.click(
      await screen.findByRole("button", { name: "Eliminar deuda" }),
    )

    expect(
      await screen.findByText("Solo podés eliminar deudas que creaste"),
    ).toBeDefined()
    expect(toast).not.toHaveBeenCalled()
  })
})
