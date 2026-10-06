// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cropAvatarFile } from "@/lib/avatar-client"
import { centeredSquareArea, type CropArea } from "@/lib/avatar-crop"
import {
  AVATAR_CROP_SIZE,
  AVATAR_HEIF_ERROR,
  AVATAR_MAX_BYTES,
  AVATAR_SIZE_ERROR,
  AVATAR_TARGET_QUALITY,
} from "@/lib/avatar"

const JPEG_HEADER = [0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]

/** Landscape de iPhone. */
const LANDSCAPE = { width: 4032, height: 3024 }
/** La misma foto rotada: portrait. */
const PORTRAIT = { width: 3024, height: 4032 }

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
function jpegFile(size = 2048, name = "foto.jpg"): File {
  const buffer = new Uint8Array(size)
  buffer.set(JPEG_HEADER, 0)
  return new File([buffer], name, { type: "image/jpeg" })
}

function heicFile(name = "IMG_0042.HEIC"): File {
  return new File([heicBytes()], name, { type: "image/heic" })
}

type DrawCall = {
  source: unknown
  sx: number
  sy: number
  sw: number
  sh: number
  dx: number
  dy: number
  dw: number
  dh: number
}

type Decode = {
  encoded: Array<{ type: string; quality: number }>
  fillStyle: string
  canvasSizes: Array<{ width: number; height: number }>
  drawn: DrawCall[]
  closed: boolean
}

let decode: Decode
let bitmap: { width: number; height: number; close: () => void }

/**
 * jsdom no implementa canvas ni createImageBitmap. El stub registra el
 * rectángulo de origen que se le pasa a `drawImage` para poder verificar que el
 * archivo final lleva el recorte elegido, y devuelve un blob `producedBytes`
 * con el tipo que el navegador dice soporta.
 */
function stubBrowser({
  producedBytes = 40_000,
  supportedTypes = ["image/webp"],
  size = LANDSCAPE,
}: {
  producedBytes?: number
  supportedTypes?: string[]
  size?: { width: number; height: number }
} = {}) {
  bitmap = { ...size, close: vi.fn(() => { decode.closed = true }) }
  vi.stubGlobal("createImageBitmap", vi.fn(async () => bitmap))

  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    set fillStyle(value: string) {
      decode.fillStyle = value
    },
    get fillStyle() {
      return decode.fillStyle
    },
    fillRect: vi.fn(),
    drawImage: vi.fn(
      (
        source: unknown,
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        dx: number,
        dy: number,
        dw: number,
        dh: number,
      ) => {
        decode.drawn.push({ source, sx, sy, sw, sh, dx, dy, dw, dh })
      },
    ),
  })) as unknown as HTMLCanvasElement["getContext"]

  HTMLCanvasElement.prototype.toBlob = vi.fn(function (
    this: HTMLCanvasElement,
    callback: BlobCallback,
    type?: string,
    quality?: number,
  ) {
    decode.encoded.push({ type: type ?? "", quality: quality ?? 0 })
    decode.canvasSizes.push({ width: this.width, height: this.height })
    if (!supportedTypes.includes(type ?? "")) {
      // El navegador cae silenciosamente a PNG, como manda el spec.
      callback(new Blob([new Uint8Array(producedBytes)], { type: "image/png" }))
      return
    }
    callback(new Blob([new Uint8Array(producedBytes)], { type: type! }))
  })
}

/** El rectángulo que el editor pasó a `drawImage`. */
function sourceBox(): DrawCall {
  const call = decode.drawn[0]
  if (!call) throw new Error("no se dibujó nada en el canvas")
  return call
}

beforeEach(() => {
  decode = { encoded: [], fillStyle: "", canvasSizes: [], drawn: [], closed: false }
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("cropAvatarFile", () => {
  it("graba el recorte elegido en un archivo cuadrado del tamaño de avatar", async () => {
    stubBrowser()

    const result = await cropAvatarFile(
      jpegFile(),
      { x: 100, y: 200, width: 1200, height: 1200 },
      LANDSCAPE,
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.file.type).toBe("image/webp")
    expect(result.file.size).toBe(40_000)
    expect(result.file.name).toBe("foto.webp")

    // El canvas es el avatar: siempre cuadrado y del tamaño acordado.
    expect(decode.canvasSizes[0]).toEqual({
      width: AVATAR_CROP_SIZE,
      height: AVATAR_CROP_SIZE,
    })

    // El rectángulo de origen es exactamente el encuadre, y ocupa todo el
    // canvas de destino.
    expect(sourceBox()).toMatchObject({
      sx: 100,
      sy: 200,
      sw: 1200,
      sh: 1200,
      dx: 0,
      dy: 0,
      dw: AVATAR_CROP_SIZE,
      dh: AVATAR_CROP_SIZE,
    })
    expect(decode.fillStyle).toBe("#ffffff")
    expect(decode.encoded[0]).toEqual({
      type: "image/webp",
      quality: AVATAR_TARGET_QUALITY,
    })
    expect(decode.closed).toBe(true)
  })

  it("encaja una horizontal sin dejar partes fuera del círculo", async () => {
    stubBrowser({ size: LANDSCAPE })

    const result = await cropAvatarFile(
      jpegFile(),
      centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height),
      LANDSCAPE,
    )

    expect(result.ok).toBe(true)
    // 4032x3024 -> cuadrado de 3024 centrado: sobran 504px a cada lado.
    expect(sourceBox()).toMatchObject({ sx: 504, sy: 0, sw: 3024, sh: 3024 })
    expect(bitmap.close).toHaveBeenCalled()
  })

  it("encaja una vertical sin dejar partes fuera del círculo", async () => {
    stubBrowser({ size: PORTRAIT })

    const result = await cropAvatarFile(
      jpegFile(),
      centeredSquareArea(PORTRAIT.width, PORTRAIT.height),
      PORTRAIT,
    )

    expect(result.ok).toBe(true)
    expect(sourceBox()).toMatchObject({ sx: 0, sy: 504, sw: 3024, sh: 3024 })
  })

  it("mueve la fuente cuando el usuario arrastra la imagen", async () => {
    stubBrowser()
    const area = centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height)
    const dragged: CropArea = { ...area, x: area.x + 300 }

    await cropAvatarFile(jpegFile(), dragged, LANDSCAPE)

    expect(sourceBox()).toMatchObject({ sx: area.x + 300, sy: area.y })
    expect(sourceBox().sw).toBe(area.width)
  })

  it("agranda la fuente cuando el usuario hace zoom", async () => {
    stubBrowser()
    const area = centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height)
    // Zoom x2 sobre una horizontal: el círculo pasa a tomar 1512px de fuente,
    // pero el archivo de salida sigue siendo el mismo cuadrado.
    const zoomed: CropArea = {
      x: area.x + (area.width - 1512) / 2,
      y: area.y + (area.height - 1512) / 2,
      width: 1512,
      height: 1512,
    }

    await cropAvatarFile(jpegFile(), zoomed, LANDSCAPE)

    expect(sourceBox()).toMatchObject({ sw: 1512, sh: 1512 })
    expect(decode.canvasSizes[0]?.width).toBe(AVATAR_CROP_SIZE)
  })

  it("ajusta un área desfasada para que el círculo nunca quede vacío", async () => {
    stubBrowser()

    const result = await cropAvatarFile(
      jpegFile(),
      { x: -200, y: -200, width: 9000, height: 9000 },
      LANDSCAPE,
    )

    expect(result.ok).toBe(true)
    const box = sourceBox()
    expect(box.sw).toBeGreaterThan(0)
    expect(box.sh).toBeGreaterThan(0)
    expect(box.sx).toBeGreaterThanOrEqual(0)
    expect(box.sy).toBeGreaterThanOrEqual(0)
    expect(box.sx + box.sw).toBeLessThanOrEqual(LANDSCAPE.width)
    expect(box.sy + box.sh).toBeLessThanOrEqual(LANDSCAPE.height)
  })

  it("reexpresa el área cuando el bitmap es más chico que el preview", async () => {
    // El bitmap llega reducido (por ejemplo, un navegador que decodifica con
    // su propio límite de memoria): el área hay que expresarla en esa escala.
    stubBrowser({ size: { width: 2016, height: 1512 } })

    await cropAvatarFile(
      jpegFile(),
      { x: 100, y: 200, width: 1200, height: 1200 },
      LANDSCAPE,
    )

    expect(sourceBox()).toMatchObject({ sx: 50, sy: 100, sw: 600, sh: 600 })
  })

  it("reexpresa el área cuando la orientación EXIF difiere entre el preview y el bitmap", async () => {
    // El preview se mostró rotado (4032 de ancho) pero el bitmap quedó crudo:
    // usar las coordenadas sin reexpresar sacaría el recorte de la imagen.
    stubBrowser({ size: PORTRAIT })

    await cropAvatarFile(
      jpegFile(),
      centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height),
      LANDSCAPE,
    )

    const box = sourceBox()
    expect(box).toMatchObject({ sx: 378, sy: 0, sw: 2268, sh: 3024 })
    expect(box.sx + box.sw).toBeLessThanOrEqual(PORTRAIT.width)
    expect(box.sy + box.sh).toBeLessThanOrEqual(PORTRAIT.height)
  })

  it("rechaza HEIC antes de intentar decodificarlo", async () => {
    const result = await cropAvatarFile(
      heicFile(),
      centeredSquareArea(4032, 3024),
      LANDSCAPE,
    )

    expect(result).toEqual({ ok: false, error: AVATAR_HEIF_ERROR })
    expect(decode.drawn).toHaveLength(0)
  })

  it("rechaza por tamaño sin tocar el canvas", async () => {
    stubBrowser()

    const result = await cropAvatarFile(
      jpegFile(AVATAR_MAX_BYTES + 1),
      centeredSquareArea(4032, 3024),
      LANDSCAPE,
    )

    expect(result).toEqual({ ok: false, error: AVATAR_SIZE_ERROR })
    expect(decode.drawn).toHaveLength(0)
  })

  it("cae a JPEG cuando el navegador no codifica WebP", async () => {
    stubBrowser({ producedBytes: 55_000, supportedTypes: ["image/jpeg"] })

    const result = await cropAvatarFile(
      jpegFile(),
      centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height),
      LANDSCAPE,
    )

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.file.type).toBe("image/jpeg")
    expect(result.file.name).toBe("foto.jpg")
    expect(decode.encoded.map((call) => call.type)).toEqual([
      "image/webp",
      "image/jpeg",
    ])
  })

  it("informa un error claro cuando ningún formato se puede codificar", async () => {
    stubBrowser({ supportedTypes: [] })

    const result = await cropAvatarFile(
      jpegFile(),
      centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height),
      LANDSCAPE,
    )

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain("No pudimos guardar el recorte")
    expect(decode.closed).toBe(true)
  })

  it("rechaza el resultado si el canvas devuelve null", async () => {
    stubBrowser()
    HTMLCanvasElement.prototype.toBlob = vi.fn(
      (callback: BlobCallback) => callback(null),
    ) as unknown as HTMLCanvasElement["toBlob"]

    const result = await cropAvatarFile(
      jpegFile(),
      centeredSquareArea(LANDSCAPE.width, LANDSCAPE.height),
      LANDSCAPE,
    )

    expect(result.ok).toBe(false)
  })

  it("informa un error claro cuando el navegador no puede decodificar", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn(async () => {
        throw new Error("unsupported image format")
      }),
    )

    const result = await cropAvatarFile(
      jpegFile(),
      centeredSquareArea(4032, 3024),
      LANDSCAPE,
    )

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain("No pudimos leer esa imagen")
  })

  it("informa un error cuando el canvas no está disponible", async () => {
    stubBrowser()
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as
      HTMLCanvasElement["getContext"]

    const result = await cropAvatarFile(
      jpegFile(),
      centeredSquareArea(4032, 3024),
      LANDSCAPE,
    )

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error).toContain("No pudimos leer esa imagen")
    expect(decode.closed).toBe(true)
  })
})
