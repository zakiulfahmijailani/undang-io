import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

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
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "text-[11px] font-bold tracking-widest uppercase mb-1",
              error ? "text-[var(--color-error-base)]" : "text-[var(--color-landing-muted)]"
            )}
          >
            {label}
            {props.required && <span className="text-[var(--color-error-base)] ml-1">*</span>}
          </label>
        )}
        <div className="relative w-full">
          <select
            id={selectId}
            disabled={disabled}
            className={cn(
              "flex w-full appearance-none rounded-full border text-sm bg-[var(--color-landing-paper)] px-4 py-2.5 pr-10 transition-all duration-150",
              "border-[var(--color-landing-border)] text-[var(--color-neutral-900)] shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-landing-gold)] focus-visible:border-[var(--color-landing-gold)]",
              "disabled:cursor-not-allowed disabled:bg-[var(--color-neutral-100)] disabled:border-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-400)]",
              error && "border-[var(--color-error-base)] focus-visible:ring-[var(--color-error-border)] focus-visible:border-[var(--color-error-base)]",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          {/* Chevron icon */}
          {!error && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          )}
          {/* Error icon */}
          {error && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-error-base)]">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        {helperText && (
          <p className={cn(
            "text-xs mt-0.5",
            error ? "text-[var(--color-error-base)]" : "text-[var(--color-neutral-500)]"
          )}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
