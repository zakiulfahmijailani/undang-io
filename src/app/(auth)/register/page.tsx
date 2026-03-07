"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle } from "react-icons/fa";

const registerSchema = z.object({
    name: z.string().min(2, "Nama wajib diisi"),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(6, "Minimal 6 karakter"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        // Dummy submit logic
        console.log("Register data:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert("Proses pendaftaran: " + data.email);
    };

    return (
        <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md border-border/50 shadow-xl shadow-primary/5">
                <CardHeader className="space-y-1 text-center">
                    <Link href="/" className="flex flex-col items-center gap-4 mb-8 group inline-block">
                        <Image src="/logo.png" alt="umuman logo" width={120} height={120} className="w-30 h-30 object-contain transition-transform group-hover:scale-110" />
                        <span className="font-serif text-4xl font-bold text-primary">umuman</span>
                    </Link>
                    <CardTitle className="text-2xl font-serif">Buat Akun Baru</CardTitle>
                    <CardDescription>Mulai perjalanan undangan digital Anda bersama kami</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                            <FaGoogle className="w-4 h-4 text-red-500" />
                            Daftar dengan Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Atau daftar dengan email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Budi Santoso"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="nama@email.com"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("email")}
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Minimal 6 karakter"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...register("password")}
                                />
                                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                            </div>

                            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2" disabled={isSubmitting}>
                                {isSubmitting ? "Memproses..." : "Daftar Sekarang"}
                            </Button>
                        </form>
                    </div>
                    <div className="mt-6 text-center text-sm">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-primary font-medium hover:underline">
                            Masuk
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
