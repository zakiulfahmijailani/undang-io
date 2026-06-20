# Supabase Row Level Security (RLS) Policy

## Overview
Semua tabel di schema `public` menggunakan Row Level Security.
User hanya bisa mengakses data miliknya sendiri.
Guest/anon hanya bisa mengakses undangan yang berstatus `active` atau `trial` yang belum expired.

***

## Status RLS Per Tabel

| Tabel | RLS | Keterangan |
|---|---|---|
| analytics_events | ✅ Aktif | Insert terbuka, SELECT hanya owner |
| classic_themes | ✅ Aktif | Public baca published, admin full access |
| guest_sessions | ✅ Aktif | Insert terbuka, SELECT hanya non-expired |
| guests | ✅ Aktif | Owner undangan full access |
| invitation_photos | ✅ Aktif | Owner CRUD, public baca dari undangan visible |
| invitation_theme_preferences | ✅ Aktif | Owner + admin full access |
| invitations | ✅ Aktif | Owner CRUD, public baca active/trial |
| messages | ✅ Aktif | Siapa saja bisa kirim ke undangan visible, owner bisa delete |
| payments | ✅ Aktif | Owner only |
| profiles | ✅ Aktif | User hanya bisa akses profil sendiri |
| rsvp | ✅ Aktif | Siapa saja bisa submit ke undangan visible, owner bisa baca |
| rsvp_messages | ✅ Aktif | Siapa saja bisa insert/read dari undangan visible, owner bisa delete |
| theme_asset_slots | ✅ Aktif | Public baca, admin full access |
| theme_assets | ✅ Aktif | Authenticated CRUD milik sendiri, admin full access |
| themes | ✅ Aktif | Public baca active, admin full access |

***

## Policy Detail Per Tabel

### `invitations`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| owner can view all own invitations | public | SELECT | `auth.uid() = user_id` |
| authenticated user can insert | public | INSERT | `auth.uid() = user_id` |
| owner can update own invitation | public | UPDATE | `auth.uid() = user_id` |
| owner can delete unpaid invitation | public | DELETE | `auth.uid() = user_id AND is_paid = false` |
| public can view active invitations | public | SELECT | `status = 'active'` |
| public can view trial invitations | public | SELECT | `status = 'trial' AND trial_expires_at > now()` |

### `guests`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| owner can view guest list | public | SELECT | invitation milik auth.uid() |
| owner can insert guests | public | INSERT | invitation milik auth.uid() |
| owner can update guests | public | UPDATE | invitation milik auth.uid() |
| owner can delete guests | public | DELETE | invitation milik auth.uid() |

### `rsvp`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| owner can view all rsvp | public | SELECT | invitation milik auth.uid() |
| anyone can submit rsvp | public | INSERT | undangan active/trial |

### `rsvp_messages`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| public can read from visible invitations | public | SELECT | undangan active/trial atau milik auth.uid() |
| anyone can insert to visible invitations | public | INSERT | undangan active/trial |
| owner can delete | public | DELETE | invitation milik auth.uid() |

> ⚠️ Catatan: `invitation_id` di tabel ini bertipe `text`, bukan `uuid`.
> Policy menggunakan cast eksplisit `i.id::text` untuk join dengan tabel `invitations`.

### `messages`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| public can view messages on visible invitations | public | SELECT | undangan active/trial atau milik auth.uid() |
| anyone can send message to visible invitations | public | INSERT | undangan active/trial |
| owner can delete messages | public | DELETE | invitation milik auth.uid() |

### `profiles`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| user can read own profile | public | SELECT | `auth.uid() = id` |
| user can update own profile | public | UPDATE | `auth.uid() = id` |

### `payments`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| user can view own payments | public | SELECT | `auth.uid() = user_id` |
| user can insert own payment | public | INSERT | `auth.uid() = user_id` AND invitation milik sendiri |

### `guest_sessions`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| anyone can insert | public | INSERT | terbuka (validasi di app layer) |
| anyone can read non-expired | public | SELECT | `expires_at > now()` |
| update own | public | UPDATE | `auth.uid() = user_id` |

### `themes` & `classic_themes`
| Policy | Role | Operasi | Kondisi |
|---|---|---|---|
| public can read active themes | public | SELECT | `status = 'active'` atau authenticated |
| admin full access | authenticated | ALL | `profiles.role IN ('admin', 'owner')` |

***

## Aturan untuk Developer

### Wajib saat menambah tabel baru
1. Aktifkan RLS segera setelah tabel dibuat:
   ```sql
   ALTER TABLE nama_tabel ENABLE ROW LEVEL SECURITY;
   ```
2. Tentukan siapa yang boleh SELECT, INSERT, UPDATE, DELETE
3. Default: tolak semua akses (RLS enabled tanpa policy = tidak ada yang bisa akses)
4. Tambahkan dokumentasi di file ini

### Pattern yang digunakan
```sql
-- Owner access pattern
USING (auth.uid() = user_id)

-- Owner via relasi (foreign key ke invitations)
USING (
  EXISTS (
    SELECT 1 FROM invitations i
    WHERE i.id = tabel.invitation_id
    AND i.user_id = auth.uid()
  )
)

-- Public access untuk konten yang sudah dipublish
USING (
  status = 'active'
  OR (status = 'trial' AND trial_expires_at > now())
)
```

### Cara test policy di Supabase SQL Editor
```sql
-- Cek semua tabel punya RLS aktif
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Cek semua policy yang aktif
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- Cek tabel tanpa policy (bahaya!)
SELECT t.tablename
FROM pg_tables t
LEFT JOIN pg_policies p
  ON t.tablename = p.tablename
  AND t.schemaname = p.schemaname
WHERE t.schemaname = 'public'
GROUP BY t.tablename
HAVING COUNT(p.policyname) = 0;
```

***

## Known Issues & Notes

| Issue | Status | Catatan |
|---|---|---|
| `rsvp_messages.invitation_id` bertipe `text` bukan `uuid` | ⚠️ Technical debt | Policy sudah pakai cast `i.id::text`. Idealnya dimigrasi ke `uuid` di masa depan |
| `guest_sessions` insert terbuka | ✅ Acceptable | Dilindungi Layer 1 (rate limiting) + Layer 3 (Turnstile) di app layer |
| `rsvp` & `messages` insert terbuka untuk anon | ✅ Acceptable | Dibatasi hanya ke undangan active/trial, dilindungi Turnstile |
