"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navGroups = [
    {
        label: "🌐 PUBLIC",
        links: [
            { name: "Landing Page", href: "/" },
            { name: "Halaman Undangan Contoh", href: "/u/demo" },
        ],
    },
    {
        label: "🔐 AUTH",
        links: [
            { name: "Login", href: "/login" },
            { name: "Register", href: "/register" },
        ],
    },
    {
        label: "👫 DASHBOARD PASANGAN",
        links: [
            { name: "Overview", href: "/dashboard" },
            { name: "Undangan Saya", href: "/dashboard/undangan" },
            { name: "Buat Undangan Baru", href: "/dashboard/create" },
            { name: "Riwayat Transaksi", href: "/dashboard/transaksi" },
            { name: "Customer Service", href: "/dashboard/cs" },
        ],
    },
    {
        label: "🛡️ DASHBOARD ADMIN",
        links: [
            { name: "Kelola Tema", href: "/dashboard/themes" },
        ],
    },
    {
        label: "👑 DASHBOARD OWNER",
        links: [
            { name: "Overview Owner", href: "/owner/dashboard" },
        ],
    },
]

export default function DevNavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div className="fixed bottom-4 left-4 z-[9999]">
            {/* Expanded Panel */}
            {isOpen && (
                <div className="mb-3 w-72 max-h-[80vh] overflow-y-auto bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
                    {/* Header */}
                    <div className="sticky top-0 bg-slate-900 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between rounded-t-2xl">
                        <span className="text-sm font-bold tracking-wider flex items-center gap-2">🧭 DEV NAV</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white text-lg leading-none transition-colors cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Navigation Groups */}
                    <div className="p-3 flex flex-col gap-1">
                        {navGroups.map((group) => (
                            <div key={group.label} className="mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 block mb-1">
                                    {group.label}
                                </span>
                                {group.links.map((link) => {
                                    const isActive = pathname === link.href
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`block px-3 py-1.5 rounded-lg text-xs transition-all ${isActive
                                                    ? "bg-yellow-500/20 text-yellow-400 font-bold"
                                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                                }`}
                                        >
                                            <span className="text-slate-600 mr-1.5">·</span>
                                            {link.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-slate-900 text-white shadow-2xl border border-slate-700/50 flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all cursor-pointer select-none"
                title="Dev Navigation"
            >
                🧭
            </button>
        </div>
    )
}
