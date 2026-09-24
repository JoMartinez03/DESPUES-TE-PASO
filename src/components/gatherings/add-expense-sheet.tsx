"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExpenseForm } from "@/components/gatherings/expense-form"
import type { UserSummary } from "@/queries/friendships"

export function AddExpenseSheet({
  gathering,
  currentUserId,
}: {
  gathering: { id: string; name: string; participants: UserSummary[] }
  currentUserId: string
}) {
  return (
    <ExpenseForm
      gathering={gathering}
      currentUserId={currentUserId}
      trigger={
        <Button className="gap-1.5" variant="outline">
          <Plus className="size-4" />
          Agregar gasto
        </Button>
      }
    />
  )
}