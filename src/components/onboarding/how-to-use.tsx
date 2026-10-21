"use client"

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type AnimationEvent,
  type ReactNode,
} from "react"
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
  SHEET_DESCRIPTION_CLASS,
  SHEET_TITLE_CLASS,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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

/**
 * La descripción reserva alto fijo en todos los pasos: así el bloque animado
 * mantiene siempre la misma altura (junto al `min-h-44` de la representación
 * visual) y el footer del Sheet no se mueve al cambiar de paso.
 *
 * Son tres líneas en pantallas normales y cuatro en las más angostas, donde la
 * descripción más larga puede ocupar una línea extra.
 */
const STEP_DESCRIPTION_CLASS = "min-h-[4lh] min-[400px]:min-h-[3lh]"

type StepDirection = "forward" | "backward"

/** Paso visible + cambio de paso en curso (de dónde salimos y hacia qué lado). */
type TutorialState = {
  step: number
  transition: { from: number; direction: StepDirection } | null
}

/**
 * Si el usuario pidió menos movimiento, el cambio de paso es instantáneo.
 * `matchMedia` no existe en SSR (ni en el entorno de tests): ahí se asume que
 * sí se puede animar.
 */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReducedMotion(onStoreChange: () => void) {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {}
  }
  const query = window.matchMedia(REDUCED_MOTION_QUERY)
  query.addEventListener("change", onStoreChange)
  return () => query.removeEventListener("change", onStoreChange)
}

function getReducedMotionSnapshot() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getServerReducedMotionSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  )
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
        <p className="truncate text-sm font-medium">Asato del sábado</p>
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

/**
 * Título, descripción y representación visual de un paso.
 *
 * La capa saliente (la que se desvanece) no usa `SheetTitle`/`SheetDescription`:
 * en Base UI el título registrado es el que nombra al diálogo, así que un
 * segundo título cambiaría el nombre accesible del Sheet mientras está montado.
 */
function StepBody({ step, ghost = false }: { step: Step; ghost?: boolean }) {
  return (
    <>
      <SheetHeader>
        {ghost ? (
          <p className={SHEET_TITLE_CLASS}>{step.title}</p>
        ) : (
          <SheetTitle>{step.title}</SheetTitle>
        )}
        {ghost ? (
          <p
            className={cn(SHEET_DESCRIPTION_CLASS, STEP_DESCRIPTION_CLASS)}
          >
            {step.description}
          </p>
        ) : (
          <SheetDescription className={STEP_DESCRIPTION_CLASS}>
            {step.description}
          </SheetDescription>
        )}
      </SheetHeader>
      <div className="flex min-h-44 items-center justify-center px-5">
        {step.visual}
      </div>
    </>
  )
}

export function HowToUse() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<TutorialState>({
    step: 0,
    transition: null,
  })
  const reducedMotion = usePrefersReducedMotion()
  const exitingRef = useRef<HTMLDivElement>(null)

  const { step, transition } = state
  const current = steps[step]
  const isFirst = step === 0
  const isLast = step === steps.length - 1

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    // Sin persistencia en V1: al cerrar siempre vuelve al paso 1.
    if (!nextOpen) setState({ step: 0, transition: null })
  }

  /**
   * Avanza o retrocede un paso.
   *
   * El índice se calcula sobre el estado actual (no sobre el del render
   * anterior) y se acota al rango válido, así que un clic rápido no puede
   * saltearlo ni dejarlo fuera de rango. Mientras dura la transición en curso
   * no se acepta otro cambio: el índice queda congelado y no se encadenan
   * animaciones.
   */
  function goTo(delta: 1 | -1) {
    setState((current) => {
      if (current.transition) return current
      const next = Math.min(
        Math.max(current.step + delta, 0),
        steps.length - 1,
      )
      if (next === current.step) return current
      if (reducedMotion) return { step: next, transition: null }
      return {
        step: next,
        transition: {
          from: current.step,
          direction: delta > 0 ? "forward" : "backward",
        },
      }
    })
  }

  function handleExitEnd(event: AnimationEvent<HTMLDivElement>) {
    // Sólo cierra la transición la animación de la capa saliente: los
    // `animationend` de los hijos llegan por bubbling.
    if (event.target !== event.currentTarget) return
    setState((current) =>
      current.transition ? { ...current, transition: null } : current,
    )
  }

  useEffect(() => {
    if (!transition) return
    const layer = exitingRef.current
    if (!layer) return
    // `getComputedStyle` fuerza el recálculo de estilos: recién ahí el
    // navegador registra la animación CSS.
    const style = window.getComputedStyle(layer)
    const animations =
      typeof layer.getAnimations === "function" ? layer.getAnimations() : []
    const running = animations.some(
      (animation) => animation.playState === "running",
    )
    // Sin animación corriendo (entorno sin soporte, o una que ya terminó) no
    // va a llegar ningún `animationend`: se cierra la transición de una.
    if (!style.animationName || style.animationName === "none" || !running) {
      setState((current) =>
        current.transition ? { ...current, transition: null } : current,
      )
    }
  }, [transition])

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
      <SheetContent side="bottom">
        {/*
          Bloque animado del tutorial. El contenido entrante va en flujo (define
          la altura) y el saliente se superpone para desvanecerse: así el alto
          nunca cambia y el footer del Sheet queda quieto.
        */}
        <div className="relative">
          <div
            key={step}
            className={cn(transition && "tutorial-step-in")}
            data-direction={transition?.direction}
          >
            <StepBody step={current} />
          </div>
          {transition ? (
            <div
              ref={exitingRef}
              className="absolute inset-0 tutorial-step-out"
              data-direction={transition.direction}
              aria-hidden="true"
              onAnimationEnd={handleExitEnd}
            >
              <StepBody step={steps[transition.from]} ghost />
            </div>
          ) : null}
        </div>
        <SheetFooter className="gap-4 border-t">
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
          <div className={cn("flex gap-2", isFirst && "justify-end")}>
            {isFirst ? null : (
              <Button
                variant="outline"
                className="h-10 flex-1 sm:flex-none"
                onClick={() => goTo(-1)}
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
                onClick={() => goTo(1)}
              >
                Siguiente
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
