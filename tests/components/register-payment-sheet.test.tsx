// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { RegisterPaymentSheet } from "@/components/transactions/register-payment-sheet"

const { registerPayment } = vi.hoisted(() => ({
  registerPayment: vi.fn(),
}))

vi.mock("@/actions/transactions", () => ({ registerPayment }))
vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function renderSheet(maxPayableText = "$6.600,83") {
  // `open` controlado: el contenido del sheet queda montado sin depender del
  // trigger, que es lo que queremos ejercitar acá (el input y el submit).
  return render(
    <RegisterPaymentSheet
      friendId="usr-jose"
      friendName="José"
      maxPayableText={maxPayableText}
      open
      onOpenChange={() => {}}
      showTrigger={false}
    />,
  )
}

function amountInput() {
  return screen.getByLabelText("Monto") as HTMLInputElement
}

function submitButton() {
  return screen.getByRole("button", { name: "Realizar pago" })
}

describe("RegisterPaymentSheet · montos con centavos", () => {
  it("el input acepta coma decimal y permite estados intermedios", async () => {
    const user = userEvent.setup()
    renderSheet()

    await user.click(amountInput())
    await user.keyboard("6600,83")

    // El estado conserva la coma mientras se escribe, sin cortar la carga.
    expect(amountInput().value).toBe("6600,83")
  })

  it("acepta 6600,83 y lo envía canónico (punto) al server action", async () => {
    registerPayment.mockResolvedValue({
      ok: true,
      message: "Pago de $6.600,83 registrado",
    })
    const user = userEvent.setup()
    renderSheet()

    await user.type(amountInput(), "6600,83")
    await user.click(submitButton())

    await waitFor(() => {
      expect(registerPayment).toHaveBeenCalledWith({
        userId: "usr-jose",
        amount: "6600.83",
      })
    })
  })

  it("acepta el máximo precargado con punto (6600.83)", async () => {
    registerPayment.mockResolvedValue({ ok: true, message: "Pago registrado" })
    const user = userEvent.setup()
    renderSheet()

    await user.type(amountInput(), "6600.83")
    await user.click(submitButton())

    await waitFor(() => {
      expect(registerPayment).toHaveBeenCalledWith({
        userId: "usr-jose",
        amount: "6600.83",
      })
    })
  })

  it("rechaza cero en el cliente sin llamar al server action", async () => {
    const user = userEvent.setup()
    renderSheet()

    await user.type(amountInput(), "0")
    await user.click(submitButton())

    expect(await screen.findByText("El monto debe ser mayor a 0")).toBeTruthy()
    expect(registerPayment).not.toHaveBeenCalled()
  })

  it("trunca el exceso de decimales mientras se escribe (máx. 2)", async () => {
    registerPayment.mockResolvedValue({ ok: true, message: "Pago registrado" })
    const user = userEvent.setup()
    renderSheet()

    // El tercer decimal ni llega al estado: se trunca al tipear.
    await user.type(amountInput(), "6600,833")
    expect(amountInput().value).toBe("6600,83")

    await user.click(submitButton())
    await waitFor(() => {
      expect(registerPayment).toHaveBeenCalledWith({
        userId: "usr-jose",
        amount: "6600.83",
      })
    })
  })

  it("rechaza el envío vacío en el cliente sin llamar al server action", async () => {
    const user = userEvent.setup()
    renderSheet()

    await user.click(submitButton())

    expect(await screen.findByText("Monto inválido")).toBeTruthy()
    expect(registerPayment).not.toHaveBeenCalled()
  })

  it("rechaza texto inválido en el cliente sin llamar al server action", async () => {
    const user = userEvent.setup()
    renderSheet()

    await user.type(amountInput(), "abc")
    await user.click(submitButton())

    expect(await screen.findByText("Monto inválido")).toBeTruthy()
    expect(registerPayment).not.toHaveBeenCalled()
  })

  it("muestra el rechazo del server (un centavo de más) sin registrar el pago", async () => {
    registerPayment.mockResolvedValue({
      ok: false,
      code: "over_limit",
      message: "Supera el máximo. Podés pagar hasta $6.600,83.",
    })
    const user = userEvent.setup()
    renderSheet()

    await user.type(amountInput(), "6600,84")
    await user.click(submitButton())

    expect(
      await screen.findByText("Supera el máximo. Podés pagar hasta $6.600,83."),
    ).toBeTruthy()
  })
})
