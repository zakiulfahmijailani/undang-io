"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { login } from "../actions";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await login(formData);
    setLoading(false);
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

          <form action={handleSubmit} className="space-y-4">
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
                  placeholder="••••••••"
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
