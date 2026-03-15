import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import EditorClient from "./EditorClient";

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    let invitationData: any = {};

    if (!supabaseUrl) {
        invitationData = {
            id: id,
            slug: 'demo',
            status: 'active',
            created_at: new Date().toISOString(),
            invitation_details: {
                groom_name: "Budi",
                bride_name: "Ayu",
                groom_full_name: "Budi Santoso",
                groom_father: "Bpk. Santoso",
                groom_mother: "Ibu Siti",
                bride_full_name: "Ayu Lestari",
                bride_father: "Bpk. Hendro",
                bride_mother: "Ibu Ratna",
                akad_date: "2026-06-15T08:00",
                akad_venue: "Masjid Raya Al-Akbar",
                akad_address: "Jl. Masjid Agung Timur No.1, Surabaya",
                reception_date: "2026-06-15T11:00",
                reception_venue: "Gedung Serbaguna",
                reception_address: "Jl. Merdeka No 2, Surabaya",
            }
        }
    } else {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect("/login");
        }

        // Fetch Invitation Details
        const { data: invitation, error } = await supabase
            .from('invitations')
            .select(`
                id, slug, status, created_at,
                invitation_details(*)
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !invitation) {
            redirect("/dashboard");
        }

        invitationData = invitation;
    }

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <EditorClient initialData={invitationData} />
        </div>
    );
}
