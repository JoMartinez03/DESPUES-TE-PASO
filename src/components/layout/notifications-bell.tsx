"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, ChevronRight, CheckCheck } from "lucide-react"
import { markAllNotificationsRead } from "@/actions/notifications"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import type { NotificationItem } from "@/queries/notifications"

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "recién"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  return `hace ${days} d`
}

export function NotificationsBell({
  unreadCount,
  notifications,
}: {
  unreadCount: number
  notifications: NotificationItem[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(notifications)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next && items.some((item) => !item.read)) {
      setItems((prev) => prev.map((item) => ({ ...item, read: true })))
      markAllNotificationsRead()
    }
  }

  function goToFriends() {
    setOpen(false)
    router.push("/personas")
  }

  function handleOpen(item: NotificationItem) {
    setOpen(false)
    if (item.href) router.push(item.href)
    else goToFriends()
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notificaciones"
          />
        }
      >
        <Bell className="size-5" />
        {unreadCount > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] leading-none font-semibold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10} className="w-72 p-0">
        <PopoverHeader className="flex-row items-center justify-between">
          <PopoverTitle>Notificaciones</PopoverTitle>
          {items.some((item) => item.type === "FRIEND_REQUEST") ? (
            <button
              type="button"
              onClick={goToFriends}
              className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-muted"
            >
              Ver solicitudes
              <ChevronRight className="size-3" />
            </button>
          ) : null}
        </PopoverHeader>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Bell className="size-4" />
            </span>
            <p className="text-sm text-muted-foreground">
              Todavía no recibís notificaciones.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleOpen(item)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted"
                >
                  <span
                    className={
                      item.read
                        ? "mt-1.5 size-2 shrink-0 rounded-full bg-transparent"
                        : "mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                    }
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      {item.read ? (
                        <CheckCheck className="size-3 shrink-0 text-muted-foreground" />
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {item.body}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground/70">
                      {timeAgo(item.createdAt)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  )
}