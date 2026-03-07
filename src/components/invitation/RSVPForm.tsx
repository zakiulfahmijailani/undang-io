"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { CheckCircle2, Loader2 } from "lucide-react"

export function RSVPForm({ invitationId }: { invitationId: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setStatus("loading")
        // Mock API Submission
        await new Promise(r => setTimeout(r, 1000))
        setStatus("success")
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center text-center p-6 bg-[var(--color-success-light)] rounded-xl border border-[var(--color-success-border)]">
                <CheckCircle2 className="w-12 h-12 text-[var(--color-success-base)] mb-4" />
                <h4 className="text-h4 font-semibold text-[var(--color-success-dark)] mb-2">Terima Kasih!</h4>
                <p className="text-body-sm text-[var(--color-success-dark)]">Konfirmasi kehadiran Anda telah berhasil dikirim.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Nama Lengkap" placeholder="Masukkan nama Anda" required disabled={status === "loading"} />
            <Select label="Kehadiran" required disabled={status === "loading"}>
                <option value="">Konfirmasi Kehadiran</option>
                <option value="hadir">Ya, Saya Akan Hadir</option>
                <option value="tidak_hadir">Maaf, Saya Tidak Bisa Hadir</option>
            </Select>
            <Select label="Jumlah Orang" required disabled={status === "loading"}>
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
                <option value="3">3 Orang</option>
                <option value="4">4 Orang</option>
            </Select>
            <div className="flex flex-col gap-1 w-full">
                <label className="text-label-sm sm:text-label-lg mb-1 text-[var(--color-neutral-700)]">Pesan Tambahan (Opsional)</label>
                <textarea
                    disabled={status === "loading"}
                    className="w-full rounded-md border text-body-md bg-[var(--color-surface-card)] px-3 py-2 border-[var(--color-neutral-300)] min-h-[80px] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed"
                    placeholder="Informasi tambahan untuk kami"
                />
            </div>
            <Button type="submit" variant="primary" fullWidth isLoading={status === "loading"} loadingText="Mengirim...">
                Kirim RSVP
            </Button>
        </form>
    )
}
