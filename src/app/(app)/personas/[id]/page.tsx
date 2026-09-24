import { notFound } from "next/navigation"
import { CheckCheck, CircleDollarSign, Receipt, Send } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Prisma } from "@/generated/prisma"
import { auth } from "@/lib/auth"
import { formatDate, formatMoney } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { getFriendshipBetween } from "@/queries/friendships"

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireUser()
  const session = await auth()
  const user = session!.user
  const { id } = await params

  if (id === user.id) notFound()

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
    getFriendshipBetween(user.id, id),
  ])

  if (!target || !friendship) notFound()

  const placeholderBalance = {
    amount: new Prisma.Decimal(0),
    currency: "ARS",
  } as const

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
            <p className="text-xs text-muted-foreground">
              Amigos desde {formatDate(friendship.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-primary/5">
        <CardContent className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-xl font-semibold tracking-tight tabular-nums">
              {formatMoney(placeholderBalance.amount, placeholderBalance.currency)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCheck className="size-4 text-emerald-600" />
            <span className="text-sm font-medium text-foreground">Están al día</span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled className="gap-1.5" title="Próximamente">
              <Send className="size-4" />
              Agregar gasto
            </Button>
            <Button variant="outline" disabled className="gap-1.5" title="Próximamente">
              <CircleDollarSign className="size-4" />
              Registrar pago
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Gastos y pagos: próximamente.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent>
          <EmptyState
            icon={Receipt}
            title={`Todavía no hay movimientos con ${target.name.split(" ")[0] ?? target.name}`}
            description="Las deudas y pagos compartidos van a aparecer acá."
          />
        </CardContent>
      </Card>
    </div>
  )
}