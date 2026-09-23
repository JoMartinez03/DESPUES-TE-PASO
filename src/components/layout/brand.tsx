import { Handshake } from "lucide-react"
import { cn } from "@/lib/utils"

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Handshake className="size-4" />
      </span>
      <span className="font-heading text-base font-semibold tracking-tight text-foreground">
        DespuésTe<span className="text-primary">Paso</span>
      </span>
    </span>
  )
}