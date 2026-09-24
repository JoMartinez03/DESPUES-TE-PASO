"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Pencil, X, Check } from "lucide-react"
import { updateNickname } from "@/actions/profile"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"

export function NicknameForm({ name }: { name: string }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateNickname({ name: value })
      if (result.ok) {
        setEditing(false)
        setValue(value.trim())
        router.refresh()
        toast({ title: "Apodo actualizado" })
      } else {
        setError(result.error)
      }
    })
  }

  function cancel() {
    setEditing(false)
    setValue(name)
    setError(null)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {editing ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            maxLength={40}
            aria-label="Nuevo apodo"
            className="h-8 w-40 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
          <Button
            type="submit"
            size="icon-sm"
            variant="default"
            disabled={isPending}
            aria-label="Guardar apodo"
          >
            <Check />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={cancel}
            disabled={isPending}
            aria-label="Cancelar edición"
          >
            <X />
          </Button>
          {error ? (
            <span className="basis-full text-xs text-destructive">{error}</span>
          ) : null}
        </form>
      ) : (
        <>
          <span className="font-heading text-xl font-semibold text-foreground">
            {name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setValue(name)
              setError(null)
              setEditing(true)
            }}
            aria-label="Editar apodo"
          >
            <Pencil />
          </Button>
        </>
      )}
    </div>
  )
}