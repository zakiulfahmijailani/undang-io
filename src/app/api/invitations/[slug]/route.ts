import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Helper to check user ownership
async function verifyOwnership(supabase: any, user_id: string, invitation_id: string) {
    const { data: invitation, error } = await supabase
        .from('invitations')
        .select('id, user_id')
        .eq('id', invitation_id)
        .single()

    if (error || !invitation) return false
    return invitation.user_id === user_id
}

// GET /api/invitations/[slug]
export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const id = params.slug // We map slug from the URL back to our internal 'id' variable
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

    const isOwner = await verifyOwnership(supabase, user.id, id)
    if (!isOwner) {
        return NextResponse.json(
            { data: null, error: { code: 'FORBIDDEN', message: 'Anda tidak memiliki akses ke undangan ini.' } },
            { status: 403 }
        )
    }

    const { data, error } = await supabase
        .from('invitations')
        .select(`
            *,
            themes (*),
            subscription_plans (*),
            content:invitation_content(*)
        `)
        .eq('id', id)
        .single()

    if (error) {
        return NextResponse.json(
            { data: null, error: { code: 'NOT_FOUND', message: 'Undangan tidak ditemukan.', details: error } },
            { status: 404 }
        )
    }

    return NextResponse.json({
        data: {
            ...data,
            content: data.content?.[0] || null
        },
        error: null
    })
}

// PATCH /api/invitations/[slug]
export async function PATCH(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const id = params.slug
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

    const isOwner = await verifyOwnership(supabase, user.id, id)
    if (!isOwner) {
        return NextResponse.json(
            { data: null, error: { code: 'FORBIDDEN', message: 'Akses ditolak.' } },
            { status: 403 }
        )
    }

    try {
        const body = await request.json()
        const { invitation: inviteUpdates, content: contentUpdates } = body

        // Update Invitations table
        if (inviteUpdates && Object.keys(inviteUpdates).length > 0) {
            const { error: invError } = await supabase
                .from('invitations')
                .update(inviteUpdates)
                .eq('id', id)

            if (invError) throw invError
        }

        // Update Invitation Content table
        if (contentUpdates && Object.keys(contentUpdates).length > 0) {
            const { error: contentError } = await supabase
                .from('invitation_content')
                .update(contentUpdates)
                .eq('invitation_id', id)

            if (contentError) throw contentError
        }

        return NextResponse.json({
            data: { message: 'Undangan berhasil diperbarui', id },
            error: null
        })

    } catch (error: any) {
        // Check slug constraint
        if (error.code === '23505') {
            return NextResponse.json(
                { data: null, error: { code: 'SLUG_ALREADY_TAKEN', message: 'URL undangan sudah dipakai.' } },
                { status: 409 }
            )
        }
        return NextResponse.json(
            { data: null, error: { code: 'UPDATE_ERROR', message: 'Gagal update data.', details: error } },
            { status: 500 }
        )
    }
}

// DELETE /api/invitations/[slug]
export async function DELETE(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const id = params.slug
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

    const isOwner = await verifyOwnership(supabase, user.id, id)
    if (!isOwner) {
        return NextResponse.json(
            { data: null, error: { code: 'FORBIDDEN', message: 'Akses ditolak.' } },
            { status: 403 }
        )
    }

    const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id)

    if (error) {
        return NextResponse.json(
            { data: null, error: { code: 'DELETE_ERROR', message: 'Gagal menghapus.', details: error } },
            { status: 500 }
        )
    }

    return NextResponse.json({ data: { success: true }, error: null })
}
