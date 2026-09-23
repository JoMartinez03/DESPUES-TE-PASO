"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Algo salió mal
        </h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {error.digest ? `Pasó algo inesperado (${error.digest}). ` : "Pasó algo inesperado. "}
          Volvé a intentarlo.
        </p>
      </div>
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  )
}