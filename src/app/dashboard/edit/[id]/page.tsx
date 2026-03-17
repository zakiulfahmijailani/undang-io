"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight, ChevronLeft, Save, Sparkles,
  Image as ImageIcon, Plus, Trash2, Loader2,
  ToggleLeft, ToggleRight
} from "lucide-react"

// ─── Reusable primitives (same as create page) ────────────────────────────────
function ToggleSection({
  enabled, onToggle, label, badge = "Opsional", children
}: {
  enabled: boolean; onToggle: () => void; label: string; badge?: string; children: React.ReactNode
}) {
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      enabled ? "border-[#D4A91C]/40 shadow-sm" : "border-[#EDE6D6]"
    }`}>
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#FDFCF9] hover:bg-[#FAF8F3] transition-colors">
        <div className="flex items-center gap-3">
          <span className="font-medium text-[#1E1B18] text-sm">{label}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            enabled ? "bg-[#D4A91C]/15 text-[#7D5C0C]" : "bg-[#EDE6D6] text-[#9A9390]"
          }`}>{badge}</span>
        </div>
        {enabled ? <ToggleRight className="w-5 h-5 text-[#D4A91C]" /> : <ToggleLeft className="w-5 h-5 text-[#C2BEB8]" />}
      </button>
      {enabled && (
        <div className="px-5 pb-5 pt-1 bg-white flex flex-col gap-4 border-t border-[#EDE6D6]">
          {children}
        </div>
      )}
    </div>
  )
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-[#726C67] mb-1.5">
      {children}{required && <span className="text-[#E05555] ml-1">*</span>}
    </label>
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea rows={rows}
      className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-3 text-sm text-[#1E1B18] placeholder:text-[#C2BEB8] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all resize-none"
      value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-[#EDE6D6]" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#C2BEB8]">{label}</span>
      <div className="h-px flex-1 bg-[#EDE6D6]" />
    </div>
  )
}

const STEPS = ["Data Mempelai","Jadwal & Lokasi","Konten & Media","Fitur Tambahan","Simpan"]

export default function EditInvitationWizard({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    groomName: "", groomNickname: "",
    brideName: "", brideNickname: "",
    eventType: "akad_resepsi" as "akad" | "resepsi" | "akad_resepsi",
    akadDate: "", akadTime: "", akadVenueName: "", akadVenueAddress: "",
    resepsiDate: "", resepsiTime: "", resepsiVenueName: "", resepsiVenueAddress: "",
    themeId: "minimalist-white",
    greetingText: "",
  })

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

  const [extra, setExtra] = useState({
    groomFatherName: "", groomMotherName: "",
    brideFatherName: "", brideMotherName: "",
    groomPhotoUrl: "", bridePhotoUrl: "",
    groomIg: "", brideIg: "",
    akadMapsUrl: "", resepsiMapsUrl: "",
    dresscodeColors: "", dresscodeNote: "",
    openingQuote: "", openingQuoteSource: "",
    loveStory: [] as { year: string; title: string; desc: string }[],
    musicUrl: "",
    rsvpDeadline: "", rsvpMessage: "", rsvpMaxGuests: "1",
    bankAccounts: [] as { bank: string; number: string; name: string }[],
    giftAddress: "", qrisAccount: "",
  })

  const toggleOpt = (key: keyof typeof opt) => setOpt(p => ({ ...p, [key]: !p[key] }))
  const upExtra = (patch: Partial<typeof extra>) => setExtra(p => ({ ...p, ...patch }))
  const set = (patch: Partial<typeof formData>) => setFormData(p => ({ ...p, ...patch }))

  const addStoryEvent = () => upExtra({ loveStory: [...extra.loveStory, { year: "", title: "", desc: "" }] })
  const removeStoryEvent = (i: number) => upExtra({ loveStory: extra.loveStory.filter((_, n) => n !== i) })
  const updateStory = (i: number, patch: Partial<{ year: string; title: string; desc: string }>) =>
    upExtra({ loveStory: extra.loveStory.map((e, n) => n === i ? { ...e, ...patch } : e) })

  const addBank = () => upExtra({ bankAccounts: [...extra.bankAccounts, { bank: "", number: "", name: "" }] })
  const removeBank = (i: number) => upExtra({ bankAccounts: extra.bankAccounts.filter((_, n) => n !== i) })
  const updateBank = (i: number, patch: Partial<{ bank: string; number: string; name: string }>) =>
    upExtra({ bankAccounts: extra.bankAccounts.map((b, n) => n === i ? { ...b, ...patch } : b) })

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/invitations/${id}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json.error?.message || 'Gagal memuat')
        const c = json.data?.content || {}

        setFormData({
          groomName:         c.groom_name || "",
          groomNickname:     c.groom_nickname || "",
          brideName:         c.bride_name || "",
          brideNickname:     c.bride_nickname || "",
          eventType:         c.event_type || "akad_resepsi",
          akadDate:          c.akad_date ? new Date(c.akad_date).toISOString().split('T')[0] : "",
          akadTime:          c.akad_time || "",
          akadVenueName:     c.akad_venue_name || "",
          akadVenueAddress:  c.akad_venue_address || "",
          resepsiDate:       c.resepsi_date ? new Date(c.resepsi_date).toISOString().split('T')[0] : "",
          resepsiTime:       c.resepsi_time || "",
          resepsiVenueName:  c.resepsi_venue_name || "",
          resepsiVenueAddress: c.resepsi_venue_address || "",
          themeId:           json.data?.themes?.slug || "minimalist-white",
          greetingText:      c.greeting_text || "",
        })

        // hydrate optional fields from saved content
        const hasParents = !!(c.groom_father_name || c.bride_father_name)
        setOpt(p => ({
          ...p,
          groomParents:  !!(c.groom_father_name),
          brideParents:  !!(c.bride_father_name),
          groomPhoto:    !!(c.groom_photo_url),
          bridePhoto:    !!(c.bride_photo_url),
          groomIg:       !!(c.groom_instagram),
          brideIg:       !!(c.bride_instagram),
          mapsUrl:       !!(c.akad_maps_url || c.resepsi_maps_url),
          dresscode:     !!(c.dresscode_colors),
          openingQuote:  !!(c.opening_quote),
          loveStory:     !!(c.love_story?.length),
          music:         !!(c.music_url),
          rsvp:          !!(c.rsvp_deadline),
          guestbook:     !!(c.guestbook_enabled),
          giftBank:      !!(c.bank_accounts?.length),
          qris:          !!(c.qris_account),
          giftAddress:   !!(c.gift_delivery_address),
        }))

        upExtra({
          groomFatherName:  c.groom_father_name || "",
          groomMotherName:  c.groom_mother_name || "",
          brideFatherName:  c.bride_father_name || "",
          brideMotherName:  c.bride_mother_name || "",
          groomPhotoUrl:    c.groom_photo_url || "",
          bridePhotoUrl:    c.bride_photo_url || "",
          groomIg:          c.groom_instagram || "",
          brideIg:          c.bride_instagram || "",
          akadMapsUrl:      c.akad_maps_url || "",
          resepsiMapsUrl:   c.resepsi_maps_url || "",
          dresscodeColors:  c.dresscode_colors || "",
          dresscodeNote:    c.dresscode_note || "",
          openingQuote:     c.opening_quote || "",
          openingQuoteSource: c.opening_quote_source || "",
          loveStory:        c.love_story || [],
          musicUrl:         c.music_url || "",
          rsvpDeadline:     c.rsvp_deadline ? new Date(c.rsvp_deadline).toISOString().split('T')[0] : "",
          rsvpMessage:      c.rsvp_message || "",
          rsvpMaxGuests:    String(c.rsvp_max_guests || 1),
          bankAccounts:     c.bank_accounts || [],
          giftAddress:      c.gift_delivery_address || "",
          qrisAccount:      c.qris_account || "",
        })
      } catch (err: any) {
        console.error(err)
        alert(err.message)
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id, router])

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const events = []
      if (formData.eventType === "akad" || formData.eventType === "akad_resepsi") {
        events.push({ type: "akad", date: formData.akadDate, start_time: formData.akadTime, venue_name: formData.akadVenueName, venue_address: formData.akadVenueAddress, maps_url: opt.mapsUrl ? extra.akadMapsUrl : null })
      }
      if (formData.eventType === "resepsi" || formData.eventType === "akad_resepsi") {
        events.push({ type: "resepsi", date: formData.resepsiDate, start_time: formData.resepsiTime, venue_name: formData.resepsiVenueName, venue_address: formData.resepsiVenueAddress, maps_url: opt.mapsUrl ? extra.resepsiMapsUrl : null })
      }

      const res = await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            groom_name: formData.groomName, groom_nickname: formData.groomNickname,
            bride_name: formData.brideName, bride_nickname: formData.brideNickname,
            groom_father_name: opt.groomParents ? extra.groomFatherName : null,
            groom_mother_name: opt.groomParents ? extra.groomMotherName : null,
            bride_father_name: opt.brideParents ? extra.brideFatherName : null,
            bride_mother_name: opt.brideParents ? extra.brideMotherName : null,
            groom_photo_url: opt.groomPhoto ? extra.groomPhotoUrl : null,
            bride_photo_url: opt.bridePhoto ? extra.bridePhotoUrl : null,
            groom_instagram: opt.groomIg ? extra.groomIg : null,
            bride_instagram: opt.brideIg ? extra.brideIg : null,
            event_type: formData.eventType,
            events,
            dresscode: opt.dresscode ? { colors: extra.dresscodeColors, note: extra.dresscodeNote } : null,
            greeting_text: formData.greetingText,
            opening_quote: opt.openingQuote ? extra.openingQuote : null,
            opening_quote_source: opt.openingQuote ? extra.openingQuoteSource : null,
            love_story: opt.loveStory ? extra.loveStory : null,
            music_url: opt.music ? extra.musicUrl : null,
            rsvp_deadline: opt.rsvp ? extra.rsvpDeadline : null,
            rsvp_message: opt.rsvp ? extra.rsvpMessage : null,
            rsvp_max_guests: opt.rsvp ? Number(extra.rsvpMaxGuests) : null,
            guestbook_enabled: opt.guestbook,
            bank_accounts: opt.giftBank ? extra.bankAccounts : [],
            qris_account: opt.qris ? extra.qrisAccount : null,
            gift_delivery_address: opt.giftAddress ? extra.giftAddress : null,
          }
        })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error?.message || 'Gagal menyimpan undangan')
      router.push("/dashboard")
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Terjadi kesalahan sistem')
      setIsSubmitting(false)
    }
  }

  const inpField = (label: string, val: string, onChange: (v: string) => void, placeholder?: string, type = "text", required = false) => (
    <div>
      <Label required={required}>{label}</Label>
      <input type={type} className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm text-[#1E1B18] placeholder:text-[#C2BEB8] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all"
        placeholder={placeholder} value={val} onChange={e => onChange(e.target.value)} />
    </div>
  )

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Loader2 className="w-6 h-6 animate-spin text-[#D4A91C]" />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-24">
      <div className="mb-2">
        <h1 className="font-display text-3xl font-light text-[#1E1B18]">Edit Undangan</h1>
        <p className="text-sm text-[#726C67] mt-1">Perbarui data undangan pernikahan Anda.</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {STEPS.map((step, idx) => (
          <button key={idx} type="button" onClick={() => setCurrentStep(idx)}
            className="flex-1 min-w-[80px] flex flex-col items-start gap-1.5">
            <div className={`h-1 w-full rounded-full transition-all ${
              idx < currentStep ? 'bg-[#D4A91C]' : idx === currentStep ? 'bg-[#1E1B18]' : 'bg-[#EDE6D6]'
            }`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider truncate ${
              idx === currentStep ? 'text-[#1E1B18]' : idx < currentStep ? 'text-[#D4A91C]' : 'text-[#C2BEB8]'
            }`}>{step}</span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#EDE6D6] bg-white overflow-hidden shadow-sm">
        <div className="px-6 pt-6 pb-2">
          <h2 className="font-display text-2xl font-light text-[#1E1B18]">{STEPS[currentStep]}</h2>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Step 1: Mempelai */}
          {currentStep === 0 && (
            <>
              <SectionDivider label="Pengantin Pria" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inpField("Nama Lengkap Pria", formData.groomName, v => set({ groomName: v }), "Mohammad Andi", "text", true)}
                {inpField("Nama Panggilan", formData.groomNickname, v => set({ groomNickname: v }), "Andi", "text", true)}
              </div>
              <ToggleSection enabled={opt.groomParents} onToggle={() => toggleOpt('groomParents')} label="Nama Orang Tua Pria">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inpField("Nama Ayah", extra.groomFatherName, v => upExtra({ groomFatherName: v }), "Bpk. Fauzi")}
                  {inpField("Nama Ibu", extra.groomMotherName, v => upExtra({ groomMotherName: v }), "Ibu Siti")}
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.groomPhoto} onToggle={() => toggleOpt('groomPhoto')} label="Foto Pengantin Pria">
                {inpField("URL Foto", extra.groomPhotoUrl, v => upExtra({ groomPhotoUrl: v }), "https://…")}
              </ToggleSection>
              <ToggleSection enabled={opt.groomIg} onToggle={() => toggleOpt('groomIg')} label="Instagram Pengantin Pria">
                {inpField("Username", extra.groomIg, v => upExtra({ groomIg: v }), "@andi.rahman")}
              </ToggleSection>

              <SectionDivider label="Pengantin Wanita" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inpField("Nama Lengkap Wanita", formData.brideName, v => set({ brideName: v }), "Rina Angelina", "text", true)}
                {inpField("Nama Panggilan", formData.brideNickname, v => set({ brideNickname: v }), "Rina", "text", true)}
              </div>
              <ToggleSection enabled={opt.brideParents} onToggle={() => toggleOpt('brideParents')} label="Nama Orang Tua Wanita">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inpField("Nama Ayah", extra.brideFatherName, v => upExtra({ brideFatherName: v }), "Bpk. Hasan")}
                  {inpField("Nama Ibu", extra.brideMotherName, v => upExtra({ brideMotherName: v }), "Ibu Rahayu")}
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.bridePhoto} onToggle={() => toggleOpt('bridePhoto')} label="Foto Pengantin Wanita">
                {inpField("URL Foto", extra.bridePhotoUrl, v => upExtra({ bridePhotoUrl: v }), "https://…")}
              </ToggleSection>
              <ToggleSection enabled={opt.brideIg} onToggle={() => toggleOpt('brideIg')} label="Instagram Pengantin Wanita">
                {inpField("Username", extra.brideIg, v => upExtra({ brideIg: v }), "@rina.dewi")}
              </ToggleSection>
            </>
          )}

          {/* Step 2: Jadwal */}
          {currentStep === 1 && (
            <>
              <div>
                <Label required>Jenis Acara</Label>
                <select className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm text-[#1E1B18] focus:outline-none focus:border-[#D4A91C] transition-all"
                  value={formData.eventType} onChange={e => set({ eventType: e.target.value as any })}>
                  <option value="akad">Akad Nikah Saja</option>
                  <option value="resepsi">Resepsi Saja</option>
                  <option value="akad_resepsi">Akad & Resepsi</option>
                </select>
              </div>
              {(formData.eventType === "akad" || formData.eventType === "akad_resepsi") && (
                <>
                  <SectionDivider label="Akad Nikah" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inpField("Tanggal", formData.akadDate, v => set({ akadDate: v }), "", "date", true)}
                    {inpField("Waktu", formData.akadTime, v => set({ akadTime: v }), "", "time", true)}
                  </div>
                  {inpField("Nama Gedung / Venue", formData.akadVenueName, v => set({ akadVenueName: v }), "Masjid Al-Ikhlas", "text", true)}
                  {inpField("Alamat Lengkap", formData.akadVenueAddress, v => set({ akadVenueAddress: v }), "Jl. Kebon Jeruk…", "text", true)}
                </>
              )}
              {(formData.eventType === "resepsi" || formData.eventType === "akad_resepsi") && (
                <>
                  <SectionDivider label="Resepsi" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inpField("Tanggal", formData.resepsiDate, v => set({ resepsiDate: v }), "", "date", true)}
                    {inpField("Waktu", formData.resepsiTime, v => set({ resepsiTime: v }), "", "time", true)}
                  </div>
                  {inpField("Nama Gedung / Venue", formData.resepsiVenueName, v => set({ resepsiVenueName: v }), "Gedung Sabuga", "text", true)}
                  {inpField("Alamat Lengkap", formData.resepsiVenueAddress, v => set({ resepsiVenueAddress: v }), "Jl. Tamansari No.73…", "text", true)}
                </>
              )}
              <ToggleSection enabled={opt.mapsUrl} onToggle={() => toggleOpt('mapsUrl')} label="Link Google Maps">
                {(formData.eventType === "akad" || formData.eventType === "akad_resepsi") &&
                  inpField("Maps URL Akad", extra.akadMapsUrl, v => upExtra({ akadMapsUrl: v }), "https://maps.app.goo.gl/…")}
                {(formData.eventType === "resepsi" || formData.eventType === "akad_resepsi") &&
                  inpField("Maps URL Resepsi", extra.resepsiMapsUrl, v => upExtra({ resepsiMapsUrl: v }), "https://maps.app.goo.gl/…")}
              </ToggleSection>
              <ToggleSection enabled={opt.dresscode} onToggle={() => toggleOpt('dresscode')} label="Dress Code">
                {inpField("Warna", extra.dresscodeColors, v => upExtra({ dresscodeColors: v }), "Sage green, cream")}
                {inpField("Catatan", extra.dresscodeNote, v => upExtra({ dresscodeNote: v }), "Mohon tidak memakai baju putih")}
              </ToggleSection>
            </>
          )}

          {/* Step 3: Konten */}
          {currentStep === 2 && (
            <>
              <div>
                <Label required>Teks Sambutan</Label>
                <Textarea value={formData.greetingText} onChange={v => set({ greetingText: v })} rows={5} />
                <button type="button" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#D4A91C] hover:text-[#B88E14] transition-colors">
                  <Sparkles className="w-3.5 h-3.5" /> Bantu tulis dengan AI
                </button>
              </div>
              <ToggleSection enabled={opt.openingQuote} onToggle={() => toggleOpt('openingQuote')} label="Ayat / Quote Pembuka">
                <Textarea value={extra.openingQuote} onChange={v => upExtra({ openingQuote: v })} rows={3} />
                {inpField("Sumber", extra.openingQuoteSource, v => upExtra({ openingQuoteSource: v }), "QS. Ar-Rum: 21")}
              </ToggleSection>
              <ToggleSection enabled={opt.gallery} onToggle={() => toggleOpt('gallery')} label="Galeri Foto">
                <div className="border border-dashed border-[#EDE6D6] rounded-xl p-8 flex flex-col items-center text-center bg-[#FDFCF9]">
                  <ImageIcon className="w-8 h-8 text-[#C2BEB8] mb-2" />
                  <p className="text-sm font-medium text-[#4A4540]">Upload Foto Galeri</p>
                  <p className="text-xs text-[#9A9390] mt-1 mb-4">Maks. 12 foto. JPG, PNG, WEBP.</p>
                  <button type="button" className="px-4 py-2 rounded-full border border-[#EDE6D6] text-xs font-semibold text-[#4A4540] hover:border-[#D4A91C] transition-colors">Pilih File</button>
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.music} onToggle={() => toggleOpt('music')} label="Musik Latar">
                {inpField("URL Audio (MP3)", extra.musicUrl, v => upExtra({ musicUrl: v }), "https://drive.google.com/…")}
              </ToggleSection>
              <ToggleSection enabled={opt.loveStory} onToggle={() => toggleOpt('loveStory')} label="Timeline Kisah Cinta">
                <div className="flex flex-col gap-3">
                  {extra.loveStory.map((ev, i) => (
                    <div key={i} className="rounded-xl border border-[#EDE6D6] bg-[#FDFCF9] p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#D4A91C]">Peristiwa {i + 1}</span>
                        <button type="button" onClick={() => removeStoryEvent(i)} className="text-[#C2BEB8] hover:text-[#E05555]"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Tahun</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" value={ev.year} onChange={e => updateStory(i, { year: e.target.value })} /></div>
                        <div><Label>Judul</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" value={ev.title} onChange={e => updateStory(i, { title: e.target.value })} /></div>
                      </div>
                      <div><Label>Cerita</Label><Textarea value={ev.desc} onChange={v => updateStory(i, { desc: v })} rows={2} /></div>
                    </div>
                  ))}
                  <button type="button" onClick={addStoryEvent}
                    className="flex items-center gap-2 justify-center py-3 rounded-xl border border-dashed border-[#D4A91C]/40 text-sm text-[#D4A91C] font-medium hover:bg-[#D4A91C]/5 transition-colors">
                    <Plus className="w-4 h-4" /> Tambah Peristiwa
                  </button>
                </div>
              </ToggleSection>
            </>
          )}

          {/* Step 4: Fitur Tambahan */}
          {currentStep === 3 && (
            <>
              <SectionDivider label="RSVP & Buku Tamu" />
              <ToggleSection enabled={opt.rsvp} onToggle={() => toggleOpt('rsvp')} label="Aktifkan RSVP">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inpField("Batas RSVP", extra.rsvpDeadline, v => upExtra({ rsvpDeadline: v }), "", "date")}
                  <div>
                    <Label>Maks. Tamu per Link</Label>
                    <select className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A91C] transition-all"
                      value={extra.rsvpMaxGuests} onChange={e => upExtra({ rsvpMaxGuests: e.target.value })}>
                      <option value="1">1 orang</option>
                      <option value="2">2 orang</option>
                      <option value="5">5 orang</option>
                      <option value="10">Tak terbatas</option>
                    </select>
                  </div>
                </div>
                <Textarea value={extra.rsvpMessage} onChange={v => upExtra({ rsvpMessage: v })} placeholder="Pesan untuk tamu…" rows={2} />
              </ToggleSection>
              <ToggleSection enabled={opt.guestbook} onToggle={() => toggleOpt('guestbook')} label="Buku Tamu & Ucapan">
                <p className="text-xs text-[#9A9390]">Tamu dapat menulis ucapan langsung di halaman undangan.</p>
              </ToggleSection>
              <SectionDivider label="Amplop Digital" />
              <ToggleSection enabled={opt.giftBank} onToggle={() => toggleOpt('giftBank')} label="Transfer Bank / E-Wallet">
                <div className="flex flex-col gap-3">
                  {extra.bankAccounts.map((b, i) => (
                    <div key={i} className="rounded-xl border border-[#EDE6D6] bg-[#FDFCF9] p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#D4A91C]">Rekening {i + 1}</span>
                        <button type="button" onClick={() => removeBank(i)} className="text-[#C2BEB8] hover:text-[#E05555]"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div><Label>Bank</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" placeholder="BCA" value={b.bank} onChange={e => updateBank(i, { bank: e.target.value })} /></div>
                        <div><Label>Nomor</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" placeholder="12345678" value={b.number} onChange={e => updateBank(i, { number: e.target.value })} /></div>
                        <div><Label>Atas Nama</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" placeholder="Rina Angelina" value={b.name} onChange={e => updateBank(i, { name: e.target.value })} /></div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addBank}
                    className="flex items-center gap-2 justify-center py-3 rounded-xl border border-dashed border-[#D4A91C]/40 text-sm text-[#D4A91C] font-medium hover:bg-[#D4A91C]/5 transition-colors">
                    <Plus className="w-4 h-4" /> Tambah Rekening
                  </button>
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.qris} onToggle={() => toggleOpt('qris')} label="QRIS">
                {inpField("Nomor / ID QRIS", extra.qrisAccount, v => upExtra({ qrisAccount: v }), "QRIS-1234")}
                <div className="border border-dashed border-[#EDE6D6] rounded-xl p-6 flex flex-col items-center text-center bg-[#FDFCF9]">
                  <p className="text-sm font-medium text-[#4A4540] mb-1">Upload Gambar QRIS</p>
                  <button type="button" className="px-4 py-2 rounded-full border border-[#EDE6D6] text-xs font-semibold text-[#4A4540] hover:border-[#D4A91C] transition-colors mt-2">Pilih File</button>
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.giftAddress} onToggle={() => toggleOpt('giftAddress')} label="Alamat Pengiriman Hadiah Fisik">
                <Textarea value={extra.giftAddress} onChange={v => upExtra({ giftAddress: v })} placeholder="Jl. Melati No. 12, RT 03…" rows={3} />
              </ToggleSection>
            </>
          )}

          {/* Step 5: Simpan */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-[#FDFCF9] border border-[#EDE6D6] overflow-hidden">
                <div className="px-5 py-3 border-b border-[#EDE6D6]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#9A9390]">Ringkasan Perubahan</p>
                </div>
                <div className="px-5 py-4 grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ['Pengantin', `${formData.groomNickname || '—'} & ${formData.brideNickname || '—'}`],
                    ['Jenis Acara', formData.eventType.replace('_', ' & ')],
                    ['RSVP', opt.rsvp ? 'Aktif' : 'Nonaktif'],
                    ['Buku Tamu', opt.guestbook ? 'Aktif' : 'Nonaktif'],
                    ['Kisah Cinta', opt.loveStory ? `${extra.loveStory.length} peristiwa` : 'Nonaktif'],
                    ['Amplop Digital', [opt.giftBank && 'Bank', opt.qris && 'QRIS', opt.giftAddress && 'Alamat'].filter(Boolean).join(', ') || 'Nonaktif'],
                  ].map(([label, val]) => (
                    <>
                      <span className="text-[#9A9390]">{label}</span>
                      <span className="font-medium text-[#1E1B18] capitalize">{val}</span>
                    </>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EDE6D6] bg-[#FDFCF9]">
          <button type="button" onClick={() => { if (currentStep > 0) setCurrentStep(s => s - 1) }}
            disabled={currentStep === 0 || isSubmitting}
            className="flex items-center gap-1.5 text-sm font-medium text-[#726C67] hover:text-[#1E1B18] disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button type="button" onClick={() => setCurrentStep(s => s + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#1E1B18] text-[#FDFCF9] text-sm font-medium hover:bg-[#302C28] transition-colors">
              Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSave} disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#D4A91C] text-[#1E1B18] text-sm font-semibold hover:bg-[#B88E14] hover:text-white transition-colors disabled:opacity-50">
              {isSubmitting ? 'Menyimpan…' : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
