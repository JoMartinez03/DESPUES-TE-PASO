import type { ReactNode } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"
import type { CurrentUser } from "@/lib/user"
import { getRecentNotifications } from "@/queries/notifications"
import { getProfileExcerpt } from "@/queries/profile"

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const dbUser = await getProfileExcerpt(user.id)
  const currentUser: CurrentUser = dbUser ?? {
    id: user.id,
    name: user.name ?? "Usuario",
    avatar: user.avatar ?? null,
  }

  const [unreadCount, notifications] = await Promise.all([
    prisma.notification.count({ where: { userId: user.id, read: false } }),
    getRecentNotifications(user.id),
  ])

  return (
    <AppShell
      user={currentUser}
      unreadCount={unreadCount}
      notifications={notifications}
    >
      {children}
    </AppShell>
  )
}