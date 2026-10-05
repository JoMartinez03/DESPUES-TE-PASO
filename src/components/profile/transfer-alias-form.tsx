"use client"

import { useState, useTransition } from "react"
import { updateTransferAlias } from "@/actions/profile"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MAX_TRANSFER_ALIAS_LENGTH } from "@/lib/validations/profile"

/**
 * El alias es opcional y se edita sobre sí mismo: si el campo queda vacío se
 * guarda `null`. Nunca se manda un `userId`: la action lo toma de la sesión.
 */
export function TransferAliasForm({ alias }: { alias: string | null }) {
  const [value, setValue] = useState(alias ?? "")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const unchanged = value.trim() === (alias ?? "")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateTransferAlias({ transferAlias: value })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setValue(value.trim())
      toast({
        title: value.trim() ? "Alias actualizado" : "Alias eliminado",
      })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-2">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="tino.mp"
          aria-label="Alias para transferencias"
          aria-invalid={Boolean(error)}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={MAX_TRANSFER_ALIAS_LENGTH}
          className="font-mono"
        />
        <Button type="submit" disabled={isPending || unchanged}>
          Guardar
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </form>
  )
}