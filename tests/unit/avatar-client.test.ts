// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  AVATAR_RECOMPRESS_THRESHOLD_BYTES,
  prepareAvatarFile,
} from "@/lib/avatar-client"
import {
  AVATAR_HEIF_ERROR,
  AVATAR_MAX_BYTES,
  AVATAR_SIZE_ERROR,
  AVATAR_TARGET_MAX_EDGE,
} from "@/lib/avatar"

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]

function ascii(text: string): number[] {
  return [...text].map((char) => char.charCodeAt(0))
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

/** JPEG válido de cabecera, con padding para poder pedir cualquier tamaño. */
function jpegFile(size: number, name = "foto.jpg"): File {
  const buffer = new Uint8Array(size)
  buffer.set(JPEG_HEADER, 0)
  return new File([buffer], name, { type: "image/jpeg" })
}

function heicFile(name = "IMG_0042.HEIC"): File {
  return new File([heicBytes()], name, { type: "image/heic" })
}

type DecodedCanvas = {
  calls: Array<{ type: string; quality: number }>
  fillStyle: string
  drawn: Array<{ source: unknown; width: number; height: number }>
}

let decoded: DecodedCanvas
let createImageBitmap: ReturnType<typeof vi.fn>

/**
 * jsdom no implementa canvas ni createImageBitmap. El stub devuelve un blob
 * `producedBytes` para poder verificar que el helper prefiera el resultado más
 * chico y respete los tipos que el navegador dice no soportar.
 */
function stubCanvas({ producedBytes, supportedTypes }: {
  producedBytes: number
  supportedTypes: string[]
}) {
  createImageBitmap = vi.fn(async () => ({
    width: 4032,
    height: 3024,
    close: vi.fn(),
  }))

  vi.stubGlobal("createImageBitmap", createImageBitmap)
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    set fillStyle(value: string) {
      decoded.fillStyle = value
    },
    get fillStyle() {
      return decoded.fillStyle
    },
    fillRect: vi.fn(),
    drawImage: vi.fn((source: unknown, _x: number, _y: number, width: number, height: number) => {
      decoded.drawn.push({ source, width, height })
    }),
  })) as unknown as HTMLCanvasElement["getContext"]

  HTMLCanvasElement.prototype.toBlob = vi.fn(function (
    this: HTMLCanvasElement,
    callback: BlobCallback,
    type?: string,
    quality?: number,
  ) {
    decoded.calls.push({ type: type ?? "", quality: quality ?? 0 })
    if (!supportedTypes.includes(type ?? "")) {
      // El navegador cae silenciosamente a PNG, como manda el spec.
      callback(new Blob([new Uint8Array(producedBytes)], { type: "image/png" }))
      return
    }
    callback(new Blob([new Uint8Array(producedBytes)], { type: type! }))
  })
}

beforeEach(() => {
  decoded = { calls: [], fillStyle: "", drawn: [] }
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("prepareAvatarFile", () => {
  it("deja pasar sin retocar los archivos chicos", async () => {
    const original = jpegFile(1024)
    const result = await prepareAvatarFile(original)

    expect(result).toEqual({ ok: true, file: original, recompressed: false })
    expect(createImageBitmap).toBeUndefined()
  })

  it("rechaza HEIC antes de intentar decodificarlo", async () => {
    const result = await prepareAvatarFile(heicFile())

    expect(result).toEqual({ ok: false, error: AVATAR_HEIF_ERROR })
  })

  it("rechaza por tamaño sin tocar el canvas", async () => {
    stubCanvas({ producedBytes: 10, supportedTypes: ["image/webp"] })
    const result = await prepareAvatarFile(
      jpegFile(AVATAR_MAX_BYTES + 1),
    )

    expect(result).toEqual({ ok: false, error: AVATAR_SIZE_ERROR })
  })

  it("reduce una foto de iPhone y respeta el lado máximo", async () => {
    stubCanvas({ producedBytes: 40_000, supportedTypes: ["image/webp"] })
    const original = jpegFile(AVATAR_RECOMPRESS_THRESHOLD_BYTES + 1)

    const result = await prepareAvatarFile(original)

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.recompressed).toBe(true)
    expect(result.file.size).toBe(40_000)
    expect(result.file.type).toBe("image/webp")
    expect(result.file.name).toBe("foto.webp")

    // 4032x3024 -> el lado mayor queda en AVATAR_TARGET_MAX_EDGE.
    expect(decoded.drawn[0]?.width).toBe(AVATAR_TARGET_MAX_EDGE)
    expect(decoded.drawn[0]?.height).toBe(
      Math.round((AVATAR_TARGET_MAX_EDGE * 3024) / 4032),
    )
    // Fondo blanco: JPEG/WebP no tienen canal alfa.
    expect(decoded.fillStyle).toBe("#ffffff")
    expect(decoded.calls[0]?.type).toBe("image/webp")
  })

  it("cae a JPEG cuando el navegador no codifica WebP", async () => {
    stubCanvas({ producedBytes: 55_000, supportedTypes: ["image/jpeg"] })
    const original = jpegFile(AVATAR_RECOMPRESS_THRESHOLD_BYTES + 1)

    const result = await prepareAvatarFile(original)

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.file.type).toBe("image/jpeg")
    expect(decoded.calls.map((call) => call.type)).toEqual([
      "image/webp",
      "image/jpeg",
    ])
  })

  it("preserva el canal alfa del PNG antes de caer a JPEG", async () => {
    stubCanvas({ producedBytes: 60_000, supportedTypes: ["image/png"] })
    const pngBytes = new Uint8Array(AVATAR_RECOMPRESS_THRESHOLD_BYTES + 1)
    pngBytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0)
    const original = new File([pngBytes], "logo.png", { type: "image/png" })

    const result = await prepareAvatarFile(original)

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.file.type).toBe("image/png")
    expect(result.file.name).toBe("logo.png")
  })

  it("mantiene el archivo original si comprimirlo no ayuda", async () => {
    const originalSize = AVATAR_RECOMPRESS_THRESHOLD_BYTES + 1
    stubCanvas({ producedBytes: originalSize + 10, supportedTypes: ["image/webp"] })
    const original = jpegFile(originalSize)

    const result = await prepareAvatarFile(original)

    expect(result).toEqual({ ok: true, file: original, recompressed: false })
  })

  it("informa un error claro cuando el navegador no puede decodificar", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => {
        throw new Error("unsupported image format")
      }),
    )
    const original = jpegFile(AVATAR_RECOMPRESS_THRESHOLD_BYTES + 1)

    const result = await prepareAvatarFile(original)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain("No pudimos leer esa imagen")
  })

  it("informa un error cuando el canvas no está disponible", async () => {
    stubCanvas({ producedBytes: 1000, supportedTypes: ["image/webp"] })
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as
      HTMLCanvasElement["getContext"]
    const original = jpegFile(AVATAR_RECOMPRESS_THRESHOLD_BYTES + 1)

    const result = await prepareAvatarFile(original)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain("No pudimos leer esa imagen")
  })
})
