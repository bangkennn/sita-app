import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const sk = "animate-pulse bg-gray-200"

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <Skeleton className={cn(sk, "h-5 w-40 rounded-xl")} />
        <Skeleton className={cn(sk, "h-6 w-20 shrink-0 rounded-full")} />
      </div>
      <div className="mb-6 space-y-2">
        <Skeleton className={cn(sk, "h-4 w-full rounded-xl")} />
        <Skeleton className={cn(sk, "h-4 w-5/6 rounded-xl")} />
        <Skeleton className={cn(sk, "h-4 w-4/6 rounded-xl")} />
      </div>
      <Skeleton className={cn(sk, "h-10 w-32 rounded-xl")} />
    </div>
  )
}
