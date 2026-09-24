"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Users } from "lucide-react"
import { createGathering } from "@/actions/gatherings"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAvatar } from "@/components/shared/user-avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import type { UserSummary } from "@/queries/friendships"

export function CreateGatheringSheet({
  friends,
  triggerVariant = "sm",
  openOnMount = false,
  hideTrigger = false,
}: {
  friends: UserSummary[]
  triggerVariant?: "sm" | "default"
  openOnMount?: boolean
  hideTrigger?: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(openOnMount)
  const [name, setName] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function reset() {
    setName("")
    setSelected(new Set())
    setError(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createGathering({
        name,
        participantIds: [...selected],
      })
      if (result.ok) {
        toast({ title: "Juntada creada", description: result.message })
        reset()
        setOpen(false)
        router.push(`/juntadas/${result.gatheringId}`)
        router.refresh()
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {hideTrigger ? null : (
        <SheetTrigger
          render={
            <Button size={triggerVariant} className="gap-1.5" />
          }
        >
          <Plus className="size-4" />
          Nueva juntada
        </SheetTrigger>
      )}
      <SheetContent
        side="bottom"
        className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md"
      >
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Nueva juntada</SheetTitle>
          <SheetDescription>
            Elegí un nombre y las personas que participan.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 p-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="gathering-name">Nombre</Label>
            <Input
              id="gathering-name"
              placeholder="ej: Juntada viernes"
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Participantes</Label>
            <p className="text-xs text-muted-foreground">
              Solo podés invitar a tus amigos. Tu cuenta se suma automáticamente.
            </p>
            {friends.length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                Todavía no tenés amigos para invitar. Agregalos desde Personas.
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {friends.map((friend) => {
                  const isChecked = selected.has(friend.id)
                  return (
                    <li key={friend.id}>
                      <label
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                          isChecked
                            ? "border-primary bg-primary/5"
                            : "border-input hover:bg-muted",
                        )}
                      >
                        <UserAvatar
                          name={friend.name}
                          avatar={friend.avatar}
                          size="sm"
                        />
                        <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                          {friend.name}
                        </span>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) selected.add(friend.id)
                            else selected.delete(friend.id)
                            setSelected(new Set(selected))
                          }}
                          aria-label={`Incluir a ${friend.name}`}
                        />
                      </label>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || selected.size === 0 || name.trim().length === 0}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Users className="size-4" />
            )}
            Crear juntada
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}