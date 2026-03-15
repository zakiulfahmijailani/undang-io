import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const resolvedParams = await params;
        const token = resolvedParams.token;
        const supabase = await createServerSupabaseClient();

        if (!supabase) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get Guest Session
        const { data: session, error: sessionError } = await supabase
            .from('guest_sessions')
            .select('*')
            .eq('session_token', token)
            .single();

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Sesi tamu tidak ditemukan' }, { status: 404 });
        }

        if (session.converted_to_invitation_id) {
            return NextResponse.json({ 
                success: true, 
                message: 'Sudah dikonversi', 
                invitationId: session.converted_to_invitation_id 
            });
        }

        const invData = session.invitation_data;

        // 2. Map Theme ID
        // The demo themes use string IDs like 'theme-jawa-klasik', but DB uses UUID.
        // We try to find a theme with that slug or just use null if not found.
        let themeUuid: string | null = null;
        if (session.theme_id) {
            const { data: themeData } = await supabase
                .from('themes')
                .select('id')
                .eq('slug', session.theme_id)
                .single();
            
            if (themeData) {
                themeUuid = themeData.id;
            }
        }

        // 3. Create Invitation
        const { data: invitation, error: invError } = await supabase
            .from('invitations')
            .insert({
                user_id: user.id,
                slug: session.slug,
                theme_id: themeUuid,
                status: 'draft'
            })
            .select()
            .single();

        if (invError) {
            console.error('Conversion Error (Invitation):', invError);
            return NextResponse.json({ error: 'Gagal membuat undangan' }, { status: 500 });
        }

        // 4. Create Invitation Content
        const { error: contentError } = await supabase
            .from('invitation_content')
            .insert({
                invitation_id: invitation.id,
                groom_name: invData.groomFullName,
                groom_nickname: invData.groomNickname,
                groom_parents: `${invData.groomFather || ''} & ${invData.groomMother || ''}`.trim(),
                bride_name: invData.brideFullName,
                bride_nickname: invData.brideNickname,
                bride_parents: `${invData.brideFather || ''} & ${invData.brideMother || ''}`.trim(),
                event_date: invData.akadDate, // Primary date
                event_time: invData.akadTime,
                venue_name: invData.akadVenue,
                venue_address: invData.akadAddress,
                greeting_text: invData.quote,
                // Add more mappings as needed
            });

        if (contentError) {
            console.error('Conversion Error (Content):', contentError);
            // Rollback invitation (best effort)
            await supabase.from('invitations').delete().eq('id', invitation.id);
            return NextResponse.json({ error: 'Gagal menyimpan detail undangan' }, { status: 500 });
        }

        // 5. Mark session as converted
        await supabase
            .from('guest_sessions')
            .update({ converted_to_invitation_id: invitation.id })
            .eq('session_token', token);

        return NextResponse.json({ 
            success: true, 
            invitationId: invitation.id,
            slug: invitation.slug
        });

    } catch (error: any) {
        console.error('Conversion API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
