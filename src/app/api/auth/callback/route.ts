import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { claimGuestSession, GUEST_SESSION_COOKIE } from '@/lib/guest-session-server'

function getTrustedOrigin(request: Request): string {
  const requestUrl = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim().toLowerCase()

  if (!forwardedHost) {
    return requestUrl.origin
  }

  const trustedOrigins = new Map([[requestUrl.host.toLowerCase(), requestUrl.origin]])
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const vercelUrl = process.env.VERCEL_URL

  if (configuredSiteUrl) {
    try {
      const siteUrl = new URL(configuredSiteUrl)
      if (siteUrl.protocol === 'http:' || siteUrl.protocol === 'https:') {
        trustedOrigins.set(siteUrl.host.toLowerCase(), siteUrl.origin)
      }
    } catch {
      console.error('[GET /api/auth/callback] NEXT_PUBLIC_SITE_URL is invalid')
    }
  }

  if (vercelUrl) {
    try {
      const deploymentUrl = new URL(`https://${vercelUrl}`)
      trustedOrigins.set(deploymentUrl.host.toLowerCase(), deploymentUrl.origin)
    } catch {
      console.error('[GET /api/auth/callback] VERCEL_URL is invalid')
    }
  }

  const trustedOrigin = trustedOrigins.get(forwardedHost)
  if (!trustedOrigin) {
    console.error('[GET /api/auth/callback] Ignoring untrusted forwarded host:', forwardedHost)
    return requestUrl.origin
  }

  return trustedOrigin
}

async function authCallback(request: Request) {
  const { searchParams } = new URL(request.url)
  const origin = getTrustedOrigin(request)
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
    const origin = getTrustedOrigin(request)
    return NextResponse.redirect(`${origin}/login?message=Terjadi kesalahan. Silakan coba lagi.`)
  }
}
