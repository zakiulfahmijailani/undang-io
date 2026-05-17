# DATABASE_SCHEMA.md

> **Single Source of Truth** untuk seluruh skema database Supabase undang-io.  
> Setiap AI agent, developer, atau migration file WAJIB merujuk ke dokumen ini.  
> Jangan pernah menebak nama kolom — cek di sini dulu.

---

## Daftar Isi

1. [Ringkasan Tabel](#1-ringkasan-tabel)
2. [Enum Types](#2-enum-types)
3. [Tabel: `profiles`](#3-tabel-profiles)
4. [Tabel: `themes`](#4-tabel-themes)
5. [Tabel: `theme_assets`](#5-tabel-theme_assets)
6. [Tabel: `invitations`](#6-tabel-invitations)
7. [Tabel: `guest_sessions`](#7-tabel-guest_sessions)
8. [Tabel: `rsvp_messages`](#8-tabel-rsvp_messages)
9. [Tabel: `payments`](#9-tabel-payments)
10. [Storage Buckets](#10-storage-buckets)
11. [RLS Policy Summary](#11-rls-policy-summary)
12. [Indexes](#12-indexes)
13. [Naming Conventions](#13-naming-conventions)
14. [Catatan Migrasi & Inkonsistensi Historis](#14-catatan-migrasi--inkonsistensi-historis)

---

## 1. Ringkasan Tabel

| Tabel | Deskripsi | RLS |
|---|---|---|
| `profiles` | Profil user (extend `auth.users`) | ✅ |
| `themes` | Master data tema undangan | ✅ |
| `theme_assets` | Aset visual per slot per tema | ✅ |
| `invitations` | Data undangan milik user | ✅ |
| `guest_sessions` | Sesi tamu sementara (tanpa login) | ✅ |
| `rsvp_messages` | Pesan & konfirmasi kehadiran tamu | ✅ |
| `payments` | Riwayat pembayaran per undangan | ✅ |

---

## 2. Enum Types

```sql
-- Role pengguna
CREATE TYPE user_role AS ENUM ('user', 'admin', 'owner');

-- Status undangan
CREATE TYPE invitation_status AS ENUM (
  'draft',              -- Belum dipublikasikan
  'active_guest',       -- Aktif sebagai guest session (15 menit)
  'active_registered',  -- Aktif setelah login/daftar (25 menit)
  'active_paid',        -- Aktif permanen setelah bayar
  'expired'             -- Sudah kedaluwarsa
);

-- Jenis aset tema (16 slot)
CREATE TYPE asset_kind AS ENUM (
  'cover_scene',         -- 01: Full scene background cover (1200x1800)
  'left_panel_alt',      -- 02: Ilustrasi panel kiri (800x1200)
  'corner_tl',           -- 03: Ornamen pojok top-left (400x400, transparan)
  'corner_tr',           -- 04: Ornamen pojok top-right (400x400, transparan)
  'corner_bl',           -- 05: Ornamen pojok bottom-left (400x400, transparan)
  'corner_br',           -- 06: Ornamen pojok bottom-right (400x400, transparan)
  'divider_main',        -- 07: Divider utama (1200x120, transparan)
  'divider_alt',         -- 08: Divider alternatif (1200x120, transparan)
  'frame_couple',        -- 09: Frame foto pengantin (500x600, transparan)
  'pattern_main',        -- 10: Pola repeating utama (400x400, transparan)
  'pattern_alt',         -- 11: Pola repeating alternatif (400x400, transparan)
  'icon_venue',          -- 12: Ikon venue (200x200, transparan)
  'illustration_iconic', -- 13: Ilustrasi ikonik daerah (700x400, transparan)
  'banner_top',          -- 14: Banner dekoratif atas (1200x200, transparan)
  'footer_scene',        -- 15: Ilustrasi footer (1200x600)
  'music'                -- 16: File audio .mp3 background musik
);

-- Status pembayaran
CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

-- Kehadiran RSVP
CREATE TYPE rsvp_attendance AS ENUM (
  'hadir',
  'tidak_hadir',
  'masih_ragu'
);
```

---

## 3. Tabel: `profiles`

Extend tabel `auth.users` Supabase. Dibuat otomatis via trigger saat user baru mendaftar.

```sql
CREATE TABLE public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  role        user_role   NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Kolom

| Kolom | Tipe | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | UUID | NO | — | FK ke `auth.users(id)`, PK |
| `full_name` | TEXT | YES | NULL | Nama lengkap |
| `avatar_url` | TEXT | YES | NULL | URL foto profil |
| `phone` | TEXT | YES | NULL | Nomor HP |
| `role` | user_role | NO | `'user'` | Role: `user`, `admin`, `owner` |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Auto-update via trigger |

### RLS Policies

| Policy | Operation | Who | Condition |
|---|---|---|---|
| `profiles_select_own` | SELECT | authenticated | `auth.uid() = id` |
| `profiles_update_own` | UPDATE | authenticated | `auth.uid() = id` |
| `admin_full_access_profiles` | ALL | authenticated | role = `admin` atau `owner` |

### Trigger

```sql
-- Otomatis buat profile saat user baru register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. Tabel: `themes`

Master data tema undangan. Dikelola oleh admin.

> ⚠️ **PENTING:** Nama kolom kanonik adalah `name` dan `slug`.  
> Kolom `display_name` dan `theme_key` dari migration lama sudah **DEPRECATED** — jangan digunakan.

```sql
CREATE TABLE public.themes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT        NOT NULL,
  slug              TEXT        NOT NULL UNIQUE,
  description       TEXT,
  cultural_category TEXT        NOT NULL DEFAULT 'modern',
  is_active         BOOLEAN     NOT NULL DEFAULT false,
  is_published      BOOLEAN     NOT NULL DEFAULT false,
  is_premium        BOOLEAN     NOT NULL DEFAULT false,
  thumbnail_url     TEXT,
  preview_url       TEXT,
  music_url         TEXT,
  section_config    JSONB       NOT NULL DEFAULT '{
    "show_foto_cover": true,
    "show_data_mempelai": true,
    "show_ayat_quote": true,
    "show_kisah_cinta": true,
    "show_acara": true,
    "show_galeri_foto": true,
    "show_amplop_digital": true,
    "show_musik": true
  }'::jsonb,
  config            JSONB       NOT NULL DEFAULT '{}'::jsonb,
  tags              TEXT[]      NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Kolom

| Kolom | Tipe | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK |
| `name` | TEXT | NO | — | Nama tampilan, misal: `"Vintage Botanica"` |
| `slug` | TEXT | NO | — | URL-friendly unique key, misal: `"vintage-botanica"` |
| `description` | TEXT | YES | NULL | Deskripsi tema |
| `cultural_category` | TEXT | NO | `'modern'` | Kategori: `modern`, `javanese`, `sundanese`, dll |
| `is_active` | BOOLEAN | NO | `false` | Apakah tampil di wizard pembuatan undangan |
| `is_published` | BOOLEAN | NO | `false` | Apakah sudah dipublikasikan ke publik |
| `is_premium` | BOOLEAN | NO | `false` | Tema berbayar atau tidak |
| `thumbnail_url` | TEXT | YES | NULL | URL thumbnail kartu tema |
| `preview_url` | TEXT | YES | NULL | URL preview full |
| `music_url` | TEXT | YES | NULL | URL musik default tema |
| `section_config` | JSONB | NO | (lihat DDL) | Konfigurasi section yang ditampilkan |
| `config` | JSONB | NO | `{}` | Konfigurasi teknis (parallax, animasi, dll) |
| `tags` | TEXT[] | NO | `{}` | Tag untuk filter |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | Auto-update via trigger |

### RLS Policies

| Policy | Operation | Who | Condition |
|---|---|---|---|
| `themes_public_read` | SELECT | anon, authenticated | `is_active = true AND is_published = true` |
| `themes_auth_read_all` | SELECT | authenticated | `true` (semua tema, untuk dashboard admin) |
| `themes_admin_write` | ALL | authenticated | role = `admin` atau `owner` di `profiles` |

---

## 5. Tabel: `theme_assets`

Aset visual per slot untuk setiap tema.

```sql
CREATE TABLE public.theme_assets (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id        UUID        NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  slot            asset_kind  NOT NULL,
  file_url        TEXT,
  storage_path    TEXT,
  file_size_bytes BIGINT,
  mime_type       TEXT,
  width_px        INT,
  height_px       INT,
  is_transparent  BOOLEAN     NOT NULL DEFAULT false,
  alt_text        TEXT,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  uploaded_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(theme_id, slot)
);
```

### Kolom

| Kolom | Tipe | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK |
| `theme_id` | UUID | NO | — | FK ke `themes(id)` |
| `slot` | asset_kind | NO | — | Slot aset (lihat enum `asset_kind`) |
| `file_url` | TEXT | YES | NULL | Public URL dari Supabase Storage |
| `storage_path` | TEXT | YES | NULL | Path di bucket, misal: `themes/vintage-botanica/cover_scene.png` |
| `file_size_bytes` | BIGINT | YES | NULL | Ukuran file dalam bytes |
| `mime_type` | TEXT | YES | NULL | Misal: `image/png`, `audio/mpeg` |
| `width_px` | INT | YES | NULL | Lebar aset dalam pixel |
| `height_px` | INT | YES | NULL | Tinggi aset dalam pixel |
| `is_transparent` | BOOLEAN | NO | `false` | Apakah aset PNG transparan |
| `alt_text` | TEXT | YES | NULL | Alt text untuk aksesibilitas |
| `uploaded_at` | TIMESTAMPTZ | NO | `now()` | |
| `uploaded_by` | UUID | YES | NULL | FK ke `auth.users(id)` |

### RLS Policies

| Policy | Operation | Who | Condition |
|---|---|---|---|
| `theme_assets_public_read` | SELECT | anon, authenticated | `true` |
| `theme_assets_admin_write` | ALL | authenticated | role = `admin` atau `owner` |

---

## 6. Tabel: `invitations`

Data undangan yang dibuat oleh user.

```sql
CREATE TABLE public.invitations (
  id                  UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID              REFERENCES auth.users(id) ON DELETE SET NULL,
  theme_id            UUID              REFERENCES public.themes(id) ON DELETE SET NULL,
  slug                TEXT              NOT NULL UNIQUE,
  status              invitation_status NOT NULL DEFAULT 'draft',

  -- Data mempelai
  groom_name          TEXT              NOT NULL DEFAULT '',
  bride_name          TEXT              NOT NULL DEFAULT '',
  groom_full_name     TEXT,
  bride_full_name     TEXT,
  groom_father        TEXT,
  groom_mother        TEXT,
  bride_father        TEXT,
  bride_mother        TEXT,

  -- Data acara
  akad_date           TIMESTAMPTZ,
  akad_location       TEXT,
  akad_address        TEXT,
  resepsi_date        TIMESTAMPTZ,
  resepsi_location    TEXT,
  resepsi_address     TEXT,

  -- Konten undangan
  love_story          TEXT,
  ayat_quote          TEXT,
  custom_message      TEXT,

  -- Foto
  cover_photo_url     TEXT,
  couple_photo_url    TEXT,
  gallery_urls        TEXT[]            NOT NULL DEFAULT '{}',

  -- Amplop digital
  bank_name           TEXT,
  bank_account_number TEXT,
  bank_account_name   TEXT,
  ewallet_type        TEXT,
  ewallet_number      TEXT,

  -- Musik
  music_url           TEXT,
  use_theme_music     BOOLEAN           NOT NULL DEFAULT true,

  -- Kontrol waktu
  is_trial            BOOLEAN           NOT NULL DEFAULT false,
  expires_at          TIMESTAMPTZ,

  -- Statistik
  view_count          INT               NOT NULL DEFAULT 0,

  created_at          TIMESTAMPTZ       NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ       NOT NULL DEFAULT now()
);
```

### Kolom Penting

| Kolom | Tipe | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK |
| `user_id` | UUID | YES | NULL | NULL jika dibuat oleh tamu (guest session) |
| `theme_id` | UUID | YES | NULL | FK ke `themes(id)` |
| `slug` | TEXT | NO | — | URL unik undangan, misal: `"budi-siti-2026"` |
| `status` | invitation_status | NO | `'draft'` | Lihat enum `invitation_status` |
| `is_trial` | BOOLEAN | NO | `false` | `true` jika sedang dalam periode trial |
| `expires_at` | TIMESTAMPTZ | YES | NULL | Waktu kadaluarsa. NULL = tidak pernah kadaluarsa (paid) |
| `view_count` | INT | NO | `0` | Counter kunjungan halaman undangan |

### Logic Status & `expires_at`

| Status | `user_id` | `is_trial` | `expires_at` | Durasi |
|---|---|---|---|---|
| `active_guest` | NULL | `true` | `created_at + 15 menit` | 15 menit |
| `active_registered` | (ada) | `true` | `created_at + 25 menit` | 25 menit |
| `active_paid` | (ada) | `false` | NULL | Selamanya |
| `expired` | any | any | (sudah lewat) | — |

### RLS Policies

| Policy | Operation | Who | Condition |
|---|---|---|---|
| `invitations_public_read_active` | SELECT | anon, authenticated | `status IN ('active_guest', 'active_registered', 'active_paid')` |
| `invitations_owner_all` | ALL | authenticated | `auth.uid() = user_id` |
| `invitations_guest_insert` | INSERT | anon | `user_id IS NULL` |
| `invitations_admin_all` | ALL | authenticated | role = `admin` atau `owner` |

---

## 7. Tabel: `guest_sessions`

Menyimpan sesi tamu sementara untuk undangan yang dibuat tanpa login.

```sql
CREATE TABLE public.guest_sessions (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token   UUID        NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  invitation_id   UUID        REFERENCES public.invitations(id) ON DELETE CASCADE,
  expires_at      TIMESTAMPTZ NOT NULL,
  invitation_data JSONB       NOT NULL DEFAULT '{}'::jsonb,
  converted_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Kolom

| Kolom | Tipe | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK |
| `session_token` | UUID | NO | `gen_random_uuid()` | Token unik untuk identifikasi sesi di cookie |
| `invitation_id` | UUID | YES | NULL | FK ke `invitations(id)` jika sudah tersimpan |
| `expires_at` | TIMESTAMPTZ | NO | — | `created_at + 15 menit` untuk guest |
| `invitation_data` | JSONB | NO | `{}` | Snapshot data form undangan (backup sementara) |
| `converted_at` | TIMESTAMPTZ | YES | NULL | Diisi saat tamu mendaftar/login (konversi) |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |

### RLS Policies

| Policy | Operation | Who | Condition |
|---|---|---|---|
| `guest_sessions_insert_public` | INSERT | anon, authenticated | `true` |
| `guest_sessions_select_by_token` | SELECT | anon, authenticated | `true` (filter di app layer via `session_token`) |
| `guest_sessions_admin_all` | ALL | authenticated | role = `admin` atau `owner` |

---

## 8. Tabel: `rsvp_messages`

Pesan dan konfirmasi kehadiran dari tamu undangan.

```sql
CREATE TABLE public.rsvp_messages (
  id            UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID           NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name          TEXT           NOT NULL,
  message       TEXT           NOT NULL,
  attendance    rsvp_attendance NOT NULL,
  created_at    TIMESTAMPTZ    NOT NULL DEFAULT now()
);
```

> ⚠️ **Perubahan dari migration lama:** Kolom `invitation_id` sekarang bertipe `UUID` (FK ke `invitations.id`),  
> bukan `TEXT`. Migration lama menggunakan `TEXT` — ini sudah dikoreksi di versi kanonik ini.

### Kolom

| Kolom | Tipe | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK |
| `invitation_id` | UUID | NO | — | FK ke `invitations(id)` |
| `name` | TEXT | NO | — | Nama tamu undangan |
| `message` | TEXT | NO | — | Pesan ucapan |
| `attendance` | rsvp_attendance | NO | — | `hadir`, `tidak_hadir`, atau `masih_ragu` |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |

### RLS Policies

| Policy | Operation | Who | Condition |
|---|---|---|---|
| `rsvp_public_read` | SELECT | anon, authenticated | `true` |
| `rsvp_public_insert` | INSERT | anon, authenticated | `true` |
| `rsvp_owner_delete` | DELETE | authenticated | Invitation dimiliki `auth.uid()` |

---

## 9. Tabel: `payments`

Riwayat transaksi pembayaran per undangan.

```sql
CREATE TABLE public.payments (
  id                  UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id       UUID           NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  user_id             UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount              INT            NOT NULL DEFAULT 49000,
  currency            TEXT           NOT NULL DEFAULT 'IDR',
  status              payment_status NOT NULL DEFAULT 'pending',
  payment_provider    TEXT,
  provider_order_id   TEXT           UNIQUE,
  provider_payment_id TEXT,
  paid_at             TIMESTAMPTZ,
  metadata            JSONB          NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ    NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ    NOT NULL DEFAULT now()
);
```

### Kolom

| Kolom | Tipe | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | UUID | NO | `gen_random_uuid()` | PK |
| `invitation_id` | UUID | NO | — | FK ke `invitations(id)` |
| `user_id` | UUID | NO | — | FK ke `auth.users(id)` |
| `amount` | INT | NO | `49000` | Nominal dalam Rupiah (IDR) |
| `currency` | TEXT | NO | `'IDR'` | Mata uang |
| `status` | payment_status | NO | `'pending'` | `pending`, `paid`, `failed`, `refunded` |
| `payment_provider` | TEXT | YES | NULL | Misal: `midtrans`, `xendit` |
| `provider_order_id` | TEXT | YES | NULL | Order ID dari payment provider |
| `provider_payment_id` | TEXT | YES | NULL | Payment ID dari payment provider |
| `paid_at` | TIMESTAMPTZ | YES | NULL | Waktu pembayaran berhasil |
| `metadata` | JSONB | NO | `{}` | Data tambahan dari payment provider (webhook) |
| `created_at` | TIMESTAMPTZ | NO | `now()` | |
| `updated_at` | TIMESTAMPTZ | NO | `now()` | |

### Logic Setelah Pembayaran

Saat `status` berubah menjadi `paid` (via webhook):
1. Update `payments.paid_at = now()`
2. Update `invitations.status = 'active_paid'`
3. Update `invitations.is_trial = false`
4. Update `invitations.expires_at = NULL`

### RLS Policies

| Policy | Operation | Who | Condition |
|---|---|---|---|
| `payments_owner_read` | SELECT | authenticated | `auth.uid() = user_id` |
| `payments_owner_insert` | INSERT | authenticated | `auth.uid() = user_id` |
| `payments_admin_all` | ALL | authenticated | role = `admin` atau `owner` |

---

## 10. Storage Buckets

| Bucket ID | Public | Batas Ukuran | MIME Types Diizinkan | Keterangan |
|---|---|---|---|---|
| `theme-assets` | ✅ | 10 MB | `image/png`, `image/webp`, `image/svg+xml`, `audio/mpeg` | Aset visual & audio tema |
| `invitation-media` | ❌ | 5 MB | `image/jpeg`, `image/png`, `image/webp` | Foto cover, couple, gallery per undangan |

### Storage Path Conventions

```
theme-assets/
  themes/{slug}/{slot}.{ext}
  # Contoh: themes/vintage-botanica/cover_scene.png

invitation-media/
  {user_id}/{invitation_id}/cover.{ext}
  {user_id}/{invitation_id}/couple.{ext}
  {user_id}/{invitation_id}/gallery/{index}.{ext}
```

---

## 11. RLS Policy Summary

### Cara Cek Role di RLS

```sql
-- Cek role via profiles table (RECOMMENDED)
EXISTS (
  SELECT 1 FROM public.profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role IN ('admin', 'owner')
)

-- JANGAN gunakan raw_user_meta_data untuk role check
-- raw_user_meta_data->>'role' tidak reliable dan bisa dimanipulasi client
```

### Matriks Akses

| Tabel | anon | user (own) | admin | owner |
|---|---|---|---|---|
| `profiles` | ❌ | R/U | R/U/D all | R/U/D all |
| `themes` | R (active+published) | R (all) | CRUD | CRUD |
| `theme_assets` | R | R | CRUD | CRUD |
| `invitations` | R (active only) | CRUD (own) | CRUD all | CRUD all |
| `guest_sessions` | R/I | R/I | CRUD | CRUD |
| `rsvp_messages` | R/I | R/I/D (own invitation) | CRUD | CRUD |
| `payments` | ❌ | R/I (own) | CRUD | CRUD |

---

## 12. Indexes

```sql
-- themes
CREATE INDEX idx_themes_slug ON public.themes (slug);
CREATE INDEX idx_themes_active_published ON public.themes (is_active, is_published);

-- theme_assets
CREATE INDEX idx_theme_assets_theme_id ON public.theme_assets (theme_id);
CREATE INDEX idx_theme_assets_slot ON public.theme_assets (slot);

-- invitations
CREATE INDEX idx_invitations_slug ON public.invitations (slug);
CREATE INDEX idx_invitations_user_id ON public.invitations (user_id);
CREATE INDEX idx_invitations_status ON public.invitations (status);
CREATE INDEX idx_invitations_expires_at ON public.invitations (expires_at) WHERE expires_at IS NOT NULL;

-- guest_sessions
CREATE INDEX idx_guest_sessions_token ON public.guest_sessions (session_token);
CREATE INDEX idx_guest_sessions_expires ON public.guest_sessions (expires_at);

-- rsvp_messages
CREATE INDEX idx_rsvp_invitation_id ON public.rsvp_messages (invitation_id, created_at DESC);

-- payments
CREATE INDEX idx_payments_invitation_id ON public.payments (invitation_id);
CREATE INDEX idx_payments_user_id ON public.payments (user_id);
CREATE INDEX idx_payments_status ON public.payments (status);
```

---

## 13. Naming Conventions

| Hal | Konvensi | Contoh |
|---|---|---|
| Nama tabel | `snake_case`, plural | `guest_sessions`, `rsvp_messages` |
| Nama kolom | `snake_case` | `created_at`, `theme_id` |
| Primary key | selalu `id UUID` | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign key | `{table_singular}_id` | `theme_id`, `user_id`, `invitation_id` |
| Boolean | prefix `is_` atau `use_` | `is_active`, `is_trial`, `use_theme_music` |
| Timestamp | suffix `_at` | `created_at`, `expires_at`, `paid_at` |
| Enum type | `snake_case` | `invitation_status`, `user_role` |
| Index | `idx_{table}_{column}` | `idx_invitations_slug` |
| RLS policy | `"{table}_{action}_{who}"` | `"invitations_owner_all"` |

---

## 14. Catatan Migrasi & Inkonsistensi Historis

Ini adalah daftar inkonsistensi yang ditemukan di migration files lama. Jangan ulangi kesalahan ini.

| Migration File | Masalah | Resolusi Kanonik |
|---|---|---|
| `20260405131518_admin_asset_dashboard.sql` | Menggunakan `theme_key` dan `display_name` sebagai nama kolom | Gunakan `slug` dan `name` |
| `20260405131518_admin_asset_dashboard.sql` | Cek role via `raw_user_meta_data->>'role'` | Gunakan `profiles.role` |
| `20260313190000_create_theme_tables.sql` | Membuat `themes` table berbeda dari migration `20260318` | Versi kanonik ada di dokumen ini |
| `20260330000000_create_rsvp_messages.sql` | `invitation_id` bertipe `TEXT` bukan `UUID` | Gunakan `UUID REFERENCES invitations(id)` |
| `20260315190000_update_guest_sessions.sql` | Kolom `slug` dan `theme_id TEXT` di `guest_sessions` tidak relevan | Simpan di `invitation_data JSONB` saja |

> **Untuk rekonstruksi:** Buat satu migration baru yang DROP semua tabel lama dan buat ulang sesuai schema kanonik di dokumen ini. Jangan coba patch migration yang sudah ada.
