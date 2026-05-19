import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  emoji?: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
}

export function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center",
        className
      )}
    >
      {emoji ? (
        <span className="text-5xl" role="img" aria-hidden>
          {emoji}
        </span>
      ) : Icon ? (
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100">
          <Icon className="size-7 text-indigo-600" />
        </div>
      ) : null}
      <div className="space-y-1 px-4">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="max-w-sm text-sm text-slate-500">{description}</p>
      </div>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="btn-gradient">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
