"use client"

import { useState, useTransition } from "react"
import { BellRing, CheckCheck, Loader2 } from "lucide-react"
import { sendDebtReminder } from "@/actions/reminders"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

/**
 * Solo se renderiza cuando el amigo le debe al usuario autenticado (lo decide
 * el server component de la página). El cooldown se valida en servidor: acá
 * solo se refleja el resultado y se evita el doble click mientras pendiente.
 */
export function RemindDebtButton({
  friendId,
  friendName,
}: {
  friendId: string
  friendName: string
}) {
  const [isPending, startTransition] = useTransition()
  const [sent, setSent] = useState(false)

  const name = friendName.split(" ")[0] ?? friendName

  function handleRemind() {
    startTransition(async () => {
      try {
        const result = await sendDebtReminder({ userId: friendId })
        toast({ description: result.message })
        // Solo el éxito local deshabilita el botón; cooldown y "sin deuda"
        // dejan el botón activo para reintentar cuando corresponda.
        if (result.ok) setSent(true)
      } catch {
        toast({ description: "No pudimos enviar el recordatorio. Intentá de nuevo." })
      }
    })
  }

  if (sent) {
    return (
      <Button variant="outline" disabled className="gap-1.5">
        <CheckCheck className="size-4" />
        Recordatorio enviado
      </Button>
    )
  }

  return (
    <Button variant="outline" className="gap-1.5" disabled={isPending} onClick={handleRemind}>
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <BellRing className="size-4" />
      )}
      Recordarle a {name}
    </Button>
  )
}
