"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FileText, Home, Layers, LayoutTemplate, LogOut, Mail, User } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

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
        { name: "Beranda Dashboard", href: "/dashboard", icon: Home },
        { name: "Undangan Saya", href: "/dashboard/undangan", icon: Mail },
        { name: "Buat Undangan Baru", href: "/dashboard/undangan/baru", icon: FileText },
        { name: "Pilih Tema", href: "/dashboard/tema", icon: LayoutTemplate },
        { name: "Kelola Tema", href: "/dashboard/themes", icon: Layers },
        { name: "Akun & Langganan", href: "/dashboard/akun", icon: User },
    ]

    return (
        <>
            <aside
                className={cn(
                    "relative hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-r border-landing-border bg-landing-paper text-landing-ink",
                    isOpen ? "w-64 opacity-100" : "w-0 opacity-0 border-none",
                )}
            >
                <div className="flex w-64 flex-col items-center justify-center border-b border-landing-border px-6 py-8">
                    <Link href="/dashboard" className="group flex flex-col items-center gap-3">
                        <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-landing-gold/30 bg-landing-cream shadow-sm">
                            <Image
                                src="/logo.png"
                                alt="undang.io logo"
                                width={88}
                                height={88}
                                className="h-14 w-14 object-contain transition-transform group-hover:scale-105"
                            />
                        </span>
                        <span className="font-landing-serif text-3xl font-semibold tracking-tight text-landing-ink">
                            undang<span className="text-landing-gold">.io</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex w-64 flex-1 flex-col gap-1 px-4 py-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center gap-3 rounded-2xl px-4 py-3 font-ui text-sm transition-all",
                                    isActive
                                        ? "bg-landing-maroon text-white shadow-landing-button"
                                        : "text-landing-muted hover:bg-landing-cream hover:text-landing-maroon",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-xl transition",
                                        isActive ? "bg-white/15 text-landing-gold" : "bg-white text-landing-muted group-hover:text-landing-maroon",
                                    )}
                                >
                                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                </span>
                                <span className="font-semibold">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="w-64 border-t border-landing-border p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-ui text-sm font-semibold text-landing-muted transition-all hover:bg-red-50 hover:text-red-700 cursor-pointer"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white">
                            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </span>
                        Keluar
                    </button>
                </div>
            </aside>

            <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-landing-border bg-landing-paper/95 px-2 py-2 shadow-lg backdrop-blur-xl md:hidden">
                {navItems.slice(0, 5).map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex min-w-0 flex-col items-center gap-1 rounded-xl p-2 transition-colors",
                                isActive ? "text-landing-maroon" : "text-landing-muted",
                            )}
                        >
                            <Icon className="h-5 w-5" aria-hidden="true" />
                            <span className="max-w-[64px] truncate text-center font-ui text-[10px] font-semibold leading-tight">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}
