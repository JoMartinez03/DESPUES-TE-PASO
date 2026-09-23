import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function PageHeader({
  title,
  description,
  backHref,
  action,
}: {
  title: string
  description?: string
  backHref?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 space-y-1">
        {backHref ? (
          <Link
            href={backHref}
            className="-ml-1 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        ) : null}
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}