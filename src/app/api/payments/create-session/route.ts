import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

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
            { data: null, error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu.' } },
            { status: 401 }
        )
    }

    try {
        const body = await request.json()
        const { invitation_id, plan_id, amount } = body

        if (!invitation_id || !plan_id) {
            return NextResponse.json(
                { data: null, error: { code: 'VALIDATION_ERROR', message: 'Data tidak lengkap.' } },
                { status: 400 }
            )
        }

        const transactionId = `NIKAHKU-${user.id.substring(0, 8)}-${Date.now()}`

        // 1. Insert pending payment record
        const { error: insertError } = await supabase
            .from('payments')
            .insert({
                user_id: user.id,
                invitation_id: invitation_id,
                plan_id: plan_id,
                amount: amount || 99000,
                status: 'pending',
                transaction_id: transactionId,
                payment_method: 'qris'
            })

        if (insertError) throw insertError

        // 2. Return mock Snap token (For MVP, we just return the transaction ID and a success URL)
        // In a real integration, this calls Midtrans snap.createTransaction()
        return NextResponse.json({
            data: {
                transaction_id: transactionId,
                snap_token: `mock-snap-${uuidv4()}`,
                qr_string: `00020101021126570011ID.CO.QRIS.WWW01189360091530009999990214${transactionId}5204541153033605802ID5918NIKAHKU INC PREMIUM6007BANDUNG610540115622305190015ID202302061234567896304CA12`,
            },
            error: null
        })

    } catch (error: any) {
        return NextResponse.json(
            { data: null, error: { code: 'PAYMENT_ERROR', message: 'Gagal membuat sesi pembayaran.', details: error } },
            { status: 500 }
        )
    }
}
