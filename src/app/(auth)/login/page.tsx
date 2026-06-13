/* Login page based on docs/design/authlogin & authregister — Authentication Pages.png. */

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { claimCurrentGuestSession, getGuestTokenFromStorage, hasCookieGuestSession } from "@/lib/guest-session-client";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [guestSessionToken, setGuestSessionToken] = useState<string | null>(null);
  const [hasGuestCookie, setHasGuestCookie] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  useEffect(() => {
    setGuestSessionToken(getGuestTokenFromStorage(new URLSearchParams(window.location.search)));
    void hasCookieGuestSession().then(setHasGuestCookie);
  }, []);

  async function claimGuestSession(accessToken: string) {
    const shouldClaim =
      searchParams.get("claim") === "true" ||
      hasGuestCookie ||
      Boolean(guestSessionToken) ||
      (await hasCookieGuestSession());
    if (!shouldClaim) return null;

    try {
      const json = await claimCurrentGuestSession(accessToken, guestSessionToken);
      if (!json.data) {
        if (json.error?.code !== "SESSION_NOT_FOUND") {
          toast.error("Gagal menyimpan undangan sementara.", {
            description: json?.error?.message || "Sesi undangan tidak ditemukan.",
          });
        }
        return null;
      }

      localStorage.removeItem("guest_session");
      localStorage.removeItem("guest_return_slug");
      localStorage.removeItem("pending_claim_token");
      toast.success("Undangan tersimpan! Total waktu aktif menjadi 15 menit.");
      return json.data.slug;
    } catch (error) {
      console.error("[LOGIN] Claim fetch exception:", error);
      toast.error("Sistem sedang sibuk. Gagal mengklaim undangan.");
      return null;
    }
  }

  async function handleEmailLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      toast.error("Login gagal", { description: "Email atau kata sandi salah." });
      setLoading(false);
      return;
    }

    const claimedSlug = await claimGuestSession(data.session.access_token);
    router.push(claimedSlug ? `/invite/${claimedSlug}/edit` : "/dashboard");
    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();
      const token = getGuestTokenFromStorage(new URLSearchParams(window.location.search));
      const redirectTo = token
        ? `${window.location.origin}/api/auth/callback?guest_session_token=${token}`
        : `${window.location.origin}/api/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        toast.error("Login Google gagal", { description: "Silakan coba lagi." });
        setLoading(false);
      }
    } catch (error) {
      console.error("[login] Google login error:", error);
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="w-full max-w-[470px]">
        <AuthTabs active="login" />

        <div className="mt-9">
          <h1 className="font-ui text-2xl font-bold text-landing-ink">Selamat datang kembali 👋</h1>
          <p className="mt-2 font-ui text-base text-landing-muted">Masuk ke akunmu untuk melanjutkan</p>
        </div>

        {message ? <p className="mt-5 rounded-lg bg-red-50 p-3 font-ui text-sm font-semibold text-landing-maroon">{message}</p> : null}
        {guestSessionToken ? (
          <p className="mt-5 rounded-lg border border-landing-gold/40 bg-landing-gold/10 p-3 font-ui text-sm text-landing-ink">
            Login untuk menyimpan undanganmu dan memperpanjang timer.
          </p>
        ) : null}

        <form onSubmit={handleEmailLogin} className="mt-8 space-y-5">
          <AuthInput
            id="email"
            label="Alamat Email"
            icon={<Mail className="h-5 w-5" aria-hidden="true" />}
            type="email"
            placeholder="kamu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <AuthInput
            id="password"
            label="Kata Sandi"
            icon={<Lock className="h-5 w-5" aria-hidden="true" />}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            right={
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Tampilkan kata sandi">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <div className="flex justify-end">
            <Link href="/reset-password" className="font-ui text-sm font-semibold text-landing-maroon hover:underline">
              Lupa kata sandi?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-lg bg-landing-gold font-ui text-lg font-bold text-white shadow-landing-button transition hover:bg-landing-maroon disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8">
          <SocialButtons mode="login" disabled={loading} onGoogle={handleGoogleLogin} />
        </div>

        <p className="mt-8 text-center font-ui text-sm text-landing-muted">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-landing-maroon underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-landing-paper" />}>
      <LoginForm />
    </Suspense>
  );
}
