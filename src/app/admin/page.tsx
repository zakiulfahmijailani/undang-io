import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Palette, MessageSquareText, TrendingUp, CreditCard } from "lucide-react"

export default function AdminOverviewPage() {
    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-serif font-bold text-[#14213D]">Ringkasan Sistem</h1>
                <p className="text-gray-500 mt-1 text-lg">Pantau aktivitas platform umuman secara real-time.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Pengguna</CardTitle>
                        <Users className="w-4 h-4 text-[#FCA311]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#14213D]">2,845</div>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +124 minggu ini
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Undangan</CardTitle>
                        <Palette className="w-4 h-4 text-[#FCA311]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#14213D]">1,203</div>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +56 minggu ini
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Ucapan Tertunda</CardTitle>
                        <MessageSquareText className="w-4 h-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#14213D]">48</div>
                        <p className="text-xs text-red-500 mt-1 cursor-pointer hover:underline">
                            Perlu dimoderasi segera
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Pendapatan (Bulan Ini)</CardTitle>
                        <CreditCard className="w-4 h-4 text-[#FCA311]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[#14213D]">Rp 14.5M</div>
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> +8.2% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity (Dummy) */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-serif">Pendaftaran Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Andi Wijaya", email: "andi@gmail.com", time: "10 menit yang lalu" },
                                { name: "Siti Nurhaliza", email: "siti.n@yahoo.com", time: "32 menit yang lalu" },
                                { name: "Budi Santoso", email: "b.santoso@outlook.com", time: "1 jam yang lalu" },
                            ].map((user, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium text-[#14213D]">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{user.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-serif">Transaksi Sukses Terakhir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { pkg: "Paket Premium", user: "Rina & Dimas", amount: "Rp 99.000" },
                                { pkg: "Paket Eksklusif", user: "Maya & Eko", amount: "Rp 249.000" },
                                { pkg: "Paket Premium", user: "Dina & Reza", amount: "Rp 99.000" },
                            ].map((tx, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-[#14213D]">{tx.user}</p>
                                            <p className="text-xs text-gray-500">{tx.pkg}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-[#14213D]">{tx.amount}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
