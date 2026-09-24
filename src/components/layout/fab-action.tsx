"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarPlus, HandCoins, Plus, Receipt } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const PLACEHOLDER_ACTIONS = [
  { label: "Agregar deuda", icon: HandCoins },
  { label: "Registrar pago", icon: Receipt },
]

export function FabAction() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
          <SheetTitle>¿Qué querés cargar?</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col p-3">
          {PLACEHOLDER_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              disabled
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3",
                "text-sm text-foreground",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <action.icon className="size-4" />
                </span>
                {action.label}
              </span>
              <Badge variant="secondary">Próximamente</Badge>
            </button>
          ))}
          <Link
            href="/juntadas/nueva"
            onClick={() => setOpen(false)}
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
      </SheetContent>
    </Sheet>
  )
}