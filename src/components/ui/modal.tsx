"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
// Note: For MVP we use a simple native dialog. In a full production app you might use Radix Dialog.

export interface ModalProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
}

const Modal = React.forwardRef<HTMLDialogElement, ModalProps>(
    ({ className, isOpen, onClose, title, description, children, ...props }, ref) => {
        const dialogRef = React.useRef<HTMLDialogElement>(null)

        React.useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement)

        React.useEffect(() => {
            const dialog = dialogRef.current
            if (!dialog) return

            if (isOpen) {
                if (!dialog.open) dialog.showModal()
            } else {
                if (dialog.open) dialog.close()
            }
        }, [isOpen])

        const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
            // Close when clicking directly on the backdrop (dialog padding box)
            if (e.target === dialogRef.current) {
                onClose()
            }
        }

        return (
            <dialog
                ref={dialogRef}
                onClick={handleBackdropClick}
                onClose={onClose}
                className={cn(
                    "backdrop:bg-[var(--color-surface-overlay)] backdrop:backdrop-blur-sm",
                    "w-full max-w-lg rounded-[var(--radius-2xl)] bg-[var(--color-surface-card)] p-0 text-[var(--color-neutral-900)] shadow-[var(--shadow-3)]",
                    "open:animate-in open:fade-in-90 open:zoom-in-95",
                    className
                )}
                {...props}
            >
                <div className="flex flex-col gap-4 p-6">
                    <div className="flex flex-col gap-1.5 focus:outline-none">
                        <div className="flex items-center justify-between">
                            {title && <h2 className="text-h4 font-display font-semibold">{title}</h2>}
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full p-1 transition-colors hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-neutral-300)]"
                            >
                                <X className="h-5 w-5 text-[var(--color-neutral-500)]" />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>
                        {description && (
                            <p className="text-body-sm text-[var(--color-neutral-500)]">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="focus:outline-none">
                        {children}
                    </div>
                </div>
            </dialog>
        )
    }
)
Modal.displayName = "Modal"

export { Modal }
