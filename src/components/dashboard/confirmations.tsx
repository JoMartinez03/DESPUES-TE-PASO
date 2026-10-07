"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { confirmPayment, rejectPayment } from "@/actions/transactions"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/toast"
import { formatMoney } from "@/lib/format"
import type { ConfirmationItem } from "@/queries/dashboard"

export function Confirmations({ items }: { items: ConfirmationItem[] }) {
  const [busyId, setBusyId] = useState<string | null>(null)

  async function handleResult(
    action: "confirm" | "reject",
    item: ConfirmationItem,
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
          Confirmaciones
        </p>
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-xl border bg-background p-3"
            >
              <UserAvatar name={item.payer.name} avatar={item.payer.avatar} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.payer.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Te envió un pago de {formatMoney(item.amount, item.currency)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === item.id}
                  onClick={() => handleResult("reject", item)}
                >
                  {busyId === item.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Rechazar"
                  )}
                </Button>
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
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
