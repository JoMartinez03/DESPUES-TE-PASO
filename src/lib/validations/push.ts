import { z } from "zod"

const endpointSchema = z
  .string()
  .trim()
  .min(1, "Falta el endpoint de la suscripción")
  // 2048 es holgado para los endpoints reales de FCM/Mozilla/APNs (~300) y
  // evita que alguien cole un payload gigante en la base.
  .max(2048, "Endpoint demasiado largo")
  .refine((value) => value.startsWith("https://"), "Endpoint inválido")

export const pushSubscriptionSchema = z.object({
  endpoint: endpointSchema,
  keys: z.object({
    p256dh: z
      .string()
      .trim()
      .min(1, "Falta la clave p256dh")
      .max(512, "Clave p256dh inválida"),
    auth: z
      .string()
      .trim()
      .min(1, "Falta la clave auth")
      .max(512, "Clave auth inválida"),
  }),
})

export const pushUnsubscribeSchema = z.object({
  endpoint: endpointSchema,
})

export type PushSubscriptionInput = z.infer<typeof pushSubscriptionSchema>
export type PushUnsubscribeInput = z.infer<typeof pushUnsubscribeSchema>