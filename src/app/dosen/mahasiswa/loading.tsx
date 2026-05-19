import { Skeleton } from "@/components/ui/skeleton"
import { CardSkeleton } from "@/components/ui/skeletons"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function DosenMahasiswaLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className={`${sk} h-8 w-48`} />
      <div className="space-y-4">
        <Skeleton className={`${sk} h-5 w-32`} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className={`${sk} h-5 w-40`} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </div>
  )
}
