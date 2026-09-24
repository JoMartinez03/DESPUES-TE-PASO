import Link from "next/link"
import { SearchX } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-5" />
      </span>
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-semibold text-foreground">
          No encontramos esto
        </h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          La página que buscás no existe o no la tenés disponible.
        </p>
      </div>
      <Link href="/dashboard" className={buttonVariants({})}>
        Ir al inicio
      </Link>
    </div>
  )
}