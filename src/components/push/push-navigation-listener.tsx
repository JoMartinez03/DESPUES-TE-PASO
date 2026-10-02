"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/** Mismo tipo que emite `public/sw.js` al tocar una notificación. */
const NAVIGATE_MESSAGE = "despues-te-paso:navigate"

/**
 * El service worker no puede usar `Client.navigate` (no existe en Safari/iOS),
 * así que enfoca la ventana abierta y le delega la ruta por `postMessage`.
 * Este componente es el que la cumple dentro de la app.
 */
export function PushNavigationListener() {
  const router = useRouter()

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (!data || data.type !== NAVIGATE_MESSAGE) return
      if (typeof data.url !== "string") return
      if (!data.url.startsWith("/") || data.url.startsWith("//")) return
      router.push(data.url)
    }

    navigator.serviceWorker.addEventListener("message", handleMessage)
    return () => {
      navigator.serviceWorker.removeEventListener("message", handleMessage)
    }
  }, [router])

  return null
}