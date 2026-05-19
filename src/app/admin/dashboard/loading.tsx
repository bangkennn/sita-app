import { Skeleton } from "@/components/ui/skeleton"
import {
  StatCardSkeleton,
  TableSkeleton,
  WelcomeBannerSkeleton,
} from "@/components/ui/skeletons"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <WelcomeBannerSkeleton />
      <StatCardSkeleton />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <Skeleton className={`${sk} mb-4 h-6 w-48`} />
        <TableSkeleton rows={5} cols={5} />
      </div>
    </div>
  )
}
