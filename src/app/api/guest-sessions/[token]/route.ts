import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json(
        { data: null, error: { code: 'MISSING_TOKEN', message: 'Token diperlukan.' } },
        { status: 400 }
      )
    }

    const supabaseAdmin = getAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client tidak tersedia.' } },
        { status: 500 }
      )
    }

    const { data: session, error } = await supabaseAdmin
      .from('guest_sessions')
      .select('*')
      .eq('session_token', token)
      .single()

    if (error || !session) {
      return NextResponse.json(
        { data: null, error: { code: 'SESSION_NOT_FOUND', message: 'Sesi undangan tidak ditemukan.' } },
        { status: 404 }
      )
    }

    // Check if expired
    const isExpired = new Date(session.expires_at) < new Date()
    const timeRemainingMs = Math.max(0, new Date(session.expires_at).getTime() - Date.now())

    return NextResponse.json({
      data: {
        id: session.id,
        sessionToken: session.session_token,
        slug: session.slug,
        themeId: session.theme_id,
        status: session.status,
        invitationData: session.invitation_data,
        expiresAt: session.expires_at,
        isExpired,
        timeRemainingMs,
        userId: session.user_id,
        convertedToInvitationId: session.converted_to_invitation_id,
      },
      error: null,
    })
  } catch (error: any) {
    console.error('[GET /api/guest-sessions/[token]] Unexpected error:', error)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan internal.' } },
      { status: 500 }
    )
  }
}
