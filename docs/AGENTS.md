# AGENTS.md — undang-io

> **Baca dokumen ini PERTAMA sebelum menyentuh kode apapun.**
> Dokumen ini adalah kontrak antara AI agents dan codebase. Pelanggaran terhadap aturan di sini adalah sumber utama bug di project ini.

---

## Stack Overview

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| UI | shadcn/ui + Tailwind CSS |
| Deploy | Vercel |

---

## Aturan Kritikal — WAJIB DIIKUTI

### 1. Schema Database — Satu-satunya Referensi Kebenaran

**Selalu buka `docs/DATABASE_SCHEMA.md` sebelum menulis query apapun.**

Field yang BENAR di tabel `themes`:

```
name        ← BUKAN display_name
slug        ← BUKAN theme_key
```

Field yang BENAR di tabel `invitations`:

```
theme_id    ← UUID FK ke themes.id, BUKAN theme_key / theme_slug
```

> **Riwayat bug:** `display_name` dan `theme_key` adalah field lama yang sudah dihapus dari schema. Setiap kali field ini muncul di kode, itu adalah bug — hapus dan ganti dengan `name` dan `slug`.

---

### 2. Dynamic Route — Jangan Buat Folder Baru yang Duplikat

Struktur route `/dashboard/themes/` yang BENAR:

```
app/
└── dashboard/
    └── themes/
        ├── page.tsx                         ← list semua tema
        ├── new/
        │   └── page.tsx                     ← form buat tema baru
        └── [themeKey]/
            ├── page.tsx                     ← detail tema
            ├── assets/
            │   └── page.tsx
            └── preview/
                └── page.tsx
```

**DILARANG:**
- Membuat folder `[slug]` di level yang sama dengan `[themeKey]` — Next.js tidak boleh punya dua dynamic segments di level yang sama
- Membuat folder `preview` di luar `[themeKey]`
- Menambah route baru tanpa mengecek apakah dynamic segment sudah ada

---

### 3. Preview Route — Tidak Ada Production Guard

File `app/dashboard/themes/[themeKey]/preview/page.tsx` HARUS:
- Fetch data langsung dari Supabase
- **TIDAK** mengandung `if (process.env.NODE_ENV === "production") notFound()`
- **TIDAK** menggunakan mock/hardcoded data

---

### 4. Server vs Client Component

| File | Type | Boleh lakukan |
|---|---|---|
| `app/**/page.tsx` | Server Component | Auth check, Supabase data fetch, pass props ke client |
| `app/**/_components/*.tsx` | Client Component | useState, useEffect, event handler, UI interaktif |

**Aturan:**
- Server Component **tidak boleh** menggunakan `useState`, `useEffect`, event handler
- Client Component **tidak boleh** menggunakan `cookies()`, `headers()`, server-only Supabase client
- Gunakan `createServerComponentClient` di Server Component
- Gunakan `createClientComponentClient` di Client Component

Pola yang benar (contoh buat-undangan):

```
page.tsx (Server)
  └── fetch themes dari Supabase
  └── cek auth (isLoggedIn)
  └── render <BuatUndanganContent themes={themes} isLoggedIn={isLoggedIn} />

_components/buat-undangan-content.tsx (Client)
  └── wizard state management
  └── form interaksi
  └── live preview
```

---

### 5. Redirect Setelah Create Tema

Setelah `createTheme` berhasil, redirect menggunakan:

```typescript
redirect(`/dashboard/themes/${res.data.slug}`)
// BUKAN: res.data.theme_key
// BUKAN: res.data.display_name
```

---

### 6. TypeScript Types

Selalu gunakan tipe yang sudah didefinisikan. Jangan buat tipe baru yang duplikat.

Tipe untuk data dari Supabase themes:

```typescript
// Tipe BENAR — sesuai schema
type SupabaseThemeRow = {
  id: string
  name: string          // BUKAN display_name
  slug: string          // BUKAN theme_key
  description: string | null
  thumbnail_url: string | null
  is_active: boolean
  created_at: string
  created_by: string | null
}
```

Field yang **tidak ada** di `SupabaseThemeRow` dan TIDAK BOLEH diakses:
- `display_name`
- `theme_key`
- `color_primary`
- `color_accent`
- `color_text`

---

### 7. Slug Validation

Slug tema harus divalidasi sebelum INSERT:

```typescript
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
if (!slugRegex.test(slug)) {
  return { error: "Slug hanya boleh huruf kecil, angka, dan tanda hubung" }
}
```

---

## Checklist Sebelum Membuat File Baru

Sebelum membuat file baru atau memodifikasi kode yang ada, jawab:

- [ ] Apakah field database yang aku gunakan sesuai dengan `docs/DATABASE_SCHEMA.md`?
- [ ] Apakah ada dynamic route `[themeKey]` yang sudah ada? (jangan buat `[slug]` duplikat)
- [ ] Apakah komponen ini Server atau Client? Apakah sudah menggunakan client Supabase yang tepat?
- [ ] Apakah ada guard `NODE_ENV === "production"` yang tidak perlu?
- [ ] Apakah TypeScript types yang aku gunakan sesuai dengan schema aktual?

---

## Flow Utama Aplikasi

### Alur Buat Undangan

```
/buat-undangan
  Step 1: Pilih tema (dari Supabase, is_active = true)
  Step 2: Isi data pengantin + acara (live preview di kanan)
  Step 3: Konfirmasi + aksi berbeda berdasarkan auth state
    ├── User login  → POST /api/invitations → simpan permanen → redirect dashboard
    └── User tamu   → guest session 25 menit → prompt bayar Rp 49.000 setelah habis
```

### Alur Admin Theme

```
/dashboard/themes
  ├── List semua tema milik user
  ├── Tombol "Buat Tema Baru" → /dashboard/themes/new
  ├── Setiap kartu tema punya tombol:
  │   ├── Edit → /dashboard/themes/[themeKey]
  │   ├── Assets → /dashboard/themes/[themeKey]/assets
  │   └── Preview (ikon Eye) → /dashboard/themes/[themeKey]/preview (tab baru)
  └── Preview fetch data langsung dari Supabase, no mock
```

---

## Endpoint API yang Ada dan Belum Ada

| Endpoint | Status | Keterangan |
|---|---|---|
| `POST /api/invitations` | ❌ Belum ada | Simpan undangan user login |
| `POST /api/guest-sessions` | ❌ Belum ada | Buat guest session 25 menit |
| `GET /api/themes` | Tidak perlu | Gunakan Server Component langsung |

---

## Riwayat Bug yang Sudah Diperbaiki

Dokumentasi ini ada agar bug yang sama tidak terulang.

| Bug | Root Cause | Fix |
|---|---|---|
| INSERT themes gagal | `display_name`/`theme_key` tidak ada di schema | Ganti ke `name`/`slug` |
| Assets page 404 | `.eq('theme_key', ...)` | Ganti ke `.eq('slug', ...)` |
| Preview selalu 404 di Vercel | Guard `NODE_ENV === "production"` | Hapus guard, fetch dari Supabase |
| Build error dynamic route | Folder `[slug]` dibuat duplikat di samping `[themeKey]` | Hapus `[slug]`, pakai `[themeKey]` konsisten |
| Kartu tema kosong | `theme.display_name` tidak ada di DB | Ganti ke `theme.name` |
| Redirect setelah create gagal | `res.data.theme_key` undefined | Ganti ke `res.data.slug` |
| Preview akses field tidak ada | `themeRow.color_primary` etc tidak ada di `SupabaseThemeRow` | Hapus akses field yang tidak ada |

---

## Konvensi Penamaan

| Hal | Konvensi | Contoh |
|---|---|---|
| Komponen client di dalam route | `_components/nama-komponen.tsx` | `_components/buat-undangan-content.tsx` |
| Server actions | `actions.ts` di folder route | `app/dashboard/themes/actions.ts` |
| Tipe Supabase | `Supabase` prefix | `SupabaseThemeRow`, `SupabaseInvitationRow` |
| Dynamic segment | Camel case | `[themeKey]`, `[invitationId]` |
