import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-[#2C5EAD]/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#2C5EAD] text-white hover:bg-[#1E4080] focus-visible:ring-[#2C5EAD]/30",
        secondary:
          "bg-[#EEF3FB] text-[#2C5EAD] hover:bg-[#dde8f7]",
        outline:
          "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
        success:
          "border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
        destructive:
          "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
        ghost: "text-gray-600 hover:bg-gray-50",
        link: "text-[#2C5EAD] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-4",
        sm: "h-8 gap-1 rounded-lg px-3 text-[0.8rem]",
        lg: "h-11 gap-2 px-5 text-base",
        icon: "size-10",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
