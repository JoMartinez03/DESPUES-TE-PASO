"use client"

import { useState, useTransition } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { deleteDebt } from "@/actions/transactions"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"

export function DeleteDebtButton({
  transactionId,
  description,
  amountText,
}: {
  transactionId: string
  description: string
  amountText: string
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) setError(null)
    setOpen(nextOpen)
  }

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await deleteDebt({ transactionId })
      if (result.ok) {
        toast({ title: "Deuda eliminada", description: result.message })
        setOpen(false)
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
            variant="destructive"
            aria-label={`Eliminar deuda de ${amountText}`}
            className="size-10"
          />
        }
      >
        <Trash2 className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md"
      >
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Eliminar deuda</SheetTitle>
          <SheetDescription>
            ¿Seguro que querés eliminar esta deuda de {amountText}? Esta acción
            no se puede deshacer.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 p-5 pt-2">
          <p className="rounded-xl border bg-background p-3">
            <span className="block truncate text-sm font-medium text-foreground">
              {description}
            </span>
            <span className="text-xs text-muted-foreground">{amountText}</span>
          </p>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Eliminar deuda
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
