import { cache } from "react"
import { prisma } from "@/lib/prisma"

export type ProfileUser = {
  id: string
  name: string
  username: string | null
  email: string
  avatar: string | null
  transferAlias: string | null
  createdAt: Date
}

const profileSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  avatar: true,
  transferAlias: true,
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

/**
 * DTO mínimo del usuario para el header y el saludo del dashboard.
 *
 * `cache()` de React deduplica dentro del render: el layout lo pide y la página
 * del dashboard también, así que es una sola lectura por request.
 */
export const getProfileExcerpt = cache(
  async (userId: string): Promise<ProfileExcerpt | null> =>
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, avatar: true },
    }),
)
