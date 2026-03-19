"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";

export default function RegisterPage() {
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

      let redirectTo = `${window.location.origin}/api/auth/callback`;
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
    <div className="flex min-h-screen items-center justify-center bg-surface-stitch px-4 font-sans selection:bg-tertiary-fixed-dim-stitch">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-on-tertiary-container-stitch blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary-stitch blur-[120px] rounded-full"></div>
      </div>

      <Card className="w-full max-w-sm shadow-2xl border-outline-variant-stitch/20 rounded-[40px] z-10 overflow-hidden bg-white/80 backdrop-blur-xl">
        <CardContent className="p-10">
          <Link href="/" className="mb-10 flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-2xl bg-primary-stitch flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
               <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <span className="text-2xl font-black text-primary-stitch tracking-tighter">
              undang.io
            </span>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-primary-stitch tracking-tight mb-2">Create Account</h1>
            <p className="text-secondary-stitch text-sm font-light">Join the circle of editorial perfection.</p>
          </div>

          {message && (
            <div className="mb-6 p-3 rounded-2xl bg-error-container-stitch/50 border border-error-stitch/10 flex items-center gap-3 text-error-stitch text-xs font-medium">
              <p className="flex-1">{message}</p>
            </div>
          )}

          {guestSessionToken && (
            <div className="mb-6 rounded-2xl border border-tertiary-fixed-dim-stitch/30 bg-tertiary-stitch/5 p-4 text-[11px] text-tertiary-stitch leading-relaxed">
              <span className="font-bold block mb-1">PROMPT</span>
              Register to preserve your temporary invitation and extend your timer by 10 minutes.
            </div>
          )}

          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full h-14 flex items-center justify-center gap-3 mb-6 bg-white border border-outline-variant-stitch/30 rounded-2xl text-primary-stitch font-bold text-sm shadow-sm hover:bg-surface-container-low-stitch transition-colors active:scale-95 disabled:opacity-50"
          >
            <FaGoogle className="w-4 h-4 text-red-500" />
            Join with Google
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-outline-variant-stitch/20" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold tracking-[0.2em] uppercase">
              <span className="bg-white px-4 text-secondary-stitch/60">Or use email</span>
            </div>
          </div>

          <form onSubmit={handleEmailRegister} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-[10px] font-bold tracking-widest uppercase text-primary-stitch ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-stitch/40" />
                <Input
                  id="fullName"
                  className="h-14 pl-12 rounded-2xl border-outline-variant-stitch/40 bg-surface-container-low-stitch/30 focus:bg-white focus:ring-primary-stitch/20 transition-all"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold tracking-widest uppercase text-primary-stitch ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-stitch/40" />
                <Input
                  id="email"
                  type="email"
                  className="h-14 pl-12 rounded-2xl border-outline-variant-stitch/40 bg-surface-container-low-stitch/30 focus:bg-white focus:ring-primary-stitch/20 transition-all"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[10px] font-bold tracking-widest uppercase text-primary-stitch ml-1">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-stitch/40" />
                <Input
                  id="password"
                  type="password"
                  className="h-14 pl-12 rounded-2xl border-outline-variant-stitch/40 bg-surface-container-low-stitch/30 focus:bg-white focus:ring-primary-stitch/20 transition-all"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="w-full h-14 mt-4 bg-primary-stitch text-white rounded-full font-black tracking-widest uppercase text-sm shadow-xl shadow-primary-stitch/20 active:scale-95 transition-all disabled:opacity-50" 
              disabled={loading}
            >
              {loading ? "PROCESSING..." : "Create Free Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-secondary-stitch/80 font-light">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-on-tertiary-container-stitch hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
      
      <div className="fixed bottom-8 text-[10px] font-bold text-secondary-stitch/40 tracking-[0.3em] uppercase">
        Undang-io Editorial System
      </div>
    </div>
  );
}
