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

## Theme Slot Specification v1

> **Sumber**: Hasil audit langsung dari repo referensi https://github.com/NgodingSolusi/the-wedding-of-rehan-maulidan
> **Tanggal audit**: 28 Maret 2026
> **Tujuan**: Dokumen ini adalah kontrak resmi antara template renderer, dashboard user, dan dashboard admin/owner.
> Setiap perubahan pada slot ini HARUS diupdate di file ini dan di `src/types/theme.ts`.

---

### 🔵 USER-SLOT — Diisi Pembeli Undangan

Aset unik per pasangan. Diisi via form wizard `dashboard/undangan/baru/` dan halaman edit `dashboard/undangan/[id]/`.

#### Foto Mempelai

| Slot Key | File Asal (Rehan) | Format | Wajib | Keterangan |
|----------|-------------------|--------|-------|------------|
| `photo_groom` | `images/rehan-square.jpg` | JPG/PNG, rasio 1:1 | ✅ | Foto solo mempelai pria |
| `photo_bride` | `images/molid-square.jpg` | JPG/PNG, rasio 1:1 | ✅ | Foto solo mempelai wanita |
| `photo_couple_1` | `images/couple-1.jpg` | JPG, landscape | ✅ | Foto berdua utama (tampil di hero cover) |
| `photo_couple_2` | `images/couple-2.jpg` | JPG | ❌ | Foto berdua untuk section "Cerita Kita" |
| `photo_couple_3` | `images/couple-3.jpg` | JPG | ❌ | Foto berdua tambahan |
| `photo_gallery[]` | `images/gallery-1.jpg` s/d `gallery-9.jpg` | JPG/PNG | ❌ | Galeri foto (maksimal 9 slot) |

#### Data Teks Mempelai

| Slot Key | Tipe | Wajib | Keterangan |
|----------|------|-------|------------|
| `name_groom` | String | ✅ | Nama lengkap mempelai pria |
| `name_bride` | String | ✅ | Nama lengkap mempelai wanita |
| `name_groom_short` | String | ✅ | Nama panggilan / singkat pria |
| `name_bride_short` | String | ✅ | Nama panggilan / singkat wanita |
| `parent_groom` | String | ✅ | Nama ayah & ibu pria (contoh: "Bpk. Ahmad & Ibu Sari") |
| `parent_bride` | String | ✅ | Nama ayah & ibu wanita |
| `bio_groom` | String | ❌ | Kalimat singkat tentang pria (opsional) |
| `bio_bride` | String | ❌ | Kalimat singkat tentang wanita (opsional) |

#### Data Acara

| Slot Key | Tipe | Wajib | Keterangan |
|----------|------|-------|------------|
| `date_akad` | DateTime | ✅ | Tanggal + jam akad nikah |
| `date_resepsi` | DateTime | ✅ | Tanggal + jam resepsi |
| `venue_akad_name` | String | ✅ | Nama gedung/tempat akad |
| `venue_akad_address` | String | ✅ | Alamat lengkap akad |
| `venue_resepsi_name` | String | ✅ | Nama gedung/tempat resepsi |
| `venue_resepsi_address` | String | ✅ | Alamat lengkap resepsi |
| `gmaps_akad_url` | URL | ✅ | Link Google Maps akad |
| `gmaps_resepsi_url` | URL | ✅ | Link Google Maps resepsi |
| `love_story[]` | Array `{date, title, description}` | ❌ | Timeline perjalanan cinta |

#### Amplop Digital

| Slot Key | Tipe | Wajib | Keterangan |
|----------|------|-------|------------|
| `qris_image` | PNG | ❌ | Foto QRIS untuk amplop digital |
| `rekening[]` | Array `{bank, account_name, account_number}` | ❌ | Data rekening bank |

---

### 🟡 THEME-SLOT — Diisi Admin / Owner via Dashboard

Aset konsisten per tema. Digenerate via AI (Midjourney, Adobe Firefly) lalu diupload oleh admin/owner ke Supabase Storage bucket `theme-assets`.

#### Background Sections (5 layer fullscreen)

| Slot Key | File Asal (Rehan) | Format | Ukuran Ideal | Keterangan |
|----------|-------------------|--------|-------------|------------|
| `bg_cover` | `images/img_bg_1.jpg` | JPG | 1920×1080px | Background utama halaman cover/hero (fullscreen) |
| `bg_section_2` | `images/img_bg_2.jpg` | JPG | 1920×1080px | Background section profil mempelai |
| `bg_section_3` | `images/img_bg_3.jpg` | JPG | 1920×1080px | Background section info acara & countdown |
| `bg_section_4` | `images/img_bg_4.jpg` | JPG | 1920×1080px | Background section cerita cinta & galeri |
| `bg_section_5` | `images/img_bg_5.jpg` | JPG | 1920×1080px | Background section ucapan, RSVP & footer |
| `bg_groom_panel` | `images/groom.jpg` | JPG | 800×1200px | Background panel sisi kiri profil pria |

#### Ornamen Dekoratif (PNG Transparan)

| Slot Key | File Asal (Rehan) | Format | Keterangan |
|----------|-------------------|--------|------------|
| `ornament_half_circle` | `images/half circle flower-500.png` | **PNG transparan** | Ornamen setengah lingkaran bunga — muncul di pojok hero dan section transisi |
| `ornament_overlay` | `images/overlay.JPG` | JPG/PNG | Overlay tekstur di atas hero cover (opacity ~30%) |
| `ornament_bismillah` | `images/bismillah.svg` | **SVG** | Kaligrafi/teks pembuka — bisa swap per tema (bismillah, salib, om, dll) |
| `ornament_divider` | *(tidak ada di Rehan, perlu dibuat)* | **SVG/PNG transparan** | Pemisah dekoratif antar section |
| `ornament_corner_tl` | *(tidak ada di Rehan, perlu dibuat)* | **PNG transparan** | Ornamen pojok kiri atas |
| `ornament_corner_br` | *(tidak ada di Rehan, perlu dibuat)* | **PNG transparan** | Ornamen pojok kanan bawah |

#### Audio & Animasi

| Slot Key | File Asal (Rehan) | Format | Keterangan |
|----------|-------------------|--------|------------|
| `bg_music` | `images/audio/` | MP3, maks 5MB | Musik latar undangan (autoplay muted, toggle oleh tamu) |
| `loader_asset` | `images/loader.gif` | GIF / Lottie JSON | Animasi loading screen saat undangan pertama dibuka |
| `particle_type` | JS custom di repo | enum string | Tipe partikel animasi: `'petals'` \| `'sparkle'` \| `'bubbles'` \| `'leaves'` \| `'snow'` \| `'none'` |
| `particle_color` | *(derived dari palette)* | HEX string | Override warna partikel (opsional, default ikut `color_primary`) |

#### Palette Warna

| Slot Key | Tipe | Keterangan |
|----------|------|------------|
| `color_primary` | HEX | Warna dominan tema (untuk teks heading, aksen) |
| `color_secondary` | HEX | Warna aksen pendukung |
| `color_accent` | HEX | Warna highlight / CTA button |
| `color_bg_page` | HEX | Warna background halaman (biasanya cream/putih) |
| `color_text_body` | HEX | Warna teks isi konten |
| `color_overlay` | HEX + opacity | Warna overlay di atas background (contoh: `#00000040`) |

#### Tipografi

| Slot Key | Tipe | Keterangan |
|----------|------|------------|
| `font_display` | Google Font name | Font untuk nama mempelai & heading utama (contoh: `"Great Vibes"`, `"Cinzel"`) |
| `font_body` | Google Font name | Font untuk teks isi & konten (contoh: `"Cormorant Infant"`, `"Lora"`) |

---

### 📐 Section Map — Struktur Halaman Pakem

Urutan section dari atas ke bawah. **Jangan ubah urutan ini tanpa diskusi** — ini adalah UX flow yang sudah terbukti dari template referensi.

```
Section 1 — Cover / Envelope
  Aset: bg_cover, ornament_overlay, ornament_half_circle, photo_couple_1
  Data: name_groom_short, name_bride_short, date_akad
  Fitur: animasi masuk (amplop terbuka), loader_asset, bg_music toggle

Section 2 — Profil Mempelai
  Aset: bg_section_2, bg_groom_panel, ornament_half_circle
  Data: photo_groom, photo_bride, name_groom, name_bride, parent_groom, parent_bride, bio_groom, bio_bride

Section 3 — Countdown & Info Acara
  Aset: bg_section_3, ornament_divider
  Data: date_akad, date_resepsi, venue_akad_name, venue_akad_address, venue_resepsi_name, venue_resepsi_address, gmaps_akad_url, gmaps_resepsi_url
  Fitur: countdown timer real-time, tombol "Simpan ke Kalender", tombol "Buka Maps"

Section 4 — Cerita Cinta
  Aset: bg_section_4, ornament_corner_tl
  Data: love_story[], photo_couple_2, photo_couple_3
  Fitur: timeline scroll animation (AOS / Framer Motion)

Section 5 — Galeri Foto
  Aset: *(tidak ada theme-slot khusus, pakai bg_section_4 atau transparan)*
  Data: photo_gallery[] (maks 9)
  Fitur: lightbox / masonry grid

Section 6 — Ucapan & RSVP
  Aset: bg_section_5
  Data: *(diisi tamu, bukan user/admin)*
  Fitur: form RSVP (hadir/tidak), form ucapan, live feed ucapan

Section 7 — Amplop Digital
  Aset: *(tidak ada theme-slot, UI polos)*
  Data: qris_image, rekening[]
  Fitur: copy rekening ke clipboard, tampilkan QRIS

Section 8 — Footer & Musik
  Aset: bg_section_5 (shared), ornament_bismillah, bg_music
  Data: name_groom_short, name_bride_short
  Fitur: musik player toggle, credit "Dibuat dengan undang.io"
```

---

### ⚠️ Aturan Penting Theme Slot

- **PNG ornamen HARUS transparan** — background harus removed sebelum upload, bukan JPG biasa
- **Rasio bg_cover wajib 16:9** (landscape) — template didesain untuk layar penuh mobile
- **Ukuran file maks**: bg images 500KB, ornamen PNG 200KB, audio 5MB, loader GIF 200KB
- **Semua URL aset disimpan di kolom `assets` JSONB** di tabel `themes` — tidak ada path hardcoded
- **Slot opsional yang kosong (null)** → template harus gracefully hide elemen tersebut, JANGAN tampilkan broken image
- **`ornament_bismillah`** adalah slot yang paling sensitif secara agama/budaya — untuk tema non-Islam, slot ini bisa diisi dengan ornamen netral atau dikosongkan

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
*Terakhir diupdate: 28 Maret 2026 — ditambahkan Theme Slot Specification v1*
*Update file ini setiap akhir sprint atau saat visi proyek berubah.*
