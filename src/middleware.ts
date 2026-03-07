import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    // Temporarily bypass auth middleware
    // until Supabase env vars are configured
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
