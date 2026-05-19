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
        "relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-6 text-white shadow-lg",
        className
      )}
    >
      <div className="pattern-dots absolute inset-0 opacity-30" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <span className="inline-flex rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold backdrop-blur-sm">
            {roleLabel}
          </span>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Halo, {name}! 👋
          </h1>
          {description ? (
            <p className="max-w-xl text-sm text-white/85">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  )
}
