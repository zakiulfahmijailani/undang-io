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
import DeleteInvitationButton from "@/components/dashboard/DeleteInvitationButton";
import InvitationList from "@/components/dashboard/InvitationList";

export default async function MyInvitationsPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

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
        let statusVariant: 'secondary' | 'default' | 'outline' | 'destructive' = 'secondary';
        let statusClass = 'bg-secondary text-muted-foreground border-border';
        if (inv.status === 'active') {
            statusLabel = 'Tayang';
            statusClass = 'bg-green-50 text-green-700 border-green-200';
        } else if (inv.status === 'unpaid') {
            statusLabel = 'Belum Aktif';
            statusClass = 'bg-primary/10 text-primary border-primary/20';
        } else if (inv.status === 'expired') {
            statusLabel = 'Kedaluwarsa';
            statusClass = 'bg-destructive/10 text-destructive border-destructive/20';
        }

        return { id: inv.id, slug: inv.slug, title, date, status: inv.status, statusLabel, statusVariant, statusClass, views: 0, rsvps: 0, messages: 0, isPermanent: true };
    });

    // Fetch real RSVP counts per invitation (query by slug)
    const slugs = permanentInvitations.map((inv: { slug: string }) => inv.slug).filter(Boolean);
    if (slugs.length > 0) {
        const { data: rsvpRows } = await supabase
            .from('rsvp_messages')
            .select('invitation_id')
            .in('invitation_id', slugs);

        if (rsvpRows) {
            const countMap: Record<string, number> = {};
            for (const row of rsvpRows) {
                countMap[row.invitation_id] = (countMap[row.invitation_id] || 0) + 1;
            }
            for (const inv of permanentInvitations) {
                const count = countMap[inv.slug] || 0;
                inv.rsvps = count;
                inv.messages = count;
            }
        }
    }

    let claimedSessions: any[] = [];
    const adminClient = getAdminClient();
    if (adminClient) {
        const { data: guestSessions, error: gsError } = await adminClient
            .from('guest_sessions')
            .select('id, slug, invitation_data, expires_at, created_at')
            .eq('user_id', user.id)
            .eq('status', 'claimed')
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
            return {
                id: gs.id,
                slug: gs.slug,
                title: `${groomName} & ${brideName}`,
                date: 'Tanggal belum ditentukan',
                status: 'claimed',
                statusLabel: 'Belum Dibayar',
                statusClass: 'bg-amber-50 text-amber-700 border-amber-200',
                views: 0, rsvps: 0, messages: 0,
                isPermanent: false,
                minutesLeft,
            };
        });
    }

    const allItems = [...claimedSessions, ...permanentInvitations];

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Undangan Saya</h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Kelola semua undangan digital Anda di satu tempat.
                    </p>
                </div>
                <Link href="/buat-undangan">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 px-6 shadow-md cursor-pointer">
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
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 px-8 shadow-lg text-lg cursor-pointer">
                            <Plus className="w-5 h-5" /> Buat Undangan Pertamamu
                        </Button>
                    </Link>
                </div>
            ) : (
                <InvitationList items={allItems} />
            )}
        </div>
    );
}
