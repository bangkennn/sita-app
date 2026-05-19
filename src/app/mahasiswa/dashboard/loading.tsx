import { Skeleton } from "@/components/ui/skeleton"
import { StatCardSkeleton, WelcomeBannerSkeleton } from "@/components/ui/skeletons"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function MahasiswaDashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <WelcomeBannerSkeleton />
      <StatCardSkeleton />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Skeleton className={`${sk} mb-6 h-6 w-40`} />
        <div className="flex items-center gap-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <Skeleton className={`${sk} h-8 w-8 rounded-full`} />
              <Skeleton className={`${sk} h-3 w-16`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
