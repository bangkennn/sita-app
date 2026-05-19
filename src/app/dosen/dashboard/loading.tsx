import { Skeleton } from "@/components/ui/skeleton"
import {
  CardSkeleton,
  NotifikasiSkeleton,
  StatCardSkeleton,
  WelcomeBannerSkeleton,
} from "@/components/ui/skeletons"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function DosenDashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <WelcomeBannerSkeleton />
      <StatCardSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <Skeleton className={`${sk} mb-4 h-6 w-40`} />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-4 py-3">
            <Skeleton className={`${sk} h-6 w-36`} />
          </div>
          <NotifikasiSkeleton />
        </div>
      </div>
    </div>
  )
}
