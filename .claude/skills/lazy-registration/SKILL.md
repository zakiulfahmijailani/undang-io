---
name: lazy-registration
description: Implements or debugs the Lazy Registration with Anonymous Session Migration pattern in undang-io. Use when the user says "perbaiki alur guest", "guest session tidak muncul di dashboard", "undangan sebelum login hilang", "claim tidak bekerja", "timer tidak muncul", "user baru tidak lihat undangannya", or any issue related to the pre-login invitation flow. This is the core monetization funnel of undang-io.
---

# Lazy Registration — undang-io

## Definisi Pattern
**Lazy Registration with Anonymous Session Migration**: user membuat konten SEBELUM register/login. Data tersimpan sementara di `guest_sessions`. Setelah register/login, data otomatis terhubung ke akun user. Ini adalah funnel utama monetisasi undang-io.

---

## Alur Lengkap

```
[User buka undang.io]
        ↓
[Pilih tema → Isi data undangan → Klik Publish]
        ↓
[API POST /api/guest-sessions]
  • Buat record di tabel guest_sessions
  • session_token = UUID (unik)
  • status = 'preview'
  • expires_at = NOW + 15 menit
  • user_id = NULL
  • Simpan ke localStorage: { sessionToken, slug, expiresAt }
        ↓
[Redirect ke /u/[slug]]
  • Tampilkan undangan preview
  • Banner countdown: "Tersimpan X menit lagi — Daftar untuk simpan permanen"
        ↓
[User klik Daftar / Login]
        ↓
[Login/Register page]
  • Baca sessionToken dari localStorage
  • Tampilkan banner: "Login untuk simpan undangan + perpanjang 10 menit"
        ↓
[Setelah auth berhasil — CLIENT SIDE]
  • fetch PATCH /api/guest-sessions/[token]/claim
    - user_id = auth user id
    - status = 'claimed'
    - expires_at = NOW + 10 menit
  • Hapus localStorage
  • router.push('/dashboard')
        ↓
[Dashboard]
  • GuestConversion.tsx → router.refresh() (paksa re-fetch server component)
  • Fetch invitations (permanent, sudah bayar)
  • Fetch guest_sessions WHERE user_id = user AND status = 'claimed' AND expires_at > NOW
  • Tampilkan GuestSessionCard dengan countdown timer live
        ↓
[User klik Bayar]
  • Midtrans payment flow
  • Setelah bayar: insert ke invitations, update guest_sessions.status = 'converted'
  • Timer hilang, undangan jadi permanent
```

---

## Tabel Database Kunci

### guest_sessions
```sql
create table guest_sessions (
  id                          uuid primary key default gen_random_uuid(),
  session_token               uuid unique not null default gen_random_uuid(),
  slug                        text unique not null,
  invitation_data             jsonb not null,   -- semua data form undangan
  theme_id                    text,
  user_id                     uuid references auth.users(id), -- NULL sebelum claim
  status                      text not null default 'preview',
    -- preview | claimed | converted | expired
  expires_at                  timestamptz not null,
  converted_to_invitation_id  uuid,
  created_at                  timestamptz default now(),
  updated_at                  timestamptz default now()
);
```

**RLS: guest_sessions menggunakan admin/service role client untuk bypass RLS** karena saat INSERT user_id masih NULL.

---

## File-file Kunci (jangan rusak)

| File | Fungsi |
|---|---|
| `src/app/api/guest-sessions/route.ts` | POST — buat guest session baru |
| `src/app/api/guest-sessions/[token]/route.ts` | GET — ambil satu guest session |
| `src/app/api/guest-sessions/[token]/claim/route.ts` | PATCH — klaim session ke user |
| `src/app/api/auth/callback/route.ts` | OAuth callback — exchange code + claim Google |
| `src/app/(auth)/login/page.tsx` | Login — claim client-side setelah signInWithPassword |
| `src/app/(auth)/register/page.tsx` | Register — claim client-side setelah signUp |
| `src/app/dashboard/page.tsx` | Dashboard — fetch invitations + guest_sessions |
| `src/app/dashboard/components/GuestConversion.tsx` | router.refresh() setelah redirect |
| `src/app/dashboard/components/GuestSessionCard.tsx` | Card dengan countdown timer live |

---

## Aturan Kritis — JANGAN Dilanggar

1. **JANGAN** panggil claim API dari server action — harus dari CLIENT setelah auth berhasil, supaya cookie session tersedia
2. **JANGAN** redirect ke `/u/[slug]` setelah login — selalu redirect ke `/dashboard`
3. **JANGAN** auto-convert guest_session ke invitations setelah login — konversi permanen HANYA setelah bayar
4. **JANGAN** hapus localStorage sebelum claim API berhasil dipanggil
5. **SELALU** gunakan `getAdminClient()` untuk read/write `guest_sessions` — bukan user supabase client
6. **SELALU** panggil `router.refresh()` di dashboard setelah redirect dari login/register

---

## localStorage Keys

```typescript
// Struktur yang disimpan:
localStorage.setItem('guest_session', JSON.stringify({
  sessionToken: string,  // UUID token
  slug: string,          // URL slug
  expiresAt: string,     // ISO timestamp
  invitationData: object // data form opsional
}))

// Key tambahan:
localStorage.removeItem('guest_return_slug')
```

---

## Debugging Checklist

Kalau undangan tidak muncul di dashboard setelah login:
- [ ] Cek `guest_sessions` di Supabase — apakah `user_id` sudah terisi?
- [ ] Cek `status` — harus `claimed` bukan `preview`
- [ ] Cek `expires_at` — belum expired?
- [ ] Cek browser console — apakah claim API dipanggil? Apa response-nya?
- [ ] Cek apakah `GuestConversion.tsx` memanggil `router.refresh()`
- [ ] Cek apakah `dashboard/page.tsx` fetch `guest_sessions` dengan filter yang benar
- [ ] Cek apakah `getAdminClient()` tersedia (env `SUPABASE_SERVICE_ROLE_KEY` ada?)
