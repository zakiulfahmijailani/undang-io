import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import EditorClient from "./EditorClient";

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: invitation, error } = await supabase
        .from('invitations')
        .select(`
            id,
            slug,
            status,
            created_at,
            groom_full_name,
            groom_nickname,
            groom_father_name,
            groom_mother_name,
            bride_full_name,
            bride_nickname,
            bride_father_name,
            bride_mother_name,
            akad_datetime,
            akad_location_name,
            akad_location_address,
            resepsi_datetime,
            resepsi_location_name,
            resepsi_location_address,
            quote_text,
            gift_bank_name,
            gift_bank_account,
            gift_bank_account_name,
            gift_shipping_address,
            show_couple_photos,
            show_prewed_gallery,
            show_gift_section
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !invitation) {
        // Log full error detail so we can see exactly which column is missing
        console.error('[edit/page] fetch failed - code:', error?.code, '| message:', error?.message, '| details:', error?.details, '| hint:', error?.hint);
        redirect("/dashboard");
    }

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <EditorClient initialData={invitation} />
        </div>
    );
}
