"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { DEFAULT_INVITATION_THEME_CATEGORY, DEFAULT_INVITATION_THEME_KEY, DEFAULT_INVITATION_THEME_NAME } from "@/lib/default-theme"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

type DashboardTheme = {
    id: string
    name: string
    category: string
    price: "Gratis" | "Premium"
    gradient: string
    preview: "sakinah" | "placeholder"
    slug: string
}

export default function SelectThemePage() {
    const [selectedCategory, setSelectedCategory] = useState("Semua")
    const [selectedPrice, setSelectedPrice] = useState("Semua")
    const [themes, setThemes] = useState<DashboardTheme[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const categories = ["Semua", DEFAULT_INVITATION_THEME_CATEGORY, "Minimalis", "Jawa", "Sunda", "Modern", "Romantis"]
    const prices = ["Semua", "Gratis", "Premium"]

    useEffect(() => {
        async function fetchThemes() {
            try {
                const supabase = createBrowserSupabaseClient()
                const { data, error } = await supabase
                    .from("classic_themes")
                    .select("id, name, cultural_category, slug")
                    .eq("status", "active")
                    .eq("is_published", true)
                    .order("created_at", { ascending: true })

                if (error) throw error

                const mapped: DashboardTheme[] = (data || []).map(row => ({
                    id: row.id,
                    name: row.name || "Tanpa Nama",
                    category: row.cultural_category || "Lainnya",
                    price: "Gratis", // Freemium model default
                    gradient: "from-[#EFF7FB] via-[#DCECF5] to-[#C9DDEB]",
                    preview: row.slug === "sakinah-serenity" ? "sakinah" : "placeholder",
                    slug: row.slug || row.id
                }))
                
                setThemes(mapped)
            } catch (err) {
                console.error("Failed to fetch themes", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchThemes()
    }, [])

    const filteredThemes = themes.filter(theme => {
        const matchCategory = selectedCategory === "Semua" || theme.category === selectedCategory;
        const matchPrice = selectedPrice === "Semua" || theme.price === selectedPrice;
        return matchCategory && matchPrice;
    });

    const previewHref = (theme: DashboardTheme) =>
        theme.slug === "sakinah-serenity"
            ? `/invite/demo?preview=true&theme=${theme.slug}`
            : "/invite/demo?preview=true&theme=legacy";

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-serif font-bold text-[#14213D]">Pilih Tema Undanganmu</h1>
                <p className="text-gray-500 mt-1 text-lg">Sesuaikan tampilan undangan sesuai dengan konsep perayaan Anda.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori Tema</span>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-[#14213D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 flex flex-col gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Harga</span>
                    <div className="flex gap-2">
                        {prices.map((price) => (
                            <button
                                key={price}
                                onClick={() => setSelectedPrice(price)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPrice === price ? 'bg-[#FCA311] text-[#14213D]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {price}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThemes.map((theme) => (
                    <Card key={theme.id} className="overflow-hidden border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col bg-white">
                        {/* Image Placeholder with elegant gradient */}
                        <div className={`aspect-[3/4] bg-gradient-to-br ${theme.gradient} relative overflow-hidden flex items-center justify-center`}>
                            {/* Decorative elements for the placeholder */}
                            {theme.preview === "sakinah" ? (
                                <>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.86),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(195,163,107,0.28),transparent_38%)]" />
                                    <div className="absolute left-6 top-8 h-24 w-24 rounded-full border border-[#C3A36B]/35 bg-white/25 blur-sm" />
                                    <div className="absolute bottom-8 right-8 h-28 w-28 rounded-full border border-white/50 bg-white/20 blur-sm" />
                                    <div className="relative flex h-52 w-40 flex-col items-center justify-center rounded-[32px] border border-[#C3A36B]/45 bg-white/45 px-5 text-center shadow-[0_18px_50px_rgba(66,94,112,0.16)] backdrop-blur-sm">
                                        <span className="font-serif text-5xl font-semibold text-[#8A6F42]">SS</span>
                                        <span className="mt-3 h-px w-12 bg-[#C3A36B]/70" />
                                        <span className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#536979]">Sakinah</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                                    <div className="w-24 h-32 border-2 border-white/20 rotate-12 flex items-center justify-center rounded-sm">
                                        <span className="text-white/40 font-serif font-bold italic tracking-widest text-lg transform -rotate-12">umuman</span>
                                    </div>
                                </>
                            )}

                            <div className="absolute top-3 right-3 flex gap-2">
                                <Badge className={`shadow-md ${theme.price === 'Premium' ? 'bg-[#FCA311] text-[#14213D] hover:bg-[#FCA311]/90' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                                    {theme.price}
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-5 flex-1 flex flex-col">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">{theme.category}</span>
                            <h3 className="font-serif text-xl font-bold text-[#14213D] mb-4">{theme.name}</h3>

                            <div className="mt-auto flex flex-col gap-2">
                                <Link href={previewHref(theme)} className="w-full">
                                    <Button variant="secondary" className="w-full gap-2 border border-gray-300 text-gray-600 bg-white hover:bg-gray-50">
                                        <Eye className="w-4 h-4" /> Live Preview
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/undangan/baru/form?tema=${theme.slug}`} className="w-full">
                                    <Button className="w-full bg-[#14213D] hover:bg-[#1a2b50] text-white gap-2 transition-all group-hover:bg-[#FCA311] group-hover:text-[#14213D]">
                                        Pilih Tema Ini <ChevronRight className="w-4 h-4 ml-auto" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredThemes.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <h3 className="text-xl font-serif font-bold text-gray-800">Tema Tidak Ditemukan</h3>
                        <p className="text-gray-500 mt-2">Coba ubah filter kategori atau harga yang Anda pilih.</p>
                        <Button
                            variant="secondary"
                            className="mt-4 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                            onClick={() => { setSelectedCategory("Semua"); setSelectedPrice("Semua"); }}
                        >
                            Reset Filter
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
