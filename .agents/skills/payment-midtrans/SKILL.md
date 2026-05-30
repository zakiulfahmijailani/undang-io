---
name: payment-midtrans
description: Implements or debugs the Midtrans payment integration in undang-io. Use when the user says "payment tidak jalan", "midtrans error", "setelah bayar tidak redirect", "buat halaman pembayaran", "integrasi midtrans", "snap tidak muncul", or any issue related to the payment flow. Payment is the final step that converts a guest_session into a permanent invitation.
---

# Payment Midtrans — undang-io

## Posisi dalam User Journey

```
guest_session (claimed) → [User klik Bayar] → Midtrans Snap → Callback → invitation (permanent)
```

Payment adalah gate antara undangan sementara (free preview) dan undangan permanen (published).

---

## Stack Midtrans yang Digunakan

- **Mode:** Sandbox untuk dev, Production untuk live
- **Method:** Midtrans Snap (popup/redirect)
- **Trigger:** Server-side `createTransaction`, client-side `snap.pay()`
- **Callback:** Server-side webhook `POST /api/payment/notification`

---

## Environment Variables yang Diperlukan

```env
# Midtrans
MIDTRANS_SERVER_KEY=          # Server key dari dashboard Midtrans
MIDTRANS_CLIENT_KEY=          # Client key (NEXT_PUBLIC)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false  # true untuk production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=    # Wajib untuk admin client

# App
NEXT_PUBLIC_SITE_URL=https://undang.io
```

---

## Alur Payment

### 1. User klik "Bayar" di GuestSessionCard
```
GET /pembayaran/[slug]
  → Halaman konfirmasi order
  → Tampilkan detail undangan + harga Rp 45.000
  → Tombol "Lanjutkan Pembayaran"
```

### 2. Client request Snap Token
```typescript
// POST /api/payment/create-transaction
// Body: { slug: string }
// Server:
//   - Verifikasi user owns guest_session
//   - Buat order_id unik
//   - Call Midtrans API createTransaction
//   - Return { token: string, orderId: string }
```

### 3. Client buka Snap popup
```typescript
window.snap.pay(token, {
  onSuccess: (result) => router.push(`/dashboard?payment=success`),
  onPending: (result) => router.push(`/dashboard?payment=pending`),
  onError: (result) => toast.error('Pembayaran gagal'),
  onClose: () => {/* user tutup popup */}
})
```

### 4. Midtrans kirim webhook
```
POST /api/payment/notification
  → Verifikasi signature key
  → Jika transaction_status = 'settlement' atau 'capture':
    - INSERT ke invitations (permanent)
    - UPDATE guest_sessions SET status = 'converted'
    - INSERT ke transactions (log)
  → Return 200 OK
```

---

## Harga

| Paket | Harga | Keterangan |
|---|---|---|
| Basic | Rp 45.000 | Undangan digital permanen, semua fitur dasar |

---

## Database: Tabel transactions (log pembayaran)

```sql
create table transactions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id),
  invitation_id       uuid references invitations(id),
  guest_session_id    uuid references guest_sessions(id),
  order_id            text unique not null,
  gross_amount        integer not null,  -- dalam rupiah
  payment_type        text,
  transaction_status  text not null default 'pending',
    -- pending | settlement | capture | cancel | expire | refund
  midtrans_response   jsonb,
  paid_at             timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);
```

---

## Aturan Kritis

1. **SELALU verifikasi** Midtrans signature key di webhook sebelum proses apapun
2. **JANGAN** percaya status dari client — selalu dari webhook Midtrans
3. **JANGAN** insert ke `invitations` sebelum payment settlement dikonfirmasi webhook
4. **SELALU** gunakan `getAdminClient()` di webhook handler — bukan user client
5. **IDEMPOTENT** — webhook bisa dipanggil lebih dari sekali, pastikan tidak double-insert
6. **Sandbox URL** Midtrans: `https://app.sandbox.midtrans.com/snap/v1/transactions`
7. **Production URL**: `https://app.midtrans.com/snap/v1/transactions`

---

## Debugging Checklist

Kalau pembayaran tidak memproses dengan benar:
- [ ] Cek `MIDTRANS_SERVER_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` di env
- [ ] Cek `MIDTRANS_IS_PRODUCTION` — harus `false` di dev
- [ ] Cek Midtrans dashboard → Transactions untuk status order
- [ ] Cek webhook URL sudah dikonfigurasi di Midtrans dashboard
- [ ] Cek `/api/payment/notification` — apakah menerima request dari Midtrans?
- [ ] Cek tabel `transactions` di Supabase — apakah ada record?
- [ ] Cek signature verification — apakah key cocok?
- [ ] Kalau sandbox, pastikan pakai test card: 4811 1111 1111 1114
