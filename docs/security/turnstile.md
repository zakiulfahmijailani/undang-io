# Cloudflare Turnstile — Layer 3

## Overview
Turnstile adalah invisible CAPTCHA dari Cloudflare. User tidak perlu
menyelesaikan puzzle — Cloudflare menentukan apakah request mencurigakan
secara otomatis.

## Implementasi

| File | Fungsi |
|---|---|
| `src/lib/turnstile.ts` | Server-side Siteverify |
| `src/components/security/TurnstileWidget.tsx` | Client widget |
| `src/hooks/useTurnstile.ts` | Token state management |
| `src/app/api/auth/verify-captcha/route.ts` | Endpoint verify untuk auth |

## Env Vars
| Var | Lokasi | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Client + Server | Site key dari Cloudflare dashboard |
| `TURNSTILE_SECRET_KEY` | Server only | Secret key, jangan expose ke client |

## Flow
1. Widget mount → Cloudflare evaluasi browser secara silent
2. Token di-generate → disimpan via `useTurnstile` hook
3. Form submit → token dikirim sebagai `cf_turnstile_token`
4. API route → `verifyTurnstileToken()` → POST ke Cloudflare Siteverify
5. Invalid token → 403 `TURNSTILE_FAILED`

## Behavior per Environment
| Environment | Behavior |
|---|---|
| Production | Wajib valid token, fail closed |
| Preview | Wajib valid token |
| Development (tanpa env key) | Bypass dengan warning log |
