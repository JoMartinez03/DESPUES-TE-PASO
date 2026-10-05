// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const VIEWPORT_HEIGHT = 800
const KEYBOARD_HEIGHT = 336
const INSET_PROPERTY = "--sheet-keyboard-inset"

type Listener = (event: Event) => void

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

function setWindowProperty(name: string, value: unknown) {
  Object.defineProperty(window, name, { value, configurable: true, writable: true })
}

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
  vi.restoreAllMocks()
})

function renderSheet() {
  render(
    <Sheet open>
      <SheetContent side="bottom" className="gap-0 rounded-t-2xl p-0">
        <SheetHeader>
          <SheetTitle>Realizar pago</SheetTitle>
          <SheetDescription>Registrá un pago</SheetDescription>
        </SheetHeader>
        <div className="px-5 pt-2 pb-5">
          <Input aria-label="Monto" inputMode="decimal" />
        </div>
      </SheetContent>
    </Sheet>
  )

  const popup = document.querySelector<HTMLElement>('[data-slot="sheet-content"]')
  if (!popup) throw new Error("no se encontró el popup del Sheet")
  return { popup }
}

function openKeyboard() {
  visualViewport.height = VIEWPORT_HEIGHT - KEYBOARD_HEIGHT
  visualViewport.emit("resize")
}

function closeKeyboard() {
  visualViewport.height = VIEWPORT_HEIGHT
  visualViewport.emit("resize")
}

function insetOf(popup: HTMLElement) {
  return popup.style.getPropertyValue(INSET_PROPERTY)
}

describe("Sheet con teclado virtual", () => {
  it("publica el alto del teclado para elevating el Sheet", () => {
    const { popup } = renderSheet()
    expect(insetOf(popup)).toBe("0px")

    openKeyboard()
    expect(insetOf(popup)).toBe(`${KEYBOARD_HEIGHT}px`)

    closeKeyboard()
    expect(insetOf(popup)).toBe("0px")
  })

  it("ignora Reducciones del viewport que no son el teclado", () => {
    const { popup } = renderSheet()

    visualViewport.height = VIEWPORT_HEIGHT - 24
    visualViewport.emit("resize")

    expect(insetOf(popup)).toBe("0px")
  })

  it("limita la altura y habilita el scroll interno en Sheets bottom", () => {
    const { popup } = renderSheet()

    expect(popup.className).toContain(
      "max-h-[calc(100dvh_-_var(--sheet-keyboard-inset,0px))]"
    )
    expect(popup.className).toContain(
      "bottom-[var(--sheet-keyboard-inset,0px)]"
    )
    expect(popup.className).toContain("overscroll-contain")
    expect(popup.className).toContain("pb-[env(safe-area-inset-bottom)]")
    expect(popup.className).not.toContain("bottom-0")
  })

  it("mantiene fijo el documento mientras el teclado está abierto", () => {
    renderSheet()

    setWindowProperty("scrollY", 240)
    openKeyboard()

    expect(window.scrollTo).toHaveBeenCalledWith({
      left: 0,
      top: 0,
      behavior: "instant",
    })

    vi.mocked(window.scrollTo).mockClear()
    closeKeyboard()

    expect(window.scrollTo).not.toHaveBeenCalled()
  })

  it("trae de vuelta el campo enfocado dentro del Sheet", () => {
    const { popup } = renderSheet()
    const input = screen.getByLabelText("Monto")
    const scrollPopup = vi.fn()
    popup.scrollTo = scrollPopup
    input.getBoundingClientRect = () =>
      ({ top: 600, bottom: 640 }) as DOMRect

    openKeyboard()
    input.focus()

    expect(scrollPopup).toHaveBeenCalledTimes(1)
    expect(scrollPopup.mock.calls[0][0]).toMatchObject({
      top: 640 - (VIEWPORT_HEIGHT - KEYBOARD_HEIGHT - 16),
    })
  })

  it("no falla cuando el navegador no expone visualViewport", () => {
    setWindowProperty("visualViewport", undefined)

    const { popup } = renderSheet()

    expect(insetOf(popup)).toBe("")
  })
})