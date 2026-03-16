import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function PATCH(
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

    console.log('[CLAIM API] Received token:', token)

    // Verify the user is authenticated
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('[CLAIM API] getUser result:', user?.id || 'null')

    if (!user) {
      return NextResponse.json(
        { data: null, error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu.' } },
        { status: 401 }
      )
    }

    const supabaseAdmin = getAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client tidak tersedia.' } },
        { status: 500 }
      )
    }

    // Find the guest session
    const { data: session, error: fetchError } = await supabaseAdmin
      .from('guest_sessions')
      .select('*')
      .eq('session_token', token)
      .single()

    console.log('[CLAIM API] Target session:', session?.id || 'null', 'Status:', session?.status)

    if (fetchError || !session) {
      return NextResponse.json(
        { data: null, error: { code: 'SESSION_NOT_FOUND', message: 'Sesi undangan tidak ditemukan.' } },
        { status: 404 }
      )
    }

    // Check if already converted
    if (session.converted_to_invitation_id) {
      return NextResponse.json(
        { data: null, error: { code: 'ALREADY_CONVERTED', message: 'Sesi sudah dikonversi menjadi undangan permanen.' } },
        { status: 409 }
      )
    }

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { data: null, error: { code: 'SESSION_EXPIRED', message: 'Sesi undangan sudah habis. Silakan buat undangan baru.' } },
        { status: 410 }
      )
    }

    // Extend timer by 10 minutes from now, but cap at original expires_at + 10 min
    const extendedExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString()


    // Update: attach user_id, extend timer, set status to 'claimed'
    const { data: updatedSession, error: updateError } = await supabaseAdmin
      .from('guest_sessions')
      .update({
        user_id: user.id,
        status: 'claimed',
        expires_at: extendedExpiry,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id)
      .select('id, session_token, slug, status, expires_at, user_id')
      .single()

    console.log('[CLAIM API] Update success for row:', updatedSession?.id)

    if (updateError) {
      console.error('[PATCH /api/guest-sessions/[token]/claim] Update error:', updateError)
      return NextResponse.json(
        {
          data: null,
          error: { code: 'UPDATE_FAILED', message: 'Gagal mengklaim sesi undangan.', details: updateError.message },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: {
        id: updatedSession.id,
        sessionToken: updatedSession.session_token,
        slug: updatedSession.slug,
        status: updatedSession.status,
        expiresAt: updatedSession.expires_at,
        userId: updatedSession.user_id,
        timeRemainingMs: Math.max(0, new Date(updatedSession.expires_at).getTime() - Date.now()),
      },
      error: null,
    })
  } catch (error: any) {
    console.error('[PATCH /api/guest-sessions/[token]/claim] Unexpected error:', error)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan internal.' } },
      { status: 500 }
    )
  }
}
