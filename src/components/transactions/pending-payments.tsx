"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownLeft, Clock, Loader2 } from "lucide-react"
import { confirmPayment, rejectPayment } from "@/actions/transactions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { formatMoney } from "@/lib/format"
import type { PendingPayment } from "@/queries/transactions"

export function PendingPaymentsList({
  friendName,
  items,
}: {
  friendName: string
  items: PendingPayment[]
}) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  const firstName = friendName.split(" ")[0] ?? friendName

  async function handleResult(
    action: "confirm" | "reject",
    item: PendingPayment,
  ) {
    if (busyId) return
    setBusyId(item.id)
    try {
      const result =
        action === "confirm"
          ? await confirmPayment({ transactionId: item.id })
          : await rejectPayment({ transactionId: item.id })
      toast({
        title: action === "confirm" ? "Pago confirmado" : "Pago rechazado",
        description: result.message,
      })
      router.refresh()
    } catch {
      toast({ description: "No pudimos procesar el pago. Intentá de nuevo." })
    } finally {
      setBusyId(null)
    }
  }

  if (items.length === 0) return null

  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-2">
        <p className="font-heading text-sm font-semibold text-foreground">
          Pagos pendientes
        </p>
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const incoming = item.direction === "incoming"
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border bg-background p-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  {incoming ? (
                    <ArrowDownLeft className="size-4" />
                  ) : (
                    <Clock className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {incoming
                      ? `${firstName} dice que te pagó`
                      : `Le pagaste a ${firstName}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {incoming ? "Esperando tu confirmación" : "Esperando confirmación"}
                    {" · "}
                    {formatMoney(item.amount, item.currency)}
                  </p>
                </div>
                {incoming ? (
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      disabled={busyId === item.id}
                      onClick={() => handleResult("confirm", item)}
                    >
                      {busyId === item.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        "Confirmar"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === item.id}
                      onClick={() => handleResult("reject", item)}
                    >
                      Rechazar
                    </Button>
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}