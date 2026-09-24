export const AVATAR_MAX_BYTES = 5 * 1024 * 1024
export const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

export type AllowedAvatarType = (typeof ALLOWED_AVATAR_TYPES)[number]

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

export function avatarValidationError(
  file: AvatarFileLike,
  buffer: Uint8Array,
): string | null {
  if (file.size === 0) return "El archivo está vacío."
  if (file.size > AVATAR_MAX_BYTES)
    return "La imagen supera el máximo de 5 MB."
  if (!(ALLOWED_AVATAR_TYPES as readonly string[]).includes(file.type))
    return "Formato no permitido. Usá JPG, PNG o WebP."
  const detected = avatarTypeFromBytes(buffer)
  if (!detected || detected !== file.type) {
    return "El archivo no parece una imagen válida."
  }
  return null
}