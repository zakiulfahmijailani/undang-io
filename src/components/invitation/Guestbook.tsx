"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageSquare, Heart } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface GuestbookEntry {
    id: string
    guest_name: string
    message: string
    created_at: string
}

export function Guestbook({ invitationId, initialEntries = [] }: { invitationId: string, initialEntries?: GuestbookEntry[] }) {
    const [entries, setEntries] = useState<GuestbookEntry[]>(initialEntries)
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!name.trim() || !message.trim()) return

        setIsSubmitting(true)

        // Mock API Submission
        await new Promise(r => setTimeout(r, 800))

        const newEntry: GuestbookEntry = {
            id: Math.random().toString(),
            guest_name: name,
            message: message,
            created_at: new Date().toISOString()
        }

        setEntries([newEntry, ...entries])
        setName("")
        setMessage("")
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-[var(--theme-bg-alt)] rounded-xl p-6 shadow-sm border border-[var(--theme-border)]">
                <h3 className="text-h4 font-display font-bold mb-4 flex items-center gap-2 text-[var(--theme-text)]">
                    <MessageSquare className="w-5 h-5 text-[var(--theme-primary)]" />
                    Kirim Ucapan & Doa
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        placeholder="Nama Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <textarea
                        className="w-full rounded-md border text-body-md bg-[var(--color-surface-card)] px-3 py-2 border-[var(--color-neutral-300)] min-h-[100px] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)] disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed"
                        placeholder="Tuliskan ucapan pernikahan dan doa untuk kedua mempelai..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={isSubmitting}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="self-end !bg-[var(--theme-primary)] !text-[var(--theme-bg)]"
                        isLoading={isSubmitting}
                        loadingText="Mengirim..."
                    >
                        Kirim Ucapan
                    </Button>
                </form>
            </div>

            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                <h4 className="font-semibold text-[var(--theme-text)] flex justify-between items-center">
                    <span>{entries.length} Ucapan</span>
                </h4>
                {entries.length === 0 ? (
                    <div className="text-center py-8 text-[var(--theme-text-muted)] italic">
                        Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
                    </div>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} className="bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-lg p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div className="font-semibold text-body-md text-[var(--theme-text)]">{entry.guest_name}</div>
                                <div className="text-caption text-[var(--theme-text-muted)]">
                                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: id })}
                                </div>
                            </div>
                            <p className="text-body-sm text-[var(--theme-text-muted)] leading-relaxed">
                                {entry.message}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
