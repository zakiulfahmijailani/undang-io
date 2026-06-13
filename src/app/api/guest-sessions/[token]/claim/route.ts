import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { claimGuestSession } from '@/lib/guest-session-server'

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

    // Try cookie-based auth first, then fall back to Bearer token
    let user = null

    const supabase = await createServerSupabaseClient()
    const { data: { user: cookieUser } } = await supabase.auth.getUser()

    if (cookieUser) {
      user = cookieUser
    } else {
      // Fall back to Authorization: Bearer <access_token>
      const authHeader = request.headers.get('Authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const accessToken = authHeader.slice(7)
        const adminClient = getAdminClient()
        if (adminClient) {
          const { data: { user: tokenUser } } = await adminClient.auth.getUser(accessToken)
          if (tokenUser) user = tokenUser
        }
      }
    }

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

    const result = await claimGuestSession(supabaseAdmin, token, user.id)
    if (result.error) {
      return NextResponse.json(
        { data: null, error: result.error },
        { status: result.error.code === 'SESSION_EXPIRED' ? 410 : 404 }
      )
    }

    return NextResponse.json({
      data: {
        slug: result.data.slug,
        status: 'claimed',
        expiresAt: result.data.expiresAt,
        timeRemainingMs: result.data.remainingSeconds * 1000,
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
