"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, Users } from "lucide-react"
import { updateGatheringParticipants } from "@/actions/gatherings"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

export function ParticipantsManager({
  gatheringId,
  creatorId,
  members,
  friends,
}: {
  gatheringId: string
  creatorId: string
  members: UserSummary[]
  friends: UserSummary[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(members.map((member) => member.id)),
  )
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggle(userId: string) {
    setSelected((current) => {
      const next = new Set(current)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const creator = members.find((member) => member.id === creatorId)
  const available = friends.filter((friend) => friend.id !== creatorId)
  const ordered = [
    ...(creator ? [creator] : []),
    ...members.filter((member) => member.id !== creatorId),
  ]

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateGatheringParticipants({
        gatheringId,
        participantIds: [...selected],
      })
      if (result.ok) {
        toast({ title: "Participantes actualizados", description: result.message })
        setOpen(false)
        router.refresh()
      } else {
        setError(result.message)
      }
    })
  }

  function renderRow(
    user: UserSummary,
    locked: boolean,
    isMember: boolean,
  ) {
    return (
      <li key={user.id}>
        <label
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
            isMember && !locked
              ? "border-primary bg-primary/5"
              : "border-input",
            !locked && "cursor-pointer hover:bg-muted",
          )}
        >
          <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
          <span className="min-w-0 flex-1 truncate font-medium text-foreground">
            {user.name}
            {user.id === creatorId ? " · organiza" : ""}
          </span>
          {locked ? (
            <Lock className="size-4 text-muted-foreground" aria-label="No se puede quitar" />
          ) : (
            <Checkbox
              checked={isMember}
              onCheckedChange={() => toggle(user.id)}
              aria-label={`Incluir a ${user.name}`}
            />
          )}
        </label>
      </li>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button size="icon-sm" variant="outline" aria-label="Editar participantes" />
        }
      >
        <Users className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md"
      >
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Participantes</SheetTitle>
          <SheetDescription>
            Solo podés agregar a tus amigos. El organizador no se puede quitar.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-5 p-5 pt-2">
          <div className="space-y-1.5">
            <Label>Miembros actuales</Label>
            <ul className="flex flex-col gap-1">
              {ordered.map((member) =>
                renderRow(member, member.id === creatorId, true),
              )}
            </ul>
          </div>

          <div className="space-y-1.5">
            <Label>Sumar amigos</Label>
            {available.length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                No tenés más amigos para sumar.
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {available
                  .filter((friend) => !selected.has(friend.id))
                  .map((friend) =>
                    renderRow(friend, false, false),
                  )}
              </ul>
            )}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Users className="size-4" />
            )}
            Guardar cambios
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}