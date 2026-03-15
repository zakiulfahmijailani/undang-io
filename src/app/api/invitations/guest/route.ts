import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sessionToken, slug, themeId, expiresAt, invitationData } = body;

        // Basic validation
        if (!sessionToken || !slug || !themeId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Check if slug exists in real invitations
        const { data: existingSlug } = await supabase
            .from('invitations')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existingSlug) {
            return NextResponse.json(
                { error: 'Slug sudah terdaftar, silakan ganti nick name' },
                { status: 409 }
            );
        }

        // Insert guest session
        const { error } = await supabase
            .from('guest_sessions')
            .insert({
                session_token: sessionToken,
                slug,
                theme_id: themeId,
                expires_at: expiresAt,
                invitation_data: invitationData,
            });

        if (error) {
            console.error('Error creating guest session:', error);
            return NextResponse.json(
                { error: 'Gagal membuat sesi tamu' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: 'Session created successfully' });
    } catch (error) {
        console.error('Guest API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
