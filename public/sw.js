// Service Worker de DespuésTePaso.
//
// Alcance: SOLO notificaciones push. No cachea ni intercepta navegación, para
// no meter en medio el router de Next.js.
//
// El scope es "/" (registrado con `{ scope: "/" }` y `Service-Worker-Allowed: /`
// en next.config.ts), y por eso las rutas relativas del payload —el `icon` y la
// `url`— resuelven contra la raíz del sitio.

const ICON_PATH = "/icon-v2-192.png"

self.addEventListener("install", () => {
  // Se toma el control apenas hay una versión nueva instalada.
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

/** El payload es del servidor, pero se revalida igual antes de navegar. */
function safeUrl(value) {
  if (typeof value !== "string") return "/"
  if (!value.startsWith("/") || value.startsWith("//")) return "/"
  return value
}

self.addEventListener("push", (event) => {
  // Sin `event.data` no hay nada que mostrar: una notificación vacía es peor
  // que ninguna.
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    return
  }

  const title = typeof payload.title === "string" ? payload.title : "DespuésTePaso"
  const body = typeof payload.body === "string" ? payload.body : ""

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      // Rutas relativas al scope del SW, que es la raíz del sitio.
      icon: ICON_PATH,
      badge: ICON_PATH,
      tag: safeUrl(payload.url),
      data: { url: safeUrl(payload.url) },
    }),
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const url = safeUrl(event.notification.data && event.notification.data.url)

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      const open = windows.find(
        (client) => new URL(client.url).origin === self.location.origin,
      )

      if (open) {
        await open.focus()
        // `Client.navigate` no existe en Safari/iOS, así que la navegación se
        // delega al listener de la app vía postMessage.
        open.postMessage({ type: "despues-te-paso:navigate", url })
        return
      }

      await self.clients.openWindow(url)
    })(),
  )
})