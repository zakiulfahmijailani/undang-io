import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { claimGuestSession, GUEST_SESSION_COOKIE } from '@/lib/guest-session-server'

async function authCallback(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const guestSessionToken = searchParams.get('guest_session_token')

  let next = '/dashboard'
  let claimedToken: string | null = null
  let claimedMaxAge = 0

  if (code) {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.redirect(`${origin}/login?message=Layanan autentikasi tidak tersedia`)
    }
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (!sessionError) {
      const cookieToken = request.headers
        .get('cookie')
        ?.split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${GUEST_SESSION_COOKIE}=`))
        ?.slice(GUEST_SESSION_COOKIE.length + 1)
      const tokenToClaim = guestSessionToken || cookieToken

      if (tokenToClaim) {
        const supabaseAdmin = getAdminClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (supabaseAdmin && user) {
          const result = await claimGuestSession(supabaseAdmin, tokenToClaim, user.id)
          if (result.data) {
            next = `/invite/${result.data.slug}/edit`
            claimedToken = tokenToClaim
            claimedMaxAge = result.data.remainingSeconds
          }
        }
      }

      const destination = new URL(next, origin)
      const response = NextResponse.redirect(destination)
      if (claimedToken) {
        response.cookies.set(GUEST_SESSION_COOKIE, claimedToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: claimedMaxAge,
        })
      }
      return response
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Gagal masuk dengan penyedia akun`)
}

export async function GET(request: Request) {
  try {
    return await authCallback(request)
  } catch (error) {
    console.error('[GET /api/auth/callback] Unexpected error:', error)
    const { origin } = new URL(request.url)
    return NextResponse.redirect(`${origin}/login?message=Terjadi kesalahan. Silakan coba lagi.`)
  }
}
