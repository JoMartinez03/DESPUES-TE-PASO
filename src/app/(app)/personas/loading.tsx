import { Skeleton } from "@/components/ui/skeleton"
import { PageHeaderSkeleton } from "@/components/shared/page-header-skeleton"

/**
 * `/personas`: header con acción (Agregar amigo) + lista de amigos. Las filas
 * copian la forma de `FriendCard` (avatar + nombre/@username + saldo + chevron)
 * para que la lista no salte al llegar los datos.
 */
export default function PersonasLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <PageHeaderSkeleton description action titleWidth="w-32" />

      <section className="space-y-3">
        <div className="w-20">
          <Skeleton className="h-4" />
        </div>
        <div className="flex flex-col gap-2">
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 rounded-xl border bg-card p-3"
            >
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="w-32">
                  <Skeleton className="h-4" />
                </div>
                <div className="w-20">
                  <Skeleton className="h-3" />
                </div>
                <div className="w-24">
                  <Skeleton className="h-3" />
                </div>
              </div>
              <Skeleton className="size-4 shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
