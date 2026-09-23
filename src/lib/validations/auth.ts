import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Ingresá tu email")
    .pipe(z.email("Email inválido")),
  password: z.string().min(1, "Ingresá tu contraseña"),
})

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre")
    .max(60, "Máximo 60 caracteres"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(
      /^[a-z0-9][a-z0-9._]*[a-z0-9]$/,
      "Solo minúsculas, números, puntos y guiones bajos (sin espacios)",
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Ingresá tu email")
    .pipe(z.email("Email inválido")),
  password: z.string().min(8, "Mínimo 8 caracteres").max(72, "Máximo 72 caracteres"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>