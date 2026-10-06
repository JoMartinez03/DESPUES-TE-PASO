/**
 * Geometría del encuadre del avatar. Sin DOM ni canvas: son números que el
 * editor y el recorte comparten, así que van en un módulo aparte y se prueban
 * sin navegador.
 */

/** Rectángulo del recorte en píxeles de la imagen (o del bitmap ya orientado). */
export type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

export type CropSize = {
  width: number
  height: number
}

/**
 * El cuadrado más grande posible centrado en la imagen: el encuadre que ve el
 * usuario antes de tocar nada, y el fallback si todavía no llegó ningún evento
 * de crop.
 */
export function centeredSquareArea(
  naturalWidth: number,
  naturalHeight: number,
): CropArea {
  const side = Math.max(1, Math.floor(Math.min(naturalWidth, naturalHeight)))
  return {
    x: Math.max(0, Math.round((naturalWidth - side) / 2)),
    y: Math.max(0, Math.round((naturalHeight - side) / 2)),
    width: side,
    height: side,
  }
}

/**
 * Ajusta el área a los límites reales de la imagen. Nunca devuelve un ancho o
 * alto en cero ni un rectángulo fuera de la imagen, así que el recorte
 * resultante no puede dejar espacios vacíos aunque las coordenadas vengan
 * desfasadas.
 *
 * Only recorta lo que sobra: no recentra, para no cambiarle el encuadre al
 * usuario detrás de sus espaldas.
 */
export function clampCropArea(
  area: CropArea,
  naturalWidth: number,
  naturalHeight: number,
): CropArea {
  const maxWidth = Math.max(1, Math.floor(naturalWidth))
  const maxHeight = Math.max(1, Math.floor(naturalHeight))
  const limit = Math.min(maxWidth, maxHeight)

  const width = clamp(Math.round(area.width), 1, limit)
  const height = clamp(Math.round(area.height), 1, limit)
  const x = clamp(Math.round(area.x), 0, Math.max(0, maxWidth - width))
  const y = clamp(Math.round(area.y), 0, Math.max(0, maxHeight - height))

  return { x, y, width, height }
}

/**
 * Reexpresa el área en otra resolución. Se usa cuando el bitmap decodificado y
 * el `<img>` que se mostró en el editor no coinciden de tamaño (EXIF aplicado
 * por el navegador sólo a uno de los dos): sin esto el recorte saldría corrido.
 */
export function scaleArea(
  area: CropArea,
  from: CropSize,
  to: CropSize,
): CropArea {
  const ratioX = to.width / from.width
  const ratioY = to.height / from.height
  if (!Number.isFinite(ratioX) || !Number.isFinite(ratioY)) return area
  if (ratioX === 1 && ratioY === 1) return area
  return {
    x: area.x * ratioX,
    y: area.y * ratioY,
    width: area.width * ratioX,
    height: area.height * ratioY,
  }
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}
