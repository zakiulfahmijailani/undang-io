"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Home, Mail, FileText, LayoutTemplate, User, LogOut } from "lucide-react"

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname()

    const navItems = [
        { name: "Beranda Dashboard", href: "/dashboard", icon: Home },
        { name: "Undangan Saya", href: "/dashboard/undangan", icon: Mail },
        { name: "Buat Undangan Baru", href: "/dashboard/undangan/baru", icon: FileText },
        { name: "Pilih Tema", href: "/dashboard/tema", icon: LayoutTemplate },
        { name: "Akun & Langganan", href: "/dashboard/akun", icon: User },
    ]

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`relative hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out bg-card text-card-foreground border-r overflow-hidden ${isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-none'}`}
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center p-6 min-h-[100px] w-64 border-b">
                    <Link href="/dashboard" className="flex flex-col items-center gap-4 group">
                        <Image src="/logo.png" alt="umuman logo" width={120} height={120} className="w-30 h-30 object-contain transition-transform group-hover:scale-105" />
                        <span className="font-serif text-3xl font-bold text-primary tracking-tight">umuman</span>
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-6 flex flex-col gap-2 w-64">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all justify-start ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
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
                <div className="p-4 mt-auto border-t w-64">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full">
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-medium">Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar (Bottom Nav) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t px-2 py-2 flex justify-around items-center z-50 shadow-lg">
                {navItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'fill-current opacity-20' : ''}`} />
                            <span className="text-[10px] font-medium text-center leading-tight max-w-[60px] truncate">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
