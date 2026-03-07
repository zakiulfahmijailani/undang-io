import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// MOCK WEBHOOK HANDLER
// In a real app, this would be called by Midtrans servers (e.g. POST /api/webhooks/payment)
// For the MVP, we can simulate it by sending a POST request directly from the frontend
// when they click a "Simulate Payment Success" button.
export async function POST(request: Request) {
    const supabase = await createClient()

    if (!supabase) {
        return NextResponse.json(
            { data: null, error: { code: 'DATABASE_ERROR', message: 'Database client not initialized.' } },
            { status: 500 }
        )
    }

    try {
        const body = await request.json()
        const { transaction_id, status } = body

        if (!transaction_id || status !== 'success') {
            return NextResponse.json({ received: true })
        }

        // 1. Get payment details
        // Note: Webhooks usually run outside user sessions, so ideally we'd use a service_role key
        // For MVP, if it fails due to RLS, make sure payments table has no RLS block for reads if testing via Postman,
        // or ensure the testing user is authenticated. We'll use the user auth context provided by cookies here.
        const { data: payment, error: fetchError } = await supabase
            .from('payments')
            .select('*')
            .eq('transaction_id', transaction_id)
            .single()

        if (fetchError || !payment) {
            console.error('Payment not found:', fetchError)
            return NextResponse.json({ received: true })
        }

        // 2. Update payment status
        await supabase
            .from('payments')
            .update({ status: 'success', paid_at: new Date().toISOString() })
            .eq('id', payment.id)

        // 3. Upgrade user's invitation plan
        await supabase
            .from('invitations')
            .update({ plan_id: payment.plan_id })
            .eq('id', payment.invitation_id)

        return NextResponse.json({
            data: { message: 'Pembayaran berhasil diproses dan status di-upgrade', success: true },
            error: null
        })

    } catch (error: any) {
        console.error('Webhook error:', error)
        // Always return 200 for webhooks so Midtrans doesn't retry infinitely
        return NextResponse.json({ received: true, error: error.message })
    }
}
