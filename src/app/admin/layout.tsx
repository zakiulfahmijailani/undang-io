"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "./components/sidebar"
import { Menu, ShieldAlert } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()

    const getPageTitle = () => {
        if (pathname?.includes('/users')) return 'Manajemen Pengguna'
        if (pathname?.includes('/themes')) return 'Kelola Tema'
        if (pathname?.includes('/messages')) return 'Moderasi Ucapan'
        return 'Admin Overview'
    }

    return (
        <div className="flex h-screen w-full bg-[#f8f9fa] overflow-hidden selection:bg-[#FCA311]/20">
            <AdminSidebar isOpen={isSidebarOpen} />

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
                        <h2 className="text-xl font-serif font-bold text-[#14213D] hidden md:block">{getPageTitle()}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 rounded-full bg-red-100 border border-red-200 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-bold text-red-700 uppercase tracking-widest hidden sm:inline">Super Admin</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#FCA311] text-[#14213D] font-bold flex items-center justify-center shadow-md border-2 border-white ring-2 ring-[#e5e5e5]">
                            AD
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
