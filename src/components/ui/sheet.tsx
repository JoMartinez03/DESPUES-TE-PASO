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
        "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
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
          "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-[var(--sheet-keyboard-inset,0px)] data-[side=bottom]:h-auto data-[side=bottom]:max-h-[calc(100dvh_-_var(--sheet-keyboard-inset,0px))] data-[side=bottom]:overflow-y-auto data-[side=bottom]:overscroll-contain data-[side=bottom]:scroll-pb-[calc(var(--sheet-keyboard-inset,0px)_+_1rem)] data-[side=bottom]:pb-[env(safe-area-inset-bottom)] data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
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
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
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
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
