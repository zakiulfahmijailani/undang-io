import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    helperText?: string
    error?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, helperText, error, disabled, id, children, ...props }, ref) => {
        const generatedId = React.useId()
        const selectId = id || generatedId

        return (
            <div className="flex flex-col gap-1 w-full">
                {label && (
                    <label htmlFor={selectId} className={cn("text-label-sm sm:text-label-lg mb-1", error ? "text-[var(--color-error-base)]" : "text-[var(--color-neutral-700)]")}>
                        {label}
                        {props.required && <span className="text-[var(--color-error-base)] ml-1">*</span>}
                    </label>
                )}
                <div className="relative w-full">
                    <select
                        id={selectId}
                        disabled={disabled}
                        className={cn(
                            "flex w-full appearance-none rounded-md border text-body-md bg-[var(--color-surface-card)] px-3 py-2 transition-colors",
                            "border-[var(--color-neutral-300)] text-[var(--color-neutral-900)]",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary-500)] focus-visible:border-[var(--color-primary-500)]",
                            "disabled:cursor-not-allowed disabled:bg-[var(--color-neutral-100)] disabled:border-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-400)]",
                            error && "border-[var(--color-error-base)] focus-visible:ring-[var(--color-error-border)] focus-visible:border-[var(--color-error-base)]",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {children}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </div>
                {helperText && (
                    <p className={cn("text-caption mt-1", error ? "text-[var(--color-error-base)]" : "text-[var(--color-neutral-500)]")}>
                        {helperText}
                    </p>
                )}
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select }
