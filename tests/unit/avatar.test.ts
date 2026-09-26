import { describe, expect, it } from "vitest"
import {
  ALLOWED_AVATAR_TYPES,
  AVATAR_FORMAT_ERROR,
  AVATAR_HEIF_ERROR,
  AVATAR_MAX_BYTES,
  AVATAR_SIZE_ERROR,
  avatarQuickError,
  avatarTypeFromBytes,
  avatarValidationError,
  extensionFor,
  isUnsupportedHeif,
  normalizeAvatarType,
} from "@/lib/avatar"

function ascii(text: string): number[] {
  return [...text].map((char) => char.charCodeAt(0))
}

function bytes(...values: number[]): Uint8Array {
  return new Uint8Array(values)
}

const JPEG = bytes(0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46)
const PNG = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
const WEBP = bytes(
  0x52,
  0x49,
  0x46,
  0x46,
  0x00,
  0x00,
  0x00,
  0x00,
  0x57,
  0x45,
  0x42,
  0x50,
  0x56,
  0x50,
  0x38,
)

/** Box ISO-BMFF: size(4) + "ftyp" + majorBrand(4) + minorVersion(4) + compatibles. */
function heif(brand = "heic"): Uint8Array {
  return bytes(
    0x00,
    0x00,
    0x00,
    0x18,
    ...ascii("ftyp"),
    ...ascii(brand),
    0x00,
    0x00,
    0x00,
    0x00,
    ...ascii("mif1"),
    ...ascii(brand),
  )
}

const NOT_AN_IMAGE = bytes(0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37)

function file(type: string, size: number) {
  return { type, size }
}

describe("normalizeAvatarType", () => {
  it("deja los tipos canónicos sin tocar", () => {
    for (const type of ALLOWED_AVATAR_TYPES) {
      expect(normalizeAvatarType(type)).toBe(type)
    }
  })

  it("mapea los alias no estándar que mandan algunos navegadores", () => {
    expect(normalizeAvatarType("image/jpg")).toBe("image/jpeg")
    expect(normalizeAvatarType("IMAGE/JPG")).toBe("image/jpeg")
    expect(normalizeAvatarType("image/pjpeg")).toBe("image/jpeg")
    expect(normalizeAvatarType("image/jfif")).toBe("image/jpeg")
  })

  it("descarta parámetros del Content-Type", () => {
    expect(normalizeAvatarType("image/jpeg; charset=binary")).toBe("image/jpeg")
  })

  it("devuelve null para valores vacíos o ausentes", () => {
    expect(normalizeAvatarType("")).toBeNull()
    expect(normalizeAvatarType("   ")).toBeNull()
    expect(normalizeAvatarType(null)).toBeNull()
    expect(normalizeAvatarType(undefined)).toBeNull()
  })
})

describe("avatarTypeFromBytes", () => {
  it("reconoce JPEG, PNG y WebP por sus magic bytes", () => {
    expect(avatarTypeFromBytes(JPEG)).toBe("image/jpeg")
    expect(avatarTypeFromBytes(PNG)).toBe("image/png")
    expect(avatarTypeFromBytes(WEBP)).toBe("image/webp")
  })

  it("no acepta un RIFF que no sea WebP", () => {
    const wav = bytes(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45)
    expect(avatarTypeFromBytes(wav)).toBeNull()
  })

  it("devuelve null para buffers vacíos o truncados", () => {
    expect(avatarTypeFromBytes(bytes())).toBeNull()
    expect(avatarTypeFromBytes(bytes(0xff))).toBeNull()
  })
})

describe("isUnsupportedHeif", () => {
  it("detecta las marcas de HEIC y HEIF", () => {
    for (const brand of ["heic", "heix", "hevc", "hevx", "mif1", "msf1"]) {
      expect(isUnsupportedHeif(heif(brand))).toBe(true)
    }
  })

  it("detecta AVIF, que Safari tampoco decodifica en canvas", () => {
    expect(isUnsupportedHeif(heif("avif"))).toBe(true)
  })

  it("no marca imágenes comunes", () => {
    expect(isUnsupportedHeif(JPEG)).toBe(false)
    expect(isUnsupportedHeif(PNG)).toBe(false)
    expect(isUnsupportedHeif(WEBP)).toBe(false)
  })
})

describe("avatarQuickError", () => {
  it("acepta los tres formatos soportados", () => {
    expect(avatarQuickError(file("image/jpeg", 2048))).toBeNull()
    expect(avatarQuickError(file("image/png", 2048))).toBeNull()
    expect(avatarQuickError(file("image/webp", 2048))).toBeNull()
  })

  it("rechaza archivos vacíos y por encima del límite", () => {
    expect(avatarQuickError(file("image/jpeg", 0))).toBe("El archivo está vacío.")
    expect(avatarQuickError(file("image/jpeg", AVATAR_MAX_BYTES + 1))).toBe(
      AVATAR_SIZE_ERROR,
    )
  })

  it("acepta exactamente el límite", () => {
    expect(avatarQuickError(file("image/jpeg", AVATAR_MAX_BYTES))).toBeNull()
  })

  it("da un mensaje propio para HEIC/HEIF", () => {
    expect(avatarQuickError(file("image/heic", 2048))).toBe(AVATAR_HEIF_ERROR)
    expect(avatarQuickError(file("image/heif", 2048))).toBe(AVATAR_HEIF_ERROR)
  })

  it("rechaza otros formatos y los tipos vacíos", () => {
    expect(avatarQuickError(file("image/gif", 2048))).toBe(AVATAR_FORMAT_ERROR)
    expect(avatarQuickError(file("application/pdf", 2048))).toBe(
      AVATAR_FORMAT_ERROR,
    )
    expect(avatarQuickError(file("", 2048))).toBe(AVATAR_FORMAT_ERROR)
  })
})

describe("avatarValidationError", () => {
  it("valida los tres formatos válidos", () => {
    expect(avatarValidationError(file("image/jpeg", JPEG.length), JPEG)).toBeNull()
    expect(avatarValidationError(file("image/png", PNG.length), PNG)).toBeNull()
    expect(avatarValidationError(file("image/webp", WEBP.length), WEBP)).toBeNull()
  })

  it("acepta image/jpg porque se normaliza antes de comparar", () => {
    expect(avatarValidationError(file("image/jpg", JPEG.length), JPEG)).toBeNull()
  })

  it("rechaza si el MIME declarado no coincide con los bytes reales", () => {
    expect(avatarValidationError(file("image/png", JPEG.length), JPEG)).toBe(
      "El archivo no parece una imagen válida.",
    )
  })

  it("rechaza un archivo que no es una imagen", () => {
    expect(
      avatarValidationError(file("image/jpeg", NOT_AN_IMAGE.length), NOT_AN_IMAGE),
    ).toBe("El archivo no parece una imagen válida.")
  })

  it("rechaza HEIC aunque se declare como JPEG", () => {
    const buffer = heif("heic")
    expect(avatarValidationError(file("image/jpeg", buffer.length), buffer)).toBe(
      AVATAR_HEIF_ERROR,
    )
  })

  it("rechaza por tamaño antes de mirar el contenido", () => {
    expect(avatarValidationError(file("image/jpeg", AVATAR_MAX_BYTES + 1), JPEG)).toBe(
      AVATAR_SIZE_ERROR,
    )
    expect(avatarValidationError(file("image/jpeg", 0), bytes())).toBe(
      "El archivo está vacío.",
    )
  })

  it("rechaza formatos fuera de la allowlist", () => {
    expect(avatarValidationError(file("image/gif", JPEG.length), JPEG)).toBe(
      AVATAR_FORMAT_ERROR,
    )
  })
})

describe("extensionFor", () => {
  it("mapea cada tipo soportado a su extensión", () => {
    expect(extensionFor("image/jpeg")).toBe("jpg")
    expect(extensionFor("image/png")).toBe("png")
    expect(extensionFor("image/webp")).toBe("webp")
  })
})
