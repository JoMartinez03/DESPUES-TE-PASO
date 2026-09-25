"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CircleDollarSign, Loader2 } from "lucide-react"
import { registerPayment } from "@/actions/transactions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"

export function RegisterPaymentSheet({
  friendId,
  friendName,
  maxPayableText,
  initialAmount = "",
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  showTrigger = true,
}: {
  friendId: string
  friendName: string
  maxPayableText: string
  initialAmount?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  showTrigger?: boolean
}) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const [amount, setAmount] = useState(initialAmount)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const firstName = friendName.split(" ")[0] ?? friendName

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen === undefined) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await registerPayment({ userId: friendId, amount })
      if (result.ok) {
        toast({ title: "Pago registrado", description: result.message })
        handleOpenChange(false)
        setAmount("")
        onSuccess?.()
        router.refresh()
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <SheetTrigger
          render={<Button className="gap-1.5" variant="outline" />}
        >
          <CircleDollarSign className="size-4" />
          Registrar pago
        </SheetTrigger>
      ) : null}
      <SheetContent
        side="bottom"
        className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md"
      >
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Registrar pago</SheetTitle>
          <SheetDescription>
            {firstName} va a tener que confirmarlo.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="payment-amount">Monto</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="payment-amount"
                inputMode="decimal"
                placeholder="0"
                className="pl-7 tabular-nums"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Máximo que podés pagar hoy: {maxPayableText}
            </p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CircleDollarSign className="size-4" />
            )}
            Registrar pago
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}