
**File: `.claude/skills/integrating-lovable-repo/ADAPTATION.md`**

```markdown
# Panduan Adaptasi Stack — Vite SPA (joy_knot) → Next.js App Router (umuman)

> Baca file ini setelah AUDIT.md selesai diisi.
> Setiap kode dari joy_knot yang masuk ke umuman WAJIB melewati checklist adaptasi ini.

---

## 1. ROUTING

joy_knot menggunakan React Router DOM.
umuman menggunakan Next.js App Router (file-based routing).

### Ganti import routing
```typescript
// ❌ joy_knot — HAPUS
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom'

// ✅ umuman — GANTI DENGAN INI
import Link from 'next/link'
import { useRouter, useParams, usePathname } from 'next/navigation'
```

### Ganti navigasi programmatic
```typescript
// ❌ joy_knot
const navigate = useNavigate()
navigate('/dashboard')
navigate(`/invite/${slug}`)
navigate(-1) // back

// ✅ umuman
const router = useRouter()
router.push('/dashboard')
router.push(`/invite/${slug}`)
router.back()
```

### Ganti akses URL params
```typescript
// ❌ joy_knot
const { id, slug } = useParams()

// ✅ umuman (di dalam Client Component)
const params = useParams()
const id = params.id as string
const slug = params.slug as string

// ✅ umuman (di Server Component / page.tsx)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params
}
```

### Ganti struktur file halaman
```
❌ joy_knot
src/pages/Dashboard.tsx         → route /dashboard
src/pages/InvitationEdit.tsx    → route /invitation/:id/edit

✅ umuman
src/app/dashboard/page.tsx
src/app/dashboard/undangan/[id]/edit/page.tsx
```

### Hapus React Router dari package.json
Jangan install `react-router-dom` di umuman.

---

## 2. ENVIRONMENT VARIABLES

```typescript
// ❌ joy_knot
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
import.meta.env.VITE_*

// ✅ umuman
process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
process.env.NEXT_PUBLIC_*
```

---

## 3. CLIENT vs SERVER COMPONENTS

Next.js App Router membedakan Server Component dan Client Component.
Default semua file adalah **Server Component**.
Tambahkan `'use client'` HANYA jika diperlukan.

### Tambahkan `'use client'` jika komponen menggunakan:
```typescript
'use client' // ← wajib di baris PERTAMA, sebelum semua import

// Trigger wajib pakai 'use client':
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
// Event handlers: onClick, onChange, onSubmit, onKeyDown
// Browser APIs: window, document, navigator, localStorage, sessionStorage
// Framer Motion animasi interaktif
// canvas-confetti
// Embla Carousel hooks
// Custom hooks yang menggunakan hooks di atas
```

### JANGAN tambahkan `'use client'` jika:
- Komponen hanya menerima props dan render HTML statis
- Komponen fetch data dari Supabase di server
- Komponen adalah layout tanpa state

### Contoh pemisahan yang benar
```typescript
// ✅ Server Component — src/app/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data } = await supabase.from('invitations').select('*')
  return <DashboardClient invitations={data} />
}

// ✅ Client Component — src/components/dashboard/DashboardClient.tsx
'use client'
import { useState } from 'react'

export default function DashboardClient({ invitations }) {
  const [selected, setSelected] = useState(null)
  // ...
}
```

---

## 4. SUPABASE CLIENT

Jangan buat ulang Supabase client dari joy_knot.
Gunakan yang sudah ada di umuman.

```typescript
// ❌ joy_knot — jangan copy ini
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ✅ umuman — pakai yang sudah ada
// Di Client Component:
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()

// Di Server Component / API Route:
import { createClient } from '@/lib/supabase/server'
const supabase = createClient()

// Di API Route yang butuh service role:
import { createClient } from '@/lib/supabase/admin'
const supabase = createClient()
// ⚠️ admin client HANYA boleh di server/API, TIDAK di client component
```

---

## 5. IMAGE HANDLING

```typescript
// ✅ Untuk aset statis yang path-nya diketahui
import Image from 'next/image'
<Image src="/assets/logo.png" alt="logo" width={120} height={40} />

// ✅ Untuk URL dinamis dari upload user (tidak diketahui dimensinya)
<img src={photoUrl} alt={altText} className="..." />
// Tambahkan always: alt yang deskriptif

// ❌ Jangan gunakan next/image untuk URL dari public/uploads/ yang dinamis
// karena membutuhkan konfigurasi domain tambahan di next.config.ts
```

---

## 6. FILE UPLOAD

```typescript
// ❌ joy_knot — mungkin pakai Supabase Storage atau base64
const { data } = await supabase.storage.from('bucket').upload(path, file)

// ✅ umuman — pakai API route lokal (fase dev)
const formData = new FormData()
formData.append('file', file)
formData.append('type', 'themes') // atau 'invitations'

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})
const { data } = await response.json()
// data.url = '/uploads/themes/images/filename.jpg'
```

---

## 7. API ROUTES

joy_knot mungkin punya Express/Vite API atau langsung fetch.
umuman menggunakan Next.js Route Handlers.

```typescript
// ✅ Struktur API Route di umuman
// File: src/app/api/[nama]/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Selalu gunakan response envelope ini:
type ApiResponse<T> = {
  data: T | null
  error: { code: string; message: string; details?: unknown } | null
}

export async function GET(req: Request) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'Silakan login terlebih dahulu.' }
    }, { status: 401 })
  }

  // logic...
  return NextResponse.json({ data: result, error: null })
}

export async function POST(req: Request) {
  const body = await req.json()

  // Selalu validasi dengan Zod
  const schema = z.object({ name: z.string().min(1) })
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Data tidak valid.',
        details: parsed.error.flatten().fieldErrors
      }
    }, { status: 400 })
  }

  // logic dengan parsed.data...
}
```

---

## 8. FONTS

```typescript
// ❌ joy_knot — mungkin pakai tag <link> di index.html atau CSS import
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script" rel="stylesheet">

// ✅ umuman — pakai next/font/google di layout.tsx
// File: src/app/layout.tsx
import { Dancing_Script, Great_Vibes, Playfair_Display } from 'next/font/google'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script'
})

export default function RootLayout({ children }) {
  return (
    <html className={`${dancingScript.variable}`}>
      <body>{children}</body>
    </html>
  )
}

// Pakai di Tailwind:
// tailwind.config.ts → fontFamily: { 'dancing': ['var(--font-dancing-script)'] }
// className="font-dancing"
```

---

## 9. TAILWIND CONFIG MERGE

```typescript
// ✅ Cara merge tailwind dari joy_knot ke umuman
// Buka keduanya, tambahkan nilai dari joy_knot ke umuman secara additive

// tailwind.config.ts umuman — TAMBAHKAN jangan replace
export default {
  content: [...],
  theme: {
    extend: {
      colors: {
        // nilai existing umuman...
        // + tambahkan dari joy_knot yang belum ada:
        'gold': {
          100: '#FFF8DC',
          400: '#D4A91C',
          600: '#B8860B',
        },
        'warm-stone': '#F5F0E8',
        'champagne': '#F7E7CE',
      },
      keyframes: {
        // nilai existing umuman...
        // + tambahkan dari joy_knot:
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh)', opacity: '0' }
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'float-up': 'float-up 3s ease-in forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards'
      },
      fontFamily: {
        // tambahkan dari joy_knot yang belum ada
      }
    }
  }
}
```

---

## 10. DEPENDENCY CHECKLIST

Sebelum install apapun, jalankan:
```bash
cat C:\project_umuman\umuman\package.json | grep dependencies -A 50
```

### Boleh install jika belum ada
| Package | Kegunaan |
|---|---|
| `framer-motion` | Animasi scroll, parallax, whileInView |
| `canvas-confetti` | Efek confetti / kelopak jatuh |
| `embla-carousel-react` | Galeri foto carousel |
| `sonner` | Toast notifications (jika belum ada) |

### JANGAN install
| Package | Alasan |
|---|---|
| `react-router-dom` | Tidak dipakai di Next.js |
| `vite` | Build tool joy_knot, tidak relevan |
| `@vitejs/*` | Plugin Vite, tidak relevan |
| `react-scripts` | Create React App, tidak relevan |

---

## 11. CHECKLIST ADAPTASI PER FILE

Untuk setiap file yang dipindahkan dari joy_knot ke umuman,
centang semua item berikut sebelum dianggap selesai:

- [ ] Hapus semua import dari `react-router-dom`
- [ ] Ganti dengan `next/link` dan `next/navigation`
- [ ] Ganti semua `import.meta.env.VITE_*` dengan `process.env.NEXT_PUBLIC_*`
- [ ] Tambahkan `'use client'` jika ada useState/useEffect/handlers
- [ ] Pastikan `'use client'` ada di baris PERTAMA sebelum semua import
- [ ] Ganti Supabase client dengan yang ada di `@/lib/supabase/`
- [ ] Ganti `<img>` statis dengan `next/image` jika path diketahui
- [ ] Pastikan semua teks UI dalam Bahasa Indonesia
- [ ] Pastikan tidak ada `any` di TypeScript
- [ ] Jalankan `npm run type-check` setelah adaptasi

---

*ADAPTATION.md — Umuman Integration Skills*
*Bagian dari: `.claude/skills/integrating-lovable-repo/`*
```

