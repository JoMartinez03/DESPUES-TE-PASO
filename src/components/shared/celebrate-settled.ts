import { celebrateSettled } from "@/components/ui/toast"
import type { SettledPair } from "@/actions/transactions"

/**
 * Único punto donde se decide celebrar "¡Están a mano!".
 *
 * El servidor ya determinó el hecho económico y lo expone en `settled`
 * (calculado dentro de la transacción con la misma fuente de verdad que el
 * resto de la app). Acá NO se compara ningún balance: sólo se reacciona al
 * flag, y únicamente cuando la acción fue OK.
 */
export function celebrateSettledFromResult(result: {
  ok: boolean
  settled?: SettledPair
}) {
  if (result.ok && result.settled) {
    celebrateSettled({ peerName: result.settled.peerName })
  }
}
