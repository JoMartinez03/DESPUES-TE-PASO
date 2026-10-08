// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { afterEach, expect, it, vi } from "vitest"
import { HowToUse } from "@/components/onboarding/how-to-use"

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
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
