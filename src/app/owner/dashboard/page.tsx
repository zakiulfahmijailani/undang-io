"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MailOpen, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';

export default function OwnerDashboardPage() {
    // Dummy Data for Charts
    const revenueData = [
        { month: 'Sep', revenue: 9500000 },
        { month: 'Okt', revenue: 12000000 },
        { month: 'Nov', revenue: 11200000 },
        { month: 'Des', revenue: 18400000 },
        { month: 'Jan', revenue: 16500000 },
        { month: 'Feb', revenue: 21800000 },
    ];

    const packageDistributionData = [
        { name: 'Free', value: 8500, fill: '#94a3b8' },
        { name: 'Premium', value: 2500, fill: '#10B981' },
        { name: 'Eksklusif', value: 1200, fill: '#8b5cf6' },
    ];

    // Dummy Transactions
    const recentTransactions = [
        { id: "TRX-001", user: "Budi Santoso", pkg: "Eksklusif", amount: 249000, method: "QRIS", status: "Sukses", date: "12 Mar, 14:30" },
        { id: "TRX-002", user: "Andi Wijaya", pkg: "Premium", amount: 99000, method: "Transfer Bank", status: "Sukses", date: "12 Mar, 11:15" },
        { id: "TRX-003", user: "Siti Amelia", pkg: "Premium", amount: 99000, method: "GoPay", status: "Pending", date: "11 Mar, 19:40" },
        { id: "TRX-004", user: "Reza Rahadian", pkg: "Eksklusif", amount: 249000, method: "OVO", status: "Sukses", date: "11 Mar, 16:05" },
        { id: "TRX-005", user: "Dina Mariana", pkg: "Premium", amount: 99000, method: "QRIS", status: "Gagal", date: "11 Mar, 10:22" },
        { id: "TRX-006", user: "Eko Patrio", pkg: "Eksklusif", amount: 249000, method: "Virtual Account", status: "Sukses", date: "10 Mar, 09:10" },
        { id: "TRX-007", user: "Ayu Ting Ting", pkg: "Premium", amount: 99000, method: "ShopeePay", status: "Sukses", date: "09 Mar, 21:45" },
        { id: "TRX-008", user: "Raffi Ahmad", pkg: "Eksklusif", amount: 249000, method: "LinkAja", status: "Sukses", date: "09 Mar, 15:30" },
        { id: "TRX-009", user: "Nagita Slavina", pkg: "Premium", amount: 99000, method: "QRIS", status: "Sukses", date: "08 Mar, 12:00" },
        { id: "TRX-010", user: "Deddy Corbuzier", pkg: "Eksklusif", amount: 249000, method: "Transfer Bank", status: "Sukses", date: "07 Mar, 08:30" },
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-serif font-bold text-[#0B0F19]">Statistik Bisnis</h1>
                <p className="text-gray-500 mt-1 text-lg">Gambaran menyeluruh metrik pertumbuhan dan pendapatan umuman.</p>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Pengguna Terdaftar</CardTitle>
                        <Users className="w-4 h-4 text-[#10B981]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#0B0F19]">12,543</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +15.2% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Undangan Dibuat</CardTitle>
                        <MailOpen className="w-4 h-4 text-[#10B981]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#0B0F19]">9,205</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +18.4% dari bulan lalu
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-emerald-200 shadow-sm bg-emerald-50/30">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Revenue Bulan Ini</CardTitle>
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-700">Rp 4.250.000</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +43% dibandingkan Feb
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Konversi Free → Premium</CardTitle>
                        <TrendingUp className="w-4 h-4 text-[#10B981]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#0B0F19]">12.8%</div>
                        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> Target Q1: 15.0%
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Line Chart: Revenue */}
                <Card className="md:col-span-2 border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-serif">Tren Pendapatan (6 Bulan Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={revenueData}
                                    margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickFormatter={(value) => `Rp${value / 1000000}M`}
                                        dx={-10}
                                    />
                                    <RechartsTooltip
                                        formatter={(value: any) => formatCurrency(Number(value))}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#0a8f61' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Bar Chart: Distribution */}
                <Card className="md:col-span-1 border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="font-serif">Distribusi Paket (%)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={packageDistributionData}
                                    margin={{ top: 20, right: 0, left: -25, bottom: 0 }}
                                    barSize={40}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: 'transparent' }}
                                        formatter={(value: any) => `${value.toLocaleString('id-ID')} user`}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table: Recent Transactions */}
            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-lg font-serif">10 Transaksi Terakhir</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="py-3 px-6">Nama</th>
                                    <th className="py-3 px-6">Paket</th>
                                    <th className="py-3 px-6">Nominal</th>
                                    <th className="py-3 px-6">Metode</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-[#0B0F19]">{tx.user}</td>
                                        <td className="py-4 px-6 text-gray-600">{tx.pkg}</td>
                                        <td className="py-4 px-6 font-semibold text-[#0B0F19]">{formatCurrency(tx.amount)}</td>
                                        <td className="py-4 px-6 text-gray-600">{tx.method}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${tx.status === 'Sukses' ? 'bg-emerald-100 text-emerald-700' :
                                                tx.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500">{tx.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
