# Device Fingerprinting — Layer 2

## Overview
Device fingerprinting digunakan untuk menambah sinyal abuse pada guest
invitation creation. Tujuannya bukan menggantikan rate limiting, tetapi
membatasi percobaan berulang dari perangkat yang sama meskipun IP berubah.

Fingerprint hanya dipakai untuk flow guest-session dan disimpan sebagai
`device_fingerprint` di tabel `guest_sessions`.

## Implementasi

| File | Fungsi |
|---|---|
| `src/hooks/useDeviceFingerprint.ts` | Generate fingerprint browser dengan FingerprintJS |
| `src/lib/guest-session-client.ts` | Mengirim fingerprint ke `POST /api/guest-session` |
| `src/app/(public)/buat-undangan/_components/buat-undangan-content.tsx` | Memasang hook di flow buat undangan |
| `src/app/api/guest-session/route.ts` | Menyimpan `device_fingerprint`, `ip_address`, dan `user_agent` |
| `supabase/migrations/20260614000001_guest_session_fingerprint.sql` | Kolom, index, dan trigger limit fingerprint |

## Env Vars

Tidak ada env var khusus untuk fingerprinting.

## Storage

| Lokasi | Key / Kolom | Keterangan |
|---|---|---|
| Browser `sessionStorage` | `device_fp` | Cache fingerprint untuk sesi browser aktif |
| Database `guest_sessions` | `device_fingerprint` | Sinyal limit perangkat |
| Database `guest_sessions` | `ip_address` | Sinyal limit jaringan |
| Database `guest_sessions` | `user_agent` | Audit/debug abuse pattern |

## Flow
1. Halaman `/buat-undangan` mount
2. `useDeviceFingerprint()` cek `sessionStorage.device_fp`
3. Jika belum ada, hook load `@fingerprintjs/fingerprintjs`
4. Fingerprint disimpan ke `sessionStorage`
5. Submit guest session mengirim field `fingerprint`
6. API route menyimpan fingerprint ke `guest_sessions.device_fingerprint`
7. Database trigger membatasi maksimal 3 guest sessions per fingerprint per jam

## Fallback

| Kondisi | Behavior |
|---|---|
| FingerprintJS gagal load | Submit tetap jalan tanpa fingerprint |
| `sessionStorage` tidak tersedia | Submit tetap jalan tanpa fingerprint |
| Fingerprint kosong | Database tetap membatasi berdasarkan IP jika tersedia |

## Error Codes

| Code | Arti |
|---|---|
| `RATE_LIMIT_FP` | Terlalu banyak guest session dari perangkat yang sama |
| `RATE_LIMIT_IP` | Terlalu banyak guest session dari jaringan yang sama |

## Privacy Notes

- Fingerprint tidak ditampilkan ke user.
- Fingerprint tidak dipakai untuk auth atau identitas akun.
- Fingerprint hanya menjadi sinyal abuse prevention untuk guest-session funnel.
