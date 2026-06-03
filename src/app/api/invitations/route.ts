import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { resolveInvitationThemeSelection } from '@/lib/theme-selection'

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

const createInvitationSchema = z.object({
    groom_name: z.string().min(1).max(100).optional(),
    bride_name: z.string().min(1).max(100).optional(),
    theme_id: z.string().trim().nullable().optional(),
    themeId: z.string().trim().nullable().optional(),
    slug: z.string().optional(),
    invitationData: z.record(z.string(), z.unknown()).optional(),
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

type InvitationDraftData = z.infer<typeof createInvitationSchema>;

function readRecordString(record: Record<string, unknown> | undefined, keys: string[]): string | undefined {
    if (!record) return undefined;
    for (const key of keys) {
        const value = record[key];
        if (typeof value === 'string' && value.trim().length > 0) return value.trim();
    }
    return undefined;
}

function combineDateTime(date?: string, time?: string) {
    if (!date) return undefined;
    if (!time) return date;
    if (date.includes('T')) return date;
    return `${date}T${time}`;
}

function buildInvitationInsertData(parsed: InvitationDraftData) {
    const form = parsed.invitationData ?? {};
    const details = parsed.details ?? {};

    const groomName =
        parsed.groom_name ??
        details.groom_nickname ??
        details.groom_full_name ??
        readRecordString(form, ['groomNickname', 'groomFullName', 'groom_name', 'groomName']) ??
        'Mempelai Pria';
    const brideName =
        parsed.bride_name ??
        details.bride_nickname ??
        details.bride_full_name ??
        readRecordString(form, ['brideNickname', 'brideFullName', 'bride_name', 'brideName']) ??
        'Mempelai Wanita';

    const groomFullName =
        details.groom_full_name ??
        readRecordString(form, ['groomFullName', 'groom_full_name']) ??
        groomName;
    const brideFullName =
        details.bride_full_name ??
        readRecordString(form, ['brideFullName', 'bride_full_name']) ??
        brideName;
    const akadDate =
        combineDateTime(details.akad_date, details.akad_time) ??
        combineDateTime(readRecordString(form, ['akadDate', 'akad_date']), readRecordString(form, ['akadTime', 'akad_time']));
    const receptionDate =
        combineDateTime(details.reception_date, details.reception_time) ??
        combineDateTime(readRecordString(form, ['receptionDate', 'reception_date']), readRecordString(form, ['receptionTime', 'reception_time']));
    const venue = readRecordString(form, ['venue']);
    const address = readRecordString(form, ['address']);

    return {
        groomName,
        brideName,
        columns: {
            title: `Pernikahan ${groomName} & ${brideName}`,
            groom_full_name: groomFullName,
            groom_nickname: details.groom_nickname ?? readRecordString(form, ['groomNickname', 'groom_nickname']) ?? groomName,
            groom_father_name: details.groom_father ?? readRecordString(form, ['groomFather', 'groom_father']),
            groom_mother_name: details.groom_mother ?? readRecordString(form, ['groomMother', 'groom_mother']),
            bride_full_name: brideFullName,
            bride_nickname: details.bride_nickname ?? readRecordString(form, ['brideNickname', 'bride_nickname']) ?? brideName,
            bride_father_name: details.bride_father ?? readRecordString(form, ['brideFather', 'bride_father']),
            bride_mother_name: details.bride_mother ?? readRecordString(form, ['brideMother', 'bride_mother']),
            akad_datetime: akadDate,
            akad_location_name: details.akad_venue ?? readRecordString(form, ['akadVenue', 'akad_venue']) ?? venue,
            akad_location_address: details.akad_address ?? readRecordString(form, ['akadAddress', 'akad_address']) ?? address,
            resepsi_datetime: receptionDate,
            resepsi_location_name: details.reception_venue ?? readRecordString(form, ['receptionVenue', 'reception_venue']) ?? venue,
            resepsi_location_address: details.reception_address ?? readRecordString(form, ['receptionAddress', 'reception_address']) ?? address,
            quote_text: details.quote_text ?? readRecordString(form, ['quote', 'quoteText', 'greetingText']),
            quote_source: details.quote_source ?? readRecordString(form, ['quoteSource', 'quote_source']),
        },
    };
}

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

        const { slug, details } = parsed.data
        const { groomName, brideName, columns } = buildInvitationInsertData(parsed.data)
        const themeSelection = await resolveInvitationThemeSelection(supabase, parsed.data.theme_id ?? parsed.data.themeId ?? null)

        // Generate slug if not provided
        let finalSlug = slug;
        if (!finalSlug) {
            const cleanStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
            const baseSlug = `${cleanStr(groomName)}-dan-${cleanStr(brideName)}`
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
                theme_id: themeSelection.themeId,
                theme_key: themeSelection.themeKey,
                status: 'draft',
                ...columns,
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
            groom_name: groomName,
            bride_name: brideName,
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
