"use client"

import { useState, useTransition } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { deleteDebt } from "@/actions/transactions"
import { celebrateSettledFromResult } from "@/components/shared/celebrate-settled"
import { Button } from "@/components/ui/button"
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
            variant="destructive"
            aria-label={`Eliminar deuda de ${amountText}`}
            className="size-10"
          />
        }
      >
        <Trash2 className="size-4" />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Eliminar deuda</SheetTitle>
          <SheetDescription>
            ¿Seguro que querés eliminar esta deuda de {amountText}? Esta acción
            no se puede deshacer.
          </SheetDescription>
        </SheetHeader>
        <div className="px-5 pt-2">
          <p className="rounded-xl border bg-background p-3">
            <span className="block truncate text-sm font-medium text-foreground">
              {description}
            </span>
            <span className="text-xs text-muted-foreground">{amountText}</span>
          </p>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <SheetFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
