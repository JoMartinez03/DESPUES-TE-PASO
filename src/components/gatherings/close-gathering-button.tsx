"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LockKeyhole } from "lucide-react"
import { closeGathering } from "@/actions/gatherings"
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

export function CloseGatheringButton({ gatheringId }: { gatheringId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) setError(null)
  }

  function handleClose() {
    setError(null)
    startTransition(async () => {
      const result = await closeGathering({ gatheringId })
      if (result.ok) {
        toast({ title: "Juntada cerrada", description: result.message })
        setOpen(false)
        router.refresh()
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button variant="destructive" size="sm" className="gap-1.5" />
        }
      >
        <LockKeyhole className="size-4" />
        Cerrar juntada
      </SheetTrigger>
      <SheetContent side="bottom" className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md">
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Cerrar juntada</SheetTitle>
          <SheetDescription>
            Al cerrar la juntada, las deudas generadas por estos gastos se
            considerarán saldadas y dejarán de aparecer en los balances.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 p-5 pt-2">
          <p className="text-sm text-muted-foreground">
            Los gastos y el historial de la juntada se conservarán. Se notificará
            a los demás participantes.
          </p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleClose}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
              Cerrar juntada
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
