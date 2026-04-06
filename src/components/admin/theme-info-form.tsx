'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Save, CheckCircle2 } from 'lucide-react'
import { AdminTheme } from '@/types/theme'
import { updateThemeInfo } from '@/app/dashboard/themes/actions'
import { useThemePreviewStore } from '@/stores/theme-preview-store'

interface Props {
  theme: AdminTheme;
}

export function ThemeInfoForm({ theme }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
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

  return (
    <div className="border border-white/10 rounded-xl bg-surface mb-6 overflow-hidden">
      {/* Header / Click to Collapse */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-medium text-white">Basic Theme Info</h3>
          {/* Quick Color Preview */}
          <div className="flex gap-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: formData.color_primary }}></span>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: formData.color_accent }}></span>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: formData.color_text }}></span>
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: formData.color_cta }}></span>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
      </div>

      {/* Form Content */}
      {isExpanded && (
        <div className="p-4 border-t border-white/10 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            {/* Display Name */}
            <div>
              <label className="block text-xs text-white/50 mb-1 font-mono">display_name</label>
              <input 
                type="text" 
                value={formData.display_name}
                onChange={e => setFormData(prev => ({...prev, display_name: e.target.value}))}
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Vintage Botanica"
              />
            </div>
            {/* Culture */}
            <div>
              <label className="block text-xs text-white/50 mb-1 font-mono">culture</label>
              <input 
                type="text" 
                value={formData.culture}
                onChange={e => setFormData(prev => ({...prev, culture: e.target.value}))}
                className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                placeholder="e.g. Javanese"
              />
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-4 gap-4 pt-2">
            {[
              { key: 'color_primary', label: 'Primary' },
              { key: 'color_accent', label: 'Accent' },
              { key: 'color_text', label: 'Text' },
              { key: 'color_cta', label: 'CTA' },
            ].map((col) => (
              <div key={col.key}>
                <label className="block text-[10px] text-white/50 mb-1 font-mono">{col.key}</label>
                <div className="flex bg-black/40 border border-white/10 rounded-md overflow-hidden focus-within:border-emerald-500">
                  <input 
                    type="color" 
                    value={(formData as any)[col.key]}
                    onChange={e => handleColorChange(col.key as any, e.target.value)}
                    className="w-10 h-10 border-0 bg-transparent p-1 cursor-pointer shrink-0"
                  />
                  <input 
                    type="text" 
                    value={(formData as any)[col.key]}
                    onChange={e => handleColorChange(col.key as any, e.target.value)}
                    className="w-full bg-transparent border-0 text-xs px-2 text-white/80 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tags & Premium */}
          <div className="flex gap-4 items-start pt-2">
            <div className="flex-1">
              <label className="block text-xs text-white/50 mb-1 font-mono">mood_keywords</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.mood_keywords.map(tag => (
                  <span key={tag} className="bg-white/10 text-xs px-2 py-1 rounded-md flex items-center gap-1 text-white/80">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="text-white/40 hover:text-white">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={currentTag}
                  onChange={e => setCurrentTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Type and press Enter..."
                />
                <button onClick={handleAddTag} className="bg-white/10 px-3 py-1.5 rounded-md text-sm hover:bg-white/20">Add</button>
              </div>
            </div>

            <div className="w-32">
              <label className="block text-xs text-white/50 mb-2 font-mono">is_premium</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.is_premium}
                  onChange={e => setFormData(prev => ({...prev, is_premium: e.target.checked}))}
                  className="w-4 h-4 accent-emerald-500 rounded bg-white/10 border-white/20"
                />
                <span className="text-sm font-medium text-amber-500">Premium Tier</span>
              </label>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSaving ? <span className="animate-spin text-xl">◌</span> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Theme Info'}
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
