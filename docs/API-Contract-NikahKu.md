# API Contract Documentation
## NikahKu Platform — Request & Response Specifications

---
**Dokumen:** API Contract v1.0  
**Date:** 6 Maret 2026  
**Owner:** Zakiul Fahmi Jailani  
**Base URL (Dev):** `http://localhost:3000/api`  
**Base URL (Prod):** `https://nikahku.id/api`  
**Format:** JSON (Content-Type: application/json)  
**Auth:** Supabase JWT via Bearer Token atau httpOnly Cookie

> **Catatan untuk AI Agents:**
> - Semua endpoint yang butuh auth harus validasi JWT via Supabase server client
> - Response format KONSISTEN: `{ data: T | null, error: ErrorObject | null }`
> - Error object selalu: `{ code: string, message: string, details?: any }`
> - HTTP Status code harus sesuai standar (jangan return 200 untuk error)
> - Semua input wajib divalidasi dengan Zod sebelum menyentuh database

---

## DAFTAR ENDPOINT

| Grup | Jumlah Endpoint |
|------|-----------------|
| Auth | 4 |
| Users & Profiles | 4 |
| Invitations | 6 |
| Invitation Content | 3 |
| Themes | 4 |
| RSVP | 3 |
| Messages (Ucapan) | 3 |
| AI Copywriting | 2 |
| Payments | 4 |
| Webhooks | 1 |
| Admin | 5 |
| Owner / Analytics | 4 |
| **TOTAL** | **43** |

---

## KONVENSI GLOBAL

### Response Envelope
```typescript
// Semua endpoint kembalikan format ini
type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

type ApiError = {
  code: string;       // machine-readable, e.g. "INVITATION_NOT_FOUND"
  message: string;    // human-readable, Bahasa Indonesia
  details?: unknown;  // opsional, untuk validasi errors
};
```

### HTTP Status Codes
| Code | Kapan Dipakai |
|------|---------------|
| 200  | GET sukses, PUT/PATCH sukses |
| 201  | POST sukses (resource created) |
| 400  | Request tidak valid (validasi gagal) |
| 401  | Tidak authenticated |
| 403  | Authenticated tapi tidak punya izin |
| 404  | Resource tidak ditemukan |
| 409  | Conflict (duplikasi data) |
| 429  | Rate limit terlampaui |
| 500  | Server error internal |

### Auth Header
```
Authorization: Bearer <supabase_access_token>
```
Atau otomatis via httpOnly cookie (Supabase SSR).

---

## BAGIAN 1: AUTH

### POST /auth/register
Daftar akun baru dengan email & password.

**Auth Required:** Tidak

**Request Body:**
```typescript
{
  email: string;        // format email valid
  password: string;     // min 8 karakter, minimal 1 angka
  full_name: string;    // min 2 karakter, max 100 karakter
}
```

**Response 201 Created:**
```typescript
{
  data: {
    user_id: string;    // UUID
    email: string;
    full_name: string;
    created_at: string; // ISO 8601
  };
  error: null;
}
```

**Response 409 Conflict:**
```json
{
  "data": null,
  "error": {
    "code": "EMAIL_ALREADY_REGISTERED",
    "message": "Email ini sudah terdaftar. Silakan login atau gunakan email lain."
  }
}
```

**Response 400 Bad Request:**
```json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data yang dikirim tidak valid.",
    "details": {
      "password": "Password minimal 8 karakter dan mengandung angka."
    }
  }
}
```

---

### POST /auth/login
Login dengan email & password.

**Auth Required:** Tidak

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response 200 OK:**
```typescript
{
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;     // detik, biasanya 3600
    user: {
      user_id: string;
      email: string;
      full_name: string;
      role: "user" | "admin" | "owner";
      plan: "free" | "premium" | "exclusive";
    };
  };
  error: null;
}
```

**Response 401 Unauthorized:**
```json
{
  "data": null,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email atau password salah. Silakan coba lagi."
  }
}
```

---

### POST /auth/refresh
Perbarui access token menggunakan refresh token.

**Auth Required:** Tidak (pakai refresh_token)

**Request Body:**
```typescript
{
  refresh_token: string;
}
```

**Response 200 OK:**
```typescript
{
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  error: null;
}
```

---

### POST /auth/logout
Logout dan invalidate session.

**Auth Required:** Ya

**Request Body:** *(kosong)*

**Response 200 OK:**
```json
{ "data": { "message": "Berhasil logout." }, "error": null }
```

---

## BAGIAN 2: USERS & PROFILES

### GET /users/me
Ambil data profil user yang sedang login.

**Auth Required:** Ya

**Response 200 OK:**
```typescript
{
  data: {
    user_id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    role: "user" | "admin" | "owner";
    plan: "free" | "premium" | "exclusive";
    plan_expires_at: string | null;   // ISO 8601
    invitations_count: number;
    created_at: string;
  };
  error: null;
}
```

---

### PATCH /users/me
Update profil pengguna.

**Auth Required:** Ya

**Request Body:** *(semua field opsional, minimal 1)*
```typescript
{
  full_name?: string;      // max 100 karakter
  avatar_url?: string;     // URL valid, max 500 karakter
}
```

**Response 200 OK:**
```typescript
{
  data: {
    user_id: string;
    full_name: string;
    avatar_url: string | null;
    updated_at: string;
  };
  error: null;
}
```

---

### POST /users/me/avatar
Upload foto avatar (multipart/form-data ke Supabase Storage).

**Auth Required:** Ya  
**Content-Type:** multipart/form-data  
**Max File Size:** 5 MB  
**Format Diterima:** jpg, jpeg, png, webp

**Request Body:**
```
avatar: File (image)
```

**Response 201 Created:**
```typescript
{
  data: {
    avatar_url: string;  // public URL Supabase Storage
  };
  error: null;
}
```

**Response 400 Bad Request:**
```json
{
  "data": null,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP."
  }
}
```

---

### DELETE /users/me
Hapus akun (soft delete — set is_deleted = true).

**Auth Required:** Ya

**Request Body:**
```typescript
{
  confirmation: string;  // harus isi persis: "HAPUS AKUN SAYA"
}
```

**Response 200 OK:**
```json
{ "data": { "message": "Akun berhasil dihapus." }, "error": null }
```

---

## BAGIAN 3: INVITATIONS

### GET /invitations
Ambil semua undangan milik user yang login.

**Auth Required:** Ya

**Query Params:**
```
page?:    number (default: 1)
limit?:   number (default: 10, max: 50)
status?:  "draft" | "published" | "archived"
```

**Response 200 OK:**
```typescript
{
  data: {
    items: Array<{
      invitation_id: string;
      slug: string;
      title: string;           // "Rina & Andi"
      status: "draft" | "published" | "archived";
      theme_id: string;
      view_count: number;
      rsvp_count: number;
      message_count: number;
      created_at: string;
      updated_at: string;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
  error: null;
}
```

---

### POST /invitations
Buat undangan baru (dari wizard step terakhir).

**Auth Required:** Ya

**Request Body:**
```typescript
{
  // Step 1: Data Mempelai
  groom: {
    full_name: string;          // max 100 karakter
    nickname: string;           // max 50 karakter
    parent_names?: string;      // "Bpk. X & Ibu Y"
    photo_url?: string;
  };
  bride: {
    full_name: string;
    nickname: string;
    parent_names?: string;
    photo_url?: string;
  };

  // Step 2: Info Acara
  events: Array<{
    type: "akad" | "resepsi" | "pemberkatan" | "lainnya";
    name: string;               // "Akad Nikah"
    date: string;               // ISO 8601 date "2026-12-12"
    start_time: string;         // "08:00"
    end_time?: string;          // "10:00"
    venue_name: string;
    venue_address: string;
    maps_url?: string;          // Google Maps URL
    maps_embed_url?: string;
  }>;

  // Step 3: Tema
  theme_id: string;

  // Step 4: Konten
  cover_photo_url?: string;
  opening_text?: string;        // max 500 karakter
  love_story?: string;          // max 2000 karakter
  closing_text?: string;

  // Step 5: Amplop Digital
  digital_gift: {
    enabled: boolean;
    qris_image_url?: string;
    bank_accounts?: Array<{
      bank_name: string;
      account_number: string;
      account_name: string;
    }>;
  };

  // Meta
  slug?: string;                // opsional — auto-generate jika kosong
  status?: "draft" | "published"; // default: "draft"
}
```

**Response 201 Created:**
```typescript
{
  data: {
    invitation_id: string;
    slug: string;
    public_url: string;     // "https://nikahku.id/u/rina-andi-2026"
    status: "draft";
    created_at: string;
  };
  error: null;
}
```

**Response 409 Conflict (slug bentrok):**
```json
{
  "data": null,
  "error": {
    "code": "SLUG_ALREADY_TAKEN",
    "message": "URL undangan sudah dipakai. Coba ubah nama atau tambahkan angka di belakang.",
    "details": { "suggested_slug": "rina-andi-2026-2" }
  }
}
```

---

### GET /invitations/:id
Ambil detail lengkap satu undangan (untuk dashboard pasangan).

**Auth Required:** Ya (hanya milik user sendiri)

**Response 200 OK:**
```typescript
{
  data: {
    invitation_id: string;
    slug: string;
    status: "draft" | "published" | "archived";
    groom: { full_name: string; nickname: string; parent_names?: string; photo_url?: string };
    bride: { full_name: string; nickname: string; parent_names?: string; photo_url?: string };
    events: Array<EventObject>;
    theme_id: string;
    theme: { name: string; preview_url: string; category: string };
    cover_photo_url: string | null;
    opening_text: string | null;
    love_story: string | null;
    closing_text: string | null;
    digital_gift: DigitalGiftObject;
    gallery_photos: Array<{ url: string; caption?: string; order: number }>;
    stats: {
      view_count: number;
      unique_visitor_count: number;
      rsvp_count: number;
      rsvp_attending: number;
      rsvp_not_attending: number;
      message_count: number;
    };
    created_at: string;
    updated_at: string;
  };
  error: null;
}
```

**Response 403 Forbidden:**
```json
{
  "data": null,
  "error": {
    "code": "ACCESS_DENIED",
    "message": "Anda tidak memiliki akses ke undangan ini."
  }
}
```

---

### PATCH /invitations/:id
Update sebagian data undangan.

**Auth Required:** Ya (hanya milik user sendiri)

**Request Body:** *(field sama dengan POST /invitations, semua opsional)*

**Response 200 OK:**
```typescript
{
  data: {
    invitation_id: string;
    slug: string;
    updated_at: string;
    changed_fields: string[];   // ["opening_text", "events"]
  };
  error: null;
}
```

---

### PATCH /invitations/:id/status
Ubah status undangan (publish / archive / kembali ke draft).

**Auth Required:** Ya

**Request Body:**
```typescript
{
  status: "draft" | "published" | "archived";
}
```

**Response 200 OK:**
```typescript
{
  data: {
    invitation_id: string;
    status: "draft" | "published" | "archived";
    public_url: string | null;
    updated_at: string;
  };
  error: null;
}
```

---

### DELETE /invitations/:id
Hapus undangan secara permanen.

**Auth Required:** Ya

**Response 200 OK:**
```json
{ "data": { "message": "Undangan berhasil dihapus." }, "error": null }
```

---

## BAGIAN 4: INVITATION CONTENT (GALERI & MEDIA)

### POST /invitations/:id/gallery
Upload foto ke galeri undangan.

**Auth Required:** Ya  
**Content-Type:** multipart/form-data  
**Max File:** 10 MB per foto, max 20 foto per undangan  
**Format:** jpg, jpeg, png, webp

**Request Body (form-data):**
```
photos: File[]     (array of images)
captions?: string  (JSON array of captions, misal: ["Foto 1", "Foto 2"])
```

**Response 201 Created:**
```typescript
{
  data: {
    uploaded: Array<{
      photo_id: string;
      url: string;
      caption: string | null;
      order: number;
    }>;
    total_count: number;
    remaining_slots: number;
  };
  error: null;
}
```

**Response 400 — Melebihi batas:**
```json
{
  "data": null,
  "error": {
    "code": "GALLERY_LIMIT_EXCEEDED",
    "message": "Maksimal 20 foto untuk paket Free. Upgrade ke Premium untuk tambah lebih banyak.",
    "details": { "current": 20, "limit": 20 }
  }
}
```

---

### DELETE /invitations/:id/gallery/:photo_id
Hapus satu foto dari galeri.

**Auth Required:** Ya

**Response 200 OK:**
```json
{ "data": { "message": "Foto berhasil dihapus." }, "error": null }
```

---

### PATCH /invitations/:id/gallery/reorder
Ubah urutan foto galeri.

**Auth Required:** Ya

**Request Body:**
```typescript
{
  order: Array<{
    photo_id: string;
    position: number;   // 1-based
  }>;
}
```

**Response 200 OK:**
```json
{ "data": { "message": "Urutan foto berhasil diperbarui." }, "error": null }
```

---

## BAGIAN 5: THEMES

### GET /themes
Ambil daftar semua tema yang tersedia (untuk halaman pilih tema).

**Auth Required:** Tidak (publik — tema diakses saat preview)

**Query Params:**
```
category?:  "minimalist" | "javanese" | "sundanese" | "modern" | "romantic" | "rustic"
style?:     "formal" | "casual" | "traditional" | "contemporary"
price?:     "free" | "premium" | "exclusive"
page?:      number (default: 1)
limit?:     number (default: 12)
```

**Response 200 OK:**
```typescript
{
  data: {
    items: Array<{
      theme_id: string;
      name: string;
      slug: string;
      category: string;
      style: string;
      price_type: "free" | "premium" | "exclusive";
      price_idr: number;         // 0 untuk free
      preview_url: string;       // thumbnail gambar
      preview_demo_url: string;  // link ke demo live
      colors: {
        primary: string;         // hex
        secondary: string;
        accent: string;
      };
      is_new: boolean;
      is_popular: boolean;
    }>;
    pagination: PaginationObject;
  };
  error: null;
}
```

---

### GET /themes/:id
Detail lengkap satu tema termasuk metadata dan screenshots.

**Auth Required:** Tidak

**Response 200 OK:**
```typescript
{
  data: {
    theme_id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    style: string;
    price_type: "free" | "premium" | "exclusive";
    price_idr: number;
    preview_url: string;
    screenshots: string[];         // array of image URLs
    demo_url: string;
    features: string[];            // ["Animasi scroll", "Font kaligrafi", ...]
    colors: { primary: string; secondary: string; accent: string };
    fonts: { display: string; body: string };
    usage_count: number;
    rating: number | null;         // 1-5, bisa null kalau belum ada rating
  };
  error: null;
}
```

---

### GET /themes/:id/preview-data
Ambil sample data untuk preview tema (dipakai saat user preview tema di wizard).

**Auth Required:** Ya

**Response 200 OK:**
```typescript
{
  data: {
    theme_id: string;
    // data sample yang sudah di-merge dengan data undangan user (jika ada)
    sample_invitation: InvitationDataObject;
  };
  error: null;
}
```

---

### GET /themes/featured
Ambil 6 tema unggulan untuk ditampilkan di landing page & dashboard.

**Auth Required:** Tidak

**Response 200 OK:**
```typescript
{
  data: {
    items: Array<ThemeSummaryObject>;  // max 6 items
  };
  error: null;
}
```

---

## BAGIAN 6: RSVP

### POST /invitations/:slug/rsvp
Tamu mengirim konfirmasi kehadiran. Menggunakan `slug` bukan `id` (karena diakses oleh tamu dari URL publik).

**Auth Required:** Tidak (publik)  
**Rate Limit:** 3 request per IP per invitation per hari

**Request Body:**
```typescript
{
  guest_name: string;              // max 100 karakter
  attendance: "attending" | "not_attending";
  guest_count: number;             // min 1, max 5 (atau sesuai config undangan)
  message?: string;                // max 500 karakter, opsional
}
```

**Response 201 Created:**
```typescript
{
  data: {
    rsvp_id: string;
    guest_name: string;
    attendance: "attending" | "not_attending";
    guest_count: number;
    submitted_at: string;
    // Pesan konfirmasi dari pasangan (opsional, bisa di-set di dashboard)
    confirmation_message: string;
  };
  error: null;
}
```

**Response 400 — RSVP sudah terisi untuk nama yang sama:**
```json
{
  "data": null,
  "error": {
    "code": "RSVP_DUPLICATE",
    "message": "Nama tamu ini sudah pernah mengisi RSVP untuk undangan ini."
  }
}
```

**Response 404 — Undangan tidak ditemukan / belum published:**
```json
{
  "data": null,
  "error": {
    "code": "INVITATION_NOT_FOUND",
    "message": "Undangan tidak ditemukan atau belum dipublish."
  }
}
```

---

### GET /invitations/:id/rsvp
Ambil semua data RSVP (untuk pasangan di dashboard).

**Auth Required:** Ya (hanya pemilik undangan)

**Query Params:**
```
attendance?: "attending" | "not_attending"
page?:       number
limit?:      number (default: 20)
```

**Response 200 OK:**
```typescript
{
  data: {
    summary: {
      total: number;
      attending: number;
      not_attending: number;
      total_guests: number;   // jumlah orang yang datang (sum guest_count)
    };
    items: Array<{
      rsvp_id: string;
      guest_name: string;
      attendance: "attending" | "not_attending";
      guest_count: number;
      message: string | null;
      submitted_at: string;
    }>;
    pagination: PaginationObject;
  };
  error: null;
}
```

---

### DELETE /invitations/:id/rsvp/:rsvp_id
Hapus satu data RSVP (misal: tamu spam).

**Auth Required:** Ya (hanya pemilik undangan)

**Response 200 OK:**
```json
{ "data": { "message": "Data RSVP berhasil dihapus." }, "error": null }
```

---

## BAGIAN 7: MESSAGES (UCAPAN & DOA)

### POST /invitations/:slug/messages
Tamu mengirim ucapan dan doa.

**Auth Required:** Tidak  
**Rate Limit:** 5 request per IP per invitation per hari

**Request Body:**
```typescript
{
  sender_name: string;    // max 100 karakter
  message: string;        // max 1000 karakter, min 5 karakter
}
```

**Response 201 Created:**
```typescript
{
  data: {
    message_id: string;
    sender_name: string;
    message: string;
    status: "pending" | "approved";  // "pending" jika moderasi aktif
    submitted_at: string;
  };
  error: null;
}
```

---

### GET /invitations/:slug/messages
Ambil semua ucapan untuk ditampilkan di halaman publik undangan.

**Auth Required:** Tidak  
**Note:** Hanya menampilkan ucapan dengan `status = 'approved'`

**Query Params:**
```
page?:   number (default: 1)
limit?:  number (default: 10)
```

**Response 200 OK:**
```typescript
{
  data: {
    items: Array<{
      message_id: string;
      sender_name: string;
      message: string;
      submitted_at: string;
    }>;
    pagination: PaginationObject;
  };
  error: null;
}
```

---

### PATCH /invitations/:id/messages/:message_id/status
Pasangan moderasi ucapan (approve / reject).

**Auth Required:** Ya

**Request Body:**
```typescript
{
  status: "approved" | "rejected";
}
```

**Response 200 OK:**
```typescript
{
  data: {
    message_id: string;
    status: "approved" | "rejected";
    updated_at: string;
  };
  error: null;
}
```

---

## BAGIAN 8: AI COPYWRITING

### POST /ai/generate-text
Generate teks undangan menggunakan Claude via OpenRouter.

**Auth Required:** Ya  
**Rate Limit:** 10 request per user per hari  
**Streaming:** Response dikirim sebagai Server-Sent Events (SSE)  
**Content-Type Response:** `text/event-stream`

**Request Body:**
```typescript
{
  type: "greeting" | "love_story" | "prayer" | "closing";
  groom_name: string;          // max 50 karakter
  bride_name: string;          // max 50 karakter
  style: "formal_islami" | "formal_nasrani" | "formal_budha" | "santai" | "romantis";
  context?: string;            // cerita singkat, max 500 karakter
  max_words?: number;          // default: 120, max: 200
}
```

**Response 200 OK (SSE Stream):**
```
data: {"chunk": "Dengan memohon"}
data: {"chunk": " rahmat dan ridho"}
data: {"chunk": " Allah SWT..."}
data: {"done": true, "total_tokens": 145}
```

**Response 429 — Rate Limit:**
```json
{
  "data": null,
  "error": {
    "code": "AI_RATE_LIMIT_EXCEEDED",
    "message": "Batas penggunaan AI hari ini sudah tercapai (10x/hari). Coba lagi besok.",
    "details": {
      "used_today": 10,
      "limit": 10,
      "resets_at": "2026-03-07T00:00:00+07:00"
    }
  }
}
```

**Response 503 — AI Service Error:**
```json
{
  "data": null,
  "error": {
    "code": "AI_SERVICE_UNAVAILABLE",
    "message": "Layanan AI sedang tidak tersedia. Silakan coba beberapa saat lagi.",
    "details": { "fallback_available": true }
  }
}
```

---

### GET /ai/usage
Cek sisa kuota AI hari ini untuk user yang login.

**Auth Required:** Ya

**Response 200 OK:**
```typescript
{
  data: {
    used_today: number;
    limit: number;                  // 10 untuk free, 50 untuk premium
    remaining: number;
    resets_at: string;              // ISO 8601, midnight WIB
    history: Array<{
      type: string;
      used_at: string;
    }>;
  };
  error: null;
}
```

---

## BAGIAN 9: PAYMENTS

### POST /payments/create-session
Buat sesi pembayaran untuk upgrade paket.

**Auth Required:** Ya

**Request Body:**
```typescript
{
  plan_id: string;            // UUID dari tabel subscription_plans
  invitation_id?: string;     // opsional, untuk tracking
}
```

**Response 201 Created:**
```typescript
{
  data: {
    payment_id: string;             // internal ID
    order_id: string;               // "NIKAHKU-{userId}-{timestamp}"
    snap_token: string;             // untuk Midtrans Snap.js di frontend
    snap_redirect_url: string;      // fallback URL jika Snap.js gagal
    amount: number;                 // dalam Rupiah (integer)
    plan: {
      name: string;                 // "Premium"
      features: string[];
      duration_days: number;
    };
    expires_at: string;             // payment window, 1 jam dari sekarang
  };
  error: null;
}
```

---

### GET /payments/:order_id/status
Cek status pembayaran secara manual (polling fallback).

**Auth Required:** Ya

**Response 200 OK:**
```typescript
{
  data: {
    order_id: string;
    payment_id: string;
    status: "pending" | "success" | "failed" | "expired";
    amount: number;
    paid_at: string | null;
    plan_activated: boolean;
    plan_expires_at: string | null;
  };
  error: null;
}
```

---

### GET /payments/history
Riwayat pembayaran user.

**Auth Required:** Ya

**Query Params:**
```
page?:    number
limit?:   number (default: 10)
status?:  "pending" | "success" | "failed" | "expired"
```

**Response 200 OK:**
```typescript
{
  data: {
    items: Array<{
      payment_id: string;
      order_id: string;
      plan_name: string;
      amount: number;
      status: string;
      payment_method: string;   // "qris", "transfer", dll.
      created_at: string;
      paid_at: string | null;
    }>;
    pagination: PaginationObject;
  };
  error: null;
}
```

---

### GET /payments/plans
Ambil daftar paket yang tersedia (untuk halaman upgrade).

**Auth Required:** Tidak

**Response 200 OK:**
```typescript
{
  data: {
    plans: Array<{
      plan_id: string;
      name: string;                     // "Free" | "Premium" | "Eksklusif"
      price_idr: number;                // 0 untuk free
      billing_period: "lifetime" | "monthly" | "yearly";
      features: Array<{
        label: string;
        included: boolean;
        limit?: string;                 // "Maks 5 foto" / "Unlimited"
      }>;
      is_popular: boolean;
      badge?: string;                   // "Paling Banyak Dipilih"
    }>;
  };
  error: null;
}
```

---

## BAGIAN 10: WEBHOOKS

### POST /webhooks/payment
Endpoint untuk menerima notifikasi dari Midtrans.

**Auth Required:** Tidak (tapi WAJIB verifikasi signature)  
**Called By:** Midtrans server only  
**Important:** SELALU return HTTP 200 agar Midtrans tidak retry

**Request Body (dari Midtrans):**
```typescript
{
  order_id: string;
  transaction_status: "settlement" | "pending" | "deny" | "cancel" | "expire" | "failure";
  fraud_status?: "accept" | "challenge" | "deny";
  gross_amount: string;             // string angka dari Midtrans
  payment_type: string;             // "qris", "bank_transfer", dll.
  transaction_id: string;           // Midtrans transaction ID
  transaction_time: string;
  signature_key: string;            // SHA-512: order_id + status_code + gross_amount + server_key
}
```

**Internal Processing Flow:**
```
1. Verifikasi signature_key (SHA-512)
2. Jika signature invalid → log error, return 200 (jangan expose)
3. Idempotency check: apakah order_id sudah diproses?
4. Jika sudah → return 200 tanpa proses ulang
5. Berdasarkan transaction_status:
   - "settlement": UPDATE payments SET status='success', UPDATE user plan
   - "expire"/"cancel": UPDATE payments SET status='expired'/'failed'
   - "pending": UPDATE payments SET status='pending' (mungkin sudah pending)
6. INSERT audit_logs
7. Return HTTP 200
```

**Response 200 OK:**
```json
{ "status": "ok" }
```

---

## BAGIAN 11: ADMIN ENDPOINTS

*Semua endpoint di bawah butuh `role = 'admin'` di JWT claims.*

### GET /admin/users
Daftar semua user (dengan filter & search).

**Auth Required:** Ya (Admin only)

**Query Params:**
```
search?:  string (cari by nama/email)
plan?:    "free" | "premium" | "exclusive"
status?:  "active" | "suspended" | "deleted"
page?:    number
limit?:   number (default: 20)
```

**Response 200 OK:**
```typescript
{
  data: {
    items: Array<{
      user_id: string;
      email: string;
      full_name: string;
      plan: string;
      status: "active" | "suspended" | "deleted";
      invitation_count: number;
      joined_at: string;
      last_active: string | null;
    }>;
    pagination: PaginationObject;
  };
  error: null;
}
```

---

### PATCH /admin/users/:id/status
Suspend atau aktifkan kembali akun user.

**Auth Required:** Ya (Admin only)

**Request Body:**
```typescript
{
  status: "active" | "suspended";
  reason?: string;   // alasan suspend, max 500 karakter
}
```

**Response 200 OK:**
```typescript
{
  data: {
    user_id: string;
    status: "active" | "suspended";
    updated_at: string;
  };
  error: null;
}
```

---

### GET /admin/themes
Daftar semua tema termasuk yang belum dipublish.

**Auth Required:** Ya (Admin only)

**Response 200 OK:**
```typescript
{
  data: {
    items: Array<ThemeDetailObject & { is_published: boolean; usage_count: number }>;
    pagination: PaginationObject;
  };
  error: null;
}
```

---

### PATCH /admin/themes/:id
Update metadata tema atau status publish.

**Auth Required:** Ya (Admin only)

**Request Body:**
```typescript
{
  name?: string;
  description?: string;
  price_type?: "free" | "premium" | "exclusive";
  price_idr?: number;
  is_published?: boolean;
  is_popular?: boolean;
  is_new?: boolean;
  category?: string;
}
```

**Response 200 OK:**
```typescript
{
  data: { theme_id: string; updated_at: string; changed_fields: string[] };
  error: null;
}
```

---

### GET /admin/messages/pending
Ambil ucapan yang menunggu moderasi.

**Auth Required:** Ya (Admin only)

**Response 200 OK:**
```typescript
{
  data: {
    items: Array<{
      message_id: string;
      invitation_id: string;
      invitation_slug: string;
      sender_name: string;
      message: string;
      submitted_at: string;
      flags?: string[];   // jika ada auto-detection kata-kata tidak pantas
    }>;
    pagination: PaginationObject;
  };
  error: null;
}
```

---

## BAGIAN 12: OWNER / ANALYTICS ENDPOINTS

*Semua endpoint butuh `role = 'owner'` di JWT.*

### GET /owner/analytics/overview
KPI bisnis utama untuk period yang dipilih.

**Auth Required:** Ya (Owner only)

**Query Params:**
```
period: "today" | "7d" | "30d" | "90d" | "custom"
start_date?: string   (ISO 8601 date, jika period = "custom")
end_date?:   string
```

**Response 200 OK:**
```typescript
{
  data: {
    period: string;
    users: {
      total: number;
      new_this_period: number;
      growth_percentage: number;
      active: number;             // login dalam 30 hari
    };
    invitations: {
      total: number;
      published: number;
      draft: number;
      new_this_period: number;
    };
    revenue: {
      total_idr: number;
      this_period_idr: number;
      growth_percentage: number;
      by_plan: Array<{ plan_name: string; amount: number; count: number }>;
    };
    conversions: {
      free_to_premium_rate: number;   // persentase
      avg_days_to_convert: number;
    };
    ai_usage: {
      total_requests: number;
      total_tokens: number;
      by_feature: Array<{ feature: string; count: number }>;
    };
  };
  error: null;
}
```

---

### GET /owner/analytics/revenue
Detail transaksi revenue untuk owner.

**Auth Required:** Ya (Owner only)

**Query Params:**
```
start_date: string
end_date:   string
page?:      number
limit?:     number (default: 20)
```

**Response 200 OK:**
```typescript
{
  data: {
    summary: {
      total_idr: number;
      transaction_count: number;
      avg_transaction_idr: number;
    };
    items: Array<{
      payment_id: string;
      order_id: string;
      user_email: string;       // hanya untuk owner
      plan_name: string;
      amount_idr: number;
      payment_method: string;
      status: string;
      created_at: string;
    }>;
    pagination: PaginationObject;
  };
  error: null;
}
```

---

### GET /owner/analytics/export
Export data analytics ke CSV.

**Auth Required:** Ya (Owner only)  
**Response Content-Type:** `text/csv`

**Query Params:**
```
type:        "users" | "revenue" | "invitations" | "ai_usage"
start_date:  string
end_date:    string
```

**Response 200 OK:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="nikahku-export-users-2026-03-06.csv"

[CSV data stream]
```

---

### GET /owner/system/health
Status kesehatan sistem (integrations, DB, queue).

**Auth Required:** Ya (Owner only)

**Response 200 OK:**
```typescript
{
  data: {
    status: "healthy" | "degraded" | "down";
    services: {
      supabase: { status: "up" | "down"; latency_ms: number };
      midtrans: { status: "up" | "down"; last_webhook: string };
      openrouter: { status: "up" | "down"; last_success: string };
      vercel: { status: "up" | "down" };
    };
    recent_errors: Array<{
      service: string;
      error: string;
      timestamp: string;
    }>;
    checked_at: string;
  };
  error: null;
}
```

---

## APPENDIX A: TypeScript Type Definitions

```typescript
// ─── Common ──────────────────────────────────────────
type PaginationObject = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

// ─── Invitation ───────────────────────────────────────
type EventObject = {
  event_id: string;
  type: "akad" | "resepsi" | "pemberkatan" | "lainnya";
  name: string;
  date: string;           // "2026-12-12"
  start_time: string;     // "08:00"
  end_time: string | null;
  venue_name: string;
  venue_address: string;
  maps_url: string | null;
  maps_embed_url: string | null;
};

type DigitalGiftObject = {
  enabled: boolean;
  qris_image_url: string | null;
  bank_accounts: Array<{
    bank_account_id: string;
    bank_name: string;
    account_number: string;
    account_name: string;
  }>;
};

// ─── Theme ───────────────────────────────────────────
type ThemeSummaryObject = {
  theme_id: string;
  name: string;
  slug: string;
  category: string;
  price_type: "free" | "premium" | "exclusive";
  preview_url: string;
  is_popular: boolean;
  is_new: boolean;
};

type ThemeDetailObject = ThemeSummaryObject & {
  description: string;
  style: string;
  price_idr: number;
  screenshots: string[];
  demo_url: string;
  features: string[];
  colors: { primary: string; secondary: string; accent: string };
  fonts: { display: string; body: string };
  usage_count: number;
};
```

---

## APPENDIX B: Error Code Registry

| Code | HTTP | Deskripsi |
|------|------|-----------|
| `VALIDATION_ERROR` | 400 | Input tidak valid (dengan field details) |
| `EMAIL_ALREADY_REGISTERED` | 409 | Email sudah terdaftar |
| `INVALID_CREDENTIALS` | 401 | Email/password salah |
| `UNAUTHENTICATED` | 401 | Tidak ada token atau token expired |
| `ACCESS_DENIED` | 403 | Token valid tapi tidak punya izin |
| `INVITATION_NOT_FOUND` | 404 | Undangan tidak ditemukan |
| `INVITATION_NOT_PUBLISHED` | 404 | Undangan belum/sudah tidak dipublish |
| `SLUG_ALREADY_TAKEN` | 409 | Slug URL sudah dipakai user lain |
| `GALLERY_LIMIT_EXCEEDED` | 400 | Melebihi batas foto per undangan |
| `RSVP_DUPLICATE` | 409 | RSVP untuk nama yang sama sudah ada |
| `AI_RATE_LIMIT_EXCEEDED` | 429 | Kuota AI harian habis |
| `AI_SERVICE_UNAVAILABLE` | 503 | OpenRouter/Claude tidak tersedia |
| `PAYMENT_SESSION_EXPIRED` | 400 | Sesi pembayaran sudah kadaluarsa |
| `PAYMENT_INVALID_SIGNATURE` | 400 | Signature webhook Midtrans tidak valid |
| `PLAN_ALREADY_ACTIVE` | 409 | User sudah punya paket premium aktif |
| `FILE_TOO_LARGE` | 400 | Ukuran file melebihi batas |
| `INVALID_FILE_TYPE` | 400 | Format file tidak didukung |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit umum terlampaui |
| `INTERNAL_SERVER_ERROR` | 500 | Error server yang tidak terduga |

---

*API Contract Documentation v1.0 — NikahKu Platform*
*6 Maret 2026 | Zakiul Fahmi Jailani*
*Digunakan bersama AI Agents Workflow Spec, PRD MVP, Design System, dan Wireframes NikahKu*
