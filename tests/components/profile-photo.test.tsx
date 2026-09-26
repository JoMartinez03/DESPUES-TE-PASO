// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { removeAvatar, updateAvatar } from "@/actions/profile"
import { ProfilePhoto } from "@/components/profile/profile-photo"
import { toast } from "@/components/ui/toast"
import { AVATAR_MAX_BYTES, AVATAR_TARGET_MAX_EDGE } from "@/lib/avatar"

const refresh = vi.fn()

vi.mock("@/actions/profile", () => ({
  updateAvatar: vi.fn(),
  removeAvatar: vi.fn(),
}))
vi.mock("@/components/ui/toast", () => ({ toast: vi.fn() }))
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: () => refresh() }),
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

beforeEach(() => {
  vi.clearAllMocks()
  refresh.mockClear()
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
  it("muestra el preview y habilita guardar cuando el archivo es válido", async () => {
    vi.mocked(updateAvatar).mockResolvedValue({ ok: true })
    const { container } = render(<ProfilePhoto hasAvatar={false} />)

    await userEvent.upload(
      fileInput(container),
      jpegFile(2048),
      { applyAccept: false },
    )

    expect(await screen.findByAltText("Selección previa")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Guardar foto/ })).toBeEnabled()
    expect(toast).not.toHaveBeenCalled()
  })

  it("rechaza por tamaño antes de generar preview y avisa con el motivo", async () => {
    const { container } = render(<ProfilePhoto hasAvatar={false} />)

    await userEvent.upload(
      fileInput(container),
      jpegFile(AVATAR_MAX_BYTES + 1),
      { applyAccept: false },
    )

    await waitFor(() => expect(toast).toHaveBeenCalled())
    expect(lastToast()?.description).toBe("La imagen supera el máximo de 5 MB.")
    expect(screen.queryByAltText("Selección previa")).not.toBeInTheDocument()
    expect(updateAvatar).not.toHaveBeenCalled()
  })

  it("rechaza HEIC con un mensaje que dice qué hacer", async () => {
    const { container } = render(<ProfilePhoto hasAvatar={false} />)

    await userEvent.upload(fileInput(container), heicFile(), {
      applyAccept: false,
    })

    await waitFor(() => expect(toast).toHaveBeenCalled())
    expect(lastToast()?.description).toBe(
      "Las fotos HEIC/HEIF no se pueden subir. Abrila en Fotos y guardala como JPG.",
    )
    expect(screen.queryByAltText("Selección previa")).not.toBeInTheDocument()
  })

  it("detecta HEIC por magic bytes aunque se declare como JPEG", async () => {
    const { container } = render(<ProfilePhoto hasAvatar={false} />)

    await userEvent.upload(
      fileInput(container),
      heicFile("image/jpeg"),
      { applyAccept: false },
    )

    await waitFor(() => expect(toast).toHaveBeenCalled())
    expect(lastToast()?.description).toContain("HEIC/HEIF")
    expect(updateAvatar).not.toHaveBeenCalled()
  })

  it("rechaza un formato fuera de la allowlist", async () => {
    const { container } = render(<ProfilePhoto hasAvatar={false} />)
    const gif = new File([new Uint8Array([0x47, 0x49, 0x46, 0x38])], "a.gif", {
      type: "image/gif",
    })

    await userEvent.upload(fileInput(container), gif, { applyAccept: false })

    await waitFor(() => expect(toast).toHaveBeenCalled())
    expect(lastToast()?.description).toBe(
      "Formato no permitido. Usá JPG, PNG o WebP.",
    )
  })

  it("muestra el error del servidor cuando la action devuelve ok:false", async () => {
    vi.mocked(updateAvatar).mockResolvedValue({
      ok: false,
      error: "La imagen supera el máximo de 5 MB.",
    })
    const { container } = render(<ProfilePhoto hasAvatar={false} />)

    await userEvent.upload(fileInput(container), jpegFile(2048), {
      applyAccept: false,
    })
    // handleSelect es async: espera al preview antes de buscar el botón.
    await screen.findByAltText("Selección previa")
    await userEvent.click(screen.getByRole("button", { name: /Guardar foto/ }))

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
    const { container } = render(<ProfilePhoto hasAvatar={false} />)

    await userEvent.upload(fileInput(container), jpegFile(2048), {
      applyAccept: false,
    })
    await screen.findByAltText("Selección previa")
    await userEvent.click(screen.getByRole("button", { name: /Guardar foto/ }))

    // Antes del fix esto no mostraba nada y dejaba la UI clavada en el preview.
    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "No se pudo cambiar la foto",
          description: expect.stringContaining("Falló la subida"),
        }),
      ),
    )
    expect(screen.queryByAltText("Selección previa")).not.toBeInTheDocument()
    expect(refresh).toHaveBeenCalled()
  })

  it("confirma y refresca cuando la subida funciona", async () => {
    vi.mocked(updateAvatar).mockResolvedValue({ ok: true })
    const { container } = render(<ProfilePhoto hasAvatar={false} />)
    await userEvent.upload(fileInput(container), jpegFile(2048), {
      applyAccept: false,
    })
    await screen.findByAltText("Selección previa")
    await userEvent.click(screen.getByRole("button", { name: /Guardar foto/ }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({ title: "Foto actualizada" }),
    )
    expect(refresh).toHaveBeenCalled()
  })

  it("envía el FormData con el archivo comprimido y avisa que lo optimizó", async () => {
    vi.mocked(updateAvatar).mockResolvedValue({ ok: true })

    const drawImage = vi.fn()
    vi.stubGlobal("createImageBitmap", vi.fn(async () => ({
      width: 4032,
      height: 3024,
      close: vi.fn(),
    })))
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      fillStyle: "",
      fillRect: vi.fn(),
      drawImage,
    })) as unknown as HTMLCanvasElement["getContext"]
    HTMLCanvasElement.prototype.toBlob = vi.fn(function (
      _callback: BlobCallback,
      type?: string,
    ) {
      _callback(
        new Blob([new Uint8Array(30_000)], { type: type ?? "image/png" }),
      )
    }) as unknown as HTMLCanvasElement["toBlob"]

    const { container } = render(<ProfilePhoto hasAvatar={false} />)
    await userEvent.upload(
      fileInput(container),
      jpegFile(3_000_000),
      { applyAccept: false },
    )

    await waitFor(() => expect(screen.getByAltText("Selección previa")).toBeTruthy())
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Foto optimizada" }),
    )
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      0,
      0,
      AVATAR_TARGET_MAX_EDGE,
      expect.any(Number),
    )

    await userEvent.click(screen.getByRole("button", { name: /Guardar foto/ }))
    await waitFor(() => expect(updateAvatar).toHaveBeenCalled())

    const sent = vi.mocked(updateAvatar).mock.calls[0]?.[0] as FormData
    const file = sent.get("file") as File
    expect(file.type).toBe("image/webp")
    expect(file.size).toBe(30_000)
  })

  it("elimina la foto y refresca", async () => {
    vi.mocked(removeAvatar).mockResolvedValue({ ok: true })
    render(<ProfilePhoto hasAvatar />)

    await userEvent.click(screen.getByRole("button", { name: /Eliminar foto/ }))

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith({ title: "Foto eliminada" }),
    )
    expect(refresh).toHaveBeenCalled()
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
    expect(refresh).toHaveBeenCalled()
  })
})
