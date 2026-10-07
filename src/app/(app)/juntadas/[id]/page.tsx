import { notFound } from "next/navigation"
import { AlertTriangle, Receipt, Scale, Wallet } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { AddExpenseSheet } from "@/components/gatherings/add-expense-sheet"
import { CloseGatheringButton } from "@/components/gatherings/close-gathering-button"
import { ExpenseItem } from "@/components/gatherings/expense-item"
import { MyPaymentsCard } from "@/components/gatherings/my-payments-card"
import { ParticipantsManager } from "@/components/gatherings/participants-manager"
import { requireUser } from "@/lib/session"
import { formatDate, formatMoney, formatSignedMoney } from "@/lib/format"
import { centsToAmountString } from "@/lib/gatherings/money"
import { netPairDebtsFor } from "@/lib/gatherings/pair-debts"
import {
  economicsFromDebtGroups,
  historicalEconomicsFromExpenses,
  type DebtGroupRow,
} from "@/lib/gatherings/economics"
import { toExpenseItemDto } from "@/lib/gatherings/serializable"
import { maxPayableFrom, toDecimal } from "@/lib/transactions"
import { getGatheringDebtGroups, getGatheringView } from "@/queries/gatherings"
import { getFriendSummaries } from "@/queries/friendships"
import {
  ZERO,
  netBalancesForUser,
  pendingOutgoingPaymentsForUser,
} from "@/queries/transactions"

function centsMoney(cents: number): string {
  return formatMoney(centsToAmountString(cents))
}

/** Balance neto de `userId` desde las DEBT agrupadas (el mismo `sumSigned` de siempre). */
function signedDebtBalance(
  groups: readonly DebtGroupRow[],
  userId: string,
) {
  let balance = ZERO
  for (const row of groups) {
    const amount = row._sum.amount ?? ZERO
    if (row.debtorId === userId) balance = balance.minus(amount)
    if (row.creditorId === userId) balance = balance.plus(amount)
  }
  return balance
}

export default async function JuntadaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireUser()
  const { id } = await params

  // DOS oleadas de consultas paralelas, sin waterfalls: la segunda solo necesita
  // datos que ya están en la primera (ids de gastos y de participantes).
  const [gathering, netBalances, pendingOutgoing] = await Promise.all([
    getGatheringView(id, user.id),
    netBalancesForUser(user.id),
    pendingOutgoingPaymentsForUser(user.id),
  ])
  if (!gathering) notFound()

  const isCreator = gathering.creatorId === user.id
  const isActive = gathering.status === "ACTIVE"
  const expenseIds = gathering.expenses.map((expense) => expense.id)

  const [groups, friends] = await Promise.all([
    isActive ? getGatheringDebtGroups(expenseIds) : Promise.resolve([]),
    isCreator && isActive ? getFriendSummaries(user.id) : Promise.resolve([]),
  ])

  // Una juntada ACTIVA se balancea desde las DEBT derivadas. Una CERRADA las tiene
  // saldadas (se borraron al cerrar), así que su balance histórico se reconstruye
  // desde Expense + ExpenseParticipant para no perder quién pagó qué.
  const participantUserIds = gathering.participants.map(
    (participant) => participant.id,
  )
  const economics = isActive
    ? economicsFromDebtGroups({ participantUserIds, groups })
    : historicalEconomicsFromExpenses({
        participantUserIds,
        expenses: gathering.expenses.map((expense) => ({
          payerId: expense.payer.id,
          amount: expense.amount,
          participants: expense.participants,
        })),
      })

  const participantById = new Map(
    gathering.participants.map((participant) => [participant.id, participant]),
  )
  const paymentMaxByTransfer = new Map<string, string>()
  // Misma regla de siempre para `maxPayable`, resuelta con los mapas del batch
  // (balance y pendientes del par) en vez de 2 queries por acreedor.
  if (economics.ok && isActive) {
    for (const payment of netPairDebtsFor(economics.pairDebts, user.id)) {
      paymentMaxByTransfer.set(
        `${user.id}:${payment.creditorId}`,
        maxPayableFrom(
          netBalances.get(payment.creditorId) ?? ZERO,
          pendingOutgoing.get(payment.creditorId) ?? ZERO,
        ).toString(),
      )
    }
  }

  // Idéntico al balance que mostraba la página: ACTIVA usa la posición real (del
  // resultado económico o, si los datos no cierran, neteando el groupBy),
  // CERRADA muestra 0 (sus deudas quedaron saldadas al cerrar).
  const balance = !isActive
    ? ZERO
    : economics.ok
      ? toDecimal(
          centsToAmountString(
            economics.balances.find((row) => row.userId === user.id)
              ?.balanceCents ?? 0,
          ),
        )
      : signedDebtBalance(groups, user.id)

  // En centavos, para la cabecera de "Tus pagos" de MyPaymentsCard.
  const myBalanceCents = economics.ok
    ? (economics.balances.find((row) => row.userId === user.id)
        ?.balanceCents ?? 0)
    : 0

  const total = gathering.expenses.reduce(
    (acc, expense) => acc.plus(expense.amount),
    ZERO,
  )
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
          label={isActive ? "Tu balance" : "Tu saldo actual"}
          amount={signed.settled ? signed.text : `${signed.symbol} ${signed.text}`}
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
                {isActive
                  ? "Solo deudas confirmadas de los gastos de esta juntada."
                  : "Cómo terminó la juntada. Sus deudas quedaron saldadas al cerrarla."}
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
                    <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {participant.name}
                      {participant.id === user.id ? " (vos)" : ""}
                    </p>
                    <span
                      className={
                        isSettled
                          ? "shrink-0 whitespace-nowrap text-sm font-semibold text-muted-foreground"
                          : isReceiving
                            ? "shrink-0 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                            : "shrink-0 whitespace-nowrap text-sm font-semibold text-destructive"
                      }
                    >
                      {centsMoney(Math.abs(balanceRow.balanceCents))}
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
        <MyPaymentsCard
          pairDebts={economics.pairDebts}
          viewerId={user.id}
          balanceCents={myBalanceCents}
          isActive={isActive}
          participants={gathering.participants.map((participant) => ({
            id: participant.id,
            name: participant.name,
            avatar: participant.avatar,
          }))}
          maxPayableByPair={paymentMaxByTransfer}
        />
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
