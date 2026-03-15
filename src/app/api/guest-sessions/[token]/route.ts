import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const { searchParams } = new URL(request.url)
    const bySlug = searchParams.get('by') === 'slug'

    const supabaseAdmin = getAdminClient()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client tidak tersedia.' } },
        { status: 500 }
      )
    }

    const query = supabaseAdmin
      .from('guest_sessions')
      .select('*')

    const { data: session, error } = await (bySlug
      ? query.eq('slug', token).single()
      : query.eq('session_token', token).single())

    if (error || !session) {
      return NextResponse.json(
        { data: null, error: { code: 'SESSION_NOT_FOUND', message: 'Sesi undangan tidak ditemukan.' } },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: session, error: null })
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan internal.' } },
      { status: 500 }
    )
  }
}
