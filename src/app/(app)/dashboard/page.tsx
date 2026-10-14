import { ArrowDownLeft, ArrowUpRight, Hourglass } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Confirmations } from "@/components/dashboard/confirmations"
import { PendingBalances } from "@/components/dashboard/pending-balances"
import { HowToUse } from "@/components/onboarding/how-to-use"
import { auth } from "@/lib/auth"
import { formatMoney } from "@/lib/format"
import { requireUser } from "@/lib/session"
import { getDashboardSummary } from "@/queries/dashboard"
import { getProfileExcerpt } from "@/queries/profile"
import { getFriends } from "@/queries/friendships"

const statEnter =
  "animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out fill-mode-both motion-reduce:animate-none"

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
        action={<HowToUse />}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Te deben"
          amount={formatMoney(summary.owed)}
          icon={ArrowDownLeft}
          tone="positive"
          className={`${statEnter} delay-0`}
        />
        <StatCard
          label="Debés"
          amount={formatMoney(summary.owe)}
          icon={ArrowUpRight}
          tone="negative"
          className={`${statEnter} delay-75`}
        />
        <StatCard
          label="Por confirmar"
          amount={String(summary.toConfirm)}
          icon={Hourglass}
          tone="neutral"
          className={`${statEnter} delay-150`}
        />
      </div>

      <PendingBalances
        items={friends.map((friend) => ({
          friendId: friend.id,
          name: friend.name,
          avatar: friend.avatar,
          transferAlias: friend.transferAlias,
          balance: friend.balance.amount,
        }))}
      />

      {summary.confirmations.length > 0 ? (
        <Confirmations items={summary.confirmations} />
      ) : null}
    </div>
  )
}