import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import EditorClient, { type InvitationEditorInitialData } from "../EditorClient";

function createDummyInvitation(id: string): InvitationEditorInitialData {
    return {
        id,
        slug: 'demo',
        status: 'draft',
        created_at: new Date().toISOString(),
        couple_photo_url: null,
        groom_full_name: null,
        groom_nickname: null,
        groom_father_name: null,
        groom_mother_name: null,
        bride_full_name: null,
        bride_nickname: null,
        bride_father_name: null,
        bride_mother_name: null,
        akad_datetime: null,
        akad_location_name: null,
        akad_location_address: null,
        resepsi_datetime: null,
        resepsi_location_name: null,
        resepsi_location_address: null,
        quote_text: null,
        quote_source: null,
        music_url: null,
        love_story: null,
        gallery_photos: null,
        sections_order: null,
        sections_visibility: null,
        gift_bank_name: null,
        gift_bank_account: null,
        gift_bank_account_name: null,
        gift_shipping_address: null,
        show_couple_photos: true,
        show_prewed_gallery: true,
        show_gift_section: true,
    };
}

export default async function PreviewSplitViewPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // LOCAL DEV / NO DB MODE
    if (!supabase) {
        const dummyInvitation = createDummyInvitation(id);
        
        return (
            <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-stone-100">
                <div className="hidden lg:flex w-[480px] flex-col border-r border-stone-200 bg-white overflow-y-auto">
                    <div className="h-full">
                        <EditorClient initialData={dummyInvitation} />
                    </div>
                </div>
                <div className="flex-1 flex flex-col bg-stone-200 relative overflow-hidden">
                    <div className="absolute top-4 right-4 z-50 pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 text-xs font-bold rounded shadow-lg uppercase tracking-widest border border-white/10">
                            Local Preview
                        </div>
                    </div>
                    <div className="lg:hidden absolute top-4 left-4 z-50 pointer-events-none">
                        <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 text-xs font-bold rounded shadow-lg">
                            Buka di Desktop untuk Split View
                        </div>
                    </div>
                    <div className="flex-1 w-full h-full flex items-center justify-center p-4 lg:p-8">
                        <div className="relative w-full max-w-[420px] h-full max-h-[900px] bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-stone-800 ring-1 ring-stone-900 overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-7 bg-black z-20 rounded-b-3xl"></div>
                            <iframe
                                src={`/u/demo?preview=true`}
                                className="w-full h-full bg-white rounded-[2.25rem] border-0"
                                title="Live Preview"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: invitation, error } = await supabase
        .from('invitations')
        .select(`
            id, slug, status, created_at,
            couple_photo_url,
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
            show_couple_photos,
            show_prewed_gallery,
            show_gift_section
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !invitation) {
        redirect("/dashboard");
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-stone-100">
            {/* Left Panel: Editor Sidebar (Hidden on small mobile) */}
            <div className="hidden lg:flex w-[480px] flex-col border-r border-stone-200 bg-white overflow-y-auto">
                <div className="h-full">
                    <EditorClient initialData={invitation as InvitationEditorInitialData} />
                </div>
            </div>

            {/* Right Panel: Iframe Preview */}
            <div className="flex-1 flex flex-col bg-stone-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 z-50 pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 text-xs font-bold rounded shadow-lg uppercase tracking-widest border border-white/10">
                        Preview Mode
                    </div>
                </div>

                {/* Mobile placeholder text when viewing on small screen */}
                <div className="lg:hidden absolute top-4 left-4 z-50 pointer-events-none">
                    <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 text-xs font-bold rounded shadow-lg">
                        Buka di Desktop untuk Split View
                    </div>
                </div>

                <div className="flex-1 w-full h-full flex items-center justify-center p-4 lg:p-8">
                    {/* Phone Device Mockup Wrapper */}
                    <div className="relative w-full max-w-[420px] h-full max-h-[900px] bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-stone-800 ring-1 ring-stone-900 overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-7 bg-black z-20 rounded-b-3xl"></div> {/* Mock notch */}
                        <iframe
                            src={`/u/${invitation.slug}?preview=true`}
                            className="w-full h-full bg-white rounded-[2.25rem] border-0"
                            title="Live Preview"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
