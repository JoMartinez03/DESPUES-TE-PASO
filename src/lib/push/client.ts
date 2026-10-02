/**
 * Detección de soporte de Web Push para el navegador.
 *
 * Solo se usa desde componentes cliente: en SSR `navigator` no existe y el
 * permiso nunca se pide solo por cargar la página.
 */

export const IOS_INSTALL_MESSAGE =
  "Para recibir notificaciones en iPhone, agregá DespuésTePaso a tu pantalla de inicio y abrilo desde ahí."

export const UNSUPPORTED_MESSAGE =
  "Este navegador no admite notificaciones push."

export const DENIED_MESSAGE =
  "Las notificaciones están bloqueadas. Habilitalas desde los ajustes del navegador o del sistema y volvé a abrir la app."

export type PushSupport =
  | { kind: "ready" }
  | { kind: "needs-ios-install" }
  | { kind: "unsupported" }

function isIos(): boolean {
  const ua = navigator.userAgent
  const iPadOsDesktopMode =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1
  return /iPad|iPhone|iPod/.test(ua) || iPadOsDesktopMode
}

/** ¿La app está corriendo como PWA instalada (standalone/fullscreen)? */
export function isInstalledPwa(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    (navigator as { standalone?: boolean }).standalone === true
  )
}

/**
 * El chequeo de iOS va PRIMERO a propósito: en Safari dentro de una pestaña
 * `PushManager` no existe, y sin este orden se mostraría el mensaje genérico
 * de "no compatible" en vez de explicar cómo instalar la app.
 */
export function detectPushSupport(): PushSupport {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return { kind: "unsupported" }
  }

  if (isIos() && !isInstalledPwa()) {
    return { kind: "needs-ios-install" }
  }

  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return { kind: "unsupported" }
  }

  return { kind: "ready" }
}

/**
 * Safari exige `applicationServerKey` como `Uint8Array`; el string base64 que
 * acepta Chrome no le sirve.
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const raw = window.atob(base64)
  const output = new Uint8Array(new ArrayBuffer(raw.length))
  for (let index = 0; index < raw.length; index += 1) {
    output[index] = raw.charCodeAt(index)
  }
  return output
}

/**
 * `PushSubscription.getKey` devuelve `ArrayBuffer` en la lib DOM moderna y
 * `string` en la vieja. La base guarda las claves como base64url.
 */
export function pushKeyToString(key: ArrayBuffer | string | null): string {
  if (key === null) return ""
  if (typeof key === "string") return key

  let binary = ""
  for (const byte of new Uint8Array(key)) {
    binary += String.fromCharCode(byte)
  }
  return window.btoa(binary)
}

export function currentPermission(): NotificationPermission {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied"
  return Notification.permission
}