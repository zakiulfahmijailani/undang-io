"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";

export default function NewInvitationDialog({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [groomName, setGroomName] = useState("");
    const [brideName, setBrideName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!groomName.trim() || !brideName.trim()) {
            setError("Kedua nama mempelai wajib diisi.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groom_name: groomName, bride_name: brideName }),
            });

            const result = await response.json();

            if (!response.ok) {
                // If the error message comes from our standard envelope format
                throw new Error(result.error?.message || "Terjadi kesalahan saat membuat undangan.");
            }

            // Success! Close modal and navigate
            setOpen(false);

            // Toasts could be added here if you have a toast library like Sonner configured.
            // toast.success("Undangan berhasil dibuat! Silakan lengkapi informasi undanganmu.");
            alert("Undangan berhasil dibuat! Silakan lengkapi informasi undanganmu."); // Temporary fallback

            router.push(`/dashboard/undangan/${result.data.id}/edit`);
        } catch (err: any) {
            setError(err.message || "Gagal menghubungi server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div onClick={() => setOpen(true)}>
                {children ? children : (
                    <button className="flex items-center gap-3 h-12 px-8 rounded-full bg-primary-stitch text-white shadow-xl shadow-primary-stitch/20 hover:scale-105 hover:rotate-1 transition-all active:scale-95 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Plus className="w-5 h-5" /> Initiate Creation
                    </button>
                )}
            </div>

            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Mulai Buat Undangan"
                description="Masukkan nama panggilan kedua mempelai. Kamu bisa mengubahnya nanti."
            >
                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    <div className="space-y-4">
                        <Input
                            id="groom_name"
                            label="Nama Mempelai Pria"
                            placeholder="Cth: Budi"
                            value={groomName}
                            onChange={(e) => setGroomName(e.target.value)}
                            disabled={isLoading}
                            maxLength={100}
                            required
                        />
                        <Input
                            id="bride_name"
                            label="Nama Mempelai Wanita"
                            placeholder="Cth: Ani"
                            value={brideName}
                            onChange={(e) => setBrideName(e.target.value)}
                            disabled={isLoading}
                            maxLength={100}
                            required
                        />
                        {error && (
                            <p className="text-sm text-[var(--color-error-base)] font-medium">{error}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                            className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-secondary-stitch/60 hover:bg-surface-container-low-stitch transition-all"
                        >
                            Abandone
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 rounded-full bg-primary-stitch text-white shadow-xl shadow-primary-stitch/20 hover:scale-105 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Synchronizing...
                                </>
                            ) : (
                                "Generate Portfolio"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
