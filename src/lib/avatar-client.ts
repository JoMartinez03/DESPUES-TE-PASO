import {
  AVATAR_CROP_SIZE,
  AVATAR_HEIF_ERROR,
  AVATAR_TARGET_QUALITY,
  avatarQuickError,
  avatarSizeError,
  extensionFor,
  isUnsupportedHeif,
  normalizeAvatarType,
  type AllowedAvatarType,
} from "@/lib/avatar"
import {
  clampCropArea,
  scaleArea,
  type CropArea,
  type CropSize,
} from "@/lib/avatar-crop"

/** Bytes leídos del inicio para detectar HEIC sin cargar el archivo entero. */
const HEADER_BYTES = 16

const DECODE_ERROR =
  "No pudimos leer esa imagen. Probá con otra foto o guardala como JPG."

/**
 * El avatar siempre se guarda en WebP; JPEG queda como red de seguridad para
 * navegadores sin soporte de encoding WebP.
 */
const OUTPUT_TYPES: AllowedAvatarType[] = ["image/webp", "image/jpeg"]

export type AvatarCropResult =
  | { ok: true; file: File }
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
 * Convierte el encuadre elegido en un archivo cuadrado de AVATAR_CROP_SIZE.
 *
 * El recorte queda grabado en los píxeles del archivo, así que el resto de la
 * app sigue mostrando sólo la URL: no hay coordenadas en Prisma ni en el avatar.
 *
 * Safari no decodifica HEIC con canvas, así que ese caso se rechaza con un
 * mensaje explícito en vez de fallar en silencio.
 */
export async function cropAvatarFile(
  file: File,
  area: CropArea,
  natural: CropSize,
): Promise<AvatarCropResult> {
  const quickError = avatarQuickError(file)
  if (quickError) return { ok: false, error: quickError }

  const header = new Uint8Array(
    await file.slice(0, HEADER_BYTES).arrayBuffer(),
  )
  if (isUnsupportedHeif(header)) return { ok: false, error: AVATAR_HEIF_ERROR }

  let bitmap: ImageBitmap
  try {
    // `from-image` (el default del spec) aplica la rotación EXIF, que las fotos
    // de iPhone traen puesta.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    return { ok: false, error: DECODE_ERROR }
  }

  try {
    const bitmapSize = { width: bitmap.width, height: bitmap.height }
    if (!bitmapSize.width || !bitmapSize.height) {
      return { ok: false, error: DECODE_ERROR }
    }

    // Si el navegador Orientó la foto para mostrarla pero el bitmap quedó en la
    // orientación cruda (o al revés), el área se reexpresa en la resolución del
    // bitmap antes de recortar.
    const scaled = scaleArea(area, natural, bitmapSize)
    const box = clampCropArea(scaled, bitmapSize.width, bitmapSize.height)

    const canvas = document.createElement("canvas")
    canvas.width = AVATAR_CROP_SIZE
    canvas.height = AVATAR_CROP_SIZE
    const context = canvas.getContext("2d")
    if (!context) return { ok: false, error: DECODE_ERROR }

    // JPEG sin alfa: fondo blanco para no dejar bordes negros.
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, AVATAR_CROP_SIZE, AVATAR_CROP_SIZE)
    context.drawImage(
      bitmap,
      box.x,
      box.y,
      box.width,
      box.height,
      0,
      0,
      AVATAR_CROP_SIZE,
      AVATAR_CROP_SIZE,
    )

    for (const type of OUTPUT_TYPES) {
      const blob = await canvasToBlob(canvas, type, AVATAR_TARGET_QUALITY)
      // toBlob cae silenciosamente a PNG si el navegador no soporta el tipo.
      if (!blob || normalizeAvatarType(blob.type) !== type) continue

      const sizeError = avatarSizeError(blob.size)
      if (sizeError) return { ok: false, error: sizeError }

      const name = stripExtension(file.name) || "avatar"
      return {
        ok: true,
        file: new File([blob], `${name}.${extensionFor(type)}`, {
          type,
          lastModified: Date.now(),
        }),
      }
    }

    return {
      ok: false,
      error: "No pudimos guardar el recorte. Probá con otra foto.",
    }
  } finally {
    bitmap.close?.()
  }
}
