"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "./components/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()

    const getPageTitle = () => {
        if (pathname?.includes('/undangan/baru')) return 'Create New'
        if (pathname?.includes('/undangan'))      return 'My Invitations'
        if (pathname?.includes('/tema'))          return 'Choose Theme'
        if (pathname?.includes('/akun'))          return 'Account Settings'
        if (pathname?.includes('/analytics'))     return 'Analytics'
        return 'Dashboard'
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-surface-container-low dark:bg-primary">
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content Area */}
            <main className={`flex-1 flex flex-col min-w-0 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>

                {/* Top Header: Editorial Minimalist */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-surface-container-low/80 backdrop-blur-xl sticky top-0 z-40 border-b border-outline-variant/10">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-primary dark:text-on-tertiary-container tracking-tight italic font-light">{getPageTitle()}</h1>
                            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">Undang-io Luxe Concierge</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 bg-white dark:bg-white/5 rounded-full px-5 py-2.5 border border-outline-variant/10 shadow-sm">
                            <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="bg-transparent border-none outline-none text-xs font-['Inter'] w-48 text-primary placeholder:text-slate-300"
                            />
                        </div>

                        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-white transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-tertiary-fixed-dim" />
                        </button>

                        <Link
                            href="/dashboard/akun"
                            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-white/20 shadow-lg cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-on-tertiary-container text-xl">person</span>
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 p-8 pb-32 md:pb-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
