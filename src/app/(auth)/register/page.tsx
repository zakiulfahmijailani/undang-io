/* Register page based on docs/design/authlogin & authregister — Authentication Pages.png. */

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [guestSessionToken, setGuestSessionToken] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("guest_session");
      if (raw) {
        const parsed = JSON.parse(raw) as { sessionToken?: string };
        if (parsed.sessionToken) {
          setGuestSessionToken(parsed.sessionToken);
          return;
        }
      }
    } catch (error) {
      console.error("[register] Failed to read guest session:", error);
    }

    const urlToken = searchParams.get("guest_token");
    if (urlToken) setGuestSessionToken(urlToken);
  }, [searchParams]);

  const passwordRules = useMemo(
    () => [
      { label: "Minimal 8 karakter", passed: password.length >= 8 },
      { label: "Mengandung huruf besar", passed: /[A-Z]/.test(password) },
      { label: "Mengandung angka", passed: /\d/.test(password) },
    ],
    [password],
  );
  const passwordStrength = passwordRules.filter((rule) => rule.passed).length;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  async function handleEmailRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!acceptedTerms) {
      toast.error("Persetujuan diperlukan", { description: "Kamu perlu menyetujui syarat dan kebijakan privasi." });
      return;
    }

    if (!passwordsMatch) {
      toast.error("Kata sandi belum cocok", { description: "Pastikan konfirmasi kata sandi sama." });
      return;
    }

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

    if (data.session) {
      if (guestSessionToken) {
        try {
          const claimRes = await fetch(`/api/guest-sessions/${guestSessionToken}/claim`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${data.session.access_token}`,
              "Content-Type": "application/json",
            },
          });
          const json = (await claimRes.json()) as { data?: unknown; error?: { message?: string } };

          if (!claimRes.ok || !json.data) {
            toast.error("Gagal menyimpan undangan.", {
              description: json?.error?.message || `Status: ${claimRes.status}`,
            });
            setLoading(false);
            return;
          }

          localStorage.removeItem("guest_session");
          localStorage.removeItem("guest_return_slug");
          localStorage.removeItem("pending_claim_token");
          toast.success("Undangan tersimpan!");
        } catch (error) {
          console.error("[REGISTER] Claim fetch exception:", error);
          toast.error("Sistem sedang sibuk. Gagal mengklaim undangan.");
          setLoading(false);
          return;
        }
      }
      router.push("/dashboard");
    } else {
      if (guestSessionToken) {
        localStorage.setItem("pending_claim_token", guestSessionToken);
        localStorage.removeItem("guest_session");
        localStorage.removeItem("guest_return_slug");
      }
      toast.success("Cek email kamu untuk verifikasi akun.");
      router.push("/login?message=Cek email untuk melanjutkan proses daftar");
    }

    setLoading(false);
  }

  async function handleGoogleRegister() {
    try {
      setLoading(true);
      const supabase = createBrowserSupabaseClient();
      const redirectTo = guestSessionToken
        ? `${window.location.origin}/api/auth/callback?guest_session_token=${guestSessionToken}`
        : `${window.location.origin}/api/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        toast.error("Daftar Google gagal", { description: "Silakan coba lagi." });
        setLoading(false);
      }
    } catch (error) {
      console.error("[register] Google register error:", error);
      setLoading(false);
    }
  }

  return (
    <AuthShell compact>
      <div className="w-full rounded-2xl border border-landing-border bg-white p-6 shadow-landing-card sm:p-8">
        <AuthTabs active="register" />
        <div className="mt-7">
          <h1 className="font-ui text-2xl font-bold text-landing-ink">Buat akun gratis sekarang</h1>
          <p className="mt-1 font-ui text-sm text-landing-muted">Lengkapi data di bawah untuk membuat akun</p>
        </div>

        {message ? <p className="mt-4 rounded-lg bg-red-50 p-3 font-ui text-sm font-semibold text-landing-maroon">{message}</p> : null}

        <form onSubmit={handleEmailRegister} className="mt-5 space-y-4">
          <AuthInput
            id="fullName"
            label="Nama Lengkap"
            icon={<User className="h-5 w-5" aria-hidden="true" />}
            placeholder="Nama kamu"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
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
            minLength={8}
            required
            right={
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Tampilkan kata sandi">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            }
          />

          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 3 }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 rounded-full",
                  index < passwordStrength ? (passwordStrength < 3 ? "bg-orange-500" : "bg-green-500") : "bg-landing-border",
                )}
              />
            ))}
          </div>
          <div className="space-y-1.5 font-ui text-xs text-landing-muted">
            {passwordRules.map((rule) => (
              <p key={rule.label} className={cn("flex items-center gap-2", rule.passed && "text-green-600")}>
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                {rule.label}
              </p>
            ))}
          </div>

          <AuthInput
            id="confirmPassword"
            label="Konfirmasi Kata Sandi"
            icon={<Lock className="h-5 w-5" aria-hidden="true" />}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          {passwordsMatch ? <p className="font-ui text-sm font-semibold text-green-600">✓ Kata sandi cocok</p> : null}

          <label className="flex items-start gap-3 font-ui text-sm text-landing-muted">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-landing-border text-landing-maroon"
            />
            Saya menyetujui{" "}
            <span>
              <Link href="#" className="font-semibold text-landing-maroon underline">
                Syarat & Ketentuan
              </Link>{" "}
              dan{" "}
              <Link href="#" className="font-semibold text-landing-maroon underline">
                Kebijakan Privasi
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-lg bg-landing-gold font-ui text-base font-bold text-white shadow-landing-button transition hover:bg-landing-maroon disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Buat Akun"}
          </button>
        </form>

        <div className="mt-6">
          <SocialButtons mode="register" disabled={loading} onGoogle={handleGoogleRegister} />
        </div>

        <p className="mt-6 text-center font-ui text-sm text-landing-muted">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-landing-maroon underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-landing-paper" />}>
      <RegisterForm />
    </Suspense>
  );
}
