"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Eye, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <Card className="border-amber-200 bg-amber-50/40 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            {/* Timer badge top right */}
            <div className="absolute top-3 right-3">
                {isExpired ? (
                    <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                        <AlertTriangle className="h-3 w-3" /> Expired
                    </Badge>
                ) : (
                    <Badge
                        className={`flex items-center gap-1 text-xs font-mono ${
                            isUrgent
                                ? "bg-red-500 text-white"
                                : "bg-amber-500 text-white"
                        }`}
                    >
                        <Clock className="h-3 w-3" />
                        {display}
                    </Badge>
                )}
            </div>

            <CardContent className="p-5 pt-5">
                {/* Label sementara */}
                <div className="mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Belum Dipublikasikan
                    </span>
                </div>

                {/* Nama pasangan */}
                <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
                    {groomName} & {brideName}
                </h3>
                <p className="text-sm text-stone-500 mb-4">
                    {isExpired
                        ? "Undangan ini sudah kadaluarsa."
                        : `Bayar sebelum timer habis untuk mempublikasikan permanen.`}
                </p>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    {!isExpired && (
                        <>
                            <Button size="sm" className="gap-1 cursor-pointer" asChild>
                                <Link href={`/pembayaran/${guestSession.slug}`}>
                                    <CreditCard className="h-3.5 w-3.5" />
                                    Bayar Rp 45.000
                                </Link>
                            </Button>
                            <Button size="sm" variant="secondary" className="gap-1 cursor-pointer" asChild>
                                <Link href={`/u/${guestSession.slug}`}>
                                    <Eye className="h-3.5 w-3.5" />
                                    Lihat Preview
                                </Link>
                            </Button>
                        </>
                    )}
                    {isExpired && (
                        <Button size="sm" variant="secondary" className="cursor-pointer" asChild>
                            <Link href="/buat-undangan">Buat Ulang</Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
