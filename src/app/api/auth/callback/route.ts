import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const guestSessionToken = searchParams.get('guest_session_token')

  let next = '/dashboard'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (!sessionError) {
      if (guestSessionToken) {
        const supabaseAdmin = getAdminClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (supabaseAdmin && user) {
          const { data: guestSession } = await supabaseAdmin
            .from('guest_sessions')
            .select('*')
            .eq('session_token', guestSessionToken)
            .in('status', ['preview', 'claimed'])
            .single()

          if (guestSession) {
            const extendedExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString()

            await supabaseAdmin
              .from('guest_sessions')
              .update({
                user_id: user.id,
                status: 'claimed',
                expires_at: extendedExpiry,
              })
              .eq('id', guestSession.id)
          }
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalhost = origin.includes('localhost')

      if (isLocalhost) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?message=Could not login with provider`)
}
