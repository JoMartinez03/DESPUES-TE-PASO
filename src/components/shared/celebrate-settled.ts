import { celebrateSettled } from "@/components/ui/toast"
import { hapticCelebrate } from "@/lib/haptics"
import type { SettledPair } from "@/actions/transactions"

/**
 * Único punto donde se decide celebrar "¡Están a mano!".
 *
 * El servidor ya determinó el hecho económico y lo expone en `settled`
 * (calculado dentro de la transacción con la misma fuente de verdad que el
 * resto de la app). Acá NO se compara ningún balance: sólo se reacciona al
 * flag, y únicamente cuando la acción fue OK.
 *
 * Devuelve `true` si celebró, para que el llamador no sume además el pulso
 * de éxito y el usuario sienta una sola vibración.
 */
export function celebrateSettledFromResult(result: {
  ok: boolean
  settled?: SettledPair
}): boolean {
  if (result.ok && result.settled) {
    hapticCelebrate()
    celebrateSettled({ peerName: result.settled.peerName })
    return true
  }
  return false
}
