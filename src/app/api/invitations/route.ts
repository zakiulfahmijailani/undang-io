import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

// GET /api/invitations
export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
        .from('invitations')
        .select(`
            id as invitation_id, 
            slug, 
            status, 
            theme_id, 
            created_at, 
            updated_at,
            themes (name, category, thumbnails_url),
            rsvp:rsvp(count),
            guestbook:guestbook(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (status) {
        query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json(
            { data: null, error: { code: 'FETCH_ERROR', message: 'Gagal mengambil undangan.', details: error } },
            { status: 400 }
        )
    }

    // Format response matching API contract
    const formattedData = data.map((inv: any) => ({
        invitation_id: inv.invitation_id,
        slug: inv.slug,
        title: "Undangan Pernikahan", // Mock title for now, ideally derived from groom/bride names
        status: inv.status,
        theme_id: inv.theme_id,
        theme: inv.themes,
        view_count: 0,
        rsvp_count: inv.rsvp?.[0]?.count || 0,
        message_count: inv.guestbook?.[0]?.count || 0,
        created_at: inv.created_at,
        updated_at: inv.updated_at
    }))

    return NextResponse.json({
        data: {
            items: formattedData,
            pagination: { total: formattedData.length, page: 1, limit: 50, total_pages: 1 }
        },
        error: null
    })
}

// POST /api/invitations
export async function POST(request: Request) {
    const supabase = await createClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Database is unconfigured.' } },
            { status: 500 }
        )
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json(
            { data: null, error: { code: 'UNAUTHORIZED', message: 'Sesi anda telah habis.' } },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()

        // Very basic validation - would use Zod ideally
        if (!body.theme_id || !body.groom?.full_name || !body.bride?.full_name) {
            return NextResponse.json(
                { data: null, error: { code: 'VALIDATION_ERROR', message: 'Data belum lengkap.' } },
                { status: 400 }
            )
        }

        // Generate base slug
        const baseSlug = body.slug || `${body.groom.nickname}-${body.bride.nickname}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const uniqueSlug = `${baseSlug}-${uuidv4().substring(0, 6)}`

        // 1. Insert into invitations
        const { data: invitation, error: invError } = await supabase
            .from('invitations')
            .insert({
                user_id: user.id,
                slug: body.slug || uniqueSlug,
                theme_id: body.theme_id,
                status: body.status || 'draft'
            })
            .select()
            .single()

        if (invError) throw invError

        // 2. Insert into invitation content
        const { error: contentError } = await supabase
            .from('invitation_content')
            .insert({
                invitation_id: invitation.id,
                groom_name: body.groom.full_name,
                groom_nickname: body.groom.nickname,
                bride_name: body.bride.full_name,
                bride_nickname: body.bride.nickname,
                event_type: body.events?.[0]?.type || 'akad_resepsi',
                event_date: body.events?.[0]?.date,
                event_time: body.events?.[0]?.start_time,
                venue_name: body.events?.[0]?.venue_name,
                venue_address: body.events?.[0]?.venue_address,
                greeting_text: body.opening_text,
                qris_image_url: body.digital_gift?.qris_image_url
            })

        if (contentError) {
            // Rollback by deleting if content fails (assuming cascading deletes isn't immediate via client)
            await supabase.from('invitations').delete().eq('id', invitation.id)
            throw contentError
        }

        return NextResponse.json(
            {
                data: {
                    invitation_id: invitation.id,
                    slug: invitation.slug,
                    status: invitation.status,
                    created_at: invitation.created_at
                },
                error: null
            },
            { status: 201 }
        )

    } catch (error: any) {
        // Checking for slug conflict (unique constraint violation)
        if (error.code === '23505') {
            return NextResponse.json(
                { data: null, error: { code: 'SLUG_ALREADY_TAKEN', message: 'URL undangan sudah dipakai oleh orang lain.' } },
                { status: 409 }
            )
        }

        return NextResponse.json(
            { data: null, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan sistem.', details: error } },
            { status: 500 }
        )
    }
}
