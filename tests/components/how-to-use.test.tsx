// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { HowToUse } from "@/components/onboarding/how-to-use"

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete (Element.prototype as { getAnimations?: unknown }).getAnimations
})

async function openTutorial(): Promise<UserEvent> {
  const user = userEvent.setup()
  render(<HowToUse />)
  await user.click(screen.getByRole("button", { name: /cómo usar/i }))
  await screen.findByRole("dialog")
  return user
}

async function goNext(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: "Siguiente" }))
}

async function goBack(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: "Anterior" }))
}

async function closeByX(user: UserEvent) {
  await user.click(screen.getByRole("button", { name: "Cerrar" }))
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
}

it("abre en el paso 1", async () => {
  await openTutorial()

  expect(await screen.findByText(/Agregá a tus amigos/)).toBeDefined()
  expect(screen.queryByText(/Anotá quién debe/)).toBeNull()
  expect(screen.getByText("Paso 1 de 4")).toBeDefined()
  expect(screen.queryByRole("button", { name: "Anterior" })).toBeNull()
  expect(screen.getByRole("button", { name: "Siguiente" })).toBeDefined()
})

it("Siguiente avanza al paso siguiente", async () => {
  const user = await openTutorial()

  await goNext(user)

  expect(await screen.findByText(/Anotá quién debe/)).toBeDefined()
  expect(screen.queryByText(/Agregá a tus amigos/)).toBeNull()
  expect(screen.getByText("Paso 2 de 4")).toBeDefined()
})

it("Anterior retrocede al paso anterior", async () => {
  const user = await openTutorial()
  await goNext(user)
  expect(await screen.findByText(/Anotá quién debe/)).toBeDefined()

  await goBack(user)

  expect(await screen.findByText(/Agregá a tus amigos/)).toBeDefined()
  expect(screen.queryByText(/Anotá quién debe/)).toBeNull()
  expect(screen.getByText("Paso 1 de 4")).toBeDefined()
})

it("en el último paso se muestra Entendido en lugar de Siguiente", async () => {
  const user = await openTutorial()
  await goNext(user)
  await goNext(user)
  await goNext(user)

  expect(await screen.findByText(/Organizá tus juntadas/)).toBeDefined()
  expect(screen.getByText("Paso 4 de 4")).toBeDefined()
  expect(screen.getByRole("button", { name: "Entendido" })).toBeDefined()
  expect(screen.queryByRole("button", { name: "Siguiente" })).toBeNull()
})

it("Entendido cierra el tutorial", async () => {
  const user = await openTutorial()
  await goNext(user)
  await goNext(user)
  await goNext(user)
  expect(await screen.findByText(/Organizá tus juntadas/)).toBeDefined()

  await user.click(screen.getByRole("button", { name: "Entendido" }))

  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  expect(screen.queryByText(/Organizá tus juntadas/)).toBeNull()
})

it("la X cierra el tutorial", async () => {
  const user = await openTutorial()

  await closeByX(user)

  expect(screen.queryByText(/Agregá a tus amigos/)).toBeNull()
})

it("al volver a abrir comienza de nuevo en el paso 1", async () => {
  const user = await openTutorial()
  await goNext(user)
  await goNext(user)
  expect(await screen.findByText(/Registrá tus pagos/)).toBeDefined()

  await closeByX(user)

  await user.click(screen.getByRole("button", { name: /cómo usar/i }))
  expect(await screen.findByText(/Agregá a tus amigos/)).toBeDefined()
  expect(screen.queryByText(/Registrá tus pagos/)).toBeNull()
  expect(screen.getByText("Paso 1 de 4")).toBeDefined()
})

it("el Confirmar del paso 3 es únicamente decorativo", async () => {
  const user = await openTutorial()
  await goNext(user)
  await goNext(user)

  expect(await screen.findByText(/Registrá tus pagos/)).toBeDefined()
  const confirm = screen.getByText("Confirmar")
  expect(confirm).toHaveAttribute("aria-hidden", "true")
  expect(confirm).toHaveAttribute("tabindex", "-1")
  expect(screen.queryByRole("button", { name: "Confirmar" })).toBeNull()
})

it("no hace llamadas al servidor ni usa persistencia", async () => {
  const fetchSpy = vi.fn()
  vi.stubGlobal("fetch", fetchSpy)
  const setItemSpy = vi.spyOn(Storage.prototype, "setItem")
  const getItemSpy = vi.spyOn(Storage.prototype, "getItem")

  const user = await openTutorial()
  await goNext(user)
  await goNext(user)
  await goNext(user)
  expect(await screen.findByText(/Organizá tus juntadas/)).toBeDefined()
  await user.click(screen.getByRole("button", { name: "Entendido" }))
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())

  expect(fetchSpy).not.toHaveBeenCalled()
  expect(setItemSpy).not.toHaveBeenCalled()
  expect(getItemSpy).not.toHaveBeenCalled()
})

/**
 * Simula un navegador donde las animaciones CSS corren de verdad. jsdom no las
 * ejecuta, así que sin esto la transición se cerraría en el mismo render.
 */
function stubRunningAnimations() {
  Object.defineProperty(Element.prototype, "getAnimations", {
    configurable: true,
    value: () => [{ playState: "running" }],
  })
  const original = window.getComputedStyle.bind(window)
  vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    const style = original(element, pseudo)
    Object.defineProperty(style, "animationName", {
      configurable: true,
      get: () => "tutorial-step-out",
    })
    return style
  })
}

function stubReducedMotion(matches: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

function exitingLayer() {
  return document.querySelector<HTMLElement>(".tutorial-step-out")
}

describe("transición entre pasos", () => {
  it("cruza el contenido entrante con el saliente sin tocar el footer", async () => {
    stubRunningAnimations()
    const user = await openTutorial()

    await goNext(user)

    const exiting = exitingLayer()
    expect(exiting).not.toBeNull()
    expect(exiting?.dataset.direction).toBe("forward")
    expect(exiting?.getAttribute("aria-hidden")).toBe("true")
    // El contenido entrante ya está montado y el saliente sigue en pantalla.
    expect(screen.getByText(/Anotá quién debe/)).toBeDefined()
    expect(exiting?.textContent).toContain("Agregá a tus amigos")
    // El footer no forma parte del bloque que se cruza.
    const footer = document.querySelector("[data-slot='sheet-footer']")
    expect(footer?.contains(exiting)).toBe(false)
    // El diálogo sigue nombrándose con el título del paso entrante.
    const labelledBy = screen
      .getByRole("dialog")
      .getAttribute("aria-labelledby")
    expect(document.getElementById(labelledBy ?? "")?.textContent).toContain(
      "Anotá quién debe",
    )
  })

  it("espeja la dirección al volver", async () => {
    stubRunningAnimations()
    const user = await openTutorial()

    await goNext(user)
    fireEvent.animationEnd(exitingLayer()!)
    await goBack(user)

    expect(exitingLayer()?.dataset.direction).toBe("backward")
  })

  it("cierra la transición cuando termina la animación de salida", async () => {
    stubRunningAnimations()
    const user = await openTutorial()

    await goNext(user)
    expect(exitingLayer()).not.toBeNull()

    fireEvent.animationEnd(exitingLayer()!)

    await waitFor(() => expect(exitingLayer()).toBeNull())
    expect(screen.getByText(/Anotá quién debe/)).toBeDefined()
  })

  it("ignora los clics mientras la transición está en curso", async () => {
    stubRunningAnimations()
    const user = await openTutorial()

    await goNext(user)
    await goNext(user)
    await goNext(user)

    expect(screen.getByText("Paso 2 de 4")).toBeDefined()
  })

  it("no deja el índice fuera de rango con clics rápidos", async () => {
    const user = await openTutorial()

    await goNext(user)
    await goNext(user)
    await goNext(user)

    // Tres clics = tres pasos: ni se saltean ni se pasa del último.
    expect(screen.getByText("Paso 4 de 4")).toBeDefined()
    expect(screen.getByText(/Organizá tus juntadas/)).toBeDefined()
    expect(screen.queryByText(/Registrá tus pagos/)).toBeNull()
  })

  it("con prefers-reduced-motion cambia de paso al instante, sin transición", async () => {
    stubRunningAnimations()
    stubReducedMotion(true)
    const user = await openTutorial()

    await goNext(user)

    expect(exitingLayer()).toBeNull()
    expect(screen.getByText(/Anotá quién debe/)).toBeDefined()
    expect(screen.queryByText(/Agregá a tus amigos/)).toBeNull()
  })

  it("mantiene la descripción con alto reservado para que el bloque no salte", async () => {
    await openTutorial()

    const description = document.querySelector("[data-slot='sheet-description']")
    expect(description?.className).toContain("min-h-[4lh]")
    expect(description?.className).toContain("min-[400px]:min-h-[3lh]")
  })
})
