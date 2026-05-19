import { cn } from "@/lib/utils"

export function WelcomeBannerSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-32 w-full animate-pulse rounded-2xl bg-gray-200",
        className
      )}
      aria-hidden
    />
  )
}
