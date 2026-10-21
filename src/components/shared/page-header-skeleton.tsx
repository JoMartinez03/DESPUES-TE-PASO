import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * Placeholder de `PageHeader` que reproduce su estructura real: bloque
 * izquierdo (`min-w-0 space-y-1`) con -opcional- línea "Volver", título y
 * descripción, más el área de acción a la derecha. Mantener esta forma evita
 * el salto de layout cuando llega el contenido.
 *
 * Puramente decorativo: el `aria-hidden` lo aporta `Skeleton` y el estado de
 * carga lo anuncia el `aria-busy` del contenedor del `loading.tsx`.
 */
export function PageHeaderSkeleton({
  back = false,
  description = false,
  action = false,
  titleWidth = "w-40",
  className,
}: {
  back?: boolean
  description?: boolean
  action?: boolean
  titleWidth?: string
  className?: string
}) {
  return (
    <div
      className={cn("flex items-start justify-between gap-4", className)}
      aria-hidden="true"
    >
      <div className="min-w-0 space-y-1">
        {back ? (
          <div className="w-16">
            <Skeleton className="h-4" />
          </div>
        ) : null}
        <div className={titleWidth}>
          <Skeleton className="h-8" />
        </div>
        {description ? (
          <div className="w-56">
            <Skeleton className="h-4" />
          </div>
        ) : null}
      </div>
      {action ? (
        <div className="shrink-0">
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      ) : null}
    </div>
  )
}
