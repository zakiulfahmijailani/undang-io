import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { demoData } from "@/data/demoInvitation";
import InvitationClientWrapper from './InvitationClientWrapper';
import ViewTracker from './ViewTracker';
import ParallaxWrapper from './ParallaxWrapper';
import { fetchClassicTheme, mapInvitationToClassicData } from '@/lib/classic-theme-loader';
import ClassicThemeRendererWrapper from './ClassicThemeRendererWrapper';
import FatehaThemeRendererWrapper from './FatehaThemeRendererWrapper';
import { DEFAULT_INVITATION_THEME_KEY, JAWA_AGUNG_THEME_KEY, OBSIDIAN_LUXE_THEME_KEY, PETAL_SOFT_THEME_KEY } from '@/lib/default-theme';
import { mapInvitationToFatehaData } from '@/lib/fateha-theme-mapper';
import { JawaAgungTemplate } from '@/components/themes/jawa-agung';
import { ObsidianLuxeTemplate } from '@/components/themes/obsidian-luxe';
import { PetalSoftTemplate } from '@/components/themes/petal-soft';

export const revalidate = 0;

interface InvitePageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ preview?: string; theme?: string; to?: string }>;
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
    const guestName = resolvedSearch.to || undefined;

    if (slug === '404') notFound();

    if (slug === 'demo') {
        const shouldRenderSakinahDemo =
            !resolvedSearch.theme || resolvedSearch.theme === DEFAULT_INVITATION_THEME_KEY;

        if (shouldRenderSakinahDemo) {
            const fatehaDemoData = mapInvitationToFatehaData({
                id: 'demo',
                slug: 'demo',
                groom_full_name: demoData.groom.fullName,
                groom_nickname: 'Budi',
                groom_father_name: demoData.groom.father,
                groom_mother_name: demoData.groom.mother,
                bride_full_name: demoData.bride.fullName,
                bride_nickname: 'Ayu',
                bride_father_name: demoData.bride.father,
                bride_mother_name: demoData.bride.mother,
                akad_datetime: demoData.akad.date,
                akad_location_name: demoData.akad.venue,
                akad_location_address: demoData.akad.address,
                akad_maps_url: demoData.akad.mapsUrl,
                resepsi_datetime: demoData.reception.date,
                resepsi_location_name: demoData.reception.venue,
                resepsi_location_address: demoData.reception.address,
                resepsi_maps_url: demoData.reception.mapsUrl,
                quote_text: demoData.quote.text,
                quote_source: demoData.quote.source,
                love_story: demoData.loveStory,
                gallery_photos: demoData.gallery,
                rekening: demoData.bankAccounts,
                gift_shipping_address: demoData.giftAddress,
                rsvp_messages: demoData.rsvpMessages.map((message) => ({
                    id: message.id,
                    guest_name: message.guestName,
                    attendance: message.attendance,
                    message: message.message,
                    created_at: message.createdAt,
                })),
            }, { isPreview: true });

            return (
                <>
                    <FatehaThemeRendererWrapper data={fatehaDemoData} />
                    <ViewTracker slug={slug} isPreview={isPreview} />
                </>
            );
        }

        if (resolvedSearch.theme === PETAL_SOFT_THEME_KEY) {
            const petalSoftDemoData = mapInvitationToFatehaData({
                id: 'demo-petal-soft',
                slug: 'demo-petal-soft',
                groom_full_name: 'Muhammad Rizki Pratama',
                groom_nickname: 'Rizki',
                groom_father_name: 'Bapak Lorem',
                groom_mother_name: 'Ibu Ipsum',
                bride_full_name: 'Nazwa Aurelia Putri',
                bride_nickname: 'Nazwa',
                bride_father_name: 'Bapak Dolor',
                bride_mother_name: 'Ibu Sit Amet',
                akad_datetime: '2025-10-12T08:00:00+07:00',
                akad_location_name: 'Masjid Al-Ikhlas',
                akad_location_address: 'Jl. Damai No. 10, Bandung, Jawa Barat',
                akad_maps_url: demoData.akad.mapsUrl,
                resepsi_datetime: '2025-10-12T11:00:00+07:00',
                resepsi_location_name: 'Gedung Harmoni',
                resepsi_location_address: 'Jl. Bahagia No. 20, Bandung, Jawa Barat',
                resepsi_maps_url: demoData.reception.mapsUrl,
                quote_text: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu merasa tenteram kepadanya.',
                quote_source: 'QS. Ar-Rum: 21',
                love_story: demoData.loveStory,
                gallery_photos: demoData.gallery,
                rekening: demoData.bankAccounts,
                gift_shipping_address: demoData.giftAddress,
                rsvp_messages: demoData.rsvpMessages.map((message) => ({
                    id: message.id,
                    guest_name: message.guestName,
                    attendance: message.attendance,
                    message: message.message,
                    created_at: message.createdAt,
                })),
            }, { isPreview: true });

            return (
                <>
                    <PetalSoftTemplate data={petalSoftDemoData} />
                    <ViewTracker slug={slug} isPreview={isPreview} />
                </>
            );
        }

        if (resolvedSearch.theme === OBSIDIAN_LUXE_THEME_KEY) {
            const obsidianDemoData = mapInvitationToFatehaData({
                id: 'demo-obsidian-luxe',
                slug: 'demo-obsidian-luxe',
                groom_full_name: 'Rafi Narendra',
                groom_nickname: 'Rafi',
                groom_father_name: 'Bapak Arman',
                groom_mother_name: 'Ibu Lestari',
                bride_full_name: 'Adelia Maharani',
                bride_nickname: 'Adelia',
                bride_father_name: 'Bapak Surya',
                bride_mother_name: 'Ibu Kirana',
                akad_datetime: '2026-02-14T10:00:00+07:00',
                akad_location_name: 'The Dharmawangsa Ballroom',
                akad_location_address: 'Jl. Brawijaya Raya No. 26, Jakarta Selatan',
                akad_maps_url: 'https://maps.google.com/?q=The+Dharmawangsa+Jakarta',
                resepsi_datetime: '2026-02-14T19:00:00+07:00',
                resepsi_location_name: 'Grand Ballroom Ritz-Carlton',
                resepsi_location_address: 'Jl. DR. Ide Anak Agung Gde Agung, Jakarta Selatan',
                resepsi_maps_url: 'https://maps.google.com/?q=Ritz+Carlton+Mega+Kuningan',
                quote_text: 'Cinta adalah janji yang dipilih setiap hari, dengan hati yang sama dan doa yang semakin dalam.',
                quote_source: 'Adelia & Rafi',
                love_story: demoData.loveStory,
                gallery_photos: demoData.gallery,
                rekening: demoData.bankAccounts,
                gift_shipping_address: demoData.giftAddress,
                rsvp_messages: demoData.rsvpMessages.map((message) => ({
                    id: message.id,
                    guest_name: message.guestName,
                    attendance: message.attendance,
                    message: message.message,
                    created_at: message.createdAt,
                })),
            }, { isPreview: true });

            return (
                <>
                    <ObsidianLuxeTemplate data={obsidianDemoData} />
                    <ViewTracker slug={slug} isPreview={isPreview} />
                </>
            );
        }

        if (resolvedSearch.theme === JAWA_AGUNG_THEME_KEY) {
            const jawaAgungDemoData = mapInvitationToFatehaData({
                id: 'demo-jawa-agung',
                slug: 'demo-jawa-agung',
                groom_full_name: 'Raden Bagus Wiratama',
                groom_nickname: 'Wira',
                groom_father_name: 'Bapak Suryadiningrat',
                groom_mother_name: 'Ibu Sekar Arum',
                bride_full_name: 'Ajeng Larasati Kusuma',
                bride_nickname: 'Laras',
                bride_father_name: 'Bapak Kertanegara',
                bride_mother_name: 'Ibu Puspita Dewi',
                akad_datetime: '2026-08-08T09:00:00+07:00',
                akad_location_name: 'Pendopo Agung Taman Budaya',
                akad_location_address: 'Jl. Sriwedari No. 18, Surakarta, Jawa Tengah',
                akad_maps_url: 'https://maps.google.com/?q=Taman+Budaya+Surakarta',
                resepsi_datetime: '2026-08-08T19:00:00+07:00',
                resepsi_location_name: 'Balai Kartini Adiningrat',
                resepsi_location_address: 'Jl. Slamet Riyadi No. 120, Surakarta, Jawa Tengah',
                resepsi_maps_url: 'https://maps.google.com/?q=Balai+Kartini+Surakarta',
                quote_text: 'Dalam restu keluarga dan doa yang tulus, kami melangkah bersama merawat cinta sebagai jalan pulang.',
                quote_source: 'Laras & Wira',
                love_story: demoData.loveStory,
                gallery_photos: demoData.gallery,
                rekening: demoData.bankAccounts,
                gift_shipping_address: demoData.giftAddress,
                rsvp_messages: demoData.rsvpMessages.map((message) => ({
                    id: message.id,
                    guest_name: message.guestName,
                    attendance: message.attendance,
                    message: message.message,
                    created_at: message.createdAt,
                })),
            }, { isPreview: true });

            return (
                <>
                    <JawaAgungTemplate data={jawaAgungDemoData} />
                    <ViewTracker slug={slug} isPreview={isPreview} />
                </>
            );
        }

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
            theme_key,
            created_at,
            active_theme_id,
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
            akad_maps_url,
            resepsi_datetime,
            resepsi_location_name,
            resepsi_location_address,
            resepsi_maps_url,
            quote_text,
            quote_source,
            music_url,
            love_story,
            gallery_photos,
            gift_bank_name,
            gift_bank_account,
            gift_bank_account_name,
            gift_shipping_address,
            show_couple_photos,
            show_prewed_gallery,
            show_gift_section,
            sections_order,
            sections_visibility
        `)
        .eq('slug', slug)
        .single();

    if (error || !invitation) {
        console.error('[invite/[slug]] fetch error:', error?.code, error?.message);
        notFound();
    }

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

    // ── Classic Theme Route ─────────────────────────────────────────────
    const themeKey = (invitation as any).theme_key as string | null;

    if (themeKey === PETAL_SOFT_THEME_KEY) {
        const petalSoftData = mapInvitationToFatehaData(invitation, { guestName, isPreview });
        return (
            <>
                <PetalSoftTemplate data={petalSoftData} />
                <ViewTracker slug={slug} isPreview={isPreview} />
            </>
        );
    }

    if (themeKey === OBSIDIAN_LUXE_THEME_KEY) {
        const obsidianData = mapInvitationToFatehaData(invitation, { guestName, isPreview });
        return (
            <>
                <ObsidianLuxeTemplate data={obsidianData} />
                <ViewTracker slug={slug} isPreview={isPreview} />
            </>
        );
    }

    if (themeKey === JAWA_AGUNG_THEME_KEY) {
        const jawaAgungData = mapInvitationToFatehaData(invitation, { guestName, isPreview });
        return (
            <>
                <JawaAgungTemplate data={jawaAgungData} />
                <ViewTracker slug={slug} isPreview={isPreview} />
            </>
        );
    }

    if (themeKey === DEFAULT_INVITATION_THEME_KEY) {
        const fatehaData = mapInvitationToFatehaData(invitation, { guestName, isPreview });
        return (
            <>
                <FatehaThemeRendererWrapper data={fatehaData} />
                <ViewTracker slug={slug} isPreview={isPreview} />
            </>
        );
    }

    if (themeKey && themeKey.startsWith('classic')) {
        const classicTheme = await fetchClassicTheme(themeKey);
        if (classicTheme) {
            const classicData = mapInvitationToClassicData(invitation);
            return (
                <>
                    <ClassicThemeRendererWrapper
                        theme={classicTheme}
                        data={classicData}
                        guestName={guestName}
                        isPreview={isPreview}
                    />
                    <ViewTracker slug={slug} isPreview={isPreview} />
                </>
            );
        }
        // If classic theme not found in DB, fall through to legacy flow
    }

    // ── Legacy Parallax / Flat Flow ────────────────────────────────────
    const data: any = { ...demoData };

    const groomNick = invitation.groom_nickname || 'Mempelai Pria';
    const brideNick = invitation.bride_nickname || 'Mempelai Wanita';
    data.coupleShortName = `${groomNick} & ${brideNick}`;

    data.groom = { ...demoData.groom };
    data.groom.nickname = groomNick;
    if (invitation.groom_full_name) data.groom.fullName = invitation.groom_full_name;
    if (invitation.groom_father_name) data.groom.father = `Bapak ${invitation.groom_father_name}`;
    if (invitation.groom_mother_name) data.groom.mother = `Ibu ${invitation.groom_mother_name}`;

    data.bride = { ...demoData.bride };
    data.bride.nickname = brideNick;
    if (invitation.bride_full_name) data.bride.fullName = invitation.bride_full_name;
    if (invitation.bride_father_name) data.bride.father = `Bapak ${invitation.bride_father_name}`;
    if (invitation.bride_mother_name) data.bride.mother = `Ibu ${invitation.bride_mother_name}`;

    data.akad = { ...demoData.akad };
    if (invitation.akad_datetime) data.akad.date = invitation.akad_datetime;
    if (invitation.akad_location_name) data.akad.venue = invitation.akad_location_name;
    if (invitation.akad_location_address) data.akad.address = invitation.akad_location_address;

    data.reception = { ...demoData.reception };
    if (invitation.resepsi_datetime) data.reception.date = invitation.resepsi_datetime;
    if (invitation.resepsi_location_name) data.reception.venue = invitation.resepsi_location_name;
    if (invitation.resepsi_location_address) data.reception.address = invitation.resepsi_location_address;

    if (invitation.quote_text) {
        data.quote = { text: invitation.quote_text, source: 'Mempelai' };
    }

    data.musicUrl = invitation.music_url || null;

    return (
        <>
            <ParallaxWrapper
                data={data}
                invitationId={invitation.id}
                activeThemeId={invitation.active_theme_id ?? null}
            />
            <ViewTracker slug={slug} isPreview={isPreview} />
        </>
    );
}
