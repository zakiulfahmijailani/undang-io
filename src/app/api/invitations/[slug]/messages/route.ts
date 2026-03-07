import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Helper to resolve slug to ID
async function getInvitationBySlug(supabase: any, slug: string) {
    const { data: invitation, error } = await supabase
        .from('invitations')
        .select('id, user_id, status')
        .eq('slug', slug)
        .single()

    if (error || !invitation) return null
    return invitation
}

// GET /api/invitations/[slug]/messages
// Public endpoint for displaying guestbook
export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params
    const supabase = await createClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client not initialized.' } },
            { status: 500 }
        )
    }

    const invitation = await getInvitationBySlug(supabase, slug)
    if (!invitation) {
        return NextResponse.json(
            { data: null, error: { code: 'NOT_FOUND', message: 'Undangan tidak ditemukan.' } },
            { status: 404 }
        )
    }

    const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .eq('invitation_id', invitation.id)
        .eq('is_visible', true) // Only visible messages
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json(
            { data: null, error: { code: 'FETCH_ERROR', message: 'Gagal memuat ucapan.', details: error } },
            { status: 500 }
        )
    }

    return NextResponse.json({
        data: {
            items: data,
            pagination: { total: data.length, page: 1, limit: 50 }
        },
        error: null
    })
}

// POST /api/invitations/[slug]/messages
// Public endpoint for posting a message
export async function POST(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const { slug } = params
    const supabase = await createClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Database is unconfigured.' } },
            { status: 500 }
        )
    }

    const invitation = await getInvitationBySlug(supabase, slug)
    if (!invitation) {
        return NextResponse.json(
            { data: null, error: { code: 'NOT_FOUND', message: 'Undangan tidak ditemukan.' } },
            { status: 404 }
        )
    }

    try {
        const body = await request.json()
        const { guest_name, message } = body

        if (!guest_name || !message) {
            return NextResponse.json(
                { data: null, error: { code: 'VALIDATION_ERROR', message: 'Nama dan pesan wajib diisi.' } },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('guestbook')
            .insert({
                invitation_id: invitation.id,
                guest_name,
                message,
                is_visible: true // Default visible
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(
            { data: { message: 'Ucapan berhasil dikirim', ...data }, error: null },
            { status: 201 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { data: null, error: { code: 'INSERT_ERROR', message: 'Gagal mengirim ucapan.', details: error } },
            { status: 500 }
        )
    }
}
