import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, CreditCard, Activity, TrendingUp } from "lucide-react"

export default async function OwnerDashboardPage() {
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

    const isOwner = profile?.role === 'owner'

    if (!isOwner) {
        return (
            <div className="container-lg py-20 text-center flex flex-col items-center gap-4">
                <ShieldAlert className="w-16 h-16 text-[var(--color-error-base)]" />
                <h1 className="text-h3 font-display font-bold text-[var(--color-neutral-900)]">Akses Ditolak</h1>
                <p className="text-body-md text-[var(--color-neutral-600)]">Halaman ini eksklusif untuk Owner/Pendiri platform.</p>
                <Button asChild className="mt-4"><a href="/dashboard">Kembali ke Dashboard</a></Button>
            </div>
        )
    }

    // Fetch Business Data
    const { count: premiumInvs } = await supabase.from('invitations').select('*, subscription_plans!inner(price)').gt('subscription_plans.price', 0)
    // Note: Above inner join count is a rough proxy since we might not have a direct query setup for this yet.

    const { data: payments } = await supabase.from('payments').select('amount').eq('status', 'success')
    const totalRevenue = payments?.reduce((acc: number, curr: any) => acc + curr.amount, 0) || 0

    return (
        <div className="container-lg py-12 flex flex-col gap-8">
            <div>
                <h1 className="text-h2 font-display font-bold text-[var(--color-neutral-900)]">Owner Dashboard</h1>
                <p className="text-body-md text-[var(--color-neutral-500)]">Key Business Metrics & Revenue.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                        <CreditCard className="h-4 w-4 text-[var(--color-success-600)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[var(--color-success-700)]">Rp {totalRevenue.toLocaleString('id-ID')}</div>
                        <p className="text-xs text-[var(--color-neutral-500)]">Dari penjualan plan premium</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Undangan Premium</CardTitle>
                        <TrendingUp className="h-4 w-4 text-[var(--color-primary-500)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payments?.length || 0}</div>
                        <p className="text-xs text-[var(--color-neutral-500)]">Telah dibayar sukses</p>
                    </CardContent>
                </Card>

                <Card className="bg-[var(--color-neutral-900)] text-white border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-[var(--color-neutral-300)]">
                        <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                        <Activity className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[var(--color-success-400)]">Healthy</div>
                        <p className="text-xs text-[var(--color-neutral-400)]">All systems operational</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8 p-6 bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] rounded-xl text-center">
                <h3 className="font-bold text-[var(--color-primary-800)] text-lg mb-2">Simulasi Seed & Testing</h3>
                <p className="text-[var(--color-primary-700)] text-sm max-w-2xl mx-auto mb-4">
                    Karena ini merupakan MVP dan lingkungan tidak memiliki user setup secara live,
                    fitur-fitur pembayaran dapat diuji menggunakan Postman atau langsung ke endpoint <code>/api/payments/create-session</code>.
                </p>
            </div>
        </div>
    )
}
