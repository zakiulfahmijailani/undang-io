"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { OwnerSidebar } from "./components/sidebar"
import { Menu, Crown } from "lucide-react"

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()

    const getPageTitle = () => {
        if (pathname?.includes('/users')) return 'Semua Pengguna'
        if (pathname?.includes('/transactions')) return 'Semua Transaksi'
        if (pathname?.includes('/settings')) return 'Pengaturan Sistem'
        return 'Owner Dashboard'
    }

    return (
        <div className="flex h-screen w-full bg-[#f8f9fa] overflow-hidden selection:bg-[#10B981]/20">
            <OwnerSidebar isOpen={isSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-0 relative">
                {/* Global Top Header */}
                <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <Menu className="w-6 h-6" strokeWidth={2} />
                        </button>
                        <h2 className="text-xl font-serif font-bold text-[#0B0F19] hidden md:block">{getPageTitle()}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest hidden sm:inline">Owner</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#0B0F19] text-[#10B981] font-bold flex items-center justify-center shadow-md border-2 border-[#10B981]">
                            OW
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-8 pt-6">
                    {children}
                </div>
            </main>
        </div>
    )
}
