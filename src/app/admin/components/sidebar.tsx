"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { LayoutDashboard, Users, Palette, MessageSquareText, LogOut, CheckCircle, XCircle } from "lucide-react"

export function AdminSidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname()

    const navItems = [
        { name: "Manajemen Pengguna", href: "/admin/users", icon: Users },
        { name: "Kelola Tema", href: "/admin/themes", icon: Palette },
        { name: "Moderasi Ucapan", href: "/admin/messages", icon: MessageSquareText },
    ]

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`relative hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out bg-[#14213D] text-white border-r border-[#1e305a] overflow-hidden ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none'}`}
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center p-6 min-h-[100px] w-64 border-b border-[#1e305a]">
                    <Link href="/admin" className="flex flex-col items-center gap-4 group">
                        <Image src="/logo.png" alt="umuman logo" width={120} height={120} className="w-30 h-30 object-contain transition-transform group-hover:scale-105 brightness-0 invert" />
                        <span className="font-serif text-3xl font-bold text-white tracking-tight">umuman</span>
                    </Link>
                    <span className="text-[10px] uppercase tracking-widest text-[#FCA311] mt-1 font-bold">Admin Panel</span>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-6 flex flex-col gap-2 w-64">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all justify-start ${isActive ? 'bg-[#FCA311] text-[#14213D] font-bold shadow-md' : 'text-neutral-400 hover:text-white hover:bg-white/10'}`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="text-sm">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 mt-auto border-t border-[#1e305a] w-64">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all justify-start text-neutral-400 hover:text-red-400 hover:bg-red-400/10 w-full">
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">Keluar (Admin)</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar (Bottom Nav) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#14213D] border-t border-[#1e305a] px-2 py-2 flex justify-around items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${isActive ? 'text-[#FCA311]' : 'text-neutral-400'}`}
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
