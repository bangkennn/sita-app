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
                    "flex size-10 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300",
                    isCompleted
                      ? "border-emerald-500 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/30"
                      : isCurrent
                        ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/30"
                        : "border-slate-200 bg-slate-100 text-slate-400"
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
                      ? "font-semibold text-indigo-600"
                      : isCompleted
                        ? "font-medium text-emerald-600"
                        : "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < PROGRESS_STEPS.length - 1 ? (
                <div
                  className={cn(
                    "mx-1 h-1 flex-1 rounded-full",
                    index < currentStep
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      : "bg-slate-200"
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
