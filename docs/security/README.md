# Security Overview — undang.io

undang.io menggunakan pendekatan berlapis (defense in depth) untuk keamanan.

## Security Layers

| Layer | Teknologi | Lokasi | Docs |
|---|---|---|---|
| 1 | Upstash Rate Limiting | API routes (Edge) | [rate-limiting.md](./rate-limiting.md) |
| 2 | Device Fingerprinting | Middleware + API | [fingerprinting.md](./fingerprinting.md) |
| 3 | Cloudflare Turnstile | Form submission | [turnstile.md](./turnstile.md) |
| 4 | Supabase RLS | Database layer | [rls-policy.md](./rls-policy.md) |

## Prinsip Utama

- **Defense in depth** — setiap layer independen, kalau satu bypass masih ada layer lain
- **Fail closed** — kalau ragu, tolak request
- **Least privilege** — setiap user/role hanya dapat akses minimum yang dibutuhkan
- **No trust on client** — semua validasi kritis ada di server/database, bukan client

## Titik Kritis yang Dilindungi

| Endpoint / Flow | Layer yang Aktif |
|---|---|
| `POST /api/guest-session` | Rate limit + Fingerprint + Turnstile + RLS |
| `POST /buat-undangan` | Rate limit + Turnstile + RLS |
| `POST /register` | Turnstile + RLS |
| `POST /login` | Turnstile + RLS |
| Baca data undangan orang lain | RLS |
| Edit/hapus undangan orang lain | RLS |
