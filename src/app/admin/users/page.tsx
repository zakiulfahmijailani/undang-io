import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Eye, Ban, ShieldCheck, Filter, AlertTriangle } from "lucide-react"

interface UserRow {
    id: string
    full_name: string | null
    email: string | null
    role: string | null
    created_at: string
    total_invitations: number
}

export default async function AdminUsersPage() {
    const supabase = await createClient()

    const { data: users, error } = await supabase
        .from("profiles")
        .select(`
            id,
            full_name,
            email,
            role,
            created_at,
            invitations ( id )
        `)
        .order("created_at", { ascending: false })

    const rows: UserRow[] = (users ?? []).map((u: any) => ({
        id: u.id,
        full_name: u.full_name,
        email: u.email,
        role: u.role ?? "user",
        created_at: u.created_at,
        total_invitations: Array.isArray(u.invitations) ? u.invitations.length : 0,
    }))

    function formatDate(iso: string) {
        return new Date(iso).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

    function roleLabel(role: string | null) {
        if (role === "admin") return { label: "Admin", cls: "bg-purple-100 text-purple-700" }
        return { label: "User", cls: "bg-gray-100 text-gray-600" }
    }

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#14213D]">Manajemen Pengguna</h1>
                    <p className="text-gray-500 mt-1">Kelola data pengguna, status akun, dan paket langganan.</p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Gagal memuat data pengguna: {error.message}
                </div>
            )}

            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <CardTitle className="text-lg font-serif">
                            Daftar Pengguna
                            <span className="ml-2 text-sm font-normal text-gray-400">({rows.length} akun)</span>
                        </CardTitle>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau email..."
                                    className="h-9 w-full rounded-md border border-gray-200 pl-9 pr-4 text-sm focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311]"
                                />
                            </div>
                            <div className="relative">
                                <select className="h-9 rounded-md border border-gray-200 px-3 pr-8 text-sm focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311] appearance-none bg-white font-medium text-gray-600">
                                    <option value="all">Semua Role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <Filter className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="py-3 px-6">Nama Lengkap</th>
                                    <th className="py-3 px-6">Email</th>
                                    <th className="py-3 px-6">Role</th>
                                    <th className="py-3 px-6 text-center">Jumlah Undangan</th>
                                    <th className="py-3 px-6">Tanggal Daftar</th>
                                    <th className="py-3 px-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {rows.length === 0 && !error && (
                                    <tr>
                                        <td colSpan={6} className="py-16 text-center text-gray-400">
                                            Belum ada pengguna terdaftar.
                                        </td>
                                    </tr>
                                )}
                                {rows.map((user) => {
                                    const { label, cls } = roleLabel(user.role)
                                    return (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6 font-medium text-[#14213D]">
                                                {user.full_name ?? <span className="text-gray-400 italic">—</span>}
                                            </td>
                                            <td className="py-4 px-6 text-gray-500">{user.email}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${cls}`}>
                                                    {label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center font-medium text-[#14213D]">
                                                {user.total_invitations}
                                            </td>
                                            <td className="py-4 px-6 text-gray-400">{formatDate(user.created_at)}</td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="secondary" size="sm" className="h-8 gap-1.5 text-blue-600 border border-blue-200 hover:bg-blue-50 bg-white">
                                                        <Eye className="h-3.5 w-3.5" /> Lihat Detail
                                                    </Button>
                                                    <Button variant="secondary" size="sm" className="h-8 gap-1.5 text-red-600 border border-red-200 hover:bg-red-50 bg-white">
                                                        <Ban className="h-3.5 w-3.5" /> Suspend
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
