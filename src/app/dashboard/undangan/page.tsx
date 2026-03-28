import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus, Eye, Edit, Trash2, Calendar,
    Users, MailOpen, MessageSquareHeart, LayoutTemplate, Clock, CreditCard
} from "lucide-react";
import Link from "next/link";
import { AutoClaimSession } from "./AutoClaimSession";

export default async function MyInvitationsPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch permanent invitations — flat columns (no invitation_details relation)
    const { data: invitationsRaw, error: invitationsError } = await supabase
        .from('invitations')
        .select(`
            id,
            slug,
            status,
            created_at,
            groom_full_name,
            groom_nickname,
            bride_full_name,
            bride_nickname,
            akad_datetime,
            resepsi_datetime
        `)
        .eq('user_id', user.id)
        .is('soft_delete_at', null)
        .order('created_at', { ascending: false });

    if (invitationsError) {
        console.error('[undangan] invitations query error:', invitationsError);
    }

    const permanentInvitations = (invitationsRaw || []).map((inv: any) => {
        const groomName = inv.groom_nickname || inv.groom_full_name || 'Mempelai Pria';
        const brideName = inv.bride_nickname || inv.bride_full_name || 'Mempelai Wanita';
        const title = `${groomName} & ${brideName}`;
        const rawDate = inv.resepsi_datetime || inv.akad_datetime;
        const date = rawDate
            ? new Date(rawDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Tanggal belum ditentukan';

        let statusLabel = 'Draft';
        let statusStyle = 'bg-gray-100 text-gray-600 border-gray-200';
        if (inv.status === 'active') {
            statusLabel = 'Tayang'; statusStyle = 'bg-green-50 text-green-700 border-green-200';
        } else if (inv.status === 'unpaid') {
            statusLabel = 'Belum Aktif'; statusStyle = 'bg-yellow-50 text-yellow-700 border-yellow-200';
        } else if (inv.status === 'expired') {
            statusLabel = 'Kedaluwarsa'; statusStyle = 'bg-red-50 text-red-700 border-red-200';
        }

        return { id: inv.id, slug: inv.slug, title, date, status: inv.status, statusLabel, statusStyle, views: 0, rsvps: 0, messages: 0, isPermanent: true };
    });

    // 2. Fetch guest sessions milik user ini — status 'preview' (belum diclaim) ATAU 'claimed' (sudah login, belum bayar)
    // Bug sebelumnya: hanya ambil 'claimed', padahal session dibuat dengan status='preview'
    // Fix: ambil keduanya selama belum expired dan belum dikonversi ke undangan permanen
    let claimedSessions: any[] = [];
    const adminClient = getAdminClient();
    if (adminClient) {
        const { data: guestSessions, error: gsError } = await adminClient
            .from('guest_sessions')
            .select('id, slug, invitation_data, expires_at, created_at, status, session_token')
            .eq('user_id', user.id)
            .in('status', ['preview', 'claimed'])
            .is('converted_to_invitation_id', null)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false });

        if (gsError) {
            console.error('[undangan] guest_sessions query error:', gsError);
        }

        claimedSessions = (guestSessions || []).map((gs: any) => {
            const inv = gs.invitation_data || {};
            const groomName = inv.groomNickname || inv.groomFullName || 'Mempelai Pria';
            const brideName = inv.brideNickname || inv.brideFullName || 'Mempelai Wanita';
            const expiresAt = new Date(gs.expires_at);
            const minutesLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000));
            // Tampilkan sebagai 'claimed' di UI agar konsisten (status preview = belum diclaim tapi user sudah login)
            return {
                id: gs.id,
                slug: gs.slug,
                sessionToken: gs.session_token,
                title: `${groomName} & ${brideName}`,
                date: 'Tanggal belum ditentukan',
                status: 'claimed',
                statusLabel: 'Belum Dibayar',
                statusStyle: 'bg-amber-50 text-amber-700 border-amber-200',
                views: 0, rsvps: 0, messages: 0,
                isPermanent: false,
                minutesLeft,
                needsClaim: gs.status === 'preview', // masih perlu di-claim untuk extend timer
            };
        });
    }

    // Merge: guest sessions first (tampilkan yang perlu dibayar di atas), then permanent invitations
    const allItems = [...claimedSessions, ...permanentInvitations];

    // Kumpulkan session tokens yang masih 'preview' untuk di-auto-claim oleh client
    const previewTokensToAutoClaim = claimedSessions
        .filter((s: any) => s.needsClaim)
        .map((s: any) => s.sessionToken)
        .filter(Boolean);

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            {/* Auto-claim: panggil endpoint claim untuk session yang masih 'preview' agar timer di-extend */}
            <AutoClaimSession tokens={previewTokensToAutoClaim} />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Undangan Saya</h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Kelola semua undangan digital Anda di satu tempat.
                    </p>
                </div>
                <Link href="/buat-undangan">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 px-6 shadow-md">
                        <Plus className="w-5 h-5" /> Buat Undangan Baru
                    </Button>
                </Link>
            </div>

            {allItems.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center p-12 text-center bg-secondary/30 rounded-2xl border border-dashed border-border/60">
                    <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <LayoutTemplate className="w-12 h-12 text-primary/60" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Belum Ada Undangan</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Anda belum membuat undangan apa pun. Mulai bagikan momen bahagia Anda dengan membuat undangan digital pertama Anda.
                    </p>
                    <Link href="/buat-undangan">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-8 shadow-lg text-lg">
                            <Plus className="w-5 h-5" /> Buat Undangan Pertamamu
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {allItems.map((item) => (
                        <Card
                            key={item.id}
                            className={`overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow flex flex-col bg-card ${
                                item.status === 'claimed' ? 'border-amber-200 bg-amber-50/30' : ''
                            }`}
                        >
                            {/* Status & Tanggal */}
                            <div className="p-5 pb-0 flex justify-between items-start">
                                <Badge
                                    variant="secondary"
                                    className={`font-semibold px-2.5 py-0.5 rounded-full text-xs border ${item.statusStyle}`}
                                >
                                    {item.status === 'claimed' && <Clock className="w-3 h-3 inline mr-1" />}
                                    {item.statusLabel}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                    {item.status === 'claimed' ? (
                                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {item.minutesLeft} menit tersisa
                                        </span>
                                    ) : (
                                        <><Calendar className="w-3.5 h-3.5" />{item.date}</>
                                    )}
                                </span>
                            </div>

                            <CardContent className="p-5 flex-1 flex flex-col">
                                <h3 className="font-serif text-2xl font-bold text-foreground mt-2 mb-4 leading-tight">
                                    {item.title}
                                </h3>

                                {/* Statistik */}
                                <div className="grid grid-cols-3 gap-2 py-4 border-y border-border/50 mb-auto bg-secondary/10 rounded-lg px-2">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <Users className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{item.views}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">Tayangan</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center border-l col-start-2 border-border/50">
                                        <MailOpen className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{item.rsvps}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">RSVP</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center text-center border-l col-start-3 border-border/50">
                                        <MessageSquareHeart className="w-4 h-4 text-muted-foreground mb-1" />
                                        <span className="text-sm font-bold text-foreground">{item.messages}</span>
                                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">Ucapan</span>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex flex-wrap items-center gap-2 mt-5">
                                    {item.status === 'claimed' ? (
                                        // Belum bayar: tombol Bayar + Preview
                                        <>
                                            <Link href={`/pembayaran/${item.slug}`} className="flex-1">
                                                <Button className="w-full text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-white">
                                                    <CreditCard className="w-3.5 h-3.5" /> Bayar Rp 45.000
                                                </Button>
                                            </Link>
                                            <Link href={`/u/${item.slug}`} target="_blank">
                                                <Button variant="secondary" className="shrink-0 h-9 w-9 p-0">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        // Undangan permanen: Lihat, Edit, Hapus
                                        <>
                                            <Link href={`/u/${item.slug}`} target="_blank" className="flex-1">
                                                <Button variant="secondary" className="w-full text-xs gap-1.5 bg-primary/5 text-primary border border-primary/20 hover:bg-primary/10">
                                                    <Eye className="w-3.5 h-3.5" /> Lihat Undangan
                                                </Button>
                                            </Link>
                                            <Link href={`/dashboard/undangan/${item.id}/edit`}>
                                                <Button variant="secondary" className="shrink-0 h-9 w-9 p-0 text-blue-600 border border-blue-200 hover:bg-blue-50">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="secondary" className="shrink-0 h-9 w-9 p-0 text-red-600 border border-red-200 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
