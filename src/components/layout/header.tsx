import { Brand } from "@/components/layout/brand"
import { NotificationsBell } from "@/components/layout/notifications-bell"
import { cn } from "@/lib/utils"

export function Header({
  unreadCount,
  className,
}: {
  unreadCount: number
  className?: string
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:hidden",
        className,
      )}
    >
      <Brand />
      <NotificationsBell unreadCount={unreadCount} />
    </header>
  )
}