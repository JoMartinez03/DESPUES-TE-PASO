"use client"

import { useState, useTransition } from "react"
import { Loader2, Plus } from "lucide-react"
import { createDebt } from "@/actions/transactions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { hapticSuccess } from "@/lib/haptics"
import { sanitizeMoneyInput } from "@/lib/money-input"
import { createDebtSchema } from "@/lib/validations/transactions"
import { cn } from "@/lib/utils"

type Payer = "me" | "friend"

export function AddDebtSheet({
  friendId,
  friendName,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  showTrigger = true,
}: {
  friendId: string
  friendName: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  showTrigger?: boolean
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState<Payer>("me")
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
    // Misma validación que el servidor (misma schema): normaliza la coma
    // decimal y rechaza montos inválidos sin viaje.
    const parsed = createDebtSchema.safeParse({ description, amount, paidBy })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos")
      return
    }
    startTransition(async () => {
      const result = await createDebt({
        userId: friendId,
        description: parsed.data.description,
        amount: parsed.data.amount,
        paidBy: parsed.data.paidBy,
      })
      if (result.ok) {
        hapticSuccess()
        toast({ title: "Deuda registrada", description: result.message })
        handleOpenChange(false)
        setDescription("")
        setAmount("")
        onSuccess?.()
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      {showTrigger ? (
        <SheetTrigger render={<Button className="gap-1.5" variant="outline" />}>
          <Plus className="size-4" />
          Agregar deuda
        </SheetTrigger>
      ) : null}
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Agregar deuda</SheetTitle>
          <SheetDescription>
            Registrá un gasto con {firstName}.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-4 px-5 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="debt-description">Concepto</Label>
              <Input
                id="debt-description"
                placeholder="ej: hamburguesas"
                maxLength={120}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="debt-amount">Monto</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="debt-amount"
                  inputMode="decimal"
                  placeholder="0"
                  className="pl-7 tabular-nums"
                  value={amount}
                  onChange={(event) =>
                    setAmount(sanitizeMoneyInput(event.target.value))
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>¿Quién pagó?</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaidBy("me")}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    paidBy === "me"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-input text-muted-foreground hover:bg-muted",
                  )}
                >
                  Yo
                </button>
                <button
                  type="button"
                  onClick={() => setPaidBy("friend")}
                  className={cn(
                    "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    paidBy === "friend"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-input text-muted-foreground hover:bg-muted",
                  )}
                >
                  {firstName}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Guardar deuda
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}