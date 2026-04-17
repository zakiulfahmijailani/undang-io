'use client'

import { useState, useCallback } from 'react'
import { SectionConfig } from '@/types/theme'
import { updateSectionConfig } from '@/app/dashboard/themes/actions'

interface Props {
  themeKey: string;
  initialConfig: SectionConfig | undefined;
  onConfigChange: (newConfig: SectionConfig) => void;
}

const DEFAULT_CONFIG: SectionConfig = {
  show_foto_cover: true,
  show_data_mempelai: true,
  show_ayat_quote: true,
  show_kisah_cinta: true,
  show_acara: true,
  show_galeri_foto: true,
  show_amplop_digital: true,
  show_musik: true
}

export function SectionToggleBar({ themeKey, initialConfig, onConfigChange }: Props) {
  const [config, setConfig] = useState<SectionConfig>(initialConfig || DEFAULT_CONFIG)
  const [isSaving, setIsSaving] = useState(false)

  // simple debounce
  const debounce = <T extends unknown[]>(
    func: (...args: T) => void,
    delay: number
  ) => {
    let timeoutId: NodeJS.Timeout
    return (...args: T) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const saveToDb = useCallback(
    debounce(async (newConfig: SectionConfig) => {
      setIsSaving(true)
      try {
        await updateSectionConfig(themeKey, newConfig)
      } finally {
        setIsSaving(false)
      }
    }, 500),
    [themeKey]
  )

  const toggle = (key: keyof SectionConfig) => {
    const newConfig = { ...config, [key]: !config[key] }
    setConfig(newConfig)
    onConfigChange(newConfig)
    saveToDb(newConfig)
  }

  const sections: { key: keyof SectionConfig | null; label: string; disable?: boolean }[] = [
    { key: null, label: 'Informasi Dasar', disable: true }, // selalu aktif
    { key: 'show_foto_cover', label: 'Foto & Cover' },
    { key: 'show_ayat_quote', label: 'Ayat & Quote' },
    { key: 'show_data_mempelai', label: 'Data Mempelai' },
    { key: 'show_kisah_cinta', label: 'Kisah Cinta' },
    { key: 'show_acara', label: 'Acara' },
    { key: 'show_galeri_foto', label: 'Galeri Foto' },
    { key: 'show_amplop_digital', label: 'Amplop Digital' },
    { key: 'show_musik', label: 'Musik' },
  ]

  return (
    <div className="flex items-center gap-1.5 p-2.5 px-4 bg-black/30 border-b border-white/[0.06] flex-wrap">
      <div className="flex items-center gap-1.5 flex-wrap flex-1">
        {sections.map(s => {
          const isActive = s.disable ? true : config[s.key as keyof SectionConfig]
          
          return (
            <button
              key={s.label}
              disabled={s.disable}
              onClick={() => s.key && toggle(s.key)}
              className={`
                px-3 py-1.5 rounded-full text-[11px] font-medium transition-all
                ${s.disable 
                  ? 'bg-white/[0.08] text-white/40 cursor-not-allowed' 
                  : isActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05] border border-transparent'
                }
              `}
            >
              {s.label}
            </button>
          )
        })}
      </div>
      
      <span className={`text-[10px] shrink-0 transition-colors ${
        isSaving ? 'text-amber-400/60' : 'text-white/20'
      }`}>
        {isSaving ? '● Saving...' : '● Saved'}
      </span>
    </div>
  )
}
