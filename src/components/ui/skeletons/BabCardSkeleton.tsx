import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const sk = "animate-pulse bg-gray-200"

export function BabCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 border-l-4 border-l-gray-200 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className={cn(sk, "h-5 w-24 rounded-xl")} />
        <Skeleton className={cn(sk, "h-6 w-28 rounded-full")} />
      </div>
      <div className="mb-4 space-y-2">
        <Skeleton className={cn(sk, "h-4 w-full rounded-xl")} />
        <Skeleton className={cn(sk, "h-3 w-2/3 rounded-xl")} />
      </div>
      <div className="flex gap-2">
        <Skeleton className={cn(sk, "h-9 flex-1 rounded-xl")} />
        <Skeleton className={cn(sk, "h-9 w-24 rounded-xl")} />
      </div>
    </div>
  )
}
