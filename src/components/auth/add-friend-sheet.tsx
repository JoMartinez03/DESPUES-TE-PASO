"use client"

import { UserPlus } from "lucide-react"
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

export function AddFriendSheet() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <UserPlus className="size-4" />
            Agregar amigo
          </Button>
        }
      >
        Agregar amigo
      </SheetTrigger>
      <SheetContent side="bottom" className="gap-0 rounded-t-2xl p-0 sm:mx-auto sm:max-w-md">
        <SheetHeader className="p-5 pb-2">
          <SheetTitle>Agregar amigo</SheetTitle>
          <SheetDescription>
            Próximamente vas a poder buscar y agregar a tus amigos acá.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 p-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="friend-search">Buscar por nombre o username</Label>
            <Input
              id="friend-search"
              placeholder="ej: juanperez"
              disabled
              aria-disabled="true"
            />
          </div>
          <Button size="lg" className="w-full" disabled>
            Enviar solicitud
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}