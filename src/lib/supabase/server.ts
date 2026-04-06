import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return null as any
    }

    const client = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    )

    // MOCK SESSION SUPPORT
    if (cookieStore.get('nikahku-mock-session')?.value === 'true') {
        const mockUser = {
            id: '00000000-0000-0000-0000-000000000000',
            email: 'admin@local.test',
            user_metadata: { full_name: 'Administrator', role: 'superadmin' },
            aud: 'authenticated',
            role: 'authenticated',
        }

        // Intercept auth methods
        const originalAuth = client.auth
        client.auth = new Proxy(originalAuth, {
            get(target: any, prop) {
                if (prop === 'getUser') {
                    return async () => ({ data: { user: mockUser }, error: null })
                }
                if (prop === 'getSession') {
                    return async () => ({ data: { session: { user: mockUser, access_token: 'mock', refresh_token: 'mock' } }, error: null })
                }
                return target[prop]
            }
        })
    }

    return client
}
