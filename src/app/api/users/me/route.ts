import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/users/me
export async function GET(request: Request) {
    const supabase = await createClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Koneksi database belum dikonfigurasi.' } },
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

    // Get user profile
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') { // Ignore row not found
        return NextResponse.json(
            { data: null, error: { code: 'FETCH_ERROR', message: 'Gagal mengambil profil.', details: error } },
            { status: 400 }
        )
    }

    return NextResponse.json({
        data: {
            user_id: user.id,
            email: user.email,
            full_name: profile?.full_name || user.user_metadata?.full_name || 'User',
            avatar_url: profile?.avatar_url || null,
            role: profile?.role || 'user',
            created_at: profile?.created_at
        },
        error: null
    })
}

// PATCH /api/users/me
export async function PATCH(request: Request) {
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
            { data: null, error: { code: 'UNAUTHORIZED', message: 'Anda tidak diizinkan.' } },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()

        const updates: any = {}
        if (body.full_name !== undefined) updates.full_name = body.full_name
        if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({
            data: {
                user_id: user.id,
                full_name: data.full_name,
                avatar_url: data.avatar_url,
                updated_at: data.updated_at
            },
            error: null
        })

    } catch (error: any) {
        return NextResponse.json(
            { data: null, error: { code: 'UPDATE_ERROR', message: 'Gagal memperbarui profil.', details: error } },
            { status: 500 }
        )
    }
}
