import { Skeleton } from "@/components/ui/skeleton"

const sk = "animate-pulse bg-gray-200 rounded-xl"

export default function MahasiswaPengajuanLoading() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className={`${sk} h-8 w-48`} />
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-8 flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className={`${sk} h-8 w-8 rounded-full`} />
              <Skeleton className={`${sk} h-4 w-20`} />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className={`${sk} h-40 w-full`} />
          <Skeleton className={`${sk} h-10 w-full`} />
        </div>
      </div>
    </div>
  )
}
