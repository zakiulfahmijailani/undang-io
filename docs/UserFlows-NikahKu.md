# User Flow Diagrams — NikahKu Platform
## Panduan Lengkap Semua Alur Pengguna

---
**Dokumen:** User Flow Diagrams v1.0  
**Date:** 6 Maret 2026  
**Owner:** Zakiul Fahmi Jailani  
**Format:** Visual PNG (lihat file terpisah) + Teks referensi

---

## DAFTAR FLOW

| # | File | Aktor | Deskripsi |
|---|------|-------|-----------|
| 1 | flow-tamu.png | Tamu (Guest) | Dari terima link WA → RSVP → Amplop QRIS |
| 2 | flow-pasangan.png | Pasangan | Daftar → Wizard 6 Step → Tema → Publish + Payment |
| 3 | flow-admin-owner.png | Admin & Owner | Moderasi konten (Admin) + KPI bisnis (Owner) |
| 4 | flow-qris-payment.png | Semua (Swimlane) | End-to-end QRIS: Browser → Server → Midtrans → Supabase |

---

## LEGENDA WARNA UNIVERSAL

| Warna | Makna |
|-------|-------|
| Biru (#2A5A8A) | Halaman / Proses utama |
| Emas (#D4A91C) | Keputusan / Input pengguna |
| Hijau (#2E7D4F) | Aksi sukses / End state |
| Rose (#C9656E) | Error / Warning / Gagal |
| Ungu (#6B4A8A) | Modal overlay / AI / Tema |
| Teal (#1A7070) | Server / Backend |
| Orange (#B05A20) | Admin / Eksternal |

---

## FLOW 1: TAMU (GUEST)

### Titik Masuk
- Terima link WA → klik link undangan

### Alur Utama (Happy Path)
1. Website load → Tampil hero + foto
2. Scroll → baca detail acad & resepsi
3. Klik Buka Peta → Google Maps
4. Klik Simpan Kalender → .ics / Google Calendar
5. Isi RSVP form → submit → konfirmasi
6. Tulis ucapan & doa → submit
7. Klik Kirim Hadiah → Modal QRIS/Rekening
8. Scan QRIS / Salin rekening → selesai

### Error States
- Website slow → tampil skeleton loading
- RSVP form tidak valid → inline error, form tetap terbuka

---

## FLOW 2: PASANGAN (BUAT UNDANGAN)

### Titik Masuk
- Landing page → klik "Buat Undangan Gratis"

### Sub-Flow: Auth
- Register email / Google SSO → validasi → masuk dashboard
- Jika gagal → error inline, coba lagi

### Sub-Flow: Wizard 6 Langkah
| Step | Konten | Fitur Khusus |
|------|--------|--------------|
| 1 | Data Mempelai | Nama, foto, orang tua |
| 2 | Info Acara | Tanggal, jam, lokasi + Google Maps embed |
| 3 | Pilih Tema | Browse, preview live, filter |
| 4 | Konten & Media | Upload foto/video + **AI Copywriter Claude** |
| 5 | Amplop Digital | Upload QRIS, tambah rekening bank |
| 6 | Preview & Publish | Live preview + tombol Publish |

### Sub-Flow: Pilih Tema
- Browse halaman tema → filter (warna, gaya, adat)
- Preview live tema → pilih → kembali ke wizard step 3

### Sub-Flow: Payment (Upgrade Premium)
- Klik Upgrade → pilih paket → QRIS → webhook → premium aktif

---

## FLOW 3: ADMIN INTERNAL

### Akses: /admin (role = 'admin' di Supabase)

### Menu Utama
| Menu | Aksi Tersedia |
|------|---------------|
| Manajemen Users | Cari, suspend, verifikasi akun |
| Kelola Tema | Edit metadata, publish/unpublish tema |
| Moderasi Konten | Review ucapan/gambar, hapus/approve |

### Guardrail
- Semua aksi di-log ke `audit_logs` (action, user_id, ip, timestamp)

---

## FLOW 4: OWNER DASHBOARD

### Akses: /owner (role = 'owner' di Supabase)

### KPI yang Ditampilkan
- Total User (+ growth %)
- Total Undangan (aktif vs draft)
- Revenue QRIS (harian, bulanan, per paket)
- AI Usage (token count per fitur)

### Aksi Tersedia
- Filter per periode (hari, minggu, bulan, custom)
- Lihat detail user list + search
- Lihat transaksi QRIS (status: success, pending, failed)
- Lihat log AI per fitur
- **Export data (CSV / PDF)**
- Terima alert email jika ada anomali pembayaran

---

## FLOW 5 (CROSS-LAYER): QRIS END-TO-END SWIMLANE

### Aktor yang Terlibat
1. **Pasangan (Browser)** — user-facing actions
2. **NikahKu Server** — API Routes di Next.js/Vercel
3. **Midtrans Gateway** — third-party payment processor
4. **Supabase DB** — persistent state

### Urutan Kritis
```
1. User klik Upgrade
2. Browser → POST /api/payments/create-session
3. Server → validate user → generate order_id
4. Server → Midtrans: createTransaction()
5. Supabase: INSERT payments (status=pending)
6. Midtrans → return snap_token + QRIS
7. Browser: tampil QRIS
8. User scan & bayar
9. Midtrans → POST /api/webhooks/payment (HTTP)
10. Server: verifikasi signature Midtrans
11. Server: idempotency check
12. Supabase: UPDATE payments.status = 'success'
13. Supabase: UPDATE invitations.plan_id = premium
14. Supabase: INSERT audit_logs
15. Browser: refresh → tampil status sukses
```

### Guardrail Keamanan
- Signature Midtrans WAJIB diverifikasi (SHA-512 hash)
- Idempotency: cek `payment_id` sebelum proses
- Webhook selalu return HTTP 200 (agar tidak retry)
- Semua error di-log internal, jangan expose ke client

---

## CATATAN UNTUK AI AGENTS

Ketika membangun implementasi dari flow ini:

1. **Setiap decision node (diamond)** harus punya error handling eksplisit
2. **Setiap arrow berlabel "Gagal"** harus render error state yang user-friendly (bukan console.error)
3. **Loading state** wajib ada di semua transisi antar halaman
4. **Mobile-first:** semua flow di atas harus lancar di layar 375px
5. **Offline/slow:** pertimbangkan apa yang terjadi jika koneksi putus saat step kritis (terutama payment)

---
*User Flow Diagrams v1.0 — NikahKu Platform*
*6 Maret 2026 | Zakiul Fahmi Jailani*
