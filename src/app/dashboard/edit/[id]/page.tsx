"use client"

import { useState, useEffect, use, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { VenueAutocomplete } from "@/components/ui/VenueAutocomplete"

// ─── Luxe Primitives ─────────────────────────────────────────────────────────

function ConfigSection({ label, children, isOpen, onToggle, optional, enabled }: {
    label: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; optional?: boolean; enabled?: boolean;
}) {
    return (
        <div className={`border-b border-outline-variant/10 overflow-hidden transition-all ${isOpen ? 'bg-white' : ''}`}>
            <button 
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors group text-left"
            >
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Configuration</span>
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                        {label}
                        {optional && (
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${enabled ? 'bg-tertiary-container/30 border-tertiary text-tertiary' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                {enabled ? 'Enabled' : 'Optional'}
                            </span>
                        )}
                    </h4>
                </div>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    keyboard_arrow_down
                </span>
            </button>
            <div className={`px-6 pb-8 space-y-6 overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    )
}

function Field({ label, required }: { label: string; required?: boolean }) {
    return (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">
            {label} {required && <span className="text-tertiary">*</span>}
        </label>
    )
}

function LuxeInput({ label, value, onChange, placeholder, type = "text", required }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean
}) {
    return (
        <div className="group">
            <Field label={label} required={required} />
            <input 
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl px-5 py-4 text-sm text-primary placeholder:text-slate-300 focus:outline-none focus:border-tertiary focus:ring-4 focus:ring-tertiary/10 transition-all font-['Inter']"
            />
        </div>
    )
}

function LuxeTextarea({ label, value, onChange, placeholder, rows = 4 }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
    return (
        <div>
            <Field label={label} />
            <textarea 
                rows={rows}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl px-5 py-4 text-sm text-primary placeholder:text-slate-300 focus:outline-none focus:border-tertiary focus:ring-4 focus:ring-tertiary/10 transition-all font-['Inter'] resize-none"
            />
        </div>
    )
}

const TABS = [
  { id: 'mempelai', label: 'Identity', icon: 'person_edit' },
  { id: 'jadwal', label: 'Timeline', icon: 'schedule' },
  { id: 'konten', label: 'Editorial', icon: 'auto_stories' },
  { id: 'fitur', label: 'Concierge', icon: 'concierge' },
]

export default function EditInvitationWizard({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState(0)
  const [openSections, setOpenSections] = useState<string[]>(['primary_info'])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDirty, setIsDirty] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [slug, setSlug] = useState("")

  const toggleSection = (s: string) => {
      setOpenSections(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  // ── State Management (Preserved from original) ──
  const [f, setF] = useState({
    groomFullName: "", groomNickname: "",
    brideFullName: "", brideNickname: "",
    eventType: "akad_resepsi" as "akad" | "resepsi" | "akad_resepsi",
    akadDate: "", akadTime: "", akadVenue: "", akadAddress: "",
    receptionDate: "", receptionTime: "", receptionVenue: "", receptionAddress: "",
    greetingText: "",
  })
  const upF = (p: Partial<typeof f>) => { setF(prev => ({ ...prev, ...p })); setIsDirty(true); }

  const [opt, setOpt] = useState({
    groomParents: false, brideParents: false,
    groomPhoto: false, bridePhoto: false,
    groomIg: false, brideIg: false,
    mapsUrl: false, dresscode: false,
    openingQuote: false, loveStory: false,
    gallery: false, music: false,
    rsvp: false, guestbook: false,
    giftBank: false, giftAddress: false, qris: false,
  })
  const toggleOpt = (k: keyof typeof opt) => { setOpt(p => ({ ...p, [k]: !p[k] })); setIsDirty(true); }

  const [x, setX] = useState({
    groomFather: "", groomMother: "",
    brideFather: "", brideMother: "",
    groomPhotoUrl: "", bridePhotoUrl: "",
    groomIg: "", brideIg: "",
    akadMapsUrl: "", receptionMapsUrl: "",
    dresscodeColors: "", dresscodeNote: "",
    quoteText: "", quoteSource: "",
    loveStory: [] as { year: string; title: string; desc: string }[],
    musicUrl: "",
    rsvpDeadline: "", rsvpMessage: "", rsvpMaxGuests: "1",
    bankName: "", bankAccount: "", bankAccountName: "",
    giftAddress: "", qrisAccount: "",
  })
  const upX = (p: Partial<typeof x>) => { setX(prev => ({ ...prev, ...p })); setIsDirty(true); }

  const addStory = () => { upX({ loveStory: [...x.loveStory, { year: "", title: "", desc: "" }] }); setIsDirty(true); }
  const removeStory = (i: number) => { upX({ loveStory: x.loveStory.filter((_, n) => n !== i) }); setIsDirty(true); }
  const updateStory = (i: number, p: Partial<typeof x.loveStory[0]>) =>
    { upX({ loveStory: x.loveStory.map((e, n) => n === i ? { ...e, ...p } : e) }); setIsDirty(true); }

  // ── Load & Save Logic (Preserved from original) ──
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/invitations/${id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error?.message || 'Gagal memuat')
        const d = json.data || {}
        upF({
          groomFullName:    d.groom_full_name || "",
          groomNickname:    d.groom_nickname || "",
          brideFullName:    d.bride_full_name || "",
          brideNickname:    d.bride_nickname || "",
          akadDate:         d.akad_datetime ? new Date(d.akad_datetime).toISOString().split('T')[0] : "",
          akadTime:         d.akad_datetime ? new Date(d.akad_datetime).toTimeString().slice(0, 5) : "",
          akadVenue:        d.akad_location_name || "",
          akadAddress:      d.akad_location_address || "",
          receptionDate:    d.resepsi_datetime ? new Date(d.resepsi_datetime).toISOString().split('T')[0] : "",
          receptionTime:    d.resepsi_datetime ? new Date(d.resepsi_datetime).toTimeString().slice(0, 5) : "",
          receptionVenue:   d.resepsi_location_name || "",
          receptionAddress: d.resepsi_location_address || "",
          greetingText:     d.quote_text || "",
          eventType: d.akad_datetime && d.resepsi_datetime ? "akad_resepsi" : d.akad_datetime ? "akad" : "resepsi",
        })
        setOpt(p => ({
          ...p,
          groomParents: !!(d.groom_father_name),
          brideParents: !!(d.bride_father_name),
          giftBank:     !!(d.gift_bank_account),
          giftAddress:  !!(d.gift_shipping_address),
          gallery:  !!(d.show_prewed_gallery),
          mapsUrl:      !!(d.akad_maps_url || d.resepsi_maps_url),
        }))
        upX({
          groomFather:    d.groom_father_name || "",
          groomMother:    d.groom_mother_name || "",
          brideFather:    d.bride_father_name || "",
          brideMother:    d.bride_mother_name || "",
          bankName:       d.gift_bank_name || "",
          bankAccount:    d.gift_bank_account || "",
          bankAccountName: d.gift_bank_account_name || "",
          giftAddress:    d.gift_shipping_address || "",
          akadMapsUrl:    d.akad_maps_url || "",
          receptionMapsUrl: d.resepsi_maps_url || "",
        })
        setSlug(d.slug || "")
        setIsDirty(false)
      } catch (err: any) {
        console.error(err)
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id, router])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groom_full_name: f.groomFullName,
          groom_name:      f.groomNickname,
          bride_full_name: f.brideFullName,
          bride_name:      f.brideNickname,
          groom_father:    opt.groomParents ? x.groomFather : "",
          groom_mother:    opt.groomParents ? x.groomMother : "",
          bride_father:    opt.brideParents ? x.brideFather : "",
          bride_mother:    opt.brideParents ? x.brideMother : "",
          akad_date:        (f.eventType === "akad" || f.eventType === "akad_resepsi") ? f.akadDate : null,
          akad_venue:       (f.eventType === "akad" || f.eventType === "akad_resepsi") ? f.akadVenue : null,
          akad_address:     (f.eventType === "akad" || f.eventType === "akad_resepsi") ? f.akadAddress : null,
          reception_date:   (f.eventType === "resepsi" || f.eventType === "akad_resepsi") ? f.receptionDate : null,
          reception_venue:  (f.eventType === "resepsi" || f.eventType === "akad_resepsi") ? f.receptionVenue : null,
          reception_address:(f.eventType === "resepsi" || f.eventType === "akad_resepsi") ? f.receptionAddress : null,
          greeting_text:    f.greetingText,
          gift_bank_name:         opt.giftBank ? x.bankName : "",
          gift_bank_account:      opt.giftBank ? x.bankAccount : "",
          gift_bank_account_name: opt.giftBank ? x.bankAccountName : "",
          gift_shipping_address:  opt.giftAddress ? x.giftAddress : "",
          show_gift_section:    opt.giftBank || opt.giftAddress || opt.qris,
          show_couple_photos:   opt.groomPhoto || opt.bridePhoto,
          show_prewed_gallery:  opt.gallery,
          akad_maps_url: (f.eventType === "akad" || f.eventType === "akad_resepsi") ? x.akadMapsUrl : null,
          resepsi_maps_url: (f.eventType === "resepsi" || f.eventType === "akad_resepsi") ? x.receptionMapsUrl : null,
        })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error?.message || 'Gagal menyimpan undangan')
      setIsDirty(false)
      setShowSaveSuccess(true)
      setTimeout(() => setShowSaveSuccess(false), 3000)
    } catch (error: any) {
      console.error(error)
      alert(error.message)
    } finally {
        setIsSubmitting(false)
    }
  }

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-tertiary" />
    </div>
  )

  return (
    <div className="fixed inset-0 top-20 bg-surface-container-low flex overflow-hidden">
        
        {/* Left Control Sidebar: Editorial Style */}
        <div className="w-[450px] bg-white border-r border-outline-variant/10 flex flex-col shadow-2xl z-20">
            <div className="p-8 border-b border-outline-variant/5">
                 <h2 className="text-3xl font-black text-primary tracking-tighter italic font-light">The Atelier</h2>
                 <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-1">Invitation Designer Pro</p>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
                {/* Secondary Tab Switcher */}
                <div className="flex border-b border-outline-variant/5 bg-surface-container-lowest sticky top-0 z-10">
                    {TABS.map((tab, idx) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(idx)}
                            className={`flex-1 py-6 flex flex-col items-center gap-2 transition-all ${
                                activeTab === idx ? 'text-primary' : 'text-slate-300 hover:text-slate-500'
                            }`}
                        >
                            <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                            <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>
                            {activeTab === idx && <div className="absolute bottom-0 w-8 h-1 bg-tertiary rounded-t-full"></div>}
                        </button>
                    ))}
                </div>

                <div className="p-0">
                    {activeTab === 0 && (
                        <>
                            <ConfigSection label="Primary Couple Data" isOpen={openSections.includes('primary_info')} onToggle={() => toggleSection('primary_info')}>
                                <div className="grid grid-cols-2 gap-4">
                                     <LuxeInput label="Groom Nickname" value={f.groomNickname} onChange={v => upF({ groomNickname: v })} required />
                                     <LuxeInput label="Bride Nickname" value={f.brideNickname} onChange={v => upF({ brideNickname: v })} required />
                                </div>
                                <LuxeInput label="Full Name Groom" value={f.groomFullName} onChange={v => upF({ groomFullName: v })} />
                                <LuxeInput label="Full Name Bride" value={f.brideFullName} onChange={v => upF({ brideFullName: v })} />
                            </ConfigSection>

                            <ConfigSection label="Family Lineage" optional enabled={opt.groomParents || opt.brideParents} isOpen={openSections.includes('parents')} onToggle={() => toggleSection('parents')}>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl">
                                        <input type="checkbox" checked={opt.groomParents} onChange={() => toggleOpt('groomParents')} className="w-5 h-5 accent-tertiary" />
                                        <span className="text-xs font-bold text-primary">Include Groom's Parents</span>
                                    </div>
                                    {opt.groomParents && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                             <LuxeInput label="Father" value={x.groomFather} onChange={v => upX({ groomFather: v })} />
                                             <LuxeInput label="Mother" value={x.groomMother} onChange={v => upX({ groomMother: v })} />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl mt-4">
                                        <input type="checkbox" checked={opt.brideParents} onChange={() => toggleOpt('brideParents')} className="w-5 h-5 accent-tertiary" />
                                        <span className="text-xs font-bold text-primary">Include Bride's Parents</span>
                                    </div>
                                    {opt.brideParents && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                             <LuxeInput label="Father" value={x.brideFather} onChange={v => upX({ brideFather: v })} />
                                             <LuxeInput label="Mother" value={x.brideMother} onChange={v => upX({ brideMother: v })} />
                                        </div>
                                    )}
                                </div>
                            </ConfigSection>
                        </>
                    )}

                    {activeTab === 1 && (
                        <div className="p-0">
                            <ConfigSection label="Event Structure" isOpen={true} onToggle={() => {}}>
                                <Field label="Event Type" />
                                <div className="grid grid-cols-3 gap-2">
                                    {(['akad', 'resepsi', 'akad_resepsi'] as const).map((type) => (
                                        <button 
                                            key={type}
                                            onClick={() => upF({ eventType: type })}
                                            className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                f.eventType === type ? 'bg-primary text-white border-primary shadow-lg' : 'border-outline-variant/20 text-slate-400 hover:border-primary/40'
                                            }`}
                                        >
                                            {type.replace('_', ' & ')}
                                        </button>
                                    ))}
                                </div>
                            </ConfigSection>

                            {(f.eventType === 'akad' || f.eventType === 'akad_resepsi') && (
                                <ConfigSection label="Akad Nikah Ceremony" isOpen={openSections.includes('akad')} onToggle={() => toggleSection('akad')}>
                                     <div className="grid grid-cols-2 gap-4">
                                         <LuxeInput type="date" label="Date" value={f.akadDate} onChange={v => upF({ akadDate: v })} />
                                         <LuxeInput type="time" label="Time" value={f.akadTime} onChange={v => upF({ akadTime: v })} />
                                     </div>
                                     <VenueAutocomplete 
                                        label="Venue Name"
                                        value={f.akadVenue}
                                        onSelect={(name, addr, maps) => {
                                            upF({ akadVenue: name, akadAddress: addr })
                                            if (maps) upX({ akadMapsUrl: maps })
                                        }}
                                     />
                                     <LuxeTextarea label="Full Address" value={f.akadAddress} onChange={v => upF({ akadAddress: v })} rows={2} />
                                </ConfigSection>
                            )}

                            {(f.eventType === 'resepsi' || f.eventType === 'akad_resepsi') && (
                                <ConfigSection label="Grand Reception" isOpen={openSections.includes('resepsi')} onToggle={() => toggleSection('resepsi')}>
                                     <div className="grid grid-cols-2 gap-4">
                                         <LuxeInput type="date" label="Date" value={f.receptionDate} onChange={v => upF({ receptionDate: v })} />
                                         <LuxeInput type="time" label="Time" value={f.receptionTime} onChange={v => upF({ receptionTime: v })} />
                                     </div>
                                     <VenueAutocomplete 
                                        label="Venue Name"
                                        value={f.receptionVenue}
                                        onSelect={(name, addr, maps) => {
                                            upF({ receptionVenue: name, receptionAddress: addr })
                                            if (maps) upX({ receptionMapsUrl: maps })
                                        }}
                                     />
                                     <LuxeTextarea label="Full Address" value={f.receptionAddress} onChange={v => upF({ receptionAddress: v })} rows={2} />
                                </ConfigSection>
                            )}
                        </div>
                    )}

                    {activeTab === 2 && (
                        <>
                            <ConfigSection label="Greeting Text" isOpen={openSections.includes('greeting')} onToggle={() => toggleSection('greeting')}>
                                <LuxeTextarea label="Opening Message" value={f.greetingText} onChange={v => upF({ greetingText: v })} rows={6} />
                            </ConfigSection>
                            <ConfigSection label="Visual Gallery" optional enabled={opt.gallery} isOpen={openSections.includes('gallery')} onToggle={() => toggleSection('gallery')}>
                                <div className="border-2 border-dashed border-outline-variant/20 rounded-[32px] p-12 flex flex-col items-center text-center bg-surface-container-low hover:bg-white transition-colors group cursor-pointer">
                                    <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-tertiary transition-colors mb-4">image</span>
                                    <p className="text-xs font-bold text-primary">Upload Editorial Photos</p>
                                    <p className="text-[10px] text-slate-400 mt-2">Recommended: 2000x3000px</p>
                                </div>
                            </ConfigSection>
                        </>
                    )}

                    {activeTab === 3 && (
                        <>
                            <ConfigSection label="Digital Envelopes" optional enabled={opt.giftBank} isOpen={openSections.includes('gift')} onToggle={() => toggleSection('gift')}>
                                <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl mb-6">
                                    <input type="checkbox" checked={opt.giftBank} onChange={() => toggleOpt('giftBank')} className="w-5 h-5 accent-tertiary" />
                                    <span className="text-xs font-bold text-primary">Enable Bank Transfer</span>
                                </div>
                                {opt.giftBank && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                        <LuxeInput label="Bank Name" value={x.bankName} onChange={v => upX({ bankName: v })} />
                                        <LuxeInput label="Account Number" value={x.bankAccount} onChange={v => upX({ bankAccount: v })} />
                                        <LuxeInput label="Account Holder" value={x.bankAccountName} onChange={v => upX({ bankAccountName: v })} />
                                    </div>
                                )}
                            </ConfigSection>
                        </>
                    )}
                </div>
            </div>

            {/* Floating Footer Status */}
            <div className="p-8 bg-white/80 backdrop-blur-xl border-t border-outline-variant/10 flex items-center justify-between">
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                >
                    Discard Changes
                </button>
                <button 
                    onClick={handleSave} 
                    disabled={isSubmitting || !isDirty}
                    className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                        isDirty 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95' 
                        : 'bg-surface-container-high text-slate-300'
                    }`}
                >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span className="material-symbols-outlined text-lg">auto_awesome</span>}
                    {showSaveSuccess ? 'Manifested ✓' : 'Save Concept'}
                </button>
            </div>
        </div>

        {/* Center Canvas: The "Stage" */}
        <div className="flex-1 relative overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] flex items-center justify-center p-20">
            {/* Infinite Control HUD */}
            <div className="absolute top-10 left-10 flex gap-4">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-3 flex items-center gap-6 shadow-xl border border-outline-variant/10">
                     <div className="flex flex-col">
                         <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Current View</span>
                         <span className="text-xs font-bold text-primary">Mobile Editorial</span>
                     </div>
                     <div className="h-8 w-px bg-outline-variant/10"></div>
                     <div className="flex gap-4">
                         <button className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors">undo</button>
                         <button className="material-symbols-outlined text-slate-300 hover:text-primary transition-colors">redo</button>
                     </div>
                </div>
            </div>

            <div className="absolute top-10 right-10">
                 <a 
                    href={`/invite/${slug}?preview=true`} 
                    target="_blank"
                    className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl hover:translate-y-[-2px] transition-all"
                >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    Full Story Preview
                 </a>
            </div>

            {/* The Device Frame */}
            <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full scale-150 group-hover:opacity-100 opacity-50 transition-opacity"></div>
                <div className="w-[380px] h-[780px] bg-[#1E1B18] rounded-[60px] p-4 shadow-[0_0_100px_rgba(0,0,0,0.4)] border-[12px] border-[#2a2a2a] relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-[#2a2a2a] rounded-b-3xl z-50"></div>
                    
                    <iframe 
                        src={`/invite/${slug}?preview=true`}
                        className="w-full h-full rounded-[40px] bg-white border-none"
                    />
                </div>
                
                {/* Visual Metadata Annotations */}
                <div className="absolute -right-64 top-40 w-56 animate-in slide-in-from-right-10 duration-1000">
                    <div className="p-6 bg-white/40 backdrop-blur-md border-l-4 border-tertiary rounded-r-2xl">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Live Feedback</span>
                        <p className="text-xs font-medium text-primary mt-2 leading-relaxed italic">"Typography shifts and spacing are automatically adjusted to match your data."</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}
