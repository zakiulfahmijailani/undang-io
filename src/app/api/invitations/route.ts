import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

// GET /api/invitations
export async function GET(request: Request) {
    const supabase = await createServerSupabaseClient()

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
import { z } from 'zod'

const createInvitationSchema = z.object({
    groom_name: z.string().min(1).max(100),
    bride_name: z.string().min(1).max(100),
    theme_id: z.string().optional(),
    slug: z.string().optional(),
    details: z.object({
        groom_full_name: z.string().optional(),
        groom_nickname: z.string().optional(),
        groom_father: z.string().optional(),
        groom_mother: z.string().optional(),
        bride_full_name: z.string().optional(),
        bride_nickname: z.string().optional(),
        bride_father: z.string().optional(),
        bride_mother: z.string().optional(),
        akad_date: z.string().optional(),
        akad_time: z.string().optional(),
        akad_venue: z.string().optional(),
        akad_address: z.string().optional(),
        reception_date: z.string().optional(),
        reception_time: z.string().optional(),
        reception_venue: z.string().optional(),
        reception_address: z.string().optional(),
        quote_text: z.string().optional(),
        quote_source: z.string().optional(),
    }).optional()
})

export async function POST(request: Request) {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client not initialized.' } },
            { status: 500 }
        )
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json(
            { data: null, error: { code: 'UNAUTHORIZED', message: 'Sesi Anda telah habis. Silakan login kembali.' } },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()
        const parsed = createInvitationSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { data: null, error: { code: 'VALIDATION_ERROR', message: 'Data tidak valid.', details: parsed.error.flatten().fieldErrors } },
                { status: 400 }
            )
        }

        const { groom_name, bride_name, theme_id, slug, details } = parsed.data

        // Theme ID mapping
        let themeUuid: string | null = null;
        if (theme_id) {
            const { data: themeData } = await supabase
                .from('themes')
                .select('id')
                .eq('slug', theme_id)
                .single();
            
            if (themeData) {
                themeUuid = themeData.id;
            } else if (theme_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
                themeUuid = theme_id;
            }
        }

        // Generate slug if not provided
        let finalSlug = slug;
        if (!finalSlug) {
            const cleanStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
            const baseSlug = `${cleanStr(groom_name)}-dan-${cleanStr(bride_name)}`
            finalSlug = `${baseSlug}-${uuidv4().substring(0, 4)}`
            
            // Basic uniqueness check
            const { count } = await supabase.from('invitations').select('*', { count: 'exact', head: true }).eq('slug', finalSlug)
            if (count && count > 0) {
                finalSlug = `${baseSlug}-${uuidv4().substring(0, 6)}`
            }
        }

        // 1. Insert into invitations
        const { data: invitation, error: invError } = await supabase
            .from('invitations')
            .insert({
                user_id: user.id,
                slug: finalSlug,
                theme_id: themeUuid,
                status: 'draft'
            })
            .select()
            .single()

        if (invError) {
            if (invError.code === '23505') {
                return NextResponse.json(
                    { data: null, error: { code: 'SLUG_ALREADY_TAKEN', message: 'Kombinasi url/nama sedang digunakan, silakan coba lagi.' } },
                    { status: 409 }
                )
            }
            throw invError
        }

        // 2. Insert into invitation_details
        const detailsPayload = {
            invitation_id: invitation.id,
            groom_name: groom_name,
            bride_name: bride_name,
            ...(details || {})
        };

        const { error: detailsError } = await supabase
            .from('invitation_details')
            .insert(detailsPayload)

        if (detailsError) {
            // Best effort cleanup: attempt to delete the invitation if details insertion fails
            await supabase.from('invitations').delete().eq('id', invitation.id)
            throw detailsError
        }

        return NextResponse.json(
            {
                data: {
                    id: invitation.id,
                    slug: invitation.slug
                },
                error: null
            },
            { status: 201 }
        )

    } catch (error: any) {
        console.error("[POST /api/invitations] Error:", error)
        return NextResponse.json(
            { data: null, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan saat memproses permintaan.', details: error.message } },
            { status: 500 }
        )
    }
}
