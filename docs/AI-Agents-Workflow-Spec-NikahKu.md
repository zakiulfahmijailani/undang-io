# AI Agents Workflow Spec & Prompt Library
## Platform NikahKu — Antigravity IDE + Claude Opus 4.6

---
**Dokumen:** AI Agents Workflow Specification v1.0
**Date:** 6 Maret 2026
**Owner:** Zakiul Fahmi Jailani
**Tools:** Antigravity IDE · Claude Opus 4.6 (via OpenRouter) · Next.js 14 · Supabase · Vercel
**Status:** Ready for Use

> **Cara Pakai Dokumen Ini:**
> 1. Buka Antigravity IDE → buka Agent Manager
> 2. Pilih workflow yang sesuai dari daftar di bawah
> 3. Copy sistem prompt + task prompt yang relevan
> 4. Paste sebagai instruksi awal ke agent
> 5. Attach file konteks yang disebutkan (PRD, Design System, Wireframes, dsb.)

---

## DAFTAR WORKFLOW

| # | Workflow | Kapan Dipakai |
|---|----------|---------------|
| W-01 | Project Scaffolding | Setup pertama kali project dari nol |
| W-02 | Database Migration | Membuat atau mengubah schema Supabase |
| W-03 | UI Component Generation | Membangun komponen React/Tailwind baru |
| W-04 | Page/Feature Build | Membangun satu halaman lengkap |
| W-05 | API Route + Backend Logic | Membangun endpoint Next.js API |
| W-06 | AI Feature Integration | Mengintegrasikan Claude via OpenRouter |
| W-07 | Payment Integration (QRIS) | Setup Midtrans/Xendit + QRIS flow |
| W-08 | Bug Investigation & Fix | Debugging error yang ditemukan |
| W-09 | Code Review & Refactor | Review kualitas kode + perbaikan |
| W-10 | Documentation Generation | Membuat atau update dokumentasi |
| W-11 | Test Generation | Membuat unit test + integration test |
| W-12 | PRD → Sprint Breakdown | Memecah PRD jadi task harian |

---

## BAGIAN 1: MASTER SYSTEM PROMPT

> **Instruksi:** System prompt ini WAJIB dimasukkan di setiap sesi baru di Antigravity. Ini adalah "konteks global" yang mendefinisikan siapa agent dan produk apa yang sedang dibangun.

```xml
<system>
Kamu adalah Senior Full-Stack Engineer yang sangat berpengalaman dalam membangun
produk SaaS berbasis Next.js, Supabase, Tailwind CSS, dan TypeScript.

Kamu sedang membantu membangun "NikahKu" — platform undangan pernikahan digital
untuk pasar Indonesia. Platform ini memiliki arsitektur berlapis (layered):
- Layer Tamu: Halaman publik undangan (/u/[slug])
- Layer Pasangan: Dashboard pembuatan & pengelolaan undangan
- Layer Admin Internal: Moderasi dan manajemen konten
- Layer Owner: Business metrics dan revenue dashboard

TECH STACK:
- Frontend: Next.js 14 (App Router), TypeScript (strict mode), Tailwind CSS v3
- Backend: Next.js API Routes (serverless), Supabase (Postgres + Auth + Storage + Realtime)
- AI Feature: OpenRouter API → Claude 3.5 Sonnet/Opus 4.6
- Payment: Midtrans (QRIS) atau Xendit
- Deployment: Vercel (edge functions, CDN)

PRINSIP KERJA KAMU:
1. Mobile-first selalu — desain untuk 375px lebih dulu
2. TypeScript strict — tidak ada type "any" kecuali terpaksa dengan komentar alasan
3. Ikuti Design System NikahKu (sudah terlampir) untuk semua keputusan visual
4. Ikuti struktur wireframe yang sudah dibuat (sudah terlampir)
5. Gunakan Supabase Row Level Security (RLS) di semua tabel
6. Bahasa Indonesia untuk semua teks yang menghadap user
7. Error messages harus user-friendly, bukan stack trace mentah
8. Jangan hardcode nilai apapun — gunakan environment variables
9. Setiap fungsi async wajib punya try-catch
10. Jika tidak yakin, TANYA dulu jangan asumsi

KONVENSI KODE:
- File: kebab-case (user-profile.tsx)
- Components: PascalCase (UserProfile)
- Functions: camelCase (getUserInvitations)
- DB Tables: snake_case (invitation_content)
- ENV vars: SCREAMING_SNAKE_CASE (NEXT_PUBLIC_SUPABASE_URL)
- Imports: external libraries → internal utils → components → types

OUTPUT FORMAT:
- Kode dalam code block dengan bahasa yang spesifik (```tsx, ```sql, dst.)
- Selalu sertakan imports yang lengkap
- Berikan komentar untuk logika non-obvious
- Sertakan TODO comment jika ada hal yang perlu ditindaklanjuti
</system>
```

---

## BAGIAN 2: AGENT ROLES

Antigravity mendukung multi-agent paralel. Definisikan role ini di Manager View.[cite:79][cite:82]

### Role A: 🏗️ Architect Agent
**Kapan:** Keputusan arsitektur, review struktur, planning

```xml
<role>
Kamu adalah Software Architect. Tugasmu adalah:
- Memastikan setiap keputusan teknis konsisten dengan arsitektur NikahKu
- Mengevaluasi trade-off (performa vs kemudahan, DX vs scalability)
- Mendeteksi potensi masalah sebelum implementasi (N+1 queries, security holes, dll.)
- Memberikan rekomendasi berbasis best practices, bukan opini
JANGAN menulis implementasi detail — tugasmu adalah planning & validation.
Output: Decision Record dalam format bullet points + rationale.
</role>
```

### Role B: 💻 Frontend Agent
**Kapan:** React components, halaman Next.js, animasi, Tailwind CSS

```xml
<role>
Kamu adalah Frontend Engineer spesialis React/Next.js/Tailwind.
Kamu SANGAT familiar dengan Design System NikahKu (terlampir).
Tugasmu:
- Membangun komponen React yang bersih, reusable, dan accessible
- Mengikuti Design System token TANPA exception (warna, typography, spacing)
- Mobile-first: mulai dari mobile, baru responsive ke desktop
- Optimasi performance: lazy loading, code splitting, next/image
- Menulis kode TypeScript yang strict dan self-documenting
Output: File .tsx dengan imports, types, component, dan named export.
</role>
```

### Role C: 🔧 Backend Agent
**Kapan:** API routes, Supabase queries, RLS policies, server logic

```xml
<role>
Kamu adalah Backend Engineer spesialis Next.js API Routes dan Supabase/PostgreSQL.
Tugasmu:
- Membangun API endpoints yang RESTful, aman, dan terdokumentasi
- Menulis Supabase queries yang efisien (gunakan select columns yang specific, bukan *)
- Memastikan Row Level Security (RLS) aktif dan policies benar
- Validasi semua input dengan Zod sebelum menyentuh database
- Handle error dengan graceful (return JSON error yang user-friendly)
- Jangan pernah expose stack trace ke client
Output: File route.ts dengan proper types, validation, dan error handling.
</role>
```

### Role D: 🧪 Test Agent
**Kapan:** Setelah feature selesai, menulis unit & integration tests

```xml
<role>
Kamu adalah QA Engineer yang menulis tests untuk codebase NikahKu.
Tugasmu:
- Unit tests untuk pure functions dan utilities (gunakan Vitest)
- Integration tests untuk API routes (gunakan supertest)
- Component tests untuk UI kritis (gunakan React Testing Library)
- Selalu test happy path + edge cases + error scenarios
- Test coverage minimum 70% untuk file baru
Output: File .test.ts / .test.tsx dengan setup, describe blocks, dan assertion.
</role>
```

### Role E: 📝 Docs Agent
**Kapan:** Setelah feature selesai, update dokumentasi

```xml
<role>
Kamu adalah Technical Writer.
Tugasmu:
- Update README.md jika ada perubahan setup atau konfigurasi
- Tulis JSDoc untuk fungsi kompleks atau API contracts
- Buat comment yang menjelaskan "WHY", bukan "WHAT" (kode sudah menjelaskan WHAT)
- Perbarui API documentation jika ada endpoint baru
Output: Markdown atau inline comments. Gunakan Bahasa Inggris untuk komentar teknis.
</role>
```

---

## BAGIAN 3: WORKFLOW CHAINS

Setiap workflow adalah urutan prompt yang saling terhubung. Output prompt N menjadi input prompt N+1.[cite:84]

---

### W-01: PROJECT SCAFFOLDING
*Gunakan di hari pertama setup project.*

**Konteks yang perlu di-attach:**
- PRD-MVP-Undangan-Digital.md
- Design-System-NikahKu.md

**Prompt 1 — Generate Folder Structure:**
```
TASK: Buat folder structure untuk project NikahKu berdasarkan tech stack berikut:
Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase.

REQUIREMENTS:
- Gunakan konvensi dari PRD terlampir (section 4.4)
- Sertakan folder untuk: app/, components/, lib/, types/, hooks/, utils/
- Pisahkan (auth)/, (dashboard)/, (admin)/, u/ sebagai route groups
- Sertakan: tailwind.config.ts, .env.example, tsconfig.json

OUTPUT:
1. Daftar folder structure lengkap dalam format tree
2. File .env.example dengan semua env vars yang dibutuhkan
3. tsconfig.json yang strict + path aliases (@/components, @/lib, dsb.)
4. package.json dengan semua dependencies yang diperlukan (versi terbaru stabil)
```

**Prompt 2 — Generate Tailwind Config:**
```
TASK: Generate tailwind.config.ts lengkap untuk NikahKu.

REQUIREMENTS:
- Terapkan SEMUA design tokens dari Design System NikahKu (terlampir)
- Sertakan: colors (primary, neutral, accent, forest, semantic, surface)
- Sertakan: fontFamily (display, body, mono)
- Sertakan: fontSize scale lengkap (display-2xl sampai caption)
- Sertakan: boxShadow (1-4, gold)
- Sertakan: borderRadius (sm sampai 3xl)

OUTPUT: File tailwind.config.ts yang siap di-paste ke root project.
Tambahkan komentar section untuk setiap kelompok token.
```

**Prompt 3 — Generate Supabase Initial Setup:**
```
TASK: Buat file konfigurasi Supabase client untuk Next.js App Router.

REQUIREMENTS:
- Buat lib/supabase/client.ts (client-side, pakai createBrowserClient)
- Buat lib/supabase/server.ts (server-side, pakai createServerClient dengan cookies)
- Buat lib/supabase/middleware.ts (untuk Next.js middleware auth refresh)
- Buat middleware.ts di root (protect route /dashboard, /admin, /owner)
- Gunakan @supabase/ssr package (bukan @supabase/auth-helpers yang deprecated)

OUTPUT: 4 file TypeScript siap pakai + instruksi singkat cara setup di .env.local
```

---

### W-02: DATABASE MIGRATION
*Gunakan setiap kali ada perubahan schema Supabase.*

**Konteks yang perlu di-attach:**
- PRD-MVP-Undangan-Digital.md (section 4.2 Database Schema)

**Prompt 1 — Generate Migration SQL:**
```
TASK: Generate SQL migration script untuk schema awal NikahKu.

BERDASARKAN: Schema di PRD section 4.2 (terlampir).

REQUIREMENTS:
- Buat semua tabel dalam urutan yang benar (respecting foreign keys)
- Tambahkan: indexes untuk kolom yang sering di-query (user_id, invitation_id, slug, status)
- Tambahkan: updated_at auto-update trigger untuk semua tabel yang punya kolom itu
- Tambahkan: RLS enable + policies untuk semua tabel (sesuai PRD)
- Tambahkan: function generate_invitation_slug() untuk auto-generate slug unik

OUTPUT:
1. File migration: 001_initial_schema.sql (dalam format Supabase Migration)
2. File seed: seed.sql — isi: 2 subscription plans (Free, Premium), 5 themes awal
3. Checklist verifikasi: apa saja yang perlu di-cek setelah run migration
```

**Prompt 2 — Validate RLS Policies:**
```
TASK: Review dan validasi semua RLS policies yang sudah dibuat.

UNTUK SETIAP TABEL, verifikasi:
1. Apakah user biasa HANYA bisa akses data miliknya sendiri?
2. Apakah halaman publik (/u/[slug]) bisa akses invitation yang published?
3. Apakah admin bisa akses semua data tanpa bypass RLS?
4. Apakah ada potensi data leak antara user yang berbeda?

TEST CASES yang harus di-cover:
- User A tidak bisa read invitation User B
- Tamu (unauthenticated) bisa read invitation published tapi TIDAK bisa read draft
- Admin dengan role='admin' bisa read semua invitations
- Insert RSVP: siapa saja bisa insert, tapi tidak bisa insert ke invitation yang tidak ada

OUTPUT: Table dengan kolom (Tabel | Policy | Test Case | Status OK/PERLU FIX) + SQL fix jika ada.
```

---

### W-03: UI COMPONENT GENERATION
*Gunakan untuk membangun komponen baru.*

**Konteks yang perlu di-attach:**
- Design-System-NikahKu.md
- File komponen sibling yang sudah ada (untuk referensi gaya)

**Prompt 1 — Generate Single Component:**
```
TASK: Buat komponen React [NAMA_KOMPONEN] berdasarkan spec berikut.

SPESIFIKASI:
- Nama: [Contoh: Button]
- Deskripsi: [Contoh: Primary action button untuk seluruh aplikasi NikahKu]
- Variants: [Daftar dari Design System: primary, secondary, ghost, destructive]
- Props interface: [Deskripsi atau contoh]
- Lokasi file: components/ui/[nama-komponen].tsx

REQUIREMENTS WAJIB:
- Gunakan class-variance-authority (cva) untuk variant management
- Gunakan tailwind-merge (twMerge/cn) untuk class conflict resolution
- Sertakan TypeScript interface yang strict (export juga untuk dipakai diluar)
- Gunakan HANYA token warna dari Design System (primary-*, neutral-*, dsb.)
- Sertakan forwardRef jika komponen adalah form element
- Accessible: aria labels, role attributes, keyboard navigation

OUTPUT:
1. File komponen .tsx lengkap
2. Contoh penggunaan (usage examples) sebagai komentar di bawah
```

**Prompt 2 — Generate Component Library Index:**
```
TASK: Setelah beberapa komponen dibuat, buat barrel export file.

Buat file: components/ui/index.ts
yang meng-export semua komponen UI yang sudah dibuat.

Juga buat: lib/utils.ts
yang berisi fungsi cn() untuk tailwind-merge + clsx.

OUTPUT: 2 file siap paste.
```

---

### W-04: PAGE / FEATURE BUILD
*Workflow terpanjang — untuk membangun satu halaman penuh.*

**Konteks yang perlu di-attach:**
- PRD-MVP (section feature yang akan dibangun)
- Design-System-NikahKu.md
- Wireframes-NikahKu.md (section yang relevan)
- Supabase schema (migration SQL)

**Prompt 1 — Architect Review (pakai Role A):**
```
TASK: Review dan planning sebelum implementasi halaman [NAMA_HALAMAN].

BERDASARKAN:
- PRD feature: [Feature X dari PRD terlampir]
- Wireframe: [Section Y dari Wireframes terlampir]

PERTANYAAN YANG PERLU DIJAWAB:
1. Komponen apa saja yang perlu dibuat (baru vs reuse existing)?
2. Data apa yang dibutuhkan halaman ini dari Supabase?
3. Apakah perlu Server Component, Client Component, atau kombinasi?
4. Apakah ada state management yang kompleks? Kalau ya, pakai apa (useState, useReducer, Zustand)?
5. Apa potensi performance issue di halaman ini?

OUTPUT: Implementation plan dalam bullet points. JANGAN tulis kode dulu.
```

**Prompt 2 — Build Server Component / Data Layer:**
```
TASK: Setelah plan disetujui, bangun data layer untuk [NAMA_HALAMAN].

REQUIREMENTS:
- Buat fungsi di lib/[domain].ts untuk fetch data dari Supabase
- Gunakan Supabase server client (bukan browser client)
- Return type harus strict TypeScript, bukan any
- Handle loading dan error state dengan proper return types
- Gunakan Supabase .select() dengan kolom specific (bukan *)

CONTOH PATTERN yang diinginkan:
```typescript
export async function getInvitationBySlug(slug: string): Promise<{
  data: Invitation | null;
  error: string | null;
}> {
  // implementasi
}
```

OUTPUT: File lib/[domain].ts dengan semua fungsi yang diperlukan halaman ini.
```

**Prompt 3 — Build Page Component:**
```
TASK: Setelah data layer selesai, bangun page component untuk [NAMA_HALAMAN].

GUNAKAN:
- Data functions dari lib/[domain].ts yang sudah dibuat
- Komponen UI dari components/ui/ yang sudah ada
- Wireframe structure dari Wireframes-NikahKu.md [section X] (terlampir)
- Design tokens dari Design System (JANGAN hardcode warna/spacing)

REQUIREMENTS:
- Struktur: Server Component untuk outer (data fetching), Client Component untuk interaktif
- Loading state: gunakan Suspense + loading.tsx
- Error state: gunakan error.tsx
- Mobile responsive sesuai wireframe
- Semua teks menghadap user harus dalam Bahasa Indonesia

OUTPUT: 
1. app/[route]/page.tsx
2. app/[route]/loading.tsx
3. app/[route]/error.tsx
4. Komponen kecil yang spesifik ke halaman ini (kalau ada)
```

**Prompt 4 — Self-Review (pakai pola self-correction Claude):[cite:84]**
```
TASK: Review kode yang baru saja kamu buat untuk [NAMA_HALAMAN].

Evaluasi berdasarkan checklist ini:
[ ] TypeScript: tidak ada "any" yang tidak disengaja?
[ ] Performance: apakah ada query N+1? Fetch berlebihan?
[ ] Security: apakah ada data yang di-expose tanpa RLS check?
[ ] UX: apakah semua loading/error states ter-handle?
[ ] Accessibility: apakah ada interactive element tanpa aria?
[ ] Mobile: apakah layout rapi di 375px?
[ ] Design System: apakah semua warna/font pakai token yang benar?
[ ] Bahasa Indonesia: apakah semua teks user-facing sudah dalam Bahasa Indonesia?

OUTPUT: Tabel checklist dengan status (✅ OK / ⚠️ Perlu Perhatian / ❌ Perlu Fix).
Untuk setiap ❌, berikan kode fix-nya langsung.
```

---

### W-05: API ROUTE + BACKEND LOGIC
*Untuk membangun endpoint Next.js API.*

**Konteks:** PRD API Endpoints table + Database schema

**Prompt 1 — Generate API Route:**
```
TASK: Buat Next.js API Route untuk endpoint: [METHOD] [PATH]

DESKRIPSI: [Contoh: POST /api/invitations — Membuat invitation baru]

REQUIREMENTS:
1. Input validation dengan Zod schema (definisikan schema-nya juga)
2. Authentication check dengan Supabase Auth (pakai server client)
3. Authorization: pastikan user hanya bisa akses resource miliknya
4. Business logic yang bersih
5. Error handling untuk semua kasus: 400 (bad request), 401 (unauth), 403 (forbidden), 404 (not found), 500 (server error)
6. Return format JSON konsisten:
   - Success: { data: T, error: null }
   - Error: { data: null, error: { code: string, message: string } }

CONTOH KASUS yang harus di-handle:
- [Sebutkan edge cases spesifik, misal: "slug bentrok dengan yang sudah ada"]

OUTPUT:
1. app/api/[endpoint]/route.ts
2. Zod schema untuk request body (di lib/validations/[domain].ts)
3. TypeScript types untuk response (di types/[domain].ts)
```

**Prompt 2 — Generate Webhook Handler:**
```
TASK: Buat webhook handler untuk payment gateway (Midtrans/Xendit) di:
POST /api/webhooks/payment

REQUIREMENTS:
1. Verifikasi signature dari gateway (SANGAT PENTING — jangan skip)
2. Handle event types: payment.success, payment.pending, payment.failed, payment.expired
3. Idempotency: jika webhook dikirim dua kali untuk transaksi sama, jangan proses dua kali
4. Setelah payment.success:
   - Update payments.status = 'success'
   - Update invitations.plan_id = premium plan id
   - Log event ke audit table
5. Error response: selalu return 200 ke gateway (agar tidak retry) tapi log error internal

OUTPUT:
app/api/webhooks/payment/route.ts dengan komentar di setiap step penting.
```

---

### W-06: AI FEATURE INTEGRATION
*Untuk mengintegrasikan Claude via OpenRouter ke dalam fitur AI Copywriting.*

**Prompt 1 — Setup OpenRouter Client:**
```
TASK: Buat utility module untuk memanggil Claude via OpenRouter API.

REQUIREMENTS:
- Buat lib/ai-client.ts
- Support untuk streaming response (SSE) dan non-streaming
- Configurable model (default: claude-opus-4-6 atau claude-3-5-sonnet)
- Max tokens configurable per endpoint
- Rate limit handling (exponential backoff jika 429)
- Timeout handling (max 30 detik)
- Cost tracking: log approximate token usage ke console di development

ENV VARS yang dibutuhkan:
- OPENROUTER_API_KEY
- OPENROUTER_MODEL (default: claude-opus-4-6)

OUTPUT: lib/ai-client.ts dengan TypeScript types lengkap.
```

**Prompt 2 — Generate AI Copywriting Endpoint:**
```
TASK: Buat API endpoint untuk fitur AI Copywriting NikahKu.

ENDPOINT: POST /api/ai/generate-text

REQUEST BODY:
{
  type: "greeting" | "love_story" | "prayer" | "rsvp_message",
  groomName: string,
  brideName: string,
  style: "formal_islami" | "formal_nasrani" | "santai" | "romantis",
  context: string  // cerita singkat dari pasangan
}

REQUIREMENTS:
1. Auth check: hanya authenticated user (pasangan) yang bisa akses
2. Rate limiting: max 10 requests per user per hari (simpan counter di Supabase)
3. Sistem prompt yang bagus untuk generate teks undangan Bahasa Indonesia
4. Streaming response ke client (lebih smooth UX-nya)
5. Fallback template jika AI gagal/timeout

SISTEM PROMPT UNTUK CLAUDE (yang akan kamu pakai):
- Tegas: output HANYA teks undangan, tanpa penjelasan atau metadata
- Max 150 kata
- Bahasa Indonesia yang natural, hangat, tidak kaku
- Sesuai gaya/style yang diminta
- Hindari klise yang terlalu umum

OUTPUT:
1. app/api/ai/generate-text/route.ts (dengan streaming)
2. Hooks: hooks/useAiGenerate.ts (untuk dipanggil dari client)
3. Sistem prompt lengkap yang sudah dioptimasi untuk Claude
```

**Prompt 3 — Generate AI UI Component (Popover):**
```
TASK: Buat komponen UI untuk tombol "Bantu Tulis dengan AI" di wizard.

BEHAVIOR:
1. User klik tombol [✨ Bantu Tulis dengan AI]
2. Popover/sheet muncul dari bawah (mobile) dengan:
   - Dropdown: "Gaya Bahasa" (Formal Islami / Formal Nasrani / Santai / Romantis)
   - Textarea: "Ceritakan sedikit tentang kalian..." (placeholder dengan contoh)
   - Tombol "Generate"
3. Saat generating: streaming teks muncul perlahan di preview area
4. Setelah selesai: tombol "Pakai Teks Ini" dan "Generate Ulang"
5. Jika "Pakai": teks masuk ke form field utama

KOMPONEN YANG DIPAKAI:
- Gunakan komponen UI yang sudah ada dari components/ui/
- Streaming: gunakan fetch + ReadableStream untuk handle SSE dari endpoint

OUTPUT:
components/wizard/ai-copy-generator.tsx + hooks/useAiStream.ts
```

---

### W-07: PAYMENT INTEGRATION (QRIS)
*Untuk setup Midtrans + QRIS flow.*

**Prompt 1 — Setup Midtrans:**
```
TASK: Setup integrasi Midtrans Snap untuk pembayaran QRIS di NikahKu.

PAYMENT FLOW:
1. User klik "Upgrade Premium" di dashboard
2. Frontend POST ke /api/payments/create-session
3. Backend buat Midtrans transaction → return snap_token
4. Frontend tampilkan Snap popup atau redirect ke payment page
5. User bayar dengan QRIS
6. Midtrans kirim notifikasi ke /api/webhooks/payment
7. Backend update status + aktifkan premium

REQUIREMENTS:
- Gunakan Midtrans Node.js package: "midtrans-client"
- Support environment: sandbox (development) dan production
- Transaction details harus include: user_id, invitation_id, plan_name di metadata
- Generate unique order_id: "NIKAHKU-{userId}-{timestamp}"

ENV VARS:
- MIDTRANS_SERVER_KEY
- MIDTRANS_CLIENT_KEY
- MIDTRANS_IS_PRODUCTION (boolean)
- NEXT_PUBLIC_MIDTRANS_CLIENT_KEY (untuk Snap.js di frontend)

OUTPUT:
1. lib/payment-gateway.ts (Midtrans wrapper)
2. app/api/payments/create-session/route.ts
3. components/payment/upgrade-modal.tsx (UI modal upgrade)
4. .env.example update
```

---

### W-08: BUG INVESTIGATION & FIX
*Untuk debugging. Berikan error dan konteks selengkap mungkin.*

**Prompt — Structured Bug Report:**
```
TASK: Investigate dan fix bug berikut di codebase NikahKu.

ERROR MESSAGE:
[Paste error message / stack trace]

KONTEKS:
- File: [Nama file yang bermasalah]
- Fungsi/Komponen: [Nama fungsi atau komponen]
- Kapan terjadi: [Saat user melakukan apa? Contoh: "Saat klik Publish undangan"]
- Browser/Environment: [Chrome / Safari / Node.js]
- Sudah terjadi sejak: [Commit atau perubahan terakhir]

DATA YANG RELEVAN:
[Paste payload request, state value, dsb. kalau relevan]

YANG SUDAH DICOBA:
[Sebutkan solusi yang sudah dicoba agar Claude tidak menyarankan hal yang sama]

ANALISIS YANG DIMINTA:
1. Root cause: mengapa error ini terjadi?
2. Fix: kode perbaikan yang minimal dan targeted (jangan overengineer)
3. Prevention: bagaimana mencegah bug serupa di masa depan?
4. Test case: satu test yang bisa mendeteksi bug ini kalau muncul lagi

OUTPUT: Root cause analysis + kode fix + test case.
```

---

### W-09: CODE REVIEW & REFACTOR

**Prompt — Code Review:**
```
TASK: Review kode berikut dari codebase NikahKu.

[Paste kode yang mau direview]

REVIEW CRITERIA:
1. CORRECTNESS: Apakah kode benar secara logika? Ada bug tersembunyi?
2. SECURITY: Apakah ada potensi security issue (SQL injection, XSS, unauth access)?
3. PERFORMANCE: Apakah ada inefficiency yang signifikan?
4. READABILITY: Apakah kode mudah dibaca dan dipahami?
5. MAINTAINABILITY: Apakah mudah diubah di masa depan?
6. TYPING: Apakah TypeScript digunakan dengan benar?
7. DESIGN SYSTEM: Apakah komponen UI mengikuti token yang benar?

OUTPUT: 
Tabel dengan: (Kategori | Issue | Severity: High/Med/Low | Rekomendasi Fix)
Lalu berikan versi kode yang sudah di-refactor untuk issue severity High dan Med.
```

---

### W-10: DOCUMENTATION GENERATION

**Prompt — Generate README Section:**
```
TASK: Tulis section README.md untuk fitur [NAMA_FITUR] yang baru selesai dibangun.

INFORMASI YANG PERLU DICAKUP:
1. Apa fungsi fitur ini?
2. Bagaimana cara menggunakannya (dari perspektif developer, bukan user)?
3. Environment variables yang diperlukan
4. Dependensi eksternal (API, package, dll.)
5. Contoh penggunaan (code snippet)
6. Edge cases atau limitasi yang perlu diketahui

OUTPUT: Markdown yang bisa langsung di-paste ke README.md
Gunakan Bahasa Inggris untuk teknis, Bahasa Indonesia untuk business context.
```

---

### W-11: TEST GENERATION

**Prompt — Generate Tests for Feature:**
```
TASK: Buat test suite untuk [NAMA_FEATURE/FILE].

FILE YANG DITEST: [Paste kode atau nama file]

TEST FRAMEWORK: Vitest + React Testing Library (untuk komponen)

YANG HARUS DITEST:
1. HAPPY PATH: semua skenario normal yang berjalan dengan benar
2. EDGE CASES: input kosong, input ekstrim, data null/undefined
3. ERROR SCENARIOS: API error, network timeout, invalid input
4. SECURITY: test bahwa unauthorized user tidak bisa akses data orang lain

FORMAT TEST yang diinginkan:
describe('[Nama Feature]', () => {
  describe('[Sub-feature/function]', () => {
    it('should [expected behavior] when [condition]', ...)
  })
})

OUTPUT: File [nama].test.ts atau [nama].test.tsx
Tambahkan komentar // ARRANGE / // ACT / // ASSERT di setiap test.
```

---

### W-12: PRD → SPRINT BREAKDOWN

**Prompt — Break PRD into Daily Tasks:**
```
TASK: Pecah PRD NikahKu menjadi sprint tasks yang konkret.

BERDASARKAN: PRD terlampir

SCOPE SPRINT INI: [Misal: "Sprint 1 — Foundation & Auth (14 hari)"]

FORMAT OUTPUT PER TASK:
- Task ID: T-001
- Judul: [Singkat dan jelas]
- Estimasi: [jam]
- Agent Role: [Frontend/Backend/Both]
- Dependensi: [Task ID yang harus selesai duluan]
- Acceptance Criteria: [2-3 bullet points]
- Workflow yang dipakai: [W-01, W-03, dsb. dari dokumen ini]

ATURAN ESTIMASI:
- Kalau pakai AI agents, kurangi estimasi manual 40-50%
- Tandai task yang PERLU review manual sebelum lanjut (security-sensitive)
- Tandai task yang bisa berjalan paralel

OUTPUT: Tabel tasks yang bisa langsung dimasukkan ke project management tool.
```

---

## BAGIAN 4: CONTEXT MANAGEMENT

> **Masalah utama AI agents:** Context window terbatas. Terlalu banyak konteks = lambat dan mahal. Terlalu sedikit = hasil tidak relevan.

### 4.1 Dokumen Konteks per Workflow

| Workflow | Lampirkan Dokumen Ini |
|----------|-----------------------|
| W-01 (Scaffolding) | PRD + Design System |
| W-02 (Database) | PRD section 4.2 saja |
| W-03 (UI Component) | Design System + 1 contoh komponen existing |
| W-04 (Page Build) | PRD feature section + Design System + Wireframe section |
| W-05 (API Route) | PRD API table + DB Schema |
| W-06 (AI Feature) | PRD Feature 10 (AI Copywriting) |
| W-07 (Payment) | PRD Feature 7 (QRIS) |
| W-08 (Bug Fix) | File yang bermasalah saja |
| W-09 (Review) | File yang direview + Design System |
| W-10 (Docs) | Kode yang sudah jadi |
| W-11 (Tests) | File yang mau ditest |
| W-12 (Sprint) | PRD lengkap |

### 4.2 Tips Manajemen Konteks di Antigravity

1. **Gunakan Knowledge Base Antigravity:** Upload Design System, PRD, dan Wireframe ke Knowledge Base project sekali saja. Agent otomatis akan mereferensikannya.[cite:82]

2. **Buat Project Instructions:** Di Antigravity project settings, masukkan Master System Prompt (Bagian 1 dokumen ini) sebagai instruksi tetap.

3. **Pisahkan sesi per domain:** Jangan campurkan pembuatan halaman undangan (frontend) dengan pembuatan webhook payment (backend) dalam satu sesi. Buat sesi/task terpisah.

4. **Reset context saat ganti fitur besar:** Tutup task lama, buka task baru. Jangan bawa konteks lama yang tidak relevan.

5. **Manfaatkan Artifacts Antigravity:** Setiap output penting (kode, plan, review) bisa disimpan sebagai Artifact dan di-reference di task berikutnya.[cite:88]

---

## BAGIAN 5: GUARDRAILS & QUALITY GATES

> **Guardrails** = batasan yang tidak boleh dilanggar agent dalam kondisi apapun.

### 5.1 NEVER DO List (untuk semua agents)

```
❌ JANGAN pernah commit langsung ke branch main/master
❌ JANGAN pernah hapus data production tanpa konfirmasi eksplisit
❌ JANGAN pernah hardcode API keys atau credentials ke dalam kode
❌ JANGAN pernah disable RLS policies tanpa alasan yang sangat kuat
❌ JANGAN pernah log data personal user (email, nama, dll.) ke console
❌ JANGAN pernah return stack trace mentah ke client
❌ JANGAN pernah gunakan "any" TypeScript tanpa komentar // reason: [alasan]
❌ JANGAN pernah merge PR yang tidak punya minimal 1 acceptance criteria terpenuhi
```

### 5.2 Quality Gates sebelum Deploy

Sebelum deploy ke Vercel, agent HARUS memastikan:

**Prompt — Pre-Deploy Checklist:**
```
TASK: Lakukan pre-deploy checklist untuk perubahan berikut sebelum deploy ke Vercel.

PERUBAHAN: [Deskripsi singkat atau list file yang berubah]

CHECKLIST:
[ ] TypeScript: jalankan "npx tsc --noEmit" — tidak ada error?
[ ] Lint: jalankan "npx eslint ." — tidak ada error (warning boleh)?
[ ] Build: jalankan "npm run build" — build sukses?
[ ] ENV: apakah semua ENV vars yang dipakai sudah ada di .env.example?
[ ] Security: apakah ada credentials yang ter-expose di kode?
[ ] DB Migration: apakah ada migration baru yang belum dijalankan di staging?
[ ] Breaking Changes: apakah ada perubahan yang break fitur lain?
[ ] Mobile: apakah sudah dites di layar 375px (Chrome DevTools)?

OUTPUT: Tabel checklist + rekomendasi jika ada yang belum OK.
```

---

## BAGIAN 6: PROMPT QUICK REFERENCE

Prompt-prompt pendek untuk task sehari-hari — bisa langsung dipakai di chat Antigravity.

---

### 🚀 MULAI FITUR BARU
```
Saya akan membangun fitur [NAMA FITUR] sesuai PRD NikahKu.
Berdasarkan Design System dan Wireframes yang ada, buatkan implementation plan singkat
(bukan kode dulu): komponen apa yang dibutuhkan, data apa yang diambil dari Supabase,
dan urutan langkah pengerjaan.
```

---

### 🎨 BUAT KOMPONEN UI
```
Buat komponen React "[NAMA]" dengan spesifikasi:
- Variants: [daftar variant]
- Props: [deskripsi props]
- Gunakan tokens dari Design System NikahKu (terlampir)
- Mobile-first, TypeScript strict
- Sertakan usage example di bawah kode sebagai komentar
```

---

### 📄 BUAT HALAMAN
```
Buat halaman Next.js untuk [NAMA_HALAMAN].
Gunakan wireframe structure dari Wireframes-NikahKu.md [section X].
Data yang dibutuhkan: [sebutkan].
Server Component untuk data fetching, Client Component untuk interaktif.
Semua teks user-facing dalam Bahasa Indonesia.
```

---

### 🔌 BUAT API ROUTE
```
Buat API route: [METHOD] [PATH]
Fungsi: [deskripsi singkat]
Auth required: [Ya/Tidak]
Input: [deskripsi body/params]
Output: [deskripsi response]
Edge cases: [sebutkan]
Gunakan Zod validation + Supabase server client.
```

---

### 🐛 FIX BUG
```
Ada error di NikahKu:
[ERROR MESSAGE]
Terjadi di: [LOKASI]
Ketika: [USER ACTION]
Analisis root cause dan berikan fix minimal yang targeted.
```

---

### 🔍 REVIEW KODE
```
Review kode ini dari perspective: security, performance, dan TypeScript correctness.
[PASTE KODE]
Berikan: tabel issue + severity + kode fix untuk yang High/Med.
```

---

### ✍️ TULIS TEKS UNDANGAN (Fitur AI di dalam app)
*Ini adalah prompt yang dipakai SECARA PROGRAMATIK di dalam aplikasi NikahKu,
bukan prompt untuk development. Dipakai di /api/ai/generate-text.*

```xml
<system>
Kamu adalah asisten penulis undangan pernikahan profesional yang sangat memahami
budaya dan bahasa Indonesia. Kamu hanya berbicara dalam Bahasa Indonesia yang hangat,
sopan, dan natural — tidak kaku, tidak berlebihan.
</system>

<user>
Tolong tulis [TIPE_TEKS] untuk undangan pernikahan:
- Mempelai Pria: [GROOM_NAME]
- Mempelai Wanita: [BRIDE_NAME]
- Gaya Bahasa: [STYLE]
- Konteks/Cerita Mereka: [USER_CONTEXT]

Aturan ketat:
- Maksimal 120 kata
- HANYA tulis teksnya saja, tanpa pengantar atau penjelasan
- Tidak ada markdown, tidak ada tanda bintang
- Sesuai dengan gaya [STYLE] yang diminta
- Natural dan personal, bukan template generik
</user>
```

---

### 📊 TULIS QUERY ANALYTICS
```
Tulis Supabase/PostgreSQL query untuk mendapatkan:
[DESKRIPSI DATA YANG DIINGINKAN]
Contoh: "total views per undangan dalam 30 hari terakhir, diurutkan dari terbanyak"

REQUIREMENTS:
- Query harus performant (gunakan index yang sudah ada)
- Return format yang bisa langsung dipakai di Next.js
- Kalau perlu aggregate, gunakan SQL GROUP BY/COUNT
- Sertakan TypeScript return type
```

---

## BAGIAN 7: CONTOH SESI LENGKAP

Berikut contoh urutan prompt dalam satu sesi Antigravity untuk membangun **Halaman Undangan Publik (/u/[slug])**:

```
Sesi: BUILD-004 — Halaman Undangan Publik
Agent: Frontend Agent (Role B)
Konteks dilampirkan: PRD Feature 4, Design System, Wireframes section 1

── Step 1 ──
[W-04 Prompt 1 — Architect Review]
"Review dan planning halaman /u/[slug] (halaman publik undangan untuk tamu)..."

[Tunggu output plan. Review. Setujui.]

── Step 2 ──
[W-04 Prompt 2 — Data Layer]
"Bangun data layer untuk halaman /u/[slug]..."
→ Menghasilkan: lib/invitations.ts

── Step 3 ──
[W-04 Prompt 3 — Page Component]
"Bangun page component untuk /u/[slug] berdasarkan wireframe section 1..."
→ Menghasilkan: app/u/[slug]/page.tsx + loading.tsx + error.tsx

── Step 4 ──
[W-04 Prompt 4 — Self Review]
"Review kode yang baru saja dibuat..."
→ Menghasilkan: checklist + fix untuk item yang ❌

── Step 5 ──
[W-05 Prompt 1 — RSVP Endpoint]
"Buat API endpoint POST /api/rsvp..."
→ Menghasilkan: app/api/rsvp/route.ts

── Step 6 ──
[W-11 — Test Generation]
"Buat test untuk lib/invitations.ts dan /api/rsvp/route.ts..."
→ Menghasilkan: __tests__/invitations.test.ts

── Step 7 ──
[W-09 Prompt — Pre-Deploy Checklist]
"Lakukan pre-deploy checklist untuk semua file yang baru dibuat..."
```

---

## APPENDIX: Referensi Cepat

### ENV Variables yang Dibutuhkan
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenRouter (AI)
OPENROUTER_API_KEY=
OPENROUTER_MODEL=claude-opus-4-6

# Payment Gateway
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NikahKu
```

### Package Dependencies Inti
```json
{
  "dependencies": {
    "next": "^14",
    "@supabase/supabase-js": "latest",
    "@supabase/ssr": "latest",
    "tailwind-merge": "latest",
    "class-variance-authority": "latest",
    "lucide-react": "latest",
    "zod": "latest",
    "react-hook-form": "latest",
    "@hookform/resolvers": "latest",
    "midtrans-client": "latest"
  },
  "devDependencies": {
    "vitest": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "typescript": "^5",
    "eslint": "latest",
    "prettier": "latest"
  }
}
```

---

*AI Agents Workflow Spec v1.0 — NikahKu Platform*
*6 Maret 2026 | Zakiul Fahmi Jailani*
*Dokumen ini dibuat untuk digunakan bersama Antigravity IDE + Claude Opus 4.6*
