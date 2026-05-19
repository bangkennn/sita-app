import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface WelcomeBannerProps {
  name: string
  roleLabel: string
  description?: string
  className?: string
  children?: ReactNode
}

export function WelcomeBanner({
  name,
  roleLabel,
  description,
  className,
  children,
}: WelcomeBannerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-welcome p-6 text-white shadow-sm",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 right-24 size-40 rounded-full bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 right-1/3 size-20 rounded-full bg-white/5"
        aria-hidden
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-3 py-0.5 text-xs font-semibold">
            {roleLabel}
          </span>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Halo, {name}
          </h2>
          {description ? (
            <p className="max-w-xl text-sm text-white/85">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  )
}
