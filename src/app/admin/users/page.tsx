import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical, Edit, Trash2, Ban, ShieldCheck } from "lucide-react"

export default function AdminUsersPage() {
    const dummyUsers = [
        { id: 1, name: "Budi Santoso", email: "budi@gmail.com", pkg: "Premium", status: "Aktif", joined: "12 Mar 2026" },
        { id: 2, name: "Ani Yudhoyono", email: "ani.yudah@yahoo.com", pkg: "Gratis", status: "Aktif", joined: "15 Mar 2026" },
        { id: 3, name: "Reza Rahadian", email: "reza.r@outlook.com", pkg: "Eksklusif", status: "Aktif", joined: "18 Mar 2026" },
        { id: 4, name: "Dina Mariana", email: "dina.m@gmail.com", pkg: "Gratis", status: "Suspend", joined: "20 Mar 2026" },
        { id: 5, name: "Eko Patrio", email: "eko.p@gmail.com", pkg: "Premium", status: "Aktif", joined: "22 Mar 2026" },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#14213D]">Manajemen Pengguna</h1>
                    <p className="text-gray-500 mt-1">Kelola data pengguna, status akun, dan paket langganan.</p>
                </div>
            </div>

            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <CardTitle className="text-lg font-serif">Daftar Pengguna</CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau email..."
                                className="h-9 w-full rounded-md border border-gray-200 pl-9 pr-4 text-sm focus:outline-none focus:border-[#FCA311] focus:ring-1 focus:ring-[#FCA311]"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="py-3 px-6">Nama Lengkap</th>
                                    <th className="py-3 px-6 hidden md:table-cell">Email</th>
                                    <th className="py-3 px-6">Paket</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6 hidden lg:table-cell">Bergabung</th>
                                    <th className="py-3 px-6 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {dummyUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6 font-medium text-[#14213D]">{user.name}</td>
                                        <td className="py-4 px-6 text-gray-500 hidden md:table-cell">{user.email}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${user.pkg === 'Eksklusif' ? 'bg-purple-100 text-purple-700' :
                                                user.pkg === 'Premium' ? 'bg-[#FCA311]/20 text-[#b5730a]' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {user.pkg}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center gap-1.5 ${user.status === 'Aktif' ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.status === 'Aktif' ? <ShieldCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 hidden lg:table-cell">{user.joined}</td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 !p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 !p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
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
