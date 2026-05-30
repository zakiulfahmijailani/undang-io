/* Reset password page based on docs/design/authlogin & authregister — Authentication Pages.png. */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthShell } from "@/components/auth/AuthShell";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      toast.error("Gagal mengirim link reset", { description: "Silakan periksa email dan coba lagi." });
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <AuthShell compact>
      <div className="w-full rounded-2xl border border-landing-border bg-white p-8 shadow-landing-card sm:p-12">
        <Link href="/login" className="mb-16 inline-flex items-center gap-2 font-ui text-sm font-semibold text-landing-maroon">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Kembali ke Login
        </Link>

        <h1 className="font-ui text-3xl font-bold text-landing-ink">Reset Kata Sandi</h1>
        <p className="mt-3 max-w-sm font-ui text-base leading-7 text-landing-muted">
          Masukkan emailmu dan kami akan kirimkan link reset
        </p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-7">
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
          <button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-lg bg-landing-gold font-ui text-lg font-bold text-white shadow-landing-button transition hover:bg-landing-maroon disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>

        {sent ? (
          <div className="mt-14 text-center">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-green-500 text-green-600">
              <Sparkles className="absolute -right-2 top-5 h-5 w-5 text-landing-gold" aria-hidden="true" />
              <Sparkles className="absolute -left-3 bottom-8 h-4 w-4 text-landing-gold" aria-hidden="true" />
              <Check className="h-16 w-16" aria-hidden="true" />
            </div>
            <h2 className="mt-6 font-ui text-2xl font-bold text-landing-ink">Email terkirim!</h2>
            <p className="mt-2 font-ui text-base text-landing-muted">
              Cek inbox kamu di <span className="font-semibold text-landing-maroon">{email}</span>
            </p>
            <p className="mt-8 font-ui text-sm text-landing-muted">
              Kirim ulang dalam <span className="mx-2 rounded-full border border-landing-border px-3 py-2">60</span> detik
            </p>
          </div>
        ) : null}
      </div>
    </AuthShell>
  );
}
