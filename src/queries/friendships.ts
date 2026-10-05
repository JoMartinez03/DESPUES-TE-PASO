import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@/generated/prisma"
import {
  friendshipPairKey,
  relativeStatus,
  type RelativeFriendshipStatus,
} from "@/lib/friendship"
import { maxPayableFrom } from "@/lib/transactions"
import {
  netBalancesForUser,
  pendingOutgoingPaymentsForUser,
} from "@/queries/transactions"

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
  /** Alias declarado por el amigo para transferencias; `null` si no lo cargó. */
  transferAlias: string | null
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

/**
 * El alias viaja en la MISMA query de amistades (sin N+1) y sólo para los amigos
 * aceptados. No se suma a `userSummary` para que la búsqueda de personas y los
 * demás listados ni filtren ni puedan filtrar por alias.
 */
const friendSummary = { ...userSummary, transferAlias: true } as const

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
      requester: { select: friendSummary },
      addressee: { select: friendSummary },
    },
    orderBy: { updatedAt: "desc" },
  })

  const balances = await netBalancesForUser(userId)

  return friendships.map((friendship) => {
    const friend =
      friendship.requester.id === userId
        ? friendship.addressee
        : friendship.requester
    return {
      ...friend,
      friendshipId: friendship.id,
      friendsSince: friendship.createdAt,
      balance: {
        amount: balances.get(friend.id) ?? ZERO,
        currency: "ARS",
      },
    }
  })
}

/**
 * Amigos aceptados como DTO mínimo (id, name, username, avatar).
 * Sin balance ni Prisma.Decimal para poder pasar a Client Components.
 *
 * Va envuelto en `cache()` de React porque layout, dashboard, personas y juntadas
 * lo piden en el mismo render. La deduplicación es por request: cada render
 * nuevo vuelve a leer, no hay caché entre usuarios.
 */
export const getFriendSummaries = cache(
  async (userId: string): Promise<UserSummary[]> => {
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

    return friendships.map((friendship) =>
      friendship.requester.id === userId
        ? friendship.addressee
        : friendship.requester,
    )
  },
)

export type QuickPaymentOption = UserSummary & {
  maxPayable: string
}

export type QuickTransactionOptions = {
  friends: UserSummary[]
  payments: QuickPaymentOption[]
}

/**
 * Opciones del FAB: amigos para cargar deuda y amigos con pago pendiente.
 *
 * Son 3 consultas fijas, independientes de la cantidad de amigos:
 *   1. los amigos aceptados,
 *   2. los balances netos (`netBalancesForUser`, la MISMA lectura que usan el
 *      dashboard y la lista de amigos),
 *   3. los pagos PENDING salientes agrupados por acreedor.
 *
 * Antes esto era un N+1: una consulta por amigo para el balance y otra por los
 * pendientes. `maxPayableFrom` sigue siendo la única fuente de la regla, así
 * que el resultado es idéntico amigo por amigo.
 */
export async function getQuickTransactionOptions(
  userId: string,
): Promise<QuickTransactionOptions> {
  const [friends, balances, pendingOutgoing] = await Promise.all([
    getFriendSummaries(userId),
    netBalancesForUser(userId),
    pendingOutgoingPaymentsForUser(userId),
  ])

  const payments = friends
    .map((friend) => {
      const maxPayable = maxPayableFrom(
        balances.get(friend.id) ?? ZERO,
        pendingOutgoing.get(friend.id) ?? ZERO,
      )
      return { ...friend, maxPayable: maxPayable.toFixed(2) }
    })
    .filter((option) => Number(option.maxPayable) > 0)

  return { friends, payments }
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