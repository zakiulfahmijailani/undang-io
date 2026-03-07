"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Mail, FileText, Headset, LogOut } from "lucide-react"
import { SignOutButton } from "./sign-out-button"

export function Sidebar({ isOpen }: { isOpen: boolean }) {
    const pathname = usePathname()

    const navItems = [
        { name: "Home", href: "/dashboard", icon: Home },
        { name: "Undangan", href: "/dashboard/create", icon: Mail },
        { name: "Transaksi", href: "/dashboard/transaksi", icon: FileText },
        { name: "Customer Service", href: "/dashboard/cs", icon: Headset },
    ]

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`relative hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out bg-[#21111A] text-white border-[#3A1E2E] overflow-hidden ${isOpen ? 'w-64 opacity-100 border-r' : 'w-0 opacity-0 border-none'}`}
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center p-6 min-h-[140px] w-64">
                    <div className="relative w-36 h-36 mb-2">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-2 w-64">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all justify-start ${isActive ? 'text-[#D02654]' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Icon className="w-6 h-6 shrink-0" />
                                <span className="font-medium text-sm">
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 mt-auto space-y-4 w-64">
                    <div className="px-3">
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar (Bottom Nav) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-3 flex justify-between items-center z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {navItems.slice(0, 4).map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#8B1842]' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-bold">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
