import { ArrowDownLeft, ArrowUpRight, Hourglass, Inbox } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { formatMoney } from "@/lib/format"
import { requireUser } from "@/lib/session"
import { getDashboardSummary } from "@/queries/dashboard"
import { getProfileExcerpt } from "@/queries/profile"

export default async function DashboardPage() {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const [summary, dbUser] = await Promise.all([
    getDashboardSummary(user.id),
    getProfileExcerpt(user.id),
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

      <Card className="rounded-2xl">
        <CardContent>
          <EmptyState
            icon={Inbox}
            title="Todavía no registraste movimientos"
            description="Las deudas y pagos que cargues con tus amigos van a aparecer acá."
          />
        </CardContent>
      </Card>
    </div>
  )
}