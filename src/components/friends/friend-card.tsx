import Link from "next/link"
import { CheckCheck, ChevronRight } from "lucide-react"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatMoney } from "@/lib/format"
import type { FriendWithBalance } from "@/queries/friendships"

function isSettledBalance(amount: number) {
  return !Number.isFinite(amount) || amount === 0
}

export function FriendCard({ friend }: { friend: FriendWithBalance }) {
  const amount = Number(friend.balance.amount.toString())
  const settled = isSettledBalance(amount)

  return (
    <Link
      href={`/personas/${friend.id}`}
      className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-primary/40"
    >
      <UserAvatar name={friend.name} avatar={friend.avatar} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{friend.name}</p>
        <p className="truncate text-xs text-muted-foreground">@{friend.username}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
          {settled ? (
            <span className="flex items-center gap-1.5">
              <CheckCheck className="size-3.5 text-emerald-600" />
              <span className="text-muted-foreground">Al día</span>
            </span>
          ) : (
            <span className="font-medium text-foreground">
              {formatMoney(friend.balance.amount, friend.balance.currency)}
            </span>
          )}
          {settled ? (
            <>
              <span aria-hidden="true" className="text-muted-foreground">
                ·
              </span>
              <span className="text-muted-foreground">
                {formatMoney(friend.balance.amount, friend.balance.currency)}
              </span>
            </>
          ) : null}
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}