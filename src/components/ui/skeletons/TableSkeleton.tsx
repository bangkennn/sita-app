import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const sk = "animate-pulse bg-gray-200"

interface TableSkeletonProps {
  rows?: number
  cols?: number
  className?: string
}

export function TableSkeleton({
  rows = 5,
  cols = 4,
  className,
}: TableSkeletonProps) {
  const colWidths = ["w-32", "w-24", "w-28", "w-20", "w-16", "w-24"]

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-100",
        className
      )}
    >
      <div className="flex gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(sk, "h-3 flex-1 rounded-xl", i === 0 && "max-w-[140px]")}
          />
        ))}
      </div>
      <ul className="divide-y divide-gray-100 bg-white">
        {Array.from({ length: rows }).map((_, row) => (
          <li
            key={row}
            className="flex flex-wrap items-center gap-4 px-4 py-4"
          >
            <div className="flex min-w-[180px] flex-1 items-center gap-3">
              <Skeleton className={cn(sk, "size-10 shrink-0 rounded-full")} />
              <div className="space-y-2">
                <Skeleton className={cn(sk, "h-4 w-32 rounded-xl")} />
                <Skeleton className={cn(sk, "h-3 w-20 rounded-xl")} />
              </div>
            </div>
            {Array.from({ length: Math.max(0, cols - 1) }).map((_, col) => (
              <Skeleton
                key={col}
                className={cn(
                  sk,
                  "hidden h-4 rounded-xl sm:block",
                  colWidths[col % colWidths.length]
                )}
              />
            ))}
            <div className="ml-auto flex items-center gap-2">
              <Skeleton className={cn(sk, "h-6 w-16 rounded-full")} />
              <Skeleton className={cn(sk, "h-4 w-12 rounded-xl")} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
