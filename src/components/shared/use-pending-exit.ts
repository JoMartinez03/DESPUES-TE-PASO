"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

/**
 * Cuánto se mantiene una fila resuelta antes de soltarla. Debe acompañar a la
 * duración de la animación `row-exit` (ver `globals.css`).
 */
export const EXIT_MS = 200

export type ExitRow<T> = T & { leaving: boolean }

/**
 * Coordina la salida visual de filas que una Server Action ya resolvió.
 *
 * No hace optimistic update: `resolve(id)` se llama **después** de que la
 * acción respondió OK. Mantiene la fila montada durante la animación aunque la
 * revalidación ya la haya quitado de las props, y recién entonces la suelta.
 *
 * Devuelve:
 * - `rows`: lo que hay que renderizar. Incluye las filas que están saliendo
 *   (marcadas con `leaving: true`) conservadas desde la última foto en que
 *   existieron, para que la animación alcance a verse.
 * - `isLeaving(id)`: si esa fila está en salida y no debe aceptar más interacción.
 * - `resolve(id)`: arranca la salida de esa fila.
 */
export function usePendingExit<T extends { id: string }>(items: T[]) {
  const [leavingIds, setLeavingIds] = useState<string[]>([])
  const [snapshots, setSnapshots] = useState<Map<string, T>>(new Map())

  // Última foto de las filas presentes, para poder conservarlas al salir.
  const latestItems = useRef(items)

  const timeouts = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  // `resolve` se llama desde un handler (después de un `await`), así que el
  // efecto ya corrió y el ref tiene la foto más reciente. Escribirlo acá en vez
  // de durante el render respeta las reglas de React.
  useEffect(() => {
    latestItems.current = items
  }, [items])

  const resolve = useCallback((id: string) => {
    // Snapshot de la fila antes de que la revalidación la saque de las props.
    const row = latestItems.current.find((item) => item.id === id)
    if (row) setSnapshots((current) => new Map(current).set(id, row))

    setLeavingIds((current) => (current.includes(id) ? current : [...current, id]))

    const existing = timeouts.current.get(id)
    if (existing) clearTimeout(existing)
    timeouts.current.set(
      id,
      setTimeout(() => {
        timeouts.current.delete(id)
        setLeavingIds((current) => current.filter((leaving) => leaving !== id))
        setSnapshots((current) => {
          if (!current.has(id)) return current
          const next = new Map(current)
          next.delete(id)
          return next
        })
      }, EXIT_MS),
    )
  }, [])

  useEffect(() => {
    const pending = timeouts.current
    return () => {
      for (const timeout of pending.values()) clearTimeout(timeout)
      pending.clear()
    }
  }, [])

  // Filas visibles: las props actuales (marcando las que están saliendo) más las
  // que ya no llegan pero siguen en salida, reconstruidas desde su snapshot.
  const rows = useMemo<ExitRow<T>[]>(() => {
    const visible = items.map<ExitRow<T>>((item) => ({
      ...item,
      leaving: leavingIds.includes(item.id),
    }))
    const present = new Set(items.map((item) => item.id))

    for (const id of leavingIds) {
      if (present.has(id)) continue
      const snapshot = snapshots.get(id)
      if (snapshot) visible.push({ ...snapshot, leaving: true })
    }

    return visible
  }, [items, leavingIds, snapshots])

  const isLeaving = useCallback(
    (id: string) => leavingIds.includes(id),
    [leavingIds],
  )

  return { rows, isLeaving, resolve }
}
