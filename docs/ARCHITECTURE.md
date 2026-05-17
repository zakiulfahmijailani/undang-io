# ARCHITECTURE.md — undang-io

Dokumen ini mendeskripsikan arsitektur teknis aplikasi undang-io: struktur direktori aktual, route map, data flow, dan keputusan desain yang diambil.

> Untuk aturan yang WAJIB diikuti agent, lihat `docs/AGENTS.md`.
> Untuk schema database lengkap, lihat `docs/DATABASE_SCHEMA.md`.

---

## Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| Framework | Next.js App Router | 14 |
| Language | TypeScript | strict mode |
| Database & Auth | Supabase | PostgreSQL + GoTrue |
| UI Components | shadcn/ui | — |
| Styling | Tailwind CSS | — |
| Deployment | Vercel | — |

---

## Struktur Direktori

```
undang-io/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/                       ← Route group: halaman auth
│   │   │   └── (login, register, dll)
│   │   │
│   │   ├── (public)/                     ← Route group: halaman publik
│   │   │   └── (landing, pricing, dll)
│   │   │
│   │   ├── auth/                         ← Supabase Auth callback handler
│   │   │
│   │   ├── dashboard/                    ← Protected: user & admin
│   │   │   ├── layout.tsx                ← Dashboard shell + sidebar
│   │   │   ├── page.tsx                  ← Dashboard home
│   │   │   ├── akun/                     ← Pengaturan akun user
│   │   │   ├── create/                   ← (Legacy?) buat undangan
│   │   │   ├── cs/                       ← Customer service / support
│   │   │   ├── edit/                     ← Edit undangan
│   │   │   ├── invitations/              ← List undangan user
│   │   │   ├── tema/                     ← (Legacy?) manajemen tema
│   │   │   ├── themes/                   ← ✅ AKTIF: admin tema
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [themeKey]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── assets/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── preview/
│   │   │   │           └── page.tsx
│   │   │   ├── transaksi/                ← Riwayat transaksi
│   │   │   └── undangan/                 ← (duplikat invitations?)
│   │   │
│   │   ├── api/                          ← API Routes
│   │   │
│   │   ├── invite/                       ← Public: landing undangan tamu
│   │   ├── owner/                        ← Owner-only area
│   │   ├── pembayaran/                   ← Flow pembayaran
│   │   ├── preview/                      ← (Legacy) preview route lama
│   │   └── u/                            ← Public: undangan via slug pendek
│
├── docs/
│   ├── DATABASE_SCHEMA.md
│   ├── AGENTS.md
│   └── ARCHITECTURE.md                   ← (file ini)
│
└── middleware.ts                          ← Auth guard + route protection
```

### ⚠️ Area yang Perlu Diaudit

| Path | Status | Catatan |
|---|---|---|
| `dashboard/tema/` | ❓ Legacy? | Kemungkinan duplikat dari `dashboard/themes/` |
| `dashboard/undangan/` | ❓ Legacy? | Kemungkinan duplikat dari `dashboard/invitations/` |
| `dashboard/create/` | ❓ Legacy? | Mungkin sudah digantikan `/buat-undangan` |
| `app/preview/` | ❌ Legacy | Sudah digantikan `dashboard/themes/[themeKey]/preview/` |

---

## Route Map

### Public Routes (tanpa auth)

| Route | File | Keterangan |
|---|---|---|
| `/` | `(public)/page.tsx` | Landing page |
| `/u/[slug]` | `u/[slug]/page.tsx` | Halaman undangan publik via slug pendek |
| `/invite/[...]` | `invite/[...]/page.tsx` | Landing undangan untuk tamu |
| `/buat-undangan` | `(public)/buat-undangan/page.tsx` | Wizard buat undangan (public + guest) |
| `/pembayaran` | `pembayaran/page.tsx` | Flow pembayaran Midtrans/Xendit |

### Auth Routes

| Route | Keterangan |
|---|---|
| `/login` | Halaman login Supabase Auth |
| `/register` | Halaman registrasi |
| `/auth/callback` | Supabase OAuth callback handler |

### Dashboard Routes (protected — harus login)

| Route | Keterangan |
|---|---|
| `/dashboard` | Overview: undangan aktif, stats |
| `/dashboard/invitations` | List semua undangan milik user |
| `/dashboard/edit/[id]` | Edit undangan yang sudah dibuat |
| `/dashboard/akun` | Pengaturan profil dan akun |
| `/dashboard/transaksi` | Riwayat pembayaran |
| `/dashboard/cs` | Customer service / chat support |

### Admin Routes (protected — harus role admin)

| Route | Keterangan |
|---|---|
| `/dashboard/themes` | List semua tema |
| `/dashboard/themes/new` | Form buat tema baru |
| `/dashboard/themes/[themeKey]` | Edit detail tema |
| `/dashboard/themes/[themeKey]/assets` | Kelola aset tema (gambar, font) |
| `/dashboard/themes/[themeKey]/preview` | Preview tema dengan data sample dari Supabase |
| `/owner` | Area super-admin / owner |

### API Routes

| Endpoint | Method | Status | Keterangan |
|---|---|---|---|
| `/api/invitations` | POST | ❌ Belum ada | Simpan undangan user login |
| `/api/guest-sessions` | POST | ❌ Belum ada | Buat guest session sementara |
| `/api/webhooks/payment` | POST | ❓ Unknown | Webhook dari payment gateway |

---

## Data Flow

### Flow 1 — Buat Undangan (User Login)

```
User → /buat-undangan
  [Server Component]
  ├── supabase.auth.getUser() → isLoggedIn = true
  └── fetchActiveThemes() → query themes WHERE is_active = true

  [Client Component: BuatUndanganContent]
  Step 1: Pilih tema → set selectedTheme state
  Step 2: Isi form → live preview real-time (split screen)
  Step 3: Klik "Simpan ke Dashboard"
    └── POST /api/invitations
        body: { theme_id, bride_name, groom_name, event_date, ... }
        → INSERT ke tabel invitations
        → redirect /dashboard/invitations
```

### Flow 2 — Buat Undangan (Tamu / Belum Login)

```
User → /buat-undangan
  [Server Component]
  ├── supabase.auth.getUser() → isLoggedIn = false
  └── fetchActiveThemes()

  [Client Component: BuatUndanganContent]
  Step 1-2: sama seperti user login
  Step 3: Klik "Publikasikan Undangan Sekarang"
    └── POST /api/guest-sessions
        → INSERT ke tabel guest_sessions
        → set expires_at = NOW() + 25 menit
        → redirect /u/[generated-slug]
        → setelah 25 menit: prompt bayar Rp 49.000
```

### Flow 3 — Akses Undangan Publik

```
Tamu undangan → /u/[slug]
  [Server Component]
  └── query invitations WHERE slug = [slug] AND status IN ('active','paid')
      ├── jika tidak ditemukan → 404
      ├── jika ditemukan + status guest → cek expires_at
      │   ├── masih valid → tampil undangan
      │   └── expired → tampil halaman bayar
      └── jika status paid/active → tampil undangan permanent
```

### Flow 4 — Admin Kelola Tema

```
Admin → /dashboard/themes
  [Server Component]
  └── query themes (semua tema, bukan hanya is_active)

  Buat tema baru → /dashboard/themes/new
    [Server Action: createTheme()]
    ├── validasi slug (regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    ├── INSERT themes { name, slug, description, is_active, created_by }
    └── redirect /dashboard/themes/[slug]

  Preview tema → /dashboard/themes/[themeKey]/preview
    [Server Component]
    └── query themes WHERE slug = themeKey
        → render template tema dengan data sample
        → NO production guard
        → NO mock data
```

---

## Auth & Middleware

### Middleware (`middleware.ts`)

Middleware berjalan di edge runtime sebelum setiap request. Tanggung jawabnya:

1. Refresh Supabase session dari cookie
2. Redirect `/dashboard/*` ke `/login` jika tidak ada session
3. Redirect `/login` ke `/dashboard` jika sudah ada session
4. Bypass untuk: static files, `/_next/`, `/auth/callback`, public routes

```
Request masuk
  ├── Static asset? → bypass
  ├── /auth/callback? → bypass
  ├── /dashboard/* atau /owner/* ?
  │   ├── Ada session? → lanjut
  │   └── Tidak ada session? → redirect /login
  └── /login atau /register ?
      ├── Ada session? → redirect /dashboard
      └── Tidak ada session? → lanjut
```

### Supabase Client — Pilih yang Tepat

| Konteks | Import dari | Fungsi |
|---|---|---|
| Server Component / Route Handler | `@/lib/supabase/server` | `createServerComponentClient({ cookies })` |
| Client Component | `@/lib/supabase/client` | `createClientComponentClient()` |
| Server Action | `@/lib/supabase/server` | `createServerActionClient({ cookies })` |
| Middleware | `@supabase/auth-helpers-nextjs` | `createMiddlewareClient({ req, res })` |

---

## Component Pattern

### Server / Client Split

Setiap route page yang butuh interaktivitas mengikuti pola ini:

```
app/[route]/
├── page.tsx              ← Server Component: auth, data fetch, props
└── _components/
    └── [name]-content.tsx ← Client Component: state, event, UI
```

Contoh yang sudah ada:
- `/buat-undangan/page.tsx` → `_components/buat-undangan-content.tsx`
- `/dashboard/themes/page.tsx` → `_components/themes-list.tsx`

### Penamaan Komponen

| Jenis | Lokasi | Nama |
|---|---|---|
| Page-specific client | `app/[route]/_components/` | `[route]-content.tsx` |
| Shared UI | `components/ui/` | shadcn/ui components |
| Shared custom | `components/` | `invitation-card.tsx`, dll |

---

## Environment Variables

| Variable | Digunakan di | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | URL Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Anon key (publishable) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin operations |
| `NEXT_PUBLIC_APP_URL` | Client | Base URL untuk share link |
| `PAYMENT_GATEWAY_KEY` | Server only | Midtrans / Xendit secret |

---

## Keputusan Desain

### Mengapa `[themeKey]` bukan `[slug]`?
Parameter dinamis menggunakan nama `themeKey` karena nilai yang dipass adalah `slug` dari tema (bukan `id`). Nama `themeKey` lebih deskriptif tentang tujuan penggunaannya sebagai identifier URL.

### Mengapa buat-undangan di route public?
`/buat-undangan` accessible tanpa login agar konversi lebih tinggi — tamu bisa coba dulu, baru diminta register setelah selesai membuat undangan.

### Mengapa guest session 25 menit?
Cukup lama untuk share ke keluarga dan melihat hasilnya bersama, tapi cukup pendek untuk mendorong konversi ke pembayaran. Angka ini bisa dituning via DB config jika perlu.
