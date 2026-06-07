import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const loveStoryItemSchema = z.object({
    year: z.string().max(100).optional(),
    date: z.string().max(100).optional(),
    title: z.string().max(200),
    description: z.string().max(2000).optional(),
    desc: z.string().max(2000).optional(),
    photo: z.string().max(2000).optional(),
});

const patchInvitationSchema = z.object({
    status: z.string().max(40).optional(),
    slug: z.string().trim().max(120).regex(/^[a-z0-9-]*$/).optional(),
    groom_name: z.string().max(150).optional(),
    bride_name: z.string().max(150).optional(),
    groom_full_name: z.string().max(250).optional(),
    bride_full_name: z.string().max(250).optional(),
    groom_father: z.string().max(250).optional(),
    groom_mother: z.string().max(250).optional(),
    bride_father: z.string().max(250).optional(),
    bride_mother: z.string().max(250).optional(),
    groom_photo_url: z.string().max(2000).optional(),
    bride_photo_url: z.string().max(2000).optional(),
    couple_photo_url: z.string().max(2000).optional(),
    background_photo_url: z.string().max(2000).optional(),
    akad_date: z.string().max(100).optional(),
    akad_venue: z.string().max(500).optional(),
    akad_address: z.string().max(2000).optional(),
    akad_maps_url: z.string().max(2000).optional(),
    reception_date: z.string().max(100).optional(),
    reception_venue: z.string().max(500).optional(),
    reception_address: z.string().max(2000).optional(),
    reception_maps_url: z.string().max(2000).optional(),
    dresscode_colors: z.string().max(500).optional(),
    dresscode_note: z.string().max(1000).optional(),
    greeting_text: z.string().max(5000).optional(),
    quote_source: z.string().max(300).optional(),
    music_url: z.string().max(2000).optional(),
    love_story: z.array(loveStoryItemSchema).max(30).optional(),
    gallery_photos: z.array(z.string().max(2000)).max(100).optional(),
    sections_order: z.array(z.string().max(80)).max(30).optional(),
    sections_visibility: z.record(z.string(), z.boolean()).optional(),
    gift_bank_name: z.string().max(100).optional(),
    gift_bank_account: z.string().max(100).optional(),
    gift_bank_account_name: z.string().max(250).optional(),
    gift_shipping_address: z.string().max(2000).optional(),
    qris_account: z.string().max(2000).optional(),
    show_couple_photos: z.boolean().optional(),
    show_prewed_gallery: z.boolean().optional(),
    show_gift_section: z.boolean().optional(),
    rsvp_enabled: z.boolean().optional(),
});

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : '';
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    try {
        const { id } = resolvedParams;

        const { data: invitation, error } = await supabase
            .from('invitations')
            .select(`
                id,
                slug,
                status,
                theme_key,
                theme_id,
                created_at,
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
                couple_photo_url,
                background_photo_url,
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
                gift_bank_name,
                gift_bank_account,
                gift_bank_account_name,
                gift_shipping_address,
                qris_account,
                show_couple_photos,
                show_prewed_gallery,
                show_gift_section,
                rsvp_enabled,
                sections_order,
                sections_visibility
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !invitation) {
            console.error('[GET /api/invitations/[id]] error:', error);
            return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: 'Undangan tidak ditemukan' } }, { status: 404 });
        }

        return NextResponse.json({ data: invitation, error: null });

    } catch (error: unknown) {
        console.error('[GET /api/invitations/[id]] unexpected error:', error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Server error' } }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    try {
        const { id } = resolvedParams;
        const parsed = patchInvitationSchema.safeParse(await request.json());
        if (!parsed.success) {
            return NextResponse.json({
                data: null,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Data undangan tidak valid.',
                    details: parsed.error.flatten().fieldErrors,
                },
            }, { status: 400 });
        }
        const body = parsed.data;

        // Ownership check
        const { data: inv, error: checkError } = await supabase
            .from('invitations')
            .select('id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (checkError || !inv) {
            return NextResponse.json({ data: null, error: { code: 'FORBIDDEN', message: 'Akses ditolak' } }, { status: 403 });
        }

        const updates: Record<string, unknown> = {};

        // Status
        if (body.status !== undefined) updates.status = body.status;

        // Slug with uniqueness check
        if (body.slug !== undefined && body.slug !== '') {
            const { data: existing } = await supabase
                .from('invitations')
                .select('id')
                .eq('slug', body.slug)
                .neq('id', id)
                .single();
            if (existing) {
                return NextResponse.json({ data: null, error: { code: 'SLUG_TAKEN', message: 'URL/Slug sudah digunakan.' } }, { status: 409 });
            }
            updates.slug = body.slug;
        }

        // Mempelai
        if (body.groom_name !== undefined) updates.groom_nickname = body.groom_name;
        if (body.bride_name !== undefined) updates.bride_nickname = body.bride_name;
        if (body.groom_full_name !== undefined) updates.groom_full_name = body.groom_full_name;
        if (body.bride_full_name !== undefined) updates.bride_full_name = body.bride_full_name;
        if (body.groom_father !== undefined) updates.groom_father_name = body.groom_father;
        if (body.groom_mother !== undefined) updates.groom_mother_name = body.groom_mother;
        if (body.bride_father !== undefined) updates.bride_father_name = body.bride_father;
        if (body.bride_mother !== undefined) updates.bride_mother_name = body.bride_mother;

        // Akad
        if (body.akad_date !== undefined) updates.akad_datetime = body.akad_date || null;
        if (body.akad_venue !== undefined) updates.akad_location_name = body.akad_venue;
        if (body.akad_address !== undefined) updates.akad_location_address = body.akad_address;

        // Resepsi
        if (body.reception_date !== undefined) updates.resepsi_datetime = body.reception_date || null;
        if (body.reception_venue !== undefined) updates.resepsi_location_name = body.reception_venue;
        if (body.reception_address !== undefined) updates.resepsi_location_address = body.reception_address;

        // Quote / greeting
        if (body.greeting_text !== undefined) updates.quote_text = body.greeting_text;
        if (body.quote_source !== undefined) updates.quote_source = body.quote_source;
        // Music
        if (body.music_url !== undefined) updates.music_url = body.music_url || null;

        // Love story
        if (body.love_story !== undefined) updates.love_story = body.love_story;
        if (body.gallery_photos !== undefined) updates.gallery_photos = body.gallery_photos;

        // Cover and background photos
        if (body.couple_photo_url !== undefined) updates.couple_photo_url = body.couple_photo_url;
        if (body.background_photo_url !== undefined) updates.background_photo_url = body.background_photo_url;
        if (body.groom_photo_url !== undefined) updates.groom_photo_url = body.groom_photo_url;
        if (body.bride_photo_url !== undefined) updates.bride_photo_url = body.bride_photo_url;

        // Maps URL
        if (body.akad_maps_url !== undefined) updates.akad_maps_url = body.akad_maps_url;
        if (body.reception_maps_url !== undefined) updates.resepsi_maps_url = body.reception_maps_url;

        // Dresscode
        if (body.dresscode_colors !== undefined) updates.dresscode_colors = body.dresscode_colors;
        if (body.dresscode_note !== undefined) updates.dresscode_note = body.dresscode_note;

        // Sections order & visibility
        if (body.sections_order !== undefined) updates.sections_order = body.sections_order;
        if (body.sections_visibility !== undefined) updates.sections_visibility = body.sections_visibility;
        // Gift
        if (body.gift_bank_name !== undefined) updates.gift_bank_name = body.gift_bank_name;
        if (body.gift_bank_account !== undefined) {
            const cleaned = String(body.gift_bank_account).replace(/\D/g, "");
            updates.gift_bank_account = cleaned;
        }
        if (body.gift_bank_account_name !== undefined) updates.gift_bank_account_name = body.gift_bank_account_name;
        if (body.gift_shipping_address !== undefined) updates.gift_shipping_address = body.gift_shipping_address;
        if (body.qris_account !== undefined) updates.qris_account = body.qris_account;

        // Visibility toggles & settings
        if (body.show_couple_photos !== undefined) updates.show_couple_photos = body.show_couple_photos;
        if (body.show_prewed_gallery !== undefined) updates.show_prewed_gallery = body.show_prewed_gallery;
        if (body.show_gift_section !== undefined) updates.show_gift_section = body.show_gift_section;
        if (body.rsvp_enabled !== undefined) updates.rsvp_enabled = body.rsvp_enabled;

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ data: { success: true }, error: null });
        }

        const { error: updateError } = await supabase
            .from('invitations')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id);

        if (updateError) {
            console.error('[PATCH /api/invitations/[id]] update error:', updateError);
            throw updateError;
        }

        return NextResponse.json({ data: { success: true }, error: null });

    } catch (error: unknown) {
        console.error('[PATCH /api/invitations/[id]] unexpected error:', error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Gagal memperbarui undangan: ' + errorMessage(error) } }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });

    try {
        const { id } = resolvedParams;

        const { error } = await supabase
            .from('invitations')
            .update({ soft_delete_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ data: { success: true }, error: null });
    } catch (error: unknown) {
        console.error('[DELETE /api/invitations/[id]] error:', error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Gagal menghapus undangan' } }, { status: 500 });
    }
}
