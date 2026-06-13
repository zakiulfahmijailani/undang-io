import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import InvitationEditorForm from "@/components/dashboard/InvitationEditorForm";
import { TrialCountdownBar } from "@/components/trial/TrialCountdownBar";

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
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !invitation) {
        // Log full error detail so we can see exactly which column is missing
        console.error('[edit/page] fetch failed - code:', error?.code, '| message:', error?.message, '| details:', error?.details, '| hint:', error?.hint);
        redirect("/dashboard");
    }

    const initialData = {
        ...invitation,
        ...(typeof invitation.invitation_data === 'object' && invitation.invitation_data !== null ? invitation.invitation_data : {})
    };

    return (
        <>
            <TrialCountdownBar invitationId={id} />
            <InvitationEditorForm initialData={initialData as any} />
        </>
    );
}
