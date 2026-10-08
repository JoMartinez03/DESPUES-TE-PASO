"use client"

import { useState, type ReactNode } from "react"
import {
  ArrowDownLeft,
  ArrowRight,
  CircleHelp,
  Hourglass,
  UserPlus,
} from "lucide-react"
import { AvatarGroup } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"

type Step = {
  title: string
  description: string
  visual: ReactNode
}

function StepFriendsVisual() {
  return (
    <div className="flex items-center justify-center gap-3">
      <UserAvatar name="Lauti" />
      <UserAvatar name="Caro" />
      <UserAvatar name="Juli" />
      <span className="flex size-8 items-center justify-center rounded-full border-2 border-dashed border-primary/50 text-primary">
        <UserPlus className="size-4" />
      </span>
    </div>
  )
}

function StepDebtVisual() {
  return (
    <div className="w-full max-w-xs rounded-xl border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name="Lauti" />
          <p className="truncate text-sm font-medium">Lauti</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ArrowDownLeft className="size-4 text-emerald-600" />
          <p className="text-sm font-semibold text-emerald-600 tabular-nums">
            Te debe {formatMoney(6000)}
          </p>
        </div>
      </div>
    </div>
  )
}

function StepPaymentsVisual() {
  return (
    <div className="w-full max-w-xs rounded-xl border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar name="Lauti" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Lauti</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Hourglass className="size-3 shrink-0 text-amber-600" />
              Pago pendiente
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ArrowRight className="size-3.5 text-muted-foreground" />
          <span
            aria-hidden="true"
            tabIndex={-1}
            className={cn(
              buttonVariants({ size: "sm" }),
              "pointer-events-none",
            )}
          >
            Confirmar
          </span>
        </div>
      </div>
    </div>
  )
}

function StepGatheringVisual() {
  return (
    <div className="w-full max-w-xs space-y-2 rounded-xl border bg-background p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium">Asado del sábado</p>
        <AvatarGroup>
          <UserAvatar name="Lauti" />
          <UserAvatar name="Caro" />
          <UserAvatar name="Juli" />
        </AvatarGroup>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Asado</span>
        <span className="tabular-nums">{formatMoney(12000)}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Birra</span>
        <span className="tabular-nums">{formatMoney(6000)}</span>
      </div>
      <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold text-primary">
        <span>Cada uno paga</span>
        <span className="tabular-nums">{formatMoney(6000)}</span>
      </div>
    </div>
  )
}

const steps: Step[] = [
  {
    title: "Agregá a tus amigos 👥",
    description: "Buscá a tus amigos y agregalos para empezar a llevar las cuentas juntos.",
    visual: <StepFriendsVisual />,
  },
  {
    title: "Anotá quién debe 💸",
    description:
      "Si pagaste algo por otra persona, agregá la deuda. DespuésTePaso actualiza los saldos automáticamente.",
    visual: <StepDebtVisual />,
  },
  {
    title: "Registrá tus pagos ✅",
    description:
      "Cuando le pagues a alguien, registrá el pago. La otra persona lo confirma y las cuentas se actualizan.",
    visual: <StepPaymentsVisual />,
  },
  {
    title: "Organizá tus juntadas 🍻",
    description:
      "Agregá participantes y gastos. DespuésTePaso calcula cuánto corresponde pagar a cada uno.",
    visual: <StepGatheringVisual />,
  },
]

export function HowToUse() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  const current = steps[step]
  const isFirst = step === 0
  const isLast = step === steps.length - 1

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    // Sin persistencia en V1: al cerrar siempre vuelve al paso 1.
    if (!nextOpen) setStep(0)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
          />
        }
      >
        <CircleHelp className="size-4" />
        Cómo usar
        <span className="hidden sm:inline"> DespuésTePaso</span>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="gap-0 rounded-t-3xl p-0 sm:mx-auto sm:max-w-md"
      >
        <SheetHeader className="gap-1 p-5 pr-12 pb-1">
          <SheetTitle>{current.title}</SheetTitle>
          <SheetDescription>{current.description}</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-44 items-center justify-center px-5">
          {current.visual}
        </div>
        <div className="mt-auto border-t p-4">
          <div
            className="flex items-center justify-center gap-2"
            aria-hidden="true"
          >
            {steps.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "rounded-full transition-all",
                  index === step ? "size-2.5 bg-primary" : "size-2 bg-border",
                )}
              />
            ))}
          </div>
          <p className="sr-only">
            Paso {step + 1} de {steps.length}
          </p>
          <div
            className={cn("mt-4 flex gap-2", isFirst && "justify-end")}
          >
            {isFirst ? null : (
              <Button
                variant="outline"
                className="h-10 flex-1 sm:flex-none"
                onClick={() => setStep(step - 1)}
              >
                Anterior
              </Button>
            )}
            {isLast ? (
              <Button
                className="h-10 flex-1 sm:flex-none"
                onClick={() => handleOpenChange(false)}
              >
                Entendido
              </Button>
            ) : (
              <Button
                className="h-10 flex-1 sm:flex-none"
                onClick={() => setStep(step + 1)}
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
