import { NextRequest, NextResponse, type NextFetchEvent } from 'next/server'
import { ratelimiter } from '@/lib/rate-limit'
import { updateSession } from '@/lib/supabase/middleware'

const BOT_UA_PATTERNS = [
    /curl\//i,
    /python-requests/i,
    /go-http-client/i,
    /java\//i,
    /wget\//i,
    /scrapy/i,
    /headlesschrome/i,
    /phantomjs/i,
]

const RATE_LIMIT_EXEMPT_PATHS = ['/api/webhooks/payment', '/api/cron/']
const GUEST_SESSION_CREATE_PATHS = ['/api/guest-session', '/api/guest-sessions', '/api/invitations/guest']

function getIP(request: NextRequest) {
    const candidate =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip')?.trim() ||
        '127.0.0.1'

    return /^[0-9a-f:.]+$/i.test(candidate) ? candidate : '127.0.0.1'
}

function isBotUA(userAgent: string | null) {
    if (!userAgent) return false
    return BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent))
}

function isRateLimitExempt(pathname: string) {
    return RATE_LIMIT_EXEMPT_PATHS.some((path) => pathname === path || pathname.startsWith(path))
}

function errorResponse(code: string, message: string, status: number, headers?: HeadersInit, details?: unknown) {
    return applyEdgeSecurityHeaders(NextResponse.json(
        { data: null, error: { code, message, ...(details === undefined ? {} : { details }) } },
        { status, headers },
    ))
}

function applyEdgeSecurityHeaders(response: NextResponse) {
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    return response
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
    const pathname = request.nextUrl.pathname
    const requestHeaders = new Headers(request.headers)

    if (pathname.startsWith('/api/')) {
        const ip = getIP(request)
        requestHeaders.set('x-client-ip', ip)

        if (!isRateLimitExempt(pathname)) {
            if (isBotUA(request.headers.get('user-agent'))) {
                return errorResponse('BOT_DETECTED', 'Permintaan tidak diizinkan.', 403)
            }

            if (ratelimiter) {
                try {
                    const apiLimit = await ratelimiter.api.limit(ip)
                    event.waitUntil(apiLimit.pending)

                    if (!apiLimit.success) {
                        const retryAfter = Math.max(1, Math.ceil((apiLimit.reset - Date.now()) / 1000))
                        return errorResponse(
                            'RATE_LIMIT_API',
                            'Terlalu banyak permintaan. Tunggu sebentar ya.',
                            429,
                            {
                                'Retry-After': String(retryAfter),
                                'X-RateLimit-Limit': String(apiLimit.limit),
                                'X-RateLimit-Remaining': String(apiLimit.remaining),
                                'X-RateLimit-Reset': String(apiLimit.reset),
                            },
                            { retryAfter },
                        )
                    }

                    if (GUEST_SESSION_CREATE_PATHS.includes(pathname) && request.method === 'POST') {
                        const guestLimit = await ratelimiter.guestSession.limit(ip)
                        event.waitUntil(guestLimit.pending)

                        if (!guestLimit.success) {
                            const retryAfter = Math.max(1, Math.ceil((guestLimit.reset - Date.now()) / 1000))
                            return errorResponse(
                                'RATE_LIMIT_GUEST_SESSION',
                                'Kamu sudah terlalu sering mencoba. Silakan coba lagi dalam 1 jam.',
                                429,
                                {
                                    'Retry-After': String(retryAfter),
                                    'X-RateLimit-Limit': String(guestLimit.limit),
                                    'X-RateLimit-Remaining': String(guestLimit.remaining),
                                    'X-RateLimit-Reset': String(guestLimit.reset),
                                },
                                { retryAfter },
                            )
                        }
                    }
                } catch (error) {
                    console.error('[middleware] Upstash rate limit failed:', error)
                }
            }
        }

        return applyEdgeSecurityHeaders(await updateSession(request, requestHeaders))
    }

    return applyEdgeSecurityHeaders(await updateSession(request))
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
