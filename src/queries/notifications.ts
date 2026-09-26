import { prisma } from "@/lib/prisma"

export type NotificationItem = {
  id: string
  type: string
  title: string
  body: string
  read: boolean
  relatedFriendshipId: string | null
  relatedGatheringId: string | null
  href: string | null
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
      relatedGatheringId: true,
      relatedTransaction: {
        select: { debtorId: true, creditorId: true },
      },
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take,
  })

  return rows.map((row) => {
    const related = row.relatedTransaction
    const peerId = related
      ? related.debtorId === userId
        ? related.creditorId
        : related.debtorId
      : null

    // Las notificaciones de amistad no tienen una entidad propia a la que
    // apuntar: su destino es la lista de solicitudes.
    const href = row.relatedGatheringId
      ? `/juntadas/${row.relatedGatheringId}`
      : row.relatedFriendshipId
        ? "/personas"
        : peerId
          ? `/personas/${peerId}`
          : null

    return {
      id: row.id,
      type: row.type,
      title: row.title,
      body: row.body,
      read: row.read,
      relatedFriendshipId: row.relatedFriendshipId,
      relatedGatheringId: row.relatedGatheringId,
      href,
      createdAt: row.createdAt,
    }
  })
}