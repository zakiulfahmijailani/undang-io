import Link from "next/link"
import { signup } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Mail, Lock, User } from "lucide-react"

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <h1 className="text-display-lg text-[var(--color-primary-500)] mb-2">NikahKu</h1>
                <p className="text-body-lg text-[var(--color-neutral-600)]">Mulai Perjalanan Anda</p>
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Daftar Akun Baru</CardTitle>
                    <CardDescription>
                        Buat akun untuk mulai membuat undangan pernikahan digital Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="flex flex-col gap-4">
                        <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            label="Nama Lengkap"
                            placeholder="Rina & Andi"
                            required
                            leftAdornment={<User className="w-5 h-5" />}
                        />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            label="Alamat Email"
                            placeholder="nama@email.com"
                            required
                            leftAdornment={<Mail className="w-5 h-5" />}
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            label="Kata Sandi"
                            placeholder="Minimal 6 karakter"
                            required
                            leftAdornment={<Lock className="w-5 h-5" />}
                        />

                        <Button formAction={signup} variant="primary" fullWidth className="mt-4">
                            Daftar Akun
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center flex-col gap-3 text-center">
                    <p className="text-body-sm text-[var(--color-neutral-500)]">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="text-[var(--color-primary-600)] hover:underline font-semibold">
                            Masuk di sini
                        </Link>
                    </p>
                    <p className="text-caption text-neutral-400 mt-2">
                        Dengan mendaftar, Anda menyetujui Syarat dan Ketentuan Layanan kami.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
