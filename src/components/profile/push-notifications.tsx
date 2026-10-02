"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { BellOff, BellRing, Loader2 } from "lucide-react"
import {
  disablePushNotifications,
  enablePushNotifications,
} from "@/actions/push"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  DENIED_MESSAGE,
  IOS_INSTALL_MESSAGE,
  UNSUPPORTED_MESSAGE,
  currentPermission,
  detectPushSupport,
  pushKeyToString,
  urlBase64ToUint8Array,
} from "@/lib/push/client"
import { cn } from "@/lib/utils"

/** Registro desde `public/sw.js`; el scope "/" lo habilita next.config.ts. */
const SW_URL = "/sw.js"

type Status =
  | "checking"
  | "unsupported"
  | "needs-ios-install"
  | "denied"
  | "off"
  | "on"

/**
 * `subscribedDevices` viene del servidor para no mostrar "desactivadas" antes de
 * que el navegador conteste si este dispositivo ya estaba suscrito. El estado
 * real de ESTE dispositivo lo decide siempre `pushManager.getSubscription()`.
 */
export function PushNotificationsCard({
  subscribedDevices,
}: {
  subscribedDevices: number
}) {
  const router = useRouter()
  const [status, setStatus] = useState<Status>("checking")
  const [devices, setDevices] = useState(subscribedDevices)
  const [isPending, startTransition] = useTransition()

  // Registrar el service worker NO pide permiso: es lo que permite consultar
  // `getSubscription()` para conocer el estado real del dispositivo.
  useEffect(() => {
    let cancelled = false

    async function check() {
      const detected = detectPushSupport()
      if (cancelled) return

      if (detected.kind === "needs-ios-install") {
        setStatus("needs-ios-install")
        return
      }
      if (detected.kind === "unsupported") {
        setStatus("unsupported")
        return
      }

      try {
        await navigator.serviceWorker.register(SW_URL, {
          scope: "/",
          updateViaCache: "none",
        })
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        if (cancelled) return
        if (subscription) {
          setStatus("on")
          setDevices((current) => Math.max(current, 1))
          return
        }
        setStatus(currentPermission() === "denied" ? "denied" : "off")
      } catch {
        if (!cancelled) setStatus("unsupported")
      }
    }

    void check()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleEnable() {
    // Todo esto corre dentro del click: es la interacción explícita que exige
    // iOS para mostrar el prompt de permisos.
    startTransition(async () => {
      try {
        const registration = await navigator.serviceWorker.register(SW_URL, {
          scope: "/",
          updateViaCache: "none",
        })
        await navigator.serviceWorker.ready

        if (Notification.permission === "default") {
          await Notification.requestPermission()
        }
        if (Notification.permission !== "granted") {
          setStatus("denied")
          return
        }

        const existing = await registration.pushManager.getSubscription()
        const subscription =
          existing ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
            ),
          }))

        const result = await enablePushNotifications({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: pushKeyToString(subscription.getKey("p256dh")),
            auth: pushKeyToString(subscription.getKey("auth")),
          },
        })

        if (!result.ok) {
          toast({
            title: "No pudimos guardar la suscripción",
            description: result.error,
          })
          return
        }

        setStatus("on")
        setDevices((current) => Math.max(current, 1))
        router.refresh()
      } catch {
        setStatus("unsupported")
        toast({
          title: "No pudimos activar las notificaciones",
          description: "Probá de nuevo en un momento.",
        })
      }
    })
  }

  function handleDisable() {
    startTransition(async () => {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        if (subscription) {
          await subscription.unsubscribe()
          const result = await disablePushNotifications({
            endpoint: subscription.endpoint,
          })
          if (!result.ok) {
            toast({ title: "No pudimos desactivar", description: result.error })
          }
        }

        setStatus(currentPermission() === "denied" ? "denied" : "off")
        setDevices((current) => Math.max(0, current - 1))
        router.refresh()
      } catch {
        toast({ title: "No pudimos desactivar", description: "Intentá de nuevo." })
      }
    })
  }

  if (status === "checking") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Revisando notificaciones…
      </p>
    )
  }

  if (status === "needs-ios-install") {
    return <p className="text-sm text-muted-foreground">{IOS_INSTALL_MESSAGE}</p>
  }

  if (status === "unsupported") {
    return <p className="text-sm text-muted-foreground">{UNSUPPORTED_MESSAGE}</p>
  }

  if (status === "denied") {
    // Sin botón a propósito: el permiso nunca se vuelve a pedir automáticamente.
    return <p className="text-sm text-muted-foreground">{DENIED_MESSAGE}</p>
  }

  if (status === "on") {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <BellRing className="size-4 text-primary" />
          Notificaciones activadas
          {devices > 1 ? ` · ${devices} dispositivos` : ""}
        </p>
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }))}
          onClick={handleDisable}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : <BellOff />}
          Desactivar en este dispositivo
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "default" }))}
      onClick={handleEnable}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="animate-spin" /> : <BellRing />}
      Activar notificaciones
    </button>
  )
}