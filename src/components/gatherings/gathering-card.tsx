import Link from "next/link"
import { Receipt, Users, WalletCards } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatMoney, formatShortDate } from "@/lib/format"
import type { GatheringCard as GatheringCardData } from "@/queries/gatherings"

export function GatheringCard({ gathering }: { gathering: GatheringCardData }) {
  return (
    <Link href={`/juntadas/${gathering.id}`} className="block">
      <Card className="rounded-2xl shadow-xs transition-colors hover:bg-muted/40">
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <p className="truncate font-heading text-base font-semibold text-foreground">
                {gathering.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatShortDate(gathering.date)}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {formatMoney(gathering.total)}
              </span>
              <span
                className={
                  gathering.status === "ACTIVE"
                    ? "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700 dark:text-emerald-300"
                    : "rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold text-muted-foreground"
                }
              >
                {gathering.status === "ACTIVE" ? "Activa" : "Cerrada"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" />
              {gathering.participantCount}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Receipt className="size-3.5" />
              {gathering.expenseCount} {gathering.expenseCount === 1 ? "gasto" : "gastos"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <WalletCards className="size-3.5" />
              Total
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}