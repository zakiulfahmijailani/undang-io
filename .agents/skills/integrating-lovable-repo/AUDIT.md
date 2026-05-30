Berikut isi lengkap file `AUDIT.md` yang bisa langsung kamu copy-paste:

***

**File: `.claude/skills/integrating-lovable-repo/AUDIT.md`**

```markdown
# Audit Prosedur — Repo Sumber (joy_knot) vs Repo Utama (umuman)

> Jalankan audit ini SEBELUM menulis satu baris kode pun.
> Isi tabel pemetaan di bagian bawah file ini sebelum lanjut ke integrasi.

---

## STEP A — Audit Repo Sumber (joy_knot)

### A1. Baca route definitions
```bash
cat C:\project_umuman\joy_knot\src\App.tsx
```
Catat semua route yang didefinisikan di React Router.
Petakan ke Next.js App Router path yang sesuai.

### A2. Audit komponen
```bash
ls C:\project_umuman\joy_knot\src\components\
```
Untuk setiap subfolder/file, catat:
- nama komponen
- fungsinya
- apakah sudah ada padanannya di umuman atau belum

### A3. Audit pages
```bash
ls C:\project_umuman\joy_knot\src\pages\
```
Catat semua halaman beserta path route-nya.

### A4. Audit hooks
```bash
ls C:\project_umuman\joy_knot\src\hooks\
```
Catat hooks yang baru dan belum ada di umuman.

### A5. Audit types
```bash
ls C:\project_umuman\joy_knot\src\types\
```
Catat type/interface baru yang perlu diadaptasi.

### A6. Audit lib/utils
```bash
ls C:\project_umuman\joy_knot\src\lib\
```
Catat helper/utility yang bisa dipakai langsung vs harus ditulis ulang.

### A7. Audit data/mock
```bash
ls C:\project_umuman\joy_knot\src\data\
```
Catat struktur data dummy sebagai acuan shape data.

### A8. Audit dependencies baru
```bash
cat C:\project_umuman\joy_knot\package.json
```
Bandingkan dengan:
```bash
cat C:\project_umuman\umuman\package.json
```
Catat dependency yang ada di joy_knot tapi belum ada di umuman.
Tandai mana yang:
- ✅ aman diinstall
- ⚠️ perlu dicek dulu
- 🚫 jangan diinstall (Vite-specific, react-router-dom, dll)

### A9. Audit Tailwind config
```bash
cat C:\project_umuman\joy_knot\tailwind.config.ts
```
Bandingkan dengan:
```bash
cat C:\project_umuman\umuman\tailwind.config.ts
```
Catat:
- custom colors yang perlu di-merge
- custom keyframes/animations yang perlu di-merge
- custom fontFamily yang perlu di-merge
- nilai yang hanya ada di joy_knot

### A10. Audit API routes (jika ada)
```bash
ls C:\project_umuman\joy_knot\src\api\
```
atau
```bash
ls C:\project_umuman\joy_knot\src\server\
```
Catat endpoint yang ada dan adaptasi ke Next.js Route Handler.

---

## STEP B — Audit Repo Utama (umuman)

### B1. Struktur route existing
```bash
ls C:\project_umuman\umuman\src\app\
```
Catat semua folder/halaman yang sudah ada dan JANGAN disentuh.

### B2. Komponen existing
```bash
ls C:\project_umuman\umuman\src\components\
```
Catat komponen yang mungkin bisa di-reuse daripada membuat ulang.

### B3. API routes existing
```bash
ls C:\project_umuman\umuman\src\app\api\
```
Cek apakah API yang dibutuhkan sudah ada, perlu diupdate, atau perlu dibuat baru.

### B4. Supabase client setup
```bash
cat C:\project_umuman\umuman\src\lib\supabase\client.ts
cat C:\project_umuman\umuman\src\lib\supabase\server.ts
```
Pastikan gunakan client yang sudah ada ini. Jangan buat ulang.

### B5. Pattern TypeScript existing
```bash
cat C:\project_umuman\umuman\src\types\database.types.ts
```
Ikuti konvensi types yang ada.

### B6. Pattern response API existing
Baca beberapa file di `src/app/api/` untuk memahami format response envelope yang dipakai.
Format wajib:
```typescript
type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string; details?: unknown } | null;
}
```

### B7. Halaman yang sudah VERIFIED WORKING (jangan sentuh)
Verifikasi dengan membaca file-file ini:
- `src/app/(auth)/login/` — halaman login
- `src/app/(auth)/register/` — halaman register
- `src/middleware.ts` — auth guard
- `src/components/ui/` — shadcn primitives
- Halaman dashboard user yang sudah stabil

---

## STEP C — Jalankan Script Audit Otomatis

Untuk melihat perbedaan komponen secara cepat:
```bash
cd C:\project_umuman\umuman
python .claude/skills/integrating-lovable-repo/scripts/audit_diff.py
cat audit_result.txt
```

Output akan menampilkan:
- File yang hanya ada di joy_knot → kandidat integrasi
- File yang hanya ada di umuman → jangan disentuh
- File yang ada di keduanya → cek konflik

---

## STEP D — Isi Tabel Pemetaan Sebelum Coding

> WAJIB diisi sebelum mulai menulis kode apapun.

### D1. Pemetaan Route

| Route di joy_knot (React Router) | Route di umuman (Next.js App Router) | Status |
|---|---|---|
| (isi setelah audit A1) | | Baru / Update / Skip |

### D2. Pemetaan Komponen

| File di joy_knot | Target di umuman | Aksi | Catatan |
|---|---|---|---|
| `src/components/XYZ.tsx` | `src/components/X/XYZ.tsx` | Adaptasi | Butuh 'use client' |

### D3. Pemetaan Hooks

| Hook di joy_knot | Target di umuman | Aksi |
|---|---|---|
| `src/hooks/useXYZ.ts` | `src/hooks/useXYZ.ts` | Copy / Adaptasi / Skip |

### D4. Pemetaan API Routes

| Endpoint di joy_knot | Route Handler di umuman | Aksi |
|---|---|---|
| (isi setelah audit A10) | `src/app/api/.../route.ts` | Buat / Update / Skip |

### D5. Dependencies Baru

| Package | Versi | Perlu Install? | Alasan |
|---|---|---|---|
| framer-motion | latest | ✅ Ya | Animasi undangan |
| canvas-confetti | latest | ✅ Ya | Efek confetti/petals |
| embla-carousel-react | latest | ✅ Ya | Galeri carousel |
| react-router-dom | — | 🚫 Tidak | Tidak dipakai di Next.js |

### D6. Tailwind Additions

| Key | Value | Ada di umuman? | Aksi |
|---|---|---|---|
| colors.gold | #D4A91C | Tidak | Merge ke extend.colors |

---

## STEP E — Checklist Final Sebelum Mulai Coding

- [ ] Semua tabel D1–D6 sudah diisi
- [ ] Sudah konfirmasi halaman mana yang tidak boleh disentuh
- [ ] Sudah tahu struktur Supabase client di umuman
- [ ] Sudah tahu pattern response API di umuman
- [ ] Script audit_diff.py sudah dijalankan
- [ ] audit_result.txt sudah dibaca
- [ ] ADAPTATION.md sudah dibaca
- [ ] Siap mulai integrasi secara additive

---

*AUDIT.md — Umuman Integration Skills*
*Bagian dari: `.claude/skills/integrating-lovable-repo/`*
```

***

File ini sudah lengkap dengan semua step A sampai E, tabel pemetaan yang wajib diisi oleh agent sebelum mulai coding, dan checklist final. Simpan di `.claude/skills/integrating-lovable-repo/AUDIT.md` persis sesuai path yang ada di struktur folder skill sebelumnya.