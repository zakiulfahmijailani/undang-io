import * as React from "react"
import { cn } from "@/lib/utils"

export const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h1 ref={ref} className={cn("text-h1 font-display text-[var(--color-neutral-900)]", className)} {...props} />
    )
)
H1.displayName = "H1"

export const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h2 ref={ref} className={cn("text-h2 font-display text-[var(--color-neutral-900)]", className)} {...props} />
    )
)
H2.displayName = "H2"

export const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3 ref={ref} className={cn("text-h3 font-display text-[var(--color-neutral-900)]", className)} {...props} />
    )
)
H3.displayName = "H3"

export const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h4 ref={ref} className={cn("text-h4 font-body font-semibold text-[var(--color-neutral-900)]", className)} {...props} />
    )
)
H4.displayName = "H4"

export const Text = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & { variant?: 'lg' | 'md' | 'sm' | 'xs', muted?: boolean }>(
    ({ className, variant = 'md', muted = false, ...props }, ref) => {
        const sizeClass = {
            lg: "text-body-lg",
            md: "text-body-md",
            sm: "text-body-sm",
            xs: "text-body-xs",
        }[variant]

        return (
            <p
                ref={ref}
                className={cn(
                    sizeClass,
                    "font-body",
                    muted ? "text-[var(--color-neutral-500)]" : "text-[var(--color-neutral-700)]",
                    className
                )}
                {...props}
            />
        )
    }
)
Text.displayName = "Text"
