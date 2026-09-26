import {
  AVATAR_HEIF_ERROR,
  AVATAR_SIZE_ERROR,
  AVATAR_TARGET_MAX_EDGE,
  AVATAR_TARGET_QUALITY,
  avatarQuickError,
  avatarSizeError,
  extensionFor,
  isUnsupportedHeif,
  normalizeAvatarType,
  type AllowedAvatarType,
} from "@/lib/avatar"

/**
 * Por debajo de este tamaño el archivo se sube tal cual. Re-encodear de más
 * sólo suma pérdida de calidad y latencia.
 */
export const AVATAR_RECOMPRESS_THRESHOLD_BYTES = 512 * 1024

/** Bytes leídos del inicio para detectar HEIC sin cargar el archivo entero. */
const HEADER_BYTES = 16

const HEIC_DECODE_ERROR =
  "No pudimos leer esa imagen. Probá con otra foto o guardala como JPG."

type PrepareResult =
  | { ok: true; file: File; recompressed: boolean }
  | { ok: false; error: string }

function stripExtension(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot > 0 ? name.slice(0, dot) : name
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: AllowedAvatarType,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (typeof canvas.toBlob !== "function") {
      resolve(null)
      return
    }
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

/**
 * Deja el archivo listo para subir: valida, detecta HEIC y reduce a un avatar
 * cuadrado-ish de AVATAR_TARGET_MAX_EDGE. Nunca devuelve un archivo más
 * grande que el original.
 *
 * Safari no decodifica HEIC con canvas, así que ese caso se rechaza con un
 * mensaje explícito en vez de fallar en silencio.
 */
export async function prepareAvatarFile(file: File): Promise<PrepareResult> {
  const quickError = avatarQuickError(file)
  if (quickError) return { ok: false, error: quickError }

  const header = new Uint8Array(
    await file.slice(0, HEADER_BYTES).arrayBuffer(),
  )
  if (isUnsupportedHeif(header)) return { ok: false, error: AVATAR_HEIF_ERROR }

  if (file.size <= AVATAR_RECOMPRESS_THRESHOLD_BYTES) {
    return { ok: true, file, recompressed: false }
  }

  let bitmap: ImageBitmap
  try {
    // `from-image` (el default del spec) aplica la rotación EXIF, que las fotos
    // de iPhone traen puesta.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    return { ok: false, error: HEIC_DECODE_ERROR }
  }

  try {
    const longestEdge = Math.max(bitmap.width, bitmap.height)
    if (!longestEdge) return { ok: false, error: HEIC_DECODE_ERROR }

    const scale = Math.min(1, AVATAR_TARGET_MAX_EDGE / longestEdge)
    const width = Math.max(1, Math.round(bitmap.width * scale))
    const height = Math.max(1, Math.round(bitmap.height * scale))

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext("2d")
    if (!context) return { ok: false, error: HEIC_DECODE_ERROR }

    // JPEG/WebP sin alfa: fondo blanco para no dejar bordes negros.
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, width, height)
    context.drawImage(bitmap, 0, 0, width, height)

    const declared = normalizeAvatarType(file.type)
    const candidates: AllowedAvatarType[] =
      declared === "image/png"
        ? ["image/png", "image/jpeg"]
        : ["image/webp", "image/jpeg"]

    for (const type of candidates) {
      const blob = await canvasToBlob(canvas, type, AVATAR_TARGET_QUALITY)
      // toBlob cae silenciosamente a PNG si el navegador no soporta el tipo.
      if (!blob || normalizeAvatarType(blob.type) !== type) continue

      const sizeError = avatarSizeError(blob.size)
      if (sizeError) return { ok: false, error: AVATAR_SIZE_ERROR }

      const prepared = new File(
        [blob],
        `${stripExtension(file.name) || "avatar"}.${extensionFor(type)}`,
        { type, lastModified: Date.now() },
      )

      if (prepared.size >= file.size) {
        return { ok: true, file, recompressed: false }
      }
      return { ok: true, file: prepared, recompressed: true }
    }

    return {
      ok: false,
      error: "No pudimos comprimir la imagen. Probá con una más chica.",
    }
  } finally {
    bitmap.close?.()
  }
}
