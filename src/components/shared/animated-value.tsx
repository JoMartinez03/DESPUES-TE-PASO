"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Duración del fade/destaque. Corta a propósito: comunica el cambio sin ser un contador. */
const HIGHLIGHT_MS = 240

/**
 * Texto numérico a comparable. Acepta los formatos que devuelve `formatMoney`
 * (ej. `$22.650`, `$1.234,50`, `−$500`) y cualquier otro valor ya formateado:
 * quita símbolos, separadores de miles `.` y normaliza la coma decimal. El
 * signo se lee antes de limpiar, porque `−` (U+2212) no lo entiende `parseFloat`.
 * Si el resultado no es un número finito, devuelve `null` (no hay sentido).
 */
export function parseComparableAmount(value: string): number | null {
  const negative = /[-−]/.test(value)
  const normalized = value
    .replace(/[^\d.,]/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
  const parsed = Number.parseFloat(normalized)
  if (!Number.isFinite(parsed)) return null
  return negative ? -parsed : parsed
}

function directionFor(previous: string, next: string): "up" | "down" | "none" {
  const a = parseComparableAmount(previous)
  const b = parseComparableAmount(next)
  if (a === null || b === null || a === b) return "none"
  return b > a ? "up" : "down"
}

/**
 * Muestra un valor ya formateado (ej. `formatMoney`) y, cuando cambia, hace un
 * fade con un pequeño desplazamiento vertical en el sentido del cambio.
 *
 * Pensado para Server Components: el valor llega como string y sólo se
 * re-renderiza el texto. No convierte al dashboard en Client Component.
 *
 * - Sin animación en el primer render (no hay "flash" al montar ni mismatch).
 * - El nodo que lleva el texto mantiene la clase que se le pase (tono del
 *   StatCard) y además `tabular-nums`: los símbolos quedan contenidos y no hay CLS.
 * - El respeto a `prefers-reduced-motion` se resuelve en CSS (`globals.css`),
 *   así que este componente no necesita ramas ni estado extra por eso.
 * - `aria-live="polite"` + `aria-label` anuncian el cambio una sola vez.
 */
export function AnimatedValue({
  value,
  children,
  label,
  className,
}: {
  /** Texto que se muestra; cuando cambia respecto del render anterior, anima. */
  value: string
  /** Contenido a mostrar; por defecto, `value`. */
  children?: ReactNode
  /** Etiqueta legible por lector de pantalla (ej. "Te deben"). */
  label?: string
  /** Clases del nodo que muestra el valor (ej. el tono del StatCard). */
  className?: string
}) {
  const [highlight, setHighlight] = useState<{
    direction: "up" | "down" | "none"
    seq: number
  } | null>(null)
  const previous = useRef(value)
  const seq = useRef(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const from = previous.current
    previous.current = value
    if (from === value) return

    seq.current += 1
    setHighlight({ direction: directionFor(from, value), seq: seq.current })

    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setHighlight(null), HIGHLIGHT_MS)

    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [value])

  return (
    <span
      // `inline-block` + `tabular-nums`: ancho estable, sin layout shift.
      className="inline-block tabular-nums"
      aria-live="polite"
      aria-label={label ? `${label}: ${value}` : value}
    >
      <span
        // La `key` es lo que hace que React remonte el span: sin remonte no hay animación.
        key={highlight ? `${value}-${highlight.seq}` : value}
        data-animated-value={highlight ? "true" : undefined}
        data-direction={highlight?.direction}
        className={cn("inline-block", className, highlight && "value-highlight")}
      >
        {children ?? value}
      </span>
    </span>
  )
}
