import { UserAvatar } from "@/components/shared/user-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { RegisterPaymentSheet } from "@/components/transactions/register-payment-sheet"
import { formatMoney } from "@/lib/format"
import { centsToAmountString, parseMoneyToCents } from "@/lib/gatherings/money"
import { netPairDebtsFor, type PairDebtRow } from "@/lib/gatherings/pair-debts"

export type MyPaymentsParticipant = {
  id: string
  name: string
  avatar?: string | null
}

export type MyPaymentsCardProps = {
  /** DEBT de esta juntada agrupadas por par dirigido, sin netear. */
  pairDebts: readonly PairDebtRow[]
  viewerId: string
  /** Posición del viewer en la juntada, en centavos. Convention de `getGatheringEconomics`. */
  balanceCents: number
  isActive: boolean
  participants: readonly MyPaymentsParticipant[]
  /** Texto Decimal del máximo pagable por par, indexado `viewerId:creditorId`. */
  maxPayableByPair: ReadonlyMap<string, string>
}

function centsMoney(cents: number): string {
  return formatMoney(centsToAmountString(cents))
}

/**
 * Estado cuando el viewer no tiene nada que pagar en esta juntada. `balanceCents`
 * viene de la misma fuente que las filas, así que el panel nunca se contradice
 * con la lista que muestra.
 */
function emptyState(balanceCents: number): { title: string; description: string } {
  if (balanceCents === 0) {
    return {
      title: "Estás al día",
      description: "No tenés pagos pendientes en esta juntada.",
    }
  }
  if (balanceCents > 0) {
    return {
      title: "No tenés pagos que realizar",
      description: "Tenés dinero a favor en esta juntada.",
    }
  }
  return {
    title: "No tenés pagos que realizar",
    description: "No hay transferencias pendientes para vos en esta juntada.",
  }
}

/**
 * Panel personal de la juntada: solo las transferencias que el viewer debe hacer.
 *
 * Es un Server Component; compone el `RegisterPaymentSheet` que ya es client. El
 * neteo por par corre acá en el server, antes del render, así que nunca se
 * mandan al cliente transferencias de terceros.
 */
export function MyPaymentsCard({
  pairDebts,
  viewerId,
  balanceCents,
  isActive,
  participants,
  maxPayableByPair,
}: MyPaymentsCardProps) {
  if (!isActive) return null

  const myPayments = netPairDebtsFor(pairDebts, viewerId)
  const participantById = new Map(
    participants.map((participant) => [participant.id, participant]),
  )

  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-4">
        {myPayments.length === 0 ? (
          <div>
            <h2 className="font-heading text-sm font-semibold text-foreground">
              {emptyState(balanceCents).title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {emptyState(balanceCents).description}
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Tus pagos
              </h2>
              <p className="text-xs text-muted-foreground">
                Transferencias que tenés que realizar para saldar la juntada.
              </p>
            </div>
            <ul className="flex flex-col gap-2">
              {myPayments.map((payment) => {
                const creditor = participantById.get(payment.creditorId)
                if (!creditor) return null
                const maxPayable = maxPayableByPair.get(
                  `${viewerId}:${payment.creditorId}`,
                )
                const maxPayableCents = maxPayable
                  ? parseMoneyToCents(maxPayable)
                  : 0
                // El server sigue siendo la fuente de verdad: si el máximo global
                // es menor que la fila, precargamos lo que realmente se puede pagar.
                const prefillCents = Math.min(
                  payment.amountCents,
                  maxPayableCents,
                )
                return (
                  <li
                    key={payment.creditorId}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-input/70 px-3 py-2.5"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                      <UserAvatar
                        name={creditor.name}
                        avatar={creditor.avatar}
                        size="sm"
                      />
                      <span className="truncate font-medium text-foreground">
                        {creditor.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {centsMoney(payment.amountCents)}
                      </span>
                      {maxPayable && maxPayableCents > 0 ? (
                        <RegisterPaymentSheet
                          key={`payment-${payment.creditorId}-${prefillCents}`}
                          friendId={creditor.id}
                          friendName={creditor.name}
                          maxPayableText={formatMoney(maxPayable)}
                          initialAmount={centsToAmountString(prefillCents)}
                        />
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  )
}
