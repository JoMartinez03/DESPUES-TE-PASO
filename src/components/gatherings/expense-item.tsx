"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Pencil, Receipt, Trash2 } from "lucide-react"
import { deleteExpense } from "@/actions/expenses"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { UserAvatar } from "@/components/shared/user-avatar"
import { ExpenseForm, type ExpenseFormModel } from "@/components/gatherings/expense-form"
import { formatMoney, formatShortDate } from "@/lib/format"
import type { ExpenseItemDto } from "@/lib/gatherings/serializable"
import type { UserSummary } from "@/queries/friendships"

function firstName(name: string): string {
  return name.split(" ")[0] ?? name
}

export function ExpenseItem({
  expense,
  gathering,
  currentUserId,
  canManage,
}: {
  expense: ExpenseItemDto
  gathering: { id: string; name: string; participants: UserSummary[] }
  currentUserId: string
  canManage: boolean
}) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const model: ExpenseFormModel = {
    id: expense.id,
    title: expense.title,
    amount: expense.amount,
    payerId: expense.payer.id,
    splitType: expense.splitType,
    participantIds: expense.participants.map((participant) => participant.userId),
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteExpense({ expenseId: expense.id })
      if (result.ok) {
        toast({ title: "Gasto eliminado", description: result.message })
        setConfirmOpen(false)
        router.refresh()
      } else {
        toast({ title: "No se pudo eliminar", description: result.message })
        setConfirmOpen(false)
      }
    })
  }

  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <p className="truncate font-medium text-foreground">{expense.title}</p>
            <p className="text-xs text-muted-foreground">
              {formatShortDate(expense.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {canManage ? (
              <>
                <ExpenseForm
                  gathering={gathering}
                  currentUserId={currentUserId}
                  expense={model}
                  trigger={
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      aria-label={`Editar gasto ${expense.title}`}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  }
                />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setConfirmOpen(true)}
                  aria-label={`Eliminar gasto ${expense.title}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">
            <Receipt className="size-3" />
            {formatMoney(expense.amount, expense.currency)}
          </span>
          <span className="inline-flex items-center gap-1">
            <UserAvatar name={expense.payer.name} avatar={expense.payer.avatar} size="sm" className="size-5 text-[0.6rem]" />
            Pagó {firstName(expense.payer.name)}
          </span>
        </div>

        {expense.participants.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {expense.participants
              .slice()
              .sort((a, b) => a.userId.localeCompare(b.userId))
              .map((participant) => (
                <span
                  key={participant.userId}
                  className="inline-flex items-center gap-1 rounded-full border border-input px-2 py-0.5 text-xs text-foreground"
                >
                  {firstName(participant.name)}
                  {expense.splitType === "CUSTOM" ? (
                    <span className="font-semibold tabular-nums text-muted-foreground">
                      {formatMoney(participant.shareAmount, expense.currency)}
                    </span>
                  ) : null}
                </span>
              ))}
          </div>
        ) : null}

        <p className="text-xs text-muted-foreground">
          Cargó {firstName(expense.creator.name)} ·{" "}
          {expense.splitType === "CUSTOM" ? "montos distintos" : "en partes iguales"}
        </p>
      </CardContent>

      <Sheet open={confirmOpen} onOpenChange={setConfirmOpen}>
        <SheetContent
          side="bottom"
          className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md"
        >
          <SheetHeader className="p-5 pb-2">
            <SheetTitle>¿Eliminar este gasto?</SheetTitle>
            <SheetDescription>
              Las deudas generadas por este gasto también se eliminarán.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-2 p-5 pt-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              Eliminar gasto
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Card>
  )
}