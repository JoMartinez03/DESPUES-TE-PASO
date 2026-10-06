// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { removeAvatar, updateAvatar } from "@/actions/profile"
import { ProfilePhoto } from "@/components/profile/profile-photo"
import { toast } from "@/components/ui/toast"
import { AVATAR_CROP_SIZE, AVATAR_MAX_BYTES } from "@/lib/avatar"
import type { CropArea, CropSize } from "@/lib/avatar-crop"

const routerRefresh = vi.fn()

vi.mock("@/actions/profile", () => ({
  updateAvatar: vi.fn(),
  removeAvatar: vi.fn(),
}))
vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => routerRefresh() }),
}))

/** El editor real se prueba en `photo-editor.test.tsx`. */
const CROP_AREA: CropArea = { x: 200, y: 300, width: 1000, height: 1000 }
const NATURAL: CropSize = { width: 4032, height: 3024 }

vi.mock("@/components/profile/photo-editor", () => ({
  PhotoEditor: ({
    imageUrl,
    onCancel,
    onConfirm,
  }: {
    imageUrl: string
    onCancel: () => void
    onConfirm: (area: CropArea, natural: CropSize) => void
  }) => (
    <div data-testid="photo-editor">
      <p>Acomodá tu foto</p>
      <span data-testid="editor-src">{imageUrl}</span>
      <button type="button" onClick={() => onConfirm(CROP_AREA, NATURAL)}>
        Guardar foto
      </button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  ),
}))

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]

function ascii(text: string): number[] {
  return [...text].map((char) => char.charCodeAt(0))
}

function jpegFile(size: number, name = "foto.jpg"): File {
  const buffer = new Uint8Array(size)
  buffer.set(JPEG_HEADER, 0)
  return new File([buffer], name, { type: "image/jpeg" })
}

function heicBytes(): Uint8Array<ArrayBuffer> {
  return new Uint8Array([
    0x00,
    0x00,
    0x00,
    0x18,
    ...ascii("ftyp"),
    ...ascii("heic"),
    0x00,
    0x00,
    0x00,
    0x00,
    ...ascii("mif1"),
  ])
}

function heicFile(declaredType = "image/heic"): File {
  return new File([heicBytes()], "IMG_0042.HEIC", { type: declaredType })
}

function fileInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')
  if (!input) throw new Error("no se encontró el input de archivo")
  return input
}

function lastToast() {
  const calls = vi.mocked(toast).mock.calls
  return calls[calls.length - 1]?.[0] as
    | { title?: string; description?: string }
    | undefined
}

const drawImage = vi.fn()

/** jsdom no implementa canvas ni createImageBitmap. */
function stubBrowser({ producedBytes = 40_000 } = {}) {
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn(async () => ({
      width: NATURAL.width,
      height: NATURAL.height,
      close: vi.fn(),
    })),
  )
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillStyle: "",
    fillRect: vi.fn(),
    drawImage,
  })) as unknown as HTMLCanvasElement["getContext"]
  HTMLCanvasElement.prototype.toBlob = vi.fn(function (
    this: HTMLCanvasElement,
    callback: BlobCallback,
    type?: string,
  ) {
    callback(
      new Blob([new Uint8Array(producedBytes)], { type: type ?? "image/png" }),
    )
  }) as unknown as HTMLCanvasElement["toBlob"]
}

async function selectFile(file: File) {
  const { container } = render(<ProfilePhoto hasAvatar={false} />)
  const input = fileInput(container)
  await userEvent.upload(input, file, { applyAccept: false })
  return input
}

beforeEach(() => {
  vi.clearAllMocks()
  drawImage.mockClear()
  routerRefresh.mockClear()
  stubBrowser()
  // jsdom no implementa object URLs; se definen sobre la URL real para no
  // romper el resto del runtime.
  Object.defineProperty(URL, "createObjectURL", {
    value: vi.fn(() => "blob:mock-preview"),
    configurable: true,
    writable: true,
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    value: vi.fn(),
    configurable: true,
    writable: true,
  })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("ProfilePhoto", () => {
  it("abre el editor al elegir la foto y todavía no sube nada", async () => {
    await selectFile(jpegFile(2048))

    expect(await screen.findByTestId("photo-editor")).toBeInTheDocument()
    expect(screen.getByText("Acomodá tu foto")).toBeInTheDocument()
    expect(screen.getByTestId("editor-src")).toHaveTextContent("blob:mock-preview")
    expect(updateAvatar).not.toHaveBeenCalled()
    expect(toast).not.toHaveBeenCalled()
    expect(drawImage).not.toHaveBeenCalled()
  })

  it("cancelar no sube nada ni cambia la foto actual", async () => {
    await selectFile(jpegFile(2048))
    await screen.findByTestId("photo-editor")

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }))

    await waitFor(() =>
      expect(screen.queryByTestId("photo-editor")).not.toBeInTheDocument(),
    )
    expect(updateAvatar).not.toHaveBeenCalled()
    expect(drawImage).not.toHaveBeenCalled()
    expect(toast).not.toHaveBeenCalled()
    expect(screen.getByText("Cambiar foto")).toBeInTheDocument()
  })

  it("confirma genera el recorte y lo sube por la action de siempre", async () => {
    vi.mocked(updateAvatar).mockResolvedValue({ ok: true })
    await selectFile(jpegFile(3_000_000))
    await screen.findByTestId("photo-editor")

    await userEvent.click(screen.getByRole("button", { name: "Guardar foto" }))

    // El recorte elegido queda en los píxeles: el archivo es el avatar.
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      CROP_AREA.x,
      CROP_AREA.y,
      CROP_AREA.width,
      CROP_AREA.height,
      0,
      0,
      AVATAR_CROP_SIZE,
      AVATAR_CROP_SIZE,
    )

    await waitFor(() => expect(updateAvatar).toHaveBeenCalled())
    const sent = vi.mocked(updateAvatar).mock.calls[0]?.[0] as FormData
    const file = sent.get("file") as File
    expect(file.type).toBe("image/webp")
    expect(file.size).toBe(40_000)
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({ title: "Foto actualizada" }),
    )
    expect(routerRefresh).not.toHaveBeenCalled()
  })

  it("cierra el editor apenas confirmó y vuelve al botón de cambiar foto", async () => {
    vi.mocked(updateAvatar).mockResolvedValue({ ok: true })
    await selectFile(jpegFile(2048))
    await screen.findByTestId("photo-editor")

    await userEvent.click(screen.getByRole("button", { name: "Guardar foto" }))

    await waitFor(() =>
      expect(screen.queryByTestId("photo-editor")).not.toBeInTheDocument(),
    )
    expect(screen.getByText("Cambiar foto")).toBeInTheDocument()
  })

  it("muestra el error del servidor cuando la action devuelve ok:false", async () => {
    vi.mocked(updateAvatar).mockResolvedValue({
      ok: false,
      error: "La imagen supera el máximo de 5 MB.",
    })
    await selectFile(jpegFile(2048))
    await screen.findByTestId("photo-editor")

    await userEvent.click(screen.getByRole("button", { name: "Guardar foto" }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "No se pudo cambiar la foto",
          description: "La imagen supera el máximo de 5 MB.",
        }),
      ),
    )
  })

  it("avisa y se recupera cuando la action revienta (413, red, serialización)", async () => {
    vi.mocked(updateAvatar).mockRejectedValue(new Error("413 Payload Too Large"))
    await selectFile(jpegFile(2048))
    await screen.findByTestId("photo-editor")

    await userEvent.click(screen.getByRole("button", { name: "Guardar foto" }))

    // Antes del fix esto no mostraba nada y dejaba la UI clavada en el preview.
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "No se pudo cambiar la foto",
          description: expect.stringContaining("Falló la subida"),
        }),
      ),
    )
    expect(screen.queryByTestId("photo-editor")).not.toBeInTheDocument()
    expect(routerRefresh).not.toHaveBeenCalled()
  })

  it("deja el editor abierto para reintentar cuando falla el recorte", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => {
        throw new Error("unsupported image format")
      }),
    )
    await selectFile(jpegFile(2048))
    await screen.findByTestId("photo-editor")

    await userEvent.click(screen.getByRole("button", { name: "Guardar foto" }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "No se pudo preparar la foto",
          description: expect.stringContaining("No pudimos leer esa imagen"),
        }),
      ),
    )
    expect(screen.getByTestId("photo-editor")).toBeInTheDocument()
    expect(updateAvatar).not.toHaveBeenCalled()
  })

  it("rechaza por tamaño antes de abrir el editor y avisa con el motivo", async () => {
    await selectFile(jpegFile(AVATAR_MAX_BYTES + 1))

    await waitFor(() => expect(toast).toHaveBeenCalled())
    expect(lastToast()?.description).toBe("La imagen supera el máximo de 5 MB.")
    expect(screen.queryByTestId("photo-editor")).not.toBeInTheDocument()
    expect(updateAvatar).not.toHaveBeenCalled()
  })

  it("rechaza HEIC con un mensaje que dice qué hacer", async () => {
    await selectFile(heicFile())

    await waitFor(() => expect(toast).toHaveBeenCalled())
    expect(lastToast()?.description).toBe(
      "Las fotos HEIC/HEIF no se pueden subir. Abrila en Fotos y guardala como JPG.",
    )
    expect(screen.queryByTestId("photo-editor")).not.toBeInTheDocument()
  })

  it("detecta HEIC por magic bytes aunque se declare como JPEG", async () => {
    await selectFile(heicFile("image/jpeg"))

    await waitFor(() => expect(toast).toHaveBeenCalled())
    expect(lastToast()?.description).toContain("HEIC/HEIF")
    expect(screen.queryByTestId("photo-editor")).not.toBeInTheDocument()
    expect(updateAvatar).not.toHaveBeenCalled()
  })

  it("rechaza un formato fuera de la allowlist", async () => {
    const gif = new File([new Uint8Array([0x47, 0x49, 0x46, 0x38])], "a.gif", {
      type: "image/gif",
    })
    await selectFile(gif)

    await waitFor(() => expect(toast).toHaveBeenCalled())
    expect(lastToast()?.description).toBe(
      "Formato no permitido. Usá JPG, PNG o WebP.",
    )
  })

  it("abre el input de imágenes completo para poder usar la cámara en iOS", () => {
    const { container } = render(<ProfilePhoto hasAvatar={false} />)
    expect(fileInput(container)).toHaveAttribute("accept", "image/*")
  })

  it("permite volver a elegir el mismo archivo después de cancelar", async () => {
    const input = await selectFile(jpegFile(2048))
    await screen.findByTestId("photo-editor")

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    await waitFor(() =>
      expect(screen.queryByTestId("photo-editor")).not.toBeInTheDocument(),
    )

    expect(input.value).toBe("")
  })

  it("sin foto previa sólo ofrece cambiar la foto", () => {
    render(<ProfilePhoto hasAvatar={false} />)

    expect(screen.getByText("Cambiar foto")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /Eliminar foto/ }),
    ).not.toBeInTheDocument()
  })

  it("reemplaza la foto existente y sigue ofreciendo eliminarla", async () => {
    vi.mocked(updateAvatar).mockResolvedValue({ ok: true })
    const { container } = render(<ProfilePhoto hasAvatar />)

    await userEvent.upload(fileInput(container), jpegFile(2048), {
      applyAccept: false,
    })
    await screen.findByTestId("photo-editor")
    await userEvent.click(screen.getByRole("button", { name: "Guardar foto" }))

    await waitFor(() => expect(updateAvatar).toHaveBeenCalled())
    expect(vi.mocked(updateAvatar)).toHaveBeenCalledTimes(1)

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Eliminar foto/ }),
      ).toBeInTheDocument(),
    )
  })

  it("elimina la foto", async () => {
    vi.mocked(removeAvatar).mockResolvedValue({ ok: true })
    render(<ProfilePhoto hasAvatar />)

    await userEvent.click(screen.getByRole("button", { name: /Eliminar foto/ }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({ title: "Foto eliminada" }),
    )
    expect(routerRefresh).not.toHaveBeenCalled()
  })

  it("avisa también si eliminar la foto falla", async () => {
    vi.mocked(removeAvatar).mockRejectedValue(new Error("network down"))
    render(<ProfilePhoto hasAvatar />)

    await userEvent.click(screen.getByRole("button", { name: /Eliminar foto/ }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "No se pudo eliminar la foto" }),
      ),
    )
    expect(routerRefresh).not.toHaveBeenCalled()
  })
})
