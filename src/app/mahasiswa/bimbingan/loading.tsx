import { Skeleton } from "@/components/ui/skeleton"
import { BabCardSkeleton } from "@/components/ui/skeletons"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function MahasiswaBimbinganLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <Skeleton className={`${sk} h-7 w-64`} />
          <Skeleton className={`${sk} h-4 w-48`} />
          <Skeleton className={`${sk} h-6 w-24 rounded-full`} />
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Skeleton className={`${sk} mb-6 h-6 w-32`} />
        <div className="mb-8 flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={`${sk} h-2 flex-1 rounded-full`} />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <BabCardSkeleton />
        <BabCardSkeleton />
        <BabCardSkeleton />
      </div>
    </div>
  )
}
