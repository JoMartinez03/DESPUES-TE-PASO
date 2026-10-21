"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

const KEYBOARD_INSET_PROPERTY = "--sheet-keyboard-inset"
const KEYBOARD_INSET_THRESHOLD = 60
const KEYBOARD_FOCUS_SLACK = 16
const SCROLLABLE_OVERFLOW = /auto|scroll|overlay/

/**
 * Movimiento compartido por todos los Sheets.
 *
 * - entrada: 200ms con un ease-out marcado (arranca rápido, frena suave)
 * - salida: 150ms con ease-in (se retira sin rebotar)
 * - `motion-reduce:transition-none` lo desactiva por completo cuando el
 *   usuario pidió menos movimiento.
 *
 * Los valores salen de los tokens de `globals.css`: ningún Sheet define su
 * propia transición, así que abrir/cerrar se siente igual en todas partes.
 *
 * `transition` (y no `transition-all`) a propósito: la lista de propiedades de
 * Tailwind no incluye `bottom` ni `max-height`, de modo que el ajuste del
 * inset del teclado virtual sigue siendo instantáneo.
 */
const SHEET_MOTION =
  "duration-(--sheet-duration) ease-(--sheet-ease) data-ending-style:duration-(--sheet-duration-exit) data-ending-style:ease-(--sheet-ease-exit) motion-reduce:transition-none"

function findScrollableAncestor(element: HTMLElement, boundary: HTMLElement) {
  let current = element.parentElement
  while (current && current !== boundary) {
    if (SCROLLABLE_OVERFLOW.test(getComputedStyle(current).overflowY)) return current
    current = current.parentElement
  }
  return null
}

function scrollContainerTo(element: HTMLElement, top: number, behavior: ScrollBehavior) {
  if (typeof element.scrollTo === "function") {
    element.scrollTo({ top, behavior })
    return
  }
  element.scrollTop = top
}

function useSheetKeyboardInset(enabled: boolean) {
  const [popup, setPopup] = React.useState<HTMLDivElement | null>(null)
  const attachPopup = React.useCallback((node: HTMLDivElement | null) => {
    setPopup(node)
  }, [])

  React.useEffect(() => {
    if (!popup || !enabled) return
    const doc = popup.ownerDocument
    const win = doc.defaultView ?? window
    const visualViewport = win.visualViewport
    if (!visualViewport) return

    const reducedMotion =
      win.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    const baseScroll = { x: win.scrollX, y: win.scrollY }
    let inset = -1
    let userControlled = false

    const writeInset = (value: number) => {
      if (value === inset) return
      inset = value
      popup.style.setProperty(KEYBOARD_INSET_PROPERTY, `${value}px`)
    }

    const visibleBand = () => {
      const top = Math.max(0, visualViewport.offsetTop ?? 0)
      return { top, bottom: Math.min(win.innerHeight, top + visualViewport.height) }
    }

    const revealFocusedField = () => {
      const active = doc.activeElement
      if (!(active instanceof HTMLElement) || !popup.contains(active)) return
      const scroller = findScrollableAncestor(active, popup) ?? popup
      const band = visibleBand()
      const rect = active.getBoundingClientRect()
      if (rect.top >= band.top && rect.bottom <= band.bottom) return
      const delta = Math.max(
        rect.bottom - (band.bottom - KEYBOARD_FOCUS_SLACK),
        band.top + KEYBOARD_FOCUS_SLACK - rect.top,
      )
      scrollContainerTo(
        scroller,
        scroller.scrollTop + delta,
        reducedMotion ? "auto" : "smooth",
      )
    }

    const sync = () => {
      const band = visibleBand()
      const overlap = win.innerHeight - band.bottom
      writeInset(overlap > KEYBOARD_INSET_THRESHOLD ? Math.round(overlap) : 0)
      if (
        inset > 0 &&
        !userControlled &&
        (win.scrollX !== baseScroll.x || win.scrollY !== baseScroll.y)
      ) {
        win.scrollTo({ left: baseScroll.x, top: baseScroll.y, behavior: "instant" })
      }
      revealFocusedField()
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement && popup.contains(event.target)) sync()
    }
    const handlePointerDown = () => {
      userControlled = true
    }
    const handlePointerUp = () => {
      userControlled = false
    }

    writeInset(0)
    sync()
    visualViewport.addEventListener("resize", sync)
    visualViewport.addEventListener("scroll", sync)
    win.addEventListener("scroll", sync)
    doc.addEventListener("focusin", handleFocusIn, true)
    doc.addEventListener("pointerdown", handlePointerDown, true)
    doc.addEventListener("pointerup", handlePointerUp, true)

    return () => {
      visualViewport.removeEventListener("resize", sync)
      visualViewport.removeEventListener("scroll", sync)
      win.removeEventListener("scroll", sync)
      doc.removeEventListener("focusin", handleFocusIn, true)
      doc.removeEventListener("pointerdown", handlePointerDown, true)
      doc.removeEventListener("pointerup", handlePointerUp, true)
      popup.style.removeProperty(KEYBOARD_INSET_PROPERTY)
    }
  }, [popup, enabled])

  return attachPopup
}

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/30 transition-opacity",
        SHEET_MOTION,
        "data-starting-style:opacity-0 data-ending-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  const attachPopup = useSheetKeyboardInset(side === "bottom")

  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        ref={attachPopup}
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          // Base: sin padding propio. Cada lado define su geometría y el
          // contenido se acomoda con `SheetHeader`/`SheetFooter`.
          "fixed z-50 flex flex-col gap-0 bg-popover bg-clip-padding p-0 text-sm text-popover-foreground shadow-lg transition",
          SHEET_MOTION,
          "data-starting-style:opacity-0 data-ending-style:opacity-0",
          // Bottom (mobile): panel de ancho completo, esquinas superiores
          // redondeadas y centrado en pantallas grandes.
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-[var(--sheet-keyboard-inset,0px)] data-[side=bottom]:h-auto data-[side=bottom]:max-h-[calc(100dvh_-_var(--sheet-keyboard-inset,0px))] data-[side=bottom]:overflow-y-auto data-[side=bottom]:overscroll-contain data-[side=bottom]:scroll-pb-[calc(var(--sheet-keyboard-inset,0px)_+_1rem)] data-[side=bottom]:pb-[env(safe-area-inset-bottom)] data-[side=bottom]:border-t data-[side=bottom]:rounded-t-2xl data-[side=bottom]:data-starting-style:translate-y-(--sheet-offset) data-[side=bottom]:data-ending-style:translate-y-(--sheet-offset) data-[side=bottom]:sm:mx-auto data-[side=bottom]:sm:max-w-md",
          // Laterales: panels con padding propio.
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:p-6 data-[side=left]:border-r data-[side=left]:data-starting-style:translate-x-(--sheet-offset) data-[side=left]:data-ending-style:translate-x-(--sheet-offset) data-[side=left]:sm:max-w-sm",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:p-6 data-[side=right]:border-l data-[side=right]:data-starting-style:translate-x-(--sheet-offset) data-[side=right]:data-ending-style:translate-x-(--sheet-offset) data-[side=right]:sm:max-w-sm",
          // Top.
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:p-6 data-[side=top]:border-b data-[side=top]:data-starting-style:translate-y-(--sheet-offset) data-[side=top]:data-ending-style:translate-y-(--sheet-offset)",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Cerrar</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      // `pr-12` reserva el lugar de la X global: el título nunca queda debajo.
      className={cn("flex flex-col gap-1 px-5 pt-5 pb-2 pr-12", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 px-5 pt-3 pb-5", className)}
      {...props}
    />
  )
}

/**
 * Clases de título y descripción del Sheet.
 *
 * Se exportan para poder replicar la tipografía sin registrar un segundo
 * título/descripción en el diálogo: en Base UI el `SheetTitle` es el que nombra
 * al popup, así que un segundo `SheetTitle` cambiaría el nombre accesible del
 * Sheet mientras está montado.
 */
const SHEET_TITLE_CLASS = "font-heading text-base font-medium text-foreground"
const SHEET_DESCRIPTION_CLASS = "text-sm text-muted-foreground"

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(SHEET_TITLE_CLASS, className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(SHEET_DESCRIPTION_CLASS, className)}
      {...props}
    />
  )
}

export {
  SHEET_TITLE_CLASS,
  SHEET_DESCRIPTION_CLASS,
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
