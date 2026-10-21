import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeaderSkeleton } from "@/components/shared/page-header-skeleton"

/**
 * `/perfil`: header simple + Card de identidad (avatar xl centrado), dos Cards
 * con formularios (alias y notificaciones), la fila "Miembro desde" y el botón
 * de cerrar sesión. Reproduce el orden y las alturas del contenido real.
 */
export default function PerfilLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <PageHeaderSkeleton titleWidth="w-24" />

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
          <Skeleton className="size-16 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-xl" />
          <Skeleton className="h-7 w-40 rounded-xl" />
          <div className="w-48">
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      </Card>

      {[0, 1].map((section) => (
        <Card key={section} className="rounded-2xl">
          <CardContent className="flex flex-col items-start gap-3 py-6">
            <div className="space-y-1">
              <div className="w-40">
                <Skeleton className="h-5" />
              </div>
              <div className="w-64 max-w-full">
                <Skeleton className="h-4" />
              </div>
            </div>
            <Skeleton className="h-9 w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      <Skeleton className="h-11 w-full rounded-xl" />
    </div>
  )
}
