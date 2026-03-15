import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ArrowLeft, Users, MailOpen, MessageCircle, Eye, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RsvpClientTable from "./RsvpClientTable";
import { GuestSessionClearer } from "./GuestSessionClearer";
import { Suspense } from "react";

export default async function UndanganDashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    let coupleName = 'Undangan';
    let viewCount = 0;
    let rsvpCount = 0;
    let unreadCount = 0;
    let initialMessages: any[] = [];
    let invitationSlug = 'demo';

    if (!supabaseUrl) {
        // MOCK DATA FOR LOCAL DEVELOPMENT
        coupleName = 'Budi & Ayu (Demo)';
        viewCount = 345;
        rsvpCount = 120;
        unreadCount = 5;
        invitationSlug = 'demo';
        initialMessages = [
            { id: '1', guest_name: 'Andi', attendance: 'hadir', message: 'Selamat ya bro!', created_at: new Date().toISOString(), is_read: false },
            { id: '2', guest_name: 'Riska', attendance: 'tidak_hadir', message: 'Maaf ngga bisa dateng 🙏', created_at: new Date(Date.now() - 3600000).toISOString(), is_read: true }
        ];
    } else {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect("/login");
        }

        // 1. Fetch Invitation Details & Verify Ownership
        const { data: invitation, error: invError } = await supabase
            .from('invitations')
            .select(`
                id, slug, status, created_at,
                invitation_details ( groom_name, bride_name )
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (invError || !invitation) {
            redirect("/dashboard");
        }

        const { groom_name, bride_name } = invitation.invitation_details || {};
        coupleName = groom_name && bride_name ? `${groom_name} & ${bride_name}` : "Undangan";
        invitationSlug = invitation.slug;

        // 2. Fetch Aggregated Stats
        const { count: fetchedViewCount } = await supabase
            .from('invitation_views')
            .select('*', { count: 'exact', head: true })
            .eq('invitation_id', id);
        viewCount = fetchedViewCount || 0;

        const { count: fetchedRsvpCount } = await supabase
            .from('rsvp_messages')
            .select('*', { count: 'exact', head: true })
            .eq('invitation_id', id);
        rsvpCount = fetchedRsvpCount || 0;

        const { count: fetchedUnreadCount } = await supabase
            .from('rsvp_messages')
            .select('*', { count: 'exact', head: true })
            .eq('invitation_id', id)
            .eq('is_read', false);
        unreadCount = fetchedUnreadCount || 0;

        // 3. Fetch Initial Table Data (page 1, limit 10)
        const { data: fetchedMessages } = await supabase
            .from('rsvp_messages')
            .select('id, guest_name, attendance, message, created_at, is_read')
            .eq('invitation_id', id)
            .order('created_at', { ascending: false })
            .limit(10);
        initialMessages = fetchedMessages || [];
    }

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
            <Suspense fallback={null}><GuestSessionClearer /></Suspense>
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <Link href="/dashboard" className="text-sm font-medium text-stone-500 hover:text-gold-600 flex items-center gap-1.5 transition-colors w-fit group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Dasbor
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-stone-800">{coupleName}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <Link href={`/u/${invitationSlug}`} target="_blank" className="flex-1 md:flex-none">
                        <Button variant="secondary" className="w-full text-stone-600 hover:text-gold-600 border-stone-200">
                            <Eye className="w-4 h-4 mr-2" /> Lihat Undangan
                        </Button>
                    </Link>
                    <Link href={`/dashboard/undangan/${id}/edit`} className="flex-1 md:flex-none">
                        <Button className="w-full bg-gradient-to-r from-gold-500 to-amber-600 text-white hover:from-gold-600 hover:to-amber-700 shadow-md border-0">
                            <Pencil className="w-4 h-4 mr-2" /> Edit Undangan
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card className="border-stone-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-stone-50/50 rounded-t-xl border-b border-stone-100">
                        <CardTitle className="text-sm font-bold text-stone-600 uppercase tracking-wider">Total Tayangan</CardTitle>
                        <Eye className="w-5 h-5 text-gold-500 drop-shadow-sm" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-4xl font-black text-stone-800 tracking-tight">{viewCount || 0}</div>
                        <p className="text-xs text-stone-500 mt-2 font-medium">Tamu yang membuka undangan</p>
                    </CardContent>
                </Card>

                <Card className="border-stone-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-stone-50/50 rounded-t-xl border-b border-stone-100">
                        <CardTitle className="text-sm font-bold text-stone-600 uppercase tracking-wider">Total RSVP</CardTitle>
                        <Users className="w-5 h-5 text-gold-500 drop-shadow-sm" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-4xl font-black text-stone-800 tracking-tight">{rsvpCount || 0}</div>
                        <p className="text-xs text-stone-500 mt-2 font-medium">Total konfirmasi kehadiran dari tamu</p>
                    </CardContent>
                </Card>

                <Card className={`border-stone-200 shadow-sm relative overflow-hidden transition-colors ${unreadCount && unreadCount > 0 ? 'bg-gold-50/30' : ''}`}>
                    {unreadCount && unreadCount > 0 ? (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-400/20 to-transparent rounded-bl-full pointer-events-none" />
                    ) : null}
                    <CardHeader className={`flex flex-row items-center justify-between pb-2 rounded-t-xl border-b border-stone-100 ${unreadCount && unreadCount > 0 ? 'bg-gold-100/50 border-gold-200/50' : 'bg-stone-50/50'}`}>
                        <CardTitle className={`text-sm font-bold uppercase tracking-wider ${unreadCount && unreadCount > 0 ? 'text-gold-700' : 'text-stone-600'}`}>Pesan Baru</CardTitle>
                        <MessageCircle className={`w-5 h-5 drop-shadow-sm ${unreadCount && unreadCount > 0 ? 'text-gold-600' : 'text-stone-400'}`} />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-4xl font-black text-stone-800 tracking-tight flex items-baseline gap-2">
                            {unreadCount || 0}
                            {unreadCount && unreadCount > 0 ? <span className="text-sm font-bold text-rose-500 bg-rose-100 px-2 py-0.5 rounded-full">New!</span> : null}
                        </div>
                        <p className="text-xs text-stone-500 mt-2 font-medium">Pesan yang belum dibaca</p>
                    </CardContent>
                </Card>
            </div>

            {/* RSVP Table List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-stone-800">Daftar RSVP & Ucapan</h2>
                        <p className="text-sm text-stone-500 mt-0.5">Daftar ucapan dan konfirmasi kehadiran dari tamu undanganmu.</p>
                    </div>
                </div>

                <RsvpClientTable
                    initialMessages={initialMessages || []}
                    invitationId={id}
                    totalCount={rsvpCount || 0}
                />
            </div>
        </div>
    );
}
