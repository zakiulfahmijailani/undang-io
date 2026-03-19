import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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
                show_gift_section
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !invitation) {
            console.error('[GET /api/invitations/[id]] error:', error);
            return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: 'Undangan tidak ditemukan' } }, { status: 404 });
        }

        return NextResponse.json({ data: invitation, error: null });

    } catch (error: any) {
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
        const body = await request.json();

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

        const updates: Record<string, any> = {};

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

        // Visibility toggles
        if (body.show_couple_photos !== undefined) updates.show_couple_photos = body.show_couple_photos;
        if (body.show_prewed_gallery !== undefined) updates.show_prewed_gallery = body.show_prewed_gallery;
        if (body.show_gift_section !== undefined) updates.show_gift_section = body.show_gift_section;

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

    } catch (error: any) {
        console.error('[PATCH /api/invitations/[id]] unexpected error:', error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Gagal memperbarui undangan: ' + (error.message || '') } }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = resolvedParams;

        const { error } = await supabase
            .from('invitations')
            .update({ soft_delete_at: new Date().toISOString() })
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ data: { success: true }, error: null });
    } catch (error: any) {
        console.error('[DELETE /api/invitations/[id]] error:', error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Gagal menghapus undangan' } }, { status: 500 });
    }
}
