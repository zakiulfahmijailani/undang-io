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
                console.log('[CALLBACK] Exchanged code for session. Found guest token:', guestSessionToken.slice(0, 8) + '...')
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    try {
                        console.log('[CALLBACK] Calling claim endpoint via fetch...')
                        const res = await fetch(`${origin}/api/guest-sessions/${guestSessionToken}/claim`, {
                            method: 'PATCH',
                            headers: {
                                cookie: request.headers.get('cookie') || ''
                            }
                        })
                        const json = await res.json()
                        console.log('[CALLBACK] Claim response status:', res.status, 'body:', json)

                        if (!res.ok || !json.data) {
                            console.error('[CALLBACK] Claim failed. Redirecting to login with error.')
                            return NextResponse.redirect(`${origin}/login?message=Gagal menyimpan undangan sementara setelah login Google. Silakan coba lagi.`)
                        }
                    } catch (error) {
                        console.error('[CALLBACK] Claim fetch exception:', error)
                        return NextResponse.redirect(`${origin}/login?message=Terjadi kesalahan sistem saat menyimpan undangan sementara.`)
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
