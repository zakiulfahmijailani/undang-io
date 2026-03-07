import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MailOpen, MessageSquareHeart, ShieldCheck, Plus, ExternalLink, Settings2 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    // Dummy Data
    const invitations = [
        { id: 1, title: "Pernikahan Budi & Ani", slug: "budi-ani", views: 120, status: "Aktif" },
        { id: 2, title: "Tasyakuran Aqiqah Rina", slug: "aqiqah-rina", views: 45, status: "Draft" },
    ];

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Halo, Budi Santoso! 👋</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Berikut adalah ringkasan performa undangan digitalmu.</p>
                </div>
                <Link href="/dashboard/undangan/baru">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 px-6 shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5" />
                        Buat Undangan Baru
                    </Button>
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Tayangan</CardTitle>
                        <Users className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">165</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% dari minggu lalu</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">RSVP Masuk</CardTitle>
                        <MailOpen className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">54</div>
                        <p className="text-xs text-muted-foreground mt-1">48 Hadir, 6 Tidak Hadir</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            Ucapan Baru
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">5</span>
                        </CardTitle>
                        <MessageSquareHeart className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground mt-1">Dari total 32 ucapan</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-secondary/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Status Paket</CardTitle>
                        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <div className="text-2xl font-bold text-foreground">Gratis</div>
                        <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md">
                            Upgrade Premium
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* List Undangan */}
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-foreground">Daftar Undangan</h2>
                        <p className="text-muted-foreground text-sm mt-1">Kelola undangan yang sedang aktif atau berupa draft.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {invitations.map((invitation) => (
                        <Card key={invitation.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors shadow-sm group">
                            <div className="aspect-[4/2] bg-secondary/50 p-4 flex items-center justify-center relative border-b border-border/50">
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                <div className="relative z-10 w-16 h-16 rounded-full bg-background shadow-md flex items-center justify-center">
                                    <MessageSquareHeart className="w-8 h-8 text-primary/60" />
                                </div>
                                <div className="absolute top-3 right-3 z-10">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${invitation.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-secondary text-secondary-foreground'}`}>
                                        {invitation.status}
                                    </span>
                                </div>
                            </div>
                            <CardContent className="p-5">
                                <h3 className="font-serif text-lg font-bold text-foreground line-clamp-1" title={invitation.title}>
                                    {invitation.title}
                                </h3>
                                <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {invitation.views} Tayangan</span>
                                    <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded">umuman.com/u/{invitation.slug}</span>
                                </div>

                                <div className="flex items-center gap-3 mt-5">
                                    <Button variant="ghost" size="sm" className="flex-1 text-xs border border-border/50">
                                        <Settings2 className="w-3.5 h-3.5 mr-1.5" /> Kelola
                                    </Button>
                                    <Button variant="secondary" size="sm" className="flex-1 text-xs">
                                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Buka Web
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Create New Card */}
                    <Link href="/dashboard/undangan/baru" className="block">
                        <Card className="h-full border-dashed border-2 border-border/60 bg-transparent hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer flex flex-col items-center justify-center p-8 min-h-[240px]">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Plus className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-serif text-lg font-bold text-foreground text-center">Buat Undangan Baru</h3>
                            <p className="text-sm text-muted-foreground text-center mt-2 max-w-[200px]">Buat undangan pernikahan atau acara lainnya.</p>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}
