'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { createTheme } from '@/app/dashboard/themes/actions'
import { toast } from 'sonner'

export function CreateThemeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slug, setSlug] = useState('')
  const router = useRouter()

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const autoSlug = value.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
    setSlug(autoSlug)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!/^[a-z0-9_]+$/.test(slug)) { 
      setError('Slug hanya boleh huruf kecil, angka, dan underscore')
      setIsSubmitting(false)
      return 
    }
    if (slug.length < 3) { 
      setError('Slug minimal 3 karakter')
      setIsSubmitting(false)
      return 
    }

    const formData = new FormData(e.currentTarget)

    try {
      const res = await createTheme(formData)
      if (res.success && res.data) {
        setIsOpen(false)
        toast.success(`Tema "${res.data.name}" berhasil dibuat!`, { description: 'Sekarang upload aset untuk tema ini.' })
        router.push(`/dashboard/themes/${res.data.slug}/assets`)
      } else {
        setError(res.error || 'Failed to create theme')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <Plus className="w-4 h-4" /> Buat Tema Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h2 className="font-semibold text-white">Buat Tema Baru</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Display Name</label>
                <input
                  type="text"
                  name="display_name"
                  required
                  onChange={handleNameChange}
                  placeholder="e.g. Vintage Botanica"
                  className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">Theme Key (Slug)</label>
                <input
                  type="text"
                  name="theme_key"
                  required
                  readOnly
                  value={slug}
                  placeholder="e.g. vintage_botanica"
                  className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white opacity-70 cursor-not-allowed focus:outline-none"
                />
                <p className="text-xs text-emerald-500/80 mt-1">Slug: {slug || '-'}</p>
              </div>

              {error && (
                <div className="text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-900 border-dashed">
                  {error}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-white/60 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Membuat...' : 'Buat Tema'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
