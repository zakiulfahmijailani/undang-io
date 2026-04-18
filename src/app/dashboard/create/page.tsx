"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight, ChevronLeft, Save, Sparkles,
  Image as ImageIcon, Plus, Trash2, ToggleLeft, ToggleRight
} from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

const STEPS = [
  "Data Mempelai",
  "Jadwal & Lokasi",
  "Pilih Tema",
  "Konten & Media",
  "Fitur Tambahan",
  "Preview & Publish",
]

type ThemeOption = {
  id: string
  name: string
  cat: string
  thumbnailUrl: string | null
}

const FALLBACK_THEMES: ThemeOption[] = [
  { id: "minimalist-white", name: "Modern Minimalis", cat: "Modern", thumbnailUrl: null },
  { id: "garden-romance", name: "Garden Romance", cat: "Modern", thumbnailUrl: null },
  { id: "jawa-klasik", name: "Jawa Klasik", cat: "Budaya", thumbnailUrl: null },
  { id: "bali-tropis", name: "Bali Tropis", cat: "Budaya", thumbnailUrl: null },
  { id: "islami", name: "Islami Elegan", cat: "Islami", thumbnailUrl: null },
  { id: "modern-bold", name: "Modern Bold", cat: "Modern", thumbnailUrl: null },
]

function normalizeThemeCategory(category?: string | null) {
  if (!category) return "Tema"
  return category
    .split("_")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function ToggleSection({ enabled, onToggle, label, children }: {
  enabled: boolean; onToggle: () => void; label: string; children: React.ReactNode
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
          }`}>Opsional</span>
        </div>
        {enabled ? <ToggleRight className="w-5 h-5 text-[#D4A91C]" /> : <ToggleLeft className="w-5 h-5 text-[#C2BEB8]" />}
      </button>
      {enabled && (
        <div className="px-5 pb-5 pt-1 bg-white flex flex-col gap-4 border-t border-[#EDE6D6]">{children}</div>
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

function TInput({ label, value, onChange, placeholder, type = "text", required }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <input type={type}
        className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm text-[#1E1B18] placeholder:text-[#C2BEB8] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all"
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function TTextarea({ label, value, onChange, placeholder, rows = 4 }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <textarea rows={rows}
        className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-3 text-sm text-[#1E1B18] placeholder:text-[#C2BEB8] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all resize-none"
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
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

export default function CreateInvitationWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [themeOptions, setThemeOptions] = useState<ThemeOption[]>(FALLBACK_THEMES)
  const [isLoadingThemes, setIsLoadingThemes] = useState(true)
  const [themesError, setThemesError] = useState<string | null>(null)

  const [f, setF] = useState({
    groomFullName: "",
    groomNickname: "",
    brideFullName: "",
    brideNickname: "",
    eventType: "akad_resepsi" as "akad" | "resepsi" | "akad_resepsi",
    akadDate: "", akadTime: "", akadVenue: "", akadAddress: "",
    receptionDate: "", receptionTime: "", receptionVenue: "", receptionAddress: "",
    themeId: FALLBACK_THEMES[0]?.id ?? "",
    greetingText: "Assalamu'alaikum Wr. Wb.\n\nDengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami.",
  })
  const upF = (p: Partial<typeof f>) => setF(prev => ({ ...prev, ...p }))

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
  const toggleOpt = (k: keyof typeof opt) => setOpt(p => ({ ...p, [k]: !p[k] }))

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
    giftAddress: "",
    qrisAccount: "",
  })
  const upX = (p: Partial<typeof x>) => setX(prev => ({ ...prev, ...p }))

  const addStory = () => upX({ loveStory: [...x.loveStory, { year: "", title: "", desc: "" }] })
  const removeStory = (i: number) => upX({ loveStory: x.loveStory.filter((_, n) => n !== i) })
  const updateStory = (i: number, p: Partial<typeof x.loveStory[0]>) =>
    upX({ loveStory: x.loveStory.map((e, n) => n === i ? { ...e, ...p } : e) })

  useEffect(() => {
    let isMounted = true

    async function loadThemes() {
      try {
        setIsLoadingThemes(true)
        setThemesError(null)

        const supabase = createBrowserSupabaseClient()
        const { data, error } = await supabase
          .from("themes")
          .select("slug, name, cultural_category, thumbnail_url, is_active, is_published")
          .eq("is_active", true)
          .order("name", { ascending: true })

        if (error) throw error

        const nextThemes = (data ?? [])
          .filter((theme) => theme?.slug && theme?.name)
          .map((theme) => ({
            id: theme.slug,
            name: theme.name,
            cat: normalizeThemeCategory(theme.cultural_category),
            thumbnailUrl: theme.thumbnail_url ?? null,
          }))

        if (!isMounted) return

        if (nextThemes.length > 0) {
          setThemeOptions(nextThemes)
        } else {
          setThemeOptions(FALLBACK_THEMES)
          setThemesError("Belum ada tema aktif yang tersedia. Menampilkan daftar default sementara.")
        }
      } catch (error) {
        console.error("Failed to load themes for invitation wizard:", error)
        if (!isMounted) return

        setThemeOptions(FALLBACK_THEMES)
        setThemesError("Gagal memuat tema terbaru. Menampilkan daftar default sementara.")
      } finally {
        if (isMounted) {
          setIsLoadingThemes(false)
        }
      }
    }

    loadThemes()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (themeOptions.length === 0) return

    setF((prev) => {
      const hasSelectedTheme = themeOptions.some((theme) => theme.id === prev.themeId)
      if (hasSelectedTheme) return prev

      return {
        ...prev,
        themeId: themeOptions[0].id,
      }
    })
  }, [themeOptions])

  const selectedThemeName = useMemo(() => {
    return themeOptions.find((theme) => theme.id === f.themeId)?.name ?? f.themeId.replace(/-/g, " ")
  }, [f.themeId, themeOptions])

  const handlePublish = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groom_name: f.groomNickname || f.groomFullName,
          bride_name: f.brideNickname || f.brideFullName,
          theme_id: f.themeId,
          details: {
            groom_full_name: f.groomFullName,
            groom_nickname:  f.groomNickname,
            groom_father:    opt.groomParents ? x.groomFather : undefined,
            groom_mother:    opt.groomParents ? x.groomMother : undefined,
            bride_full_name: f.brideFullName,
            bride_nickname:  f.brideNickname,
            bride_father:    opt.brideParents ? x.brideFather : undefined,
            bride_mother:    opt.brideParents ? x.brideMother : undefined,
            akad_date:        (f.eventType === "akad" || f.eventType === "akad_resepsi") ? f.akadDate : undefined,
            akad_time:        (f.eventType === "akad" || f.eventType === "akad_resepsi") ? f.akadTime : undefined,
            akad_venue:       (f.eventType === "akad" || f.eventType === "akad_resepsi") ? f.akadVenue : undefined,
            akad_address:     (f.eventType === "akad" || f.eventType === "akad_resepsi") ? f.akadAddress : undefined,
            reception_date:    (f.eventType === "resepsi" || f.eventType === "akad_resepsi") ? f.receptionDate : undefined,
            reception_time:    (f.eventType === "resepsi" || f.eventType === "akad_resepsi") ? f.receptionTime : undefined,
            reception_venue:   (f.eventType === "resepsi" || f.eventType === "akad_resepsi") ? f.receptionVenue : undefined,
            reception_address: (f.eventType === "resepsi" || f.eventType === "akad_resepsi") ? f.receptionAddress : undefined,
            quote_text:   opt.openingQuote ? x.quoteText : f.greetingText,
            quote_source: opt.openingQuote ? x.quoteSource : undefined,
          }
        })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error?.message || 'Gagal menyimpan undangan')

      const { id } = result.data
      await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          greeting_text:        f.greetingText,
          gift_bank_name:       opt.giftBank ? x.bankName : undefined,
          gift_bank_account:    opt.giftBank ? x.bankAccount : undefined,
          gift_bank_account_name: opt.giftBank ? x.bankAccountName : undefined,
          gift_shipping_address:  opt.giftAddress ? x.giftAddress : undefined,
          show_gift_section:    opt.giftBank || opt.giftAddress || opt.qris,
          show_couple_photos:   opt.groomPhoto || opt.bridePhoto,
          show_prewed_gallery:  opt.gallery,
        })
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Terjadi kesalahan sistem')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6 pb-24">
      <div className="mb-2">
        <h1 className="font-display text-3xl font-light text-[#1E1B18]">Buat Undangan</h1>
        <p className="text-sm text-[#726C67] mt-1">Lengkapi data berikut untuk membuat undangan digital Anda.</p>
      </div>

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
          <p className="text-xs text-[#9A9390] mt-1">
            {currentStep === 0 && "Nama pengantin pria dan wanita. Isi semua yang bertanda *."}
            {currentStep === 1 && "Waktu dan tempat akad / resepsi."}
            {currentStep === 2 && "Pilih tampilan undangan."}
            {currentStep === 3 && "Teks sambutan, foto, dan konten opsional."}
            {currentStep === 4 && "Fitur tambahan — aktifkan hanya yang dibutuhkan."}
            {currentStep === 5 && "Periksa ringkasan sebelum diterbitkan."}
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {currentStep === 0 && (
            <>
              <SectionDivider label="Pengantin Pria" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TInput label="Nama Lengkap Pria" required value={f.groomFullName} onChange={v => upF({ groomFullName: v })} placeholder="Mohammad Andi" />
                <TInput label="Nama Panggilan" required value={f.groomNickname} onChange={v => upF({ groomNickname: v })} placeholder="Andi" />
              </div>
              <ToggleSection enabled={opt.groomParents} onToggle={() => toggleOpt('groomParents')} label="Nama Orang Tua Pria">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TInput label="Nama Ayah" value={x.groomFather} onChange={v => upX({ groomFather: v })} placeholder="Bpk. Fauzi Ahmad" />
                  <TInput label="Nama Ibu" value={x.groomMother} onChange={v => upX({ groomMother: v })} placeholder="Ibu Siti Rohani" />
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.groomPhoto} onToggle={() => toggleOpt('groomPhoto')} label="Foto Pengantin Pria">
                <TInput label="URL Foto" value={x.groomPhotoUrl} onChange={v => upX({ groomPhotoUrl: v })} placeholder="https://..." />
              </ToggleSection>
              <ToggleSection enabled={opt.groomIg} onToggle={() => toggleOpt('groomIg')} label="Instagram Pengantin Pria">
                <TInput label="Username" value={x.groomIg} onChange={v => upX({ groomIg: v })} placeholder="@andi.rahman" />
              </ToggleSection>

              <SectionDivider label="Pengantin Wanita" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TInput label="Nama Lengkap Wanita" required value={f.brideFullName} onChange={v => upF({ brideFullName: v })} placeholder="Rina Angelina" />
                <TInput label="Nama Panggilan" required value={f.brideNickname} onChange={v => upF({ brideNickname: v })} placeholder="Rina" />
              </div>
              <ToggleSection enabled={opt.brideParents} onToggle={() => toggleOpt('brideParents')} label="Nama Orang Tua Wanita">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TInput label="Nama Ayah" value={x.brideFather} onChange={v => upX({ brideFather: v })} placeholder="Bpk. Hasan" />
                  <TInput label="Nama Ibu" value={x.brideMother} onChange={v => upX({ brideMother: v })} placeholder="Ibu Rahayu" />
                </div>
              </ToggleSection>
              <ToggleSection enabled={opt.bridePhoto} onToggle={() => toggleOpt('bridePhoto')} label="Foto Pengantin Wanita">
                <TInput label="URL Foto" value={x.bridePhotoUrl} onChange={v => upX({ bridePhotoUrl: v })} placeholder="https://..." />
              </ToggleSection>
              <ToggleSection enabled={opt.brideIg} onToggle={() => toggleOpt('brideIg')} label="Instagram Pengantin Wanita">
                <TInput label="Username" value={x.brideIg} onChange={v => upX({ brideIg: v })} placeholder="@rina.dewi" />
              </ToggleSection>
            </>
          )}

          {currentStep === 1 && (
            <>
              <div>
                <Label required>Jenis Acara</Label>
                <select className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm text-[#1E1B18] focus:outline-none focus:border-[#D4A91C] focus:ring-2 focus:ring-[#D4A91C]/20 transition-all"
                  value={f.eventType} onChange={e => upF({ eventType: e.target.value as any })}>
                  <option value="akad">Akad Nikah Saja</option>
                  <option value="resepsi">Resepsi Saja</option>
                  <option value="akad_resepsi">Akad & Resepsi (2 sesi)</option>
                </select>
              </div>

              {(f.eventType === "akad" || f.eventType === "akad_resepsi") && (
                <>
                  <SectionDivider label="Akad Nikah" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TInput label="Tanggal" required type="date" value={f.akadDate} onChange={v => upF({ akadDate: v })} />
                    <TInput label="Waktu" required type="time" value={f.akadTime} onChange={v => upF({ akadTime: v })} />
                  </div>
                  <TInput label="Nama Gedung / Venue" required value={f.akadVenue} onChange={v => upF({ akadVenue: v })} placeholder="Masjid Al-Ikhlas" />
                  <TInput label="Alamat Lengkap" required value={f.akadAddress} onChange={v => upF({ akadAddress: v })} placeholder="Jl. Kebon Jeruk No.1, Jakarta" />
                </>
              )}

              {(f.eventType === "resepsi" || f.eventType === "akad_resepsi") && (
                <>
                  <SectionDivider label="Resepsi" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TInput label="Tanggal" required type="date" value={f.receptionDate} onChange={v => upF({ receptionDate: v })} />
                    <TInput label="Waktu" required type="time" value={f.receptionTime} onChange={v => upF({ receptionTime: v })} />
                  </div>
                  <TInput label="Nama Gedung / Venue" required value={f.receptionVenue} onChange={v => upF({ receptionVenue: v })} placeholder="Gedung Sabuga" />
                  <TInput label="Alamat Lengkap" required value={f.receptionAddress} onChange={v => upF({ receptionAddress: v })} placeholder="Jl. Tamansari No.73, Bandung" />
                </>
              )}

              <ToggleSection enabled={opt.mapsUrl} onToggle={() => toggleOpt('mapsUrl')} label="Tambahkan Link Google Maps">
                <div className="flex flex-col gap-3">
                  {(f.eventType === "akad" || f.eventType === "akad_resepsi") &&
                    <TInput label="Maps URL Akad" value={x.akadMapsUrl} onChange={v => upX({ akadMapsUrl: v })} placeholder="https://maps.app.goo.gl/..." />}
                  {(f.eventType === "resepsi" || f.eventType === "akad_resepsi") &&
                    <TInput label="Maps URL Resepsi" value={x.receptionMapsUrl} onChange={v => upX({ receptionMapsUrl: v })} placeholder="https://maps.app.goo.gl/..." />}
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.dresscode} onToggle={() => toggleOpt('dresscode')} label="Dress Code">
                <TInput label="Warna" value={x.dresscodeColors} onChange={v => upX({ dresscodeColors: v })} placeholder="Sage green, cream" />
                <TInput label="Catatan" value={x.dresscodeNote} onChange={v => upX({ dresscodeNote: v })} placeholder="Mohon tidak memakai baju putih" />
              </ToggleSection>
            </>
          )}

          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              {isLoadingThemes && (
                <p className="text-xs text-[#9A9390]">Memuat daftar tema terbaru…</p>
              )}

              {themesError && (
                <div className="rounded-xl border border-[#F2D6A2] bg-[#FFF9ED] px-4 py-3 text-xs text-[#7D5C0C]">
                  {themesError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {themeOptions.map((t) => (
                  <button key={t.id} type="button" onClick={() => upF({ themeId: t.id })}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all text-left ${
                      f.themeId === t.id ? 'border-[#D4A91C] shadow-md' : 'border-[#EDE6D6] hover:border-[#D4A91C]/40'
                    }`}>
                    <div className="aspect-[3/4] bg-[#F5F0E8] overflow-hidden flex items-center justify-center">
                      {t.thumbnailUrl ? (
                        <img
                          src={t.thumbnailUrl}
                          alt={t.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-10 h-10 text-[#C2BEB8]" />
                      )}
                    </div>
                    <div className="p-3 bg-white">
                      <p className="text-xs font-semibold text-[#1E1B18]">{t.name}</p>
                      <p className="text-[10px] text-[#9A9390]">{t.cat}</p>
                    </div>
                    {f.themeId === t.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#D4A91C] flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <>
              <TTextarea label="Teks Sambutan" value={f.greetingText} onChange={v => upF({ greetingText: v })} rows={5} />
              <button type="button" className="-mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#D4A91C] hover:text-[#B88E14] transition-colors">
                <Sparkles className="w-3.5 h-3.5" /> Bantu tulis dengan AI
              </button>

              <ToggleSection enabled={opt.openingQuote} onToggle={() => toggleOpt('openingQuote')} label="Ayat / Quote Pembuka">
                <TTextarea value={x.quoteText} onChange={v => upX({ quoteText: v })} placeholder="\u0648\u064e\u0645\u0650\u0646\u0652 \u0622\u064a\u064e\u0627\u062a\u0650\u0647\u0650 \u0623\u064e\u0646\u0652 \u062e\u064e\u0644\u064e\u0642\u064e \u0644\u064e\u0643\u064f\u0645\u0652..." rows={3} />
                <TInput label="Sumber" value={x.quoteSource} onChange={v => upX({ quoteSource: v })} placeholder="QS. Ar-Rum: 21" />
              </ToggleSection>

              <ToggleSection enabled={opt.gallery} onToggle={() => toggleOpt('gallery')} label="Galeri Foto">
                <div className="border border-dashed border-[#EDE6D6] rounded-xl p-8 flex flex-col items-center text-center bg-[#FDFCF9]">
                  <ImageIcon className="w-8 h-8 text-[#C2BEB8] mb-2" />
                  <p className="text-sm font-medium text-[#4A4540]">Upload Foto Galeri</p>
                  <p className="text-xs text-[#9A9390] mt-1 mb-4">Maks. 12 foto. JPG, PNG, WEBP.</p>
                  <button type="button" className="px-4 py-2 rounded-full border border-[#EDE6D6] text-xs font-semibold hover:border-[#D4A91C] transition-colors">Pilih File</button>
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.music} onToggle={() => toggleOpt('music')} label="Musik Latar">
                <TInput label="URL Audio (MP3)" value={x.musicUrl} onChange={v => upX({ musicUrl: v })} placeholder="https://drive.google.com/..." />
              </ToggleSection>

              <ToggleSection enabled={opt.loveStory} onToggle={() => toggleOpt('loveStory')} label="Timeline Kisah Cinta">
                <div className="flex flex-col gap-3">
                  {x.loveStory.map((ev, i) => (
                    <div key={i} className="rounded-xl border border-[#EDE6D6] bg-[#FDFCF9] p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#D4A91C]">Peristiwa {i + 1}</span>
                        <button type="button" onClick={() => removeStory(i)}>
                          <Trash2 className="w-4 h-4 text-[#C2BEB8] hover:text-[#E05555]" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <TInput label="Tahun" value={ev.year} onChange={v => updateStory(i, { year: v })} placeholder="2023" />
                        <TInput label="Judul" value={ev.title} onChange={v => updateStory(i, { title: v })} placeholder="Pertama Bertemu" />
                      </div>
                      <TTextarea label="Cerita Singkat" value={ev.desc} onChange={v => updateStory(i, { desc: v })} rows={2} />
                    </div>
                  ))}
                  <button type="button" onClick={addStory}
                    className="flex items-center gap-2 justify-center py-3 rounded-xl border border-dashed border-[#D4A91C]/40 text-sm text-[#D4A91C] font-medium hover:bg-[#D4A91C]/5 transition-colors">
                    <Plus className="w-4 h-4" /> Tambah Peristiwa
                  </button>
                </div>
              </ToggleSection>
            </>
          )}

          {currentStep === 4 && (
            <>
              <SectionDivider label="RSVP & Buku Tamu" />
              <ToggleSection enabled={opt.rsvp} onToggle={() => toggleOpt('rsvp')} label="Aktifkan RSVP">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TInput label="Batas RSVP" type="date" value={x.rsvpDeadline} onChange={v => upX({ rsvpDeadline: v })} />
                  <div>
                    <Label>Maks. Tamu per Link</Label>
                    <select className="w-full rounded-xl border border-[#EDE6D6] bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4A91C] transition-all"
                      value={x.rsvpMaxGuests} onChange={e => upX({ rsvpMaxGuests: e.target.value })}>
                      <option value="1">1 orang</option>
                      <option value="2">2 orang</option>
                      <option value="5">5 orang</option>
                      <option value="10">Tak terbatas</option>
                    </select>
                  </div>
                </div>
                <TTextarea label="Pesan RSVP" value={x.rsvpMessage} onChange={v => upX({ rsvpMessage: v })} placeholder="Kami sangat mengharap kehadiran Anda…" rows={2} />
              </ToggleSection>

              <ToggleSection enabled={opt.guestbook} onToggle={() => toggleOpt('guestbook')} label="Buku Tamu & Ucapan">
                <p className="text-xs text-[#9A9390]">Tamu dapat menulis ucapan dan doa langsung di halaman undangan.</p>
              </ToggleSection>

              <SectionDivider label="Amplop Digital" />
              <ToggleSection enabled={opt.giftBank} onToggle={() => toggleOpt('giftBank')} label="Transfer Bank / E-Wallet">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <TInput label="Bank / E-Wallet" value={x.bankName} onChange={v => upX({ bankName: v })} placeholder="BCA / GoPay" />
                  <TInput label="Nomor Rekening" value={x.bankAccount} onChange={v => upX({ bankAccount: v })} placeholder="12345678" />
                  <TInput label="Atas Nama" value={x.bankAccountName} onChange={v => upX({ bankAccountName: v })} placeholder="Rina Angelina" />
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.qris} onToggle={() => toggleOpt('qris')} label="QRIS">
                <TInput label="Nomor / ID QRIS" value={x.qrisAccount} onChange={v => upX({ qrisAccount: v })} placeholder="QRIS-1234" />
                <div className="border border-dashed border-[#EDE6D6] rounded-xl p-6 flex flex-col items-center text-center bg-[#FDFCF9]">
                  <p className="text-sm font-medium text-[#4A4540] mb-3">Upload Gambar QRIS</p>
                  <button type="button" className="px-4 py-2 rounded-full border border-[#EDE6D6] text-xs font-semibold hover:border-[#D4A91C] transition-colors">Pilih File</button>
                </div>
              </ToggleSection>

              <ToggleSection enabled={opt.giftAddress} onToggle={() => toggleOpt('giftAddress')} label="Alamat Pengiriman Hadiah Fisik">
                <TTextarea value={x.giftAddress} onChange={v => upX({ giftAddress: v })} placeholder="Jl. Melati No. 12, RT 03 RW 05…" rows={3} />
              </ToggleSection>
            </>
          )}

          {currentStep === 5 && (
            <div className="rounded-2xl bg-[#FDFCF9] border border-[#EDE6D6] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#EDE6D6]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#9A9390]">Ringkasan</p>
              </div>
              <div className="px-5 py-4 grid grid-cols-2 gap-y-3 text-sm">
                {[
                  ['Pengantin', `${f.groomNickname || '—'} & ${f.brideNickname || '—'}`],
                  ['Jenis Acara', f.eventType.replace('_', ' & ')],
                  ['Tema', selectedThemeName],
                  ['RSVP', opt.rsvp ? 'Aktif' : 'Nonaktif'],
                  ['Buku Tamu', opt.guestbook ? 'Aktif' : 'Nonaktif'],
                  ['Amplop Digital', [opt.giftBank && 'Bank', opt.qris && 'QRIS', opt.giftAddress && 'Alamat'].filter(Boolean).join(', ') || 'Nonaktif'],
                  ['Galeri', opt.gallery ? 'Aktif' : 'Nonaktif'],
                  ['Musik', opt.music ? 'Aktif' : 'Nonaktif'],
                ].map(([label, val], i) => (
                  <>
                    <span key={`l${i}`} className="text-[#9A9390]">{label}</span>
                    <span key={`v${i}`} className="font-medium text-[#1E1B18] capitalize">{val}</span>
                  </>
                ))}
              </div>
              <p className="text-xs text-center text-[#9A9390] pb-4">Anda masih bisa mengubah semua data ini setelah diterbitkan.</p>
            </div>
          )}
        </div>

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
