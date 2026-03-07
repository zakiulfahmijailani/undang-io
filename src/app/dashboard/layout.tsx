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
        if (pathname?.includes('/undangan/baru')) return 'Buat Undangan Baru'
        if (pathname?.includes('/undangan')) return 'Undangan Saya'
        if (pathname?.includes('/tema')) return 'Pilih Tema'
        if (pathname?.includes('/akun')) return 'Akun & Langganan'
        return 'Beranda Dashboard'
    }

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden selection:bg-primary/20">
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto pb-20 md:pb-0 relative">
                {/* Global Top Header */}
                <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-muted-foreground hover:bg-secondary p-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <Menu className="w-6 h-6" strokeWidth={2} />
                        </button>
                        <h2 className="text-xl font-serif font-bold text-foreground hidden md:block">{getPageTitle()}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors shadow-sm">
                            <Monitor className="w-5 h-5" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center shadow-md">
                            BS
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
