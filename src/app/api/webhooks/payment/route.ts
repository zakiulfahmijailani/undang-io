import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin';
import { mapGuestInvitationDataToInvitationColumns } from '@/lib/guest-invitation-columns';
import { resolveInvitationThemeSelection } from '@/lib/theme-selection';

// WEBHOOK HANDLER — dipanggil Midtrans setelah pembayaran dikonfirmasi
// Endpoint: POST /api/webhooks/payment
// Untuk MVP/testing: bisa dipanggil manual dari Postman atau frontend "Simulate Payment"
export async function POST(request: Request) {
  const adminClient = getAdminClient();

  if (!adminClient) {
    return NextResponse.json(
      { data: null, error: { code: 'DATABASE_ERROR', message: 'Admin client tidak tersedia.' } },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    // Midtrans mengirim transaction_status, order_id, dll.
    // Untuk MVP kita terima { slug, user_id } atau { transaction_id, status }
    const { slug, user_id, transaction_id, transaction_status } = body

    // === FLOW 1: Convert via slug + user_id (dipanggil manual / internal) ===
    if (slug && user_id) {
      const { data: guestSession, error: gsError } = await adminClient
        .from('guest_sessions')
        .select('*')
        .eq('slug', slug)
        .eq('user_id', user_id)
        .eq('status', 'claimed')
        .single()

      if (gsError || !guestSession) {
        console.error('[webhook] guest_session not found:', gsError)
        return NextResponse.json({ received: true })
      }

      // Idempotent: cek apakah sudah pernah diconvert
      const { data: existing } = await adminClient
        .from('invitations')
        .select('id, slug')
        .eq('slug', slug)
        .single()

      if (existing) {
        console.log('[webhook] Already converted:', existing.slug)
        return NextResponse.json({ received: true, data: { slug: existing.slug } })
      }

      const inv = guestSession.invitation_data || {}
      const mappedInvitation = mapGuestInvitationDataToInvitationColumns(inv)
      const themeSelection = await resolveInvitationThemeSelection(adminClient, guestSession.theme_id)

      const { data: newInvitation, error: insertError } = await adminClient
        .from('invitations')
        .insert({
          user_id: guestSession.user_id,
          theme_id: themeSelection.themeId,
          theme_key: themeSelection.themeKey,
          slug: guestSession.slug,
          ...mappedInvitation.columns,
          status: 'active',
          is_paid: true,
          paid_at: new Date().toISOString(),
          converted_from_guest_session_id: guestSession.id,
        })
        .select('id, slug')
        .single()

      if (insertError || !newInvitation) {
        console.error('[webhook] Failed to insert invitation:', insertError)
        return NextResponse.json({ received: true })
      }

      await adminClient
        .from('guest_sessions')
        .update({
          status: 'converted',
          converted_to_invitation_id: newInvitation.id,
        })
        .eq('id', guestSession.id)

      console.log('[webhook] Converted guest_session', guestSession.id, '→ invitation', newInvitation.id)
      return NextResponse.json({ received: true, data: { slug: newInvitation.slug } })
    }

    // === FLOW 2: Midtrans webhook standar (transaction_id + status) ===
    if (transaction_id && (transaction_status === 'settlement' || transaction_status === 'capture')) {
      const { data: payment } = await adminClient
        .from('payments')
        .select('*')
        .eq('transaction_id', transaction_id)
        .single()

      if (payment) {
        await adminClient
          .from('payments')
          .update({ status: 'success', paid_at: new Date().toISOString() })
          .eq('id', payment.id)

        console.log('[webhook] Payment updated to success:', transaction_id)
      }
      return NextResponse.json({ received: true })
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('[webhook] Unexpected error:', error)
    // Selalu return 200 supaya Midtrans tidak retry
    return NextResponse.json({ received: true, error: error.message })
  }
}
