import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Plus, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InvitationList from "@/components/dashboard/InvitationList";

export default async function InvitationsPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all invitations owned by user
    const { data: invitationsRaw, error } = await supabase
        .from("invitations")
        .select(`
            id,
            slug,
            status,
            theme,
            created_at,
            is_paid,
            groom_full_name,
            groom_nickname,
            bride_full_name,
            bride_nickname,
            akad_datetime,
            resepsi_datetime
        `)
        .eq("user_id", user.id)
        .is("soft_delete_at", null)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("[invitations] query error:", error);
    }

    const invitations = (invitationsRaw || []).map((inv: any) => {
        const groomName = inv.groom_nickname || inv.groom_full_name || "Mempelai Pria";
        const brideName = inv.bride_nickname || inv.bride_full_name || "Mempelai Wanita";
        const title = `${groomName} & ${brideName}`;

        const rawDate = inv.resepsi_datetime || inv.akad_datetime;
        const date = rawDate
            ? new Date(rawDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
            : "Tanggal belum ditentukan";

        // Status mapping
        let statusLabel = "Draft";
        let statusClass = "bg-secondary text-muted-foreground border-border";
        if (inv.status === "active") {
            statusLabel = "Aktif";
            statusClass = "bg-green-50 text-green-700 border-green-200";
        } else if (inv.status === "trial") {
            statusLabel = "Trial";
            statusClass = "bg-amber-50 text-amber-700 border-amber-200";
        } else if (inv.status === "unpaid") {
            statusLabel = "Belum Aktif";
            statusClass = "bg-primary/10 text-primary border-primary/20";
        } else if (inv.status === "expired") {
            statusLabel = "Kedaluwarsa";
            statusClass = "bg-destructive/10 text-destructive border-destructive/20";
        }

        return {
            id: inv.id,
            slug: inv.slug,
            title,
            date,
            status: inv.status,
            statusLabel,
            statusVariant: "secondary" as const,
            statusClass,
            theme: inv.theme || "classic",
            views: 0,
            rsvps: 0,
            messages: 0,
            isPermanent: true,
        };
    });

    // Fetch RSVP counts per invitation
    const slugs = invitations.map((inv: { slug: string }) => inv.slug).filter(Boolean);
    if (slugs.length > 0) {
        const { data: rsvpRows } = await supabase
            .from("rsvp_messages")
            .select("invitation_id")
            .in("invitation_id", slugs);

        if (rsvpRows) {
            const countMap: Record<string, number> = {};
            for (const row of rsvpRows) {
                countMap[row.invitation_id] = (countMap[row.invitation_id] || 0) + 1;
            }
            for (const inv of invitations) {
                const count = countMap[inv.slug] || 0;
                inv.rsvps = count;
                inv.messages = count;
            }
        }
    }

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
                    <Button variant="primary" className="gap-2 h-11 px-6 shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5" /> Buat Undangan Baru
                    </Button>
                </Link>
            </div>

            {/* Content */}
            {invitations.length === 0 ? (
                <div className="mt-8 flex flex-col items-center justify-center p-12 text-center bg-secondary/30 rounded-2xl border border-dashed border-border/60">
                    <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <LayoutTemplate className="w-12 h-12 text-primary/60" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Belum Ada Undangan</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        Anda belum membuat undangan apa pun. Mulai bagikan momen bahagia Anda dengan membuat undangan digital pertama Anda.
                    </p>
                    <Link href="/buat-undangan">
                        <Button variant="primary" className="gap-2 h-12 px-8 shadow-lg text-lg">
                            <Plus className="w-5 h-5" /> Buat Undangan Pertamamu
                        </Button>
                    </Link>
                </div>
            ) : (
                <InvitationList items={invitations} />
            )}
        </div>
    );
}
