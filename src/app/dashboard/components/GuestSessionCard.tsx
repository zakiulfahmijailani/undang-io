"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Eye, CreditCard, AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    const groomName = inv?.groomNickname || inv?.groomFullName || "Groom";
    const brideName = inv?.brideNickname || inv?.brideFullName || "Bride";

    return (
        <Card className="overflow-hidden border-outline-variant-stitch/20 rounded-[40px] shadow-glow-stitch hover:shadow-2xl transition-all duration-700 bg-white/60 backdrop-blur-xl group">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-stitch/10 border border-tertiary-stitch/20 text-tertiary-stitch text-[9px] font-black tracking-widest uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>Draft Concept</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isExpired ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-stitch text-white text-[10px] font-bold">
                                <AlertTriangle className="h-3 w-3" /> EXPIRED
                            </div>
                        ) : (
                            <div
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                                    isUrgent
                                        ? "bg-error-stitch text-white animate-pulse"
                                        : "bg-primary-stitch text-white"
                                }`}
                            >
                                <Clock className="h-3 w-3" />
                                {display}
                            </div>
                        )}
                    </div>
                </div>

                <h3 className="text-3xl font-black text-primary-stitch tracking-tighter mb-2 leading-tight">
                    {groomName} & {brideName}
                </h3>
                <p className="text-secondary-stitch text-sm font-light mb-8 leading-relaxed">
                    {isExpired
                        ? "This session has expired. Start a new bespoke journey."
                        : `Finalize your payment before the timer expires to secure your digital presence.`}
                </p>

                <div className="flex items-center gap-4">
                    {!isExpired && (
                        <>
                            <Link href={`/pembayaran/${guestSession.slug}`} className="flex-1">
                                <button className="w-full h-14 bg-on-tertiary-container-stitch text-tertiary-stitch rounded-full font-black tracking-widest uppercase text-xs shadow-lg shadow-tertiary-stitch/20 active:scale-95 transition-all">
                                    Publish Now
                                </button>
                            </Link>
                            <Link href={`/u/${guestSession.slug}`} className="flex-1">
                                <button className="w-full h-14 border border-outline-variant-stitch/30 text-primary-stitch rounded-full font-black tracking-widest uppercase text-xs hover:bg-surface-container-low-stitch active:scale-95 transition-all">
                                    Preview
                                </button>
                            </Link>
                        </>
                    )}
                    {isExpired && (
                        <Link href="/buat-undangan" className="w-full">
                            <button className="w-full h-14 bg-primary-stitch text-white rounded-full font-black tracking-widest uppercase text-xs shadow-xl shadow-primary-stitch/20 active:scale-95 transition-all">
                                Recreate Invitation
                            </button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
