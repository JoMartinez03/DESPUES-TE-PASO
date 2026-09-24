import { z } from "zod"

export const updateNicknameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El apodo debe tener al menos 2 caracteres")
    .max(40, "El apodo no puede superar los 40 caracteres"),
})

export type UpdateNicknameInput = z.infer<typeof updateNicknameSchema>