import { Check } from "lucide-react"

import { PROGRESS_STEPS } from "@/lib/mahasiswa/progress"
import { cn } from "@/lib/utils"

interface ProgressTrackerProps {
  currentStep: number
}

export function ProgressTracker({ currentStep }: ProgressTrackerProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex min-w-[640px] items-center">
        {PROGRESS_STEPS.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step.key} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-colors",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-primary bg-background text-primary"
                        : "border-muted-foreground/30 bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "max-w-[80px] text-center text-xs",
                    isCurrent
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < PROGRESS_STEPS.length - 1 ? (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1",
                    index < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
