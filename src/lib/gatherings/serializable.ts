import type { ExpenseView, UserSummary } from "@/queries/gatherings"

/**
 * DTO serializable para cruzar Server Component -> Client Component.
 * Los montos van como string de decimales y las fechas en ISO para evitar
 * Prisma.Decimal, Date y otros objetos que React no puede serializar.
 */
export type ExpenseParticipantDto = {
  userId: string
  name: string
  username: string
  avatar: string | null
  shareAmount: string
}

export type ExpenseItemDto = {
  id: string
  title: string
  amount: string
  splitType: "EQUAL" | "CUSTOM"
  currency: string
  createdAt: string
  payer: UserSummary
  creator: UserSummary
  participants: ExpenseParticipantDto[]
}

export function toExpenseItemDto(expense: ExpenseView): ExpenseItemDto {
  return {
    id: expense.id,
    title: expense.title,
    amount: expense.amount.toString(),
    splitType: expense.splitType,
    currency: expense.currency,
    createdAt: expense.createdAt.toISOString(),
    payer: expense.payer,
    creator: expense.creator,
    participants: expense.participants.map((participant) => ({
      userId: participant.userId,
      name: participant.name,
      username: participant.username,
      avatar: participant.avatar,
      shareAmount: participant.shareAmount.toString(),
    })),
  }
}