"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoClaimSessionProps {
    // Token-token dari server yang masih berstatus 'preview' dan perlu di-claim
    tokens: string[];
}

/**
 * AutoClaimSession
 *
 * Menyelesaikan dua skenario:
 *
 * A. Token dari server (query .eq('user_id', user.id) — session yang sudah
 *    ter-attach ke user tapi masih berstatus 'preview'):
 *    → di-claim untuk extend timer 10 menit
 *
 * B. Token dari localStorage['guest_session'] — session yang dibuat tanpa
 *    login (user_id = null di DB) sehingga tidak muncul di query server:
 *    → di-claim untuk attach user_id + extend timer
 *    → localStorage dihapus setelah berhasil
 *    → halaman di-refresh agar undangan muncul di daftar
 */
export function AutoClaimSession({ tokens }: AutoClaimSessionProps) {
    const router = useRouter();

    useEffect(() => {
        const claimAll = async () => {
            // Kumpulkan semua token yang perlu di-claim
            const allTokens = new Set<string>(tokens || []);

            // Cek localStorage untuk guest session yang dibuat sebelum login
            let localToken: string | null = null;
            try {
                const raw = localStorage.getItem("guest_session");
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed?.sessionToken) {
                        localToken = parsed.sessionToken as string;
                        allTokens.add(localToken);
                    }
                }
            } catch {
                // ignore JSON parse error
            }

            if (allTokens.size === 0) return;

            let claimedLocalToken = false;

            for (const token of allTokens) {
                try {
                    const res = await fetch(`/api/guest-sessions/${token}/claim`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                    });

                    const result = await res.json();

                    if (!res.ok) {
                        // ALREADY_CONVERTED & SESSION_EXPIRED = boleh diabaikan
                        const ignorable = ["ALREADY_CONVERTED", "SESSION_EXPIRED"];
                        if (!ignorable.includes(result?.error?.code)) {
                            console.warn(
                                `[AutoClaimSession] Gagal claim token ${token.slice(0, 8)}...:`,
                                result?.error?.message
                            );
                        }
                    } else {
                        console.log(`[AutoClaimSession] Berhasil claim token ${token.slice(0, 8)}...`);
                        if (token === localToken) {
                            claimedLocalToken = true;
                        }
                    }
                } catch (err) {
                    console.error(`[AutoClaimSession] Error claim token ${token.slice(0, 8)}...:`, err);
                }
            }

            // Hapus localStorage setelah berhasil di-claim
            if (claimedLocalToken) {
                try {
                    localStorage.removeItem("guest_session");
                } catch { /* ignore */ }
                // Refresh halaman agar undangan yang baru di-claim muncul di daftar
                router.refresh();
            }
        };

        claimAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // hanya run sekali saat mount

    return null;
}
