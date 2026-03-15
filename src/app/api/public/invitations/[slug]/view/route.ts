import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createServerSupabaseClient();
    const resolvedParams = await params;

    try {
        const { slug } = resolvedParams;
        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        // 1. Get the real invitation ID from the slug
        const { data: invitation, error: invError } = await supabase
            .from('invitations')
            .select('id')
            .eq('slug', slug)
            .single();

        if (invError || !invitation) {
            return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
        }

        // 2. Extract client IP and User-Agent for basic tracking/rate-limiting
        const forwardedFor = request.headers.get('x-forwarded-for');
        const viewerIp = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Rate Limiting (e.g., skip if same IP viewed in last hour)
        const ONE_HOUR_AGO = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const { data: existingView } = await supabase
            .from('invitation_views')
            .select('id')
            .eq('invitation_id', invitation.id)
            .eq('viewer_ip', viewerIp)
            .gte('viewed_at', ONE_HOUR_AGO)
            .limit(1);

        if (existingView && existingView.length > 0) {
            return NextResponse.json({ success: true, message: "View already counted recently" });
        }

        // 3. Insert the view record
        const { error: insertError } = await supabase
            .from('invitation_views')
            .insert({
                invitation_id: invitation.id,
                viewer_ip: viewerIp,
                user_agent: userAgent
            });

        if (insertError) {
            console.error("Failed to track view:", insertError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[POST /api/public/invitations/[slug]/view] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
