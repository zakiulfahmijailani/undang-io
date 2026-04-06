"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Palette, LogOut } from "lucide-react"
import { signOut } from "@/app/(auth)/actions"

export function AdminSidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname()

    const navItems = [
        { name: "Kelola Tema", href: "/admin/themes", icon: Palette },
    ]

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`relative hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out bg-[#0A0A0A] text-white border-r border-white/5 overflow-hidden ${
                    isOpen ? 'w-56 opacity-100' : 'w-0 opacity-0 border-none'
                }`}
            >
                <div className="flex flex-col items-center justify-center p-6 border-b border-white/5">
                    <Link href="/admin/themes" className="flex flex-col items-center gap-2 group">
                        <span className="font-bold text-xl text-white tracking-tight">undang.io</span>
                        <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Admin Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href)
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                    isActive
                                        ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-3 border-t border-white/5">
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-white/40 hover:text-red-400 hover:bg-red-400/10 w-full"
                        >
                            <LogOut className="w-4 h-4 shrink-0" />
                            <span className="text-sm">Keluar</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-white/5 px-2 py-2 flex justify-around items-center z-50">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href)
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                                isActive ? 'text-emerald-400' : 'text-white/40'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
