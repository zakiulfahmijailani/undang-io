import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { InvitationPreviewShell } from "@/components/preview/InvitationPreviewShell";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function FullScreenPreviewPage({ params }: { params: Promise<{ id: string }> }) {
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
            slug,
            theme_key
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !invitation) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <div className="h-14 shrink-0 bg-white border-b flex items-center px-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/undangan/${id}/edit`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Kembali ke Editor
                    </Link>
                </Button>
            </div>
            <div className="flex-1 p-4 sm:p-8">
                <div className="mx-auto max-w-5xl h-full">
                    <InvitationPreviewShell 
                        themeKey={invitation.theme_key}
                        src={`/invite/${invitation.slug}`}
                        url={`/invite/${invitation.slug}`}
                        isLive={false}
                        className="h-full w-full min-h-[600px]"
                    />
                </div>
            </div>
        </div>
    );
}
