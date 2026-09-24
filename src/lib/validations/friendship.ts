import { z } from "zod"

export const friendshipIdSchema = z.object({
  friendshipId: z.string().min(1, "Falta la solicitud"),
})

export const userIdSchema = z.object({
  userId: z.string().min(1, "Falta el usuario"),
})

export const searchUsersSchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, "Ingresá al menos 2 caracteres")
    .max(40, "Búsqueda demasiado larga"),
})

export type FriendshipIdInput = z.infer<typeof friendshipIdSchema>
export type UserIdInput = z.infer<typeof userIdSchema>
export type SearchUsersInput = z.infer<typeof searchUsersSchema>