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

// GET /api/invitations/[slug]/rsvp
// Protected to invitation owner only
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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return NextResponse.json(
            { data: null, error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu.' } },
            { status: 401 }
        )
    }

    const invitation = await getInvitationBySlug(supabase, slug)
    if (!invitation) {
        return NextResponse.json(
            { data: null, error: { code: 'NOT_FOUND', message: 'Undangan tidak ditemukan.' } },
            { status: 404 }
        )
    }

    // Must be owner
    if (invitation.user_id !== user.id) {
        return NextResponse.json(
            { data: null, error: { code: 'FORBIDDEN', message: 'Akses ditolak.' } },
            { status: 403 }
        )
    }

    const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .eq('invitation_id', invitation.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json(
            { data: null, error: { code: 'FETCH_ERROR', message: 'Gagal mengambil data RSVP.', details: error } },
            { status: 500 }
        )
    }

    return NextResponse.json({
        data: {
            items: data,
            summary: {
                total_attending: data.filter((r: any) => r.attendance_status === 'hadir').reduce((acc: number, curr: any) => acc + (curr.number_of_guests || 1), 0),
                total_not_attending: data.filter((r: any) => r.attendance_status === 'tidak_hadir').length,
            }
        },
        error: null
    })
}

// POST /api/invitations/[slug]/rsvp
// Public endpoint for guests
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

    // Optional: Check if invitation is published (maybe allow draft RSVP for testing?)

    try {
        const body = await request.json()
        const { guest_name, attendance_status, number_of_guests, message } = body

        if (!guest_name || !attendance_status) {
            return NextResponse.json(
                { data: null, error: { code: 'VALIDATION_ERROR', message: 'Nama dan status kehadiran wajib diisi.' } },
                { status: 400 }
            )
        }

        const { data, error } = await supabase
            .from('rsvp')
            .insert({
                invitation_id: invitation.id,
                guest_name,
                attendance_status,
                number_of_guests: number_of_guests || 1,
                message
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(
            { data: { message: 'RSVP berhasil disimpan', ...data }, error: null },
            { status: 201 }
        )

    } catch (error: any) {
        return NextResponse.json(
            { data: null, error: { code: 'INSERT_ERROR', message: 'Gagal mengirim RSVP.', details: error } },
            { status: 500 }
        )
    }
}
