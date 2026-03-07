# Low-Fidelity Wireframes Spec
## Platform Undangan Pernikahan Digital — NikahKu

---
**Dokumen:** UI/UX Low-Fidelity Wireframes  
**Format:** Text-based structural representation (ASCII/Block layout)  
**Target Device:** Mobile-First (375x812px) & Desktop (1440x900px)  
**Status:** Draft for AI Agents  

> **Catatan untuk AI Agents:** Dokumen ini memberikan struktur tata letak (layout) kasar. Gunakan struktur ini dipadukan dengan **Design System Spec v1.0** untuk membangun komponen Next.js/Tailwind CSS yang presisi.

---

## DAFTAR LAYAR (SCREENS)
1. **[Tamu]** Halaman Publik Undangan (Mobile)
2. **[Tamu]** Modal RSVP & Kirim Kado
3. **[Pasangan]** Landing Page / Login
4. **[Pasangan]** Dashboard Overview (Mobile & Desktop)
5. **[Pasangan]** Wizard "Buat Undangan" (Step 1-6)
6. **[Owner]** Admin/Owner Dashboard

---

## 1. [TAMU] Halaman Publik Undangan
*Dioptimalkan untuk mobile (portrait).*

### 1.1 Hero Section
```text
┌───────────────────────────────────────┐
│              (Autoplay Music Icon) ♫  │
│                                       │
│          [ FOTO MEMPELAI ]            │
│          (Full Height/Cover)          │
│                                       │
│                                       │
│       The Wedding Of                  │
│                                       │
│       R I N A  &  A N D I             │
│                                       │
│          12 . 12 . 2026               │
│                                       │
│   [ Scroll Down Indicator ↓ ]         │
└───────────────────────────────────────┘
```

### 1.2 Greeting & Ayat
```text
┌───────────────────────────────────────┐
│                                       │
│  "Dan di antara tanda-tanda..."       │
│  (Ar-Rum: 21)                         │
│                                       │
│  Assalamu'alaikum Wr. Wb.             │
│  Dengan memohon rahmat Allah, kami    │
│  bermaksud menyelenggarakan acara     │
│  pernikahan kami:                     │
│                                       │
│  [ Foto Bulat Rina ]  [ Foto Andi ]   │
│     Rina Sari          Andi Pratama   │
│   (Putri dari..)     (Putra dari..)   │
│                                       │
└───────────────────────────────────────┘
```

### 1.3 Event Details (Akad & Resepsi)
```text
┌───────────────────────────────────────┐
│          Save the Date                │
│                                       │
│ ┌───────────────────────────────────┐ │
│ │ 💍 AKAD NIKAH                     │ │
│ │                                   │ │
│ │ Minggu, 12 Desember 2026          │ │
│ │ Pukul 08.00 - 10.00 WIB           │ │
│ │                                   │ │
│ │ Hotel Mulia Senayan (Ruang A)     │ │
│ │ [ Tombol: Buka Google Maps ]      │ │
│ │ [ Tombol: Simpan ke Kalender ]    │ │
│ └───────────────────────────────────┘ │
│                                       │
│ ┌───────────────────────────────────┐ │
│ │ 🥂 RESEPSI                        │ │
│ │                                   │ │
│ │ Minggu, 12 Desember 2026          │ │
│ │ Pukul 11.00 - 14.00 WIB           │ │
│ │ Hotel Mulia Senayan (Grand Ball)  │ │
│ │ [ Tombol: Buka Google Maps ]      │ │
│ └───────────────────────────────────┘ │
└───────────────────────────────────────┘
```

### 1.4 Gallery & Love Story
```text
┌───────────────────────────────────────┐
│             Our Moments               │
│                                       │
│  [ Foto 1 ] [ Foto 2 ] [ Foto 3 ]     │
│  [ Foto 4 ] [ Foto 5 ] [ Foto 6 ]     │
│  (Grid 2 kolom / Masonry layout)      │
│                                       │
│                                       │
│             Our Story                 │
│  2020: Pertama bertemu di kampus...   │
│  2023: Andi melamar Rina di Bali...   │
│  2026: Memulai lembaran baru...       │
└───────────────────────────────────────┘
```

### 1.5 RSVP, Wishes & Gift (Bottom)
```text
┌───────────────────────────────────────┐
│                                       │
│ ┌───────────────────────────────────┐ │
│ │ Apakah Anda akan hadir?           │ │
│ │ [ TOMBOL: ISI RSVP SEKARANG ]     │ │
│ └───────────────────────────────────┘ │
│                                       │
│ ┌───────────────────────────────────┐ │
│ │ Kirim Hadiah (Wedding Gift)       │ │
│ │ Doa restu Anda sangat berarti...  │ │
│ │ [ TOMBOL: KIRIM AMPLOP DIGITAL ]  │ │
│ └───────────────────────────────────┘ │
│                                       │
│              Ucapan & Doa             │
│ [ Input: Nama Anda ]                  │
│ [ Input: Tulis ucapan... ]            │
│ [ TOMBOL: KIRIM UCAPAN ]              │
│                                       │
│ - Budi: "Selamat ya Andi & Rina!"     │
│ - Siti: "Semoga samawa bestieku"      │
│                                       │
│      Made with ❤️ by NikahKu          │
└───────────────────────────────────────┘
```

---

## 2. [TAMU] Modal Overlays

### 2.1 Modal RSVP
```text
┌───────────────────────────────────────┐
│ [X] Tutup                             │
│           Konfirmasi RSVP             │
│ ───────────────────────────────────── │
│ Nama Tamu *                           │
│ [___________________________________] │
│                                       │
│ Kehadiran *                           │
│ (o) Ya, saya akan hadir               │
│ ( ) Maaf, saya tidak bisa hadir       │
│                                       │
│ Jumlah Tamu (Maks 2)                  │
│ [ 1 | v ]                             │
│                                       │
│ Pesan untuk mempelai (Opsional)       │
│ [___________________________________] │
│                                       │
│ [ TOMBOL PRIMARY: KIRIM RSVP ]        │
└───────────────────────────────────────┘
```

### 2.2 Modal Amplop Digital (QRIS)
```text
┌───────────────────────────────────────┐
│ [X] Tutup                             │
│            Amplop Digital             │
│ ───────────────────────────────────── │
│ Silakan scan QRIS atau transfer ke    │
│ rekening di bawah ini:                │
│                                       │
│         [ GAMBAR QRIS MEMPELAI ]      │
│            (Bisa di-zoom)             │
│         [ Tombol: Simpan QRIS ]       │
│                                       │
│ ───────────────────────────────────── │
│ Atau transfer bank:                   │
│                                       │
│ BANK BCA                              │
│ 1234567890                            │
│ a.n Andi Pratama                      │
│ [ TOMBOL: SALIN NOMOR ]               │
│                                       │
│ BANK MANDIRI                          │
│ 0987654321                            │
│ a.n Rina Sari                         │
│ [ TOMBOL: SALIN NOMOR ]               │
└───────────────────────────────────────┘
```

---

## 3. [PASANGAN] Auth & Landing Page

### 3.1 Landing Page (Mobile View)
```text
┌───────────────────────────────────────┐
│ [LOGO]                        [Login] │
│ ───────────────────────────────────── │
│                                       │
│  Buat Undangan Digital Cantik         │
│  Dalam 5 Menit.                       │
│                                       │
│  Praktis, Elegan, dan Terintegrasi    │
│  dengan Amplop Digital QRIS.          │
│                                       │
│  [ TOMBOL: BUAT UNDANGAN GRATIS ]     │
│                                       │
│  [ Image: Mockup HP Undangan ]        │
│                                       │
│ ───────────────────────────────────── │
│  Fitur Unggulan:                      │
│  - Tema Premium                       │
│  - AI Copywriter                      │
│  - Amplop QRIS                        │
└───────────────────────────────────────┘
```

### 3.2 Login / Register Modal
```text
┌───────────────────────────────────────┐
│                                       │
│               [LOGO]                  │
│        Masuk ke Akun Anda             │
│                                       │
│ Email                                 │
│ [___________________________________] │
│ Password                              │
│ [___________________________________] │
│                                       │
│ [ TOMBOL PRIMARY: MASUK ]             │
│                                       │
│          -- ATAU --                   │
│                                       │
│ [ [G] Masuk dengan Google ]           │
│                                       │
│ Belum punya akun? Daftar di sini      │
└───────────────────────────────────────┘
```

---

## 4. [PASANGAN] Dashboard Overview

### 4.1 Desktop Dashboard (Layout Kiri-Kanan)
```text
┌────────────────┬────────────────────────────────────────────────────────────┐
│ [LOGO]         │  Halo, Rina & Andi!                          [🔔] [Avatar] │
│                ├────────────────────────────────────────────────────────────┤
│ ≡ MENU         │                                                            │
│ ◘ Dashboard    │  Undangan Aktif Anda                                       │
│ ✉ Undangan     │  ┌──────────────────────────────────────────────────────┐  │
│ 🎨 Tema        │  │ [Thumbnail]  Rina & Andi Wedding              [Share]│  │
│ 📊 Statistik   │  │              Status: Published | Gratis       [Edit] │  │
│ ⚙ Pengaturan   │  │              nikahku.id/u/rina-andi                  │  │
│                │  └──────────────────────────────────────────────────────┘  │
│ [Premium Badge]│                                                            │
│                │  Statistik Cepat                              [Lihat Detail] │
│                │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│                │  │ 👁️ Views     │  │ ✉️ RSVP      │  │ 💬 Ucapan    │      │
│                │  │ 1,204        │  │ 150 Hadir    │  │ 45           │      │
│                │  └──────────────┘  └──────────────┘  └──────────────┘      │
│                │                                                            │
│                │  [ TOMBOL PRIMARY: + BUAT UNDANGAN BARU ]                  │
└────────────────┴────────────────────────────────────────────────────────────┘
```

### 4.2 Mobile Dashboard (Bottom Nav)
```text
┌───────────────────────────────────────┐
│ [LOGO]                       [Avatar] │
│ ───────────────────────────────────── │
│ Halo, Rina & Andi!                    │
│                                       │
│ Undangan Aktif:                       │
│ ┌───────────────────────────────────┐ │
│ │ Rina & Andi Wedding               │ │
│ │ Status: Published                 │ │
│ │                                   │ │
│ │ [Share]   [Preview]   [Edit]      │ │
│ └───────────────────────────────────┘ │
│                                       │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ 👁️ 1.2K │ │ ✉️ 150  │ │ 💬 45   │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│                                       │
│ [ TOMBOL PRIMARY: + BUAT UNDANGAN ]   │
│                                       │
│ ───────────────────────────────────── │
│ [Dash]  [Undangan]  [Tema]  [Setting] │
└───────────────────────────────────────┘
```

---

## 5. [PASANGAN] Wizard "Buat Undangan" (Mobile First)

### Layout Dasar Wizard
```text
┌───────────────────────────────────────┐
│ < Kembali        Simpan Draft [Save]  │
│ ───────────────────────────────────── │
│ Progress: [=======      ] Step 2 of 6 │
│ ───────────────────────────────────── │
│ [ KONTEN FORM DI SINI ]               │
│                                       │
│                                       │
│                                       │
│                                       │
│ ───────────────────────────────────── │
│ [ Secondary: Mundur ] [ Primary: Lanjut ]
└───────────────────────────────────────┘
```

### Step 1: Data Mempelai
```text
[ KONTEN FORM ]
Data Mempelai Pria
Nama Lengkap *
[___________________________________]
Nama Panggilan *
[___________________________________]
Nama Orang Tua (Opsional)
[___________________________________]

Data Mempelai Wanita
Nama Lengkap *
[___________________________________]
...
```

### Step 3: Pilih Tema
```text
[ KONTEN FORM ]
Pilih Tema Undangan
[ Filter: Semua | Minimalis | Adat ]

┌───────────────┐ ┌───────────────┐
│ [Thumbnail 1] │ │ [Thumbnail 2] │
│ Minimalist    │ │ Javanese      │
│ Gratis        │ │ Premium       │
│ (o) Pilih     │ │ ( ) Pilih     │
└───────────────┘ └───────────────┘
[Tombol: Preview Tema]
```

### Step 4: Konten & Media (Dengan AI)
```text
[ KONTEN FORM ]
Upload Foto Utama (Cover)
[ + Area Drop/Upload Foto ]

Teks Sambutan Pembuka
[___________________________________]
[___________________________________]
[ ✨ BANTU TULIS DENGAN AI ] <--- Tombol AI

  // Jika tombol AI diklik, muncul popover:
  // "Gaya bahasa apa yang dimau?"
  // [Dropdown: Formal/Islami/Santai]
  // [Generate]

Cerita Cinta (Opsional)
[___________________________________]
```

### Step 5: Amplop Digital & QRIS
```text
[ KONTEN FORM ]
Aktifkan Fitur Amplop Digital?
(o) Ya   ( ) Tidak

Upload QRIS Anda
[ + Upload Gambar QRIS ]

Tambah Rekening Bank
Bank: [ Pilih Bank v ]
No Rekening: [____________]
Atas Nama: [______________]
[ + Tambah Rekening Lain ]
```

### Step 6: Preview & Publish
```text
[ KONTEN FORM ]
Yay! Undangan Anda sudah siap.

[ FRAME MOCKUP HP MUNCUL DI SINI ]
[ BERISI PREVIEW LIVE UNDANGAN ]

URL Undangan Anda:
nikahku.id/u/ [ rina-andi-2026 ]

[ TOMBOL PRIMARY BESAR: PUBLISH SEKARANG ]
```

---

## 6. [OWNER] Dashboard Bisnis (Desktop)

```text
┌────────────────┬────────────────────────────────────────────────────────────┐
│ [LOGO] Admin   │  Owner Dashboard                             [🔔] [Avatar] │
│                ├────────────────────────────────────────────────────────────┤
│ ≡ MENU         │  Overview (Bulan Ini)                                      │
│ ◘ Analytics    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│ 👥 Users       │  │ 👥 Total User│  │ ✉️ Undangan  │  │ 💰 Revenue   │      │
│ 🎨 Kelola Tema │  │ 520 (+12%)   │  │ 310 Aktif    │  │ Rp 4.5M      │      │
│ 💳 Payments    │  └──────────────┘  └──────────────┘  └──────────────┘      │
│                │                                                            │
│                │  Recent Transactions (QRIS)                                │
│                │  | Tanggal   | User          | Paket   | Status    |       │
│                │  |-----------|---------------|---------|-----------|       │
│                │  | 12/03/26  | andi@mail.com | Premium | [SUCCESS] |       │
│                │  | 12/03/26  | budi@mail.com | Premium | [PENDING] |       │
│                │                                                            │
│                │  AI Usage Stats                                            │
│                │  - AI Copywriter dipakai 140 kali minggu ini               │
└────────────────┴────────────────────────────────────────────────────────────┘
```
