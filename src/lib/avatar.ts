export const AVATAR_MAX_BYTES = 5 * 1024 * 1024
export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

export type AllowedAvatarType = (typeof ALLOWED_AVATAR_TYPES)[number]

/** Lado máximo del avatar una vez comprimido en el cliente. */
export const AVATAR_TARGET_MAX_EDGE = 1024
/** Calidad del re-encode a JPEG/WebP en el cliente. */
export const AVATAR_TARGET_QUALITY = 0.82

/**
 * Marcas ISO-BMFF de la familia HEIF (HEIC/HEIF) más AVIF.
 * None se puede decodificar con canvas en Safari, así que se rechazan
 * con un mensaje propio en vez del "formato no permitido" genérico.
 */
const UNSUPPORTED_HEIF_BRANDS = new Set([
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heim",
  "heis",
  "hevm",
  "hevs",
  "mif1",
  "msf1",
  "avif",
  "avis",
])

const TYPE_ALIASES: Record<string, AllowedAvatarType> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/jfif": "image/jpeg",
}

function hasBytes(
  buffer: Uint8Array,
  offset: number,
  bytes: number[],
): boolean {
  if (buffer.length < offset + bytes.length) return false
  for (let i = 0; i < bytes.length; i++) {
    if (buffer[offset + i] !== bytes[i]) return false
  }
  return true
}

function asciiAt(
  buffer: Uint8Array,
  offset: number,
  length: number,
): string {
  if (buffer.length < offset + length) return ""
  let out = ""
  for (let i = 0; i < length; i++) {
    out += String.fromCharCode(buffer[offset + i]!)
  }
  return out
}

/**
 * Normaliza el MIME declarado por el navegador: minúsculas, sin parámetros
 * (`image/jpeg; charset=binary`) y con alias no estándar como `image/jpg`.
 */
export function normalizeAvatarType(
  raw: string | null | undefined,
): string | null {
  if (typeof raw !== "string") return null
  const base = raw.split(";")[0]!.trim().toLowerCase()
  if (!base) return null
  return TYPE_ALIASES[base] ?? base
}

export function avatarTypeFromBytes(
  buffer: Uint8Array,
): AllowedAvatarType | null {
  if (hasBytes(buffer, 0, [0xff, 0xd8, 0xff])) return "image/jpeg"
  if (hasBytes(buffer, 0, [0x89, 0x50, 0x4e, 0x47])) return "image/png"
  if (hasBytes(buffer, 0, [0x52, 0x49, 0x46, 0x46])) {
    if (hasBytes(buffer, 8, [0x57, 0x45, 0x42, 0x50])) return "image/webp"
  }
  return null
}

/** Detecta HEIC/HEIF/AVIF por su box `ftyp` (bytes 4-7) y marca mayor (8-11). */
export function isUnsupportedHeif(buffer: Uint8Array): boolean {
  if (!hasBytes(buffer, 4, [0x66, 0x74, 0x79, 0x70])) return false
  return UNSUPPORTED_HEIF_BRANDS.has(asciiAt(buffer, 8, 4).toLowerCase())
}

export function extensionFor(type: AllowedAvatarType): string {
  switch (type) {
    case "image/jpeg":
      return "jpg"
    case "image/png":
      return "png"
    case "image/webp":
      return "webp"
  }
}

export type AvatarFileLike = { type: string; size: number }

export const AVATAR_FORMAT_ERROR =
  "Formato no permitido. Usá JPG, PNG o WebP."
export const AVATAR_HEIF_ERROR =
  "Las fotos HEIC/HEIF no se pueden subir. Abrila en Fotos y guardala como JPG."
export const AVATAR_SIZE_ERROR = "La imagen supera el máximo de 5 MB."

/** Chequeo barato de tamaño, para usar antes de leer los bytes. */
export function avatarSizeError(size: number): string | null {
  if (size === 0) return "El archivo está vacío."
  if (size > AVATAR_MAX_BYTES) return AVATAR_SIZE_ERROR
  return null
}

/**
 * Chequeo de tamaño + tipo declarado, sin leer bytes. Es el que permite
 * frenar en el cliente antes de generar preview o subir nada por la red.
 */
export function avatarQuickError(file: AvatarFileLike): string | null {
  const sizeError = avatarSizeError(file.size)
  if (sizeError) return sizeError

  const declared = normalizeAvatarType(file.type)
  if (declared === "image/heic" || declared === "image/heif") {
    return AVATAR_HEIF_ERROR
  }
  if (
    !declared ||
    !(ALLOWED_AVATAR_TYPES as readonly string[]).includes(declared)
  ) {
    return AVATAR_FORMAT_ERROR
  }
  return null
}

/**
 * Validación autoritativa del servidor: tamaño, MIME declarado normalizado y
 * coincidencia con los magic bytes reales. No confía en el `Content-Type`.
 */
export function avatarValidationError(
  file: AvatarFileLike,
  buffer: Uint8Array,
): string | null {
  const sizeError = avatarSizeError(file.size)
  if (sizeError) return sizeError

  if (isUnsupportedHeif(buffer)) return AVATAR_HEIF_ERROR

  const declared = normalizeAvatarType(file.type)
  if (
    !declared ||
    !(ALLOWED_AVATAR_TYPES as readonly string[]).includes(declared)
  ) {
    return AVATAR_FORMAT_ERROR
  }

  const detected = avatarTypeFromBytes(buffer)
  if (!detected || detected !== declared) {
    return "El archivo no parece una imagen válida."
  }
  return null
}
