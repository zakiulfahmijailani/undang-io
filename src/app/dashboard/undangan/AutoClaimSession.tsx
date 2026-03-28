"use client";

import { useEffect } from "react";

interface AutoClaimSessionProps {
    // Token-token dari server yang masih berstatus 'preview' dan perlu di-claim
    // agar timer 10 menit di-extend dan user_id ter-attach
    tokens: string[];
}

/**
 * AutoClaimSession
 *
 * Komponen ini berjalan di client, dipanggil sekali saat halaman dashboard/undangan mount.
 * Tugasnya: memanggil PATCH /api/guest-sessions/[token]/claim untuk setiap session
 * yang masih berstatus 'preview' (belum ter-claim ke user ini).
 *
 * Ini menyelesaikan flow:
 * 1. User buat undangan tanpa login → session dibuat dengan status='preview'
 * 2. User login/register → redirect ke dashboard
 * 3. Komponen ini otomatis claim semua session 'preview' milik user
 *    → status jadi 'claimed', timer di-extend 10 menit dari sekarang,
 *      user_id ter-attach ke session
 */
export function AutoClaimSession({ tokens }: AutoClaimSessionProps) {
    useEffect(() => {
        if (!tokens || tokens.length === 0) return;

        const claimAll = async () => {
            for (const token of tokens) {
                try {
                    const res = await fetch(`/api/guest-sessions/${token}/claim`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!res.ok) {
                        const result = await res.json();
                        console.warn(`[AutoClaimSession] Gagal claim token ${token.slice(0, 8)}...:`, result?.error?.message);
                    } else {
                        console.log(`[AutoClaimSession] Berhasil claim token ${token.slice(0, 8)}...`);
                    }
                } catch (err) {
                    console.error(`[AutoClaimSession] Error claim token ${token.slice(0, 8)}...:`, err);
                }
            }
        };

        claimAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // hanya run sekali saat mount

    return null; // tidak render apapun
}
