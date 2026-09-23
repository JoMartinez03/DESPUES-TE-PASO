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

export default async function JuntadaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireUser()
  const session = await auth()
  const user = session!.user
  const { id } = await params

  const gathering = await prisma.gathering.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, name: true, username: true, avatar: true },
      },
      expenses: { select: { id: true }, take: 1 },
    },
  })

  if (!gathering || gathering.creatorId !== user.id) notFound()

  return (
    <div className="space-y-6">
      <PageHeader backHref="/juntadas" title={gathering.name} />

      <Card className="rounded-2xl">
        <CardContent className="flex items-center gap-4">
          <UserAvatar
            name={gathering.creator.name}
            avatar={gathering.creator.avatar}
            size="lg"
          />
          <div className="min-w-0 space-y-0.5">
            <p className="font-heading text-lg font-semibold text-foreground">
              {gathering.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(gathering.date)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Organizada por {gathering.creator.name}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent>
          <EmptyState
            icon={Receipt}
            title="Todavía no cargaron gastos"
            description="Los gastos compartidos de la juntada van a aparecer acá."
          />
        </CardContent>
      </Card>
    </div>
  )
}