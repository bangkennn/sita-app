import { Skeleton } from "@/components/ui/skeleton"
import { TableSkeleton } from "@/components/ui/skeletons"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function AdminMonitoringLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className={`${sk} h-8 w-48`} />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <TableSkeleton rows={8} cols={6} />
      </div>
    </div>
  )
}
