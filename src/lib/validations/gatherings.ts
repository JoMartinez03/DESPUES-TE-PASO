import { z } from "zod"
import { moneyString } from "@/lib/validations/transactions"

export const gatheringNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ingresá el nombre de la juntada")
    .max(100, "Máximo 100 caracteres"),
})

/**
 * Participantes seleccionados para una juntada. El creador se agrega siempre
 * del lado del servidor; acá solo se exige al menos una selección.
 */
export const createGatheringSchema = z.object({
  name: gatheringNameSchema.shape.name,
  participantIds: z
    .array(z.string().min(1, "Usuario inválido"))
    .min(1, "Elegí al menos un participante"),
})

export const gatheringIdSchema = z.object({
  gatheringId: z.string().min(1, "Falta la juntada"),
})

export const updateGatheringParticipantsSchema = z.object({
  gatheringId: gatheringIdSchema.shape.gatheringId,
  participantIds: z.array(z.string().min(1, "Usuario inválido")),
})

/**
 * Parte personalizada: puede ser $0 (participante seleccionado sin deuda).
 */
const customShareString = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Valor inválido")
  .refine((value) => Number(value) >= 0, "No puede ser negativo")

export const expenseMutationSchema = z.object({
  gatheringId: gatheringIdSchema.shape.gatheringId,
  title: z
    .string()
    .trim()
    .min(1, "Ingresá el concepto")
    .max(120, "Máximo 120 caracteres"),
  amount: moneyString,
  payerId: z.string().min(1, "Indicá quién pagó"),
  participantIds: z
    .array(z.string().min(1, "Usuario inválido"))
    .min(1, "Elegí al menos un participante"),
  splitType: z.enum(["EQUAL", "CUSTOM"], { error: "Indicá el tipo de división" }),
  shares: z.record(z.string(), customShareString).optional(),
})

export const expenseIdSchema = z.object({
  expenseId: z.string().min(1, "Falta el gasto"),
})

export type CreateGatheringInput = z.infer<typeof createGatheringSchema>
export type UpdateGatheringParticipantsInput = z.infer<
  typeof updateGatheringParticipantsSchema
>
export type ExpenseMutationInput = z.infer<typeof expenseMutationSchema>
export type SpendingIdInput = z.infer<typeof gatheringIdSchema>
export type ExpenseIdInput = z.infer<typeof expenseIdSchema>