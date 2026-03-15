"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { signup } from "../actions";
import { createClient } from "@/lib/supabase/client";
import { FaGoogle } from "react-icons/fa";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await signup(formData);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Error signing up with Google:", error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      // Intentionally not setting loading to false, as the redirect handles it
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

          <Button 
            variant="secondary" 
            className="w-full flex items-center justify-center gap-2 mb-4 cursor-pointer" 
            onClick={handleGoogleLogin} 
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

          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  name="fullName"
                  className="pl-9"
                  placeholder="Nama kamu"
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
                  name="email"
                  type="email"
                  className="pl-9"
                  placeholder="nama@email.com"
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
                  name="password"
                  type="password"
                  className="pl-9"
                  placeholder="Minimal 6 karakter"
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
