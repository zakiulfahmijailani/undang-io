import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/invitations/[id]/messages
// Fetch all RSVP messages for a specific invitation with ownership verification
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ data: null, error: { code: 'UNAUTHORIZED', message: 'Sesi habis.' } }, { status: 401 });
    }

    try {
        const { id } = resolvedParams;

        // Verify ownership
        const { data: invitation, error: invError } = await supabase
            .from('invitations')
            .select('id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (invError || !invitation) {
            return NextResponse.json({ data: null, error: { code: 'FORBIDDEN', message: 'Undangan tidak ditemukan atau bukan milik Anda.' } }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Fetch messages
        const { data: messages, error, count } = await supabase
            .from('rsvp_messages')
            .select('*', { count: 'exact' })
            .eq('invitation_id', id)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        return NextResponse.json({
            data: {
                items: messages,
                pagination: {
                    total: count || 0,
                    page,
                    limit,
                    total_pages: Math.ceil((count || 0) / limit)
                }
            },
            error: null
        });

    } catch (error: any) {
        console.error("[GET /api/invitations/[id]/messages]", error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Kesalahan server.' } }, { status: 500 });
    }
}

// PATCH /api/invitations/[id]/messages
// Example body: { messageIds: ['uuid1', 'uuid2'], markAs: 'read' }
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = resolvedParams;
        const body = await request.json();

        if (!body.messageIds || !Array.isArray(body.messageIds)) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        // Verify ownership
        const { data: invitation } = await supabase
            .from('invitations')
            .select('id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (!invitation) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const isRead = body.markAs === 'read';

        // Update messages
        const { error } = await supabase
            .from('rsvp_messages')
            .update({ is_read: isRead })
            .in('id', body.messageIds)
            .eq('invitation_id', id);

        if (error) throw error;

        return NextResponse.json({ data: { success: true }, error: null });

    } catch (error: any) {
        console.error("[PATCH /api/invitations/[id]/messages]", error);
        return NextResponse.json({ data: null, error: { code: 'INTERNAL', message: 'Kesalahan server.' } }, { status: 500 });
    }
}
