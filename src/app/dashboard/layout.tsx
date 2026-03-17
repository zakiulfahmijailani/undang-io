"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "./components/sidebar"
import { Menu, Bell, Search } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()

    const getPageTitle = () => {
        if (pathname?.includes('/undangan/baru')) return 'Buat Undangan Baru'
        if (pathname?.includes('/undangan'))      return 'Undangan Saya'
        if (pathname?.includes('/tema'))          return 'Pilih Tema'
        if (pathname?.includes('/akun'))          return 'Akun & Langganan'
        if (pathname?.includes('/transaksi'))     return 'Riwayat Transaksi'
        if (pathname?.includes('/cs'))            return 'Bantuan'
        return 'Dashboard'
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F5F0E8]/40">
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

                {/* Top Header */}
                <header className="h-16 shrink-0 flex items-center justify-between px-6 md:px-8 bg-[#FDFCF9] border-b border-[#EDE6D6] sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#726C67] hover:text-[#1E1B18] hover:bg-[#EDE6D6] transition-colors cursor-pointer"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            <span className="text-[#9A9390]">undang.io</span>
                            <span className="text-[#C2BEB8]">/</span>
                            <span className="font-medium text-[#1E1B18]">{getPageTitle()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Search pill */}
                        <div className="hidden md:flex items-center gap-2 bg-[#F5F0E8] rounded-full px-4 py-2 text-sm text-[#9A9390] cursor-text w-48">
                            <Search className="w-3.5 h-3.5" />
                            <span>Cari undangan…</span>
                        </div>

                        {/* Bell */}
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#726C67] hover:bg-[#EDE6D6] transition-colors relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D4A91C]" />
                        </button>

                        {/* Avatar */}
                        <Link
                            href="/dashboard/akun"
                            className="w-8 h-8 rounded-full bg-[#1E1B18] flex items-center justify-center text-xs font-bold text-[#D4A91C] cursor-pointer ml-1"
                            title="Akun"
                        >
                            ZF
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 p-5 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
