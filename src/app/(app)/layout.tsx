import type { ReactNode } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import { getRecentNotifications } from "@/queries/notifications"

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const [unreadCount, notifications] = await Promise.all([
    prisma.notification.count({ where: { userId: user.id, read: false } }),
    getRecentNotifications(user.id),
  ])

  return (
    <AppShell user={user} unreadCount={unreadCount} notifications={notifications}>
      {children}
    </AppShell>
  )
}