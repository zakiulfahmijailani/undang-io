"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 2;

export default function NewInvitationDialog({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [groomName, setGroomName] = useState("");
    const [brideName, setBrideName] = useState("");

    // Per-field blur errors
    const [groomError, setGroomError] = useState("");
    const [brideError, setBrideError] = useState("");
    const [submitError, setSubmitError] = useState<string | null>(null);

    const router = useRouter();

    const handleClose = () => {
        setOpen(false);
        // Reset state after close animation
        setTimeout(() => {
            setStep(1);
            setGroomName("");
            setBrideName("");
            setGroomError("");
            setBrideError("");
            setSubmitError(null);
        }, 200);
    };

    const validateGroom = (val: string) => {
        if (!val.trim()) {
            setGroomError("Nama mempelai pria wajib diisi.");
            return false;
        }
        setGroomError("");
        return true;
    };

    const validateBride = (val: string) => {
        if (!val.trim()) {
            setBrideError("Nama mempelai wanita wajib diisi.");
            return false;
        }
        setBrideError("");
        return true;
    };

    const handleNextStep = () => {
        const groomOk = validateGroom(groomName);
        if (!groomOk) return;
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        const groomOk = validateGroom(groomName);
        const brideOk = validateBride(brideName);
        if (!groomOk || !brideOk) return;

        setIsLoading(true);

        try {
            const response = await fetch("/api/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ groom_name: groomName, bride_name: brideName }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error?.message || "Terjadi kesalahan saat membuat undangan.");
            }

            handleClose();

            toast.success("Undangan berhasil dibuat! 🎉", {
                description: "Silakan lengkapi informasi undanganmu sekarang.",
                duration: 4000,
            });

            router.push(`/dashboard/undangan/${result.data.id}/edit`);
        } catch (err: any) {
            setSubmitError(err.message || "Gagal menghubungi server.");
        } finally {
            setIsLoading(false);
        }
    };

    const stepLabels = ["Nama Pria", "Nama Wanita"];

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
                onClose={handleClose}
                title="Mulai Buat Undangan"
                description="Masukkan nama panggilan kedua mempelai. Kamu bisa mengubahnya nanti."
            >
                {/* Step Progress Indicator */}
                <div className="flex items-center gap-2 mb-6">
                    {stepLabels.map((label, i) => {
                        const stepNum = i + 1;
                        const isActive = step === stepNum;
                        const isDone = step > stepNum;
                        return (
                            <div key={i} className="flex items-center gap-2 flex-1">
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        isDone ? "bg-primary text-white" :
                                        isActive ? "bg-primary/10 text-primary border-2 border-primary" :
                                        "bg-muted text-muted-foreground"
                                    )}>
                                        {isDone ? "✓" : stepNum}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-medium hidden sm:block",
                                        isActive ? "text-foreground" : "text-muted-foreground"
                                    )}>{label}</span>
                                </div>
                                {i < TOTAL_STEPS - 1 && (
                                    <div className={cn(
                                        "flex-1 h-0.5 rounded-full transition-all",
                                        step > stepNum ? "bg-primary" : "bg-border"
                                    )} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Step 1 — Nama Pria */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                            <Input
                                id="groom_name"
                                label="Nama Panggilan Mempelai Pria"
                                placeholder="Cth: Budi"
                                value={groomName}
                                onChange={(e) => {
                                    setGroomName(e.target.value);
                                    if (groomError) validateGroom(e.target.value);
                                }}
                                onBlur={() => validateGroom(groomName)}
                                disabled={isLoading}
                                maxLength={100}
                            />
                            {groomError && (
                                <p className="text-sm text-[var(--color-error-base)] font-medium -mt-2">{groomError}</p>
                            )}
                            <p className="text-xs text-muted-foreground">Nama ini akan tampil di header undangan. Bisa diubah kapan saja.</p>
                        </div>
                    )}

                    {/* Step 2 — Nama Wanita */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                            <Input
                                id="bride_name"
                                label="Nama Panggilan Mempelai Wanita"
                                placeholder="Cth: Ani"
                                value={brideName}
                                onChange={(e) => {
                                    setBrideName(e.target.value);
                                    if (brideError) validateBride(e.target.value);
                                }}
                                onBlur={() => validateBride(brideName)}
                                disabled={isLoading}
                                maxLength={100}
                            />
                            {brideError && (
                                <p className="text-sm text-[var(--color-error-base)] font-medium -mt-2">{brideError}</p>
                            )}
                            <p className="text-xs text-muted-foreground">Nama ini akan ditampilkan bersama nama mempelai pria.</p>
                        </div>
                    )}

                    {submitError && (
                        <p className="text-sm text-[var(--color-error-base)] font-medium">{submitError}</p>
                    )}

                    <div className="flex justify-between gap-2 pt-4">
                        {step > 1 ? (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setStep(s => s - 1)}
                                disabled={isLoading}
                                className="gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" /> Kembali
                            </Button>
                        ) : (
                            <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
                                Batal
                            </Button>
                        )}

                        {step < TOTAL_STEPS ? (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={handleNextStep}
                                className="gap-1 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-white border-0 shadow-md"
                            >
                                Lanjut <ChevronRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-white border-0 shadow-md"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Buat Sekarang ✨"
                                )}
                            </Button>
                        )}
                    </div>
                </form>
            </Modal>
        </>
    );
}
