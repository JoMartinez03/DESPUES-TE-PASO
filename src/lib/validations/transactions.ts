import { z } from "zod"

const MAX_AMOUNT = 999999999999.99 // tope del Decimal(14,2)

export const moneyString = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Monto inválido")
  .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0")
  .refine((value) => Number(value) <= MAX_AMOUNT, "Monto demasiado grande")

export const createDebtSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Ingresá el concepto")
    .max(120, "Máximo 120 caracteres"),
  amount: moneyString,
  paidBy: z.enum(["me", "friend"], {
    error: "Indicá quién pagó",
  }),
})

export const registerPaymentSchema = z.object({
  amount: moneyString,
})

export const transactionIdSchema = z.object({
  transactionId: z.string().min(1, "Falta la operación"),
})

export type CreateDebtInput = z.infer<typeof createDebtSchema>
export type RegisterPaymentInput = z.infer<typeof registerPaymentSchema>
export type TransactionIdInput = z.infer<typeof transactionIdSchema>