// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { PhotoEditor } from "@/components/profile/photo-editor"
import {
  AVATAR_CROP_MAX_ZOOM,
  AVATAR_CROP_MIN_ZOOM,
} from "@/lib/avatar"
import { centeredSquareArea, type CropArea, type CropSize } from "@/lib/avatar-crop"

type MediaSize = { naturalWidth: number; naturalHeight: number }
type CropperStubProps = {
  aspect: number
  zoom: number
  crop: { x: number; y: number }
  minZoom: number
  maxZoom: number
  cropShape: string
  restrictPosition: boolean
  onCropChange: (point: { x: number; y: number }) => void
  onZoomChange?: (zoom: number) => void
  onMediaLoaded?: (media: MediaSize) => void
  mediaProps?: { alt?: string; onError?: (event: unknown) => void }
  onCropComplete?: (
    percentages: CropArea,
    pixels: CropArea,
  ) => void
}

const LANDSCAPE: CropSize = { width: 4032, height: 3024 }
const PORTRAIT: CropSize = { width: 3024, height: 4032 }

/**
 * El cropper real necesita layout (getBoundingClientRect) y ResizeObserver, que
 * jsdom no tiene. Acá se reemplaza por un stub que guarda las props y deja que
 * el test maneje los callbacks: lo que se verifica es nuestro cableado, la
 * matemática del recorte ya está cubierta en los tests de `avatar-crop` y
 * `avatar-client`, y los gestos son responsabilidad de la librería.
 */
const cropper: { props: CropperStubProps | null } = { props: null }

vi.mock("react-easy-crop", () => ({
  default: (props: CropperStubProps) => {
    cropper.props = props
    return null
  },
}))

const onCancel = vi.fn()
const onConfirm = vi.fn()

function renderEditor(busy = false) {
  render(
    <PhotoEditor
      imageUrl="blob:mock"
      onCancel={onCancel}
      onConfirm={onConfirm}
      busy={busy}
    />,
  )
}

function currentProps(): CropperStubProps {
  if (!cropper.props) throw new Error("el cropper no se montó")
  return cropper.props
}

/** Simula que la imagen cargó en el editor. */
function loadMedia(size: CropSize = LANDSCAPE) {
  act(() =>
    currentProps().onMediaLoaded?.({
      naturalWidth: size.width,
      naturalHeight: size.height,
    }),
  )
}

/** Simula el gesto de arrastrar: la librería devuelve el área nueva. */
function dragTo(pixels: CropArea) {
  act(() => {
    currentProps().onCropChange?.({ x: 12, y: -8 })
    currentProps().onCropComplete?.(
      { x: 10, y: 5, width: 75, height: 75 },
      pixels,
    )
  })
}

const CENTERED_LANDSCAPE = centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height)

beforeEach(() => {
  vi.clearAllMocks()
  cropper.props = null
})

afterEach(() => {
  cleanup()
})

describe("PhotoEditor", () => {
  it("pide acomodar la foto y no deja guardar hasta que la imagen carga", () => {
    renderEditor()

    expect(screen.getByText("Acomodá tu foto")).toBeInTheDocument()
    expect(screen.getByText(/Arrastrá, pellizcá o hacé scroll/)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Guardar foto/ })).toBeDisabled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("configura el círculo para que la imagen siempre lo cubra", () => {
    renderEditor()
    loadMedia()

    const props = currentProps()
    expect(props.aspect).toBe(1)
    expect(props.cropShape).toBe("round")
    // minZoom 1 + restrictPosition es lo que impide huecos dentro del avatar.
    expect(props.minZoom).toBe(AVATAR_CROP_MIN_ZOOM)
    expect(props.minZoom).toBe(1)
    expect(props.maxZoom).toBe(AVATAR_CROP_MAX_ZOOM)
    expect(props.restrictPosition).toBe(true)
  })

  it("confirma el encuadre que devuelve el cropper", async () => {
    renderEditor()
    loadMedia()
    const area: CropArea = { x: 400, y: 250, width: 1500, height: 1500 }
    dragTo(area)

    await userEvent.click(screen.getByRole("button", { name: /Guardar foto/ }))

    expect(onConfirm).toHaveBeenCalledWith(area, LANDSCAPE)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it("confirma el encuadre de una foto vertical", async () => {
    renderEditor()
    loadMedia(PORTRAIT)
    const area = centeredSquareArea(PORTRAIT.width, PORTRAIT.height)
    dragTo(area)

    await userEvent.click(screen.getByRole("button", { name: /Guardar foto/ }))

    expect(onConfirm).toHaveBeenCalledWith(area, PORTRAIT)
  })

  it("cae al cuadrado centrado si todavía no hubo ningún gesto", async () => {
    renderEditor()
    loadMedia()

    await userEvent.click(screen.getByRole("button", { name: /Guardar foto/ }))

    expect(onConfirm).toHaveBeenCalledWith(CENTERED_LANDSCAPE, LANDSCAPE)
  })

  it("acerca y aleja con los botones", async () => {
    renderEditor()
    loadMedia()

    expect(currentProps().zoom).toBe(AVATAR_CROP_MIN_ZOOM)

    await userEvent.click(screen.getByRole("button", { name: "Acercar" }))
    expect(currentProps().zoom).toBeCloseTo(AVATAR_CROP_MIN_ZOOM + 0.2)

    await userEvent.click(screen.getByRole("button", { name: "Alejar" }))
    expect(currentProps().zoom).toBe(AVATAR_CROP_MIN_ZOOM)

    // Nunca por debajo de 1: ahí el círculo quedaría con huecos.
    await userEvent.click(screen.getByRole("button", { name: "Alejar" }))
    expect(currentProps().zoom).toBe(AVATAR_CROP_MIN_ZOOM)
  })

  it("no deja pasar del zoom máximo", async () => {
    renderEditor()
    loadMedia()
    fireEvent.change(screen.getByLabelText("Zoom"), { target: { value: "9" } })

    expect(currentProps().zoom).toBe(AVATAR_CROP_MAX_ZOOM)
  })

  it("mueve el zoom con el slider", () => {
    renderEditor()
    loadMedia()

    fireEvent.change(screen.getByLabelText("Zoom"), { target: { value: "2.5" } })

    expect(currentProps().zoom).toBe(2.5)
  })

  it("confirma el zoom que venga del pinch o de la rueda", async () => {
    renderEditor()
    loadMedia()
    act(() => currentProps().onZoomChange?.(3.25))
    const zoomed: CropArea = { x: 900, y: 600, width: 756, height: 756 }
    dragTo(zoomed)

    await userEvent.click(screen.getByRole("button", { name: /Guardar foto/ }))

    expect(currentProps().zoom).toBe(3.25)
    expect(onConfirm).toHaveBeenCalledWith(zoomed, LANDSCAPE)
  })

  it("cancela sin confirmar nada", async () => {
    renderEditor()
    loadMedia()

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(onCancel).toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("no deja cancelar mientras se está generando el recorte", async () => {
    renderEditor(true)
    loadMedia()

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
    expect(screen.getByRole("button", { name: /Guardar foto/ })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Acercar" })).toBeDisabled()
    expect(screen.getByLabelText("Zoom")).toBeDisabled()

    // Tampoco cerrando el sheet: la subida ya está en marcha.
    await userEvent.click(screen.getByRole("button", { name: "Cerrar" }))
    expect(onCancel).not.toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it("avisa y se recupera si el navegador no puede mostrar la imagen", () => {
    renderEditor()
    // react-easy-crop no expone `onMediaError`: el error llega por `mediaProps`.
    act(() => currentProps().mediaProps?.onError?.({} as never))

    expect(
      screen.getByText(/No pudimos mostrar esa foto/),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Guardar foto/ })).toBeDisabled()
    expect(screen.queryByLabelText("Zoom")).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeEnabled()
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
