"use client"

import { useState, useTransition } from "react"
import { Loader2, UserPlus } from "lucide-react"
import { acceptFriendRequest, rejectFriendRequest } from "@/actions/friendships"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import type { IncomingRequest } from "@/queries/friendships"

export function IncomingRequests({ requests }: { requests: IncomingRequest[] }) {
  const [items, setItems] = useState(requests)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function resolve(requestId: string, action: "accept" | "reject") {
    if (pendingId) return
    setPendingId(requestId)
    startTransition(async () => {
      try {
        const result =
          action === "accept"
            ? await acceptFriendRequest({ friendshipId: requestId })
            : await rejectFriendRequest({ friendshipId: requestId })

        if (result.ok) {
          const request = items.find((item) => item.friendshipId === requestId)
          if (action === "accept") {
            toast({
              title: "¡Listo!",
              description: request
                ? `Ahora vos y ${request.from.name.split(" ")[0] ?? request.from.name} son amigos 🎉`
                : "Ahora son amigos 🎉",
            })
          } else {
            toast({ description: "Solicitud rechazada" })
          }
          setItems((prev) => prev.filter((item) => item.friendshipId !== requestId))
        } else {
          toast({ description: result.message })
          setItems((prev) => prev.filter((item) => item.friendshipId !== requestId))
        }
      } catch {
        toast({ description: "Algo salió mal. Intentá de nuevo." })
      } finally {
        setPendingId(null)
      }
    })
  }

  if (items.length === 0) return null

  return (
    <section className="space-y-3" aria-label="Solicitudes de amistad">
      <h2 className="font-heading text-sm font-semibold text-foreground">Solicitudes</h2>
      <ul className="flex flex-col gap-2">
        {items.map((request) => (
          <li
            key={request.friendshipId}
            className="flex items-center gap-3 rounded-xl border bg-card p-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserPlus className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{request.from.name}</p>
              <p className="truncate text-xs text-muted-foreground">@{request.from.username}</p>
              <p className="truncate text-xs text-muted-foreground">
                Quiere agregarte como amigo
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button
                size="sm"
                variant="default"
                onClick={() => resolve(request.friendshipId, "accept")}
                disabled={pendingId !== null}
              >
                {pendingId === request.friendshipId ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  "Aceptar"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => resolve(request.friendshipId, "reject")}
                disabled={pendingId !== null}
              >
                Rechazar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}