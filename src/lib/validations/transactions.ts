import { z } from "zod"
import { toCanonicalMoney } from "@/lib/money-input"

const MAX_AMOUNT = 999999999999.99 // tope del Decimal(14,2)

/**
 * Forma canónica que debe cumplir todo monto después de normalizar:
 * dígitos con punto decimal y hasta 2 posiciones. Cero, negativos, NaN,
 * Infinity y demás caracteres caen fuera de este patrón o de los refinados.
 */
const canonicalAmount = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Monto inválido")
  .refine((value) => Number(value) > 0, "El monto debe ser mayor a 0")
  .refine((value) => Number(value) <= MAX_AMOUNT, "Monto demasiado grande")

/**
 * Monto en texto tal como lo escribe el usuario: acepta coma o punto decimal
 * ("6600,83" y "6600.83") y lo normaliza a la forma canónica con punto antes
 * de validar. Un valor irrecuperable se deja pasar sin normalizar para que el
 * regex falle con "Monto inválido".
 */
export const moneyString = z.preprocess(
  (value) =>
    typeof value === "string" ? (toCanonicalMoney(value) ?? value) : value,
  canonicalAmount,
)

const debtDescription = z
  .string()
  .trim()
  .min(1, "Ingresá el concepto")
  .max(120, "Máximo 120 caracteres")

export const createDebtSchema = z.object({
  description: debtDescription,
  amount: moneyString,
  paidBy: z.enum(["me", "friend"], {
    error: "Indicá quién pagó",
  }),
})

export const editDebtSchema = z.object({
  transactionId: z.string().min(1, "Falta la operación"),
  description: debtDescription,
  amount: moneyString,
})

export const registerPaymentSchema = z.object({
  amount: moneyString,
})

export const transactionIdSchema = z.object({
  transactionId: z.string().min(1, "Falta la operación"),
})

export type CreateDebtInput = z.infer<typeof createDebtSchema>
export type EditDebtInput = z.infer<typeof editDebtSchema>
export type RegisterPaymentInput = z.infer<typeof registerPaymentSchema>
export type TransactionIdInput = z.infer<typeof transactionIdSchema>
