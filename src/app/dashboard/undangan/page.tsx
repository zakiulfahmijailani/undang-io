import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, Edit, Trash2, Calendar, Users, MailOpen, MessageSquareHeart, LayoutTemplate } from "lucide-react"
import Link from "next/link"

export default function MyInvitationsPage() {
    // Dummy Data
    const invitations = [
        { id: 1, title: "Rina & Budi", date: "15 Agustus 2026", status: "Tayang", views: 245, rsvps: 120, messages: 85, slug: "rina-budi" },
        { id: 2, title: "Siska & Didi", date: "22 September 2026", status: "Draft", views: 0, rsvps: 0, messages: 0, slug: "siska-didi" },
        { id: 3, title: "Ani & Anton", date: "10 Januari 2025", status: "Arsip", views: 1540, rsvps: 450, messages: 320, slug: "ani-anton" },
    ];

    // const invitations: any[] = []; // Toggle this for empty state preview

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Undangan Saya</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Kelola semua undangan digital Anda di satu tempat.</p>
                </div>
                <Link href="/dashboard/undangan/baru">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 px-6 shadow-md">
                        <Plus className="w-5 h-5" /> Buat Undangan Baru
                    </Button>
                </Link>
            </div>

            {invitations.length === 0 ? (
                // Empty State
                <div className="mt-8 flex flex-col items-center justify-center p-12 text-center bg-secondary/30 rounded-2xl border border-dashed border-border/60">
                    <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <LayoutTemplate className="w-12 h-12 text-primary/60" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Belum Ada Undangan</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Anda belum membuat undangan apa pun. Mulai bagikan momen bahagia Anda dengan membuat undangan digital pertama Anda.
                    </p>
                    <Link href="/dashboard/undangan/baru">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-8 shadow-lg text-lg">
                            <Plus className="w-5 h-5" /> Buat Undangan Pertamamu
                        </Button>
                    </Link>
                </div>
            ) : (
                // Grid Kartu Undangan
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {invitations.map((inv) => (
                        <Card key={inv.id} className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col bg-card">
                            {/* Header Status & Tanggal */}
                            <div className="p-5 pb-0 flex justify-between items-start">
                                <Badge variant="outline" className={`
                                    ${inv.status === 'Tayang' ? 'bg-green-50 text-green-700 border-green-200' :
                                        inv.status === 'Draft' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                            'bg-red-50 text-red-700 border-red-200'}
                                    font-semibold px-2.5 py-0.5 rounded-full text-xs
                                `}>
                                    {inv.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {inv.date}
                                </span>
                            </div>

                            <CardContent className="p-5 flex-1 flex flex-col">
                                {/* Nama Pasangan */}
                                <h3 className="font-serif text-2xl font-bold text-foreground mt-2 mb-4 leading-tight">
                                    {inv.title}
                                </h3>

                                {/* Statistik */}
                                <div className="grid grid-cols-3 gap-2 py-4 border-y border-border/50 mb-auto bg-secondary/10 rounded-lg px-2">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <Users className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{inv.views}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">Tayangan</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center border-l col-start-2 border-border/50">
                                        <MailOpen className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{inv.rsvps}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">RSVP</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center border-l col-start-3 border-border/50">
                                        <MessageSquareHeart className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{inv.messages}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">Ucapan</span>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex flex-wrap items-center gap-2 mt-5">
                                    <Link href={`/u/${inv.slug}`} className="flex-1">
                                        <Button variant="secondary" className="w-full text-xs gap-1.5 bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10">
                                            <Eye className="w-3.5 h-3.5" /> Lihat Undangan
                                        </Button>
                                    </Link>
                                    <Button variant="secondary" className="shrink-0 h-9 w-9 p-0 text-blue-600 border border-blue-200 hover:bg-blue-50 hover:text-blue-700 bg-white shadow-sm flex items-center justify-center">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="secondary" className="shrink-0 h-9 w-9 p-0 text-red-600 border border-red-200 hover:bg-red-50 hover:text-red-700 bg-white shadow-sm flex items-center justify-center">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
