"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SelectThemePage() {
    const [selectedCategory, setSelectedCategory] = useState("Semua")
    const [selectedPrice, setSelectedPrice] = useState("Semua")

    const categories = ["Semua", "Minimalis", "Jawa", "Sunda", "Modern", "Romantis"]
    const prices = ["Semua", "Gratis", "Premium"]

    const dummyThemes = [
        { id: "th-01", name: "Elegant Minimalist", category: "Minimalis", price: "Gratis", gradient: "from-gray-100 to-gray-300" },
        { id: "th-02", name: "Classic Javanese", category: "Jawa", price: "Premium", gradient: "from-amber-700 to-amber-900" },
        { id: "th-03", name: "Modern Sundanese", category: "Sunda", price: "Premium", gradient: "from-teal-600 to-teal-800" },
        { id: "th-04", name: "Romantic Rose", category: "Romantis", price: "Gratis", gradient: "from-rose-100 to-rose-300" },
        { id: "th-05", name: "Dark Modern", category: "Modern", price: "Premium", gradient: "from-slate-800 to-slate-950" },
        { id: "th-06", name: "Pure White", category: "Minimalis", price: "Gratis", gradient: "from-stone-50 to-stone-200" },
    ];

    const filteredThemes = dummyThemes.filter(theme => {
        const matchCategory = selectedCategory === "Semua" || theme.category === selectedCategory;
        const matchPrice = selectedPrice === "Semua" || theme.price === selectedPrice;
        return matchCategory && matchPrice;
    });

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
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                            <div className="w-24 h-32 border-2 border-white/20 rotate-12 flex items-center justify-center rounded-sm">
                                <span className="text-white/40 font-serif font-bold italic tracking-widest text-lg transform -rotate-12">umuman</span>
                            </div>

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
                                <Link href="/u/demo" className="w-full">
                                    <Button variant="secondary" className="w-full gap-2 border border-gray-300 text-gray-600 bg-white hover:bg-gray-50">
                                        <Eye className="w-4 h-4" /> Live Preview
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/undangan/baru/wizard?tema=${theme.id}`} className="w-full">
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
