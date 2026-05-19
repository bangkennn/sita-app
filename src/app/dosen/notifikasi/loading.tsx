import { Skeleton } from "@/components/ui/skeleton"
import { NotifikasiSkeleton } from "@/components/ui/skeletons"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function DosenNotifikasiLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className={`${sk} h-8 w-32`} />
        <Skeleton className={`${sk} h-9 w-40`} />
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <NotifikasiSkeleton />
      </div>
    </div>
  )
}
