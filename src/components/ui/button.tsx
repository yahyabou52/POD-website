import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-luxury",
  {
    variants: {
      variant: {
        default: "bg-primary text-text-on-primary hover:bg-primary-dark hover:shadow-gold-glow hover:-translate-y-0.5",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-lg",
        outline:
          "border-2 border-border text-text-primary hover:bg-primary/10 bg-surface",
        secondary:
          "bg-background text-text-primary hover:bg-primary hover:text-text-on-primary border border-border",
        ghost: "hover:bg-background text-text-primary shadow-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
        gold: "bg-primary text-text-on-primary hover:bg-primary-dark hover:shadow-gold-glow font-bold",
        carbon: "bg-secondary text-white border-2 border-primary hover:bg-primary hover:text-text-on-primary",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }