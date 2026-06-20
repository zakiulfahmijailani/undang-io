# Upstash Rate Limiting — Layer 1

## Overview
Rate limiting berjalan di Edge Middleware untuk membatasi traffic API sebelum
request masuk ke route handler. Guest invitation creation punya limit tambahan
karena flow ini bisa dipakai tanpa login.

Jika Upstash tidak dikonfigurasi atau sedang gagal, middleware fail open agar
user asli tidak terblokir total. Guest session tetap punya guard tambahan di
database trigger.

## Implementasi

| File | Fungsi |
|---|---|
| `src/middleware.ts` | Edge guard untuk API routes, bot user-agent, dan header `x-client-ip` |
| `src/lib/rate-limit.ts` | Konfigurasi Upstash Redis + Ratelimit |
| `src/app/api/guest-session/route.ts` | Menangani error `RATE_LIMIT_IP` dan `RATE_LIMIT_FP` dari database |
| `src/app/api/guest-sessions/route.ts` | Legacy guest-session creation path |
| `src/app/api/invitations/guest/route.ts` | Legacy invitation guest creation path |
| `supabase/migrations/20260614000001_guest_session_fingerprint.sql` | Database trigger limit IP/fingerprint |

## Env Vars

| Var | Lokasi | Keterangan |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Server / Edge | URL Redis REST dari Upstash |
| `UPSTASH_REDIS_REST_TOKEN` | Server / Edge | Token Redis REST dari Upstash |

## Limits

| Scope | Limit | Response |
|---|---|---|
| Semua API non-exempt | 30 request / 1 menit / IP | `429 RATE_LIMIT_API` |
| Guest-session creation | 3 request / 1 jam / IP | `429 RATE_LIMIT_GUEST_SESSION` |
| Database IP guard | 5 guest sessions / 1 jam / IP | `429 RATE_LIMIT_IP` |
| Database fingerprint guard | 3 guest sessions / 1 jam / device fingerprint | `429 RATE_LIMIT_FP` |

## Flow
1. Request masuk ke `src/middleware.ts`
2. IP dibaca dari `x-forwarded-for` atau `x-real-ip`
3. Middleware menambahkan header internal `x-client-ip`
4. Bot user-agent umum ditolak dengan `403 BOT_DETECTED`
5. Upstash mengecek limit API umum
6. Untuk `POST /api/guest-session`, `POST /api/guest-sessions`, dan `POST /api/invitations/guest`, Upstash mengecek limit guest-session khusus
7. Route handler menyimpan `ip_address` ke `guest_sessions`
8. Database trigger memberi guard tambahan berdasarkan IP dan device fingerprint

## Exempt Paths

| Path | Alasan |
|---|---|
| `/api/webhooks/payment` | Webhook Midtrans harus selalu bisa masuk dan punya verifikasi signature sendiri |
| `/api/cron/` | Cron internal punya auth/secret sendiri |

## Error Codes

| Code | Arti |
|---|---|
| `BOT_DETECTED` | User-agent cocok dengan pola bot/headless umum |
| `RATE_LIMIT_API` | Limit API global terkena |
| `RATE_LIMIT_GUEST_SESSION` | Limit guest-session Edge terkena |
| `RATE_LIMIT_IP` | Limit database berdasarkan IP terkena |
| `RATE_LIMIT_FP` | Limit database berdasarkan device fingerprint terkena |
