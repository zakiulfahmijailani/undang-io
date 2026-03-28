# CLAUDE.md — undang.io

> **Konteks kerja untuk Claude Code.** Baca file ini sebelum memulai sesi.
> Untuk aturan lengkap kode, arsitektur, dan boundaries → baca `AGENTS.md`.
> File ini berisi: status proyek terkini, visi terdekat, dan guardrails tambahan.

---

## Identitas Proyek

- **Nama produk**: undang.io
- **Nama internal di codebase**: Umuman (legacy, sedang migrasi nama)
- **Deskripsi**: Platform SaaS undangan digital Indonesia. MVP fokus pada undangan pernikahan. Roadmap mencakup aqiqah, wisuda, seminar, dan event lainnya.
- **Repo**: https://github.com/zakiulfahmijailani/undang-io
- **Production**: Vercel (auto-deploy dari branch `main`)
- **Backend**: Supabase (DB + Auth + Storage + Edge Functions)
- **Package manager**: `pnpm`

---

## Status Proyek — 28 Maret 2026

### ✅ Sprint Malam Ini — SELESAI

| Commit | Deskripsi | Status |
|--------|-----------|--------|
| `db0f9bde` | style: apply Blush Ivory palette across all dashboard pages + sub-page loading skeletons | ⚠️ Build gagal |
| `5b28664c` | fix: replace missing alert-dialog with existing Modal in DeleteInvitationButton | ✅ HEAD / Live |

**Yang sudah selesai malam ini:**
- `dashboard/cs/page.tsx` — semua hardcoded hex (`#14213D`, `#9E1045`, `#20b486`) → CSS design token. Email diperbaiki ke `admin@undang.io`.
- `dashboard/transaksi/page.tsx` — status badge (`bg-green-100` dll) → palette token (`bg-primary/10`, `bg-destructive/10`).
- `dashboard/akun/page.tsx` — badge `bg-slate-100` → token, tombol "Upgrade Paket" dari `<a>` inline style → `<Link><Button>` proper.
- `dashboard/undangan/page.tsx` — statusClass badge → token, tombol Hapus → komponen `DeleteInvitationButton` baru.
- `src/components/dashboard/DeleteInvitationButton.tsx` — komponen baru: confirm dialog (Modal), soft delete via Supabase (`soft_delete_at = now()`), toast Sonner, `router.refresh()`.
- `dashboard/tema/loading.tsx`, `dashboard/undangan/loading.tsx`, `dashboard/akun/loading.tsx`, `dashboard/transaksi/loading.tsx` — skeleton loading baru dengan `animate-pulse` + `bg-secondary`.

### 📋 Sprint Sebelumnya — Selesai

- Blush Ivory design system diterapkan ke `globals.css` dan semua halaman landing
- Font body diganti dari Cormorant Infant (serif kursif) → Inter untuk UI dashboard
- Empty states + Sonner toast di dashboard overview
- Skeleton loading di `app/dashboard/loading.tsx`
- Inline validation + step indicator di `NewInvitationDialog`
- Cron cleanup-sessions diperbaiki ke `0 2 * * *` (Vercel Hobby limit)

### 🔴 Known Issues / Belum Dikerjakan

- Analytics dashboard masih hardcode (`totalViews = 0`, `totalRsvps = 0`)
- Detail halaman undangan (`dashboard/undangan/[id]`) belum sepenuhnya selesai
- Real-time RSVP tracking belum tersambung ke tabel Supabase
- Tabel `themes` di Supabase belum ada (lihat Visi Terdekat di bawah)

---

## Design System — Blush Ivory Palette

> **Aturan wajib**: JANGAN pernah hardcode warna hex (`#xxxxxx`) di className Tailwind atau inline style.
> Selalu gunakan CSS design token berikut.

| Token | Fungsi |
|-------|--------|
| `text-foreground` | Teks utama (menggantikan `#14213D`) |
| `text-primary` | Aksen primer dusty rose (menggantikan `#9E1045`) |
| `text-accent` | Aksen hijau/teal (menggantikan `#20b486`) |
| `text-muted-foreground` | Teks sekunder/muted |
| `bg-card` | Background card (menggantikan `bg-white`) |
| `bg-secondary` | Background sekunder |
| `bg-primary/10` | Background badge status pending/aktif |
| `bg-destructive/10` | Background badge status gagal/expired |
| `border-border` | Border divider (menggantikan `border-neutral-100`) |
| `text-destructive` | Teks status destructive/gagal |

**Status badge pattern yang sudah ditetapkan:**
```tsx
// ✅ Aktif / Berhasil
"bg-green-50 text-green-700 border border-green-200"
// ✅ Pending / Belum Aktif  
"bg-primary/10 text-primary border border-primary/20"
// ✅ Gagal / Expired
"bg-destructive/10 text-destructive border border-destructive/20"
// ✅ Claimed / Amber
"bg-amber-50 text-amber-700 border border-amber-200"
```

---

## UX Guardrails

- **Destructive action** (hapus, batalkan) WAJIB punya confirm dialog — gunakan `Modal` dari `@/components/ui/modal`.
- **`alert-dialog`** belum di-install di project ini — jangan import dari `@/components/ui/alert-dialog`.
- **Toast** untuk semua feedback aksi: gunakan `sonner` via `import { toast } from 'sonner'`.
- **Loading state**: setiap sub-route dashboard wajib punya `loading.tsx` dengan skeleton `animate-pulse`.
- **Semua teks UI dalam Bahasa Indonesia** — lihat aturan lengkap di `AGENTS.md`.

---

## Visi Terdekat — Theme Engine (Next Sprint)

Ini adalah fokus pengembangan utama setelah sprint UI/UX selesai.

### Konsep
undang.io akan memiliki **asset-swappable wedding theme engine** berbasis satu template pakem.
Setiap tema terdiri dari dua jenis aset:
- **User-slot**: aset yang diupload oleh pembeli (foto mempelai, galeri personal)
- **Theme-slot**: aset yang disiapkan admin/owner (background, ornamen, animasi, musik)

Admin dan owner akan menghasilkan aset via platform generative AI (Midjourney, Adobe Firefly),
lalu mengupload via dashboard mereka masing-masing ke Supabase Storage `theme-assets`.

### Template Referensi
Template pakem didasarkan pada: https://github.com/NgodingSolusi/the-wedding-of-rehan-maulidan

### Slot System yang Akan Dibangun

```typescript
// src/types/theme.ts — BELUM ADA, harus dibuat
export interface ThemeAssets {
  // Backgrounds
  heroBg: string           // URL gambar hero fullscreen
  heroOverlay?: string     // URL PNG overlay transparan (ornamen atas)
  footerBg?: string

  // Decorative elements
  floralTopLeft?: string   // URL PNG ornamen pojok kiri atas
  floralTopRight?: string
  floralBottom?: string
  dividerSvg?: string      // PNG/SVG pemisah antar section

  // Particles / animation
  particleType: 'petals' | 'sparkle' | 'bubbles' | 'leaves' | 'none'
  particleColor?: string

  // Palette
  colorPrimary: string
  colorSecondary: string
  colorAccent: string
  colorBackground: string
  colorText: string

  // Typography
  fontDisplay: string      // Google Font name (display/heading)
  fontBody: string         // Google Font name (body)

  // Audio
  bgMusic?: string         // URL audio file

  // Meta
  themeName: string
  themeSlug: string        // 'jawa' | 'papua' | 'aceh' | 'marvel' | 'laut' | ...
  thumbnailUrl: string     // Preview card di halaman pilih tema
  targetEvent: 'wedding' | 'aqiqah' | 'graduation' | 'all'
}
```

### Tabel Supabase yang Perlu Dibuat

```sql
-- BELUM ADA — perlu migration baru
create table themes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  thumbnail_url text,
  is_published boolean default false,
  created_by uuid references auth.users,
  assets jsonb not null,   -- ThemeAssets JSON
  target_event text default 'wedding',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Prioritas Implementasi (Urutan)

1. **Buat `src/types/theme.ts`** — interface `ThemeAssets` dan `InvitationData`
2. **Migration Supabase** — tabel `themes` + Storage bucket `theme-assets`
3. **Port 1 section template Rehan** ke slot system sebagai proof of concept (mulai dari hero section)
4. **Dashboard admin** — form upload aset tema per slot
5. **Dashboard owner** — sama seperti admin
6. **Halaman pilih tema** (`dashboard/tema/`) — grid preview, filter by event type
7. **Theme renderer** — `<ClassicTheme assets={...} data={...} />` component
8. **Generasi aset** — gunakan Midjourney (hero/ilustrasi) + Adobe Firefly (PNG transparan)

---

## Produk Roadmap Jangka Menengah

| Milestone | Deskripsi | Status |
|-----------|-----------|--------|
| UI/UX Dashboard Cleanup | Blush Ivory palette, skeleton loading, UX patterns | ✅ Hampir selesai |
| Real Analytics | Query nyata ke Supabase untuk views, RSVP, pesan | 🔴 Belum |
| Theme Engine v1 | Slot system, 1 tema pilot (Jawa), admin upload | 🔴 Belum |
| Generative Asset Production | 5 tema awal: Jawa, Papua, Aceh, Laut, Modern | 🔴 Belum |
| 200 Tema | Skala produksi tema via AI + dashboard admin efisien | 🔴 Belum |
| Multi-event | Aqiqah, wisuda, seminar themes | 🔴 Belum |

---

## Catatan untuk Claude Code

- Nama "Umuman" di `AGENTS.md` = nama lama. Nama produk sekarang adalah **undang.io**.
- `src/` adalah root folder komponen dan lib (bukan `app/` langsung).
- Struktur folder aktual mungkin sedikit berbeda dari `AGENTS.md` — selalu cek folder aktual sebelum membuat file baru.
- Jika ada konflik antara `CLAUDE.md` (file ini) dan `AGENTS.md`, ikuti `AGENTS.md` untuk aturan teknis, ikuti `CLAUDE.md` untuk konteks sprint dan visi.
- Vercel deployment berjalan di Hobby Plan — perhatikan batas cron job (1x/hari).

---

*CLAUDE.md — undang.io*
*Terakhir diupdate: 28 Maret 2026*
*Update file ini setiap akhir sprint atau saat visi proyek berubah.*
