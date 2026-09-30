// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import {
  MyPaymentsCard,
  type MyPaymentsCardProps,
} from "@/components/gatherings/my-payments-card"
import type { PairDebtRow } from "@/lib/gatherings/pair-debts"

afterEach(() => cleanup())

vi.mock("@/components/transactions/register-payment-sheet", () => ({
  RegisterPaymentSheet: ({
    friendId,
    friendName,
    maxPayableText,
    initialAmount,
  }: {
    friendId: string
    friendName: string
    maxPayableText: string
    initialAmount?: string
  }) => (
    <div
      data-testid="register-payment"
      data-friend-id={friendId}
      data-friend={friendName}
      data-max={maxPayableText}
      data-initial={initialAmount ?? ""}
    />
  ),
}))

const PADRE = "padre"
const FABRICIO = "fabricio"
const LAUTI = "lauti"
const TINO = "tino"
const MONTANA = "montana"

const pairDebts: PairDebtRow[] = [
  { debtorId: PADRE, creditorId: TINO, amountCents: 500_000 },
  { debtorId: PADRE, creditorId: MONTANA, amountCents: 408_000 },
  { debtorId: FABRICIO, creditorId: TINO, amountCents: 674_000 },
  { debtorId: FABRICIO, creditorId: MONTANA, amountCents: 234_000 },
  { debtorId: LAUTI, creditorId: MONTANA, amountCents: 908_000 },
]

const participants = [
  { id: PADRE, name: "Padre" },
  { id: FABRICIO, name: "Fabricio" },
  { id: LAUTI, name: "Lauti" },
  { id: TINO, name: "Tino" },
  { id: MONTANA, name: "MONTANA" },
]

function renderCard(overrides: Partial<MyPaymentsCardProps> = {}) {
  const props: MyPaymentsCardProps = {
    pairDebts,
    viewerId: PADRE,
    balanceCents: -908_000,
    isActive: true,
    participants,
    maxPayableByPair: new Map([
      [`${PADRE}:${TINO}`, "5000.00"],
      [`${PADRE}:${MONTANA}`, "4080.00"],
    ]),
    ...overrides,
  }
  return render(<MyPaymentsCard {...props} />)
}

function payments() {
  return screen.queryAllByTestId("register-payment")
}

it("muestra solo las dos obligaciones del viewer, con su botón", () => {
  renderCard({ viewerId: PADRE })

  expect(screen.getByText("Tus pagos")).toBeDefined()
  expect(
    screen.getByText("Transferencias que tenés que realizar para saldar la juntada."),
  ).toBeDefined()
  expect(screen.getByText("$5.000")).toBeDefined()
  expect(screen.getByText("$4.080")).toBeDefined()
  expect(payments()).toHaveLength(2)
  expect(payments().map((node) => node.dataset.friend)).toEqual([
    "Tino",
    "MONTANA",
  ])
})

it("no muestra filas ni montos de otros participantes", () => {
  renderCard({ viewerId: PADRE })

  expect(screen.queryByText("Fabricio")).toBeNull()
  expect(screen.queryByText("Lauti")).toBeNull()
  expect(screen.queryByText("$6.740")).toBeNull()
  expect(screen.queryByText("$2.340")).toBeNull()
  expect(screen.queryByText("$9.080")).toBeNull()
})

it("no repite el nombre del deudor ni una flecha de vos", () => {
  renderCard({ viewerId: PADRE })

  expect(screen.queryByText("Padre")).toBeNull()
})

it("muestra las dos obligaciones de Fabricio", () => {
  renderCard({
    viewerId: FABRICIO,
    balanceCents: -908_000,
    maxPayableByPair: new Map([
      [`${FABRICIO}:${TINO}`, "6740.00"],
      [`${FABRICIO}:${MONTANA}`, "2340.00"],
    ]),
  })

  expect(payments()).toHaveLength(2)
  expect(screen.getByText("$6.740")).toBeDefined()
  expect(screen.getByText("$2.340")).toBeDefined()
  expect(screen.queryByText("$5.000")).toBeNull()
})

it("muestra una sola obligación a Lauti", () => {
  renderCard({
    viewerId: LAUTI,
    balanceCents: -908_000,
    maxPayableByPair: new Map([[`${LAUTI}:${MONTANA}`, "9080.00"]]),
  })

  expect(payments()).toHaveLength(1)
  expect(screen.getByText("$9.080")).toBeDefined()
  expect(payments()[0]?.dataset.friend).toBe("MONTANA")
})

it("un acreedor neto no ve pagos ni botones", () => {
  renderCard({
    viewerId: TINO,
    balanceCents: 1_174_000,
    maxPayableByPair: new Map(),
  })

  expect(screen.getByText("No tenés pagos que realizar")).toBeDefined()
  expect(
    screen.getByText("Tenés dinero a favor en esta juntada."),
  ).toBeDefined()
  expect(payments()).toHaveLength(0)
  expect(screen.queryByText("Tus pagos")).toBeNull()
})

it("un viewer al día ve el estado de al día", () => {
  renderCard({ viewerId: TINO, balanceCents: 0, maxPayableByPair: new Map() })

  expect(screen.getByText("Estás al día")).toBeDefined()
  expect(
    screen.getByText("No tenés pagos pendientes en esta juntada."),
  ).toBeDefined()
  expect(payments()).toHaveLength(0)
})

it("no renderiza nada en una juntada cerrada", () => {
  const { container } = renderCard({ isActive: false })

  expect(container.innerHTML).toBe("")
})

it("omite el botón cuando el máximo pagable es cero", () => {
  renderCard({
    viewerId: PADRE,
    maxPayableByPair: new Map([
      [`${PADRE}:${TINO}`, "0.00"],
      [`${PADRE}:${MONTANA}`, "4080.00"],
    ]),
  })

  expect(payments()).toHaveLength(1)
  expect(payments()[0]?.dataset.friend).toBe("MONTANA")
})

it("precarga el monto de la fila cuando el máximo alcanza", () => {
  renderCard({ viewerId: PADRE })

  expect(payments().map((node) => node.dataset.initial)).toEqual([
    "5000.00",
    "4080.00",
  ])
})

it("clampea el prefill al máximo global cuando es menor que la fila", () => {
  renderCard({
    viewerId: PADRE,
    maxPayableByPair: new Map([
      // Hay una deuda manual en sentido contrario, asi que el max real es menor
      // que la fila. El prefill no puede nacer invalido.
      [`${PADRE}:${TINO}`, "3000.00"],
      [`${PADRE}:${MONTANA}`, "4080.00"],
    ]),
  })

  expect(payments().map((node) => node.dataset.initial)).toEqual([
    "3000.00",
    "4080.00",
  ])
  expect(payments().map((node) => node.dataset.max)).toEqual([
    "$3.000",
    "$4.080",
  ])
})

it("omite las filas cuyo acreedor no está en los participantes", () => {
  renderCard({
    viewerId: PADRE,
    participants: participants.filter((participant) => participant.id !== TINO),
  })

  expect(payments()).toHaveLength(1)
  expect(payments()[0]?.dataset.friend).toBe("MONTANA")
  expect(screen.queryByText("Tino")).toBeNull()
})
