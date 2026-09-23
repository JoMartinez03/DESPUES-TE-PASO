import { notFound } from "next/navigation"
import { Receipt } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { formatDate } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireUser()
  const session = await auth()
  const user = session!.user
  const { id } = await params

  const [target, friendship] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    }),
    prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: user.id, addresseeId: id },
          { requesterId: id, addresseeId: user.id },
        ],
      },
      select: { id: true, createdAt: true },
    }),
  ])

  if (!target || (target.id !== user.id && !friendship)) notFound()

  const isSelf = target.id === user.id

  return (
    <div className="space-y-6">
      <PageHeader backHref="/personas" title={target.name} />

      <Card className="rounded-2xl">
        <CardContent className="flex items-center gap-4">
          <UserAvatar
            name={target.name}
            avatar={target.avatar}
            size="lg"
            className="[&_[data-slot=avatar-fallback]]:text-lg"
          />
          <div className="min-w-0 space-y-0.5">
            <p className="font-heading text-lg font-semibold text-foreground">
              {target.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              @{target.username}
            </p>
            {!isSelf && friendship ? (
              <p className="text-xs text-muted-foreground">
                Amigos desde {formatDate(friendship.createdAt)}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent>
          <EmptyState
            icon={Receipt}
            title={
              isSelf
                ? "Todavía no tenés movimientos"
                : `Todavía no hay movimientos con ${target.name.split(" ")[0] ?? target.name}`
            }
            description="Las deudas y pagos compartidos van a aparecer acá."
          />
        </CardContent>
      </Card>
    </div>
  )
}