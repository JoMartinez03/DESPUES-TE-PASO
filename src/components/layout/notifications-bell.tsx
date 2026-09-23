"use client"

import { Bell } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function NotificationsBell({ unreadCount }: { unreadCount: number }) {
  return (
    <Popover>
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
      <PopoverContent align="end" sideOffset={10} className="w-72">
        <PopoverHeader>
          <PopoverTitle>Notificaciones</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col items-center gap-2 rounded-lg py-6 text-center">
          <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Bell className="size-4" />
          </span>
          <p className="text-sm text-muted-foreground">
            Todavía no recibís notificaciones.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}