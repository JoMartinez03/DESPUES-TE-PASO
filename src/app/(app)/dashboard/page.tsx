import { ArrowDownLeft, ArrowUpRight, Hourglass } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { PendingBalances } from "@/components/dashboard/pending-balances"
import { auth } from "@/lib/auth"
import { formatMoney } from "@/lib/format"
import { requireUser } from "@/lib/session"
import { getDashboardSummary } from "@/queries/dashboard"
import { getProfileExcerpt } from "@/queries/profile"
import { getFriends } from "@/queries/friendships"

export default async function DashboardPage() {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const [summary, dbUser, friends] = await Promise.all([
    getDashboardSummary(user.id),
    getProfileExcerpt(user.id),
    getFriends(user.id),
  ])
  const firstName =
    (dbUser?.name ?? user.name)?.split(" ")[0] ?? "compañerx"

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Hola, ${firstName} 👋`}
        description="Este es tu resumen de cuentas."
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Te deben"
          amount={formatMoney(summary.owed)}
          icon={ArrowDownLeft}
          tone="positive"
        />
        <StatCard
          label="Debés"
          amount={formatMoney(summary.owe)}
          icon={ArrowUpRight}
          tone="negative"
        />
        <StatCard
          label="Por confirmar"
          amount={String(summary.toConfirm)}
          icon={Hourglass}
          tone="neutral"
        />
      </div>

      <PendingBalances
        items={friends.map((friend) => ({
          friendId: friend.id,
          name: friend.name,
          avatar: friend.avatar,
          balance: friend.balance.amount,
        }))}
      />
    </div>
  )
}