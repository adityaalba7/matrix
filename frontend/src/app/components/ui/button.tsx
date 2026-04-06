import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-primary-bg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans tracking-wide active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-surface text-text-primary border border-border-default hover:bg-elevated hover:border-border-hover",
        primary: "bg-teal text-primary-bg hover:opacity-90 font-semibold shadow-[0_0_16px_-4px_rgba(0,212,170,0.5)]",
        secondary: "bg-elevated text-text-primary hover:bg-surface border border-transparent hover:border-border-default",
        danger: "bg-rose/10 text-rose border border-rose/20 hover:bg-rose/20 hover:border-rose/40",
        ghost: "hover:bg-surface hover:text-text-primary",
        link: "text-text-secondary underline-offset-4 hover:underline",
        saffron: "bg-saffron text-primary-bg hover:opacity-90 font-semibold shadow-[0_0_16px_-4px_rgba(255,122,26,0.5)]",
        violet: "bg-violet text-primary-bg hover:opacity-90 font-semibold shadow-[0_0_16px_-4px_rgba(123,97,255,0.5)]",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-12 w-12",
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
