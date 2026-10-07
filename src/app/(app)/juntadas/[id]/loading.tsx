import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function JuntadaLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-1">
        <div className="w-16">
          <Skeleton className="h-4" />
        </div>
        <div className="w-48">
          <Skeleton className="h-8" />
        </div>
        <div className="w-40">
          <Skeleton className="h-4" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card size="sm" className="rounded-2xl">
          <CardContent className="space-y-3">
            <div className="w-20">
              <Skeleton className="h-4" />
            </div>
            <div className="w-28">
              <Skeleton className="h-7" />
            </div>
          </CardContent>
        </Card>
        <Card size="sm" className="rounded-2xl">
          <CardContent className="space-y-3">
            <div className="w-20">
              <Skeleton className="h-4" />
            </div>
            <div className="w-24">
              <Skeleton className="h-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="space-y-3">
          {[0, 1, 2, 3].map((row) => (
            <div key={row} className="flex items-center gap-3">
              <Skeleton className="size-7 rounded-full" />
              <div className="w-32">
                <Skeleton className="h-4" />
              </div>
              <div className="ml-auto w-16">
                <Skeleton className="h-4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="flex flex-wrap gap-2">
          {[0, 1, 2, 3].map((chip) => (
            <Skeleton key={chip} className="h-6 w-24 rounded-full" />
          ))}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {[0, 1, 2].map((item) => (
          <Card key={item} className="rounded-2xl">
            <CardContent className="space-y-2">
              <div className="w-44">
                <Skeleton className="h-4" />
              </div>
              <div className="w-24">
                <Skeleton className="h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}