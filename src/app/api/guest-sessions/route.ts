import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAdminClient } from '@/lib/supabase/admin'
import { normalizeThemeSelection } from '@/lib/default-theme'
import { getGuestExpiry } from '@/lib/guest-session-server'
import { verifyTurnstileToken } from '@/lib/turnstile'

const createGuestSessionSchema = z.object({
  sessionToken: z.string().uuid(),
  slug: z.string().min(3, { message: 'Slug minimal 3 karakter.' }),
  themeId: z.string().trim().nullable().optional(),
  expiresAt: z.string(),
  invitationData: z.record(z.string(), z.unknown()),
  cf_turnstile_token: z.string().trim().nullable().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createGuestSessionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Data yang dikirim tidak valid.',
            details: parsed.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      )
    }

    const { sessionToken, slug, themeId, invitationData, cf_turnstile_token } = parsed.data
    const expiresAt = getGuestExpiry()
    const normalizedThemeId = normalizeThemeSelection(themeId)

    const turnstile = await verifyTurnstileToken(cf_turnstile_token, request.headers.get('x-client-ip') ?? undefined)
    if (!turnstile.success) {
      return NextResponse.json(
        {
          data: null,
          error: { code: 'TURNSTILE_FAILED', message: 'Verifikasi keamanan gagal. Coba refresh halaman.' },
        },
        { status: 403 }
      )
    }

    const supabaseAdmin = getAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          data: null,
          error: { code: 'DATABASE_ERROR', message: 'Database client tidak tersedia.' },
        },
        { status: 500 }
      )
    }

    // Check if slug already exists in invitations
    const { data: existingInvitation } = await supabaseAdmin
      .from('invitations')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingInvitation) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'SLUG_TAKEN',
            message: 'Slug sudah dipakai. Silakan ganti nama panggilan.',
          },
        },
        { status: 409 }
      )
    }

    // Check if slug already exists in guest_sessions
    const { data: existingGuest } = await supabaseAdmin
      .from('guest_sessions')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingGuest) {
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'SLUG_TAKEN',
            message: 'Slug sudah dipakai oleh sesi lain. Silakan ganti nama panggilan.',
          },
        },
        { status: 409 }
      )
    }

    // Insert guest session — user_id is NULL (anonymous), status is 'preview'
    const { data: session, error: insertError } = await supabaseAdmin
      .from('guest_sessions')
      .insert({
        session_token: sessionToken,
        slug,
        theme_id: normalizedThemeId,
        expires_at: expiresAt,
        invitation_data: invitationData,
        status: 'preview',
        ip_address: request.headers.get('x-client-ip'),
        user_agent: request.headers.get('user-agent'),
      })
      .select('id, session_token, slug, expires_at')
      .single()

    if (insertError) {
      console.error('[POST /api/guest-sessions] Insert error:', insertError)
      if (insertError.message.includes('RATE_LIMIT_IP')) {
        return NextResponse.json(
          {
            data: null,
            error: {
              code: 'RATE_LIMIT_IP',
              message: 'Terlalu banyak percobaan dari jaringan ini. Silakan coba lagi dalam 1 jam.',
            },
          },
          { status: 429 }
        )
      }
      return NextResponse.json(
        {
          data: null,
          error: {
            code: 'INSERT_FAILED',
            message: 'Gagal menyimpan sesi undangan.',
            details: insertError.message,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        data: {
          id: session.id,
          sessionToken: session.session_token,
          slug: session.slug,
          expiresAt: session.expires_at,
        },
        error: null,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('[POST /api/guest-sessions] Unexpected error:', error)
    return NextResponse.json(
      {
        data: null,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Terjadi kesalahan internal.',
        },
      },
      { status: 500 }
    )
  }
}
