"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  CalendarPlus,
  HandCoins,
  Plus,
  Receipt,
  UserRound,
} from "lucide-react"
import { UserAvatar } from "@/components/shared/user-avatar"
import { AddDebtSheet } from "@/components/transactions/add-debt-sheet"
import { RegisterPaymentSheet } from "@/components/transactions/register-payment-sheet"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { formatMoney } from "@/lib/format"
import type { QuickTransactionOptions } from "@/queries/friendships"

type ActionKind = "debt" | "payment"
type MenuMode = "menu" | ActionKind

export function FabAction({ options }: { options: QuickTransactionOptions }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<MenuMode>("menu")
  const [action, setAction] = useState<ActionKind | null>(null)
  const [friendId, setFriendId] = useState<string | null>(null)

  const selectedFriend = options.friends.find((friend) => friend.id === friendId)
  const selectedPayment = options.payments.find((friend) => friend.id === friendId)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) setMode("menu")
  }

  function chooseFriend(kind: ActionKind, nextFriendId: string) {
    setAction(kind)
    setFriendId(nextFriendId)
    setOpen(false)
    setMode("menu")
  }

  function closeForm() {
    setAction(null)
    setFriendId(null)
  }

  const title =
    mode === "debt"
      ? "Agregar deuda"
      : mode === "payment"
        ? "Registrar pago"
        : "¿Qué querés cargar?"
  const description =
    mode === "debt"
      ? "Elegí con quién registrar el gasto."
      : mode === "payment"
        ? "Solo aparecen amigos con una deuda pendiente."
        : "Acciones rápidas"

  return (
    <>
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger
          render={
            <Button
              size="icon-lg"
              className="fixed right-4 bottom-20 z-40 h-14 w-14 rounded-full shadow-lg shadow-primary/30 active:translate-y-px lg:right-8 lg:bottom-8 lg:size-12"
              aria-label="Acciones rápidas"
            />
          }
        >
          <Plus className="size-6" />
        </SheetTrigger>
        <SheetContent side="bottom" className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md">
          <SheetHeader className="p-5 pb-2">
            <div className="flex items-center gap-2">
              {mode !== "menu" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setMode("menu")}
                  aria-label="Volver"
                >
                  <ArrowLeft className="size-4" />
                </Button>
              ) : null}
              <div>
                <SheetTitle>{title}</SheetTitle>
                <SheetDescription>{description}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {mode === "menu" ? (
            <div className="flex flex-col p-3">
              <QuickActionButton
                label="Agregar deuda"
                icon={HandCoins}
                onClick={() => setMode("debt")}
              />
              <QuickActionButton
                label="Registrar pago"
                icon={Receipt}
                onClick={() => setMode("payment")}
              />
              <Link
                href="/juntadas/nueva"
                onClick={() => handleOpenChange(false)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarPlus className="size-4" />
                  </span>
                  Nueva juntada
                </span>
              </Link>
            </div>
          ) : (
            <div className="max-h-[55vh] overflow-y-auto p-3">
              {mode === "debt" ? (
                <FriendList
                  friends={options.friends}
                  emptyMessage="Necesitás tener amigos aceptados para registrar una deuda."
                  onSelect={(id) => chooseFriend("debt", id)}
                />
              ) : (
                <FriendList
                  friends={options.payments}
                  emptyMessage="No tenés pagos pendientes con tus amigos."
                  onSelect={(id) => chooseFriend("payment", id)}
                  renderMeta={(friendIdValue) => {
                    const option = options.payments.find((item) => item.id === friendIdValue)
                    return option ? `Máximo ${formatMoney(option.maxPayable)}` : null
                  }}
                />
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {action === "debt" && selectedFriend ? (
        <AddDebtSheet
          key={`debt-${selectedFriend.id}`}
          friendId={selectedFriend.id}
          friendName={selectedFriend.name}
          open
          showTrigger={false}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) closeForm()
          }}
          onSuccess={closeForm}
        />
      ) : null}

      {action === "payment" && selectedFriend && selectedPayment ? (
        <RegisterPaymentSheet
          key={`payment-${selectedFriend.id}`}
          friendId={selectedFriend.id}
          friendName={selectedFriend.name}
          maxPayableText={formatMoney(selectedPayment.maxPayable)}
          initialAmount={selectedPayment.maxPayable}
          open
          showTrigger={false}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) closeForm()
          }}
          onSuccess={closeForm}
        />
      ) : null}
    </>
  )
}

function QuickActionButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string
  icon: typeof HandCoins
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm text-foreground transition-colors hover:bg-muted"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
        {label}
      </span>
    </button>
  )
}

function FriendList({
  friends,
  emptyMessage,
  onSelect,
  renderMeta,
}: {
  friends: QuickTransactionOptions["friends"]
  emptyMessage: string
  onSelect: (friendId: string) => void
  renderMeta?: (friendId: string) => string | null
}) {
  if (friends.length === 0) {
    return <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <ul className="flex flex-col gap-1">
      {friends.map((friend) => (
        <li key={friend.id}>
          <button
            type="button"
            onClick={() => onSelect(friend.id)}
            className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:border-input hover:bg-muted"
          >
            <UserAvatar name={friend.name} avatar={friend.avatar} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">{friend.name}</span>
              {renderMeta?.(friend.id) ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {renderMeta(friend.id)}
                </span>
              ) : null}
            </span>
            <UserRound className="size-4 text-muted-foreground" />
          </button>
        </li>
      ))}
    </ul>
  )
}
