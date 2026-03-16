---
name: integrating-lovable-repo
description: Integrates newly generated Lovable repository code into the main undang-io repo. Use when the user says "integrasikan dari Lovable", "ada repo baru dari Lovable", "merge dari joy-knot", "integrasikan hasil Lovable", or asks to copy/merge code from a separate Lovable-generated repo into undang-io. Always read AGENTS.md first before doing anything.
---

# Integrating Lovable Repo → undang-io

## Pre-flight checklist
- [ ] Baca AGENTS.md di root undang-io
- [ ] Audit repo sumber (lihat AUDIT.md)
- [ ] Tentukan file mana yang diintegrasikan
- [ ] Tentukan file mana yang di-skip
- [ ] Selesaikan adaptasi stack (lihat ADAPTATION.md)
- [ ] Jalankan `npm run build` di undang-io
- [ ] Verifikasi halaman existing tidak rusak

## Workspace paths
- Repo utama (production): `undang-io` → https://github.com/zakiulfahmijailani/undang-io
- Repo sumber Lovable: bisa berubah, tanyakan ke user nama repo terbaru
- Domain live: https://undang.io (Vercel)
- Skills dir: `.claude/skills/`

## Stack undang-io (jangan diubah)
- Framework: Next.js 15 App Router + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Auth + DB: Supabase (PostgreSQL + RLS)
- Deployment: Vercel
- Payment: Midtrans
- Pattern: Lazy Registration with Anonymous Session Migration

## Prinsip integrasi
1. **JANGAN timpa** file yang sudah ada di undang-io tanpa review
2. **JANGAN copy** config files (next.config, tailwind.config, tsconfig, package.json) dari Lovable — gunakan yang ada di undang-io
3. **JANGAN copy** auth logic dari Lovable — undang-io punya sistem sendiri
4. **BOLEH copy** komponen UI, halaman baru, dan styling yang belum ada
5. **Selalu adaptasi** import path dari Lovable ke struktur undang-io

## Step 1 — Baca AGENTS.md
```bash
cat AGENTS.md
```

## Step 2 — Audit repo sumber
Lihat AUDIT.md untuk panduan membandingkan file.

## Step 3 — Filter file yang relevan
Skip selalu:
- `package.json`, `package-lock.json`
- `next.config.*`, `tailwind.config.*`, `tsconfig.json`
- `.env*`, `supabase/` (kecuali migration baru)
- `src/lib/supabase/`, `src/app/api/auth/`
- `src/app/(auth)/` (login/register sudah ada di undang-io)

Candidate copy:
- Komponen UI baru di `src/components/`
- Halaman baru di `src/app/`
- Utilitas baru di `src/lib/`
