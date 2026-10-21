import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeaderSkeleton } from "@/components/shared/page-header-skeleton"

/**
 * `/juntadas/[id]`: header (con "Volver", descripción y acción) + grilla de 2
 * StatCard + balance de la juntada + "Tus pagos" + participantes + lista de
 * gastos. Sigue el orden real de `page.tsx` para que nada salte al hidratar.
 */
export default function JuntadaLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <PageHeaderSkeleton
        back
        description
        action
        titleWidth="w-48"
      />

      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((item) => (
          <Card key={item} size="sm" className="rounded-2xl">
            <CardContent className="flex items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="w-20">
                  <Skeleton className="h-4" />
                </div>
                <div className="w-24">
                  <Skeleton className="h-7" />
                </div>
              </div>
              <Skeleton className="size-9 shrink-0 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Balance de la juntada */}
      <Card className="rounded-2xl">
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="w-32">
                <Skeleton className="h-5" />
              </div>
              <div className="w-48">
                <Skeleton className="h-4" />
              </div>
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((row) => (
              <div
                key={row}
                className="flex items-center gap-3 rounded-xl border border-input/70 px-3 py-2.5"
              >
                <Skeleton className="size-6 shrink-0 rounded-full" />
                <div className="w-32">
                  <Skeleton className="h-4" />
                </div>
                <div className="ml-auto w-16">
                  <Skeleton className="h-4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tus pagos */}
      <Card className="rounded-2xl">
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="w-24">
              <Skeleton className="h-4" />
            </div>
            <div className="w-56">
              <Skeleton className="h-3" />
            </div>
          </div>
          <div className="space-y-2">
            {[0, 1].map((row) => (
              <div
                key={row}
                className="flex items-center gap-3 rounded-xl border border-input/70 px-3 py-2.5"
              >
                <Skeleton className="size-6 shrink-0 rounded-full" />
                <div className="w-28">
                  <Skeleton className="h-4" />
                </div>
                <div className="ml-auto w-20">
                  <Skeleton className="h-4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Participantes */}
      <Card className="rounded-2xl">
        <CardContent className="space-y-3">
          <div className="w-28">
            <Skeleton className="h-4" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3].map((chip) => (
              <Skeleton key={chip} className="h-7 w-24 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gastos */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="w-20">
            <Skeleton className="h-5" />
          </div>
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
        {[0, 1, 2].map((item) => (
          <Card key={item} className="rounded-2xl">
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="w-44">
                    <Skeleton className="h-4" />
                  </div>
                  <div className="w-24">
                    <Skeleton className="h-3" />
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Skeleton className="size-9 rounded-xl" />
                  <Skeleton className="size-9 rounded-xl" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
