import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import InvitationEditorForm from "@/components/dashboard/InvitationEditorForm";

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
            theme_key,
            theme_id,
            created_at,
            couple_photo_url,
            background_photo_url,
            groom_full_name,
            groom_nickname,
            groom_father_name,
            groom_mother_name,
            groom_photo_url,
            bride_full_name,
            bride_nickname,
            bride_father_name,
            bride_mother_name,
            bride_photo_url,
            akad_datetime,
            akad_location_name,
            akad_location_address,
            akad_maps_url,
            resepsi_datetime,
            resepsi_location_name,
            resepsi_location_address,
            resepsi_maps_url,
            dresscode_colors,
            dresscode_note,
            quote_text,
            quote_source,
            music_url,
            love_story,
            gallery_photos,
            sections_order,
            sections_visibility,
            gift_bank_name,
            gift_bank_account,
            gift_bank_account_name,
            gift_shipping_address,
            qris_account,
            show_couple_photos,
            show_prewed_gallery,
            show_gift_section,
            rsvp_enabled
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
        <InvitationEditorForm initialData={invitation as any} />
    );
}
