"use client"

import { useState, useTransition } from "react"
import { Loader2, Pencil } from "lucide-react"
import { updateDebt } from "@/actions/transactions"
import { celebrateSettledFromResult } from "@/components/shared/celebrate-settled"
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
import { sanitizeMoneyInput } from "@/lib/money-input"
import { editDebtSchema } from "@/lib/validations/transactions"

export function EditDebtSheet({
  transactionId,
  initialDescription,
  initialAmount,
}: {
  transactionId: string
  initialDescription: string
  initialAmount: string
}) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState(initialDescription)
  const [amount, setAmount] = useState(initialAmount)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      // Al abrir, precarga con los valores vigentes (pueden haber cambiado
      // por una revalidación después de la última edición).
      setDescription(initialDescription)
      setAmount(initialAmount)
      setError(null)
    }
    setOpen(nextOpen)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    // Misma validación que el servidor (misma schema): normaliza la coma
    // decimal y rechaza montos inválidos sin viaje.
    const parsed = editDebtSchema.safeParse({ transactionId, description, amount })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Datos inválidos")
      return
    }
    startTransition(async () => {
      const result = await updateDebt({
        transactionId,
        description: parsed.data.description,
        amount: parsed.data.amount,
      })
      if (result.ok) {
        toast({ title: "Deuda actualizada", description: result.message })
        setOpen(false)
        celebrateSettledFromResult(result)
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button
            type="button"
            size="icon-lg"
            variant="ghost"
            aria-label="Editar deuda"
            className="size-10 text-muted-foreground hover:text-foreground"
          />
        }
      >
        <Pencil className="size-4" />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Editar deuda</SheetTitle>
          <SheetDescription>
            Corregí el concepto o el monto de la deuda.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-4 px-5 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit-debt-description">Concepto</Label>
              <Input
                id="edit-debt-description"
                placeholder="ej: hamburguesas"
                maxLength={120}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-debt-amount">Monto</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="edit-debt-amount"
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

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <SheetFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Pencil className="size-4" />
              )}
              Guardar cambios
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
