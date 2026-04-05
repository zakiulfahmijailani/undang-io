'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Copy, CheckCircle2 } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function ThemeBriefPromptGenerator() {
  const params = useParams()
  const themeKey = params.themeKey as string

  const [brief, setBrief] = useState({
    culture: '',
    iconic_landmark: '',
    iconic_symbol: '',
    ornament_style: '',
    mood_keywords: '',
    color_primary: '#1B4F32',
    color_accent: '#D4AF37',
    color_text: '#333333',
    color_cta: '#2563EB',
  })

  const [copiedSlot, setCopiedSlot] = useState<string | null>(null)

  const slots = [
    { slot: 'cover_scene', ratio: '2:3', style: 'cinematic wide illustration', focus: 'wedding invitation cover scene', extra: 'Format: vertical portrait 2:3 ratio, full bleed.' },
    { slot: 'left_panel_alt', ratio: '2:3', style: 'decorative illustration', focus: 'left panel backdrop for wedding details', extra: 'Format: vertical portrait 2:3 ratio, ample negative space.' },
    { slot: 'corner_tl', ratio: '1:1', style: 'transparent vector asset', focus: 'top-left corner ornament piece', extra: 'White or solid background to be removed later. No cropped edges on the inner side.' },
    { slot: 'corner_tr', ratio: '1:1', style: 'transparent vector asset', focus: 'top-right corner ornament piece', extra: 'White or solid background to be removed later. No cropped edges on the inner side.' },
    { slot: 'corner_bl', ratio: '1:1', style: 'transparent vector asset', focus: 'bottom-left corner ornament piece', extra: 'White or solid background to be removed later. No cropped edges on the inner side.' },
    { slot: 'corner_br', ratio: '1:1', style: 'transparent vector asset', focus: 'bottom-right corner ornament piece', extra: 'White or solid background to be removed later. No cropped edges on the inner side.' },
    { slot: 'divider_main', ratio: '10:1', style: 'transparent vector asset', focus: 'horizontal line divider', extra: 'Wide and thin ratio. White or solid background to be removed later.' },
    { slot: 'divider_alt', ratio: '10:1', style: 'transparent vector asset', focus: 'alternative horizontal line divider', extra: 'Wide and thin ratio. White or solid background to be removed later.' },
    { slot: 'frame_couple', ratio: '5:6', style: 'transparent vector asset', focus: 'empty frame for couple photo', extra: 'Center must be empty. Border should be highly decorated.' },
    { slot: 'pattern_main', ratio: '1:1', style: 'seamless repeating pattern', focus: 'background texture', extra: 'Must be perfectly seamless.' },
    { slot: 'pattern_alt', ratio: '1:1', style: 'seamless repeating pattern', focus: 'alternative background texture', extra: 'Must be perfectly seamless, subtle opacity.' },
    { slot: 'icon_venue', ratio: '1:1', style: 'flat vector icon', focus: 'wedding venue icon', extra: 'Transparent background style, minimalist.' },
    { slot: 'illustration_iconic', ratio: '16:9', style: 'detailed illustration', focus: 'iconic spot or romantic scenery', extra: 'Horizontal landscape orientation.' },
    { slot: 'banner_top', ratio: '6:1', style: 'flat vector banner', focus: 'top decorative hanging banner', extra: 'Horizontal wide orientation.' },
    { slot: 'footer_scene', ratio: '2:1', style: 'landscape illustration', focus: 'bottom footer closing scene', extra: 'Horizontal wide orientation.' },
  ]

  const generatePrompt = (s: typeof slots[0]) => {
    return `[${s.slot}] ${s.style}, ${brief.culture ? brief.culture + " " : ""}wedding invitation ${s.focus}. \nSetting: ${brief.iconic_landmark || "classic elegant venue"}. Prominent: ${brief.iconic_symbol || "floral arrangements"}. \nOrnamental style: ${brief.ornament_style || "modern minimalist"}. \nColor palette: ${brief.color_primary} as dominant, ${brief.color_accent} as accent. \nMood: ${brief.mood_keywords || "romantic, elegant"}. \nStyle: flat vector illustration, no people, no text, lush details. \n${s.extra}`
  }

  const copyToClipboard = (text: string, slot: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSlot(slot)
    setTimeout(() => setCopiedSlot(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E5E5E5] font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
             <Link href="/admin/themes" className="hover:text-white flex items-center">
               <ChevronLeft className="w-4 h-4 mr-1" /> Back
             </Link>
             <span>/</span>
             <Link href={`/admin/themes/${themeKey}/assets`} className="hover:text-white truncate max-w-[200px]">
               {themeKey}
             </Link>
             <span>/</span>
             <span className="text-white font-medium">Prompt Generator</span>
          </div>
          <h1 className="text-3xl font-semibold text-white">AI Prompt Generator</h1>
          <p className="text-white/50 mt-2">Isi brief tema di bawah ini untuk menghasilkan prompt otomatis. Copy dan paste ke Midjourney atau Recraft.ai.</p>
        </div>

        {/* Brief Form */}
        <div className="bg-surface border border-white/5 rounded-xl p-6 space-y-6">
           <h2 className="text-lg font-medium text-white border-b border-white/10 pb-4">Theme Brief</h2>
           
           <div className="grid grid-cols-2 gap-6">
             <div>
               <label className="block text-xs text-white/50 mb-1 font-mono">culture</label>
               <input 
                 type="text" 
                 value={brief.culture}
                 onChange={e => setBrief({...brief, culture: e.target.value})}
                 className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                 placeholder="e.g. Acehnese, Javanese, Modern"
               />
             </div>
             <div>
               <label className="block text-xs text-white/50 mb-1 font-mono">iconic_landmark</label>
               <input 
                 type="text" 
                 value={brief.iconic_landmark}
                 onChange={e => setBrief({...brief, iconic_landmark: e.target.value})}
                 className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                 placeholder="e.g. Baiturrahman Grand Mosque, Joglo"
               />
             </div>
             <div>
               <label className="block text-xs text-white/50 mb-1 font-mono">iconic_symbol</label>
               <input 
                 type="text" 
                 value={brief.iconic_symbol}
                 onChange={e => setBrief({...brief, iconic_symbol: e.target.value})}
                 className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                 placeholder="e.g. Kupiah Meukeutop, Gunungan"
               />
             </div>
             <div>
               <label className="block text-xs text-white/50 mb-1 font-mono">ornament_style</label>
               <input 
                 type="text" 
                 value={brief.ornament_style}
                 onChange={e => setBrief({...brief, ornament_style: e.target.value})}
                 className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                 placeholder="e.g. Pinto Aceh floral engravings, Batik Kawung"
               />
             </div>
             <div className="col-span-2">
               <label className="block text-xs text-white/50 mb-1 font-mono">mood_keywords</label>
               <input 
                 type="text" 
                 value={brief.mood_keywords}
                 onChange={e => setBrief({...brief, mood_keywords: e.target.value})}
                 className="w-full bg-black/40 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
                 placeholder="e.g. elegant, serene, deep green, gold accents, majestic"
               />
             </div>
           </div>

           <div className="grid grid-cols-4 gap-4">
            {[
              { key: 'color_primary', label: 'Primary' },
              { key: 'color_accent', label: 'Accent' },
              { key: 'color_text', label: 'Text' },
              { key: 'color_cta', label: 'CTA' },
            ].map((col) => (
              <div key={col.key}>
                <label className="block text-[10px] text-white/50 mb-1 font-mono">{col.key}</label>
                <div className="flex bg-black/40 border border-white/10 rounded-md overflow-hidden">
                  <input 
                    type="color" 
                    value={(brief as any)[col.key]}
                    onChange={e => setBrief({...brief, [col.key]: e.target.value})}
                    className="w-10 h-10 border-0 bg-transparent p-1 cursor-pointer shrink-0"
                  />
                  <input 
                    type="text" 
                    value={(brief as any)[col.key]}
                    onChange={e => setBrief({...brief, [col.key]: e.target.value})}
                    className="w-full bg-transparent border-0 text-xs px-2 text-white/80"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Prompts List */}
        <div className="space-y-4">
           <h2 className="text-xl font-semibold text-white mb-6">Generated Prompts (15 Slots)</h2>
           
           {slots.map(s => {
             const promptText = generatePrompt(s)
             const isCopied = copiedSlot === s.slot

             return (
               <div key={s.slot} className="bg-surface-2 border border-white/5 rounded-xl p-4 flex flex-col gap-3 group hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-center">
                     <div>
                        <span className="font-mono text-sm text-emerald-400 font-bold">{s.slot}</span>
                        <span className="text-xs text-white/40 ml-3 bg-black/30 px-2 py-1 rounded">Ratio: {s.ratio}</span>
                     </div>
                     <button 
                       onClick={() => copyToClipboard(promptText, s.slot)}
                       className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                         isCopied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                       }`}
                     >
                       {isCopied ? <><CheckCircle2 className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Prompt</>}
                     </button>
                  </div>
                  <pre className="text-sm text-white/80 whitespace-pre-wrap bg-black/40 p-4 rounded-lg font-mono leading-relaxed border border-white/5">
                    {promptText}
                  </pre>
               </div>
             )
           })}
        </div>

      </div>
    </div>
  )
}
