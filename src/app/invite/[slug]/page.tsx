import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { demoData } from "@/data/demoInvitation";
import InvitationClientWrapper from './InvitationClientWrapper';
import ViewTracker from './ViewTracker';

interface InvitePageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata(
    { params }: InvitePageProps
): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (slug === '404') {
        return { title: 'Not Found' };
    }

    return {
        title: `Undangan Pernikahan | ${demoData.coupleShortName}`,
        description: `Kami mengundang Anda untuk hadir di acara pernikahan kami.`,
        openGraph: {
            images: [demoData.coverPhoto],
        },
    };
}

export default async function InvitePage({ params, searchParams }: InvitePageProps) {
    const resolvedParams = await params;
    const resolvedSearch = await searchParams;
    const { slug } = resolvedParams;
    const isPreview = resolvedSearch.preview === 'true';

    if (slug === '404') {
        notFound();
    }

    const supabase = await createServerSupabaseClient();

    // Fetch real data
    const { data: invitation } = await supabase
        .from('invitations')
        .select(`
            id, slug, status, created_at,
            invitation_details (*)
        `)
        .eq('slug', slug)
        .single();

    if (!invitation) {
        if (slug === 'demo') {
            return (
                <>
                    <InvitationClientWrapper data={demoData} />
                    <ViewTracker slug={slug} isPreview={isPreview} />
                </>
            );
        }
        notFound();
    }

    // Protection for inactive invitations
    if (invitation.status !== 'active' && !isPreview) {
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

    // Map actual DB data to the shape required by InvitationClientWrapper (using demoData as base for unmapped legacy components)
    const data = { ...demoData } as any;
    if (invitation.invitation_details) {
        const details = invitation.invitation_details;
        data.coupleShortName = `${details.groom_name} & ${details.bride_name}`;

        if (details.groom_full_name) data.groom.fullName = details.groom_full_name;
        if (details.bride_full_name) data.bride.fullName = details.bride_full_name;
        if (details.groom_father) data.groom.father = `Bapak ${details.groom_father}`;
        if (details.groom_mother) data.groom.mother = `Ibu ${details.groom_mother}`;
        if (details.bride_father) data.bride.father = `Bapak ${details.bride_father}`;
        if (details.bride_mother) data.bride.mother = `Ibu ${details.bride_mother}`;

        if (details.akad_date) data.akad.date = details.akad_date;
        if (details.akad_venue) data.akad.venue = details.akad_venue;
        if (details.akad_address) data.akad.address = details.akad_address;
        if (details.akad_maps) data.akad.mapsUrl = details.akad_maps;

        if (details.reception_date) data.reception.date = details.reception_date;
        if (details.reception_venue) data.reception.venue = details.reception_venue;
        if (details.reception_address) data.reception.address = details.reception_address;
        if (details.reception_maps) data.reception.mapsUrl = details.reception_maps;

        if (details.couple_photo_url) {
            data.coverPhoto = details.couple_photo_url;
            data.groom.photo = details.couple_photo_url;
            data.bride.photo = details.couple_photo_url;
        }

        if (details.greeting_text) data.quote = { text: details.greeting_text, source: "Mempelai" };
        if (details.music_url) data.musicUrl = details.music_url;
    }

    // Pass invitation.id into the wrapper so RSVP actions bind to the correct invitation
    return (
        <>
            {/* Provide invitation.id if the component was updated to take it */}
            <InvitationClientWrapper data={data} {...(invitation ? { invitationId: invitation.id } : {})} />
            <ViewTracker slug={slug} isPreview={isPreview} />
        </>
    );
}
