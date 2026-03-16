import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin';

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
      const groomNick = inv.groomNickname || inv.groomFullName || 'Mempelai Pria'
      const brideNick = inv.brideNickname || inv.brideFullName || 'Mempelai Wanita'

      const { data: newInvitation, error: insertError } = await adminClient
        .from('invitations')
        .insert({
          user_id: guestSession.user_id,
          theme_id: guestSession.theme_id || null,
          slug: guestSession.slug,
          title: `Pernikahan ${groomNick} & ${brideNick}`,
          groom_full_name: inv.groomFullName || null,
          groom_nickname: inv.groomNickname || null,
          groom_father_name: inv.groomFatherName || null,
          groom_mother_name: inv.groomMotherName || null,
          bride_full_name: inv.brideFullName || null,
          bride_nickname: inv.brideNickname || null,
          bride_father_name: inv.brideFatherName || null,
          bride_mother_name: inv.brideMotherName || null,
          akad_datetime: inv.akadDatetime || inv.akadDate || null,
          akad_location_name: inv.akadLocationName || null,
          akad_location_address: inv.akadLocationAddress || null,
          resepsi_datetime: inv.resepsiDatetime || inv.resepsiDate || null,
          resepsi_location_name: inv.resepsiLocationName || null,
          resepsi_location_address: inv.resepsiLocationAddress || null,
          quote_text: inv.quoteText || null,
          gift_bank_name: inv.giftBankName || null,
          gift_bank_account: inv.giftBankAccount || null,
          gift_bank_account_name: inv.giftBankAccountName || null,
          gift_shipping_address: inv.giftShippingAddress || null,
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
