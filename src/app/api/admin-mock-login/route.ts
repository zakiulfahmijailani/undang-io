import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json({ success: true })
    response.cookies.set('nikahku-mock-session', 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
    })
    return response
}
