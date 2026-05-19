import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const gradients = [
  "from-indigo-500 to-indigo-700",
  "from-cyan-500 to-cyan-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-600",
] as const

interface GradientStatCardProps {
  title: string
  value: number | string
  description?: string
  icon: LucideIcon
  index?: number
  className?: string
}

export function GradientStatCard({
  title,
  value,
  description,
  icon: Icon,
  index = 0,
  className,
}: GradientStatCardProps) {
  const gradient = gradients[index % gradients.length]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br p-6 text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5",
        gradient,
        className
      )}
    >
      <div className="pattern-dots pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/90">{title}</p>
          <p className="text-4xl font-bold tracking-tight">{value}</p>
          {description ? (
            <p className="text-xs text-white/75">{description}</p>
          ) : null}
        </div>
        <div className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  )
}
