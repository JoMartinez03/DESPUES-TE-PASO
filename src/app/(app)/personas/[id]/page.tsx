import { notFound } from "next/navigation"
import { CheckCheck, TrendingDown, TrendingUp } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { TransferAlias } from "@/components/shared/transfer-alias"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { AddDebtSheet } from "@/components/transactions/add-debt-sheet"
import { PendingPaymentsList } from "@/components/transactions/pending-payments"
import { RegisterPaymentSheet } from "@/components/transactions/register-payment-sheet"
import { RemindDebtButton } from "@/components/transactions/remind-debt-button"
import { TransactionHistory } from "@/components/transactions/transaction-history"
import { auth } from "@/lib/auth"
import { formatDate, formatMoney } from "@/lib/format"
import { maxPayableFrom, sumPendingOutgoing } from "@/lib/transactions"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { getFriendshipBetween } from "@/queries/friendships"
import { getPairLedger } from "@/queries/transactions"

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

  // Una sola lectura de cada cosa: `maxPayable` se DERIVA del balance y de los
  // pagos pendientes que ya trajo el ledger del par, en vez de volver a
  // consultar las mismas transacciones. `maxPayableFrom` es la misma regla de
  // siempre. El balance sale de TODAS las filas confirmadas (sin truncar),
  // aunque el historial mostrado siga siendo la ventana más reciente.
  const [target, friendship, ledger] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        transferAlias: true,
        createdAt: true,
      },
    }),
    getFriendshipBetween(user.id, id),
    getPairLedger(user.id, id),
  ])

  if (!target || !friendship) notFound()

  const { balance, pendingPayments, history } = ledger

  const maxPayable = maxPayableFrom(balance, sumPendingOutgoing(pendingPayments))

  const balanceNumber = Number(balance.toString())
  const owesYou = balanceNumber > 0
  const youOwe = balanceNumber < 0

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
            {/* El alias es opcional y no se muestra si el amigo no lo cargó. */}
            <TransferAlias alias={target.transferAlias} copyable />
            <p className="truncate text-sm text-muted-foreground">
              @{target.username}
            </p>
            <p className="text-xs text-muted-foreground">
              Amigos desde {formatDate(friendship.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "rounded-2xl",
          owesYou && "bg-emerald-500/5",
          youOwe && "bg-primary/5",
        )}
      >
        <CardContent className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-xl font-semibold tracking-tight tabular-nums">
              {owesYou
                ? `+${formatMoney(balance)}`
                : youOwe
                  ? `−${formatMoney(balance.abs())}`
                  : formatMoney(balance)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {owesYou ? (
              <TrendingUp className="size-4 text-emerald-600" />
            ) : youOwe ? (
              <TrendingDown className="size-4 text-primary" />
            ) : (
              <CheckCheck className="size-4 text-emerald-600" />
            )}
            <span className="text-sm font-medium text-foreground">
              {owesYou ? "Te debe" : youOwe ? "Le debés" : "Están al día"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className={cn("grid gap-2", (owesYou || youOwe) && "grid-cols-2")}>
        <AddDebtSheet friendId={id} friendName={target.name} />
        {youOwe ? (
          <RegisterPaymentSheet
            friendId={id}
            friendName={target.name}
            maxPayableText={formatMoney(maxPayable)}
          />
        ) : null}
        {/* Solo cuando el amigo le debe al usuario autenticado (balance > 0);
            el cooldown lo valida la server action. */}
        {owesYou ? (
          <RemindDebtButton friendId={id} friendName={target.name} />
        ) : null}
      </div>

      <PendingPaymentsList friendName={target.name} items={pendingPayments} />

      <TransactionHistory
        viewerId={user.id}
        friendName={target.name}
        movements={history}
      />
    </div>
  )
}