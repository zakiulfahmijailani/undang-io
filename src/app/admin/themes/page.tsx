import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutTemplate, Plus, CheckCircle, Edit, CircleSlash } from "lucide-react"

export default function AdminThemesPage() {
    const dummyThemes = [
        { id: 1, name: "Classic Gold", category: "Pernikahan", price: "Rp 99.000", published: true },
        { id: 2, name: "Rustic Floral", category: "Pernikahan", price: "Gratis", published: true },
        { id: 3, name: "Modern Minimalist", category: "Umum", price: "Rp 99.000", published: false },
        { id: 4, name: "Traditional Javanese", category: "Pernikahan", price: "Rp 249.000", published: true },
        { id: 5, name: "Ocean Blue", category: "Khitanan", price: "Gratis", published: false },
        { id: 6, name: "Luxury Black", category: "Pernikahan", price: "Rp 249.000", published: true },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#14213D]">Kelola Tema</h1>
                    <p className="text-gray-500 mt-1">Atur ketersediaan tema undangan di platform umuman.</p>
                </div>
                <Button className="bg-[#14213D] hover:bg-[#1a2b50] text-white gap-2 shadow-lg">
                    <Plus className="w-4 h-4" /> Tambah Tema Baru
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {dummyThemes.map((theme) => (
                    <Card key={theme.id} className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-[4/3] bg-gray-100 relative group border-b border-gray-100 flex flex-col items-center justify-center">
                            <LayoutTemplate className="w-16 h-16 text-gray-300 mb-2" />
                            <span className="text-sm font-medium text-gray-400">Thumbnail Preview</span>

                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                <Badge className="bg-primary hover:bg-primary/90">
                                    {theme.category}
                                </Badge>
                            </div>

                            <div className="absolute top-3 right-3 font-bold text-[#14213D] bg-white/90 backdrop-blur px-2.5 py-1 rounded-sm shadow-sm text-sm border border-gray-200">
                                {theme.price}
                            </div>
                        </div>
                        <CardContent className="p-5">
                            <div className="mb-4">
                                <h3 className="font-serif text-xl font-bold text-[#14213D] leading-tight mb-1">{theme.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs font-semibold">
                                    <span className={theme.published ? "text-green-600 flex items-center gap-1" : "text-gray-500 flex items-center gap-1"}>
                                        {theme.published ? <CheckCircle className="w-3.5 h-3.5" /> : <CircleSlash className="w-3.5 h-3.5" />}
                                        {theme.published ? "Published" : "Draft"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mt-5 border-t border-gray-100 pt-5">
                                <Button
                                    variant="secondary"
                                    className={`flex-1 text-xs gap-1.5 border ${theme.published ? 'text-gray-600 border-gray-200 bg-white' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800'}`}
                                >
                                    {theme.published ? 'Set as Draft' : 'Publish Tema'}
                                </Button>
                                <Button variant="secondary" className="flex-1 text-xs gap-1.5 bg-[#14213D]/5 text-[#14213D] hover:bg-[#14213D]/10">
                                    <Edit className="w-3.5 h-3.5" /> Edit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

