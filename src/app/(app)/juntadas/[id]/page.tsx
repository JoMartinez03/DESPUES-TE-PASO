import { notFound } from "next/navigation"
import { Receipt, Scale, Wallet } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Card, CardContent } from "@/components/ui/card"
import { AddExpenseSheet } from "@/components/gatherings/add-expense-sheet"
import { ExpenseItem } from "@/components/gatherings/expense-item"
import { ParticipantsManager } from "@/components/gatherings/participants-manager"
import { requireUser } from "@/lib/session"
import { formatDate, formatMoney, formatSignedMoney } from "@/lib/format"
import { toExpenseItemDto } from "@/lib/gatherings/serializable"
import {
  getGatheringBalanceForUser,
  getGatheringTotal,
  getGatheringView,
} from "@/queries/gatherings"
import { getFriendSummaries } from "@/queries/friendships"

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
  const [total, balance, friends] = await Promise.all([
    getGatheringTotal(gathering.id),
    getGatheringBalanceForUser(gathering.id, user.id),
    isCreator ? getFriendSummaries(user.id) : Promise.resolve([]),
  ])

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
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="font-heading text-sm font-semibold text-foreground">
              Participantes
            </p>
            {isCreator ? (
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
          <AddExpenseSheet
            gathering={gatheringForm}
            currentUserId={user.id}
          />
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
                    isCreator || expense.creator.id === user.id
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