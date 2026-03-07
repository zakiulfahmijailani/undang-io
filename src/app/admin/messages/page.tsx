import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, MessageSquareText, ShieldAlert, Clock } from "lucide-react"

export default function AdminMessagesPage() {
    const dummyMessages = [
        { id: 1, sender: "Keluarga Besar Budi", to: "Andi & Rina", msg: "Selamat menempuh hidup baru anakku. Semoga menjadi keluarga SaMaWa. Jangan lupa spam WA ya kalau sudah sampai rumah baru wkwk.", status: "pending", time: "2 jam yang lalu" },
        { id: 2, sender: "Anonymous", to: "Budi & Ani", msg: "Semoga cepat cerai anjing.", status: "pending", time: "5 jam yang lalu", flagged: true },
        { id: 3, sender: "Siti Rekan Kerja", to: "Anton & Lina", msg: "Happy wedding boss! Maaf ga bisa dateng, amplopnya nyusul ya via transfer QRIS aja biar gampang 😘", status: "pending", time: "1 hari yang lalu" },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#14213D]">Moderasi Ucapan</h1>
                    <p className="text-gray-500 mt-1">Tinjau dan setujui pesan ucapan yang berpotensi melanggar ketentuan.</p>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 border border-yellow-200 px-4 py-2 rounded-lg text-sm font-medium shadow-sm">
                    <Clock className="w-4 h-4" /> 3 Menunggu Moderasi
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                {dummyMessages.map((message) => (
                    <Card key={message.id} className={`border ${message.flagged ? 'border-red-200 bg-red-50/30' : 'border-gray-200'} shadow-sm transition-all`}>
                        <CardContent className="p-5 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <MessageSquareText className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#14213D] leading-tight flex items-center gap-2">
                                            {message.sender}
                                            {message.flagged && (
                                                <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    <ShieldAlert className="w-3 h-3" /> Flagged (Toxic)
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Dikirim ke undangan <span className="font-semibold">{message.to}</span> • {message.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 bg-white p-4 rounded-lg border border-gray-100 text-gray-700 text-sm">
                                    "{message.msg}"
                                </div>
                            </div>

                            <div className="flex md:flex-col gap-3 shrink-0 pt-2 md:pt-0 justify-end md:justify-center border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 mt-4 md:mt-0">
                                <Button className="bg-green-600 hover:bg-green-700 text-white md:w-full gap-2">
                                    <Check className="w-4 h-4" /> Setujui
                                </Button>
                                <Button variant="destructive" className="md:w-full gap-2">
                                    <X className="w-4 h-4" /> Tolak/Hapus
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {dummyMessages.length === 0 && (
                    <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-xl">
                        <MessageSquareText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-gray-700">Tidak ada pesan tertunda</h3>
                        <p className="text-gray-500 text-sm">Semua ucapan tamu sudah termoderasi dengan baik.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
