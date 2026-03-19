"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GuestSessionCardProps {
    guestSession: {
        id: string;
        slug: string;
        session_token: string;
        expires_at: string;
        invitation_data: {
            groomNickname?: string;
            brideNickname?: string;
            groomFullName?: string;
            brideFullName?: string;
        };
        theme_id: string;
    };
}

function useCountdown(expiresAt: string) {
    const [timeLeft, setTimeLeft] = useState(() =>
        Math.max(0, new Date(expiresAt).getTime() - Date.now())
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = new Date(expiresAt).getTime() - Date.now();
            setTimeLeft(Math.max(0, remaining));
            if (remaining <= 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const totalSeconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    const isExpired = timeLeft <= 0;
    const isUrgent = timeLeft < 3 * 60 * 1000 && !isExpired;

    return { display, isExpired, isUrgent };
}

export default function GuestSessionCard({ guestSession }: GuestSessionCardProps) {
    const { display, isExpired, isUrgent } = useCountdown(guestSession.expires_at);
    const inv = guestSession.invitation_data;
    const groomName = inv?.groomNickname || inv?.groomFullName || "Mempelai Pria";
    const brideName = inv?.brideNickname || inv?.brideFullName || "Mempelai Wanita";

    return (
        <div className={`rounded-[32px] overflow-hidden border transition-all duration-500 relative ${
            isUrgent ? "border-amber-400 bg-amber-50/30" : "border-outline-variant/10 bg-white"
        }`}>
            {/* Urgency Overlay */}
            {isUrgent && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400 rotate-45 translate-x-16 -translate-y-16 opacity-10 pointer-events-none"></div>
            )}

            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                        isUrgent ? "bg-amber-400 text-white animate-pulse" : "bg-primary-fixed text-on-primary-fixed"
                    }`}>
                        {isExpired ? "Expired" : "Free Trial Active"}
                    </span>
                    
                    {!isExpired && (
                        <div className="flex items-center gap-2 font-mono text-sm font-bold text-primary">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {display}
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-black text-primary tracking-tighter italic font-light mb-2">
                    {groomName} & {brideName}
                </h3>
                <p className="text-slate-400 text-xs font-['Inter'] mb-8 leading-relaxed">
                   Undangan ini bersifat sementara. Amankan mahakarya Anda ke lisensi permanen sebelum waktu habis.
                </p>

                <div className="flex items-center gap-3">
                    {!isExpired ? (
                        <>
                            <Link 
                                href={`/pembayaran/${guestSession.slug}`}
                                className="flex-1 bg-tertiary text-on-tertiary rounded-2xl py-4 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-tertiary/20"
                            >
                                <span className="material-symbols-outlined text-lg">payments</span>
                                Pay & Publish
                            </Link>
                            <Link 
                                href={`/u/${guestSession.slug}`}
                                className="px-6 border border-outline-variant/20 rounded-2xl py-4 flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">visibility</span>
                            </Link>
                        </>
                    ) : (
                        <Link 
                            href="/buat-undangan"
                            className="w-full bg-surface-container-high text-primary rounded-2xl py-4 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest"
                        >
                            <span className="material-symbols-outlined">restart_alt</span>
                            Start Over
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
