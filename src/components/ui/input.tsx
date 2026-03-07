import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    helperText?: string
    error?: boolean
    success?: boolean
    leftAdornment?: React.ReactNode
    rightAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", label, helperText, error, success, leftAdornment, rightAdornment, disabled, id, ...props }, ref) => {
        const generatedId = React.useId()
        const inputId = id || generatedId

        return (
            <div className="flex flex-col gap-1 w-full">
                {label && (
                    <label htmlFor={inputId} className={cn("text-label-sm sm:text-label-lg mb-1", error ? "text-[var(--color-error-base)]" : "text-[var(--color-neutral-700)]")}>
                        {label}
                        {props.required && <span className="text-[var(--color-error-base)] ml-1">*</span>}
                    </label>
                )}
                <div className="relative w-full">
                    {leftAdornment && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)]">
                            {leftAdornment}
                        </div>
                    )}
                    <input
                        id={inputId}
                        type={type}
                        disabled={disabled}
                        className={cn(
                            "flex w-full rounded-md border text-body-md transition-colors bg-[var(--color-surface-card)] px-3 py-2",
                            "border-[var(--color-neutral-300)] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-400)]",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary-500)] focus-visible:border-[var(--color-primary-500)]",
                            "disabled:cursor-not-allowed disabled:bg-[var(--color-neutral-100)] disabled:border-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-400)]",
                            error && "border-[var(--color-error-base)] focus-visible:ring-[var(--color-error-border)] focus-visible:border-[var(--color-error-base)] pr-10",
                            success && "border-[var(--color-success-base)] focus-visible:ring-[var(--color-success-border)] focus-visible:border-[var(--color-success-base)] pr-10",
                            leftAdornment && "pl-10",
                            rightAdornment && "pr-10",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {!rightAdornment && error && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-error-base)]">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                    )}
                    {!rightAdornment && success && !error && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-success-base)]">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    )}
                    {rightAdornment && !error && !success && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-500)]">
                            {rightAdornment}
                        </div>
                    )}
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
Input.displayName = "Input"

export { Input }
