import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/cron/cleanup-sessions
 *
 * Dipanggil otomatis oleh Vercel Cron setiap menit.
 * Menandai preview yang habis dan menghapus preview anonim yang
 * sudah lebih dari 24 jam. Sesi claimed milik user tidak dihapus.
 */
export async function GET(request: NextRequest) {
  // ── Auth check ──────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { data: null, error: { code: 'UNAUTHORIZED', message: 'Akses tidak diizinkan.' } },
      { status: 401 },
    )
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────
  try {
    const supabase = getAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { data: null, error: { code: 'DATABASE_UNAVAILABLE', message: 'Database client tidak tersedia.' } },
        { status: 500 },
      )
    }

    const now = new Date().toISOString()
    const { error: markError } = await supabase
      .from('guest_sessions')
      .update({ status: 'expired' })
      .lt('expires_at', now)
      .eq('status', 'preview')

    if (markError) {
      console.error('[cron/cleanup-sessions] Mark expired error:', markError)
      return NextResponse.json(
        { data: null, error: { code: 'MARK_EXPIRED_FAILED', message: 'Gagal menandai sesi kedaluwarsa.' } },
        { status: 500 },
      )
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('guest_sessions')
      .delete()
      .lt('expires_at', cutoff)
      .in('status', ['preview', 'expired'])
      .is('converted_to_invitation_id', null)
      .select('id, slug, expires_at')

    if (error) {
      console.error('[cron/cleanup-sessions] Supabase error:', error)
      return NextResponse.json(
        { data: null, error: { code: 'DELETE_EXPIRED_FAILED', message: 'Gagal menghapus sesi kedaluwarsa.', details: error.message } },
        { status: 500 },
      )
    }

    const deleted = data?.length ?? 0
    if (deleted > 0) {
      console.log(`[cron/cleanup-sessions] Deleted ${deleted} expired guest sessions:`,
        data?.map(s => s.slug).join(', '))
    }

    return NextResponse.json({
      data: {
        deleted,
        cutoff,
        sessions: data?.map(s => ({ id: s.id, slug: s.slug, expiredAt: s.expires_at })) ?? [],
      },
      error: null,
    })
  } catch (err: unknown) {
    console.error('[cron/cleanup-sessions] Unexpected error:', err)
    return NextResponse.json(
      { data: null, error: { code: 'INTERNAL_ERROR', message: 'Terjadi kesalahan internal.' } },
      { status: 500 },
    )
  }
}
