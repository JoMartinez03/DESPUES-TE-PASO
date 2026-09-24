"use client"

import { Toast } from "@base-ui/react/toast"
import { cn } from "cn"

type ToastOptions = {
  title?: string
  description?: string
  timeout?: number
}

const toastManager = Toast.createToastManager()

export function toast(options: ToastOptions | string) {
  const opts = typeof options === "string" ? { description: options } : options
  toastManager.add({
    title: opts.title,
    description: opts.description,
    timeout: opts.timeout ?? 3000,
  })
}

function ToasterBody() {
  const { toasts } = Toast.useToastManager()

  return (
    <Toast.Portal>
      <Toast.Viewport className="pointer-events-none fixed inset-x-3 bottom-20 z-[100] flex w-auto flex-col-reverse items-center gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-80 lg:left-auto">
        {toasts.map((item) => (
          <Toast.Root
            key={item.id}
            toast={item}
            swipeDirection="down"
            className={cn(
              "pointer-events-auto relative flex w-full origin-bottom items-start gap-3 rounded-xl border border-border bg-card p-3 text-card-foreground shadow-lg shadow-foreground/5",
              "transition-[transform,opacity] duration-200 ease-out",
              "data-starting-style:-translate-y-2 data-starting-style:opacity-0",
              "data-ending-style:data-[swipe-direction=down]:translate-y-6",
              "data-ending-style:opacity-0 data-ending-style:data-[swipe-direction=down]:opacity-0",
            )}
          >
            <Toast.Content className="min-w-0 flex-1">
              <div className="flex flex-col gap-0.5">
                <Toast.Title className="text-sm font-medium text-foreground" data-slot="toast-title" />
                <Toast.Description className="text-sm text-muted-foreground" data-slot="toast-description" />
              </div>
              <Toast.Close
                aria-label="Cerrar"
                data-slot="toast-close"
                className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                ×
              </Toast.Close>
            </Toast.Content>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  )
}

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager}>
      <ToasterBody />
    </Toast.Provider>
  )
}