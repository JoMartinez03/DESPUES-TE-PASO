import Link from "next/link"
import { ChevronRight, UserPlus } from "lucide-react"
import { AddFriendSheet } from "@/components/auth/add-friend-sheet"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { UserAvatar } from "@/components/shared/user-avatar"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export default async function PersonasPage() {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: user.id }, { addresseeId: user.id }],
    },
    include: {
      requester: {
        select: { id: true, name: true, username: true, avatar: true },
      },
      addressee: {
        select: { id: true, name: true, username: true, avatar: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  const friends = friendships.map((friendship) =>
    friendship.requester.id === user.id
      ? friendship.addressee
      : friendship.requester,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personas"
        description="Tus amigos y las cuentas que tienen con vos."
        action={<AddFriendSheet />}
      />

      {friends.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="Todavía no agregaste amigos"
          description="Buscá a tus amigos por nombre o username para empezar a manejar las cuentas juntos."
          action={<AddFriendSheet />}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {friends.map((friend) => (
            <Link
              key={friend.id}
              href={`/personas/${friend.id}`}
              className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/40"
            >
              <UserAvatar name={friend.name} avatar={friend.avatar} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {friend.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  @{friend.username}
                </p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}