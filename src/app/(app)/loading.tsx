import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function AppLoading() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="space-y-1">
        <div className="w-24">
          <Skeleton className="h-4" />
        </div>
        <div className="w-56">
          <Skeleton className="h-8" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item} size="sm" className="rounded-2xl">
            <CardContent className="space-y-3">
              <div className="w-20">
                <Skeleton className="h-4" />
              </div>
              <div className="w-28">
                <Skeleton className="h-7" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <Skeleton className="size-11 rounded-full" />
          <div className="w-40">
            <Skeleton className="h-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}