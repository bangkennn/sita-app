import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const sk = "animate-pulse bg-gray-200"

export function DokumenCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className={cn(sk, "h-5 w-28 rounded-xl")} />
          <Skeleton className={cn(sk, "h-4 w-48 rounded-xl")} />
        </div>
        <Skeleton className={cn(sk, "h-6 w-24 shrink-0 rounded-full")} />
      </div>
      <div className="mb-4 space-y-2">
        <Skeleton className={cn(sk, "h-4 w-full rounded-xl")} />
        <Skeleton className={cn(sk, "h-4 w-4/5 rounded-xl")} />
        <Skeleton className={cn(sk, "h-4 w-3/5 rounded-xl")} />
      </div>
      <div className="mb-4 rounded-2xl bg-gray-50 p-4">
        <Skeleton className={cn(sk, "ml-auto h-12 w-4/5 rounded-2xl rounded-tl-none")} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className={cn(sk, "h-9 w-28 rounded-xl")} />
        <Skeleton className={cn(sk, "h-9 w-24 rounded-xl")} />
        <Skeleton className={cn(sk, "h-9 w-20 rounded-xl")} />
        <Skeleton className={cn(sk, "h-9 w-24 rounded-xl")} />
      </div>
    </div>
  )
}
