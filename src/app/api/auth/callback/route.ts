import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const guestSessionToken = searchParams.get('guest_session_token')

  console.log('[CALLBACK] code:', code ? 'exists' : 'null')
  console.log('[CALLBACK] guestSessionToken:', guestSessionToken)

  let next = '/dashboard'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    console.log('[CALLBACK] sessionError:', sessionError)

    if (!sessionError) {
      if (guestSessionToken) {
        const supabaseAdmin = getAdminClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        console.log('[CALLBACK] user:', user?.id, '| userError:', userError)

        if (supabaseAdmin && user) {
          const { data: guestSession, error: gsError } = await supabaseAdmin
            .from('guest_sessions')
            .select('*')
            .eq('session_token', guestSessionToken)
            .in('status', ['preview', 'claimed'])
            .single()

          console.log('[CALLBACK] guestSession:', guestSession, '| gsError:', gsError)

          if (guestSession) {
            const extendedExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString()

            const { error: updateError } = await supabaseAdmin
              .from('guest_sessions')
              .update({
                user_id: user.id,
                status: 'claimed',
                expires_at: extendedExpiry,
                updated_at: new Date().toISOString(),
              })
              .eq('id', guestSession.id)

            console.log('[CALLBACK] updateError:', updateError)

            next = '/dashboard'
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
