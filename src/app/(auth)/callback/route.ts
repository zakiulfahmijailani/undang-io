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
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    try {
                        await fetch(`${origin}/api/guest-sessions/${guestSessionToken}/claim`, {
                            method: 'PATCH',
                            headers: {
                                cookie: request.headers.get('cookie') || ''
                            }
                        })
                    } catch (error) {
                        console.error('Claim failed in callback:', error)
                    }
                    next = '/dashboard'
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
