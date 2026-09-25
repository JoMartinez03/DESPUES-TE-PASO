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
          <Button variant="outline" size="sm" className="gap-1.5" />
        }
      >
        <LockKeyhole className="size-4" />
        Cerrar juntada
      </SheetTrigger>
      <SheetContent side="bottom" className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md">
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Cerrar juntada</SheetTitle>
          <SheetDescription>
            No se podrán agregar gastos ni cambiar participantes después de cerrarla.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 p-5 pt-2">
          <p className="text-sm text-muted-foreground">
            Se notificará a los demás participantes. Los pagos y balances no se modifican.
          </p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            disabled={isPending}
            onClick={handleClose}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
            Confirmar cierre
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
