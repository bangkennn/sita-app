import { Skeleton } from "@/components/ui/skeleton"
import { DokumenCardSkeleton } from "@/components/ui/skeletons"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function DosenPengajuanDetailLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className={`${sk} h-7 w-48`} />
            <Skeleton className={`${sk} h-4 w-32`} />
            <Skeleton className={`${sk} h-5 w-64`} />
          </div>
          <Skeleton className={`${sk} h-6 w-20 rounded-full`} />
        </div>
      </div>
      <Skeleton className={`${sk} h-6 w-40`} />
      <div className="space-y-4">
        <DokumenCardSkeleton />
        <DokumenCardSkeleton />
        <DokumenCardSkeleton />
      </div>
    </div>
  )
}
