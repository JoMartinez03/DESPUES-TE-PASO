/**
 * Feedback háptico como progressive enhancement.
 *
 * La Vibration API no está disponible en todos los navegadores (Safari/iOS,
 * entre otros) ni existe durante SSR. Estas funciones nunca lanzan y nunca
 * bloquean la acción: si no hay soporte, simplemente no hacen nada.
 *
 * El navegador puede ignorar la vibración (modo silencio, ahorro de energía o
 * falta de hardware), por eso el valor de retorno sólo indica si la llamada
 * fue aceptada, no si el dispositivo efectivamente vibró.
 */

/** Pulso único para confirmaciones importantes. */
export const HAPTIC_SUCCESS_MS = 25

/** Pulso único, apenas más largo, para la celebración "¡Están a mano!". */
export const HAPTIC_CELEBRATION_MS = 30

function vibrate(pattern: number | number[]): boolean {
  if (typeof navigator === "undefined") return false
  try {
    // Algunos navegadores exponen `navigator` sin `vibrate` (o con un valor
    // que no es función). Comprobamos antes de invocar.
    if (typeof navigator.vibrate !== "function") return false
    return navigator.vibrate(pattern)
  } catch {
    // Un navegador puede bloquear la API por políticas del usuario o del
    // sistema. El flujo de negocio no debe enterarse.
    return false
  }
}

/** Éxito de una acción de alta intención (pago, deuda, confirmación). */
export function hapticSuccess(): boolean {
  return vibrate(HAPTIC_SUCCESS_MS)
}

/** Celebración cuando dos personas quedan a mano. */
export function hapticCelebrate(): boolean {
  return vibrate(HAPTIC_CELEBRATION_MS)
}
