# 🚩 Gatepoint — undang.io Stable Checkpoint

> Tanggal: 2 April 2026

Ini adalah checkpoint stabil sebelum eksperimen fitur berikutnya.

## ✅ Yang Sudah Selesai

### Classic Theme — 9 Section
| Slot | Section | Status |
|------|---------|--------|
| 0 | Cover Overlay (musik + tombol buka) | ✅ |
| 1 | Hero (countdown + nama + foto) | ✅ |
| 2 | Couple (profil mempelai + orang tua) | ✅ |
| 3 | Event (Akad & Resepsi cards) | ✅ |
| 4 | Love Story Timeline | ✅ |
| 5 | Gallery Masonry + Lightbox | ✅ |
| 6 | Gift / Amplop Digital | ✅ |
| 7 | RSVP & Ucapan | ✅ |
| 8 | Footer | ✅ |

### Database Supabase
| Tabel | RLS |
|-------|-----|
| `invitations` | ✅ 6 policy |
| `rsvp_messages` | ✅ read + insert public |
| `theme_assets` | ✅ admin write + public read |

### Admin Dashboard
- `/dashboard` — overview stats
- `/dashboard/assets` — upload & manage theme assets
- `/dashboard/invitations` — list undangan

### Upload Pipeline
- `POST /api/admin/upload-theme-asset` — strict role gate (admin/owner only)
- Supabase Storage bucket: `theme-assets`
- `profiles.role = 'owner'` terset untuk akun owner

## 🚀 Next Steps
- Connect `ClassicThemeRenderer` ke `theme_assets` DB (fetch dynamic by `theme_key`)
- Step 16: Halaman edit undangan (CRUD semua field `InvitationData`)
- Generate aset tematik pertama (`classic_jawa`) via Midjourney/Adobe Firefly
