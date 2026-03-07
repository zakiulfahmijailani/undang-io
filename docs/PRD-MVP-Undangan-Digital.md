# Product Requirements Document (PRD)
## Platform Undangan Pernikahan Digital – MVP

---

**Document Information**
- **Product Name:** NikahKu (nama sementara, dapat disesuaikan)
- **Version:** 1.0 (MVP)
- **Date Created:** 6 Maret 2026
- **Owner:** Zakiul Fahmi Jailani
- **Status:** Draft untuk AI Agents Development

---

## 1. Executive Summary

### 1.1 Product Vision
Menjadi platform undangan pernikahan digital paling mudah digunakan dan paling cantik di Indonesia, berbasis AI, yang memungkinkan pasangan membuat, mengelola, dan menyebarkan undangan pernikahan dalam hitungan menit dengan pengalaman mobile-first dan integrasi pembayaran QRIS seamless.

### 1.2 Problem Statement
**Masalah yang Dipecahkan:**

1. **Kompleksitas pembuatan undangan digital:** Platform existing sering membingungkan user awam dengan terlalu banyak pilihan dan alur yang tidak jelas.
2. **Estetika generik:** Template yang tersedia terlihat mirip satu sama lain dan tidak cukup premium untuk pasangan yang peduli estetika.
3. **Kesulitan copywriting:** Pasangan kesulitan menulis teks undangan yang baik dalam Bahasa Indonesia (sambutan, doa, cerita cinta).
4. **Fragmentasi pembayaran:** Upgrade paket dan pengelolaan amplop digital tidak terintegrasi dengan baik, sering masih manual.
5. **UX tidak dioptimalkan untuk Indonesia:** Bahasa yang kaku, tidak memahami konteks budaya lokal, dan tidak mobile-first.

### 1.3 Success Metrics (MVP)

| Metric | Target MVP (3 bulan) | Measurement Method |
|--------|---------------------|-------------------|
| **User Acquisition** | 500 pasangan terdaftar | Database query |
| **Activation Rate** | 60% user membuat minimal 1 undangan | Funnel analysis |
| **Completion Rate** | 70% undangan yang dibuat di-publish | Invitation status tracking |
| **Conversion to Paid** | 15% dari published invitations upgrade ke paket berbayar | Payment transactions |
| **Time to First Invitation** | Rata-rata ≤15 menit dari sign-up hingga publish | User journey analytics |
| **Mobile Usage** | ≥80% traffic dari mobile | Analytics |
| **QRIS Adoption** | 70% pembayaran paket via QRIS | Payment method split |

---

## 2. Target Users & Personas

### 2.1 Primary Persona: Pasangan Pengantin (Pembuat Undangan)

**Persona 1: Rina & Andi**
- **Demografi:** 
  - Usia: 26-29 tahun
  - Lokasi: Jakarta, Bandung, Surabaya (urban)
  - Pekerjaan: Karyawan swasta, freelancer
  - Digital literacy: Medium (bisa pakai Instagram, WhatsApp, e-commerce)
  
- **Karakteristik:**
  - Sibuk bekerja, hanya punya waktu malam/weekend untuk urus pernikahan
  - Ingin undangan yang cantik tapi tidak mau ribet
  - Budget terbatas tapi mau hasil yang "wow"
  - Aktif di sosial media, peduli estetika
  - Takut "salah klik" atau "merusak desain"
  
- **Goals:**
  - Buat undangan cantik dalam waktu singkat
  - Mudah dibagikan via WhatsApp ke ratusan tamu
  - Dapat tracking RSVP real-time
  - Terima amplop digital dengan mudah
  
- **Pain Points:**
  - Bingung mulai dari mana
  - Tidak bisa menulis teks yang bagus
  - Takut pilihan tema salah
  - Proses pembayaran ribet

### 2.2 Secondary Persona: Tamu Undangan

**Persona 2: Pak Budi (45 tahun, kerabat keluarga)**
- **Karakteristik:**
  - Menggunakan smartphone tapi tidak terlalu tech-savvy
  - Menerima undangan via WhatsApp
  - Ingin RSVP dengan mudah
  - Ingin kirim amplop digital tapi tidak paham cara transfer online
  
- **Goals:**
  - Baca undangan dengan jelas
  - RSVP dengan cepat
  - Kirim hadiah dengan mudah (QRIS)
  
- **Pain Points:**
  - Website lambat/berat
  - Instruksi tidak jelas
  - Takut salah transfer

### 2.3 Tertiary Persona: Admin/CS Internal & Owner

**Persona 3: Tim Internal**
- Admin CS: Perlu tools untuk support user
- Owner (Anda): Perlu dashboard bisnis untuk monitoring metrics

---

## 3. Core Features for MVP

### 3.1 Feature Overview Table

| Feature | Priority | User Role | Description |
|---------|----------|-----------|-------------|
| **Authentication & User Management** | P0 (Must-Have) | Pasangan, Admin | Sign-up, login, profile management via Supabase Auth |
| **Wizard Pembuatan Undangan** | P0 | Pasangan | Flow step-by-step untuk buat undangan pertama kali |
| **Template Tema (5-8 tema MVP)** | P0 | Pasangan | Koleksi tema pre-designed yang bisa dipilih dan di-preview |
| **Halaman Undangan Publik** | P0 | Tamu | Landing page undangan dengan semua info (responsive, fast) |
| **Editor Konten Dasar** | P0 | Pasangan | Form untuk edit data mempelai, jadwal, lokasi, galeri foto |
| **RSVP & Guestbook** | P0 | Tamu | Form RSVP sederhana + ucapan & doa |
| **Integrasi QRIS untuk Paket** | P0 | Pasangan | Upgrade ke paket premium dengan bayar via QRIS |
| **Amplop Digital (QRIS Pasangan)** | P0 | Tamu, Pasangan | Tamu kirim hadiah ke rekening/QRIS mempelai |
| **Dashboard Pasangan** | P0 | Pasangan | Kelola undangan, lihat statistik dasar (views, RSVP) |
| **AI Copywriting Assistant** | P1 (Nice-to-Have MVP) | Pasangan | Generate teks sambutan, doa, love story dalam Bahasa Indonesia |
| **AI Theme Recommendation** | P2 (Post-MVP) | Pasangan | Rekomendasi tema berdasarkan preferensi |
| **Dashboard Admin** | P1 | Admin | Moderasi, support, manajemen tema |
| **Dashboard Owner** | P1 | Owner | Business metrics, revenue tracking |

**Priority Levels:**
- **P0 (Must-Have):** Fitur inti yang tanpanya produk tidak bisa digunakan
- **P1 (Nice-to-Have MVP):** Fitur yang menambah value signifikan tapi bisa ditunda
- **P2 (Post-MVP):** Fitur untuk iterasi berikutnya

---

### 3.2 Feature Details

---

#### **FEATURE 1: Authentication & User Management**

**Objective:** Memungkinkan user mendaftar, login, dan mengelola profil dengan aman dan mudah.

**User Stories:**
1. Sebagai pasangan, saya ingin daftar dengan email/password atau sosial login agar bisa mulai membuat undangan.
2. Sebagai pasangan, saya ingin reset password jika lupa.
3. Sebagai sistem, saya perlu memastikan setiap user hanya bisa akses data mereka sendiri.

**Functional Requirements:**
- Sign-up via email + password atau Google Sign-In (Supabase Auth)
- Email verification untuk keamanan
- Login page dengan "Lupa Password"
- Profile page: edit nama, nomor HP, foto profil
- Role-based access: `user` (pasangan), `admin`, `owner`

**Technical Specifications:**
- **Tech Stack:** Supabase Auth, Next.js App Router
- **Database Tables:** 
  - `auth.users` (Supabase built-in)
  - `public.profiles` (user metadata: full_name, phone, avatar_url, role)
- **Security:** Row Level Security (RLS) di Supabase untuk memastikan data isolation

**Acceptance Criteria:**
- [ ] User bisa sign-up dengan email dan menerima email verifikasi
- [ ] User bisa login dengan email/password atau Google
- [ ] User bisa reset password via email
- [ ] User bisa edit profile (nama, nomor HP, foto)
- [ ] Setiap user hanya bisa melihat data undangan milik mereka sendiri

**Out of Scope (Not Doing):**
- Multi-user collaboration (misalnya pasangan login bersama ke satu undangan)
- Social login selain Google (Facebook, Apple, dll.)

---

#### **FEATURE 2: Wizard Pembuatan Undangan**

**Objective:** Membuat proses pembuatan undangan pertama kali menjadi sangat mudah dan terarah dengan flow step-by-step dalam Bahasa Indonesia.

**User Stories:**
1. Sebagai pasangan baru, saya ingin dibimbing step-by-step agar tidak bingung mulai dari mana.
2. Sebagai pasangan, saya ingin bisa menyimpan progress dan lanjutkan nanti jika belum selesai.
3. Sebagai pasangan, saya ingin lihat preview undangan sebelum publish.

**Flow Steps:**

**Step 1: Data Mempelai**
- Nama lengkap pengantin pria
- Nama panggilan pengantin pria
- Nama lengkap pengantin wanita
- Nama panggilan pengantin wanita
- Nama orang tua (opsional)
- Instagram/sosial media (opsional)

**Step 2: Jadwal & Lokasi Acara**
- Jenis acara (Akad, Resepsi, atau keduanya)
- Tanggal & waktu
- Nama venue
- Alamat lengkap
- Link Google Maps
- Catatan tambahan (opsional: dress code, parking info)

**Step 3: Pilih Tema**
- Galeri tema dengan preview
- Filter: warna, style (minimalis, floral, adat)
- Label: Gratis / Premium

**Step 4: Konten & Media**
- Upload foto mempelai (1-3 foto)
- Upload foto galeri prewedding (opsional, max 6 foto)
- Teks sambutan/opening (dengan tombol "Bantu tulis dengan AI")
- Cerita cinta singkat (opsional, dengan AI assist)
- Doa/quotes favorit (opsional)

**Step 5: Amplop Digital & QRIS**
- Aktifkan fitur amplop digital: Ya/Tidak
- Jika Ya: masukkan nomor rekening atau upload QRIS pasangan
- Instruksi untuk tamu (auto-generated, bisa diedit)

**Step 6: Preview & Publish**
- Preview undangan dalam iframe/modal
- Tombol "Edit" untuk kembali ke step sebelumnya
- Tombol "Publish" → generate slug unik (misal: `nikahku.id/u/rina-andi-2026`)
- Notifikasi sukses + link undangan siap dibagikan

**Functional Requirements:**
- Progress bar di setiap step
- Validasi form (field wajib, format)
- Auto-save draft setiap 30 detik atau saat pindah step
- Navigasi: tombol "Lanjut" dan "Kembali"
- Responsive untuk mobile (mayoritas user)

**Technical Specifications:**
- **UI Framework:** React Hook Form + Zod validation
- **Database Tables:**
  - `invitations` (id, user_id, slug, theme_id, status: draft/published, created_at, updated_at)
  - `invitation_content` (invitation_id, groom_name, bride_name, event_date, venue, address, maps_url, greeting_text, love_story, photos, qris_info, etc.)
- **Storage:** Supabase Storage untuk foto/media

**Acceptance Criteria:**
- [ ] User bisa melengkapi 6 langkah wizard tanpa error
- [ ] Draft auto-save berfungsi (user bisa keluar dan lanjutkan nanti)
- [ ] Validasi field wajib: nama mempelai, tanggal, lokasi
- [ ] Preview undangan akurat sesuai input user
- [ ] Setelah publish, undangan bisa diakses via slug unik
- [ ] Slug undangan unik dan tidak bentrok dengan undangan lain

**Out of Scope:**
- Multi-event (misalnya akad di kota A, resepsi di kota B) → post-MVP
- Import data dari file Excel/CSV

---

#### **FEATURE 3: Template Tema (5-8 Tema MVP)**

**Objective:** Menyediakan koleksi tema undangan yang sangat estetis, modern, dan responsif untuk berbagai preferensi pasangan.

**User Stories:**
1. Sebagai pasangan, saya ingin memilih tema yang sesuai dengan konsep pernikahan kami (minimalis, floral, adat Jawa, modern, dll.).
2. Sebagai pasangan, saya ingin preview tema sebelum memilih.
3. Sebagai pasangan, saya ingin bisa ganti tema setelah undangan dibuat tanpa kehilangan konten.

**Tema MVP (5-8 pilihan):**

1. **Minimalist White** (Gratis)
   - Warna: Putih, krem, aksen emas tipis
   - Gaya: Clean, modern, banyak whitespace
   - Cocok untuk: Pasangan yang suka simple & elegan

2. **Garden Romance** (Gratis)
   - Warna: Hijau daun, pink soft, putih
   - Gaya: Floral illustrations, romantic
   - Cocok untuk: Garden party, outdoor wedding

3. **Classic Javanese** (Premium)
   - Warna: Coklat, emas, hijau tua
   - Gaya: Ornamen batik, wayang, tradisional Jawa
   - Cocok untuk: Pernikahan adat Jawa

4. **Modern Bold** (Gratis)
   - Warna: Hitam, putih, aksen navy/burgundy
   - Gaya: Typography kuat, geometris
   - Cocok untuk: Pasangan urban, contemporary

5. **Rustic Boho** (Premium)
   - Warna: Terakota, krem, hijau olive
   - Gaya: Tekstur natural, ilustrasi hand-drawn
   - Cocok untuk: Intimate wedding, vintage vibe

6. **Sundanese Elegance** (Premium)
   - Warna: Maroon, emas, krem
   - Gaya: Ornamen Sunda, angklung motif
   - Cocok untuk: Pernikahan adat Sunda

**Functional Requirements:**
- Galeri tema di dashboard dengan thumbnail preview
- Filter: style (minimalis, floral, adat), warna dominan
- Tag: Gratis / Premium
- Preview modal: klik tema → lihat contoh undangan dengan dummy content
- Ganti tema: pasangan bisa switch tema tanpa menghapus data yang sudah diinput

**Technical Specifications:**
- **Database Table:** 
  - `themes` (id, name, slug, description, category, tags, is_premium, thumbnail_url, demo_url, created_at)
- **Implementation:** 
  - Tema = kombinasi CSS variables + React components
  - Setiap tema punya folder: `/components/themes/[theme-slug]`
  - Data undangan tetap sama, hanya "skin" yang berubah

**Acceptance Criteria:**
- [ ] Minimal 5 tema tersedia di galeri
- [ ] Preview tema berfungsi dengan dummy content
- [ ] User bisa ganti tema dan konten undangan tidak hilang
- [ ] Tema responsive di mobile, tablet, desktop
- [ ] Loading tema cepat (<2 detik)

**Out of Scope:**
- Custom theme builder (user bikin tema sendiri)
- Animasi 3D/video heavy (untuk performa)

---

#### **FEATURE 4: Halaman Undangan Publik**

**Objective:** Menampilkan undangan pernikahan yang cantik, cepat, dan mudah diakses oleh tamu via link unik.

**User Stories:**
1. Sebagai tamu, saya ingin membuka undangan dengan cepat dari link WhatsApp.
2. Sebagai tamu, saya ingin melihat semua informasi penting: tanggal, lokasi, jadwal acara.
3. Sebagai tamu, saya ingin bisa RSVP dan mengirim ucapan langsung dari halaman undangan.
4. Sebagai tamu, saya ingin bisa kirim amplop digital dengan mudah.

**Layout Sections (berdasarkan tema, tapi struktur umum):**

1. **Hero Section**
   - Nama pasangan (pengantin pria & wanita)
   - Tanggal pernikahan
   - Foto utama mempelai
   - Musik latar (opsional, auto-play atau play on click)

2. **Greeting/Sambutan**
   - Teks pembuka (misalnya: "Assalamu'alaikum Wr. Wb. Dengan memohon rahmat...")
   - Kutipan Al-Qur'an atau quote romantis

3. **Detail Acara**
   - Akad Nikah: tanggal, waktu, lokasi
   - Resepsi: tanggal, waktu, lokasi
   - Tombol "Lihat Peta" (Google Maps)
   - Tombol "Tambahkan ke Kalender" (Google Calendar .ics)

4. **Cerita Cinta (Opsional)**
   - Timeline singkat hubungan
   - Foto couple

5. **Galeri Foto Prewedding**
   - Grid atau slider foto (max 6 foto)
   - Lightbox untuk zoom

6. **RSVP**
   - Form sederhana: Nama, Hadir/Tidak Hadir, Jumlah Tamu, Pesan
   - Tombol "Kirim RSVP"

7. **Ucapan & Doa**
   - List ucapan dari tamu lain
   - Form untuk kirim ucapan baru

8. **Amplop Digital / Wedding Gift**
   - Teks: "Doa Restu Anda adalah karunia terindah bagi kami. Namun jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless."
   - QR Code atau tombol "Kirim Hadiah" → QRIS
   - Nomor rekening (BCA, Mandiri, dll.)

9. **Footer**
   - Ucapan terima kasih
   - Credits: "Made with ❤️ by NikahKu"

**Functional Requirements:**
- URL structure: `nikahku.id/u/[slug]` atau `[slug].nikahku.id` (custom subdomain optional post-MVP)
- Fast loading: lazy load images, optimized assets
- Mobile-first responsive
- SEO: Open Graph tags untuk preview di WhatsApp
- Musik autoplay (dengan permission) atau play button

**Technical Specifications:**
- **Tech Stack:** Next.js App Router, dynamic route `[slug]`
- **Data Fetching:** 
  - `getInvitationBySlug(slug)` dari Supabase
  - Server-side rendering (SSR) atau Static Site Generation (SSG) untuk performa
- **CDN:** Vercel Edge Network
- **Analytics:** Track page views per invitation

**Acceptance Criteria:**
- [ ] Undangan load dalam <3 detik di koneksi 4G
- [ ] Responsive di semua ukuran layar (mobile, tablet, desktop)
- [ ] Musik latar berfungsi (dengan user permission)
- [ ] Tombol "Lihat Peta" buka Google Maps dengan koordinat yang benar
- [ ] RSVP dan Ucapan bisa dikirim dan langsung muncul di halaman
- [ ] QRIS dan nomor rekening tampil dengan jelas
- [ ] WhatsApp preview (thumbnail, title, description) benar

**Out of Scope:**
- Video background full-page (untuk performa)
- Live streaming integration (post-MVP)

---

#### **FEATURE 5: Editor Konten Dasar**

**Objective:** Memungkinkan pasangan mengedit konten undangan (teks, foto, data acara) dengan mudah setelah undangan dibuat.

**User Stories:**
1. Sebagai pasangan, saya ingin mengubah teks sambutan atau cerita cinta setelah undangan di-publish.
2. Sebagai pasangan, saya ingin mengganti foto mempelai atau galeri prewedding.
3. Sebagai pasangan, saya ingin update informasi acara (misalnya venue berubah).

**Functional Requirements:**
- Halaman "Edit Undangan" di dashboard
- Form untuk setiap section: Data Mempelai, Acara, Konten, Galeri, Amplop Digital
- Auto-save setiap perubahan
- Preview live (opsional: side-by-side preview saat edit)
- Tombol "Simpan & Publish" → update langsung di halaman publik

**Technical Specifications:**
- Reuse form components dari wizard
- Update `invitation_content` table
- Invalidate cache jika menggunakan SSG

**Acceptance Criteria:**
- [ ] Pasangan bisa edit semua field yang di-input saat wizard
- [ ] Perubahan auto-save
- [ ] Perubahan langsung terlihat di halaman publik setelah "Simpan & Publish"
- [ ] Upload foto baru menggantikan foto lama

**Out of Scope:**
- Version history / rollback changes
- Collaborative editing (dua orang edit simultan)

---

#### **FEATURE 6: RSVP & Guestbook**

**Objective:** Memudahkan tamu untuk konfirmasi kehadiran dan mengirim ucapan/doa kepada pasangan.

**User Stories:**
1. Sebagai tamu, saya ingin RSVP dengan cepat tanpa harus login.
2. Sebagai tamu, saya ingin mengirim ucapan dan doa untuk pasangan.
3. Sebagai pasangan, saya ingin melihat daftar tamu yang sudah RSVP dan membaca ucapan mereka.

**RSVP Form Fields:**
- Nama Tamu (wajib)
- Hadir / Tidak Hadir (radio button)
- Jumlah Tamu (dropdown: 1, 2, 3, 4, 5+)
- Pesan/Catatan (opsional)

**Guestbook/Ucapan Form Fields:**
- Nama (wajib)
- Ucapan & Doa (textarea, wajib)
- Tombol "Kirim Ucapan"

**Functional Requirements:**
- Form sederhana, validasi client-side + server-side
- Captcha sederhana (Cloudflare Turnstile atau honeypot) untuk cegah spam
- Ucapan tampil real-time atau setelah refresh (opsional: live update dengan Supabase Realtime)
- Moderasi ucapan: admin bisa hide ucapan yang tidak pantas (post-MVP)

**Technical Specifications:**
- **Database Tables:**
  - `rsvp` (id, invitation_id, guest_name, attendance_status, number_of_guests, message, created_at)
  - `guestbook` (id, invitation_id, guest_name, message, created_at, is_visible)
- **API:** Supabase RPC atau REST API

**Acceptance Criteria:**
- [ ] Tamu bisa RSVP tanpa login
- [ ] Form validasi: nama dan status kehadiran wajib
- [ ] Ucapan baru muncul di halaman undangan setelah submit
- [ ] Pasangan bisa lihat list RSVP di dashboard (nama, status, jumlah)
- [ ] Pasangan bisa lihat semua ucapan di dashboard

**Out of Scope:**
- QR code check-in di hari H (post-MVP)
- Email notifikasi ke pasangan setiap ada RSVP baru (post-MVP)

---

#### **FEATURE 7: Integrasi QRIS untuk Paket**

**Objective:** Memungkinkan pasangan upgrade dari paket gratis ke paket premium dengan pembayaran QRIS yang mudah dan aman.

**User Stories:**
1. Sebagai pasangan, saya ingin upgrade ke paket premium untuk unlock tema eksklusif dan fitur tambahan.
2. Sebagai pasangan, saya ingin bayar dengan QRIS karena saya tidak punya kartu kredit.
3. Sebagai sistem, saya perlu verifikasi pembayaran otomatis dan unlock fitur premium setelah bayar.

**Paket Pricing (MVP - Contoh):**

| Paket | Harga | Fitur |
|-------|-------|-------|
| **Gratis** | Rp 0 | - 3 tema dasar<br>- Maksimal 3 foto galeri<br>- RSVP & Guestbook<br>- Branding "NikahKu" di footer |
| **Premium** | Rp 99.000 | - Semua tema (8 tema)<br>- Unlimited foto galeri<br>- AI Copywriting Assistant<br>- Remove branding<br>- Custom domain (opsional)<br>- Priority support |

**Functional Requirements:**
- Halaman "Upgrade Paket" di dashboard
- Perbandingan fitur Gratis vs Premium
- Tombol "Upgrade Sekarang"
- Redirect ke payment gateway (Midtrans/Xendit/Faspay) untuk generate QRIS
- Halaman status pembayaran: Pending, Success, Failed
- Webhook untuk terima notifikasi dari payment gateway
- Otomatis unlock fitur premium setelah pembayaran sukses

**Technical Specifications:**
- **Payment Gateway:** Midtrans Snap (atau Xendit) dengan QRIS payment method
- **Database Table:**
  - `subscription_plans` (id, name, price, features_json)
  - `payments` (id, user_id, invitation_id, plan_id, amount, status, payment_method, transaction_id, paid_at, created_at)
- **Webhook Endpoint:** `/api/webhooks/payment` (Next.js API route) untuk handle callback dari gateway
- **Security:** Verify webhook signature, HTTPS only

**Payment Flow:**
1. User klik "Upgrade Premium"
2. Backend create payment session via payment gateway API
3. Gateway return QRIS code atau redirect URL
4. User scan QRIS dengan mobile banking
5. Gateway kirim webhook ke backend setelah pembayaran sukses
6. Backend update `payments.status = 'success'` dan `invitations.plan_id = premium`
7. User diarahkan ke halaman sukses + fitur premium aktif

**Acceptance Criteria:**
- [ ] User bisa lihat perbandingan paket di dashboard
- [ ] User bisa klik "Upgrade" dan diarahkan ke payment page
- [ ] QRIS code tampil dan bisa di-scan
- [ ] Setelah bayar, status berubah jadi "Success" dalam <1 menit
- [ ] Fitur premium (tema eksklusif, AI) langsung bisa diakses
- [ ] Receipt/invoice bisa diunduh (opsional)

**Out of Scope:**
- Pembayaran recurring/subscription (sementara one-time payment)
- Metode pembayaran lain (kartu kredit, VA) di MVP (fokus QRIS dulu)

---

#### **FEATURE 8: Amplop Digital (QRIS Pasangan)**

**Objective:** Memudahkan tamu untuk mengirim hadiah/amplop pernikahan secara cashless langsung ke rekening pasangan.

**User Stories:**
1. Sebagai tamu, saya ingin kirim hadiah pernikahan dengan mudah tanpa bawa uang tunai.
2. Sebagai pasangan, saya ingin menerima hadiah digital langsung ke rekening kami.
3. Sebagai pasangan, saya ingin bisa lihat ringkasan hadiah yang masuk (opsional, jika ada tracking).

**Functional Requirements:**
- Section "Amplop Digital" di halaman undangan publik
- Pasangan input data di wizard atau edit undangan:
  - Upload QRIS code (gambar)
  - Atau nomor rekening bank (BCA, Mandiri, BNI, dll.)
  - Nama penerima (otomatis dari data mempelai)
- Tampilan untuk tamu:
  - Teks: "Kirim Hadiah"
  - QRIS code bisa di-zoom atau download
  - Nomor rekening dengan tombol "Salin"
  - Instruksi singkat

**Important Note (Legal/Compliance):**
- Versi MVP: Platform hanya MENAMPILKAN rekening/QRIS milik pasangan, transaksi langsung peer-to-peer (P2P), bukan melalui platform.
- Platform tidak menyimpan atau mengelola uang (non-custodial).
- Disclaimer: "Kami tidak bertanggung jawab atas transaksi yang terjadi. Pastikan Anda mengirim ke rekening yang benar."

**Technical Specifications:**
- **Storage:** Simpan QRIS image di Supabase Storage
- **Database:** Field `qris_image_url`, `bank_accounts` (JSON array) di `invitation_content`
- Tidak perlu integrasi payment gateway untuk amplop (berbeda dengan paket upgrade)

**Acceptance Criteria:**
- [ ] Pasangan bisa upload QRIS code atau input nomor rekening
- [ ] QRIS code tampil jelas di halaman undangan, bisa di-zoom
- [ ] Tombol "Salin Nomor Rekening" berfungsi
- [ ] Instruksi untuk tamu jelas dan mudah diikuti
- [ ] Disclaimer legal ditampilkan

**Out of Scope (MVP):**
- Tracking hadiah yang masuk (butuh integrasi perbankan, kompleks)
- Platform sebagai escrow/perantara (regulasi berat)

---

#### **FEATURE 9: Dashboard Pasangan**

**Objective:** Memberikan pasangan satu tempat untuk mengelola undangan dan melihat statistik dasar.

**User Stories:**
1. Sebagai pasangan, saya ingin melihat semua undangan yang pernah saya buat.
2. Sebagai pasangan, saya ingin tahu berapa orang yang sudah buka undangan dan berapa yang sudah RSVP.
3. Sebagai pasangan, saya ingin bisa edit atau hapus undangan.

**Dashboard Sections:**

**1. Overview/Home**
- Ringkasan undangan aktif
- Quick stats:
  - Total views
  - Total RSVP (Hadir vs Tidak Hadir)
  - Total ucapan
- CTA: "Buat Undangan Baru"

**2. Kelola Undangan**
- List undangan (card view):
  - Thumbnail tema
  - Nama undangan (Nama Mempelai)
  - Status: Draft / Published
  - Link undangan
  - Tombol: Edit, Preview, Share, Hapus
- Filter: Semua, Draft, Published

**3. Statistik Detail (per undangan)**
- Jumlah views (page views)
- Grafik views per hari (opsional, nice-to-have)
- Daftar RSVP:
  - Nama tamu, Status (Hadir/Tidak), Jumlah tamu
  - Export to CSV (opsional)
- Ucapan dari tamu (list)

**4. Settings**
- Edit profile
- Change password
- Manage subscription (jika premium)

**Functional Requirements:**
- Responsive, mobile-friendly
- Real-time update statistik (atau refresh otomatis setiap 30 detik)
- Tombol "Share" untuk copy link atau buka WhatsApp share

**Technical Specifications:**
- **Analytics:** Track page views dengan Supabase Edge Functions atau Vercel Analytics
- **Database:** Query dari `invitations`, `rsvp`, `guestbook`, `page_views`

**Acceptance Criteria:**
- [ ] Pasangan bisa lihat semua undangan mereka di satu halaman
- [ ] Stats (views, RSVP, ucapan) akurat dan update secara berkala
- [ ] Tombol "Share" generate link WhatsApp pre-filled
- [ ] Tombol "Edit" mengarah ke halaman edit undangan
- [ ] Tombol "Hapus" ada konfirmasi sebelum delete

**Out of Scope:**
- Advanced analytics (bounce rate, source traffic, device breakdown) → post-MVP
- Multi-invitation management (bulk edit) → post-MVP

---

#### **FEATURE 10: AI Copywriting Assistant (P1 - Nice-to-Have MVP)**

**Objective:** Membantu pasangan menghasilkan teks undangan (sambutan, cerita cinta, doa) dalam Bahasa Indonesia yang natural dan personal menggunakan Claude AI.

**User Stories:**
1. Sebagai pasangan, saya tidak pandai menulis, jadi saya ingin AI yang membantu saya menulis teks pembuka yang bagus.
2. Sebagai pasangan, saya ingin cerita cinta kami ditulis dengan gaya yang romantis tapi tidak berlebihan.
3. Sebagai pasangan, saya ingin bisa edit hasil AI agar sesuai dengan preferensi kami.

**Functional Requirements:**
- Tombol "Bantu tulis dengan AI" di form wizard (Step 4: Konten & Media)
- Muncul modal/form kecil:
  - Input: "Ceritakan sedikit tentang hubungan kalian" (textarea)
  - Gaya: Dropdown (Formal, Santai, Romantis, Religius)
  - Bahasa: Bahasa Indonesia (default)
  - Tombol "Generate"
- AI generate teks dalam 5-10 detik
- Output ditampilkan di textarea, user bisa edit sebelum save

**AI Prompt Structure (untuk Claude via OpenRouter):**

```
Kamu adalah asisten copywriter profesional untuk undangan pernikahan digital di Indonesia.

Task: Tulis teks [sambutan/cerita cinta/doa] untuk undangan pernikahan dalam Bahasa Indonesia yang natural, hangat, dan sesuai budaya Indonesia.

Input dari user:
- Nama Mempelai Pria: {groom_name}
- Nama Mempelai Wanita: {bride_name}
- Konteks: {user_input_context}
- Gaya: {style} (Formal/Santai/Romantis/Religius)

Output: Tulis teks dalam 2-3 paragraf, maksimal 150 kata, dengan tone yang {style}. Jangan gunakan bahasa yang terlalu puitis atau berlebihan. Pastikan mudah dibaca dan cocok untuk semua kalangan tamu.
```

**Technical Specifications:**
- **AI Provider:** OpenRouter dengan Claude 3.5 Sonnet atau Claude Opus 4
- **API Endpoint:** `/api/ai/generate-text` (Next.js API route)
- **Rate Limiting:** Max 10 requests per user per day (untuk kontrol cost)
- **Fallback:** Jika AI gagal, tampilkan template default + error message

**Acceptance Criteria:**
- [ ] Tombol "Bantu tulis dengan AI" muncul di form
- [ ] User bisa input konteks dan pilih gaya
- [ ] AI generate teks dalam Bahasa Indonesia yang natural
- [ ] Hasil bisa diedit langsung oleh user
- [ ] Loading state jelas saat AI sedang generate
- [ ] Error handling jika AI timeout atau gagal

**Out of Scope:**
- AI image generation (generate foto prewedding) → terlalu berat untuk MVP
- Multi-language support (English, etc.) → post-MVP

---

## 4. Technical Architecture

### 4.1 Tech Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 14+ (App Router), React, TypeScript, Tailwind CSS | Modern, fast, SEO-friendly, TypeScript untuk type safety |
| **Backend** | Next.js API Routes, Supabase (Postgres, Auth, Storage, Realtime) | Serverless, scalable, built-in auth & database |
| **Database** | PostgreSQL (via Supabase) | Relational, powerful, JSON support, Row Level Security |
| **Storage** | Supabase Storage | Integrated, CDN, file upload untuk foto/media |
| **Authentication** | Supabase Auth | Email/password, social login (Google), secure |
| **Payment Gateway** | Midtrans/Xendit (QRIS support) | Lokal Indonesia, QRIS native, dokumentasi bagus |
| **AI/LLM** | OpenRouter (Claude 3.5 Sonnet/Opus 4) | Access to best models, simple API, cost-effective |
| **Deployment** | Vercel | Zero-config deploy, edge functions, fast CDN |
| **Analytics** | Vercel Analytics + Custom tracking | Page views, user behavior |
| **Monitoring** | Sentry (error tracking) | Real-time error monitoring |

### 4.2 Database Schema (MVP)

**Core Tables:**

```sql
-- Users & Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'admin', 'owner'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Themes
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT, -- 'minimalist', 'floral', 'adat', 'modern'
  tags TEXT[], -- ['gratis', 'premium', 'jawa', 'sunda']
  is_premium BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- 'Free', 'Premium'
  price INTEGER DEFAULT 0,
  features JSONB, -- {"max_photos": 3, "ai_copywriting": false, ...}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Invitations
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  theme_id UUID REFERENCES themes(id),
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Invitation Content
CREATE TABLE invitation_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  groom_name TEXT NOT NULL,
  groom_nickname TEXT,
  groom_parents TEXT,
  bride_name TEXT NOT NULL,
  bride_nickname TEXT,
  bride_parents TEXT,
  event_type TEXT, -- 'akad', 'resepsi', 'both'
  event_date TIMESTAMP,
  event_time TEXT,
  venue_name TEXT,
  venue_address TEXT,
  maps_url TEXT,
  greeting_text TEXT,
  love_story TEXT,
  photos JSONB, -- [{"url": "...", "caption": "..."}, ...]
  qris_image_url TEXT,
  bank_accounts JSONB, -- [{"bank": "BCA", "account_number": "...", "account_name": "..."}]
  music_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RSVP
CREATE TABLE rsvp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  attendance_status TEXT NOT NULL, -- 'hadir', 'tidak_hadir'
  number_of_guests INTEGER DEFAULT 1,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Guestbook
CREATE TABLE guestbook (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  invitation_id UUID REFERENCES invitations(id),
  plan_id UUID REFERENCES subscription_plans(id),
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'success', 'failed'
  payment_method TEXT, -- 'qris', 'bank_transfer', etc.
  transaction_id TEXT, -- from payment gateway
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Page Views (simple analytics)
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  visitor_ip TEXT, -- hashed for privacy
  user_agent TEXT,
  viewed_at TIMESTAMP DEFAULT NOW()
);
```

**Row Level Security (RLS) Policies:**

```sql
-- Users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can only manage their own invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invitations" ON invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create invitations" ON invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invitations" ON invitations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invitations" ON invitations FOR DELETE USING (auth.uid() = user_id);

-- Public can view published invitations (by slug)
CREATE POLICY "Anyone can view published invitations" ON invitations FOR SELECT USING (status = 'published');

-- Similar RLS for invitation_content, rsvp, guestbook, etc.
```

### 4.3 API Endpoints (Next.js API Routes)

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/invitations` | GET | List user's invitations | Yes |
| `/api/invitations` | POST | Create new invitation | Yes |
| `/api/invitations/[id]` | GET | Get invitation detail | Yes (owner) |
| `/api/invitations/[id]` | PATCH | Update invitation | Yes (owner) |
| `/api/invitations/[id]` | DELETE | Delete invitation | Yes (owner) |
| `/api/invitations/[id]/publish` | POST | Publish invitation | Yes (owner) |
| `/api/public/invitations/[slug]` | GET | Get published invitation (public) | No |
| `/api/rsvp` | POST | Submit RSVP | No |
| `/api/guestbook` | POST | Submit guestbook message | No |
| `/api/payments/create-session` | POST | Create payment session (QRIS) | Yes |
| `/api/webhooks/payment` | POST | Payment gateway webhook | No (verified signature) |
| `/api/ai/generate-text` | POST | AI copywriting | Yes (rate limited) |
| `/api/analytics/[invitation_id]` | GET | Get invitation stats | Yes (owner) |

### 4.4 Folder Structure (Next.js App Router)

```
nikahku-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (dashboard home)
│   │   ├── invitations/
│   │   │   ├── page.tsx (list)
│   │   │   ├── new/ (wizard)
│   │   │   └── [id]/
│   │   │       ├── page.tsx (detail/stats)
│   │   │       └── edit/ (edit form)
│   │   ├── themes/
│   │   └── settings/
│   ├── u/
│   │   └── [slug]/
│   │       └── page.tsx (public invitation page)
│   ├── api/
│   │   ├── invitations/
│   │   ├── rsvp/
│   │   ├── guestbook/
│   │   ├── payments/
│   │   ├── webhooks/
│   │   └── ai/
│   └── layout.tsx (root layout)
├── components/
│   ├── ui/ (button, input, card, etc.)
│   ├── themes/ (theme components)
│   │   ├── minimalist-white/
│   │   ├── garden-romance/
│   │   └── ...
│   ├── wizard/ (wizard steps)
│   ├── dashboard/ (dashboard components)
│   └── invitation/ (invitation page sections)
├── lib/
│   ├── supabase/ (client & server)
│   ├── payment-gateway.ts
│   ├── ai-client.ts
│   └── utils.ts
├── public/
│   └── assets/ (images, fonts, etc.)
└── styles/
    └── globals.css
```

### 4.5 Deployment Architecture

```
┌─────────────────┐
│   User Device   │
│  (Mobile/Web)   │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────────────┐
│   Vercel Edge Network   │
│   (CDN + Edge Functions)│
└────────┬────────────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────────┐
│   Next.js App   │  │  Supabase Cloud  │
│  (SSR/SSG/API)  │  │  - Postgres DB   │
└────────┬────────┘  │  - Auth          │
         │           │  - Storage       │
         │           │  - Realtime      │
         │           └──────────────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────────┐
│  Payment Gateway│  │   OpenRouter     │
│  (Midtrans/     │  │  (Claude AI)     │
│   Xendit)       │  │                  │
└─────────────────┘  └──────────────────┘
```

---

## 5. User Journey & Flow Diagrams

### 5.1 User Journey: Pasangan (Happy Path - Buat Undangan Pertama)

```
1. User buka nikahku.id
2. Klik "Buat Undangan Gratis"
3. Sign-up dengan email/Google
4. Redirect ke Wizard Step 1: Data Mempelai
   → Input nama, orang tua, sosial media
   → Klik "Lanjut"
5. Step 2: Jadwal & Lokasi
   → Input tanggal, venue, maps link
   → Klik "Lanjut"
6. Step 3: Pilih Tema
   → Browse tema, pilih "Minimalist White"
   → Preview, klik "Pilih Tema"
7. Step 4: Konten & Media
   → Upload foto mempelai
   → Klik "Bantu tulis dengan AI" untuk teks sambutan
   → AI generate, user review & edit
   → Klik "Lanjut"
8. Step 5: Amplop Digital
   → Upload QRIS code atau input rekening
   → Klik "Lanjut"
9. Step 6: Preview & Publish
   → Preview undangan
   → Klik "Publish"
   → Undangan live di nikahku.id/u/rina-andi-2026
10. Dashboard: Salin link, share via WhatsApp
11. Monitor stats: views, RSVP, ucapan
12. (Optional) Upgrade ke Premium untuk unlock tema eksklusif
```

### 5.2 User Journey: Tamu (Happy Path - Buka Undangan & RSVP)

```
1. Tamu terima link undangan via WhatsApp: nikahku.id/u/rina-andi-2026
2. Klik link, undangan load dalam 3 detik
3. Scroll ke bawah:
   → Lihat foto mempelai
   → Baca detail acara
   → Klik "Lihat Peta" → buka Google Maps
4. Scroll ke section RSVP
   → Input nama: "Pak Budi"
   → Pilih: "Hadir", jumlah tamu: 2
   → Klik "Kirim RSVP"
   → Konfirmasi: "Terima kasih, RSVP Anda sudah diterima!"
5. Scroll ke Guestbook
   → Input ucapan: "Selamat ya! Semoga lancar acara nya"
   → Klik "Kirim Ucapan"
6. Scroll ke Amplop Digital
   → Scan QRIS dengan mobile banking
   → Transfer Rp 500.000
   → Done
```

---

## 6. Future Scope (Post-MVP / V2)

**Features yang sengaja tidak dimasukkan ke MVP tapi penting untuk roadmap:**

### 6.1 Phase 2 Features (3-6 bulan setelah MVP)

1. **AI Theme Recommendation**
   - Sistem rekomendasi tema otomatis berdasarkan preferensi user (warna favorit, style, adat)
   - "Quiz" singkat saat onboarding: "Pernikahan Anda seperti apa?" → AI rekomendasikan 3 tema

2. **Advanced Analytics**
   - Source tracking (dari mana tamu datang: WhatsApp, Instagram, Facebook, etc.)
   - Device breakdown (mobile vs desktop)
   - Peak hours (jam berapa paling banyak dibuka)
   - Heatmap (bagian mana yang paling dilihat)

3. **Email/WhatsApp Notifications**
   - Auto-notify pasangan saat ada RSVP baru atau ucapan baru
   - Reminder untuk tamu yang belum RSVP (optional feature)

4. **QR Code Check-in**
   - Generate QR code untuk tiap tamu
   - Admin/WO scan QR code di pintu masuk untuk check-in real-time

5. **Multi-Event Support**
   - Pernikahan dengan beberapa lokasi (misalnya akad di Jakarta, resepsi di Bandung)
   - Multi-day events (contoh: Siraman, Akad, Resepsi)

6. **Collaboration Mode**
   - Pasangan bisa invite co-editor (misalnya WO atau orang tua) untuk bantu edit undangan

7. **Guest List Management**
   - Import guest list dari Excel/CSV
   - Send invitation via email/WhatsApp langsung dari dashboard
   - Track: who opened, who RSVPed, who hasn't

### 6.2 Phase 3 Features (6-12 bulan)

1. **Ecosystem Integration**
   - Marketplace vendor (WO, fotografer, venue, catering, dekorasi)
   - Booking langsung dari platform
   - Komisi/revenue share model

2. **Live Streaming Integration**
   - Embed live streaming (YouTube, Zoom, Instagram Live) di halaman undangan

3. **Custom Domain**
   - User bisa pakai domain sendiri: rina-andi.com

4. **Multilingual Support**
   - Bahasa Inggris untuk pasangan internasional
   - Auto-translate dengan AI

5. **Wedding Registry**
   - Integrasi dengan e-commerce (Tokopedia, Shopee, etc.)
   - Gift registry: tamu pilih hadiah dari list yang disediakan pasangan

6. **Video Invitation**
   - AI-generated video invitation dengan foto & musik (seperti CapCut tapi otomatis)

---

## 7. Constraints & Assumptions

### 7.1 Technical Constraints

- **Budget:** MVP target di bawah Rp 10 juta untuk development (mostly AI agents + Anda)
- **Timeline:** MVP target 2-3 bulan (dengan bantuan AI agents)
- **Performance:** 
  - Halaman undangan harus load <3 detik di 4G
  - Database query <500ms
- **Scalability (MVP):** Target 1000 undangan aktif dalam 6 bulan pertama
- **Mobile-first:** 80%+ traffic dari mobile, jadi prioritas UX mobile

### 7.2 Business Assumptions

- Conversion rate gratis → premium: 10-15%
- Average order value (AOV) paket premium: Rp 99.000
- Customer acquisition cost (CAC): Rp 50.000 (via organic social media + word-of-mouth)
- Retention: 60% pasangan yang publish undangan akan rekomendasikan ke teman

### 7.3 User Assumptions

- Target user memiliki smartphone dengan internet 4G
- Target user familiar dengan WhatsApp dan Instagram
- Target user bersedia bayar Rp 99.000 jika value proposition jelas (tema cantik + AI + no branding)
- Target user lebih memilih QRIS dibanding kartu kredit

### 7.4 External Dependencies

- **Payment Gateway uptime:** 99.9% (Midtrans/Xendit SLA)
- **Supabase availability:** 99.9%
- **Vercel uptime:** 99.99%
- **OpenRouter/Claude API:** Rate limits dan cost per request

---

## 8. Risks & Mitigation

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Kompetitor copy fitur AI** | High | Medium | Fokus pada execution quality, branding, dan network effect. Bangun komunitas kuat. |
| **Cost AI terlalu tinggi** | High | Medium | Implement rate limiting, caching hasil AI, atau downgrade ke model lebih murah untuk non-premium users. |
| **Supabase free tier limit tercapai** | Medium | Low | Monitor usage, siap upgrade ke paid plan jika user base tumbuh cepat. |
| **Payment gateway downtime saat peak** | Medium | Low | Sediakan fallback: manual bank transfer dengan instruksi jelas. |
| **Low organic traffic di awal** | High | High | Content marketing (blog, Instagram, TikTok), partnership dengan WO lokal, referral program. |
| **User bingung dengan wizard** | Medium | Medium | User testing rutin, iterasi UX berdasarkan feedback, video tutorial. |
| **Tema tidak cukup menarik** | High | Medium | Hire desainer profesional untuk kurasi tema, iterate based on user preference analytics. |

---

## 9. Success Criteria & KPIs

### 9.1 MVP Launch Criteria (Readiness Checklist)

MVP dianggap siap launch jika:

- [ ] Semua P0 features implemented dan tested
- [ ] User bisa sign-up, buat undangan, dan publish dalam <15 menit tanpa error
- [ ] Payment QRIS berfungsi di sandbox dan production
- [ ] Halaman undangan load <3 detik di mobile 4G
- [ ] RLS policies di Supabase configured dengan benar (no data leak)
- [ ] Error monitoring (Sentry) aktif
- [ ] 5 tema MVP tersedia dan responsive
- [ ] AI copywriting berfungsi (Bahasa Indonesia natural)
- [ ] Legal docs (ToS, Privacy Policy) published
- [ ] Beta testing dengan 10-20 pasangan selesai + feedback incorporated

### 9.2 Post-Launch KPIs (3 Months)

| KPI | Target | Measurement Frequency |
|-----|--------|----------------------|
| **User Acquisition** | 500 sign-ups | Weekly |
| **Activation Rate** | 60% (buat minimal 1 undangan) | Weekly |
| **Publish Rate** | 70% (undangan yang dibuat di-publish) | Weekly |
| **Conversion to Paid** | 15% (upgrade ke premium) | Monthly |
| **Revenue** | Rp 7.5 juta (50 premium users × Rp 99k + margin) | Monthly |
| **User Satisfaction (NPS)** | NPS ≥ 50 | Quarterly (survey) |
| **Average Load Time** | <3 seconds | Daily (automated monitoring) |
| **Error Rate** | <1% of requests | Daily |
| **Mobile Traffic** | ≥80% | Weekly |

---

## 10. Appendix

### 10.1 Glossary

- **MVP (Minimum Viable Product):** Versi produk dengan fitur minimum yang cukup untuk digunakan early adopters dan validate product-market fit.
- **QRIS (Quick Response Code Indonesian Standard):** Standar nasional QR code untuk pembayaran digital di Indonesia.
- **RLS (Row Level Security):** Fitur keamanan database PostgreSQL/Supabase untuk membatasi akses data per row berdasarkan policy.
- **SSR (Server-Side Rendering):** Teknik rendering halaman web di server sebelum dikirim ke client, untuk performa dan SEO.
- **Wizard:** Flow UI dengan langkah-langkah terstruktur untuk membimbing user menyelesaikan tugas kompleks.

### 10.2 References

- [Atlassian: How to Create a PRD](https://www.atlassian.com/agile/product-management/requirements)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Midtrans API Documentation](https://docs.midtrans.com)
- [OpenRouter API Documentation](https://openrouter.ai/docs)

### 10.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 6 Mar 2026 | Zakiul Fahmi Jailani | Initial draft for MVP |

---

## 11. AI Agents Development Notes

**Instruksi khusus untuk AI agents (Antigravity + Claude Opus 4.6):**

### 11.1 Development Priorities

1. **Mulai dari fondasi:**
   - Setup Next.js project + Supabase connection
   - Implement authentication (sign-up, login, profile)
   - Database schema migration

2. **Core user flow:**
   - Wizard pembuatan undangan (P0)
   - Halaman undangan publik (P0)
   - Dashboard pasangan (P0)

3. **Payment & AI:**
   - QRIS integration untuk paket (P0)
   - AI copywriting (P1, bisa ditunda jika timeline ketat)

4. **Polish:**
   - Tema premium (1-2 tema ekstra)
   - UX improvements based on testing
   - Performance optimization

### 11.2 Code Style & Standards

- **TypeScript:** Strict mode enabled
- **ESLint + Prettier:** Enforce consistent formatting
- **Naming conventions:**
  - Files: kebab-case (`user-profile.tsx`)
  - Components: PascalCase (`UserProfile`)
  - Functions: camelCase (`getUserInvitations`)
  - Database tables: snake_case (`invitation_content`)
- **Comments:** Tulis komentar untuk logika kompleks, tapi hindari over-commenting
- **Error handling:** Always handle errors gracefully dengan try-catch dan user-friendly messages

### 11.3 Testing Requirements

- **Unit tests:** Untuk utility functions dan business logic
- **Integration tests:** Untuk API routes (minimal happy path)
- **E2E tests (optional MVP):** Playwright untuk critical user flows (sign-up → create invitation → publish)

### 11.4 Documentation

Setiap PR/commit besar harus disertai:
- Brief description of changes
- Screenshot/video jika ada perubahan UI
- Update README.md jika ada perubahan setup/configuration

---

## Contact & Approval

**Product Owner:** Zakiul Fahmi Jailani  
**Email:** [Your Email]  
**Status:** Draft - Menunggu review & approval sebelum development dimulai

---

**Next Steps:**
1. Review PRD dengan stakeholder (Anda sendiri + tim jika ada)
2. Finalisasi prioritas fitur (P0 vs P1)
3. Setup development environment
4. Kick-off development dengan AI agents
5. Weekly sprint review & iterate

---

*End of PRD v1.0*