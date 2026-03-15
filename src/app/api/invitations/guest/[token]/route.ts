import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const resolvedParams = await params;
        const token = resolvedParams.token;
        
        if (!token) {
            return NextResponse.json({ error: 'Token diperlukan' }, { status: 400 });
        }

        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
            .from('guest_sessions')
            .select('*')
            .eq('session_token', token)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'Sesi tidak ditemukan atau sudah kadaluarsa' },
                { status: 404 }
            );
        }

        return NextResponse.json({ session: data });
    } catch (error) {
        console.error('Get Guest Session Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
