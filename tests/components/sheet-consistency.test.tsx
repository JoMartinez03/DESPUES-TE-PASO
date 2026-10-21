// @vitest-environment jsdom
/**
 * Contrato visual compartido de todos los Sheets.
 *
 * Un bottom sheet es un componente de `src/components/ui/sheet.tsx`: los
 * tokens de movimiento, la geometría del panel, el overlay, el header, el
 * footer y la X viven ahí. Este archivo fija ese contrato para que ningún
 * Sheet se escape con su propia duración, su propio easing o su propio
 * padding, y para que el arreglo del teclado virtual en iOS (que vive en el
 * mismo componente) no se rompa de nuevo.
 */
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { ReactElement } from "react"

import { AddFriendSheet } from "@/components/friends/add-friend-sheet"
import { CloseGatheringButton } from "@/components/gatherings/close-gathering-button"
import { CreateGatheringSheet } from "@/components/gatherings/create-gathering-sheet"
import { ExpenseForm } from "@/components/gatherings/expense-form"
import { ExpenseItem } from "@/components/gatherings/expense-item"
import { ParticipantsManager } from "@/components/gatherings/participants-manager"
import { FabAction } from "@/components/layout/fab-action"
import { HowToUse } from "@/components/onboarding/how-to-use"
import { PhotoEditor } from "@/components/profile/photo-editor"
import { DeleteDebtButton } from "@/components/transactions/delete-debt-button"
import { EditDebtSheet } from "@/components/transactions/edit-debt-sheet"
import { RegisterPaymentSheet } from "@/components/transactions/register-payment-sheet"
import { AddDebtSheet } from "@/components/transactions/add-debt-sheet"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { ExpenseItemDto } from "@/lib/gatherings/serializable"

/* ------------------------------------------------------------------ */
/* Mocks: los Sheets son componentes de cliente que pegan a server     */
/* actions. Acá no probamos acciones, probamos presentación.          */
/* ------------------------------------------------------------------ */

const { createDebt, registerPayment, updateDebt, deleteDebt } = vi.hoisted(() => ({
  createDebt: vi.fn(),
  registerPayment: vi.fn(),
  updateDebt: vi.fn(),
  deleteDebt: vi.fn(),
}))

vi.mock("@/actions/transactions", () => ({
  createDebt,
  registerPayment,
  updateDebt,
  deleteDebt,
}))

const { createExpense, updateExpense, deleteExpense } = vi.hoisted(() => ({
  createExpense: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
}))

vi.mock("@/actions/expenses", () => ({
  createExpense,
  updateExpense,
  deleteExpense,
}))

const { createGathering, updateGatheringParticipants, closeGathering } =
  vi.hoisted(() => ({
    createGathering: vi.fn(),
    updateGatheringParticipants: vi.fn(),
    closeGathering: vi.fn(),
  }))

vi.mock("@/actions/gatherings", () => ({
  createGathering,
  updateGatheringParticipants,
  closeGathering,
}))

const { searchUsersAction, sendFriendRequest } = vi.hoisted(() => ({
  searchUsersAction: vi.fn(),
  sendFriendRequest: vi.fn(),
}))

vi.mock("@/actions/friendships", () => ({
  searchUsersAction,
  sendFriendRequest,
}))

vi.mock("@/components/ui/toast", () => ({
  toast: vi.fn(),
  celebrateSettled: vi.fn(),
  SETTLED_TOAST_TYPE: "settled",
  Toaster: () => null,
}))

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

// El cropper real necesita layout; acá no probamos el recorte.
vi.mock("react-easy-crop", () => ({ default: () => null }))

/* ------------------------------------------------------------------ */
/* Contrato esperado                                                   */
/* ------------------------------------------------------------------ */

/** Movimiento compartido: entra y sale siempre igual. */
const SHARED_MOTION = [
  "duration-(--sheet-duration)",
  "ease-(--sheet-ease)",
  "data-ending-style:duration-(--sheet-duration-exit)",
  "data-ending-style:ease-(--sheet-ease-exit)",
  "motion-reduce:transition-none",
] as const

/** Geometría del panel cuando el Sheet se abre desde abajo (mobile). */
const BOTTOM_GEOMETRY = [
  "data-[side=bottom]:inset-x-0",
  "data-[side=bottom]:bottom-[var(--sheet-keyboard-inset,0px)]",
  "data-[side=bottom]:h-auto",
  "data-[side=bottom]:max-h-[calc(100dvh_-_var(--sheet-keyboard-inset,0px))]",
  "data-[side=bottom]:overflow-y-auto",
  "data-[side=bottom]:overscroll-contain",
  "data-[side=bottom]:pb-[env(safe-area-inset-bottom)]",
  "data-[side=bottom]:rounded-t-2xl",
  "data-[side=bottom]:sm:mx-auto",
  "data-[side=bottom]:sm:max-w-md",
] as const

/** Valores prohibidos: cada Sheet usa los tokens, no números sueltos. */
const FORBIDDEN_MOTION = [
  /\bduration-\d/,
  /\bease-(in|out|linear|in-out)\b/,
  /\btransition-all\b/,
] as const

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function classTokens(element: HTMLElement): string[] {
  return element.className.split(/\s+/).filter(Boolean)
}

function expectTokens(element: HTMLElement, tokens: readonly string[]) {
  const present = classTokens(element)
  for (const token of tokens) {
    expect(present, `falta la clase "${token}"`).toContain(token)
  }
}

function sheetPopup(): HTMLElement {
  const popups = document.querySelectorAll<HTMLElement>(
    '[data-slot="sheet-content"]',
  )
  if (popups.length !== 1) {
    throw new Error(
      `se esperaba exactamente 1 popup de Sheet y hay ${popups.length}`,
    )
  }
  return popups[0]
}

function sheetOverlay(): HTMLElement {
  const overlays = document.querySelectorAll<HTMLElement>(
    '[data-slot="sheet-overlay"]',
  )
  if (overlays.length !== 1) {
    throw new Error(
      `se esperaba exactamente 1 overlay de Sheet y hay ${overlays.length}`,
    )
  }
  return overlays[0]
}

function setWindowProperty(name: string, value: unknown) {
  Object.defineProperty(window, name, { value, configurable: true, writable: true })
}

type Listener = (event: Event) => void

/**
 * `visualViewport` no existe en jsdom. Se simula con listeners reales para
 * poder provocar el mismo evento que dispara el teclado virtual en iOS y
 * comprobar que el inset se sigue publicando en el panel.
 */
function createVisualViewport(height: number) {
  const listeners = new Map<string, Set<Listener>>()
  return {
    height,
    offsetTop: 0,
    offsetLeft: 0,
    pageLeft: 0,
    pageTop: 0,
    scale: 1,
    addEventListener(type: string, listener: Listener) {
      const bucket = listeners.get(type) ?? new Set<Listener>()
      bucket.add(listener)
      listeners.set(type, bucket)
    },
    removeEventListener(type: string, listener: Listener) {
      listeners.get(type)?.delete(listener)
    },
    dispatchEvent: () => true,
    emit(type: string) {
      for (const listener of listeners.get(type) ?? []) listener(new Event(type))
    },
  }
}

/* ------------------------------------------------------------------ */
/* Setup                                                               */
/* ------------------------------------------------------------------ */

const VIEWPORT_HEIGHT = 800
const KEYBOARD_HEIGHT = 336

let visualViewport: ReturnType<typeof createVisualViewport>

beforeEach(() => {
  visualViewport = createVisualViewport(VIEWPORT_HEIGHT)
  setWindowProperty("visualViewport", visualViewport)
  setWindowProperty("innerHeight", VIEWPORT_HEIGHT)
  setWindowProperty("scrollX", 0)
  setWindowProperty("scrollY", 0)
  setWindowProperty("scrollTo", vi.fn())
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

/* ------------------------------------------------------------------ */
/* Fixtures                                                            */
/* ------------------------------------------------------------------ */

const BETO = { id: "usr-beto", name: "Beto Ruiz", username: "beto", avatar: null }

const EXPENSE: ExpenseItemDto = {
  id: "exp-1",
  title: "Hamburguesas",
  amount: "5000.00",
  splitType: "EQUAL",
  currency: "ARS",
  createdAt: "2026-01-05T12:00:00.000Z",
  payer: BETO,
  creator: BETO,
  participants: [
    {
      userId: BETO.id,
      name: BETO.name,
      username: BETO.username,
      avatar: null,
      shareAmount: "5000.00",
    },
  ],
}

type SheetCase = {
  name: string
  render: () => ReactElement
  /** Nombre accesible del trigger. Si falta, el Sheet ya nace abierto. */
  trigger?: string | RegExp
}

const CASES: SheetCase[] = [
  {
    name: "AddDebtSheet",
    render: () => (
      <AddDebtSheet
        friendId={BETO.id}
        friendName={BETO.name}
        open
        showTrigger={false}
      />
    ),
  },
  {
    name: "RegisterPaymentSheet",
    render: () => (
      <RegisterPaymentSheet
        friendId={BETO.id}
        friendName={BETO.name}
        maxPayableText="$5.000"
        open
        showTrigger={false}
      />
    ),
  },
  {
    name: "EditDebtSheet",
    render: () => (
      <EditDebtSheet
        transactionId="tx-1"
        initialDescription="Hamburguesas"
        initialAmount="5000"
      />
    ),
    trigger: "Editar deuda",
  },
  {
    name: "DeleteDebtButton",
    render: () => (
      <DeleteDebtButton
        transactionId="tx-1"
        description="Hamburguesas"
        amountText="$5.000"
      />
    ),
    trigger: "Eliminar deuda de $5.000",
  },
  {
    name: "AddFriendSheet",
    render: () => <AddFriendSheet />,
    trigger: "Agregar amigo",
  },
  {
    name: "ExpenseForm",
    render: () => (
      <ExpenseForm
        trigger={<Button variant="outline">Agregar gasto</Button>}
        gathering={{ id: "g-1", name: "Asado", participants: [BETO] }}
        currentUserId={BETO.id}
      />
    ),
    trigger: "Agregar gasto",
  },
  {
    name: "ExpenseItem",
    render: () => (
      <ExpenseItem
        expense={EXPENSE}
        gathering={{ id: "g-1", name: "Asado", participants: [BETO] }}
        currentUserId={BETO.id}
        canManage
      />
    ),
    trigger: "Eliminar gasto Hamburguesas",
  },
  {
    name: "CloseGatheringButton",
    render: () => <CloseGatheringButton gatheringId="g-1" />,
    trigger: "Cerrar juntada",
  },
  {
    name: "ParticipantsManager",
    render: () => (
      <ParticipantsManager
        gatheringId="g-1"
        creatorId={BETO.id}
        members={[BETO]}
        friends={[BETO]}
      />
    ),
    trigger: "Editar participantes",
  },
  {
    name: "CreateGatheringSheet",
    render: () => <CreateGatheringSheet friends={[BETO]} />,
    trigger: "Nueva juntada",
  },
  {
    name: "FabAction",
    render: () => (
      <FabAction
        options={{
          friends: [BETO],
          payments: [
            { ...BETO, maxPayable: "5000.00" },
          ],
        }}
      />
    ),
    trigger: "Acciones rápidas",
  },
  {
    name: "HowToUse",
    render: () => <HowToUse />,
    trigger: /cómo usar/i,
  },
  {
    name: "PhotoEditor",
    render: () => (
      <PhotoEditor
        imageUrl="blob:mock"
        onCancel={() => {}}
        onConfirm={() => {}}
      />
    ),
  },
]

async function openCase(sheetCase: SheetCase, user: UserEvent) {
  render(sheetCase.render())
  if (sheetCase.trigger) {
    await user.click(screen.getByRole("button", { name: sheetCase.trigger }))
  }
  await screen.findByRole("dialog")
}

/* ------------------------------------------------------------------ */
/* Tests                                                               */
/* ------------------------------------------------------------------ */

describe("Sheet · contrato global", () => {
  it("el panel usa el movimiento compartido y respeta reduced-motion", async () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    await screen.findByRole("dialog")

    const popup = sheetPopup()
    expectTokens(popup, [
      "transition",
      ...SHARED_MOTION,
    ])
  })

  it("el panel inferior respeta el inset del teclado virtual", async () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    await screen.findByRole("dialog")

    const popup = sheetPopup()
    expectTokens(popup, BOTTOM_GEOMETRY)
    // El arreglo de iOS sigue conectado: el inset se publica en el panel.
    expect(popup.style.getPropertyValue("--sheet-keyboard-inset")).toBe("0px")
  })

  it("el overlay usa el mismo movimiento y oscurece el fondo", async () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    await screen.findByRole("dialog")

    const overlay = sheetOverlay()
    expectTokens(overlay, [
      "bg-black/30",
      "transition-opacity",
      ...SHARED_MOTION,
    ])
  })

  it("el header y el footer traen el espaciado por defecto", async () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Título</SheetTitle>
          </SheetHeader>
          <SheetFooter>
            <Button>Acción</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    )
    await screen.findByRole("dialog")

    const header = document.querySelector<HTMLElement>(
      '[data-slot="sheet-header"]',
    )
    const footer = document.querySelector<HTMLElement>(
      '[data-slot="sheet-footer"]',
    )
    if (!header || !footer) throw new Error("faltan header o footer")

    expectTokens(header, ["flex", "flex-col", "gap-1", "px-5", "pt-5", "pb-2"])
    // `pr-12` deja libre el lugar de la X global.
    expectTokens(header, ["pr-12"])

    expectTokens(footer, [
      "mt-auto",
      "flex",
      "flex-col",
      "gap-2",
      "px-5",
      "pt-3",
      "pb-5",
    ])
  })

  it("la X global queda arriba a la derecha y no tapa el título", async () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Título</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    )
    await screen.findByRole("dialog")

    const close = screen.getByRole("button", { name: "Cerrar" })
    expectTokens(close, ["absolute", "top-3", "right-3", "size-7"])
  })

  it("la transición no anima el inset del teclado (sigue siendo instantáneo)", async () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    await screen.findByRole("dialog")

    // La utilidad `transition` de Tailwind tiene una lista curada de
    // propiedades que NO incluye `bottom` ni `max-height`: por eso el
    // teclado virtual levanta el panel de golpe y no lo interpola.
    // `transition-all` o `transition-[...]` sí lo harían, así que están
    // prohibidos acá.
    const tokens = classTokens(sheetPopup())
    expect(tokens).toContain("transition")
    expect(tokens).not.toContain("transition-all")
    expect(tokens.some((token) => token.startsWith("transition-["))).toBe(false)
  })

  it("el inset del teclado virtual se publica y se actualiza en vivo", async () => {
    render(
      <Sheet open>
        <SheetContent side="bottom">
          <SheetTitle>Título</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    await screen.findByRole("dialog")

    const popup = sheetPopup()
    expect(popup.style.getPropertyValue("--sheet-keyboard-inset")).toBe("0px")

    // Se abre el teclado virtual: el panel tiene que subir.
    visualViewport.height = VIEWPORT_HEIGHT - KEYBOARD_HEIGHT
    visualViewport.emit("resize")

    await waitFor(() => {
      expect(popup.style.getPropertyValue("--sheet-keyboard-inset")).toBe(
        `${KEYBOARD_HEIGHT}px`,
      )
    })

    // Y vuelve a su lugar cuando el teclado se cierra.
    visualViewport.height = VIEWPORT_HEIGHT
    visualViewport.emit("resize")

    await waitFor(() => {
      expect(popup.style.getPropertyValue("--sheet-keyboard-inset")).toBe("0px")
    })
  })
})

describe("Sheets · consistencia entre pantallas", () => {
  for (const sheetCase of CASES) {
    it(`${sheetCase.name} comparte movimiento, geometría y overlay`, async () => {
      const user = userEvent.setup()
      await openCase(sheetCase, user)

      const popup = sheetPopup()
      expect(popup.getAttribute("data-side")).toBe("bottom")

      // Movimiento compartido.
      expectTokens(popup, SHARED_MOTION)
      // Geometría compartida.
      expectTokens(popup, BOTTOM_GEOMETRY)
      // Overlay compartido.
      expectTokens(sheetOverlay(), ["bg-black/30", ...SHARED_MOTION])

      // Nadie define su propio timing.
      const tokens = classTokens(popup)
      for (const pattern of FORBIDDEN_MOTION) {
        expect(
          tokens.filter((token) => pattern.test(token)),
          `clase con movimiento propio: ${tokens.join(" ")}`,
        ).toHaveLength(0)
      }

      // El arreglo del teclado virtual sigue montado en cada panel.
      expect(popup.style.getPropertyValue("--sheet-keyboard-inset")).toBe("0px")
    })
  }

  it("la X global está presente y con la misma geometría en todos", async () => {
    for (const sheetCase of CASES) {
      const user = userEvent.setup()
      await openCase(sheetCase, user)

      const close = screen.getByRole("button", { name: "Cerrar" })
      expectTokens(close, ["absolute", "top-3", "right-3", "size-7"])

      cleanup()
    }
  })

  it("el teclado virtual levanta el panel de un Sheet real", async () => {
    const user = userEvent.setup()
    await openCase(CASES[0], user)

    const popup = sheetPopup()
    expect(popup.style.getPropertyValue("--sheet-keyboard-inset")).toBe("0px")

    visualViewport.height = VIEWPORT_HEIGHT - KEYBOARD_HEIGHT
    visualViewport.emit("resize")

    await waitFor(() => {
      expect(popup.style.getPropertyValue("--sheet-keyboard-inset")).toBe(
        `${KEYBOARD_HEIGHT}px`,
      )
    })
  })
})
