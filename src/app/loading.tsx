import { Skeleton } from "@/components/ui/Skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
      <div className="w-full max-w-4xl space-y-4 text-center">
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        <Skeleton className="h-12 sm:h-16 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-6 w-full max-w-xl mx-auto" />
      </div>
      <div className="w-full max-w-4xl">
        <Skeleton className="h-[250px] w-full rounded-xl" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
    </div>
  )
}
