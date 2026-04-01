import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ArrowLeft, Users, MailOpen, MessageCircle, Eye, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RsvpClientTable from "./RsvpClientTable";
import { GuestSessionClearer } from "./GuestSessionClearer";
import { Suspense } from "react";
import RsvpPanel from "@/components/dashboard/RsvpPanel";

export default async function UndanganDashboardPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    let coupleName = "Undangan";
    let viewCount = 0;
    let rsvpCount = 0;
    let hadirCount = 0;
    let tidakHadirCount = 0;
    let masihRaguCount = 0;
    let initialMessages: any[] = [];
    let invitationSlug = "demo";
    let invitationStatus = "draft";

    if (!supabaseUrl) {
        // MOCK DATA FOR LOCAL DEVELOPMENT
        coupleName = "Budi & Ayu (Demo)";
        viewCount = 345;
        rsvpCount = 3;
        hadirCount = 2;
        tidakHadirCount = 1;
        masihRaguCount = 0;
        invitationSlug = "demo";
        invitationStatus = "active";
        initialMessages = [
            { id: "1", name: "Andi", attendance: "hadir", message: "Selamat ya bro!", created_at: new Date().toISOString() },
            { id: "2", name: "Riska", attendance: "tidak_hadir", message: "Maaf ngga bisa dateng 🙏", created_at: new Date(Date.now() - 3600000).toISOString() },
            { id: "3", name: "Dewi", attendance: "hadir", message: "InsyaAllah hadir! Semoga bahagia selalu 💕", created_at: new Date(Date.now() - 7200000).toISOString() },
        ];
    } else {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect("/login");
        }

        // Fetch invitation data — flat columns
        const { data: invitation, error: invError } = await supabase
            .from("invitations")
            .select(`
                id, slug, status,
                groom_nickname, groom_full_name,
                bride_nickname, bride_full_name
            `)
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

        if (invError || !invitation) {
            redirect("/dashboard");
        }

        const groomName = invitation.groom_nickname || invitation.groom_full_name || null;
        const brideName = invitation.bride_nickname || invitation.bride_full_name || null;
        coupleName = groomName && brideName ? `${groomName} & ${brideName}` : (groomName || brideName || "Undangan");
        invitationSlug = invitation.slug;
        invitationStatus = invitation.status;

        // Stats — views (may not have invitation_views table yet, gracefully handle)
        try {
            const { count: fetchedViewCount } = await supabase
                .from("invitation_views")
                .select("*", { count: "exact", head: true })
                .eq("invitation_id", id);
            viewCount = fetchedViewCount || 0;
        } catch {
            viewCount = 0;
        }

        // RSVP stats — query by slug (ClassicRsvpSection stores slug as invitation_id)
        const { count: fetchedRsvpCount } = await supabase
            .from("rsvp_messages")
            .select("*", { count: "exact", head: true })
            .eq("invitation_id", invitationSlug);
        rsvpCount = fetchedRsvpCount || 0;

        // Attendance breakdown
        const { count: hCount } = await supabase
            .from("rsvp_messages")
            .select("*", { count: "exact", head: true })
            .eq("invitation_id", invitationSlug)
            .eq("attendance", "hadir");
        hadirCount = hCount || 0;

        const { count: thCount } = await supabase
            .from("rsvp_messages")
            .select("*", { count: "exact", head: true })
            .eq("invitation_id", invitationSlug)
            .eq("attendance", "tidak_hadir");
        tidakHadirCount = thCount || 0;

        const { count: mrCount } = await supabase
            .from("rsvp_messages")
            .select("*", { count: "exact", head: true })
            .eq("invitation_id", invitationSlug)
            .eq("attendance", "masih_ragu");
        masihRaguCount = mrCount || 0;

        // Fetch messages — use correct column names (name, not guest_name)
        const { data: fetchedMessages } = await supabase
            .from("rsvp_messages")
            .select("id, name, attendance, message, created_at")
            .eq("invitation_id", invitationSlug)
            .order("created_at", { ascending: false })
            .limit(10);
        initialMessages = fetchedMessages || [];
    }

    // Build preview URL
    const isLive = invitationStatus === "active" || invitationStatus === "paid";
    const previewUrl = isLive
        ? `/invite/${invitationSlug}`
        : `/invite/${invitationSlug}?preview=true`;

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
            <Suspense fallback={null}><GuestSessionClearer /></Suspense>

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors w-fit group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Dasbor
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-foreground">{coupleName}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <Link href={previewUrl} target="_blank" className="flex-1 md:flex-none">
                        <Button variant="secondary" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            {isLive ? "Lihat Undangan" : "Preview Undangan"}
                        </Button>
                    </Link>
                    <Link href={`/dashboard/undangan/${id}/edit`} className="flex-1 md:flex-none">
                        <Button variant="primary" className="w-full shadow-md">
                            <Pencil className="w-4 h-4 mr-2" /> Edit Undangan
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-secondary/30 rounded-t-xl border-b border-border">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Tayangan</CardTitle>
                        <Eye className="w-5 h-5 text-primary drop-shadow-sm" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-4xl font-black text-foreground tracking-tight">{viewCount}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Tamu yang membuka undangan</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-secondary/30 rounded-t-xl border-b border-border">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total RSVP</CardTitle>
                        <Users className="w-5 h-5 text-primary drop-shadow-sm" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-4xl font-black text-foreground tracking-tight">{rsvpCount}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Total konfirmasi kehadiran</p>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-secondary/30 rounded-t-xl border-b border-border">
                        <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Ucapan</CardTitle>
                        <MessageCircle className="w-5 h-5 text-primary drop-shadow-sm" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="text-4xl font-black text-foreground tracking-tight">{rsvpCount}</div>
                        <p className="text-xs text-muted-foreground mt-2 font-medium">Total ucapan dari tamu</p>
                    </CardContent>
                </Card>
            </div>

            {/* RSVP Attendance Breakdown */}
            <RsvpPanel
                total={rsvpCount}
                hadir={hadirCount}
                tidakHadir={tidakHadirCount}
                masihRagu={masihRaguCount}
            />

            {/* RSVP Table */}
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl font-serif font-bold text-foreground">Daftar RSVP & Ucapan</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Daftar ucapan dan konfirmasi kehadiran dari tamu undanganmu.</p>
                </div>
                <RsvpClientTable
                    initialMessages={initialMessages}
                    invitationSlug={invitationSlug}
                    totalCount={rsvpCount}
                />
            </div>
        </div>
    );
}
