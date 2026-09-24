import { prisma } from "@/lib/prisma"

export type ProfileUser = {
  id: string
  name: string
  username: string | null
  email: string
  avatar: string | null
  createdAt: Date
}

const profileSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  avatar: true,
  createdAt: true,
} as const

export type ProfileExcerpt = {
  id: string
  name: string
  avatar: string | null
}

export async function getProfileUser(
  userId: string,
): Promise<ProfileUser | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  })
}

export async function getProfileExcerpt(
  userId: string,
): Promise<ProfileExcerpt | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, avatar: true },
  })
}