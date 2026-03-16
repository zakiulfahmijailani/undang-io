import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { data: null, error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu.' } },
      { status: 401 }
    )
  }

  const body = await request.json()
  const { slug } = body

  if (!slug) {
    return NextResponse.json(
      { data: null, error: { code: 'VALIDATION_ERROR', message: 'Slug wajib diisi.' } },
      { status: 400 }
    )
  }

  const adminClient = getAdminClient()
  if (!adminClient) {
    return NextResponse.json(
      { data: null, error: { code: 'DATABASE_ERROR', message: 'Admin client tidak tersedia.' } },
      { status: 500 }
    )
  }

  // 1. Fetch guest_session yang claimed oleh user ini, belum expired
  const { data: guestSession, error: gsError } = await adminClient
    .from('guest_sessions')
    .select('*')
    .eq('slug', slug)
    .eq('user_id', user.id)
    .eq('status', 'claimed')
    .gt('expires_at', new Date().toISOString())
    .single()

  if (gsError || !guestSession) {
    console.error('[convert] guest_session not found or expired:', gsError)
    return NextResponse.json(
      { data: null, error: { code: 'SESSION_NOT_FOUND', message: 'Sesi undangan tidak ditemukan atau sudah kadaluarsa.' } },
      { status: 404 }
    )
  }

  // 2. Cek apakah slug sudah ada di invitations (idempotent guard)
  const { data: existingInv } = await adminClient
    .from('invitations')
    .select('id, slug')
    .eq('slug', slug)
    .single()

  if (existingInv) {
    // Sudah pernah diconvert — return sukses dengan slug yang ada
    console.log('[convert] Already converted, returning existing invitation slug:', existingInv.slug)
    return NextResponse.json({ data: { slug: existingInv.slug }, error: null })
  }

  const inv = guestSession.invitation_data || {}

  // 3. Insert ke tabel invitations
  const groomNick = inv.groomNickname || inv.groomFullName || 'Mempelai Pria'
  const brideNick = inv.brideNickname || inv.brideFullName || 'Mempelai Wanita'

  const { data: newInvitation, error: insertError } = await adminClient
    .from('invitations')
    .insert({
      user_id: user.id,
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
    console.error('[convert] Failed to insert invitation:', insertError)
    return NextResponse.json(
      { data: null, error: { code: 'INSERT_FAILED', message: 'Gagal membuat undangan permanen.', details: insertError?.message } },
      { status: 500 }
    )
  }

  // 4. Update guest_session: status → converted, isi converted_to_invitation_id
  const { error: updateError } = await adminClient
    .from('guest_sessions')
    .update({
      status: 'converted',
      converted_to_invitation_id: newInvitation.id,
    })
    .eq('id', guestSession.id)

  if (updateError) {
    // Non-fatal: invitation sudah dibuat, hanya gagal update status
    console.error('[convert] Failed to update guest_session status:', updateError)
  }

  console.log('[convert] Success: guest_session', guestSession.id, '→ invitation', newInvitation.id)

  return NextResponse.json({
    data: { slug: newInvitation.slug },
    error: null,
  })
}
