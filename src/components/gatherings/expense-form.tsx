"use client"

import { useState, useTransition } from "react"
import type { ReactElement } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Save } from "lucide-react"
import { createExpense, updateExpense } from "@/actions/expenses"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserAvatar } from "@/components/shared/user-avatar"
import { toast } from "@/components/ui/toast"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  centsToAmountString,
  parseMoneyToCents,
  splitEqualCents,
  sumCents,
} from "@/lib/gatherings/money"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/format"
import type { UserSummary } from "@/queries/friendships"

export type ExpenseFormModel = {
  id: string
  title: string
  amount: string
  payerId: string
  splitType: "EQUAL" | "CUSTOM"
  participantIds: string[]
  shares: Record<string, string>
}

type SplitType = "EQUAL" | "CUSTOM"

function firstName(name: string): string {
  return name.split(" ")[0] ?? name
}

function parseSafeCents(value: string): number {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return 0
  return parseMoneyToCents(value)
}

function splitToShares(
  amount: string,
  participantIds: string[],
): Record<string, string> {
  if (participantIds.length === 0) return {}
  const totalCents = parseSafeCents(amount)
  if (totalCents <= 0) return {}
  const byUser = splitEqualCents(totalCents, participantIds)
  const result: Record<string, string> = {}
  for (const [userId, cents] of byUser) {
    result[userId] = centsToAmountString(cents)
  }
  return result
}

export function ExpenseForm({
  trigger,
  gathering,
  currentUserId,
  expense,
}: {
  trigger?: ReactElement
  gathering: {
    id: string
    name: string
    participants: UserSummary[]
  }
  currentUserId: string
  expense?: ExpenseFormModel
}) {
  const router = useRouter()
  const editing = Boolean(expense)

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(expense?.title ?? "")
  const [amount, setAmount] = useState(expense?.amount ?? "")
  const [payerId, setPayerId] = useState(expense?.payerId ?? currentUserId)
  const [splitType, setSplitType] = useState<SplitType>(
    expense?.splitType ?? "EQUAL",
  )
  const [participantIds, setParticipantIds] = useState<Set<string>>(
    () =>
      new Set(
        expense?.participantIds ??
          gathering.participants.map((participant) => participant.id),
      ),
  )
  const [shares, setShares] = useState<Record<string, string>>(
    () => expense?.shares ?? {},
  )
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const participants = gathering.participants
  const selectedMembers = participants.filter((participant) =>
    participantIds.has(participant.id),
  )
  const amountCents = parseSafeCents(amount)

  function toggleParticipant(userId: string) {
    setParticipantIds((current) => {
      const next = new Set(current)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  function switchSplitType(next: SplitType) {
    setSplitType(next)
    if (next === "CUSTOM") {
      setShares(splitToShares(amount, [...participantIds]))
    }
  }

  const assignedCents = sumCents(
    [...participantIds]
      .map((userId) => shares[userId])
      .filter((value): value is string => value !== undefined)
      .map(parseSafeCents),
  )
  const remainingCents = amountCents - assignedCents
  const customResolved =
    splitType === "CUSTOM" && remainingCents === 0 && amountCents > 0
  const customCoverage = selectedMembers.every((participant) => {
    const value = shares[participant.id] ?? ""
    return /^\d+(\.\d{1,2})?$/.test(value)
  })

  function resetForm() {
    if (expense) {
      setTitle(expense.title)
      setAmount(expense.amount)
      setPayerId(expense.payerId)
      setSplitType(expense.splitType)
      setParticipantIds(new Set(expense.participantIds))
      setShares({ ...expense.shares })
    } else {
      setTitle("")
      setAmount("")
      setPayerId(currentUserId)
      setSplitType("EQUAL")
      setParticipantIds(new Set(participants.map((participant) => participant.id)))
      setShares({})
    }
    setError(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const participantIdsList = [...participantIds]
    if (participantIdsList.length === 0) {
      setError("Elegí al menos un participante")
      return
    }
    if (splitType === "CUSTOM") {
      if (!customCoverage) {
        setError("Completá el monto de cada participante")
        return
      }
      if (!customResolved) {
        setError(
          remainingCents > 0
            ? `Faltan ${formatMoney(remainingCents / 100)} por repartir`
            : `Sobran ${formatMoney(-remainingCents / 100)}`,
        )
        return
      }
    }

    const payload = {
      gatheringId: gathering.id,
      title,
      amount,
      payerId,
      participantIds: participantIdsList,
      splitType,
      shares: splitType === "CUSTOM" ? shares : undefined,
    }

    startTransition(async () => {
      const result = expense
        ? await updateExpense({ ...payload, expenseId: expense.id })
        : await createExpense(payload)
      if (result.ok) {
        toast({
          title: editing ? "Gasto actualizado" : "Gasto agregado",
          description: result.message,
        })
        setOpen(false)
        resetForm()
        router.refresh()
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm()
        setOpen(next)
      }}
    >
      {trigger ? <SheetTrigger render={trigger} /> : null}
      <SheetContent
        side="bottom"
        className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md"
      >
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>{editing ? "Editar gasto" : "Agregar gasto"}</SheetTitle>
          <SheetDescription>
            {editing
              ? `Actualizando ${expense?.title}.`
              : `Nuevo gasto en ${gathering.name}.`}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="expense-title">Concepto</Label>
            <Input
              id="expense-title"
              placeholder="ej: hamburguesas"
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expense-amount">Monto</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="expense-amount"
                inputMode="decimal"
                placeholder="0"
                className="pl-7 tabular-nums"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>¿Quién pagó?</Label>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => {
                const active = payerId === participant.id
                return (
                  <button
                    key={participant.id}
                    type="button"
                    onClick={() => setPayerId(participant.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-input text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {firstName(participant.name)}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>¿Cómo se divide?</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => switchSplitType("EQUAL")}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  splitType === "EQUAL"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-input text-muted-foreground hover:bg-muted",
                )}
              >
                En partes iguales
              </button>
              <button
                type="button"
                onClick={() => switchSplitType("CUSTOM")}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  splitType === "CUSTOM"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-input text-muted-foreground hover:bg-muted",
                )}
              >
                Montos distintos
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Participantes del gasto</Label>
            <ul className="flex flex-col gap-1">
              {participants.map((participant) => {
                const isChecked = participantIds.has(participant.id)
                return (
                  <li key={participant.id}>
                    <label
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors",
                        isChecked
                          ? "border-primary bg-primary/5"
                          : "border-input hover:bg-muted",
                      )}
                    >
                      <UserAvatar
                        name={participant.name}
                        avatar={participant.avatar}
                        size="sm"
                      />
                      <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                        {participant.name}
                        {participant.id === currentUserId ? " (vos)" : ""}
                      </span>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          toggleParticipant(participant.id)
                          if (splitType === "CUSTOM" && !checked) {
                            setShares((current) => {
                              const next = { ...current }
                              delete next[participant.id]
                              return next
                            })
                          }
                        }}
                        aria-label={`Incluir a ${participant.name} en el gasto`}
                      />
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>

          {splitType === "CUSTOM" ? (
            <div className="space-y-3">
              <Label>Partes</Label>
              <ul className="flex flex-col gap-2">
                {selectedMembers.map((participant) => (
                  <li
                    key={participant.id}
                    className="flex items-center gap-3 rounded-xl border border-input p-2 pl-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {firstName(participant.name)}
                    </span>
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                        $
                      </span>
                      <Input
                        inputMode="decimal"
                        placeholder="0"
                        className="h-8 w-28 pl-6 text-right tabular-nums"
                        value={shares[participant.id] ?? ""}
                        onChange={(event) =>
                          setShares((current) => ({
                            ...current,
                            [participant.id]: event.target.value,
                          }))
                        }
                        aria-label={`Parte de ${participant.name}`}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <p
                className={cn(
                  "text-xs",
                  customResolved
                    ? "text-emerald-600"
                    : remainingCents > 0
                      ? "text-muted-foreground"
                      : "text-rose-600",
                )}
              >
                {customResolved
                  ? "Las partes suman el total exacto."
                  : remainingCents > 0
                    ? `Faltan ${formatMoney(remainingCents / 100)} por repartir.`
                    : `Sobran ${formatMoney(-remainingCents / 100)}.`}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              {selectedMembers.length === 0
                ? "Elegí al menos un participante."
                : `Cada uno aporta ${formatMoney(Math.floor(amountCents / selectedMembers.length) / 100)}.`}
            </p>
          )}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : editing ? (
              <Save className="size-4" />
            ) : (
              <Plus className="size-4" />
            )}
            {editing ? "Guardar cambios" : "Guardar gasto"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}