---
name: migrating-supabase-schema
description: Creates safe Supabase migration SQL files for undang-io. Use when the user says "buat migration", "tambah tabel", "update schema", "bikin SQL", "ada tabel baru", "tambah kolom", "buat RLS", "setup database", or when integrating new features that require new tables or schema changes. Always creates NEW migration files, never modifies existing ones. Always includes RLS policies.
---

# Migrating Supabase Schema — undang-io

> Gunakan skill ini setiap kali ada kebutuhan perubahan database.
> Baca SCHEMA_REF.md sebelum membuat migration baru untuk menghindari duplikasi.

---

## Prinsip Wajib

1. **JANGAN edit migration yang sudah ada** — selalu buat file baru
2. **SELALU sertakan RLS policy** di setiap tabel baru
3. **JANGAN disable RLS** dalam kondisi apapun
4. **JANGAN jalankan SQL langsung** — simpan file, serahkan ke user
5. **Cek SCHEMA_REF.md** sebelum buat tabel baru agar tidak duplikasi
6. **Gunakan `IF NOT EXISTS`** di semua CREATE TABLE dan CREATE INDEX
7. **Sertakan rollback** di setiap migration

---

## Lokasi File Migration

```
supabase/migrations/
```

## Format Nama File

```
YYYYMMDDHHMMSS_nama_singkat_snake_case.sql
```

Contoh:
```
20260314170000_create_themes_table.sql
20260316000000_create_guest_sessions_table.sql
20260316000100_create_transactions_table.sql
```

---

## Tabel Existing di undang-io (JANGAN dibuat ulang)

Baca [SCHEMA_REF.md](SCHEMA_REF.md) untuk daftar lengkap.
Tabel utama yang sudah ada:
- `profiles` — data user
- `invitations` — undangan permanen (sudah bayar)
- `invitation_details` / `invitation_content` — detail konten undangan
- `guest_sessions` — undangan sementara (lazy registration)
- `themes` — master data tema
- `theme_asset_slots` — slot aset per tema
- `invitation_theme_preferences` — preferensi tema per undangan

---

## Template Migration Standar

```sql
-- ============================================================
-- Migration: YYYYMMDDHHMMSS_nama_fitur.sql
-- Dibuat   : DD MMMM YYYY
-- Tujuan   : [jelaskan tujuan migration secara singkat]
-- Koneksi  : [sebutkan relasi ke tabel lain jika ada]
-- ============================================================

CREATE TABLE IF NOT EXISTS nama_tabel (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'draft'
                              CHECK (status IN ('draft', 'active', 'archived')),
  settings        JSONB       NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_nama_tabel_updated_at
  BEFORE UPDATE ON nama_tabel
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE nama_tabel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User dapat melihat data sendiri"
ON nama_tabel FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "User dapat membuat data sendiri"
ON nama_tabel FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "User dapat mengubah data sendiri"
ON nama_tabel FOR UPDATE
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "User dapat menghapus data sendiri"
ON nama_tabel FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Admin dapat akses semua data"
ON nama_tabel FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Index
CREATE INDEX IF NOT EXISTS idx_nama_tabel_user_id ON nama_tabel(user_id);

-- Rollback
-- DROP TABLE IF EXISTS nama_tabel CASCADE;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
```

---

## Catatan Khusus guest_sessions

Tabel `guest_sessions` menggunakan **admin/service role client** untuk bypass RLS karena saat INSERT, `user_id` masih NULL. Pastikan `SUPABASE_SERVICE_ROLE_KEY` ada di environment variables Vercel dan `.env.local`.

## Catatan Khusus transactions

Tabel `transactions` diisi oleh webhook Midtrans (`/api/payment/notification`) menggunakan admin client — bukan user client. Pastikan webhook handler selalu verifikasi Midtrans signature sebelum INSERT.
