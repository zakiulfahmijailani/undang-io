import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MailOpen, MessageSquareHeart, ShieldCheck, HeartPulse, Sparkles, Plus } from "lucide-react";
import InvitationCard from "@/components/dashboard/InvitationCard";
import NewInvitationDialog from "@/components/dashboard/NewInvitationDialog";
import GuestConversion from "./components/GuestConversion";
import GuestSessionCard from "./components/GuestSessionCard";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const userName = profile?.full_name?.split(' ')[0] || 'Member';

    // 1. Fetch permanent invitations
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
        console.error('[dashboard] invitations query error:', invitationsError);
    }

    // Map flat columns → shape that InvitationCard expects
    const typedInvitations = (invitationsRaw || []).map((inv: any) => ({
        id: inv.id,
        slug: inv.slug,
        status: inv.status,
        created_at: inv.created_at,
        invitation_details: {
            groom_name: inv.groom_nickname || inv.groom_full_name || null,
            bride_name: inv.bride_nickname || inv.bride_full_name || null,
            couple_photo_url: null,
            akad_date: inv.akad_datetime || null,
            reception_date: inv.resepsi_datetime || null,
        },
    }));

    // 2. Fetch claimed guest sessions
    let claimedGuestSessions: any[] = [];
    const adminClient = getAdminClient();
    if (adminClient) {
        const { data: guestSessions, error: gsError } = await adminClient
            .from('guest_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'claimed')
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false });

        if (gsError) {
            console.error('[dashboard] guest_sessions query error:', gsError);
        }

        claimedGuestSessions = (guestSessions || []) as any[];
    }

    const totalViews = 0;
    const totalRsvps = 0;
    const newMessages = 0;
    const totalInvitations = typedInvitations.length + claimedGuestSessions.length;

    return (
        <div className="min-h-screen bg-surface-stitch selection:bg-tertiary-fixed-dim-stitch font-sans pb-20">
            <GuestConversion />
            
            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
                    <div>
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-on-tertiary-container-stitch mb-4 block">
                            Titanium Workspace
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-primary-stitch tracking-tighter leading-tight">
                            Halo, {userName}.
                        </h1>
                        <p className="text-secondary-stitch text-lg font-light mt-2">
                            {totalInvitations > 0
                                ? "Overview of your editorial performances."
                                : "Start your journey with a premium digital presence."}
                        </p>
                    </div>
                    {totalInvitations > 0 && (
                        <div className="flex items-center gap-4">
                            <NewInvitationDialog />
                        </div>
                    )}
                </div>

                {totalInvitations === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-8 bg-white/50 backdrop-blur-xl rounded-[48px] border border-outline-variant-stitch/20 shadow-glow-stitch text-center">
                        <div className="w-24 h-24 bg-primary-stitch text-white rounded-[32px] flex items-center justify-center mb-8 rotate-3 shadow-2xl">
                            <Plus className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-black text-primary-stitch tracking-tighter mb-4">No invitations yet.</h2>
                        <p className="text-secondary-stitch max-w-md mb-10 font-light text-lg">
                            Begin your story by creating a bespoke digital experience for your special day.
                        </p>
                        <NewInvitationDialog />
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {[
                                { label: "Total Views", value: totalViews, icon: Users, sub: "Across all events" },
                                { label: "Total RSVP", value: totalRsvps, icon: MailOpen, sub: "Guest confirmations" },
                                { label: "Messages", value: newMessages, icon: MessageSquareHeart, sub: "Unread greetings", badge: newMessages > 0 },
                                { label: "Account Tier", value: "Titanium", icon: ShieldCheck, sub: "Premium features active", highlight: true }
                            ].map((stat, i) => (
                                <Card key={i} className={`rounded-[32px] border-outline-variant-stitch/20 shadow-glow-stitch hover:translate-y-[-4px] transition-all duration-500 overflow-hidden ${stat.highlight ? 'bg-primary-stitch text-white' : 'bg-white'}`}>
                                    <CardContent className="p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className={`text-[10px] font-bold tracking-widest uppercase ${stat.highlight ? 'text-on-primary-container-stitch' : 'text-secondary-stitch'}`}>
                                                {stat.label}
                                            </span>
                                            <stat.icon className={`w-5 h-5 ${stat.highlight ? 'text-tertiary-fixed-dim-stitch' : 'text-primary-stitch'}`} />
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-4xl font-black tracking-tighter">
                                                {stat.value}
                                            </span>
                                            {stat.badge && (
                                                <span className="bg-error-stitch text-white text-[10px] px-2 py-0.5 rounded-full font-bold">NEW</span>
                                            )}
                                        </div>
                                        <p className={`text-xs font-light ${stat.highlight ? 'text-on-primary-container-stitch' : 'text-secondary-stitch/60'}`}>
                                            {stat.sub}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* My Invitations Section */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-primary-stitch tracking-tighter">My Invitations</h2>
                                    <p className="text-secondary-stitch text-sm font-light mt-1">Manage your bespoke digital collections.</p>
                                </div>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2">
                                {/* Claimed guest sessions */}
                                {claimedGuestSessions.map((gs) => (
                                    <GuestSessionCard key={gs.id} guestSession={gs} />
                                ))}
                                {/* Permanent invitations */}
                                {typedInvitations.map((invitation) => (
                                    <InvitationCard key={invitation.id} invitation={invitation} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
