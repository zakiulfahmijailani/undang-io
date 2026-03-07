"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";

import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = z.object({
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [loginError, setLoginError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoginError(null);
        // Dummy submit logic
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (data.email === "admin@gmail.com" && data.password === "admin") {
            router.push("/dashboard");
        } else {
            setLoginError("Email atau password salah. Gunakan admin@gmail.com / admin");
        }
    };

    return (
        <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
                <CardHeader className="space-y-1 text-center">
                    <Link href="/" className="font-serif text-2xl font-bold text-primary mb-2 inline-block">
                        umuman
                    </Link>
                    <CardTitle className="text-2xl font-serif">Selamat Datang Kembali</CardTitle>
                    <CardDescription>Masukkan email dan password Anda untuk masuk</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                            <FaGoogle className="w-4 h-4 text-red-500" />
                            Masuk dengan Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Atau lanjutkan dengan email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="admin@gmail.com"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Password
                                    </label>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("password")}
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                                {loginError && <p className="text-sm font-medium text-red-500 text-center bg-red-50 p-2 rounded-md border border-red-100">{loginError}</p>}
                            </div>

                            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2" disabled={isSubmitting}>
                                {isSubmitting ? "Memproses..." : "Masuk"}
                            </Button>
                        </form>
                    </div>
                    <div className="mt-6 text-center text-sm">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-primary font-medium hover:underline">
                            Daftar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
