"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestSessionToken, setGuestSessionToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  useEffect(() => {
    // Priority 1: active guest session in localStorage
    const raw = localStorage.getItem('guest_session');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.sessionToken) {
          setGuestSessionToken(parsed.sessionToken);
          return;
        }
      } catch (e) {}
    }
    // Priority 2: token from URL query param (from GuestCountdownBanner)
    const urlToken = searchParams.get('guest_token');
    if (urlToken) setGuestSessionToken(urlToken);
  }, [searchParams]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      toast.error("Registrasi gagal", { description: error.message });
      setLoading(false);
      return;
    }

    // If user is immediately confirmed (no email verification)
    if (data.session) {
      if (guestSessionToken) {
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
            toast.error('Gagal menyimpan undangan.', {
              description: json?.error?.message || `Status: ${claimRes.status}`,
            });
            setLoading(false);
            return;
          }

          localStorage.removeItem('guest_session');
          localStorage.removeItem('guest_return_slug');
          localStorage.removeItem('pending_claim_token');
          toast.success('Undangan tersimpan!');
        } catch (e: any) {
          console.error('[REGISTER] Claim fetch exception:', e);
          toast.error('Sistem sedang sibuk. Gagal mengklaim undangan.');
          setLoading(false);
          return;
        }
      }
      router.push('/dashboard');
    } else {
      // Email verification required — save token for after verification
      if (guestSessionToken) {
        localStorage.setItem('pending_claim_token', guestSessionToken);
        localStorage.removeItem('guest_session');
        localStorage.removeItem('guest_return_slug');
      }
      toast.success('Cek email kamu untuk verifikasi akun.');
      router.push('/login?message=Cek email untuk melanjutkan proses daftar');
    }

    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();

      let redirectTo = `${window.location.origin}/auth/callback`;
      if (guestSessionToken) {
        redirectTo += `?guest_session_token=${guestSessionToken}`;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        console.error("Google register error:", error);
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
          <h1 className="mb-6 text-center text-xl font-bold text-foreground">Daftar Akun Baru</h1>

          {message && (
            <p className="mb-4 text-center text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md">
              {message}
            </p>
          )}

          {guestSessionToken && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
              ⏳ Daftar untuk menyimpan undanganmu dan perpanjang timer 10 menit.
            </div>
          )}

          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2 mb-4 cursor-pointer"
            onClick={handleGoogleRegister}
            disabled={loading}
            type="button"
          >
            <FaGoogle className="w-4 h-4 text-red-500" />
            Daftar dengan Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Atau daftar dengan email</span>
            </div>
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  className="pl-9"
                  placeholder="Nama kamu"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
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
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6 cursor-pointer" disabled={loading}>
              {loading ? "Memproses..." : "Daftar Gratis"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
