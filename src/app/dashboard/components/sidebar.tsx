"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const supabase = createBrowserSupabaseClient()
            await supabase.auth.signOut()
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { name: "Invitations", href: "/dashboard/undangan", icon: "auto_awesome" },
        { name: "Analytics", href: "/dashboard/analytics", icon: "insights" },
        { name: "Settings", href: "/dashboard/akun", icon: "settings" },
    ]

    return (
        <>
            {/* Desktop Sidebar (Authority: Shared Components JSON inspired) */}
            <aside
                className={`h-screen flex-shrink-0 fixed left-0 top-0 bg-surface-container-low dark:bg-primary flex flex-col p-6 space-y-8 shadow-2xl shadow-primary/10 z-50 transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none'
                }`}
            >
                <div className="mb-4">
                    <span className="text-xl font-bold text-primary dark:text-on-tertiary-container">Undang-io</span>
                </div>

                <button 
                    onClick={() => router.push('/buat-undangan')}
                    className="w-full bg-primary text-on-primary rounded-full py-3 px-6 flex items-center justify-center gap-2 font-['Inter'] text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Create New
                </button>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:translate-x-1 ${
                                    isActive 
                                    ? "bg-tertiary-container/20 text-tertiary border-r-4 border-on-tertiary-container font-semibold" 
                                    : "text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                <span className="font-['Inter'] text-sm uppercase tracking-widest">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="pt-8 mt-auto border-t border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-on-tertiary-container overflow-hidden">
                           <span className="material-symbols-outlined">person</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-primary dark:text-slate-200">Titanium Account</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Premium Plan</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl px-4 py-3 flex items-center gap-3 transition-all hover:translate-x-1 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-['Inter'] text-sm font-semibold uppercase tracking-widest">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar (Bottom Nav) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/10 px-2 py-4 flex justify-around items-center z-50 shadow-2xl rounded-t-[32px]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}
                        >
                            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
