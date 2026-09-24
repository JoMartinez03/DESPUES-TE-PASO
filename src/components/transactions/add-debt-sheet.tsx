"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus } from "lucide-react"
import { createDebt } from "@/actions/transactions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

type Payer = "me" | "friend"

export function AddDebtSheet({
  friendId,
  friendName,
}: {
  friendId: string
  friendName: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState<Payer>("me")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const firstName = friendName.split(" ")[0] ?? friendName

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createDebt({
        userId: friendId,
        description,
        amount,
        paidBy,
      })
      if (result.ok) {
        toast({ title: "Deuda registrada", description: result.message })
        setOpen(false)
        setDescription("")
        setAmount("")
        router.refresh()
      } else {
        setError(result.message)
      }
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="gap-1.5" variant="outline" />}>
        <Plus className="size-4" />
        Agregar deuda
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md"
      >
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Agregar deuda</SheetTitle>
          <SheetDescription>
            Registrá un gasto con {firstName}.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="debt-description">Concepto</Label>
            <Input
              id="debt-description"
              placeholder="ej: hamburguesas"
              maxLength={120}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-amount">Monto</Label>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="debt-amount"
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
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaidBy("me")}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  paidBy === "me"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-input text-muted-foreground hover:bg-muted",
                )}
              >
                Yo
              </button>
              <button
                type="button"
                onClick={() => setPaidBy("friend")}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  paidBy === "friend"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-input text-muted-foreground hover:bg-muted",
                )}
              >
                {firstName}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {paidBy === "me"
                ? `Le debés a ${firstName}.`
                : `${firstName} te debe a vos.`}
            </p>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Guardar deuda
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}