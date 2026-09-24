import { UserPlus } from "lucide-react"
import { AddFriendSheet } from "@/components/friends/add-friend-sheet"
import { FriendCard } from "@/components/friends/friend-card"
import { IncomingRequests } from "@/components/friends/incoming-requests"
import { OutgoingRequests } from "@/components/friends/outgoing-requests"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { auth } from "@/lib/auth"
import { requireUser } from "@/lib/session"
import {
  getFriends,
  getIncomingRequests,
  getOutgoingRequests,
} from "@/queries/friendships"

export default async function PersonasPage() {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const [friends, incomingRequests, outgoingRequests] = await Promise.all([
    getFriends(user.id),
    getIncomingRequests(user.id),
    getOutgoingRequests(user.id),
  ])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personas"
        description="Tus amigos y las cuentas que tienen con vos."
        action={<AddFriendSheet />}
      />

      <IncomingRequests requests={incomingRequests} />
      <OutgoingRequests requests={outgoingRequests} />

      {friends.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="Todavía no agregaste amigos"
          description="Buscá a tus amigos por nombre o username para empezar a manejar las cuentas juntos."
          action={<AddFriendSheet />}
        />
      ) : (
        <section className="space-y-3" aria-label="Tus amigos">
          <h2 className="font-heading text-sm font-semibold text-foreground">
            Amigos
          </h2>
          <div className="flex flex-col gap-2">
            {friends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}