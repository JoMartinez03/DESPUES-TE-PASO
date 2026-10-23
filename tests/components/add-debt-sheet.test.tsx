// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { AddDebtSheet } from "@/components/transactions/add-debt-sheet"

const { createDebt, hapticSuccess } = vi.hoisted(() => ({
  createDebt: vi.fn(),
  hapticSuccess: vi.fn(),
}))

vi.mock("@/actions/transactions", () => ({ createDebt }))
vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))
vi.mock("@/lib/haptics", () => ({ hapticSuccess }))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

function renderSheet() {
  return render(
    <AddDebtSheet
      friendId="usr-jose"
      friendName="José"
      open
      onOpenChange={() => {}}
      showTrigger={false}
    />,
  )
}

async function submitDebt() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText("Concepto"), "hamburguesas")
  await user.type(screen.getByLabelText("Monto"), "500")
  await user.click(screen.getByRole("button", { name: "Guardar deuda" }))
  return user
}

describe("AddDebtSheet · feedback háptico", () => {
  it("vibra sólo después de que el server confirma la deuda", async () => {
    createDebt.mockResolvedValue({ ok: true, message: "Deuda registrada" })
    renderSheet()

    await submitDebt()

    await waitFor(() => expect(createDebt).toHaveBeenCalled())
    await waitFor(() => expect(hapticSuccess).toHaveBeenCalledTimes(1))
  })

  it("no vibra si el server rechaza la deuda", async () => {
    createDebt.mockResolvedValue({
      ok: false,
      code: "invalid",
      message: "Datos inválidos",
    })
    renderSheet()

    await submitDebt()

    expect(await screen.findByText("Datos inválidos")).toBeTruthy()
    expect(hapticSuccess).not.toHaveBeenCalled()
  })
})
