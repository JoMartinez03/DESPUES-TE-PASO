import { notFound } from "next/navigation"
import { AlertTriangle, ArrowRight, Receipt, Scale, Wallet } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { AddExpenseSheet } from "@/components/gatherings/add-expense-sheet"
import { CloseGatheringButton } from "@/components/gatherings/close-gathering-button"
import { ExpenseItem } from "@/components/gatherings/expense-item"
import { ParticipantsManager } from "@/components/gatherings/participants-manager"
import { RegisterPaymentSheet } from "@/components/transactions/register-payment-sheet"
import { requireUser } from "@/lib/session"
import { formatDate, formatMoney, formatSignedMoney } from "@/lib/format"
import { centsToAmountString } from "@/lib/gatherings/money"
import { toExpenseItemDto } from "@/lib/gatherings/serializable"
import {
  getGatheringBalanceForUser,
  getGatheringEconomics,
  getGatheringTotal,
  getGatheringView,
} from "@/queries/gatherings"
import { getFriendSummaries } from "@/queries/friendships"
import { maxPayableBetween } from "@/queries/transactions"

function centsMoney(cents: number): string {
  return formatMoney(centsToAmountString(cents))
}

export default async function JuntadaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params

  const gathering = await getGatheringView(id, user.id)
  if (!gathering) notFound()

  const isCreator = gathering.creatorId === user.id
  const isActive = gathering.status === "ACTIVE"
  const [total, balance, economics, friends] = await Promise.all([
    getGatheringTotal(gathering.id),
    getGatheringBalanceForUser(gathering.id, user.id),
    getGatheringEconomics(gathering.id),
    isCreator && isActive ? getFriendSummaries(user.id) : Promise.resolve([]),
  ])

  const participantById = new Map(
    gathering.participants.map((participant) => [participant.id, participant]),
  )
  const paymentMaxByTransfer = new Map<string, string>()
  if (economics.ok) {
    const outgoing = economics.transfers.filter(
      (transfer) => transfer.fromUserId === user.id,
    )
    const values = await Promise.all(
      outgoing.map(async (transfer) => {
        const max = await maxPayableBetween(
          transfer.fromUserId,
          transfer.toUserId,
        )
        return {
          key: `${transfer.fromUserId}:${transfer.toUserId}`,
          value: max.toString(),
        }
      }),
    )
    for (const value of values) paymentMaxByTransfer.set(value.key, value.value)
  }

  const signed = formatSignedMoney(balance)
  const balanceTone =
    balance.greaterThan(0) ? "positive" : balance.lessThan(0) ? "negative" : "neutral"
  const gatheringForm = {
    id: gathering.id,
    name: gathering.name,
    participants: gathering.participants.map((participant) => ({
      id: participant.id,
      name: participant.name,
      username: participant.username,
      avatar: participant.avatar,
    })),
  }

  return (
    <div className="space-y-6">
      <PageHeader
        backHref="/juntadas"
        title={gathering.name}
        description={`Organizada por ${gathering.creator.name} · ${formatDate(gathering.date)}`}
        action={
          isCreator && isActive ? (
            <CloseGatheringButton gatheringId={gathering.id} />
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Total gastado"
          amount={formatMoney(total)}
          icon={Wallet}
        />
        <StatCard
          label="Tu balance"
          amount={`${signed.symbol} ${signed.text}`}
          icon={Scale}
          tone={balanceTone}
        />
      </div>

      <Card className="rounded-2xl">
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Balance de la juntada
              </h2>
              <p className="text-xs text-muted-foreground">
                Solo deudas confirmadas de los gastos de esta juntada.
              </p>
            </div>
            <span
              className={
                isActive
                  ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                  : "rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground"
              }
            >
              {isActive ? "Activa" : "Cerrada"}
            </span>
          </div>

          {economics.ok ? (
            <ul className="flex flex-col gap-2">
              {economics.balances.map((balanceRow) => {
                const participant = participantById.get(balanceRow.userId)
                if (!participant) return null
                const isSettled = balanceRow.balanceCents === 0
                const isReceiving = balanceRow.balanceCents > 0
                return (
                  <li
                    key={balanceRow.userId}
                    className="flex items-center gap-3 rounded-xl border border-input/70 px-3 py-2.5"
                  >
                    <UserAvatar
                      name={participant.name}
                      avatar={participant.avatar}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {participant.name}
                        {participant.id === user.id ? " (vos)" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isSettled
                          ? "Estás al día"
                          : isReceiving
                            ? "Te deben"
                            : "Debés"}
                      </p>
                    </div>
                    <span
                      className={
                        isSettled
                          ? "text-sm font-semibold text-muted-foreground"
                          : isReceiving
                            ? "text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-sm font-semibold text-destructive"
                      }
                    >
                      {isSettled ? "$0" : centsMoney(Math.abs(balanceRow.balanceCents))}
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p role="alert" className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              {economics.message}. No mostramos pagos sugeridos hasta revisar los datos.
            </p>
          )}
        </CardContent>
      </Card>

      {economics.ok ? (
        <Card className="rounded-2xl">
          <CardContent className="space-y-4">
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Pagos sugeridos
              </h2>
              <p className="text-xs text-muted-foreground">
                Transferencias para saldar el balance. No modifican la juntada.
              </p>
            </div>
            {economics.transfers.length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                No hay pagos sugeridos: todos están al día.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {economics.transfers.map((transfer) => {
                  const from = participantById.get(transfer.fromUserId)
                  const to = participantById.get(transfer.toUserId)
                  if (!from || !to) return null
                  const key = `${transfer.fromUserId}:${transfer.toUserId}`
                  const maxPayable = paymentMaxByTransfer.get(key)
                  return (
                    <li
                      key={key}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-input/70 px-3 py-2.5"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
                        <UserAvatar name={from.name} avatar={from.avatar} size="sm" />
                        <span className="truncate font-medium text-foreground">{from.name}</span>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                        <UserAvatar name={to.name} avatar={to.avatar} size="sm" />
                        <span className="truncate font-medium text-foreground">{to.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {centsMoney(transfer.amountCents)}
                        </span>
                        {transfer.fromUserId === user.id && maxPayable && Number(maxPayable) > 0 ? (
                          <RegisterPaymentSheet
                            friendId={to.id}
                            friendName={to.name}
                            maxPayableText={formatMoney(maxPayable)}
                            initialAmount={centsToAmountString(transfer.amountCents)}
                          />
                        ) : null}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-2xl">
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-heading text-sm font-semibold text-foreground">
              Participantes
            </p>
            {isCreator && isActive ? (
              <ParticipantsManager
                gatheringId={gathering.id}
                creatorId={gathering.creatorId}
                members={gatheringForm.participants}
                friends={friends}
              />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {gathering.participants.map((participant) => (
              <span
                key={participant.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-input px-2 py-1 text-xs"
              >
                <UserAvatar
                  name={participant.name}
                  avatar={participant.avatar}
                  size="sm"
                  className="size-5 text-[0.6rem]"
                />
                {participant.name}
                {participant.id === user.id ? " (vos)" : ""}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-sm font-semibold text-foreground">
            Gastos
          </h2>
          {isActive ? (
            <AddExpenseSheet
              gathering={gatheringForm}
              currentUserId={user.id}
            />
          ) : null}
        </div>

        {gathering.expenses.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-0">
              <EmptyState
                variant="inline"
                icon={Receipt}
                title="Todavía no cargaron gastos"
                description="Cargá el primero para que cada uno pague su parte sin vueltas."
              />
            </CardContent>
          </Card>
        ) : (
          <ul className="flex flex-col gap-3">
            {gathering.expenses.map((expense) => (
              <li key={expense.id}>
                <ExpenseItem
                  expense={toExpenseItemDto(expense)}
                  gathering={gatheringForm}
                  currentUserId={user.id}
                  canManage={
                    isActive && (isCreator || expense.creator.id === user.id)
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
