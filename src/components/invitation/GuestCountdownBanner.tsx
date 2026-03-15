"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuestCountdownBannerProps {
  expiresAt: string;
  sessionToken: string;
  slug: string;
  status: "preview" | "claimed" | "converted" | "expired";
}

function formatTimeDisplay(timeLeftMs: number) {
  if (timeLeftMs <= 0) return "00:00";

  const totalSeconds = Math.floor(timeLeftMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);

  // Requirement: If >= 60 minutes: show "59:59"
  if (totalMinutes >= 60) {
    return "59:59";
  }

  const minutes = totalMinutes;
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function GuestCountdownBanner({
  expiresAt,
  sessionToken,
  slug,
  status,
}: GuestCountdownBannerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return Math.max(0, new Date(expiresAt).getTime() - Date.now());
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Initial check
    const initialTime = new Date(expiresAt).getTime() - Date.now();
    if (initialTime <= 0) {
      setIsExpired(true);
      return;
    }

    const interval = setInterval(() => {
      const remaining = new Date(expiresAt).getTime() - Date.now();
      if (remaining <= 0) {
        setIsExpired(true);
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const isUrgent = timeLeft < 3 * 60 * 1000 && timeLeft > 0; // < 3 minutes

  // Converted — no banner needed
  if (status === "converted") {
    return null;
  }

  // Claimed by authenticated user — show publish CTA
  if (status === "claimed") {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] border-b border-emerald-200 bg-emerald-50/95 backdrop-blur-md px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              ✅ Undangan tersimpan di akunmu.{" "}
              {!isExpired && (
                <>Sisa waktu: <span className="font-bold">{formatTimeDisplay(timeLeft)}</span></>
              )}
            </span>
          </div>
          <Button
            size="sm"
            className="h-8 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4"
            asChild
          >
            <Link href={`/pembayaran/${slug}`}>
              Publikasikan permanen seharga Rp 45.000
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Expired
  if (isExpired || status === "expired") {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] border-b border-red-200 bg-red-50/95 backdrop-blur-md px-4 py-3 shadow-md">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-bold">
              Sesi undangan telah berakhir.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Preview — active countdown
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999] border-b backdrop-blur-md px-4 py-3 transition-all duration-500 shadow-sm",
        isUrgent
          ? "border-red-200 bg-red-50/95 animate-pulse-subtle"
          : "border-amber-200 bg-amber-50/95"
      )}
    >
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div
          className={cn(
            "flex items-center gap-2",
            isUrgent ? "text-red-700" : "text-amber-700"
          )}
        >
          <Clock className={cn("h-4 w-4", isUrgent && "animate-spin-slow")} />
          <span className="text-sm font-medium">
            {isUrgent ? (
              <>⚠️ Segera daftar! Undangan hilang dalam <span className="font-bold font-mono">{formatTimeDisplay(timeLeft)}</span></>
            ) : (
              <>Undangan ini akan hilang dalam <span className="font-bold font-mono">{formatTimeDisplay(timeLeft)}</span>. Daftar atau masuk untuk menyimpan permanen.</>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 cursor-pointer text-xs font-bold bg-stone-900 hover:bg-black text-white px-4"
            asChild
          >
            <Link href={`/register?guest_token=${sessionToken}`}>
              Daftar Sekarang
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 cursor-pointer text-xs font-semibold hover:bg-stone-200/50"
            asChild
          >
            <Link href={`/login?guest_token=${sessionToken}`}>
              Sudah punya akun? Masuk
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
