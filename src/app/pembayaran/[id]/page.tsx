"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PaymentPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  // [id] di sini adalah SLUG dari guest_session
  const slug = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        const msg = json.error?.message || 'Pembayaran gagal. Silakan coba lagi.';
        toast.error(msg);
        setLoading(false);
        return;
      }

      // Redirect ke halaman sukses dengan slug undangan yang baru dibuat
      router.push(`/pembayaran/sukses?slug=${json.data.slug}`);
    } catch (err) {
      console.error('[handlePay] Unexpected error:', err);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-stone-200">
        <CardContent className="p-8">
          <Link href="/" className="mb-6 flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-amber-600" fill="currentColor" />
            <span className="text-xl font-bold text-stone-900">
              undang<span className="text-amber-600">.io</span>
            </span>
          </Link>

          <h1 className="mb-2 text-center text-xl font-bold text-stone-900">Aktifkan Undangan</h1>
          <p className="mb-6 text-center text-sm text-stone-500">/{slug}</p>

          <div className="mb-6 rounded-lg border border-stone-200 bg-stone-100/50 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-stone-600">Undangan Digital</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-stone-900">Rp 45.000</span>
                <span className="ml-2 text-sm text-stone-400 line-through">Rp 99.000</span>
              </div>
            </div>
            <Badge className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Hemat 55%</Badge>
          </div>

          <ul className="mb-6 space-y-2 text-sm">
            {[
              "Undangan live selamanya",
              "Tersimpan di akun kamu",
              "Link undangan permanen",
              "Bebas edit kapan saja",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-stone-700">
                <Check className="h-4 w-4 text-emerald-500" /> {item}
              </li>
            ))}
          </ul>

          <Button
            className="w-full cursor-pointer bg-stone-900 text-white hover:bg-stone-800"
            size="lg"
            onClick={handlePay}
            disabled={loading}
          >
            {loading ? "Memproses pembayaran..." : "Bayar Sekarang — Rp 45.000"}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-stone-400">
            <Shield className="h-3 w-3" /> Pembayaran aman & terenkripsi
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
