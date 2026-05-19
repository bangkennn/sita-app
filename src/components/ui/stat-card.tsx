import type { LucideIcon } from "lucide-react"
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: { value: string; positive?: boolean }
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <ArrowUpRight className="absolute top-5 right-5 size-5 text-gray-300" />
      <div className="flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#EEF3FB]">
          <Icon className="size-6 text-[#2C5EAD]" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-sm text-gray-500">{title}</p>
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                trend.positive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              )}
            >
              {trend.positive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {trend.value}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
