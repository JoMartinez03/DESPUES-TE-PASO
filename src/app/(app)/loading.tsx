import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeaderSkeleton } from "@/components/shared/page-header-skeleton"

/**
 * Fallback del grupo `(app)`: lo usan las rutas que no tienen su propio
 * `loading.tsx` (hoy, /dashboard; /personas, /juntadas y /perfil tienen el
 * suyo). Reproduce la estructura del Dashboard: header con acción, la grilla de
 * 3 StatCard y la Card de "Cuentas pendientes".
 */
export default function AppLoading() {
  return (
    <div className="space-y-8" aria-busy="true">
      <PageHeaderSkeleton description action titleWidth="w-56" />

      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item} size="sm" className="rounded-2xl">
            <CardContent className="flex items-center justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="w-20">
                  <Skeleton className="h-4" />
                </div>
                <div className="w-28">
                  <Skeleton className="h-7" />
                </div>
              </div>
              <Skeleton className="size-9 shrink-0 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cuentas pendientes: encabezado + filas de amigos. */}
      <Card className="rounded-2xl">
        <CardContent className="space-y-3">
          <div className="w-40">
            <Skeleton className="h-4" />
          </div>
          <ul className="flex flex-col">
            {[0, 1, 2].map((row) => (
              <li
                key={row}
                className="flex items-center gap-4 border-t border-border/60 py-4 first:border-t-0"
              >
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="w-32">
                    <Skeleton className="h-4" />
                  </div>
                  <div className="w-20">
                    <Skeleton className="h-3" />
                  </div>
                </div>
                <div className="w-24">
                  <Skeleton className="h-4" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
