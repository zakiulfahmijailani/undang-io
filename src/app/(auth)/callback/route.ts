import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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
                const { data: { session } } = await supabase.auth.getSession()

                if (session) {
                    try {
                        const res = await fetch(`${origin}/api/guest-sessions/${guestSessionToken}/claim`, {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${session.access_token}`,
                                'Content-Type': 'application/json',
                            },
                        })
                        const json = await res.json()

                        if (!res.ok || !json.data) {
                            console.error('[CALLBACK] Claim failed:', json)
                            return NextResponse.redirect(`${origin}/login?message=Gagal menyimpan undangan sementara. Silakan coba lagi.`)
                        }
                    } catch (error) {
                        console.error('[CALLBACK] Claim fetch exception:', error)
                        return NextResponse.redirect(`${origin}/login?message=Terjadi kesalahan sistem saat menyimpan undangan sementara.`)
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
