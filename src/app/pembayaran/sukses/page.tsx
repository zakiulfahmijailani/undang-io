"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ExternalLink, Copy, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Use a generic logic for window location that works in Next.js safely
  const [demoLink, setDemoLink] = useState("");

  useEffect(() => {
    setDemoLink(`${window.location.origin}/u/demo-couple-2026`);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="text-8xl animate-pulse">🎉</div>
        </div>
      )}
      <Card className="w-full max-w-md shadow-lg border-stone-200">
        <CardContent className="p-8 text-center pt-8">
          <PartyPopper className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
          <h1 className="mb-2 font-serif text-2xl font-bold text-stone-900">
            🎉 Selamat! Undangan Kamu Sekarang Live Selamanya!
          </h1>
          <p className="mb-6 text-stone-500">
            Undangan pernikahan digitalmu sudah aktif dan bisa diakses kapan saja.
          </p>

          <div className="mb-6 rounded-lg border border-stone-200 bg-stone-100/50 p-3">
            <p className="mb-1 text-xs text-stone-500">Link undangan kamu:</p>
            <p className="break-all text-sm font-semibold text-stone-900">{demoLink}</p>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 gap-1 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                const text = `Kamu diundang! Buka undangan pernikahan kami: ${demoLink}`;
                window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
              }}
            >
              <ExternalLink className="h-4 w-4" /> WhatsApp
            </Button>
            <Button
              variant="secondary"
              className="flex-1 gap-1 cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(demoLink);
                toast("Link disalin!");
              }}
            >
              <Copy className="h-4 w-4" /> Salin Link
            </Button>
          </div>

          <p className="mt-6 text-xs text-stone-500">
            Teman mau nikah juga? Rekomendasikan{" "}
            <Link href="/" className="font-semibold text-amber-600 hover:underline">
              undang.io
            </Link>
          </p>

          <Button variant="secondary" className="mt-4 w-full cursor-pointer" asChild>
            <Link href="/dashboard">Ke Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
