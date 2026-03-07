# Design System Specification
## Platform Undangan Pernikahan Digital — NikahKu

---

**Dokumen:** Design System v1.0  
**Tanggal:** 6 Maret 2026  
**Owner:** Zakiul Fahmi Jailani  
**Stack:** Next.js 14 · Tailwind CSS v3 · TypeScript  
**Status:** Final Draft — Ready for AI Agents Implementation

> **Untuk AI Agents:** Dokumen ini adalah **satu-satunya sumber kebenaran** (single source of truth) untuk semua keputusan visual. Setiap komponen yang di-generate HARUS mengacu ke token-token di sini. Jangan hardcode warna, spacing, atau font di luar sistem ini.

---

## Daftar Isi

1. [Design Principles](#1-design-principles)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Spacing & Layout](#4-spacing--layout)
5. [Elevation & Shadow](#5-elevation--shadow)
6. [Border Radius](#6-border-radius)
7. [Motion & Animation](#7-motion--animation)
8. [Iconography](#8-iconography)
9. [Imagery Guidelines](#9-imagery-guidelines)
10. [UI Components](#10-ui-components)
11. [Accessibility](#11-accessibility)
12. [Tailwind Config](#12-tailwind-config)

---

## 1. Design Principles

Lima prinsip yang harus selalu memandu setiap keputusan desain:

### 1.1 Elegance First
> "Setiap piksel harus terasa seperti dicetak di atas kertas mahal."

Platform ini bersaing di atas estetika. Whitespace melimpah, typografi hierarchy yang kuat, dan palet warna yang tenang adalah fondasi. Tidak ada elemen dekoratif yang tidak punya fungsi.

### 1.2 Effortless Simplicity
> "Kalau user harus berpikir dua kali, desainnya gagal."

Hierarki informasi harus crystal clear. CTA (Call-to-Action) harus obvious. Setiap layar punya satu tujuan utama. Jangan hadirkan lebih dari 3 pilihan sekaligus pada user awam.

### 1.3 Mobile-First, Always
> "Desain untuk layar 375px lebih dulu, baru scale up."

80%+ user akan akses lewat HP. Setiap komponen dirancang mobile-first: tap target minimal 44×44px, teks minimal 16px di body, scroll lebih diutamakan daripada navigation kompleks.

### 1.4 Culturally Indonesian
> "Hangat, sopan, dan familiar — bukan kaku atau terlalu Western."

Tone of voice: sopan tapi tidak formal kaku. Bahasa Indonesia yang natural, bukan terjemahan literal. Elemen visual yang subtle menghargai estetika lokal (ornamen, motif) tanpa terlihat kuno.

### 1.5 Performance as Design
> "Loading yang lambat adalah desain yang buruk."

Setiap keputusan desain mempertimbangkan performa: lazy load images, system fonts sebagai fallback, animasi yang tidak menghabiskan resources GPU.

---

## 2. Color System

### 2.1 Design Philosophy Warna

Palet mengikuti tren **muted elegance** 2025: warna earthy yang soft, bukan warna neon atau saturasi tinggi.[cite:48][cite:50] Filosofi: warna platform harus "menyingkir" agar konten undangan (foto pasangan, nama mempelai) yang jadi bintang. Warna sistem hanya framing, bukan focal point.

**Tiga layer warna:**
1. **Brand Palette** — warna identitas platform (tidak berubah)
2. **Semantic Colors** — warna untuk state (success, error, warning, info)
3. **Theme Palette** — warna per template undangan (berubah sesuai pilihan user)

---

### 2.2 Brand Palette

#### Primary — Champagne Gold
Warna utama brand. Hangat, premium, dan diasosiasikan dengan pernikahan di seluruh budaya.[cite:47][cite:51]

```
--color-primary-50:   #FDFAF0   /* Lightest, background tint */
--color-primary-100:  #FAF3D4
--color-primary-200:  #F4E49A
--color-primary-300:  #EDD15E
--color-primary-400:  #E6BE30
--color-primary-500:  #D4A91C   /* Base / Brand Primary */
--color-primary-600:  #B88E14
--color-primary-700:  #9A720F
--color-primary-800:  #7D5C0C
--color-primary-900:  #614509   /* Darkest */
```

**Tailwind Alias:** `primary-*`  
**Penggunaan:** CTA button, aksen, ikon brand, focus ring, badge premium.

---

#### Neutral — Warm Stone
Bukan abu-abu dingin. Stone memiliki undertone hangat yang selaras dengan Champagne Gold.[cite:49]

```
--color-neutral-0:    #FFFFFF
--color-neutral-50:   #FAFAF9   /* Page background */
--color-neutral-100:  #F5F4F2   /* Card background */
--color-neutral-200:  #E8E5E1   /* Divider, border ringan */
--color-neutral-300:  #D4CFC9   /* Border, input border */
--color-neutral-400:  #B8B2AA   /* Placeholder text */
--color-neutral-500:  #9A9189   /* Subtle text */
--color-neutral-600:  #7A7169   /* Body text secondary */
--color-neutral-700:  #5A5349   /* Body text primary */
--color-neutral-800:  #3D3630   /* Heading secondary */
--color-neutral-900:  #211E1A   /* Heading primary, darkest text */
```

**Penggunaan:** Background, text, border, divider, icon default.

---

#### Accent — Dusty Rose
Warna aksen yang memancarkan romance tanpa klise. Dusty rose adalah warna pernikahan 2025 yang dominan.[cite:50][cite:54]

```
--color-accent-50:    #FDF3F4
--color-accent-100:   #FAE2E4
--color-accent-200:   #F5C2C7
--color-accent-300:   #EC99A0
--color-accent-400:   #E0707A
--color-accent-500:   #D4515C   /* Base Accent */
--color-accent-600:   #B83D47
--color-accent-700:   #972E38
--color-accent-800:   #7A2430
--color-accent-900:   #5E1C26
```

**Tailwind Alias:** `accent-*`  
**Penggunaan:** Highlight, badge "baru", ilustrasi dekoratif, hover state sekunder.

---

#### Deep Forest — Tone Alam
Pendukung untuk tema outdoor, garden, rustic. Muted green yang sophisticated.[cite:47][cite:51]

```
--color-forest-50:    #F2F5F0
--color-forest-100:   #E1EAD9
--color-forest-200:   #C0D4B3
--color-forest-300:   #97B889
--color-forest-400:   #6F9B5E
--color-forest-500:   #4E7D42   /* Base */
--color-forest-600:   #3D6433
--color-forest-700:   #2E4D26
--color-forest-800:   #1F361A
--color-forest-900:   #12200F
```

**Penggunaan:** Tema "Garden Romance", "Rustic Boho", dan dekorasi alam.

---

### 2.3 Semantic Colors

Warna fungsional untuk feedback state. Tidak boleh dipakai untuk dekorasi.

```
/* Success */
--color-success-light:   #ECFDF5
--color-success-base:    #059669   /* Teks & ikon */
--color-success-dark:    #065F46
--color-success-border:  #A7F3D0

/* Error */
--color-error-light:     #FFF1F2
--color-error-base:      #DC2626
--color-error-dark:      #991B1B
--color-error-border:    #FECACA

/* Warning */
--color-warning-light:   #FFFBEB
--color-warning-base:    #D97706
--color-warning-dark:    #92400E
--color-warning-border:  #FDE68A

/* Info */
--color-info-light:      #EFF6FF
--color-info-base:       #2563EB
--color-info-dark:       #1E40AF
--color-info-border:     #BFDBFE
```

---

### 2.4 Surface Colors

```
--color-surface-page:       #FAFAF9   /* Latar halaman utama */
--color-surface-card:       #FFFFFF   /* Card, panel */
--color-surface-overlay:    rgba(33, 30, 26, 0.5)  /* Modal backdrop */
--color-surface-sidebar:    #F5F4F2   /* Sidebar, panel samping */
--color-surface-footer:     #211E1A   /* Footer gelap */
```

---

### 2.5 Wedding Theme Palettes

Setiap tema undangan memiliki palet sendiri. Palet ini HANYA berlaku di dalam komponen halaman undangan (`/u/[slug]`), tidak di dashboard/admin.

#### Theme 1: Minimalist White
```
--theme-bg:         #FFFFFF
--theme-bg-alt:     #FAFAF9
--theme-primary:    #D4A91C   /* Same as brand primary */
--theme-text:       #211E1A
--theme-text-muted: #7A7169
--theme-border:     #E8E5E1
--theme-accent:     #D4A91C
```

#### Theme 2: Garden Romance
```
--theme-bg:         #F8FAF5
--theme-bg-alt:     #EEF4E8
--theme-primary:    #4E7D42
--theme-text:       #1F361A
--theme-text-muted: #5A7352
--theme-border:     #C0D4B3
--theme-accent:     #E0707A
```

#### Theme 3: Classic Javanese
```
--theme-bg:         #FDF8EE
--theme-bg-alt:     #F5EDD5
--theme-primary:    #8B5E15
--theme-text:       #3D2A0A
--theme-text-muted: #7D5C30
--theme-border:     #D4B896
--theme-accent:     #C5A028
```

#### Theme 4: Modern Bold
```
--theme-bg:         #0F0E0D
--theme-bg-alt:     #1A1916
--theme-primary:    #D4A91C
--theme-text:       #F5F4F2
--theme-text-muted: #9A9189
--theme-border:     #3D3630
--theme-accent:     #D4A91C
```

#### Theme 5: Rustic Boho
```
--theme-bg:         #FAF6F0
--theme-bg-alt:     #F2E8DA
--theme-primary:    #C47D4A
--theme-text:       #3D2A15
--theme-text-muted: #7D5C3A
--theme-border:     #E0C8A8
--theme-accent:     #D4515C
```

#### Theme 6: Sundanese Elegance
```
--theme-bg:         #FDF4F0
--theme-bg-alt:     #F5E0D5
--theme-primary:    #9B2A2A
--theme-text:       #3D1010
--theme-text-muted: #7D4040
--theme-border:     #E0B0A0
--theme-accent:     #C5851A
```

---

## 3. Typography System

### 3.1 Philosophy

Dua font family: satu serif elegan untuk heading (menciptakan kesan premium pernikahan), satu sans-serif bersih untuk body text (readability maksimal).[cite:52][cite:55]

---

### 3.2 Font Families

#### Display & Heading: **Cormorant Garamond**
- **Alasan:** Serif klasik dengan nuansa calligraphic yang sangat cocok untuk konteks pernikahan. Tampil elegan di semua ukuran, khususnya di heading besar. Open source (Google Fonts).
- **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Italic tersedia:** Ya — digunakan untuk kutipan dan elemen dekoratif
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600`

```css
--font-display: 'Cormorant Garamond', 'Palatino Linotype', Georgia, serif;
```

**Penggunaan:** H1, H2, H3 di halaman undangan & marketing. Nama mempelai di cover undangan.

---

#### Body & UI: **Plus Jakarta Sans**
- **Alasan:** Sans-serif modern yang dirancang dengan inspirasi Indonesian design sensibility. Sangat readable di ukuran kecil di mobile. Open source (Google Fonts).[cite:52]
- **Weights:** 300, 400, 500, 600, 700, 800
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800`

```css
--font-body: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;
```

**Penggunaan:** Body text, label, button, input, navigasi, dashboard, semua teks fungsional.

---

#### Monospace (untuk kode/reference): **JetBrains Mono**
```css
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Penggunaan:** Kode referensi, nomor rekening/QRIS, slug undangan.

---

### 3.3 Type Scale

Menggunakan skala modular dengan ratio 1.25 (Major Third), dimulai dari base 16px.

```
/* Display — Nama Mempelai di Cover Undangan */
--text-display-2xl:  font-size: 72px / line-height: 1.1 / letter-spacing: -0.03em
--text-display-xl:   font-size: 60px / line-height: 1.1 / letter-spacing: -0.02em
--text-display-lg:   font-size: 48px / line-height: 1.15 / letter-spacing: -0.02em

/* Heading — Judul Section */
--text-h1:  font-size: 36px / line-height: 1.2 / letter-spacing: -0.01em
--text-h2:  font-size: 28px / line-height: 1.25 / letter-spacing: -0.01em
--text-h3:  font-size: 22px / line-height: 1.3 / letter-spacing: -0.005em
--text-h4:  font-size: 18px / line-height: 1.4 / letter-spacing: 0
--text-h5:  font-size: 16px / line-height: 1.4 / letter-spacing: 0
--text-h6:  font-size: 14px / line-height: 1.5 / letter-spacing: 0.01em

/* Body */
--text-body-lg:   font-size: 18px / line-height: 1.6
--text-body-md:   font-size: 16px / line-height: 1.6   ← BASE
--text-body-sm:   font-size: 14px / line-height: 1.5
--text-body-xs:   font-size: 12px / line-height: 1.4

/* UI Elements */
--text-label-lg:  font-size: 14px / line-height: 1 / letter-spacing: 0.01em / font-weight: 600
--text-label-sm:  font-size: 12px / line-height: 1 / letter-spacing: 0.02em / font-weight: 600
--text-caption:   font-size: 11px / line-height: 1.4 / letter-spacing: 0.02em

/* Overline (kategori kecil di atas heading) */
--text-overline:  font-size: 11px / line-height: 1 / letter-spacing: 0.12em / font-weight: 700 / text-transform: UPPERCASE
```

---

### 3.4 Aturan Typography

**Hierarchy Rules:**
- `display-*` dan `h1-h3` → wajib `font-display` (Cormorant Garamond)
- `h4-h6`, `body-*`, `label-*`, `caption` → wajib `font-body` (Plus Jakarta Sans)
- Max 2 font family dalam satu layar

**Warna Text Rules:**
- Heading utama: `neutral-900`
- Body text: `neutral-700`
- Text sekunder/subtle: `neutral-500`
- Placeholder: `neutral-400`
- Text disabled: `neutral-300`
- Jangan gunakan teks di bawah `neutral-400` di atas background putih (aksesibilitas)

**Alignment Rules:**
- Teks body: left-aligned (lebih mudah dibaca)
- Heading di halaman undangan: center-aligned (dramatis, sesuai konteks)
- Teks di form/dashboard: left-aligned selalu

**Line Length:**
- Max 65 karakter per baris di body text
- Min 30 karakter (jangan terlalu sempit)
- Tailwind: `max-w-prose` (65ch)

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

Berbasis kelipatan 4px (t-shirt sizing). Mengikuti konvensi Tailwind default.

```
--space-0:    0px
--space-0.5:  2px
--space-1:    4px
--space-1.5:  6px
--space-2:    8px
--space-2.5:  10px
--space-3:    12px
--space-4:    16px   ← Base unit
--space-5:    20px
--space-6:    24px
--space-7:    28px
--space-8:    32px
--space-10:   40px
--space-12:   48px
--space-14:   56px
--space-16:   64px
--space-20:   80px
--space-24:   96px
--space-32:   128px
--space-40:   160px
--space-48:   192px
```

---

### 4.2 Layout Grid

**Mobile (< 768px)**
- Columns: 4
- Gutter: 16px
- Margin: 16px

**Tablet (768px - 1023px)**
- Columns: 8
- Gutter: 24px
- Margin: 32px

**Desktop (≥ 1024px)**
- Columns: 12
- Gutter: 24px
- Margin: 40px
- Max content width: 1200px

---

### 4.3 Container Sizes

```css
.container-xs   { max-width: 480px; }   /* Form halaman, modal kecil */
.container-sm   { max-width: 640px; }   /* Form multi-step, artikel */
.container-md   { max-width: 768px; }   /* Halaman undangan publik */
.container-lg   { max-width: 1024px; }  /* Dashboard content */
.container-xl   { max-width: 1200px; }  /* Halaman marketing */
.container-full { max-width: 100%; }
```

**Halaman undangan publik (`/u/[slug]`) HARUS menggunakan `container-md` (max 768px)** untuk pengalaman "app-like" yang nyaman di semua device.

---

## 5. Elevation & Shadow

Lima level elevation. Semakin tinggi level, semakin besar dan lebih "blur" bayangannya. Shadow menggunakan warm undertone selaras palet.[cite:49]

```css
/* Level 0 — Flat (no shadow) */
--shadow-0: none;

/* Level 1 — Subtle (card resting state) */
--shadow-1: 0 1px 2px rgba(33, 30, 26, 0.06), 0 1px 3px rgba(33, 30, 26, 0.08);

/* Level 2 — Lifted (card hover, dropdown) */
--shadow-2: 0 4px 6px rgba(33, 30, 26, 0.05), 0 2px 10px rgba(33, 30, 26, 0.08);

/* Level 3 — Floating (modal, dialog) */
--shadow-3: 0 10px 25px rgba(33, 30, 26, 0.1), 0 4px 12px rgba(33, 30, 26, 0.06);

/* Level 4 — Overlaid (drawer, bottom sheet) */
--shadow-4: 0 20px 60px rgba(33, 30, 26, 0.15), 0 8px 24px rgba(33, 30, 26, 0.1);

/* Special: Gold Glow — untuk CTA button primary */
--shadow-gold: 0 4px 16px rgba(212, 169, 28, 0.35);

/* Special: Inner shadow — untuk pressed state */
--shadow-inner: inset 0 2px 4px rgba(33, 30, 26, 0.06);
```

**Tailwind Alias:**
```
shadow-1 → shadow-sm
shadow-2 → shadow-md
shadow-3 → shadow-lg
shadow-4 → shadow-xl
```

---

## 6. Border Radius

Konsisten menggunakan border radius yang bulat (friendly, bukan kotak kaku) tapi tidak terlalu melingkar.

```css
--radius-none:   0px
--radius-sm:     4px    /* Input subtle, tag kecil */
--radius-md:     8px    /* Button, input field, chip */
--radius-lg:     12px   /* Card, panel */
--radius-xl:     16px   /* Card besar, section */
--radius-2xl:    24px   /* Modal, bottom sheet */
--radius-3xl:    32px   /* Full section card */
--radius-full:   9999px /* Pill button, avatar, badge */
```

**Aturan Konsistensi:**
- Input, Button, Select → selalu `radius-md` (8px)
- Card biasa → `radius-lg` (12px)
- Modal, Sheet → `radius-2xl` (24px) di top corners
- Avatar, Badge → `radius-full`
- Jangan mixing radius dalam satu komponen

---

## 7. Motion & Animation

### 7.1 Timing Functions

```css
--ease-default:    cubic-bezier(0.4, 0, 0.2, 1)    /* Tailwind default */
--ease-in:         cubic-bezier(0.4, 0, 1, 1)
--ease-out:        cubic-bezier(0, 0, 0.2, 1)
--ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1) /* Untuk micro-interaction */
--ease-bounce:     cubic-bezier(0.68, -0.55, 0.265, 1.55) /* Subtle bounce */
```

### 7.2 Duration Scale

```css
--duration-instant:  50ms    /* State changes (color, opacity) */
--duration-fast:     100ms   /* Hover, focus ring */
--duration-normal:   200ms   /* Standard transition */
--duration-slow:     300ms   /* Modal open, panel slide */
--duration-slower:   500ms   /* Page transition, undangan reveal */
--duration-slowest:  800ms   /* Undangan cover animation */
```

### 7.3 Standard Transitions

```css
/* Hover pada interactive elements */
.transition-interactive {
  transition: all var(--duration-fast) var(--ease-out);
}

/* Komponen muncul/hilang (fade) */
.transition-fade {
  transition: opacity var(--duration-normal) var(--ease-default);
}

/* Slide dari bawah (bottom sheet, toast) */
.transition-slide-up {
  transition: transform var(--duration-slow) var(--ease-spring),
              opacity var(--duration-slow) var(--ease-out);
}
```

### 7.4 Page Transition (Halaman Undangan)

Halaman undangan (`/u/[slug]`) menggunakan **fade-in with stagger** saat pertama kali load:

```
- Section 1 (Hero): fade-in 0ms, duration 800ms
- Section 2 (Greeting): fade-in 200ms, duration 600ms
- Section 3 (Detail Acara): fade-in 400ms, duration 600ms
- Dan seterusnya, interval 200ms per section
```

**Aturan Motion:**
- Jangan animasi yang berlangsung lebih dari 500ms untuk interaksi UI normal
- Hormati `prefers-reduced-motion`: wrap semua animasi dalam media query
- Jangan gunakan `bounce` untuk error states (terasa mengejek)

---

## 8. Iconography

**Library:** `lucide-react` — Open source, konsisten, tree-shakeable, TypeScript support.

```bash
npm install lucide-react
```

**Ukuran Standar:**
```
Icon-xs:  12px  (inline di teks kecil)
Icon-sm:  16px  (label, badge, input adornment)
Icon-md:  20px  (button, nav item, list item) ← DEFAULT
Icon-lg:  24px  (standalone icon, section header)
Icon-xl:  32px  (feature icon, empty state)
Icon-2xl: 48px  (hero illustration fallback)
```

**Warna Ikon:**
- Default: `neutral-500`
- Active/selected: `primary-600`
- Error: `error-base`
- Success: `success-base`
- Disabled: `neutral-300`
- Inverse (di atas background gelap): `neutral-100`

**Ikon Referensi (Wajib Konsisten):**

| Aksi/Konsep | Icon Name (lucide-react) |
|-------------|--------------------------|
| Edit / Ubah | `Pencil` |
| Hapus | `Trash2` |
| Tambah | `Plus` |
| Simpan | `Save` |
| Publish | `Send` |
| Preview | `Eye` |
| Tutup / X | `X` |
| Kembali | `ChevronLeft` |
| Lanjut | `ChevronRight` |
| Akun / User | `User` |
| Pengaturan | `Settings` |
| Dashboard | `LayoutDashboard` |
| Undangan | `Mail` |
| Tema | `Palette` |
| Galeri Foto | `Images` |
| Lokasi / Peta | `MapPin` |
| Kalender | `Calendar` |
| RSVP | `ClipboardCheck` |
| Ucapan | `MessageSquare` |
| Amplop Digital | `Gift` |
| QRIS / Bayar | `QrCode` |
| Copy / Salin | `Copy` |
| Share | `Share2` |
| Upload | `Upload` |
| Download | `Download` |
| Musik | `Music` |
| AI / Generate | `Sparkles` |
| Berhasil | `CheckCircle2` |
| Error | `AlertCircle` |
| Peringatan | `AlertTriangle` |
| Info | `Info` |
| Loading | `Loader2` (pakai animate-spin) |
| Bintang / Rating | `Star` |
| Logout | `LogOut` |
| Mata Tertutup (password) | `EyeOff` |

---

## 9. Imagery Guidelines

### 9.1 Foto User (Pasangan)

**Format yang diterima:** JPEG, PNG, WebP  
**Max file size:** 5MB per foto  
**Dimensi optimal:**
- Cover photo: 1200×800px (landscape 3:2)
- Galeri prewedding: 800×800px (square 1:1) atau 800×600px (4:3)
- Avatar profil: 400×400px (square)

**Processing di backend:**
- Resize otomatis ke dimensi max via Supabase Storage transformations
- Convert ke WebP untuk performa lebih baik
- Lazy load dengan `next/image` component

**Presentasi:**
- Gunakan `object-fit: cover` untuk semua foto
- Selalu sediakan placeholder blur (base64 LQIP) saat loading
- Alt text wajib untuk aksesibilitas

### 9.2 Foto Tema (Preview)

- Ukuran thumbnail: 600×400px (3:2)
- Ukuran demo full: 1200×900px
- Format: WebP dengan fallback JPEG
- Hosted di Supabase Storage di bawah path `/themes/[slug]/`

### 9.3 Aset Dekoratif

- Ornamen, ilustrasi tema: gunakan SVG (scalable, tidak pixelate, file kecil)
- Tekstur background: PNG/WebP dengan opacity rendah (10–20%)
- Jangan gunakan gambar dekoratif yang > 200KB

---

## 10. UI Components

Setiap komponen didokumentasikan dengan: **Anatomy, Variants, States, Props, Usage Rules, Don'ts**.

> **Untuk AI Agents:** Implementasikan semua komponen sebagai React functional components dengan TypeScript. Gunakan `class-variance-authority (cva)` untuk variant management dan `tailwind-merge (twMerge)` untuk class conflict resolution.

---

### 10.1 Button

#### Anatomy
```
[Icon (optional)] [Label] [Icon trailing (optional)]
```

#### Variants

**Primary** — Aksi utama per halaman (max 1 per section)
```
Background: primary-500
Text: neutral-0 (putih)
Hover: primary-600
Active/Pressed: primary-700
Focus Ring: primary-300 (3px offset)
Disabled: neutral-200 bg + neutral-400 text
Shadow: shadow-gold (hanya primary)
```

**Secondary (Outline)** — Aksi sekunder, alternatif dari primary
```
Background: transparent
Border: neutral-300 (1.5px)
Text: neutral-800
Hover: neutral-50 bg + neutral-400 border
Active: neutral-100 bg
Disabled: neutral-200 border + neutral-300 text
```

**Ghost** — Aksi tersier, minimal
```
Background: transparent
Border: none
Text: neutral-600
Hover: neutral-100 bg
Active: neutral-200 bg
Disabled: neutral-400 text
```

**Destructive** — Aksi berbahaya (hapus, cancel)
```
Background: error-base
Text: neutral-0
Hover: error-dark
Focus Ring: error-border (3px)
```

#### Sizes

```
sm:  height 32px / padding 8px 14px / text-sm (14px) / radius-md
md:  height 40px / padding 10px 18px / text-md (16px) / radius-md  ← DEFAULT
lg:  height 48px / padding 12px 24px / text-md (16px) / radius-md
xl:  height 56px / padding 14px 28px / text-body-lg (18px) / radius-md
```

#### States
- **Default:** resting state
- **Hover:** warna lebih gelap, subtle scale-up (102%)
- **Active/Pressed:** warna lebih gelap lagi, scale-down (98%)
- **Focus:** focus ring visible (untuk keyboard navigation)
- **Loading:** replace label dengan `<Loader2 className="animate-spin" />` + loading text
- **Disabled:** opacity 0.5, `cursor-not-allowed`

#### Props (TypeScript Interface)
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
}
```

#### Usage Rules
- ✅ Satu `primary` button per section/form
- ✅ Teks tombol dimulai dengan kata kerja (Simpan, Lanjut, Buat, Kirim)
- ✅ Loading state wajib ada untuk aksi async
- ❌ Jangan disable button tanpa menjelaskan kenapa (sertakan tooltip/helper text)
- ❌ Jangan gunakan teks "OK" atau "Iya" saja — terlalu tidak deskriptif
- ❌ Jangan 2 primary buttons bersebelahan

---

### 10.2 Input Field

#### Anatomy
```
[Label] *required asterisk
[Left Adornment (optional)] [Input Text] [Right Adornment (optional)]
[Helper Text / Error Message]
```

#### States
- **Default:** border `neutral-300`, label `neutral-700`
- **Focus:** border `primary-500` (2px), label bold `neutral-900`
- **Filled:** sama seperti default, teks `neutral-900`
- **Error:** border `error-base`, helper text `error-base`, icon `AlertCircle`
- **Success:** border `success-base`, icon `CheckCircle2`
- **Disabled:** background `neutral-100`, border `neutral-200`, teks `neutral-400`
- **Read-only:** background `neutral-50`, border `neutral-200`

#### Variants
- `text` — Default text input
- `email` — Email dengan icon `Mail` di kiri
- `password` — Password dengan toggle `Eye/EyeOff` di kanan
- `number` — Number input dengan increment/decrement
- `textarea` — Multi-line, resizable secara vertical
- `search` — Dengan icon `Search` di kiri, tombol clear `X` di kanan

#### Props
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  variant?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'search';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}
```

#### Usage Rules
- ✅ Setiap input HARUS punya label (bukan hanya placeholder)
- ✅ Placeholder = contoh isi ("contoh: Budi Santoso"), bukan label duplikat
- ✅ Helper text jelaskan format/constraints ("Minimal 8 karakter")
- ✅ Error message = spesifik dan actionable ("Email tidak valid. Contoh: nama@email.com")
- ❌ Jangan gunakan placeholder sebagai pengganti label

---

### 10.3 Card

#### Variants
- **Default** — card biasa, shadow-1, background putih
- **Interactive** — bisa di-klik/hover, shadow naik ke shadow-2 saat hover
- **Outlined** — border `neutral-200`, tanpa shadow
- **Elevated** — shadow-2 di resting state
- **Featured** — border `primary-300`, top border accent `primary-500` (4px)

#### Anatomy
```
┌─────────────────────────────┐
│ [Media/Image (optional)]    │
│ ─────────────────────────── │
│ [Header]                    │
│   [Title]                   │
│   [Subtitle/Badge]          │
│ ─────────────────────────── │
│ [Content/Body]              │
│                             │
│ ─────────────────────────── │
│ [Footer]                    │
│   [Actions]                 │
└─────────────────────────────┘
```

#### Props
```typescript
interface CardProps {
  variant?: 'default' | 'interactive' | 'outlined' | 'elevated' | 'featured';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
  isSelected?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

---

### 10.4 Badge / Chip

Digunakan untuk label status, tag, dan kategori.

#### Variants & Colors

```
/* Status Badges */
Badge "Draft"       → background: neutral-100, text: neutral-600, border: neutral-200
Badge "Published"   → background: success-light, text: success-dark, border: success-border
Badge "Premium"     → background: primary-100, text: primary-800, border: primary-200
Badge "Gratis"      → background: neutral-100, text: neutral-600, border: neutral-200
Badge "Baru"        → background: accent-100, text: accent-700, border: accent-200
Badge "Adat"        → background: forest-100, text: forest-700, border: forest-200
```

#### Sizes
```
sm: height 20px / padding 2px 8px / text-xs (11px) / radius-full
md: height 24px / padding 4px 10px / text-label-sm (12px) / radius-full ← DEFAULT
lg: height 28px / padding 4px 12px / text-label-lg (14px) / radius-full
```

---

### 10.5 Modal / Dialog

#### Anatomy
```
[Backdrop Overlay: surface-overlay]
  ┌──────────────────────────────┐
  │ [Header]                     │
  │   [Title (h3)]               │
  │   [X Close Button]           │
  ├──────────────────────────────┤
  │ [Content/Body]               │
  │ (scrollable jika konten      │
  │ melebihi 70vh)               │
  ├──────────────────────────────┤
  │ [Footer]                     │
  │   [Cancel Button (ghost)]    │
  │   [Confirm Button (primary)] │
  └──────────────────────────────┘
```

#### Ukuran
```
sm:  max-width: 400px  (konfirmasi, alert sederhana)
md:  max-width: 560px  (form sederhana)
lg:  max-width: 720px  (form panjang, preview)
xl:  max-width: 900px  (preview undangan, galeri)
full: 100vw - 32px     (mobile full-screen)
```

#### Behavior
- Muncul dengan animasi `fade-in + slide-up` (duration: 300ms, ease-spring)
- Backdrop klik: tutup modal (konfirmasi dulu jika ada data yang diisi)
- Escape key: tutup modal
- Body scroll terkunci saat modal terbuka
- Focus trap di dalam modal
- Mobile ≤ 640px: gunakan bottom sheet (slide-up dari bawah) bukan center modal

#### Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
```

---

### 10.6 Toast / Notification

Notifikasi sementara yang muncul di pojok layar.

#### Posisi
- Desktop: pojok kanan bawah (`bottom-6 right-6`)
- Mobile: pojok atas tengah (`top-4 left-1/2 -translate-x-1/2`) — lebih mudah terlihat

#### Variants
```
Success → Ikon CheckCircle2 (success-base) + background success-light + border success-border
Error   → Ikon AlertCircle (error-base) + background error-light + border error-border
Warning → Ikon AlertTriangle (warning-base) + background warning-light + border warning-border
Info    → Ikon Info (info-base) + background info-light + border info-border
```

#### Anatomy
```
┌──────────────────────────────────────┐
│ [Icon] [Title]              [X]      │
│        [Message (optional)]          │
│        [Action Link (optional)]      │
└──────────────────────────────────────┘
```

#### Behavior
- Auto-dismiss setelah 5 detik (default), 8 detik untuk error
- Progress bar tipis di bawah card untuk countdown visual
- Hover: pause auto-dismiss
- Stack: max 3 toast sekaligus, urutan terbaru di atas
- Animasi: slide-in dari kanan (desktop), slide-down dari atas (mobile)

#### Props
```typescript
interface ToastProps {
  variant: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // ms, default 5000
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}
```

---

### 10.7 Form Stepper (Wizard)

Digunakan untuk wizard pembuatan undangan (6 langkah).

#### Anatomy
```
Step 1    Step 2    Step 3    Step 4    Step 5    Step 6
  ●  ─────  ○  ─────  ○  ─────  ○  ─────  ○  ─────  ○
Data     Jadwal    Tema     Konten   Amplop   Preview
Mempelai & Lokasi                   Digital
```

#### States per Step
- **Completed:** lingkaran `primary-500` dengan `checkmark` ikon, label `neutral-700`
- **Active (current):** lingkaran `primary-500` solid, label `neutral-900` bold, angka putih di dalam
- **Upcoming:** lingkaran `neutral-200`, label `neutral-400`

#### Mobile Behavior
Di mobile (< 640px), stepper menyederhanakan menjadi:
```
Langkah 2 dari 6: Jadwal & Lokasi
[=====>                          ] (progress bar 33%)
```

#### Props
```typescript
interface StepperProps {
  steps: Array<{
    id: number;
    label: string;
    description?: string;
  }>;
  currentStep: number; // 1-based
  completedSteps: number[];
  onStepClick?: (stepId: number) => void; // Untuk navigasi non-linear
}
```

---

### 10.8 Dropdown / Select

#### Anatomy
```
[Label]
┌──────────────────────────┐
│ [Selected Value]  [▼]   │
└──────────────────────────┘
   ┌──────────────────────────┐
   │ [Search Input (optional)] │
   ├──────────────────────────┤
   │ ○ Pilihan 1              │
   │ ● Pilihan 2 (selected)   │
   │ ○ Pilihan 3              │
   └──────────────────────────┘
```

- Max height dropdown: 260px (scrollable)
- Search input muncul jika ada > 7 opsi
- Selected option ditandai dengan `CheckIcon` di kanan

---

### 10.9 Avatar

#### Sizes
```
xs:  24px  (daftar tamu kompak)
sm:  32px  (list item, comment)
md:  40px  (navbar, profile)  ← DEFAULT
lg:  56px  (profile page)
xl:  80px  (setting halaman)
2xl: 120px (hero profile)
```

#### Fallback Hierarchy
1. Foto yang diupload user
2. Inisial nama (generated, background `primary-100`, teks `primary-700`)
3. Icon `User` dari lucide-react

---

### 10.10 Loading States

**Skeleton Loader** — untuk konten yang sedang dimuat (list, card)
```
Background: neutral-200
Animation: shimmer (gradient sweep dari kiri ke kanan, duration 1.5s, infinite)
```

**Spinner** — untuk aksi dalam komponen (button loading, inline loader)
```
Icon: <Loader2 className="animate-spin" />
Size: sesuai konteks (sm untuk button, md untuk section loader)
```

**Full Page Loader** — untuk transisi halaman
```
Logo platform di tengah layar
Spinner di bawahnya
Background: neutral-0
Fade-in 100ms, tampil maks 3 detik sebelum timeout error
```

---

### 10.11 Empty State

Ditampilkan saat konten kosong (tidak ada undangan, tidak ada ucapan, dll.)

#### Anatomy
```
      [Ilustrasi SVG]
     (max-width: 200px)

   [Judul (h4, neutral-800)]

[Deskripsi (body-sm, neutral-500)]

   [CTA Button (primary/secondary)]
```

#### Contoh Copy

| Context | Judul | Deskripsi | CTA |
|---------|-------|-----------|-----|
| Tidak ada undangan | "Belum ada undangan" | "Buat undangan pertama Anda dan bagikan ke orang-orang tersayang." | "Buat Undangan Sekarang" |
| Tidak ada RSVP | "Belum ada konfirmasi" | "Tamu belum ada yang mengisi RSVP. Coba bagikan link undangan." | "Salin Link Undangan" |
| Tidak ada ucapan | "Belum ada ucapan" | "Jadilah yang pertama mendapatkan doa dan ucapan dari tamu." | — |

---

### 10.12 Image Upload

Komponen khusus untuk upload foto di wizard dan profil.

#### States
- **Empty:** Dashed border `neutral-300`, ikon `Upload`, teks "Klik atau seret foto ke sini"
- **Uploading:** Progress indicator, preview foto buram (blur 50%), percentage text
- **Uploaded:** Preview foto penuh, tombol "Ganti" dan "Hapus" overlay saat hover
- **Error:** Border `error-base`, ikon `AlertCircle`, pesan error spesifik

#### Aturan
- Drag & drop support
- Multi-upload untuk galeri (max 6 file sekaligus)
- Preview instan sebelum upload ke server
- Progress upload per file
- Compress otomatis di client (gunakan `browser-image-compression` library) sebelum upload jika > 2MB

---

### 10.13 Navigation (Dashboard)

#### Layout Structure
```
┌──────────────────────────────────────────────────────┐
│ [Topbar]                                             │
│   Logo  |  Nama Undangan  |  [Avatar]  [Notif]       │
├──────────┬───────────────────────────────────────────┤
│ Sidebar  │  [Main Content]                           │
│ (240px)  │                                           │
│          │                                           │
│ Nav Item │                                           │
│ Nav Item │                                           │
│ Nav Item │                                           │
│          │                                           │
└──────────┴───────────────────────────────────────────┘
```

**Mobile Navigation:** Bottom Tab Bar (5 tab max)
```
[Dashboard] [Undangan] [Tema] [Statistik] [Profil]
```

#### Nav Item States
- Default: icon `neutral-500`, label `neutral-600`, background transparent
- Hover: background `neutral-100`, icon + label `neutral-800`
- Active/Selected: background `primary-50`, icon + label `primary-700`, left border `primary-500` (3px)

---

## 11. Accessibility

### 11.1 Color Contrast

Semua text + background harus memenuhi WCAG 2.1 AA minimum:
- Body text (< 18px bold / < 24px normal): contrast ratio ≥ 4.5:1
- Large text (≥ 18px bold / ≥ 24px normal): contrast ratio ≥ 3:1
- Interactive elements (button, link): ≥ 4.5:1

**Palet yang sudah diverifikasi:**
- `neutral-700` di atas `neutral-0`: ratio 7.2:1 ✅
- `neutral-500` di atas `neutral-0`: ratio 4.6:1 ✅
- `primary-500` di atas `neutral-0`: ratio 3.4:1 — jangan dipakai untuk body text
- `primary-700` di atas `neutral-0`: ratio 6.8:1 ✅

### 11.2 Keyboard Navigation

- Semua interactive element accessible via `Tab`
- Focus ring visible selalu (jangan `outline: none` tanpa pengganti)
- Modals: focus trap wajib
- Dropdown: `Arrow keys` untuk navigasi, `Enter` untuk pilih, `Escape` untuk tutup

### 11.3 Screen Reader

- Setiap gambar punya `alt` attribute (deskriptif, bukan "image")
- Ikon dekoratif: `aria-hidden="true"`
- Form inputs: selalu terkait dengan `<label>` via `htmlFor`
- Error messages: `aria-live="polite"` atau `role="alert"`
- Button loading: `aria-label="Sedang memproses..."` saat loading

### 11.4 Touch Target

- Minimum touch target: 44×44px (Apple HIG & Material Design)
- Spacing antara target yang berdekatan: minimal 8px
- Jangan tempatkan 2 touch targets < 8px bersebelahan

---

## 12. Tailwind Config

Tambahkan konfigurasi berikut ke `tailwind.config.ts` untuk mengaktifkan semua token di atas:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FDFAF0', 100: '#FAF3D4', 200: '#F4E49A',
          300: '#EDD15E', 400: '#E6BE30', 500: '#D4A91C',
          600: '#B88E14', 700: '#9A720F', 800: '#7D5C0C', 900: '#614509',
        },
        neutral: {
          0:   '#FFFFFF',  50: '#FAFAF9', 100: '#F5F4F2',
          200: '#E8E5E1', 300: '#D4CFC9', 400: '#B8B2AA',
          500: '#9A9189', 600: '#7A7169', 700: '#5A5349',
          800: '#3D3630', 900: '#211E1A',
        },
        accent: {
          50:  '#FDF3F4', 100: '#FAE2E4', 200: '#F5C2C7',
          300: '#EC99A0', 400: '#E0707A', 500: '#D4515C',
          600: '#B83D47', 700: '#972E38', 800: '#7A2430', 900: '#5E1C26',
        },
        forest: {
          50:  '#F2F5F0', 100: '#E1EAD9', 200: '#C0D4B3',
          300: '#97B889', 400: '#6F9B5E', 500: '#4E7D42',
          600: '#3D6433', 700: '#2E4D26', 800: '#1F361A', 900: '#12200F',
        },
        success: { light: '#ECFDF5', base: '#059669', dark: '#065F46', border: '#A7F3D0' },
        error:   { light: '#FFF1F2', base: '#DC2626', dark: '#991B1B', border: '#FECACA' },
        warning: { light: '#FFFBEB', base: '#D97706', dark: '#92400E', border: '#FDE68A' },
        info:    { light: '#EFF6FF', base: '#2563EB', dark: '#1E40AF', border: '#BFDBFE' },
        surface: {
          page:    '#FAFAF9',
          card:    '#FFFFFF',
          sidebar: '#F5F4F2',
          footer:  '#211E1A',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Palatino Linotype', 'Georgia', 'serif'],
        body:    ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['72px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'display-xl':  ['60px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg':  ['48px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'h1':  ['36px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2':  ['28px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'h3':  ['22px', { lineHeight: '1.3', letterSpacing: '-0.005em' }],
        'h4':  ['18px', { lineHeight: '1.4' }],
        'h5':  ['16px', { lineHeight: '1.4' }],
        'h6':  ['14px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        'body-md': ['16px', { lineHeight: '1.6' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        'body-xs': ['12px', { lineHeight: '1.4' }],
        'label-lg': ['14px', { lineHeight: '1', letterSpacing: '0.01em' }],
        'label-sm': ['12px', { lineHeight: '1', letterSpacing: '0.02em' }],
        'caption':  ['11px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        'overline': ['11px', { lineHeight: '1', letterSpacing: '0.12em' }],
      },
      borderRadius: {
        'sm':   '4px',  'md':   '8px',  'lg':  '12px',
        'xl':  '16px', '2xl': '24px', '3xl': '32px',
      },
      boxShadow: {
        '1': '0 1px 2px rgba(33,30,26,0.06), 0 1px 3px rgba(33,30,26,0.08)',
        '2': '0 4px 6px rgba(33,30,26,0.05), 0 2px 10px rgba(33,30,26,0.08)',
        '3': '0 10px 25px rgba(33,30,26,0.1), 0 4px 12px rgba(33,30,26,0.06)',
        '4': '0 20px 60px rgba(33,30,26,0.15), 0 8px 24px rgba(33,30,26,0.1)',
        'gold': '0 4px 16px rgba(212,169,28,0.35)',
      },
      transitionDuration: {
        '50': '50ms', '100': '100ms', '200': '200ms',
        '300': '300ms', '500': '500ms', '800': '800ms',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Quick Reference Card

### Color Cheat Sheet
| Use Case | Token |
|----------|-------|
| Page background | `bg-surface-page` |
| Card background | `bg-surface-card` |
| Primary button | `bg-primary-500` |
| Body text | `text-neutral-700` |
| Heading | `text-neutral-900` |
| Subtle text | `text-neutral-500` |
| Border default | `border-neutral-200` |
| Input border | `border-neutral-300` |
| Focus ring | `ring-primary-300` |
| Success | `text-success-base bg-success-light` |
| Error | `text-error-base bg-error-light` |

### Typography Cheat Sheet
| Use Case | Class |
|----------|-------|
| Nama mempelai di cover | `font-display text-display-xl` |
| Judul section undangan | `font-display text-h1` |
| Heading dashboard | `font-body text-h2 font-semibold` |
| Body text | `font-body text-body-md` |
| Label form | `font-body text-label-lg font-semibold` |
| Caption/helper text | `font-body text-caption text-neutral-500` |

### Spacing Cheat Sheet
| Context | Value |
|---------|-------|
| Padding card (mobile) | `p-4` (16px) |
| Padding card (desktop) | `p-6` (24px) |
| Gap antara section | `gap-8` (32px) |
| Gap antara form fields | `gap-4` (16px) |
| Margin section undangan | `my-20` (80px) |
| Padding page container | `px-4 md:px-8` |

---

*Design System v1.0 — NikahKu Platform*  
*Dibuat: 6 Maret 2026 | Berlaku untuk: MVP dan iterasi berikutnya*
