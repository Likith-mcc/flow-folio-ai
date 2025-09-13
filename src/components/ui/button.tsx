import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-primary-foreground shadow-card hover:shadow-glow hover:scale-105 transition-bounce",
        hero:
          "bg-gradient-hero text-primary-foreground shadow-elegant hover:shadow-glow hover:scale-105 transition-bounce animate-glow",
        success:
          "bg-gradient-success text-success-foreground shadow-card hover:shadow-glow hover:scale-105 transition-bounce",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:scale-105 transition-bounce",
        outline:
          "border-2 border-primary bg-gradient-card text-primary shadow-card hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-bounce",
        secondary:
          "bg-secondary text-secondary-foreground shadow-card hover:bg-secondary/80 hover:scale-105 transition-bounce",
        accent:
          "bg-accent text-accent-foreground shadow-card hover:bg-accent/90 hover:scale-105 transition-bounce",
        ghost: 
          "hover:bg-card-hover hover:text-foreground transition-smooth",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
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