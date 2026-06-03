"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Bell, Menu, Search, Sparkles } from "lucide-react"
import { Sidebar } from "./components/sidebar"

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
        <div className="flex h-screen w-full overflow-hidden bg-landing-cream">
            <Sidebar isOpen={isSidebarOpen} />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <header className="h-16 shrink-0 flex items-center justify-between px-6 md:px-8 bg-landing-paper/95 border-b border-landing-border sticky top-0 z-20 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-9 h-9 rounded-md flex items-center justify-center text-landing-muted hover:text-landing-maroon hover:bg-landing-cream transition-colors cursor-pointer"
                            aria-label="Toggle sidebar"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        <div className="hidden md:flex items-center gap-2 font-ui text-sm">
                            <span className="text-landing-muted">undang.io</span>
                            <span className="text-landing-border">/</span>
                            <span className="font-semibold text-landing-ink">{getPageTitle()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden md:flex h-9 items-center gap-2 rounded-full border border-landing-border bg-white px-4 font-ui text-sm text-landing-muted cursor-text w-56">
                            <Search className="w-3.5 h-3.5" />
                            <span>Cari undangan...</span>
                        </div>

                        <button className="w-9 h-9 rounded-full flex items-center justify-center text-landing-muted hover:bg-landing-cream hover:text-landing-maroon transition-colors relative">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-landing-gold" />
                        </button>

                        <Link
                            href="/dashboard/akun"
                            className="w-9 h-9 rounded-full bg-landing-maroon flex items-center justify-center text-xs font-bold text-white cursor-pointer ml-1 ring-2 ring-landing-gold/30"
                            title="Akun"
                        >
                            <Sparkles className="h-4 w-4 text-landing-gold" aria-hidden="true" />
                        </Link>
                    </div>
                </header>

                <div className="flex-1 p-5 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
