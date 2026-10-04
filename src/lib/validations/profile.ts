import { z } from "zod"

export const updateNicknameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El apodo debe tener al menos 2 caracteres")
    .max(40, "El apodo no puede superar los 40 caracteres"),
})

export const MIN_TRANSFER_ALIAS_LENGTH = 3
export const MAX_TRANSFER_ALIAS_LENGTH = 32

/**
 * Formatos reales de alias en Argentina: `nombre.apellido`, `tino.mp`,
 * `padre.mp`, `montana.uala`, `alias_con-guion.2024`. Se permiten letras
 * (sin ñ ni tildes), números, punto, guion y guion bajo; nada más. No se
 * intenta deducir el banco, la billetera ni el proveedor.
 */
const TRANSFER_ALIAS_CHARS = /^[A-Za-z0-9._-]+$/

/**
 * `transferAlias` es opcional. Todo se valida sobre el valor ya normalizado con
 * `trim`, y un campo vacío (o sólo espacios) se guarda como `null`, nunca `""`.
 */
export const transferAliasSchema = z.object({
  transferAlias: z
    .string()
    .refine(
      (value) => {
        const alias = value.trim()
        return alias === "" || TRANSFER_ALIAS_CHARS.test(alias)
      },
      "El alias no puede tener espacios. Usá letras, números, punto, guion o guion bajo.",
    )
    .refine(
      (value) => {
        const alias = value.trim()
        return alias === "" || alias.length >= MIN_TRANSFER_ALIAS_LENGTH
      },
      `El alias debe tener al menos ${MIN_TRANSFER_ALIAS_LENGTH} caracteres`,
    )
    .refine(
      (value) => value.trim().length <= MAX_TRANSFER_ALIAS_LENGTH,
      `El alias no puede superar los ${MAX_TRANSFER_ALIAS_LENGTH} caracteres`,
    )
    .transform((value) => (value.trim() === "" ? null : value.trim())),
})

export type UpdateNicknameInput = z.infer<typeof updateNicknameSchema>
export type TransferAliasInput = z.infer<typeof transferAliasSchema>