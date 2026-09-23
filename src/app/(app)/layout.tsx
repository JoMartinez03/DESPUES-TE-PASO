import type { ReactNode } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { requireUser } from "@/lib/session"

export default async function AppLayout({
  children,
}: {
  children: ReactNode
}) {
  await requireUser()
  const session = await auth()
  const user = session!.user

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, read: false },
  })

  return (
    <AppShell user={user} unreadCount={unreadCount}>
      {children}
    </AppShell>
  )
}