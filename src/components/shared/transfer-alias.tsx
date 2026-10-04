"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const FEEDBACK_MS = 2000

/**
 * Alias de transferencia de otra persona. Es texto secundario: el nombre
 * siempre manda. Con `copyable` aparece el botón de copiar, que nunca deja
 * propagar el click porque vive dentro de filas que navegan a `/personas/[id]`.
 */
export function TransferAlias({
  alias,
  copyable = false,
  className,
}: {
  alias: string | null | undefined
  copyable?: boolean
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  const value = alias
  if (!value) return null

  // const (y no `function`) para que TypeScript conserve el narrowing de `value`.
  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Sin esto el click sigue al <a> de la fila y abre /personas/[id].
    event.preventDefault()
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(value)
      clearTimeout(timeout.current)
      setCopied(true)
      timeout.current = setTimeout(() => setCopied(false), FEEDBACK_MS)
      toast({ description: "Alias copiado" })
    } catch {
      toast({
        title: "No se pudo copiar",
        description: "Copiá el alias manualmente.",
      })
    }
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-0.5", className)}>
      <span className="truncate text-xs text-muted-foreground">{value}</span>
      {copyable ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          // El pseudo-elemento agranda el área táctil sin engordar la fila.
          className="relative -my-1 shrink-0 before:absolute before:-inset-2 before:content-['']"
          onClick={handleCopy}
          aria-label={`Copiar alias ${value}`}
        >
          {copied ? <Check className="text-emerald-600" /> : <Copy />}
        </Button>
      ) : null}
    </div>
  )
}