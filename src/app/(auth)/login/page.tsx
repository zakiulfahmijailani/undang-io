import Link from "next/link"
import { login } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-display-lg text-[var(--color-primary-500)] mb-2">NikahKu</h1>
                <p className="text-body-lg text-[var(--color-neutral-600)]">Selamat Datang Kembali</p>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        Masuk ke akun Anda untuk mengelola undangan pernikahan Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4">
                        <Input
                            id="email"
                            name="email"
                            type="text"
                            label="Username / Email"
                            placeholder="Contoh: admin"
                            required
                            leftAdornment={<Mail className="w-5 h-5" />}
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Kata Sandi"
                            placeholder="••••••••"
                            required
                            leftAdornment={<Lock className="w-5 h-5" />}
                        />

                        <div className="flex items-center justify-end w-full">
                            <Link href="#" className="text-caption text-[var(--color-primary-500)] hover:underline">
                                Lupa kata sandi?
                            </Link>
                        </div>

                        <Button formAction={login} variant="primary" fullWidth className="mt-4">
                            Masuk
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-body-sm text-[var(--color-neutral-500)]">
                        Belum punya akun?{' '}
                        <Link href="/register" className="text-[var(--color-primary-600)] hover:underline font-semibold">
                            Daftar sekarang
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
