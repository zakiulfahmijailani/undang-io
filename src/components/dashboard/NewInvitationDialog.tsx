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
                    <Button variant="primary" className="gap-2 h-11 px-6 shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5" /> Buat Undangan Baru
                    </Button>
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
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading} className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-white border-0 shadow-md">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Buat Sekarang"
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
