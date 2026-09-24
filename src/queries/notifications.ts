import { prisma } from "@/lib/prisma"

export type NotificationItem = {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  relatedFriendshipId: string | null
  createdAt: Date
}

export async function getRecentNotifications(
  userId: string,
  take = 20,
): Promise<NotificationItem[]> {
  const rows = await prisma.notification.findMany({
    where: { userId },
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      read: true,
      relatedFriendshipId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take,
  })
  return rows
}