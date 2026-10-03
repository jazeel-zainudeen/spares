import { Skeleton } from "@/components/ui/Skeleton"
import { Card, CardContent } from "@/components/ui/Card"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl animate-in fade-in duration-500">
      {/* Navigation Breadcrumb Skeleton */}
      <div className="mb-6 space-y-3">
        <Skeleton className="h-4 w-3/4 max-w-sm" />
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Image Gallery Skeleton */}
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <Skeleton className="h-[350px] sm:h-[450px] w-full rounded-xl" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <Skeleton className="h-16 w-16 rounded-md" />
              <Skeleton className="h-16 w-16 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Details & Specs Skeleton */}
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div className="w-full">
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-8 sm:h-10 w-full max-w-md" />
            </div>
            <Skeleton className="h-9 w-24 rounded-md shrink-0" />
          </div>

          <Card>
            <CardContent className="p-4 sm:p-5 space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between border-b border-border/60 pb-4 last:border-0 last:pb-0">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-24 rounded-sm" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
