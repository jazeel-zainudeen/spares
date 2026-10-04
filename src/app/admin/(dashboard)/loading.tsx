import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Skeleton } from "@/components/ui/Skeleton"
import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your spare parts catalog and system activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-full">
            <CardHeader className="flex flex-row items-start sm:items-center justify-between gap-2 p-4 pb-2 sm:p-6 sm:pb-2">
              <Skeleton className="h-4 w-20 sm:w-24" />
              <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-md" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <Skeleton className="h-7 w-12 sm:h-8 sm:w-16 mb-2" />
              <Skeleton className="h-3 w-full max-w-[120px] sm:max-w-[140px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recently Added Parts</CardTitle>
            <CardDescription>Latest additions to your catalog inventory</CardDescription>
          </div>
          <Button variant="ghost" size="sm" disabled className="gap-1 text-primary">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-3">
                  <Skeleton className="h-11 w-11 shrink-0 rounded-md" />
                  <div className="min-w-0">
                    <Skeleton className="h-4 w-32 sm:w-48 mb-2" />
                    <Skeleton className="h-3 w-40 sm:w-64" />
                  </div>
                </div>
                <Skeleton className="shrink-0 h-3 w-16 sm:w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
