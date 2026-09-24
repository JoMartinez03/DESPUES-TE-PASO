import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import type { OutgoingRequest } from "@/queries/friendships"

export function OutgoingRequests({ requests }: { requests: OutgoingRequest[] }) {
  if (requests.length === 0) return null

  return (
    <section className="space-y-3" aria-label="Solicitudes enviadas">
      <h2 className="font-heading text-sm font-semibold text-foreground">
        Solicitudes enviadas
      </h2>
      <ul className="flex flex-col gap-2">
        {requests.map((request) => (
          <li
            key={request.friendshipId}
            className="flex items-center gap-3 rounded-xl border bg-card p-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Clock className="size-4" />
            </span>
            <UserAvatar name={request.to.name} avatar={request.to.avatar} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{request.to.name}</p>
              <p className="truncate text-xs text-muted-foreground">@{request.to.username}</p>
            </div>
            <Badge variant="secondary">Pendiente</Badge>
          </li>
        ))}
      </ul>
    </section>
  )
}