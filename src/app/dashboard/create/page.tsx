"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Text } from "@/components/ui/typography"
import {
  ChevronRight, ChevronLeft, Save, Sparkles, Image as ImageIcon,
  Plus, Trash2, Lock, ToggleLeft, ToggleRight
} from "lucide-react"

// ─── Steps ───────────────────────────────────────────────────────────────────
const STEPS = [
  "Data Mempelai",
  "Jadwal & Lokasi",
  "Pilih Tema",
  "Konten & Media",
  "Fitur Tambahan",
  "Preview & Publish",
]

// ─── Toggle Section Component ────────────────────────────────────────────────
function ToggleSection({
  enabled, onToggle, label, badge = "Opsional", children
}: {
  enabled: boolean
  onToggle: () => void
  label: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      enabled ? "border-[#D4A91C]/40 shadow-sm" : "border-[#EDE6D6]"
    }`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#FDFCF9] hover:bg-[#FAF8F3] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-[#1E1B18] text-sm">{label}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            enabled
              ? "bg-[#D4A91C]/15 text-[#7D5C0C]"
              : "bg-[#EDE6D6] text-[#9A9390]"
          }`}>{badge}</span>
        </div>
        {enabled
          ? <ToggleRight className="w-5 h-5 text-[#D4A91C]" />
          : <ToggleLeft className="w-5 h-5 text-[#C2BEB8]" />}
      </button>
      {enabled && (
        <div className="px-5 pb-5 pt-1 bg-white flex flex-col gap-4 border-t border-[#EDE6D6]">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Field Label ─────────────────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-[#726C67] mb-1.5">
      {children}{required && <span className="text-[#E05555] ml-1">*</span>}
    </label>
  )
}

// ─── Textarea ────────────────────────────────────────────────────────────────
function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea
      rows={rows}
      className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-3 text-sm text-[#1E1B18] placeholder:text-[#C2BEB8] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all resize-none"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

// ─── Section Divider ─────────────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="h-px flex-1 bg-[#EDE6D6]" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#C2BEB8]">{label}</span>
      <div className="h-px flex-1 bg-[#EDE6D6]" />
    </div>
  )
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function CreateInvitationWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ── Compulsory fields ──
  const [formData, setFormData] = useState({
    // Step 1: couple
    groomName: "",
    groomNickname: "",
    brideName: "",
    brideNickname: "",
    // Step 2: events
    eventType: "akad_resepsi" as "akad" | "resepsi" | "akad_resepsi",
    akadDate: "",
    akadTime: "",
    akadVenueName: "",
    akadVenueAddress: "",
    resepsiDate: "",
    resepsiTime: "",
    resepsiVenueName: "",
    resepsiVenueAddress: "",
    // Step 3: theme
    themeId: "minimalist-white",
    // Step 4: content
    greetingText: "Assalamu'alaikum Wr. Wb.\n\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami.",
  })

  // ── Optional feature toggles ──
  const [opt, setOpt] = useState({
    groomParents:     false,
    brideParents:     false,
    groomPhoto:       false,
    bridePhoto:       false,
    groomIg:          false,
    brideIg:          false,
    mapsUrl:          false,
    dresscode:        false,
    openingQuote:     false,
    loveStory:        false,
    gallery:          false,
    music:            false,
    rsvp:             false,
    guestbook:        false,
    giftBank:         false,
    giftAddress:      false,
    qris:             false,
  })

  const toggleOpt = (key: keyof typeof opt) => setOpt(p => ({ ...p, [key]: !p[key] }))

  // ── Optional field values ──
  const [extra, setExtra] = useState({
    groomFatherName: "", groomMotherName: "",
    brideFatherName: "", brideMotherName: "",
    groomPhotoUrl: "", bridePhotoUrl: "",
    groomIg: "", brideIg: "",
    akadMapsUrl: "", resepsiMapsUrl: "",
    dresscodeColors: "" ,dresscodeNote: "",
    openingQuote: "", openingQuoteSource: "",
    loveStory: [] as { year: string; title: string; desc: string }[],
    musicUrl: "",
    rsvpDeadline: "", rsvpMessage: "", rsvpMaxGuests: "1",
    bankAccounts: [] as { bank: string; number: string; name: string }[],
    giftAddress: "",
    qrisAccount: "",
  })

  const upExtra = (patch: Partial<typeof extra>) => setExtra(p => ({ ...p, ...patch }))

  // ── Love story helpers ──
  const addStoryEvent = () => upExtra({ loveStory: [...extra.loveStory, { year: "", title: "", desc: "" }] })
  const removeStoryEvent = (i: number) => upExtra({ loveStory: extra.loveStory.filter((_, n) => n !== i) })
  const updateStory = (i: number, patch: Partial<{ year: string; title: string; desc: string }>) =>
    upExtra({ loveStory: extra.loveStory.map((e, n) => n === i ? { ...e, ...patch } : e) })

  // ── Bank account helpers ──
  const addBank = () => upExtra({ bankAccounts: [...extra.bankAccounts, { bank: "", number: "", name: "" }] })
  const removeBank = (i: number) => upExtra({ bankAccounts: extra.bankAccounts.filter((_, n) => n !== i) })
  const updateBank = (i: number, patch: Partial<{ bank: string; number: string; name: string }>) =>
    upExtra({ bankAccounts: extra.bankAccounts.map((b, n) => n === i ? { ...b, ...patch } : b) })

  const set = (patch: Partial<typeof formData>) => setFormData(p => ({ ...p, ...patch }))

  const handleNext = () => { if (currentStep < STEPS.length - 1) setCurrentStep(s => s + 1) }
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(s => s - 1) }

  const handlePublish = async () => {
    setIsSubmitting(true)
    try {
      const events = []
      if (formData.eventType === "akad" || formData.eventType === "akad_resepsi") {
        events.push({ type: "akad", date: formData.akadDate, start_time: formData.akadTime, venue_name: formData.akadVenueName, venue_address: formData.akadVenueAddress, maps_url: opt.mapsUrl ? extra.akadMapsUrl : null })
      }
      if (formData.eventType === "resepsi" || formData.eventType === "akad_resepsi") {
        events.push({ type: "resepsi", date: formData.resepsiDate, start_time: formData.resepsiTime, venue_name: formData.resepsiVenueName, venue_address: formData.resepsiVenueAddress, maps_url: opt.mapsUrl ? extra.resepsiMapsUrl : null })
      }

      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groom: {
            full_name: formData.groomName,
            nickname: formData.groomNickname,
            father_name: opt.groomParents ? extra.groomFatherName : null,
            mother_name: opt.groomParents ? extra.groomMotherName : null,
            photo_url: opt.groomPhoto ? extra.groomPhotoUrl : null,
            instagram: opt.groomIg ? extra.groomIg : null,
          },
          bride: {
            full_name: formData.brideName,
            nickname: formData.brideNickname,
            father_name: opt.brideParents ? extra.brideFatherName : null,
            mother_name: opt.brideParents ? extra.brideMotherName : null,
            photo_url: opt.bridePhoto ? extra.bridePhotoUrl : null,
            instagram: opt.brideIg ? extra.brideIg : null,
          },
          events,
          theme_id: formData.themeId,
          opening_text: formData.greetingText,
          opening_quote: opt.openingQuote ? { text: extra.openingQuote, source: extra.openingQuoteSource } : null,
          love_story: opt.loveStory ? extra.loveStory : null,
          dresscode: opt.dresscode ? { colors: extra.dresscodeColors, note: extra.dresscodeNote } : null,
          music_url: opt.music ? extra.musicUrl : null,
          rsvp: opt.rsvp ? { deadline: extra.rsvpDeadline, message: extra.rsvpMessage, max_guests: Number(extra.rsvpMaxGuests) } : null,
          guestbook_enabled: opt.guestbook,
          digital_gift: (opt.giftBank || opt.giftAddress || opt.qris) ? {
            bank_accounts: opt.giftBank ? extra.bankAccounts : [],
            delivery_address: opt.giftAddress ? extra.giftAddress : null,
            qris_account: opt.qris ? extra.qrisAccount : null,
          } : null,
          status: 'published'
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

  // ── Input shorthand ──
  const inp = (label: string, field: keyof typeof formData, placeholder?: string, type = "text", required = false) => (
    <div>
      <Label required={required}>{label}</Label>
      <input
        type={type}
        className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm text-[#1E1B18] placeholder:text-[#C2BEB8] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all"
        placeholder={placeholder}
        value={formData[field] as string}
        onChange={e => set({ [field]: e.target.value } as any)}
      />
    </div>
  )

  const inpExtra = (label: string, field: keyof typeof extra, placeholder?: string, type = "text") => (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm text-[#1E1B18] placeholder:text-[#C2BEB8] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all"
        placeholder={placeholder}
        value={extra[field] as string}
        onChange={e => upExtra({ [field]: e.target.value } as any)}
      />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-24">
      <div className="mb-2">
        <h1 className="font-display text-3xl font-light text-[#1E1B18]">Buat Undangan</h1>
        <p className="text-sm text-[#726C67] mt-1">Lengkapi data berikut untuk membuat undangan digital Anda.</p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {STEPS.map((step, idx) => (
          <button key={idx} type="button" onClick={() => setCurrentStep(idx)}
            className="flex-1 min-w-[80px] group flex flex-col items-start gap-1.5">
            <div className={`h-1 w-full rounded-full transition-all ${
              idx < currentStep ? 'bg-[#D4A91C]' : idx === currentStep ? 'bg-[#1E1B18]' : 'bg-[#EDE6D6]'
            }`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider truncate ${
              idx === currentStep ? 'text-[#1E1B18]' : idx < currentStep ? 'text-[#D4A91C]' : 'text-[#C2BEB8]'
            }`}>{step}</span>
          </button>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-[#EDE6D6] bg-white overflow-hidden shadow-sm">
        <div className="px-6 pt-6 pb-2">
          <h2 className="font-display text-2xl font-light text-[#1E1B18]">{STEPS[currentStep]}</h2>
          <p className="text-xs text-[#9A9390] mt-1">
            {currentStep === 0 && "Data nama pengantin pria dan wanita. Isi semua yang bertanda *."}
            {currentStep === 1 && "Waktu dan tempat akad / resepsi."}
            {currentStep === 2 && "Pilih tampilan undangan."}
            {currentStep === 3 && "Teks sambutan, foto, dan quote pembuka."}
            {currentStep === 4 && "Fitur-fitur opsional — aktifkan hanya yang dibutuhkan."}
            {currentStep === 5 && "Periksa ringkasan sebelum diterbitkan."}
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* ─── STEP 1: Data Mempelai ──────────────────────────────── */}
          {currentStep === 0 && (
            <>
              <SectionDivider label="Pengantin Pria" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inp("Nama Lengkap Pria", "groomName", "Mohammad Andi", "text", true)}
                {inp("Nama Panggilan", "groomNickname", "Andi", "text", true)}
              </div>
              <ToggleSection enabled={opt.groomParents} onToggle={() => toggleOpt('groomParents')} label="Nama Orang Tua Pria">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inpExtra("Nama Ayah", "groomFatherName", "Bpk. Fauzi Ahmad")}
                  {inpExtra("Nama Ibu", "groomMotherName", "Ibu Siti Rohani")}
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.groomPhoto} onToggle={() => toggleOpt('groomPhoto')} label="Foto Pengantin Pria">
                {inpExtra("URL Foto", "groomPhotoUrl", "https://...")}
              </ToggleSection>
              <ToggleSection enabled={opt.groomIg} onToggle={() => toggleOpt('groomIg')} label="Instagram Pengantin Pria">
                {inpExtra("Username Instagram", "groomIg", "@andi.rahman")}
              </ToggleSection>

              <SectionDivider label="Pengantin Wanita" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inp("Nama Lengkap Wanita", "brideName", "Rina Angelina", "text", true)}
                {inp("Nama Panggilan", "brideNickname", "Rina", "text", true)}
              </div>
              <ToggleSection enabled={opt.brideParents} onToggle={() => toggleOpt('brideParents')} label="Nama Orang Tua Wanita">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inpExtra("Nama Ayah", "brideFatherName", "Bpk. Hasan")}
                  {inpExtra("Nama Ibu", "brideMotherName", "Ibu Rahayu")}
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.bridePhoto} onToggle={() => toggleOpt('bridePhoto')} label="Foto Pengantin Wanita">
                {inpExtra("URL Foto", "bridePhotoUrl", "https://...")}
              </ToggleSection>
              <ToggleSection enabled={opt.brideIg} onToggle={() => toggleOpt('brideIg')} label="Instagram Pengantin Wanita">
                {inpExtra("Username Instagram", "brideIg", "@rina.dewi")}
              </ToggleSection>
            </>
          )}

          {/* ─── STEP 2: Jadwal & Lokasi ────────────────────────────── */}
          {currentStep === 1 && (
            <>
              <div>
                <Label required>Jenis Acara</Label>
                <select
                  className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm text-[#1E1B18] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all"
                  value={formData.eventType}
                  onChange={e => set({ eventType: e.target.value as any })}
                >
                  <option value="akad">Akad Nikah Saja</option>
                  <option value="resepsi">Resepsi Saja</option>
                  <option value="akad_resepsi">Akad & Resepsi (2 sesi)</option>
                </select>
              </div>

              {(formData.eventType === "akad" || formData.eventType === "akad_resepsi") && (
                <>
                  <SectionDivider label="Akad Nikah" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inp("Tanggal Akad", "akadDate", "", "date", true)}
                    {inp("Waktu Akad", "akadTime", "", "time", true)}
                  </div>
                  {inp("Nama Gedung / Venue Akad", "akadVenueName", "Masjid Al-Ikhlas", "text", true)}
                  {inp("Alamat Lengkap Akad", "akadVenueAddress", "Jl. Kebon Jeruk No.1, Jakarta", "text", true)}
                </>
              )}

              {(formData.eventType === "resepsi" || formData.eventType === "akad_resepsi") && (
                <>
                  <SectionDivider label="Resepsi" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inp("Tanggal Resepsi", "resepsiDate", "", "date", true)}
                    {inp("Waktu Resepsi", "resepsiTime", "", "time", true)}
                  </div>
                  {inp("Nama Gedung / Venue Resepsi", "resepsiVenueName", "Gedung Sabuga", "text", true)}
                  {inp("Alamat Lengkap Resepsi", "resepsiVenueAddress", "Jl. Tamansari No.73, Bandung", "text", true)}
                </>
              )}

              <ToggleSection enabled={opt.mapsUrl} onToggle={() => toggleOpt('mapsUrl')} label="Tambahkan Link Google Maps">
                <div className="flex flex-col gap-3">
                  {(formData.eventType === "akad" || formData.eventType === "akad_resepsi") &&
                    inpExtra("Google Maps URL (Akad)", "akadMapsUrl", "https://maps.app.goo.gl/...")}
                  {(formData.eventType === "resepsi" || formData.eventType === "akad_resepsi") &&
                    inpExtra("Google Maps URL (Resepsi)", "resepsiMapsUrl", "https://maps.app.goo.gl/...")}
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.dresscode} onToggle={() => toggleOpt('dresscode')} label="Dress Code">
                <div className="flex flex-col gap-3">
                  {inpExtra("Warna Dress Code", "dresscodeColors", "Sage green, cream, champagne")}
                  {inpExtra("Catatan Dress Code", "dresscodeNote", "Mohon tidak memakai baju putih")}
                </div>
              </ToggleSection>
            </>
          )}

          {/* ─── STEP 3: Tema ────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {[
                { id: 'minimalist-white', name: 'Modern Minimalis', cat: 'Modern' },
                { id: 'garden-romance',   name: 'Garden Romance',   cat: 'Modern' },
                { id: 'jawa-klasik',      name: 'Jawa Klasik',      cat: 'Budaya' },
                { id: 'bali-tropis',      name: 'Bali Tropis',      cat: 'Budaya' },
                { id: 'islami',           name: 'Islami Elegan',    cat: 'Islami' },
                { id: 'modern-bold',      name: 'Modern Bold',      cat: 'Modern' },
              ].map(t => (
                <button
                  key={t.id} type="button"
                  onClick={() => set({ themeId: t.id })}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all text-left ${
                    formData.themeId === t.id
                      ? 'border-[#D4A91C] shadow-md'
                      : 'border-[#EDE6D6] hover:border-[#D4A91C]/40'
                  }`}
                >
                  <div className="aspect-[3/4] bg-[#F5F0E8] flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-[#C2BEB8]" />
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-xs font-semibold text-[#1E1B18]">{t.name}</p>
                    <p className="text-[10px] text-[#9A9390]">{t.cat}</p>
                  </div>
                  {formData.themeId === t.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D4A91C] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ─── STEP 4: Konten & Media ─────────────────────────────── */}
          {currentStep === 3 && (
            <>
              <div>
                <Label required>Teks Sambutan</Label>
                <Textarea
                  value={formData.greetingText}
                  onChange={v => set({ greetingText: v })}
                  placeholder="Bismillah… Dengan memohon rahmat Allah SWT…"
                  rows={5}
                />
                <button type="button" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#D4A91C] hover:text-[#B88E14] transition-colors">
                  <Sparkles className="w-3.5 h-3.5" /> Bantu tulis dengan AI
                </button>
              </div>

              <ToggleSection enabled={opt.openingQuote} onToggle={() => toggleOpt('openingQuote')} label="Ayat / Quote Pembuka">
                <div className="flex flex-col gap-3">
                  <Textarea
                    value={extra.openingQuote}
                    onChange={v => upExtra({ openingQuote: v })}
                    placeholder="وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنفُسِكُمْ أَزْوَاجًا…"
                    rows={3}
                  />
                  {inpExtra("Sumber (misal: QS. Ar-Rum: 21)", "openingQuoteSource", "QS. Ar-Rum: 21")}
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.gallery} onToggle={() => toggleOpt('gallery')} label="Galeri Foto">
                <div className="border border-dashed border-[#EDE6D6] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#FDFCF9]">
                  <ImageIcon className="w-8 h-8 text-[#C2BEB8] mb-2" />
                  <p className="text-sm font-medium text-[#4A4540]">Upload Foto Galeri</p>
                  <p className="text-xs text-[#9A9390] mt-1 mb-4">Maksimal 12 foto. Format JPG, PNG, WEBP.</p>
                  <button type="button" className="px-4 py-2 rounded-full border border-[#EDE6D6] text-xs font-semibold text-[#4A4540] hover:border-[#D4A91C] transition-colors">Pilih File</button>
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.music} onToggle={() => toggleOpt('music')} label="Musik Latar">
                {inpExtra("URL Audio (MP3)", "musicUrl", "https://drive.google.com/...")}
                <p className="text-xs text-[#9A9390]">Gunakan link Google Drive, Dropbox, atau direct MP3 URL.</p>
              </ToggleSection>

              <ToggleSection enabled={opt.loveStory} onToggle={() => toggleOpt('loveStory')} label="Timeline Kisah Cinta">
                <div className="flex flex-col gap-3">
                  {extra.loveStory.map((ev, i) => (
                    <div key={i} className="rounded-xl border border-[#EDE6D6] bg-[#FDFCF9] p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#D4A91C] uppercase tracking-wider">Peristiwa {i + 1}</span>
                        <button type="button" onClick={() => removeStoryEvent(i)} className="text-[#C2BEB8] hover:text-[#E05555] transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Tahun</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" placeholder="2023" value={ev.year} onChange={e => updateStory(i, { year: e.target.value })} /></div>
                        <div><Label>Judul</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" placeholder="Pertama Bertemu" value={ev.title} onChange={e => updateStory(i, { title: e.target.value })} /></div>
                      </div>
                      <div><Label>Cerita Singkat</Label><Textarea value={ev.desc} onChange={v => updateStory(i, { desc: v })} placeholder="Kami pertama kali bertemu di…" rows={2} /></div>
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

          {/* ─── STEP 5: Fitur Tambahan ─────────────────────────────── */}
          {currentStep === 4 && (
            <>
              <SectionDivider label="RSVP & Buku Tamu" />

              <ToggleSection enabled={opt.rsvp} onToggle={() => toggleOpt('rsvp')} label="Aktifkan RSVP">
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label>Batas RSVP</Label>
                      <input type="date" className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A91C] transition-all"
                        value={extra.rsvpDeadline} onChange={e => upExtra({ rsvpDeadline: e.target.value })} />
                    </div>
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
                  <div>
                    <Label>Pesan RSVP</Label>
                    <Textarea value={extra.rsvpMessage} onChange={v => upExtra({ rsvpMessage: v })} placeholder="Kami sangat mengharap kehadiran Anda…" rows={2} />
                  </div>
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.guestbook} onToggle={() => toggleOpt('guestbook')} label="Buku Tamu & Ucapan">
                <p className="text-xs text-[#9A9390]">Tamu dapat menulis ucapan dan doa langsung di halaman undangan.</p>
              </ToggleSection>

              <SectionDivider label="Amplop Digital" />

              <ToggleSection enabled={opt.giftBank} onToggle={() => toggleOpt('giftBank')} label="Transfer Bank / E-Wallet">
                <div className="flex flex-col gap-3">
                  {extra.bankAccounts.map((b, i) => (
                    <div key={i} className="rounded-xl border border-[#EDE6D6] bg-[#FDFCF9] p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#D4A91C] uppercase tracking-wider">Rekening {i + 1}</span>
                        <button type="button" onClick={() => removeBank(i)} className="text-[#C2BEB8] hover:text-[#E05555] transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div><Label>Bank / E-Wallet</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" placeholder="BCA / GoPay" value={b.bank} onChange={e => updateBank(i, { bank: e.target.value })} /></div>
                        <div><Label>Nomor Rekening</Label><input className="w-full rounded-xl border border-[#EDE6D6] bg-white px-3 py-2 text-sm focus:outline-none focus:border-[#D4A91C] transition-all" placeholder="12345678" value={b.number} onChange={e => updateBank(i, { number: e.target.value })} /></div>
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
                <div className="flex flex-col gap-3">
                  {inpExtra("Nomor / ID QRIS", "qrisAccount", "QRIS-1234 / Dana 08xxxxxxxx")}
                  <div className="border border-dashed border-[#EDE6D6] rounded-xl p-6 flex flex-col items-center justify-center text-center bg-[#FDFCF9]">
                    <p className="text-sm font-medium text-[#4A4540] mb-1">Upload Gambar QRIS</p>
                    <p className="text-xs text-[#9A9390] mb-3">Format PNG atau JPG.</p>
                    <button type="button" className="px-4 py-2 rounded-full border border-[#EDE6D6] text-xs font-semibold text-[#4A4540] hover:border-[#D4A91C] transition-colors">Pilih File</button>
                  </div>
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.giftAddress} onToggle={() => toggleOpt('giftAddress')} label="Alamat Pengiriman Hadiah Fisik">
                <Textarea value={extra.giftAddress} onChange={v => upExtra({ giftAddress: v })} placeholder="Jl. Melati No. 12, RT 03 RW 05, Kelurahan…" rows={3} />
              </ToggleSection>
            </>
          )}

          {/* ─── STEP 6: Preview & Publish ──────────────────────────── */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl bg-[#FDFCF9] border border-[#EDE6D6] overflow-hidden">
                <div className="px-5 py-3 border-b border-[#EDE6D6]">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#9A9390]">Ringkasan</p>
                </div>
                <div className="px-5 py-4 grid grid-cols-2 gap-y-3 text-sm">
                  {[
                    ['Pengantin', `${formData.groomNickname || '—'} & ${formData.brideNickname || '—'}`],
                    ['Jenis Acara', formData.eventType.replace('_', ' & ')],
                    ['Tema', formData.themeId.replace(/-/g, ' ')],
                    ['RSVP', opt.rsvp ? 'Aktif' : 'Nonaktif'],
                    ['Buku Tamu', opt.guestbook ? 'Aktif' : 'Nonaktif'],
                    ['Amplop Digital', [opt.giftBank && 'Bank', opt.qris && 'QRIS', opt.giftAddress && 'Alamat'].filter(Boolean).join(', ') || 'Nonaktif'],
                    ['Kisah Cinta', opt.loveStory ? `${extra.loveStory.length} peristiwa` : 'Nonaktif'],
                    ['Galeri', opt.gallery ? 'Aktif' : 'Nonaktif'],
                    ['Musik', opt.music ? 'Aktif' : 'Nonaktif'],
                  ].map(([label, val]) => (
                    <>
                      <span className="text-[#9A9390]">{label}</span>
                      <span className="font-medium text-[#1E1B18] capitalize">{val}</span>
                    </>
                  ))}
                </div>
              </div>
              <p className="text-xs text-center text-[#9A9390]">Anda masih bisa mengubah semua data ini setelah diterbitkan.</p>
            </div>
          )}

        </div>

        {/* Footer Nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EDE6D6] bg-[#FDFCF9]">
          <button type="button" onClick={handlePrev} disabled={currentStep === 0 || isSubmitting}
            className="flex items-center gap-1.5 text-sm font-medium text-[#726C67] hover:text-[#1E1B18] disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button type="button" onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#1E1B18] text-[#FDFCF9] text-sm font-medium hover:bg-[#302C28] transition-colors">
              Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handlePublish} disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#D4A91C] text-[#1E1B18] text-sm font-semibold hover:bg-[#B88E14] hover:text-white transition-colors disabled:opacity-50">
              {isSubmitting ? 'Menerbitkan…' : <><Save className="w-4 h-4" /> Terbitkan Undangan</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
