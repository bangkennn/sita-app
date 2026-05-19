import { cn } from "@/lib/utils"

export interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  meta?: string
  badge?: React.ReactNode
}

interface ActivityTimelineProps {
  items: TimelineItem[]
  emptyMessage?: string
  className?: string
}

export function ActivityTimeline({
  items,
  emptyMessage = "Belum ada aktivitas.",
  className,
}: ActivityTimelineProps) {
  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <ol className={cn("relative space-y-0", className)}>
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
          {index < items.length - 1 ? (
            <span
              className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 bg-[#2C5EAD]/20"
              aria-hidden
            />
          ) : null}
          <span className="relative z-10 mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#2C5EAD] ring-4 ring-white">
            <span className="size-2 rounded-full bg-white" />
          </span>
          <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-slate-800">{item.title}</p>
                {item.subtitle ? (
                  <p className="mt-0.5 text-sm text-slate-500">{item.subtitle}</p>
                ) : null}
              </div>
              {item.badge}
            </div>
            {item.meta ? (
              <p className="mt-2 text-xs text-slate-400">{item.meta}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
