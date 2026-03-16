# AGENTS.md — undang-io

> Baca file ini sebelum melakukan apapun di repo ini.
> File ini adalah sumber kebenaran untuk semua AI agent yang bekerja di project ini.

---

## Identitas Project

- **Nama:** undang.io
- **Domain:** https://undang.io
- **Repo:** https://github.com/zakiulfahmijailani/undang-io
- **Deployment:** Vercel (auto-deploy dari branch `main`)
- **Database:** Supabase (PostgreSQL + RLS)
- **Payment:** Midtrans Snap
- **Status:** Production — ada pengguna nyata dan potensi revenue

---

## Stack Teknis

| Layer | Teknologi |
|---|---|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase PostgreSQL + Row Level Security |
| Storage | Supabase Storage |
| Deployment | Vercel |
| Payment | Midtrans Snap |
| AI Agents | AG (Antigravity) |

---

## Pattern Inti — Lazy Registration

undang.io menggunakan pattern **Lazy Registration with Anonymous Session Migration**.
Ini adalah funnel monetisasi utama. Jangan rusak alur ini.

Alur singkat:
```
Buat undangan (tanpa login) → preview 15 menit → Register/Login
→ claim session (timer +10 menit) → Dashboard → Bayar Rp 45.000
→ Undangan permanen published
```

Detail lengkap: lihat `.claude/skills/lazy-registration/SKILL.md`

---

## Aturan Wajib untuk Semua Agent

### JANGAN dilakukan:
- ❌ Push langsung ke `main` tanpa review jika menyentuh payment flow
- ❌ Disable atau bypass RLS di Supabase
- ❌ Hapus atau modifikasi migration yang sudah ada
- ❌ Ubah auth callback URL tanpa update di Supabase Auth settings
- ❌ Commit `.env` atau secret key apapun
- ❌ Panggil claim API dari server action — harus dari client side
- ❌ Auto-convert guest_session ke invitations sebelum payment
- ❌ Redirect ke `/u/[slug]` setelah login — selalu ke `/dashboard`

### SELALU dilakukan:
- ✅ Gunakan `getAdminClient()` untuk operasi yang bypass RLS
- ✅ Verifikasi Midtrans signature di webhook sebelum proses
- ✅ Buat migration file baru — jangan edit yang lama
- ✅ Sertakan RLS policy di setiap tabel baru
- ✅ Panggil `router.refresh()` di dashboard setelah redirect dari login
- ✅ Test di localhost dulu sebelum push ke main

---

## Struktur Direktori Penting

```
src/
├── app/
│   ├── (auth)/           # Login, Register — client-side auth + claim
│   ├── api/
│   │   ├── auth/callback/ # Google OAuth callback
│   │   ├── guest-sessions/ # CRUD guest sessions
│   │   └── payment/       # Midtrans create-transaction + notification webhook
│   ├── dashboard/         # Private user workspace
│   │   ├── page.tsx       # Server component — fetch invitations + guest_sessions
│   │   └── components/
│   │       ├── GuestConversion.tsx   # router.refresh() trigger
│   │       └── GuestSessionCard.tsx  # Card dengan countdown timer
│   └── u/[slug]/          # Public invitation preview page
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── admin.ts       # Admin/service role client
│   └── midtrans/          # Midtrans SDK wrapper
supabase/
└── migrations/            # SQL migration files — JANGAN edit yang sudah ada
.claude/
├── AGENTS.md              # File ini
└── skills/
    ├── lazy-registration/      # Pattern inti undang-io
    ├── payment-midtrans/       # Payment flow
    ├── migrating-supabase-schema/ # Database migrations
    ├── managing-theme-assets/  # Manajemen aset tema
    ├── demo-mode-setup/        # Mode demo tanpa Supabase
    └── integrating-lovable-repo/ # Integrasi dari Lovable
```

---

## Environment Variables (wajib ada)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # WAJIB untuk admin client

# Midtrans
MIDTRANS_SERVER_KEY=
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false     # true di production Vercel

# App
NEXT_PUBLIC_SITE_URL=https://undang.io
```

---

## Skills yang Tersedia

| Skill | Kapan digunakan |
|---|---|
| `lazy-registration` | Alur guest session, claim, dashboard |
| `payment-midtrans` | Integrasi Midtrans, webhook, payment flow |
| `migrating-supabase-schema` | Buat tabel baru, update schema |
| `managing-theme-assets` | Upload/manage aset tema undangan |
| `demo-mode-setup` | Setup mode demo tanpa Supabase |
| `integrating-lovable-repo` | Integrasi komponen dari Lovable |
