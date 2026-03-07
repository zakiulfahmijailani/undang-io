import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutTemplate, Plus, Eye, EyeOff } from "lucide-react"

export default function AdminThemesPage() {
    const dummyThemes = [
        { id: 1, name: "Classic Gold", code: "TH-001", type: "Premium", published: true, isNew: false },
        { id: 2, name: "Rustic Floral", code: "TH-002", type: "Gratis", published: true, isNew: false },
        { id: 3, name: "Modern Minimalist", code: "TH-003", type: "Premium", published: false, isNew: true },
        { id: 4, name: "Traditional Javanese", code: "TH-004", type: "Eksklusif", published: true, isNew: true },
        { id: 5, name: "Ocean Blue", code: "TH-005", type: "Gratis", published: false, isNew: false },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#14213D]">Kelola Tema</h1>
                    <p className="text-gray-500 mt-1">Atur ketersediaan tema undangan di platform umuman.</p>
                </div>
                <Button className="bg-[#14213D] hover:bg-[#1a2b50] text-white gap-2">
                    <Plus className="w-4 h-4" /> Tambah Tema Baru
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {dummyThemes.map((theme) => (
                    <Card key={theme.id} className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-100 relative group border-b border-gray-100 flex items-center justify-center">
                            <LayoutTemplate className="w-12 h-12 text-gray-300" />

                            {/* Theme Tags */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                <Badge className={
                                    theme.type === 'Eksklusif' ? 'bg-purple-500 hover:bg-purple-600' :
                                        theme.type === 'Premium' ? 'bg-[#FCA311] text-[#14213D] hover:bg-[#e5940c]' :
                                            'bg-gray-500 hover:bg-gray-600'
                                }>
                                    {theme.type}
                                </Badge>
                                {theme.isNew && (
                                    <Badge variant="destructive" className="bg-red-500 hover:bg-red-600 w-fit">BARU</Badge>
                                )}
                            </div>

                            {/* Status Overlay */}
                            {!theme.published && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                    <div className="bg-white/90 px-3 py-1.5 rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-200 flex items-center gap-1.5">
                                        <EyeOff className="w-3.5 h-3.5" /> Tidak Dipublikasikan
                                    </div>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-serif text-lg font-bold text-[#14213D]">{theme.name}</h3>
                                    <p className="text-xs font-mono text-gray-400 mt-0.5">{theme.code}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant={theme.published ? "ghost" : "primary"}
                                    className={`flex-1 text-xs border border-gray-200 ${!theme.published ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : 'text-gray-600'}`}
                                >
                                    {theme.published ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    {theme.published ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button variant="secondary" className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200">
                                    Edit Detail
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
