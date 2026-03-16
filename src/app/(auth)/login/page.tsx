"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestSessionToken, setGuestSessionToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  // Step 1: mark mounted (client-only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Step 2: read token only after mounted
  useEffect(() => {
    if (!mounted) return;

    // Priority 1: active guest session in localStorage
    try {
      const raw = localStorage.getItem('guest_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.sessionToken) {
          setGuestSessionToken(parsed.sessionToken);
          return;
        }
      }
    } catch (e) {}

    // Priority 2: pending token from email-verify register flow
    const pending = localStorage.getItem('pending_claim_token');
    if (pending) {
      setGuestSessionToken(pending);
      return;
    }

    // Priority 3: token from URL query param (from GuestCountdownBanner)
    const urlToken = searchParams.get('guest_token');
    if (urlToken) setGuestSessionToken(urlToken);
  }, [mounted, searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Login gagal", { description: "Email atau kata sandi salah." });
      setLoading(false);
      return;
    }

    // Claim guest session using Bearer token — avoids cookie timing issue
    if (guestSessionToken && data.session) {
      try {
        const claimRes = await fetch(`/api/guest-sessions/${guestSessionToken}/claim`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
            'Content-Type': 'application/json',
          },
        });
        const json = await claimRes.json();

        if (!claimRes.ok || !json.data) {
          toast.error('Gagal menyimpan undangan sementara.', {
            description: json?.error?.message || `Status: ${claimRes.status}`,
          });
          setLoading(false);
          return;
        }

        localStorage.removeItem('guest_session');
        localStorage.removeItem('guest_return_slug');
        localStorage.removeItem('pending_claim_token');
        toast.success('Undangan tersimpan! Timer diperpanjang 10 menit.');
      } catch (e: any) {
        console.error('[LOGIN] Claim fetch exception:', e);
        toast.error('Sistem sedang sibuk. Gagal mengklaim undangan.');
        setLoading(false);
        return;
      }
    }

    router.push('/dashboard');
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();

      let redirectTo = `${window.location.origin}/api/auth/callback`;
      if (guestSessionToken) {
        redirectTo += `?guest_session_token=${guestSessionToken}`;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        console.error("Google login error:", error);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm shadow-lg border-border/50">
        <CardContent className="p-8">
          <Link href="/" className="mb-6 flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold text-foreground">
              undang<span className="text-accent">.io</span>
            </span>
          </Link>
          <h1 className="mb-6 text-center text-xl font-bold text-foreground">Masuk ke Akun</h1>

          {message && (
            <p className="mb-4 text-center text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md">
              {message}
            </p>
          )}

          {guestSessionToken && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              ⏳ Login untuk menyimpan undanganmu dan perpanjang timer 10 menit.
            </div>
          )}

          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2 mb-4 cursor-pointer"
            onClick={handleGoogleLogin}
            disabled={loading}
            type="button"
          >
            <FaGoogle className="w-4 h-4 text-red-500" />
            Masuk dengan Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Atau dengan email</span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6 cursor-pointer" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-accent hover:underline">
              Daftar Gratis
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
