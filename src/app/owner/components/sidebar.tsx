"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CreditCard, Settings, LogOut } from "lucide-react"

export function OwnerSidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname()

    const navItems = [
        { name: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
        { name: "Semua Pengguna", href: "/owner/users", icon: Users },
        { name: "Semua Transaksi", href: "/owner/transactions", icon: CreditCard },
        { name: "Pengaturan Sistem", href: "/owner/settings", icon: Settings },
    ]

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`relative hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out bg-[#0B0F19] text-white border-r border-white/10 overflow-hidden ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none'}`}
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center p-6 min-h-[100px] w-64 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <span className="font-serif text-3xl font-bold text-white tracking-wide">
                            umuman
                        </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-[#10B981] mt-1 font-bold">Owner Dashboard</span>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-6 flex flex-col gap-2 w-64">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/owner' && pathname.startsWith(item.href))
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all justify-start ${isActive ? 'bg-[#10B981] text-white font-bold shadow-md shadow-[#10B981]/20' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                                <span className="text-sm">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 mt-auto border-t border-white/10 w-64">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all justify-start text-neutral-400 hover:text-red-400 hover:bg-red-400/10 w-full">
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">Keluar (Owner)</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar (Bottom Nav) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0B0F19] border-t border-white/10 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/owner' && pathname.startsWith(item.href))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${isActive ? 'text-[#10B981]' : 'text-neutral-400'}`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'fill-current/20' : ''}`} />
                            <span className="text-[10px] font-medium text-center leading-tight max-w-[60px] truncate">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
