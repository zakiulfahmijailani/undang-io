import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlarmClock, Diamond, Heart, ScanLine, Edit2, Globe, PlusCircle, CreditCard, ChevronRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export default async function DashboardPage() {
    const supabase = await createClient()

    if (!supabase) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[50vh] text-center gap-4">
                <h2 className="text-h3 font-display font-bold text-[var(--color-error-base)]">Koneksi Database Belum Dikonfigurasi</h2>
                <p className="text-body-md text-[var(--color-neutral-600)] max-w-md">
                    Sistem mendeteksi bahwa kredensial Supabase (NEXT_PUBLIC_SUPABASE_URL) belum diatur di Vercel/Environment. Harap tambahkan kredensial tersebut agar dashboard dapat berfungsi penuh.
                </p>
            </div>
        )
    }

    const { data: { user } } = await supabase.auth.getUser()

    const { data: invitations } = await supabase
        .from('invitations')
        .select('*, rsvp(count), guestbook(count)')
        .eq('user_id', user?.id)

    return (
        <div className="flex flex-col gap-8 max-w-[1200px] mx-auto pb-10">
            {/* Banner Upgrade */}
            <div className="bg-[#EBE3D9] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E0D4C5]">
                <div className="flex items-start gap-4">
                    <AlarmClock className="w-10 h-10 text-[#554e45] shrink-0 mt-1" strokeWidth={1.5} />
                    <div>
                        <h3 className="text-xl font-bold text-[#14213D] mb-1">Kamu masih pakai akun gratisan!</h3>
                        <p className="text-sm text-neutral-600">Masa aktif sampai: <span className="font-semibold text-neutral-800">06-04-2026 13:58:39</span></p>
                        <p className="text-sm text-neutral-600">Segera upgrade ke premium supaya anda tetap bisa mengakses undangan digital anda!</p>
                    </div>
                </div>
                <Button className="bg-[#A07B57] hover:bg-[#8A6746] text-white whitespace-nowrap gap-2 rounded-xl px-6 h-12 shadow-sm border border-[#8A6746]">
                    <Diamond className="w-4 h-4" />
                    Upgrade Akun
                </Button>
            </div>

            <div className="flex justify-end -mt-6">
                <div className="bg-[#14213D] text-white text-xs font-semibold px-4 py-1.5 rounded-b-lg ml-auto mr-8 shadow-sm">
                    Akun Gratisan
                </div>
            </div>

            <div className="bg-white rounded-[1.5rem] p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.03)] border border-neutral-100 flex flex-col gap-6">
                {/* Quota & Invites Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#Fdf5f6] rounded-xl p-4 border border-rose-50">
                        <p className="text-sm font-medium text-[#9E1045] mb-1">Kuota</p>
                        <p className="text-2xl font-bold text-[#8B1842]">0</p>
                    </div>
                    <div className="bg-[#Fdf5f6] rounded-xl p-4 border border-rose-50">
                        <p className="text-sm font-medium text-[#9E1045] mb-1">Undangan</p>
                        <p className="text-2xl font-bold text-[#8B1842]">{invitations?.length || 0}</p>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Buat Undangan Baru */}
                    <Link href="/dashboard/create" className="group flex items-center gap-5 bg-[#9E1045] rounded-xl p-6 transition-all hover:bg-[#8B1842] hover:shadow-lg">
                        <div className="bg-transparent border-2 border-white/80 rounded-lg p-2 shrink-0 group-hover:scale-105 transition-transform">
                            <Heart className="w-8 h-8 text-white" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Buat Undangan Baru</h3>
                            <p className="text-white/80 text-sm">Buat lagi undangan untuk nikahanmu atau temanmu</p>
                        </div>
                    </Link>

                    {/* QR Code Scanner */}
                    <Link href="#" className="group flex items-center gap-5 bg-[#1C2331] rounded-xl p-6 transition-all hover:bg-[#151a26] hover:shadow-lg">
                        <div className="w-12 h-12 shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <ScanLine className="w-10 h-10 text-white" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Buka QR Code Scanner</h3>
                            <p className="text-white/80 text-sm">Scan undangan tamu saat check-in/check-out</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* List Undangan */}
            <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <h2 className="text-2xl font-bold text-[#14213D] mb-1">Undangan milikmu</h2>
                        <p className="text-neutral-500 text-sm">Undangan yang pernah kamu buat</p>
                    </div>
                    <Link href="#" className="flex items-center gap-1 text-[#9E1045] text-sm font-semibold hover:underline">
                        Selengkapnya <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.03)] border border-neutral-100 p-4">
                    {!invitations || invitations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <p className="text-neutral-500 mb-4">Kamu belum memiliki undangan.</p>
                            <Button asChild className="bg-[#9E1045] hover:bg-[#8B1842]">
                                <Link href="/dashboard/create">Buat Sekarang</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {invitations.map((invitation: any) => (
                                <div key={invitation.id} className="flex flex-col md:flex-row items-center gap-6 p-2">
                                    {/* Thumbnail Placeholder */}
                                    <div className="w-24 h-24 bg-[#Fdf5f6] rounded-xl flex items-center justify-center shrink-0 border border-rose-50">
                                        <Heart className="w-8 h-8 text-[#9E1045]" strokeWidth={1.5} />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold text-[#14213D] mb-1">{invitation.title || invitation.slug || 'Tanpa Judul'}</h3>
                                        <p className="text-neutral-400 text-sm">-</p>
                                        <Link href={`/u/${invitation.slug}`} className="inline-flex items-center gap-2 text-[#9E1045] text-sm font-semibold mt-2 hover:underline">
                                            <Globe className="w-4 h-4" />
                                            Lihat Web
                                        </Link>
                                    </div>

                                    <div className="shrink-0 mt-4 md:mt-0 w-full md:w-auto">
                                        <Button asChild className="w-full md:w-auto bg-[#9E1045] hover:bg-[#8B1842] gap-2 rounded-lg px-6">
                                            <Link href={`/dashboard/edit/${invitation.id}`}>
                                                <Edit2 className="w-4 h-4" /> Kelola
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-neutral-400 mt-8 pt-8 border-t border-neutral-200">
                <p>Made with ❤️ for your Moment | Powered by Wevitation</p>
                <p className="mt-2 md:mt-0">Version: 1.2</p>
            </div>
        </div>
    )
}
