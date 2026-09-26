import { beforeEach, describe, vi } from "vitest"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const canRunIntegration = Boolean(process.env.TEST_DATABASE_URL)

export const describeIntegration = describe.skipIf(!canRunIntegration)

export async function signInAs(userId: string | null): Promise<void> {
  vi.mocked(auth).mockResolvedValue(
    userId ? ({ user: { id: userId } } as never) : (null as never),
  )
}

export async function resetDatabase(): Promise<void> {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "users", "friendships", "transactions", "gatherings", "expenses", "expense_participants", "notifications" RESTART IDENTITY CASCADE',
  )
}

let sequence = 0

export async function createUser(name = "Usuario"): Promise<{ id: string; name: string }> {
  sequence += 1
  return prisma.user.create({
    data: {
      name,
      username: `qa_${name.toLowerCase().replace(/\s+/g, "_")}_${sequence}`,
      email: `qa_${sequence}@example.test`,
      password: "hash-de-prueba",
    },
    select: { id: true, name: true },
  })
}

export async function acceptFriendship(
  requesterId: string,
  addresseeId: string,
): Promise<void> {
  await createFriendship(requesterId, addresseeId, "ACCEPTED")
}

/** Friendship PENDING: `requesterId` le envió la solicitud a `addresseeId`. */
export async function createPendingFriendship(
  requesterId: string,
  addresseeId: string,
): Promise<{ id: string }> {
  return createFriendship(requesterId, addresseeId, "PENDING")
}

export async function createFriendship(
  requesterId: string,
  addresseeId: string,
  status: "PENDING" | "ACCEPTED" | "REJECTED",
): Promise<{ id: string }> {
  const [a, b] = [requesterId, addresseeId].sort()
  return prisma.friendship.create({
    data: {
      requesterId: a,
      addresseeId: b,
      pairKey: `${a}:${b}`,
      status,
    },
    select: { id: true },
  })
}

export async function createActiveGathering(
  creatorId: string,
  participantIds: string[],
  name = "Juntada de prueba",
): Promise<string> {
  const gathering = await prisma.gathering.create({
    data: { name, creatorId, date: new Date() },
    select: { id: true },
  })
  const memberIds = [...new Set([creatorId, ...participantIds])]
  await prisma.gatheringParticipant.createMany({
    data: memberIds.map((userId) => ({ gatheringId: gathering.id, userId })),
  })
  return gathering.id
}

export async function seedTriangle(): Promise<{
  creator: { id: string; name: string }
  friend: { id: string; name: string }
  third: { id: string; name: string }
}> {
  const creator = await createUser("Ana")
  const friend = await createUser("Beto")
  const third = await createUser("Caro")
  await acceptFriendship(creator.id, friend.id)
  await acceptFriendship(creator.id, third.id)
  return { creator, friend, third }
}

export function baseExpenseInput(
  gatheringId: string,
  payerId: string,
  participantIds: string[],
) {
  return {
    gatheringId,
    title: "Cena",
    amount: "30.00",
    payerId,
    participantIds,
    splitType: "EQUAL" as const,
  }
}

export function useCleanDatabase(): void {
  beforeEach(async () => {
    await resetDatabase()
    await signInAs(null)
  })
}
