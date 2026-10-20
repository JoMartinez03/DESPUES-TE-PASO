import type { ComponentType, SVGProps } from "react"
import { AnimatedValue } from "@/components/shared/animated-value"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const tones = {
  positive: "text-emerald-600",
  negative: "text-rose-600",
  neutral: "text-foreground",
} as const

export function StatCard({
  label,
  amount,
  icon: Icon,
  tone = "neutral",
  className,
}: {
  label: string
  amount: string
  icon: IconComponent
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <Card size="sm" className={cn("rounded-2xl shadow-xs", className)}>
      <CardContent className="flex items-center justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold tracking-tight">
            <AnimatedValue value={amount} label={label} className={tones[tone]} />
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </CardContent>
    </Card>
  )
}