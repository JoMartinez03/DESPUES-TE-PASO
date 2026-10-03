import Link from "next/link"
import { ArrowDownLeft, ArrowUpRight, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatMoney } from "@/lib/format"
import type { Prisma } from "@/generated/prisma"

export type PendingBalanceItem = {
  friendId: string
  name: string
  avatar: string | null
  balance: Prisma.Decimal
}

export type PendingBalancesProps = {
  items: PendingBalanceItem[]
}

function direction(balance: Prisma.Decimal): "toMe" | "fromMe" | "zero" {
  if (balance.gt(0)) return "toMe"
  if (balance.lt(0)) return "fromMe"
  return "zero"
}

export function PendingBalances({ items }: PendingBalancesProps) {
  const filtered = items.filter((item) => direction(item.balance) !== "zero")

  if (filtered.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <CheckCircle2 className="size-6 text-emerald-600" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Estás al día</h3>
            <p className="text-sm text-muted-foreground">
              No tenés cuentas pendientes con tus amigos.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const sorted = [...filtered].sort((a, b) => {
    const da = direction(a.balance)
    const db = direction(b.balance)
    if (da !== db) {
      // Primero "toMe" (te deben), después "fromMe" (le debés)
      if (da === "toMe" && db === "fromMe") return -1
      if (da === "fromMe" && db === "toMe") return 1
    }
    const absA = a.balance.abs()
    const absB = b.balance.abs()
    if (absA.gt(absB)) return -1
    if (absB.gt(absA)) return 1
    return 0
  })

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Cuentas pendientes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border/60">
          {sorted.map((item) => {
            const d = direction(item.balance)
            const isToMe = d === "toMe"
            const amount = formatMoney(item.balance.abs())
            return (
              <li key={item.friendId}>
                <Link
                  href={`/personas/${item.friendId}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:px-6 sm:py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar
                      name={item.name}
                      avatar={item.avatar}
                      size="default"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {isToMe ? (
                      <ArrowDownLeft className="size-4 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="size-4 text-rose-600" />
                    )}
                    <p
                      className={
                        isToMe
                          ? "text-sm font-semibold text-emerald-600 tabular-nums"
                          : "text-sm font-semibold text-rose-600 tabular-nums"
                      }
                    >
                      {isToMe ? "Te debe" : "Le debés"} {amount}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}