import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const sk = "animate-pulse bg-gray-200"

interface NotifikasiSkeletonProps {
  rows?: number
  className?: string
}

export function NotifikasiSkeleton({
  rows = 5,
  className,
}: NotifikasiSkeletonProps) {
  return (
    <ul className={cn("divide-y divide-gray-100", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-start gap-4 bg-white p-4">
          <Skeleton className={cn(sk, "size-10 shrink-0 rounded-full")} />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className={cn(sk, "h-4 w-full rounded-xl")} />
            <Skeleton className={cn(sk, "h-3 w-24 rounded-xl")} />
          </div>
        </li>
      ))}
    </ul>
  )
}
