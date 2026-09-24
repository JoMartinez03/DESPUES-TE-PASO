import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"
import {
  friendshipPairKey,
  relativeStatus,
  type RelativeFriendshipStatus,
} from "@/lib/friendship"

const ZERO = new Prisma.Decimal(0)

export type Balance = {
  amount: Prisma.Decimal
  currency: string
}

export type FriendWithBalance = {
  id: string
  name: string
  username: string
  avatar: string | null
  friendshipId: string
  friendsSince: Date
  // TODO (Issue 3): calcular el balance real entre los dos usuarios.
  balance: Balance
}

const userSummary = {
  id: true,
  name: true,
  username: true,
  avatar: true,
} as const

export type UserSummary = {
  id: string
  name: string
  username: string
  avatar: string | null
}

export type SearchResult = UserSummary & {
  status: RelativeFriendshipStatus
  friendshipId: string | null
}

export type IncomingRequest = {
  friendshipId: string
  from: UserSummary
  createdAt: Date
}

export type OutgoingRequest = {
  friendshipId: string
  to: UserSummary
  createdAt: Date
}

export async function getFriends(userId: string): Promise<FriendWithBalance[]> {
  const friendships = await prisma.friendship.findMany({
    where: {
      status: "ACCEPTED",
      OR: [{ requesterId: userId }, { addresseeId: userId }],
    },
    include: {
      requester: { select: userSummary },
      addressee: { select: userSummary },
    },
    orderBy: { updatedAt: "desc" },
  })

  return friendships.map((friendship) => {
    const friend =
      friendship.requester.id === userId
        ? friendship.addressee
        : friendship.requester
    return {
      ...friend,
      friendshipId: friendship.id,
      friendsSince: friendship.createdAt,
      balance: { amount: ZERO, currency: "ARS" },
    }
  })
}

export async function getIncomingRequests(userId: string): Promise<IncomingRequest[]> {
  const rows = await prisma.friendship.findMany({
    where: { addresseeId: userId, status: "PENDING" },
    include: { requester: { select: userSummary } },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(({ id, requester, createdAt }) => ({
    friendshipId: id,
    from: requester,
    createdAt,
  }))
}

export async function getOutgoingRequests(userId: string): Promise<OutgoingRequest[]> {
  const rows = await prisma.friendship.findMany({
    where: { requesterId: userId, status: "PENDING" },
    include: { addressee: { select: userSummary } },
    orderBy: { createdAt: "desc" },
  })
  return rows.map(({ id, addressee, createdAt }) => ({
    friendshipId: id,
    to: addressee,
    createdAt,
  }))
}

export async function getFriendshipBetween(userId: string, otherId: string) {
  return prisma.friendship.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { requesterId: userId, addresseeId: otherId },
        { requesterId: otherId, addresseeId: userId },
      ],
    },
    select: { id: true, createdAt: true },
  })
}

export async function searchUsers(
  query: string,
  selfId: string,
): Promise<SearchResult[]> {
  const term = query.trim()
  if (term.length < 2) return []

  const users = await prisma.user.findMany({
    where: {
      id: { not: selfId },
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { username: { contains: term, mode: "insensitive" } },
      ],
    },
    select: userSummary,
    orderBy: { name: "asc" },
    take: 10,
  })

  if (users.length === 0) return []

  const pairKeys = users.map((user) => friendshipPairKey(selfId, user.id))
  const friendships = await prisma.friendship.findMany({
    where: { pairKey: { in: pairKeys } },
    select: {
      id: true,
      requesterId: true,
      addresseeId: true,
      status: true,
      pairKey: true,
    },
  })
  const byPair = new Map(
    friendships.map((friendship) => [friendship.pairKey, friendship]),
  )

  return users.map((user) => {
    const friendship = byPair.get(friendshipPairKey(selfId, user.id))
    return {
      ...user,
      status: friendship
        ? relativeStatus(friendship.requesterId, friendship.status, selfId)
        : ("none" as const),
      friendshipId: friendship?.id ?? null,
    }
  })
}