import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-body text-md transition-all duration-fast ease-out outline-none",
    {
        variants: {
            variant: {
                primary:
                    "bg-[var(--color-primary-500)] text-[var(--color-neutral-0)] shadow-[var(--shadow-gold)] hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)] active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-[var(--color-primary-300)] focus-visible:ring-offset-2 disabled:bg-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-400)] disabled:shadow-none hover:scale-[1.02] disabled:scale-100",
                secondary:
                    "bg-transparent border-[1.5px] border-[var(--color-neutral-300)] text-[var(--color-neutral-800)] hover:bg-[var(--color-neutral-50)] hover:border-[var(--color-neutral-400)] active:bg-[var(--color-neutral-100)] active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-[var(--color-neutral-300)] focus-visible:ring-offset-2 disabled:border-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-300)]",
                ghost:
                    "bg-transparent text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] active:bg-[var(--color-neutral-200)] active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-[var(--color-neutral-300)] disabled:text-[var(--color-neutral-400)]",
                destructive:
                    "bg-[var(--color-error-base)] text-[var(--color-neutral-0)] hover:bg-[var(--color-error-dark)] active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-[var(--color-error-border)] focus-visible:ring-offset-2",
            },
            size: {
                sm: "h-8 px-[14px] py-[8px] text-[14px]",
                md: "h-10 px-[18px] py-[10px] text-[16px]",
                lg: "h-12 px-[24px] py-[12px] text-[16px]",
                xl: "h-14 px-[28px] py-[14px] text-[18px]",
            },
            fullWidth: {
                true: "w-full",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
            fullWidth: false,
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
    loadingText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, asChild = false, isLoading, loadingText, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        const isDisabled = disabled || isLoading

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                disabled={isDisabled}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        {loadingText ? loadingText : null}
                    </>
                ) : (
                    <>
                        {leftIcon}
                        {children}
                        {rightIcon}
                    </>
                )}
            </Comp>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
