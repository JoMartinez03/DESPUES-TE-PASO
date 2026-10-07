import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function PersonaLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-1">
        <div className="w-16">
          <Skeleton className="h-4" />
        </div>
        <div className="w-44">
          <Skeleton className="h-8" />
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="min-w-0 space-y-2">
            <div className="w-36">
              <Skeleton className="h-5" />
            </div>
            <div className="w-24">
              <Skeleton className="h-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="w-16">
              <Skeleton className="h-4" />
            </div>
            <div className="w-28">
              <Skeleton className="h-6" />
            </div>
          </div>
          <div className="w-20">
            <Skeleton className="h-5" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-10 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
      </div>

      <Card className="rounded-2xl">
        <CardContent className="space-y-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center justify-between gap-3">
              <div className="w-32">
                <Skeleton className="h-4" />
              </div>
              <div className="w-20">
                <Skeleton className="h-4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="space-y-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-start justify-between gap-3">
              <div className="w-40">
                <Skeleton className="h-4" />
              </div>
              <div className="w-16">
                <Skeleton className="h-4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}