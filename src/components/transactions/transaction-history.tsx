import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Receipt,
  XCircle,
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { Card, CardContent } from "@/components/ui/card"
import { formatMoney, formatShortDate } from "@/lib/format"
import type { Movement, MovementStatus } from "@/queries/transactions"

function movementView(
  movement: Movement,
  viewerId: string,
  friendName: string,
): { label: string; amount: string; incoming: boolean } {
  const text = formatMoney(movement.amount, movement.currency)
  const moneyToMe = movement.creditorId === viewerId

  if (movement.type === "DEBT" && movement.status === "CONFIRMED") {
    return moneyToMe
      ? { label: "Te debe", amount: text, incoming: true }
      : { label: "Debés", amount: text, incoming: false }
  }

  if (movement.type === "PAYMENT") {
    if (movement.status === "CONFIRMED") {
      return moneyToMe
        ? { label: "Te pagó", amount: text, incoming: true }
        : { label: "Le pagaste", amount: text, incoming: false }
    }
    if (movement.status === "PENDING") {
      return moneyToMe
        ? { label: "Por confirmar", amount: text, incoming: true }
        : {
            label: `Esperás confirmación de ${friendName}`,
            amount: text,
            incoming: false,
          }
    }
    return {
      label: "Pago rechazado",
      amount: text,
      incoming: moneyToMe,
    }
  }

  return { label: "Movimiento", amount: text, incoming: false }
}

function StatusIcon({ status }: { status: MovementStatus }) {
  if (status === "PENDING") return <Clock className="size-3" />
  if (status === "REJECTED") return <XCircle className="size-3" />
  return null
}

export function TransactionHistory({
  viewerId,
  friendName,
  movements,
}: {
  viewerId: string
  friendName: string
  movements: Movement[]
}) {
  const firstName = friendName.split(" ")[0] ?? friendName

  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-3">
        <p className="font-heading text-sm font-semibold text-foreground">
          Historial
        </p>
        {movements.length === 0 ? (
          <EmptyState
            variant="inline"
            icon={Receipt}
            title={`Todavía no hay movimientos con ${firstName}`}
            description="Las deudas y pagos compartidos van a aparecer acá."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {movements.map((movement) => {
              const view = movementView(movement, viewerId, firstName)
              const rejected = movement.status === "REJECTED"
              const pending = movement.status === "PENDING"

              return (
                <li
                  key={movement.id}
                  className="flex items-center gap-3 rounded-xl border bg-background p-3"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                      view.incoming
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {view.incoming ? (
                      <ArrowDownLeft className="size-4" />
                    ) : (
                      <ArrowUpRight className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {movement.description || "Pago"}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {view.label}
                      {movement.expense ? (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">
                            En {movement.expense.gathering.name}
                          </span>
                        </>
                      ) : null}
                      <span aria-hidden="true">·</span>
                      {formatShortDate(movement.createdAt)}
                      <StatusIcon status={movement.status} />
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-semibold tabular-nums ${
                      rejected
                        ? "text-muted-foreground line-through"
                        : pending
                          ? "text-muted-foreground"
                          : view.incoming
                            ? "text-emerald-600"
                            : "text-foreground"
                    }`}
                  >
                    {view.incoming ? "+" : "−"}
                    {view.amount}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}