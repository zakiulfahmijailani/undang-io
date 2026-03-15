import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MailOpen, MessageSquareHeart, ShieldCheck, HeartPulse } from "lucide-react";
import InvitationCard from "@/components/dashboard/InvitationCard";
import NewInvitationDialog from "@/components/dashboard/NewInvitationDialog";
import GuestConversion from "./components/GuestConversion";
import GuestSessionCard from "./components/GuestSessionCard";

export default async function DashboardPage() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    let userName = 'Kak';
    let typedInvitations: any[] = [];
    let claimedGuestSessions: any[] = [];
    let mockTotalViews = 0;
    let mockTotalRsvps = 0;
    let mockNewMessages = 0;

    if (!supabaseUrl) {
        userName = 'Budi (Developer Mode)';
        typedInvitations = [
            {
                id: 'dummy-1',
                slug: 'demo',
                status: 'active',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                invitation_details: {
                    groom_name: "Budi",
                    bride_name: "Ayu",
                    akad_date: "2026-06-15T08:00:00",
                    reception_date: "2026-06-15T11:00:00"
                }
            }
        ];
        mockTotalViews = 1250;
        mockTotalRsvps = 450;
        mockNewMessages = 12;
    } else {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect("/login");
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        userName = profile?.full_name?.split(' ')[0] || 'Kak';

        // 1. Fetch permanent invitations
        const { data: invitations } = await supabase
            .from('invitations')
            .select(`
                id, slug, status, created_at,
                invitation_details (
                    groom_name, bride_name,
                    couple_photo_url, akad_date, reception_date
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        typedInvitations = (invitations || []) as any[];

        // 2. Fetch claimed guest sessions (belum bayar, belum jadi permanent)
        const adminClient = getAdminClient();
        if (adminClient) {
            const { data: guestSessions } = await adminClient
                .from('guest_sessions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'claimed')
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false });

            claimedGuestSessions = (guestSessions || []) as any[];
        }
    }

    const totalInvitations = typedInvitations.length + claimedGuestSessions.length;

    return (
        <>
            <GuestConversion />
            <div className="flex flex-col gap-8 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground">Halo, {userName}! 👋</h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        {totalInvitations > 0
                            ? "Berikut adalah ringkasan performa undangan digitalmu."
                            : "Mulai perjalanan pernikahanmu dengan undangan digital elegan."}
                    </p>
                </div>
                {totalInvitations > 0 && (
                    <NewInvitationDialog />
                )}
            </div>

            {totalInvitations === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 mt-8 bg-card rounded-3xl border border-border shadow-sm text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <HeartPulse className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-3">Belum ada undangan</h2>
                    <p className="text-muted-foreground max-w-md mb-8">
                        Mulai buat undangan pernikahan digitalmu sekarang dan bagikan ke semua tamu spesialmu.
                    </p>
                    <NewInvitationDialog />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Tayangan</CardTitle>
                                <Users className="w-4 h-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockTotalViews}</div>
                                <p className="text-xs text-muted-foreground mt-1">Total di semua undangan</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total RSVP</CardTitle>
                                <MailOpen className="w-4 h-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockTotalRsvps}</div>
                                <p className="text-xs text-muted-foreground mt-1">Konfirmasi kehadiran</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    Ucapan Baru
                                    {mockNewMessages > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{mockNewMessages}</span>
                                    )}
                                </CardTitle>
                                <MessageSquareHeart className="w-4 h-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{mockNewMessages}</div>
                                <p className="text-xs text-muted-foreground mt-1">Belum dibaca</p>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow bg-secondary/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-full" />
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Status Paket</CardTitle>
                                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <div className="text-xl font-bold text-foreground">Basic</div>
                                <p className="text-xs text-muted-foreground mt-0.5 mb-1.5">Mulai dengan gratis</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-foreground">Undangan Saya</h2>
                                <p className="text-muted-foreground text-sm mt-1">Kelola undangan pernikahan digitalmu.</p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Claimed guest sessions — belum bayar, ada timer */}
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
    </>
    );
}
