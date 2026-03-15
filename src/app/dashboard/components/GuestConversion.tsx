"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function GuestConversion() {
    const router = useRouter();
    const [isConverting, setIsConverting] = useState(false);

    useEffect(() => {
        const convertGuestSession = async () => {
            const raw = localStorage.getItem("guest_session");
            if (!raw) return;

            try {
                const session = JSON.parse(raw);
                if (!session.sessionToken) return;

                setIsConverting(true);
                
                const res = await fetch(`/api/invitations/guest/${session.sessionToken}/convert`, {
                    method: "POST",
                });

                const result = await res.json();

                if (res.ok && result.success) {
                    toast.success("Undangan tamu kamu telah berhasil dipindahkan ke akun kamu!");
                    localStorage.removeItem("guest_session");
                    router.refresh();
                } else if (res.status === 404) {
                    // Session might have expired or not found in DB
                    localStorage.removeItem("guest_session");
                }
            } catch (error) {
                console.error("Conversion error:", error);
            } finally {
                setIsConverting(false);
            }
        };

        convertGuestSession();
    }, [router]);

    if (!isConverting) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-2xl shadow-xl border border-border">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <div className="text-center">
                    <h3 className="font-serif font-bold text-lg">Memindahkan Undangan...</h3>
                    <p className="text-sm text-muted-foreground">Mohon tunggu sebentar, kami sedang menyiapkan undanganmu.</p>
                </div>
            </div>
        </div>
    );
}
