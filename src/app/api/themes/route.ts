import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/themes
export async function GET(request: Request) {
    const supabase = await createClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client not initialized.' } },
            { status: 500 }
        )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const price = searchParams.get('price') // 'free' | 'premium'

    let query = supabase.from('themes').select('*').order('created_at', { ascending: true })

    if (category) {
        query = query.eq('category', category)
    }

    if (price === 'free') {
        query = query.eq('is_premium', false)
    } else if (price === 'premium') {
        query = query.eq('is_premium', true)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json(
            { data: null, error: { code: 'FETCH_ERROR', message: 'Gagal memuat tema.', details: error } },
            { status: 400 }
        )
    }

    // Format response
    const themes = data.map((theme: any) => ({
        theme_id: theme.id,
        name: theme.name,
        slug: theme.slug,
        category: theme.category,
        price_type: theme.is_premium ? 'premium' : 'free',
        preview_url: theme.thumbnail_url,
        preview_demo_url: theme.demo_url,
    }))

    return NextResponse.json({
        data: {
            items: themes,
            pagination: { total: themes.length, page: 1, limit: 50 }
        },
        error: null
    })
}
