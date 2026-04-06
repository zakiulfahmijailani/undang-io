"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "./_components/sidebar"
import { Menu, ShieldAlert } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()

    const getPageTitle = () => {
        if (pathname?.includes('/themes')) return 'Kelola Tema'
        return 'Admin Panel'
    }

    return (
        <div className="flex h-screen w-full bg-[#0F0F0F] overflow-hidden">
            <AdminSidebar isOpen={isSidebarOpen} />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-0 relative">
                <header className="h-16 flex items-center justify-between px-8 sticky top-0 z-10 bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-white/50 hover:bg-white/10 p-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <Menu className="w-5 h-5" strokeWidth={2} />
                        </button>
                        <h2 className="text-sm font-medium text-white hidden md:block">{getPageTitle()}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest hidden sm:inline">Super Admin</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                            AD
                        </div>
                    </div>
                </header>

                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    )
}
