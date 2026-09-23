import type { ComponentType, ReactNode, SVGProps } from "react"
import { cn } from "@/lib/utils"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "bordered",
  className,
}: {
  icon: IconComponent
  title: string
  description?: string
  action?: ReactNode
  variant?: "bordered" | "inline"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-center",
        variant === "bordered" && "rounded-2xl border border-dashed px-6 py-12",
        variant === "inline" && "py-8",
        className,
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}