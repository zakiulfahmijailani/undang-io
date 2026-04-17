'use client'

import { useState } from 'react'
import { Save, CheckCircle2, X, Plus } from 'lucide-react'
import { AdminTheme } from '@/types/theme'
import { updateThemeInfo } from '@/app/dashboard/themes/actions'
import { useThemePreviewStore } from '@/stores/theme-preview-store'

interface Props {
  theme: AdminTheme;
}

export function ThemeInfoForm({ theme }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [formData, setFormData] = useState({
    display_name: theme.display_name || '',
    culture: theme.culture || '',
    color_primary: theme.color_primary || '#1B4F32',
    color_accent: theme.color_accent || '#D4AF37',
    color_text: theme.color_text || '#333333',
    color_cta: theme.color_cta || '#2563EB',
    is_premium: theme.is_premium || false,
    mood_keywords: theme.mood_keywords || [],
  })

  const [currentTag, setCurrentTag] = useState('')

  const { setColors } = useThemePreviewStore()

  const handleColorChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    
    // Update live preview directly avoiding intermediate render wait
    if (key.startsWith('color_')) {
       const mappedKey = key.replace('color_', '') as 'primary' | 'accent' | 'text' | 'cta';
       // We'll trust the store sync effect handles it or do it here
    }
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.mood_keywords.includes(currentTag.trim())) {
      setFormData(prev => ({ ...prev, mood_keywords: [...prev.mood_keywords, currentTag.trim()] }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, mood_keywords: prev.mood_keywords.filter(t => t !== tag) }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const res = await updateThemeInfo(theme.theme_key, formData)
      if (res.success) {
        setSaveSuccess(true)
        // Update live preview
        setColors({
          primary: formData.color_primary,
          accent: formData.color_accent,
          text: formData.color_text,
          cta: formData.color_cta,
        })
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        alert(res.error || 'Failed to update theme')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const colorFields = [
    { key: 'color_primary', label: 'Primary' },
    { key: 'color_accent', label: 'Accent' },
    { key: 'color_text', label: 'Text' },
    { key: 'color_cta', label: 'CTA' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable form content */}
      <div className="flex-1 space-y-5 pb-20">
        
        {/* Display Name */}
        <div>
          <label className="block text-[11px] font-medium text-white/50 mb-1.5 uppercase tracking-wider">
            Nama Tema
          </label>
          <input 
            type="text" 
            value={formData.display_name}
            onChange={e => setFormData(prev => ({...prev, display_name: e.target.value}))}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
            placeholder="e.g. Vintage Botanica"
          />
        </div>

        {/* Culture */}
        <div>
          <label className="block text-[11px] font-medium text-white/50 mb-1.5 uppercase tracking-wider">
            Budaya / Culture
          </label>
          <input 
            type="text" 
            value={formData.culture}
            onChange={e => setFormData(prev => ({...prev, culture: e.target.value}))}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
            placeholder="e.g. Javanese"
          />
        </div>

        {/* Color Pickers */}
        <div>
          <label className="block text-[11px] font-medium text-white/50 mb-2.5 uppercase tracking-wider">
            Palet Warna
          </label>
          <div className="grid grid-cols-2 gap-3">
            {colorFields.map((col) => (
              <div key={col.key} className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 group focus-within:border-emerald-500/50 transition-all">
                {/* Color swatch */}
                <div className="relative">
                  <div 
                    className="w-7 h-7 rounded-md border border-white/[0.1] cursor-pointer shrink-0"
                    style={{ backgroundColor: (formData as any)[col.key] }}
                  />
                  <input 
                    type="color" 
                    value={(formData as any)[col.key]}
                    onChange={e => handleColorChange(col.key as any, e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {/* Label + Hex */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-white/40 leading-none mb-0.5">{col.label}</div>
                  <input 
                    type="text" 
                    value={(formData as any)[col.key]}
                    onChange={e => handleColorChange(col.key as any, e.target.value)}
                    className="w-full bg-transparent text-xs text-white/80 focus:outline-none font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Keywords / Tags */}
        <div>
          <label className="block text-[11px] font-medium text-white/50 mb-2 uppercase tracking-wider">
            Mood Keywords
          </label>
          {formData.mood_keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {formData.mood_keywords.map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center gap-1 bg-white/[0.08] text-[11px] px-2.5 py-1 rounded-full text-white/70 border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  {tag}
                  <button 
                    onClick={() => handleRemoveTag(tag)} 
                    className="text-white/30 hover:text-red-400 transition-colors ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input 
              type="text" 
              value={currentTag}
              onChange={e => setCurrentTag(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all"
              placeholder="Ketik lalu Enter..."
            />
            <button 
              onClick={handleAddTag}
              className="px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-white/50 hover:text-white/80 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Premium Toggle */}
        <div className="flex items-center justify-between bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3">
          <div>
            <div className="text-sm font-medium text-white">Premium Tier</div>
            <div className="text-[11px] text-white/30">Tema ini hanya untuk pelanggan premium</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={formData.is_premium}
              onChange={e => setFormData(prev => ({...prev, is_premium: e.target.checked}))}
            />
            <div className="w-9 h-5 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/60 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 peer-checked:after:bg-white"></div>
          </label>
        </div>

      </div>

      {/* Sticky Save Button */}
      <div className="sticky bottom-0 pt-3 pb-1 bg-gradient-to-t from-[#111111] via-[#111111] to-transparent">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            saveSuccess
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/30'
          } disabled:opacity-50`}
        >
          {isSaving ? (
            <><span className="animate-spin text-base">◌</span> Menyimpan...</>
          ) : saveSuccess ? (
            <><CheckCircle2 className="w-4 h-4" /> Tersimpan!</>
          ) : (
            <><Save className="w-4 h-4" /> Simpan Info Tema</>
          )}
        </button>
      </div>
    </div>
  )
}
