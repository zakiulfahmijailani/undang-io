import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const pathname = request.nextUrl.pathname
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
    const isAdminRoute = pathname.startsWith('/admin')
    const isProtectedRoute =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/api/dashboard') ||
        isAdminRoute ||
        pathname.startsWith('/owner')

    // --- MOCK SESSION BYPASS ---
    // If mock session cookie is present, treat as authenticated superadmin
    const isMockSession = request.cookies.get('nikahku-mock-session')?.value === 'true'
    if (isMockSession) {
        // Mock user is logged in — if they try to go to /login, redirect to /admin
        if (isAuthRoute) {
            const url = request.nextUrl.clone()
            url.pathname = '/admin/themes'
            return NextResponse.redirect(url)
        }
        // Allow access to admin without supabase auth
        if (isAdminRoute) {
             return supabaseResponse
        }
        // Allow access to protected
        return supabaseResponse
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return supabaseResponse
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Do not add logic between createServerClient and auth.getUser()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Not logged in and trying to access protected route -> redirect to login
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Already logged in and trying to access login/register -> redirect to dashboard
    if (user && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    // Role check for admin route if using actual Supabase login
    if (user && isAdminRoute) {
        if (user.user_metadata?.role !== 'superadmin') {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
