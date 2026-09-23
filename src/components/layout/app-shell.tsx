import type { ReactNode } from "react"
import { BottomNav } from "@/components/layout/bottom-nav"
import { FabAction } from "@/components/layout/fab-action"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import type { SessionUser } from "@/lib/user"

export function AppShell({
  user,
  unreadCount,
  children,
}: {
  user: SessionUser
  unreadCount: number
  children: ReactNode
}) {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto w-full max-w-xl lg:max-w-none">
        <Sidebar user={user} />
      </div>
      <div className="lg:pl-64">
        <Header unreadCount={unreadCount} />
        <main className="mx-auto w-full max-w-2xl px-4 pt-6 pb-32 lg:max-w-4xl lg:px-8 lg:pt-10 lg:pb-16">
          {children}
        </main>
      </div>
      <BottomNav />
      <FabAction />
    </div>
  )
}