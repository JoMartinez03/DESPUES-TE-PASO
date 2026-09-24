"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NAV_ITEMS } from "@/components/layout/nav-items"
import { UserAvatar } from "@/components/shared/user-avatar"
import { cn } from "@/lib/utils"
import type { CurrentUser } from "@/lib/user"

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Sidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar lg:flex">
      <div className="px-6 pt-6 pb-4">
        <Link href="/dashboard" className="inline-flex">
          <span className="font-heading text-base font-semibold tracking-tight text-sidebar-foreground">
            DespuésTe<span className="text-sidebar-primary">Paso</span>
          </span>
        </Link>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto border-t p-3">
        <Link
          href="/perfil"
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent/60"
        >
          <UserAvatar
            name={user.name}
            avatar={user.avatar}
            className="[&_[data-slot=avatar-fallback]]:bg-sidebar-accent"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.name}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  )
}