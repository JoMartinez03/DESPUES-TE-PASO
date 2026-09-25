// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"
import { FabAction } from "@/components/layout/fab-action"
import type { QuickTransactionOptions } from "@/queries/friendships"

afterEach(() => cleanup())

vi.mock("@/components/transactions/add-debt-sheet", () => ({
  AddDebtSheet: ({
    friendName,
    open,
  }: {
    friendName: string
    open?: boolean
  }) => (
    <div data-testid="add-debt" data-open={String(open)} data-friend={friendName} />
  ),
}))

vi.mock("@/components/transactions/register-payment-sheet", () => ({
  RegisterPaymentSheet: ({
    friendName,
    initialAmount,
    open,
  }: {
    friendName: string
    initialAmount?: string
    open?: boolean
  }) => (
    <div
      data-testid="register-payment"
      data-open={String(open)}
      data-friend={friendName}
      data-initial={initialAmount ?? ""}
    />
  ),
}))

const options: QuickTransactionOptions = {
  friends: [
    { id: "f1", name: "Beto", username: "beto", avatar: null },
    { id: "f2", name: "Caro", username: "caro", avatar: null },
  ],
  payments: [
    { id: "f1", name: "Beto", username: "beto", avatar: null, maxPayable: "10.00" },
  ],
}

async function openMenu() {
  const user = userEvent.setup()
  render(<FabAction options={options} />)
  await user.click(screen.getByRole("button", { name: "Acciones rápidas" }))
  return user
}

it("abre el menú con las tres acciones", async () => {
  await openMenu()

  expect(await screen.findByText("Agregar deuda")).toBeDefined()
  expect(screen.getByText("Registrar pago")).toBeDefined()
  expect(screen.getByText("Nueva juntada")).toBeDefined()
})

it("Registrar pago solo lista amigos con maxPayable mayor a 0", async () => {
  const user = await openMenu()
  await user.click(screen.getByText("Registrar pago"))

  expect(await screen.findByText("Beto")).toBeDefined()
  expect(screen.queryByText("Caro")).toBeNull()
  expect(screen.getByText(/Máximo/)).toBeDefined()
})

it("elegir un amigo monta el formulario de pago controlado con el monto inicial", async () => {
  const user = await openMenu()
  await user.click(screen.getByText("Registrar pago"))
  await user.click(await screen.findByText("Beto"))

  const form = await screen.findByTestId("register-payment")
  expect(form.dataset.open).toBe("true")
  expect(form.dataset.initial).toBe("10.00")
  expect(form.dataset.friend).toBe("Beto")
})

it("Agregar deuda lista todos los amigos aceptados", async () => {
  const user = await openMenu()
  await user.click(screen.getByText("Agregar deuda"))

  expect(await screen.findByText("Beto")).toBeDefined()
  expect(screen.getByText("Caro")).toBeDefined()

  await user.click(screen.getByText("Caro"))
  const form = await screen.findByTestId("add-debt")
  expect(form.dataset.open).toBe("true")
  expect(form.dataset.friend).toBe("Caro")
})
