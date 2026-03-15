import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    if (!supabase) {
        return NextResponse.json({ data: null, error: { code: 'DATABASE_ERROR', message: 'Database not initialized' } }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    try {
        const { id } = resolvedParams;

        // Verify ownership and fetch
        const { data: invitation, error } = await supabase
            .from('invitations')
            .select(`
                id, slug, status, created_at,
                invitation_details (*)
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error || !invitation) {
            return NextResponse.json({ data: null, error: { code: 'NOT_FOUND', message: 'Undangan tidak ditemukan' } }, { status: 404 });
        }

        return NextResponse.json({ data: invitation, error: null });

    } catch (error: any) {
        console.error("[GET /api/invitations/[id]] Error:", error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Server error' } }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    if (!supabase) {
        return NextResponse.json({ data: null, error: { code: 'DATABASE_ERROR', message: 'Database not initialized' } }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    try {
        const { id } = resolvedParams;
        const body = await request.json();

        // 1. Ownership check
        const { data: inv, error: checkError } = await supabase
            .from('invitations')
            .select('id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (checkError || !inv) {
            return NextResponse.json({ data: null, error: { code: 'FORBIDDEN', message: 'Akses ditolak' } }, { status: 403 });
        }

        // 2. Separate updates
        const { status, slug, theme_id, ...detailsUpdates } = body;

        // Update invitations table
        const invUpdates: any = {};
        if (status) invUpdates.status = status;
        if (slug) {
            // Check slug uniqueness
            const { data: existing } = await supabase
                .from('invitations')
                .select('id')
                .eq('slug', slug)
                .neq('id', id)
                .single();
            if (existing) {
                return NextResponse.json({ data: null, error: { code: 'SLUG_TAKEN', message: 'URL/Slug sudah digunakan.' } }, { status: 409 });
            }
            invUpdates.slug = slug;
        }
        if (theme_id) invUpdates.theme_id = theme_id;

        if (Object.keys(invUpdates).length > 0) {
            const { error: updateInvError } = await supabase
                .from('invitations')
                .update(invUpdates)
                .eq('id', id);
            if (updateInvError) throw updateInvError;
        }

        // Update invitation_details table
        if (Object.keys(detailsUpdates).length > 0) {
            // Some fields might need cleaning if they come from EditorClient flattened
            const { error: updateDetError } = await supabase
                .from('invitation_details')
                .update(detailsUpdates)
                .eq('invitation_id', id);
            if (updateDetError) throw updateDetError;
        }

        return NextResponse.json({ data: { success: true }, error: null });

    } catch (error: any) {
        console.error("[PATCH /api/invitations/[id]] Error:", error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Gagal memperbarui undangan' } }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    if (!supabase) {
        return NextResponse.json({ data: null, error: { code: 'DATABASE_ERROR', message: 'Database not initialized' } }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = resolvedParams;

        const { error } = await supabase
            .from('invitations')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ data: { success: true }, error: null });
    } catch (error: any) {
        console.error("[DELETE /api/invitations/[id]] Error:", error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Gagal menghapus undangan' } }, { status: 500 });
    }
}
