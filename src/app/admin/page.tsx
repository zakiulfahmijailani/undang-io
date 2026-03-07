import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Users, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react"

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    if (!supabase) {
        return (
            <div className="container-lg py-20 text-center">
                <h1 className="text-h2 font-display text-[var(--color-error-base)]">Database Belum Tersedia</h1>
                <p>Silakan hubungkan Supabase di pengaturan environment.</p>
            </div>
        )
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Role check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // For MVP testing without real users set to admin, we will bypass if profile is null but show a warning
    // In production, strictly enforce profile?.role === 'admin'
    const isAdmin = profile?.role === 'admin' || profile?.role === 'owner' // owner is also an admin

    if (!isAdmin) {
        return (
            <div className="container-lg py-20 text-center flex flex-col items-center gap-4">
                <ShieldAlert className="w-16 h-16 text-[var(--color-error-base)]" />
                <h1 className="text-h3 font-display font-bold text-[var(--color-neutral-900)]">Akses Ditolak</h1>
                <p className="text-body-md text-[var(--color-neutral-600)]">Halaman ini khusus untuk Admin. Harap login dengan akun yang sesuai.</p>
                <Button asChild className="mt-4"><a href="/dashboard">Kembali ke Dashboard</a></Button>
            </div>
        )
    }

    // Fetch Admin Data
    const { data: themes } = await supabase.from('themes').select('*').order('created_at', { ascending: false })
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

    return (
        <div className="container-lg py-12 flex flex-col gap-8">
            <div>
                <h1 className="text-h2 font-display font-bold text-[var(--color-neutral-900)]">Admin Panel</h1>
                <p className="text-body-md text-[var(--color-neutral-500)]">Kelola tema dan moderasi konten.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pengguna Aktif</CardTitle>
                        <Users className="h-4 w-4 text-[var(--color-neutral-500)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount || 0}</div>
                        <p className="text-xs text-[var(--color-neutral-500)]">Dari seluruh platform</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tema</CardTitle>
                        <ImageIcon className="h-4 w-4 text-[var(--color-neutral-500)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{themes?.length || 0}</div>
                        <p className="text-xs text-[var(--color-neutral-500)]">Tersedia di gallery</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-h4 font-display font-bold text-[var(--color-neutral-800)] mt-4">Manajemen Tema</h2>
            <div className="overflow-x-auto rounded-lg border border-[var(--color-neutral-200)] bg-white">
                <table className="min-w-full divide-y divide-[var(--color-neutral-200)] text-left text-sm">
                    <thead className="bg-[var(--color-neutral-50)]">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-[var(--color-neutral-700)]">Nama Tema</th>
                            <th className="px-6 py-4 font-semibold text-[var(--color-neutral-700)]">Kategori</th>
                            <th className="px-6 py-4 font-semibold text-[var(--color-neutral-700)]">Tipe</th>
                            <th className="px-6 py-4 font-semibold text-[var(--color-neutral-700)] text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-neutral-200)]">
                        {themes?.map((theme: any) => (
                            <tr key={theme.id} className="hover:bg-[var(--color-neutral-50)]">
                                <td className="px-6 py-4 font-medium">{theme.name}</td>
                                <td className="px-6 py-4 capitalize">{theme.category}</td>
                                <td className="px-6 py-4">
                                    {theme.is_premium ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-warning-50)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-warning-700)]">
                                            Premium
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-success-50)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-success-700)]">
                                            Gratis
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" className="text-[var(--color-primary-600)]">Edit</Button>
                                </td>
                            </tr>
                        ))}
                        {(!themes || themes.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-[var(--color-neutral-500)] italic">
                                    Belum ada tema. Coba jalankan skrip seed.sql
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
