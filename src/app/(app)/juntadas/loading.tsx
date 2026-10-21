import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeaderSkeleton } from "@/components/shared/page-header-skeleton"

/**
 * `/juntadas`: header con acción (Nueva juntada) + lista de juntadas. Cada
 * bloque copia la forma de `GatheringCard` (título/fecha + badges + fila de
 * métricas) para evitar el salto al llegar los datos.
 */
export default function JuntadasLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <PageHeaderSkeleton description action titleWidth="w-32" />

      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((item) => (
          <Card key={item} className="rounded-2xl shadow-xs">
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="w-36">
                    <Skeleton className="h-5" />
                  </div>
                  <div className="w-20">
                    <Skeleton className="h-3" />
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
