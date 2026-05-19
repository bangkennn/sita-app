import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const sk = "animate-pulse bg-gray-200"

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between">
            <Skeleton className={cn(sk, "size-12 rounded-2xl")} />
            <Skeleton className={cn(sk, "h-5 w-14 rounded-full")} />
          </div>
          <Skeleton className={cn(sk, "mb-2 h-9 w-20 rounded-xl")} />
          <Skeleton className={cn(sk, "h-4 w-28 rounded-xl")} />
        </div>
      ))}
    </div>
  )
}
