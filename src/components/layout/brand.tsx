import { cn } from "@/lib/utils"
import markJson from "./handshake-mark.json"

/**
 * Geometria compartida con scripts/generate-icons.mjs. Es fija a proposito: el
 * handshake es parte de la identidad y no se regenera desde lucide-react. Si
 * cambia el logo, se cambia handshake-mark.json y la interfaz y los iconos
 * siguen siendo el mismo dibujo.
 */
type HandshakeMark = {
  viewBox: string
  fill: string
  strokeWidth: number
  strokeLinecap: "round" | "butt" | "square"
  strokeLinejoin: "round" | "miter" | "bevel"
  paths: string[]
}

const mark = markJson as HandshakeMark

export function HandshakeMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={mark.viewBox}
      fill={mark.fill}
      stroke="currentColor"
      strokeWidth={mark.strokeWidth}
      strokeLinecap={mark.strokeLinecap}
      strokeLinejoin={mark.strokeLinejoin}
      aria-hidden="true"
    >
      {mark.paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <HandshakeMark className="size-4" />
      </span>
      <span className="font-heading text-base font-semibold tracking-tight text-foreground">
        DespuésTe<span className="text-primary">Paso</span>
      </span>
    </span>
  )
}
