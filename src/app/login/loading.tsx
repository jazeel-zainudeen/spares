import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft } from "lucide-react";

export default function LoginLoading() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <header className="w-full px-4 sm:px-6 py-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl" />
          <Skeleton className="h-6 w-32 hidden sm:block" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-muted/50 border border-border">
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Skeleton className="h-4 w-24" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10 w-full max-w-md mx-auto mt-[-5vh]">
        <div className="w-full">
          <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
            <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl mb-4" />
            <Skeleton className="h-8 sm:h-9 w-48 mb-2" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>

          <div className="bg-card border border-border p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl mt-4" />
          </div>
        </div>
      </main>

      <footer className="w-full py-6 flex justify-center z-20">
        <Skeleton className="h-3 w-48" />
      </footer>
    </div>
  );
}
