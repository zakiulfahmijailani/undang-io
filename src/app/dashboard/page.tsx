import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import InvitationCard from "@/components/dashboard/InvitationCard";
import NewInvitationDialog from "@/components/dashboard/NewInvitationDialog";
import GuestConversion from "./components/GuestConversion";
import GuestSessionCard from "./components/GuestSessionCard";

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

    const userName = profile?.full_name?.split(' ')[0] || 'Concierge';

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
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <GuestConversion />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-primary tracking-tighter mb-2 italic font-light">
                        Welcome back, <br/>
                        <span className="text-on-tertiary-container not-italic font-black">{userName}</span>
                    </h2>
                    <p className="text-slate-400 font-['Inter'] text-xs uppercase tracking-[0.3em]">Titanium Membership</p>
                </div>
                <NewInvitationDialog />
            </div>

            {/* Statistics Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-primary p-8 rounded-[40px] text-white relative overflow-hidden group">
                   <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <span className="material-symbols-outlined text-tertiary-fixed-dim text-4xl">insights</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Real-time Performance</span>
                        </div>
                        <div className="mt-12">
                            <p className="text-5xl font-black tracking-tighter mb-1">{totalViews}</p>
                            <p className="text-sm text-on-primary-container font-light">Total Digital Interactions Captured</p>
                        </div>
                   </div>
                   <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 translate-x-24 group-hover:translate-x-12 transition-transform duration-1000"></div>
                </div>

                <div className="bg-surface-container-highest p-8 rounded-[40px] flex flex-col justify-between border border-outline-variant/10 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-3xl">mail_lock</span>
                    <div>
                        <p className="text-3xl font-black text-primary tracking-tighter">{totalRsvps}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-2">RSVP Responses</p>
                    </div>
                </div>

                <div className="bg-tertiary p-8 rounded-[40px] flex flex-col justify-between text-on-tertiary shadow-xl shadow-tertiary/20">
                    <div className="flex justify-between">
                         <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl">chat_bubble</span>
                         {newMessages > 0 && <span className="w-3 h-3 rounded-full bg-error animate-ping"></span>}
                    </div>
                    <div>
                        <p className="text-3xl font-black tracking-tighter">{newMessages}</p>
                        <p className="text-xs text-white/60 uppercase tracking-widest font-bold mt-2">New Messages</p>
                    </div>
                </div>
            </div>

            {/* Invitations List */}
            {totalInvitations === 0 ? (
                <div className="py-24 rounded-[64px] bg-white border-2 border-dashed border-outline-variant/20 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-8">
                        <span className="material-symbols-outlined text-primary text-5xl">edit_note</span>
                    </div>
                    <h3 className="text-3xl font-black text-primary tracking-tighter mb-4">No invitations found</h3>
                    <p className="text-slate-400 max-w-sm mb-12 font-light italic">Your design legacy is waiting to be written. Start your first masterpiece today.</p>
                    <NewInvitationDialog />
                </div>
            ) : (
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black text-primary tracking-tighter">Your Masterpieces</h3>
                        <div className="h-px flex-1 bg-outline-variant/10"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Claimed guest sessions (Trial phase) */}
                        {claimedGuestSessions.map((gs) => (
                            <GuestSessionCard key={gs.id} guestSession={gs} />
                        ))}
                        {/* Permanent invitations */}
                        {typedInvitations.map((invitation: any) => (
                            <InvitationCard key={invitation.id} invitation={invitation} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
