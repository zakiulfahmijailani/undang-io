import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, disabled, id, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-semibold",
              error ? "text-[var(--color-error-base)]" : "text-[var(--color-neutral-700)]"
            )}
          >
            {label}
            {props.required && <span className="text-[var(--color-error-base)] ml-1">*</span>}
          </label>
        )}
        <div className="relative w-full">
          <textarea
            id={textareaId}
            disabled={disabled}
            className={cn(
              "flex min-h-[100px] w-full rounded-md border text-sm bg-[var(--color-surface-card)] px-3 py-2.5 transition-all duration-150 resize-y",
              "border-[var(--color-neutral-300)] text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-400)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-300)] focus-visible:border-[var(--color-primary-500)]",
              "disabled:cursor-not-allowed disabled:bg-[var(--color-neutral-100)] disabled:border-[var(--color-neutral-200)] disabled:text-[var(--color-neutral-400)] disabled:resize-none",
              error && "border-[var(--color-error-base)] focus-visible:ring-[var(--color-error-border)] focus-visible:border-[var(--color-error-base)]",
              className
            )}
            ref={ref}
            {...props}
          />
          {error && (
            <div className="absolute right-3 top-3 text-[var(--color-error-base)] pointer-events-none">
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
Textarea.displayName = "Textarea"

export { Textarea }
