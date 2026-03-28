import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/cron/cleanup-sessions
 *
 * Dipanggil otomatis oleh Vercel Cron setiap hari jam 02:00 UTC.
 * Menghapus semua guest_sessions yang:
 *   - expires_at sudah lewat, DAN
 *   - status bukan 'converted' (belum dibayar / diaktifkan)
 *
 * Diamankan dengan Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  // ── Auth check ─────────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  try {
    const supabase = getAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database client tidak tersedia.' },
        { status: 500 }
      )
    }

    const now = new Date().toISOString()

    const { data, error, count } = await supabase
      .from('guest_sessions')
      .delete()
      .lt('expires_at', now)
      .neq('status', 'converted')
      .select('id, slug, expires_at')

    if (error) {
      console.error('[cron/cleanup-sessions] Supabase error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    const deleted = data?.length ?? 0
    console.log(`[cron/cleanup-sessions] Deleted ${deleted} expired guest sessions.`)

    return NextResponse.json({
      success: true,
      deleted,
      deletedAt: now,
      sessions: data?.map(s => ({ id: s.id, slug: s.slug, expiredAt: s.expires_at })) ?? [],
    })
  } catch (err: any) {
    console.error('[cron/cleanup-sessions] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
