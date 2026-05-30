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
[Setelah auth berhasil]
  JALUR A — Email/Password:
    • fetch PATCH /api/guest-sessions/[token]/claim
      - Header: Authorization: Bearer <access_token>  ← WAJIB, bukan cookie
      - user_id = auth user id
      - status = 'claimed'
      - expires_at = NOW + 10 menit
    • Hapus localStorage
    • router.push('/dashboard')

  JALUR B — Google OAuth:
    • Token dibaca LANGSUNG dari localStorage saat klik (bukan dari React state)
    • redirectTo = `${origin}/api/auth/callback?guest_session_token=${token}`
    • Supabase redirect ke Google → balik ke /api/auth/callback
    • Callback: exchange code → claim → redirect /dashboard
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
  invitation_data             jsonb not null,
  theme_id                    text,
  user_id                     uuid references auth.users(id),
  status                      text not null default 'preview',
    -- preview | claimed | converted | expired
  expires_at                  timestamptz not null,
  converted_to_invitation_id  uuid,
  created_at                  timestamptz default now()
  -- ⚠️ TIDAK ADA kolom updated_at — jangan tambahkan ke query update!
);
```

**RLS: guest_sessions menggunakan admin/service role client untuk bypass RLS** karena saat INSERT user_id masih NULL.

---

## File-file Kunci (jangan rusak)

| File | Fungsi |
|---|---|
| `src/app/api/guest-sessions/route.ts` | POST — buat guest session baru |
| `src/app/api/guest-sessions/[token]/route.ts` | GET — ambil satu guest session |
| `src/app/api/guest-sessions/[token]/claim/route.ts` | PATCH — klaim session ke user (email/password flow) |
| `src/app/api/auth/callback/route.ts` | OAuth callback — exchange code + claim Google OAuth flow |
| `src/app/(auth)/login/page.tsx` | Login — claim client-side setelah signInWithPassword |
| `src/app/(auth)/register/page.tsx` | Register — claim client-side setelah signUp |
| `src/app/dashboard/page.tsx` | Dashboard — fetch invitations + guest_sessions |
| `src/app/dashboard/components/GuestConversion.tsx` | router.refresh() setelah redirect |
| `src/app/dashboard/components/GuestSessionCard.tsx` | Card dengan countdown timer live |

---

## Aturan Kritis — JANGAN Dilanggar

1. **JANGAN** panggil claim API dari server action — harus dari CLIENT setelah auth berhasil
2. **JANGAN** redirect ke `/u/[slug]` setelah login — selalu redirect ke `/dashboard`
3. **JANGAN** auto-convert guest_session ke invitations setelah login — konversi permanen HANYA setelah bayar
4. **JANGAN** hapus localStorage sebelum claim API berhasil
5. **JANGAN** tambahkan `updated_at` ke update query `guest_sessions` — kolom tidak ada di schema!
6. **SELALU** gunakan `getAdminClient()` untuk read/write `guest_sessions`
7. **SELALU** panggil `router.refresh()` di dashboard setelah redirect dari login/register
8. **SELALU** baca localStorage LANGSUNG saat klik Google OAuth — jangan dari React state (timing issue)
9. **SELALU** cek `expiresAt` saat baca `guest_session` dari localStorage — skip dan hapus jika sudah expired

---

## localStorage Keys

```typescript
// Struktur yang disimpan:
localStorage.setItem('guest_session', JSON.stringify({
  sessionToken: string,  // UUID token
  slug: string,          // URL slug
  expiresAt: string,     // ISO timestamp — WAJIB cek sebelum pakai!
}))

// Helper function wajib dipakai (bukan baca langsung):
function getGuestTokenFromStorage(searchParams: URLSearchParams): string | null {
  try {
    const raw = localStorage.getItem('guest_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.sessionToken) {
        if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
          localStorage.removeItem('guest_session'); // expired, hapus
        } else {
          return parsed.sessionToken;
        }
      }
    }
  } catch (e) {}
  const pending = localStorage.getItem('pending_claim_token');
  if (pending) return pending;
  return searchParams.get('guest_token');
}

// Key tambahan:
localStorage.removeItem('guest_return_slug')
localStorage.removeItem('pending_claim_token')
```

---

## Google OAuth Claim — Cara Kerja

Berbeda dengan email/password, Google OAuth tidak bisa claim di client side karena user langsung di-redirect ke Google. Solusinya: token dikirim via `redirectTo` URL.

```typescript
// Di handleGoogleLogin — login/page.tsx:
const token = getGuestTokenFromStorage(new URLSearchParams(window.location.search));
// ↑ Baca LANGSUNG dari localStorage saat klik, bukan dari React state!

let redirectTo = `${window.location.origin}/api/auth/callback`;
if (token) redirectTo += `?guest_session_token=${token}`;

await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo },
});
```

```typescript
// Di /api/auth/callback/route.ts:
const guestSessionToken = searchParams.get('guest_session_token');
// Exchange code dulu, baru claim:
await supabaseAdmin.from('guest_sessions').update({
  user_id: user.id,
  status: 'claimed',
  expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  // ⚠️ JANGAN tambah updated_at — tidak ada di schema!
}).eq('id', guestSession.id);
```

**Syarat Supabase Redirect URL:** Pastikan `http://localhost:3000/**` dan `https://domain.com/**` ada di
Authentication → URL Configuration → Redirect URLs. Gunakan wildcard `/**` bukan exact path.

---

## Debugging Checklist

Kalau claim tidak bekerja (status tetap `preview` di Supabase):
- [ ] Tambahkan `console.log` di `/api/auth/callback/route.ts` untuk trace setiap step
- [ ] Cek terminal `pnpm dev` — bukan browser console — untuk melihat server-side logs
- [ ] Cek `guest_sessions` di Supabase — apakah `user_id` sudah terisi?
- [ ] Cek `status` — harus `claimed` bukan `preview`
- [ ] Cek `expires_at` di localStorage — apakah sudah expired sebelum login?
- [ ] Cek Network tab → filter `callback` — apakah `guest_session_token` ikut di URL?
- [ ] Cek Supabase Auth → URL Configuration → apakah redirect URL di-whitelist dengan `/**`?
- [ ] Pastikan tidak ada field yang tidak exist di query update (contoh: `updated_at`)
- [ ] Cek apakah `getAdminClient()` tersedia (`SUPABASE_SERVICE_ROLE_KEY` ada di env?)

Kalau banner amber tidak muncul di login page:
- [ ] Cek localStorage di browser console: `localStorage.getItem('guest_session')`
- [ ] Cek apakah `expiresAt` sudah lewat — kalau iya, buat guest session baru
- [ ] Pastikan membaca localStorage di `useEffect` dengan dependency `[]` (mount only)
- [ ] Jangan baca localStorage di luar `useEffect` — akan crash di SSR

---

## Post-Mortem: Sesi Debugging 16 Maret 2026

Masalah: status `guest_sessions` tidak berubah dari `preview` ke `claimed` setelah login Google OAuth.

**4 bug berlapis yang ditemukan:**

| # | Bug | Root Cause | Fix |
|---|---|---|---|
| 1 | Banner amber tidak muncul | `useEffect` jalan saat SSR, `localStorage` belum tersedia | Split jadi dua `useEffect`: pertama set `mounted`, kedua baca localStorage setelah mounted |
| 2 | Banner masih tidak muncul | Token lama di localStorage sudah **expired** | Tambah cek `expiresAt < now()`, auto-remove jika expired |
| 3 | Token tidak ikut ke Google OAuth | `handleGoogleLogin` baca dari React **state** yang belum ter-set karena timing | Baca LANGSUNG dari `localStorage` saat klik via helper `getGuestTokenFromStorage()` |
| 4 | Claim gagal diam-diam di callback | Field `updated_at` tidak ada di tabel → error `PGRST204` | Hapus `updated_at` dari query update |

**Lesson:** Tambahkan debug `console.log` di callback route LEBIH AWAL. Bug #4 selesai dalam 2 menit setelah log ditambahkan, padahal sebelumnya struggle berjam-jam.
