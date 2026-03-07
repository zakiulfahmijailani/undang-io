"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "./components/sidebar"
import { Monitor, Menu } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()

    const getPageTitle = () => {
        if (pathname?.includes('/transaksi')) return 'Upgrade Paket'
        if (pathname?.includes('/cs')) return 'Customer Service'
        return 'Dashboard'
    }

    return (
        <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-0 relative">
                {/* Global Top Header */}
                <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-10 bg-[#FAFAFA]/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-[#8B1842] hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <Menu className="w-8 h-8" strokeWidth={2.5} />
                        </button>
                        <h2 className="text-xl font-bold text-[#14213d] hidden md:block">{getPageTitle()}</h2>
                    </div>

                    <div className="flex items-center gap-4 border-b border-transparent">
                        <button className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors shadow-sm border border-rose-100">
                            <Monitor className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-[#8B1842] text-white font-semibold flex items-center justify-center shadow-md hover:bg-[#721134] transition-colors">
                            AD
                        </button>
                    </div>
                </header>
                <div className="p-8 pt-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
