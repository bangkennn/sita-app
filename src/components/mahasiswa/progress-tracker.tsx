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
                    "flex size-10 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    isCompleted
                      ? "bg-[#2C5EAD] text-white"
                      : isCurrent
                        ? "animate-step-pulse bg-[#2C5EAD] text-white ring-4 ring-[#2C5EAD]/20"
                        : "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? <Check className="size-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "max-w-[80px] text-center text-xs",
                    isCurrent
                      ? "font-semibold text-[#2C5EAD]"
                      : isCompleted
                        ? "font-medium text-gray-700"
                        : "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < PROGRESS_STEPS.length - 1 ? (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full",
                    index < currentStep ? "bg-[#2C5EAD]" : "bg-gray-200"
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
