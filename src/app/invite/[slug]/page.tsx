import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { demoData } from "@/data/demoInvitation";
import InvitationClientWrapper from './InvitationClientWrapper';
import ViewTracker from './ViewTracker';

// Disable Next.js full-route cache — edits in Supabase reflect immediately
export const revalidate = 0;

interface InvitePageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (slug === '404') return { title: 'Not Found' };

    const supabase = await createServerSupabaseClient();
    const { data: inv } = await supabase
        .from('invitations')
        .select('groom_nickname, bride_nickname')
        .eq('slug', slug)
        .single();

    const coupleName = inv
        ? `${inv.groom_nickname || 'Mempelai Pria'} & ${inv.bride_nickname || 'Mempelai Wanita'}`
        : demoData.coupleShortName;

    return {
        title: `Undangan Pernikahan | ${coupleName}`,
        description: `Kami mengundang Anda untuk hadir di acara pernikahan kami.`,
        openGraph: { images: [demoData.coverPhoto] },
    };
}

export default async function InvitePage({ params, searchParams }: InvitePageProps) {
    const resolvedParams = await params;
    const resolvedSearch = await searchParams;
    const { slug } = resolvedParams;
    const isPreview = resolvedSearch.preview === 'true';

    if (slug === '404') notFound();

    // Demo mode
    if (slug === 'demo') {
        return (
            <>
                <InvitationClientWrapper data={demoData} />
                <ViewTracker slug={slug} isPreview={isPreview} />
            </>
        );
    }

    const supabase = await createServerSupabaseClient();

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
        .eq('slug', slug)
        .single();

    if (error || !invitation) {
        console.error('[invite/[slug]] fetch error:', error?.code, error?.message);
        notFound();
    }

    // Status guard: only block if truly not publishable
    // 'active' and 'paid' = live; everything else needs ?preview=true
    const isLive = invitation.status === 'active' || invitation.status === 'paid';
    if (!isLive && !isPreview) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50 p-4 font-sans">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-stone-200 max-w-md w-full animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-stone-100 rounded-full mx-auto flex items-center justify-center text-2xl mb-6">🗓️</div>
                    <h1 className="text-2xl font-serif text-stone-800 font-bold mb-3">Undangan Belum Aktif</h1>
                    <p className="text-stone-500 leading-relaxed mb-6">Pemilik undangan digital ini belum mengaktifkan atau mempublikasikan halaman ini.</p>
                </div>
            </div>
        );
    }

    // Map flat DB columns -> InvitationClientWrapper data shape
    const data: any = { ...demoData };

    const groomNick = invitation.groom_nickname || 'Mempelai Pria';
    const brideNick = invitation.bride_nickname || 'Mempelai Wanita';
    data.coupleShortName = `${groomNick} & ${brideNick}`;

    data.groom = { ...demoData.groom };
    data.groom.nickname = groomNick;
    if (invitation.groom_full_name)   data.groom.fullName = invitation.groom_full_name;
    if (invitation.groom_father_name) data.groom.father   = `Bapak ${invitation.groom_father_name}`;
    if (invitation.groom_mother_name) data.groom.mother   = `Ibu ${invitation.groom_mother_name}`;

    data.bride = { ...demoData.bride };
    data.bride.nickname = brideNick;
    if (invitation.bride_full_name)   data.bride.fullName = invitation.bride_full_name;
    if (invitation.bride_father_name) data.bride.father   = `Bapak ${invitation.bride_father_name}`;
    if (invitation.bride_mother_name) data.bride.mother   = `Ibu ${invitation.bride_mother_name}`;

    data.akad = { ...demoData.akad };
    if (invitation.akad_datetime)         data.akad.date    = invitation.akad_datetime;
    if (invitation.akad_location_name)    data.akad.venue   = invitation.akad_location_name;
    if (invitation.akad_location_address) data.akad.address = invitation.akad_location_address;

    data.reception = { ...demoData.reception };
    if (invitation.resepsi_datetime)           data.reception.date    = invitation.resepsi_datetime;
    if (invitation.resepsi_location_name)      data.reception.venue   = invitation.resepsi_location_name;
    if (invitation.resepsi_location_address)   data.reception.address = invitation.resepsi_location_address;

    if (invitation.quote_text) {
        data.quote = { text: invitation.quote_text, source: 'Mempelai' };
    }

    return (
        <>
            <InvitationClientWrapper data={data} invitationId={invitation.id} />
            <ViewTracker slug={slug} isPreview={isPreview} />
        </>
    );
}
