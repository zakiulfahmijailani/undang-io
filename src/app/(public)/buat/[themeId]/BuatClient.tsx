"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, Users, MapPin, ImageIcon, Loader2, Sparkles, X, Eye, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import { demoData } from "@/data/demoInvitation";
import { useTheme } from "@/hooks/useTheme";

interface BuatClientProps {
  themeId: string;
}

// ── Reusable field wrapper ──────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 group">
      <label className="block text-[13px] font-bold text-secondary-stitch tracking-wide transition-colors group-hover:text-primary-stitch">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-outline-stitch font-medium">{hint}</p>}
    </div>
  );
}

// ── Section block ───────────────────────────────────────────────
function Section({ title, accent, children }: { title: string; accent?: "amber" | "rose"; children: React.ReactNode }) {
  const dot = accent === "rose" ? "bg-rose-400" : "bg-amber-400";
  const bg = accent === "rose" ? "bg-rose-50/30 border-rose-100" : "bg-amber-50/30 border-amber-100";
  return (
    <div className={`space-y-5 p-6 rounded-[2rem] border relative overflow-hidden transition-all duration-300 hover:shadow-sm ${bg}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-bl-full -z-10" />
      <div className="flex items-center gap-2.5 mb-2">
        <span className={`w-2 h-2 rounded-full ${dot} shadow-sm`} />
        <h3 className="font-bold text-secondary-stitch text-[10px] uppercase tracking-[0.25em]">{title}</h3>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export default function BuatClient({ themeId }: BuatClientProps) {
  const router = useRouter();
  
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(themeId);
  const { theme, isLoading: themeLoading } = useTheme(isUuid ? { id: themeId } : { slug: themeId });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"mempelai" | "acara" | "cover">("mempelai");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    themeId: themeId,
    groom_name: "",
    bride_name: "",
    groom_full_name: "",
    groom_father: "",
    groom_mother: "",
    bride_full_name: "",
    bride_father: "",
    bride_mother: "",
    akad_date: "",
    akad_venue: "",
    akad_address: "",
    reception_date: "",
    reception_venue: "",
    reception_address: "",
    couple_photo_url: ""
  });

  const handleChange = (key: keyof typeof formData, val: string) => setFormData(p => ({ ...p, [key]: val }));

  // Load from sessionStorage & Check Auth
  useEffect(() => {
    let draftData: any = null;
    try {
      const draft = sessionStorage.getItem("undang_draft");
      if (draft) {
        draftData = JSON.parse(draft);
        // Only set values if the theme matches or if it's new
        setFormData(p => ({ ...p, ...draftData, themeId }));
      }
    } catch (e) {
      // ignore JSON parse error
    }

    const checkAuthAndAutoSave = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const searchKey = new URLSearchParams(window.location.search);
      const isAutoSave = searchKey.has('reason') && searchKey.get('reason') === 'simpan-undangan';

      if (session?.user && draftData && isAutoSave) {
        handleSave(draftData, session.user.id);
      }
    };
    checkAuthAndAutoSave();
  }, [themeId]);

  // Derive InvitationData for the preview EXACTLY like EditorClient.
  // Fallback order untuk fullName:
  //   1. Nama lengkap (jika diisi)
  //   2. Nama panggilan (selalu ada begitu user mulai ketik)
  //   3. Demo data (hanya jika dua-duanya kosong)
  const liveData = {
    ...demoData,
    coupleShortName: `${formData.groom_name || demoData.coupleShortName.split(" & ")[0]} & ${formData.bride_name || demoData.coupleShortName.split(" & ")[1]}`,
    coverPhoto: formData.couple_photo_url || demoData.coverPhoto,
    heroPhoto: formData.couple_photo_url || demoData.heroPhoto,
    groom: {
        ...demoData.groom,
        fullName: formData.groom_full_name || formData.groom_name || demoData.groom.fullName,
        father: formData.groom_father ? `Bapak ${formData.groom_father}` : demoData.groom.father,
        mother: formData.groom_mother ? `Ibu ${formData.groom_mother}` : demoData.groom.mother,
        photo: formData.couple_photo_url || demoData.groom.photo,
    },
    bride: {
        ...demoData.bride,
        fullName: formData.bride_full_name || formData.bride_name || demoData.bride.fullName,
        father: formData.bride_father ? `Bapak ${formData.bride_father}` : demoData.bride.father,
        mother: formData.bride_mother ? `Ibu ${formData.bride_mother}` : demoData.bride.mother,
    },
    akad: {
        ...demoData.akad,
        date: formData.akad_date || demoData.akad.date,
        venue: formData.akad_venue || demoData.akad.venue,
        address: formData.akad_address || demoData.akad.address,
    },
    reception: {
        ...demoData.reception,
        date: formData.reception_date || demoData.reception.date,
        venue: formData.reception_venue || demoData.reception.venue,
        address: formData.reception_address || demoData.reception.address,
    }
  };

  const handleSave = async (forceData = formData, forceUserId?: string) => {
    setIsSaving(true);
    const supabase = createBrowserSupabaseClient();
    
    let currentUserId = forceUserId;
    if (!currentUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      currentUserId = session?.user?.id;
    }

    if (!currentUserId) {
      // Not logged in -> create a 15-minute guest session
      try {
        const sessionToken = crypto.randomUUID();
        const baseSlug = `${forceData.groom_name || 'pria'}-${forceData.bride_name || 'wanita'}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        // Maps our formData to keys expected by GuestInvitationView
        const invitationData = {
          groomNickname: forceData.groom_name,
          groomFullName: forceData.groom_full_name,
          groomFather: forceData.groom_father,
          groomMother: forceData.groom_mother,
          brideNickname: forceData.bride_name,
          brideFullName: forceData.bride_full_name,
          brideFather: forceData.bride_father,
          brideMother: forceData.bride_mother,
          akadDate: forceData.akad_date,
          akadVenue: forceData.akad_venue,
          akadAddress: forceData.akad_address,
          receptionDate: forceData.reception_date,
          receptionVenue: forceData.reception_venue,
          receptionAddress: forceData.reception_address,
          coverPhoto: forceData.couple_photo_url
        };

        const res = await fetch("/api/invitations/guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionToken,
            slug,
            themeId: forceData.themeId,
            expiresAt,
            invitationData
          })
        });

        const { data, error } = await res.json();
        
        if (error) {
          alert('Gagal menyusun sesi dummy: ' + (error.message || 'Unknown error'));
          setIsSaving(false);
          return;
        }

        // Simpan referensi kepemilikan lokal untuk konversi kelak
        localStorage.setItem("guest_session", JSON.stringify({ sessionToken, slug }));
        
        // Buang draft, langsung giring ke public URL 15-live-timer
        sessionStorage.removeItem("undang_draft");
        router.push(`/u/${slug}`);
        
      } catch (err) {
        alert("Terjadi kesalahan jaringan saat membangun sesi anonim.");
        setIsSaving(false);
      }
      return;
    }

    // Logged in -> POST to /api/invitations
    try {
      const payload = {
        groom_name: forceData.groom_name || "Groom",
        bride_name: forceData.bride_name || "Bride",
        theme_id: forceData.themeId,
        details: {
          groom_full_name: forceData.groom_full_name,
          groom_nickname: forceData.groom_name,
          groom_father: forceData.groom_father,
          groom_mother: forceData.groom_mother,
          bride_full_name: forceData.bride_full_name,
          bride_nickname: forceData.bride_name,
          bride_father: forceData.bride_father,
          bride_mother: forceData.bride_mother,
          akad_datetime: forceData.akad_date,
          akad_location_name: forceData.akad_venue,
          akad_location_address: forceData.akad_address,
          reception_datetime: forceData.reception_date,
          reception_location_name: forceData.reception_venue,
          reception_location_address: forceData.reception_address
        }
      };

      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const { data, error } = await res.json();
      
      if (error) {
        if (error.code === 'SLUG_ALREADY_TAKEN') {
          alert('Kombinasi url/nama sedang digunakan, silakan coba lagi.');
        } else {
          alert('Gagal menyimpan undangan: ' + (error.message || 'Unknown error'));
        }
        setIsSaving(false);
        return;
      }

      // Success! Clear draft and redirect to editor
      sessionStorage.removeItem("undang_draft");
      router.push(`/dashboard/undangan/${data.id}/edit`);

    } catch (err: any) {
      alert("Terjadi kesalahan jaringan.");
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // For public preview, just use createObjectURL
    const objectUrl = URL.createObjectURL(file);
    handleChange("couple_photo_url", objectUrl);
  };

  return (
    <div className="min-h-screen bg-surface-lowest-stitch selection:bg-tertiary-fixed-dim-stitch flex flex-col font-['Inter']">
      
      {/* ── Top Navigation ── */}
      <header className="flex-shrink-0 h-16 bg-white/70 backdrop-blur-xl border-b border-outline-variant-stitch/30 flex items-center justify-between px-4 lg:px-8 z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/buat")}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-secondary-stitch hover:bg-surface-stitch hover:text-primary-stitch transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
             <h1 className="font-bold text-primary-stitch leading-tight text-sm lg:text-base">Isi Data Undangan</h1>
             <span className="text-[10px] font-black tracking-widest text-outline-stitch uppercase border border-outline-variant-stitch/50 px-2 py-0.5 rounded-full">
               TEMA DIPILIH 
             </span>
          </div>
        </div>
        
        {/* Desktop Save Button */}
        <div className="hidden lg:block">
          <button 
            onClick={() => handleSave()}
            disabled={isSaving || themeLoading}
            className="flex-1 sm:flex-none h-11 bg-primary-stitch text-on-primary-stitch rounded-full px-8 py-2 font-bold shadow-lg shadow-primary-stitch/20 hover:opacity-90 transition-all active:scale-95 border-0 flex items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" />}
            Simpan & Lanjutkan
          </button>
        </div>
      </header>

      {/* ── Split Layout ── */}
      <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
        
        {/* ── LEFT: FORM PANEL (40%) ── */}
        <div className="w-full lg:w-[40%] flex flex-col overflow-y-auto bg-white border-r border-outline-variant-stitch/20 overflow-x-hidden">
          
          {/* Form Tabs */}
          <div className="flex px-6 pt-6 gap-2 border-b border-outline-variant-stitch/30 sticky top-0 bg-white/80 backdrop-blur-md z-10 pb-4">
            {[
              { id: "mempelai", label: "Mempelai", icon: Users },
              { id: "acara", label: "Acara", icon: MapPin },
              { id: "cover", label: "Foto Cover", icon: ImageIcon }
            ].map((tab) => {
               const Icon = tab.icon;
               const active = activeTab === tab.id;
               return (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 flex px-2 py-3 rounded-2xl transition-all items-center gap-1.5 focus:outline-none ${
                     active ? "bg-primary-container-stitch text-primary-stitch shadow-sm border border-primary-stitch/10" : "text-outline-stitch hover:bg-surface-stitch hover:text-secondary-stitch border border-transparent"
                   }`}
                 >
                   <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-primary-stitch" : "text-current"}`} />
                   <span className="text-[11px] font-black tracking-wider uppercase leading-none whitespace-nowrap overflow-hidden text-ellipsis">{tab.label}</span>
                 </button>
               );
             })}
          </div>

          <div className="p-6 pb-32">
            
            {/* View: Mempelai */}
            {activeTab === "mempelai" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Section title="Pengantin Pria" accent="amber">
                    <Field label="Nama Panggilan">
                        <Input value={formData.groom_name} onChange={e => handleChange("groom_name", e.target.value)} placeholder="Budi" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                    </Field>
                    <Field label="Nama Lengkap">
                        <Input value={formData.groom_full_name} onChange={e => handleChange("groom_full_name", e.target.value)} placeholder="Mohammad Andi Pratama" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Nama Ayah">
                            <Input value={formData.groom_father} onChange={e => handleChange("groom_father", e.target.value)} placeholder="Fauzi" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                        </Field>
                        <Field label="Nama Ibu">
                            <Input value={formData.groom_mother} onChange={e => handleChange("groom_mother", e.target.value)} placeholder="Siti" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                        </Field>
                    </div>
                </Section>
                
                <Section title="Pengantin Wanita" accent="rose">
                    <Field label="Nama Panggilan">
                        <Input value={formData.bride_name} onChange={e => handleChange("bride_name", e.target.value)} placeholder="Ayu" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                    </Field>
                    <Field label="Nama Lengkap">
                        <Input value={formData.bride_full_name} onChange={e => handleChange("bride_full_name", e.target.value)} placeholder="Rina Angelina Putri" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Nama Ayah">
                            <Input value={formData.bride_father} onChange={e => handleChange("bride_father", e.target.value)} placeholder="Hasan" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                        </Field>
                        <Field label="Nama Ibu">
                            <Input value={formData.bride_mother} onChange={e => handleChange("bride_mother", e.target.value)} placeholder="Rahayu" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                        </Field>
                    </div>
                </Section>
              </div>
            )}

            {/* View: Acara */}
            {activeTab === "acara" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 <Section title="Akad Nikah" accent="amber">
                     <Field label="Tanggal & Waktu">
                         <Input type="datetime-local" value={formData.akad_date} onChange={e => handleChange("akad_date", e.target.value)} className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                     </Field>
                     <Field label="Nama Tempat">
                         <Input value={formData.akad_venue} onChange={e => handleChange("akad_venue", e.target.value)} placeholder="Masjid Al-Ikhlas" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                     </Field>
                     <Field label="Alamat Lengkap">
                         <textarea
                             rows={3}
                             className="flex w-full rounded-2xl border border-outline-variant-stitch/40 text-sm bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch placeholder:text-outline-stitch focus:outline-none focus:ring-2 focus:ring-primary-stitch/20 focus:border-primary-stitch resize-none transition-all"
                             value={formData.akad_address}
                             onChange={e => handleChange("akad_address", e.target.value)}
                             placeholder="Jl. Merdeka No. 1..."
                         />
                     </Field>
                 </Section>

                 <Section title="Resepsi" accent="rose">
                     <Field label="Tanggal & Waktu">
                         <Input type="datetime-local" value={formData.reception_date} onChange={e => handleChange("reception_date", e.target.value)} className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                     </Field>
                     <Field label="Nama Tempat">
                         <Input value={formData.reception_venue} onChange={e => handleChange("reception_venue", e.target.value)} placeholder="Gedung Serbaguna" className="rounded-2xl border-outline-variant-stitch/40 bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch focus:ring-primary-stitch/20 focus:border-primary-stitch transition-all text-sm" />
                     </Field>
                     <Field label="Alamat Lengkap">
                         <textarea
                             rows={3}
                             className="flex w-full rounded-2xl border border-outline-variant-stitch/40 text-sm bg-surface-container-lowest-stitch px-4 py-3 text-on-surface-stitch placeholder:text-outline-stitch focus:outline-none focus:ring-2 focus:ring-primary-stitch/20 focus:border-primary-stitch resize-none transition-all"
                             value={formData.reception_address}
                             onChange={e => handleChange("reception_address", e.target.value)}
                             placeholder="Jl. Sudirman No. 10..."
                         />
                     </Field>
                 </Section>
              </div>
            )}

            {/* View: Cover (Upload Foto) */}
            {activeTab === "cover" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Section title="Foto Utama Pasangan" accent="amber">
                    {formData.couple_photo_url && (
                        <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-outline-variant-stitch/20 shadow-xl shadow-primary-stitch/5">
                            <img
                                src={formData.couple_photo_url}
                                alt="Foto pasangan"
                                className="w-full object-cover max-h-64"
                            />
                            <button
                                onClick={() => handleChange("couple_photo_url", "")}
                                className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex flex-col items-center justify-center gap-4 p-10 rounded-[2.5rem] border-2 border-dashed cursor-pointer transition-all border-outline-variant-stitch/50 hover:border-primary-stitch hover:bg-surface-container-lowest-stitch`}
                    >
                        <Upload className="w-7 h-7 text-stone-400" />
                        <p className="text-sm font-semibold text-stone-700">
                            {formData.couple_photo_url ? "Ganti foto" : "Upload foto pasangan"}
                        </p>
                        <p className="text-xs text-stone-400">Preview lokal dari device Anda</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handlePhotoUpload}
                        />
                    </div>
                </Section>
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT: LIVE PREVIEW PANEL (60%) ── */}
        <div className="hidden lg:flex flex-[6] lg:flex-none lg:w-[60%] flex-col overflow-hidden border-t md:border-t-0 bg-surface-container-stitch min-h-[600px] md:min-h-0">
            <div className="flex items-center gap-3 px-6 py-4 bg-surface-container-lowest-stitch border-b border-outline-variant-stitch/10 flex-shrink-0">
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-error-stitch/30" />
                    <span className="w-3 h-3 rounded-full bg-tertiary-stitch/30" />
                    <span className="w-3 h-3 rounded-full bg-primary-stitch/10" />
                </div>
                <div className="flex-1 mx-3 text-center flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 text-tertiary-stitch" />
                    <span className="text-[10px] font-mono font-bold text-outline-stitch bg-surface-container-stitch px-4 py-1.5 rounded-full tracking-wider">
                        LIVE PREVIEW
                    </span>
                </div>
                {themeLoading ? (
                  <span className="text-[10px] font-black tracking-widest uppercase text-amber-600 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> LOADING
                  </span>
                ) : (
                  <span className="text-[10px] font-black tracking-widest uppercase text-tertiary-stitch bg-tertiary-stitch/10 px-3 py-1 rounded-full border border-tertiary-stitch/20">
                    ● REALTIME
                  </span>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto w-full relative">
                {themeLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-tertiary-stitch" />
                  </div>
                ) : (
                  <div
                      className="origin-top-left"
                      style={{ transform: "scale(0.6)", width: "166.67%", transformOrigin: "top left" }}
                  >
                      {/* Using identical call as EditorClient but appending the theme! */}
                      <InvitationClientWrapper 
                        data={liveData as any} 
                        theme={theme as any} 
                      />
                  </div>
                )}
            </div>
        </div>
      </div>

      {/* ── Mobile Save CTA & Preview Toggle ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white border-t border-outline-variant-stitch/30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex items-center gap-3 z-50">
        <button 
          onClick={() => handleSave()}
          disabled={isSaving || themeLoading}
          className="flex-1 bg-primary-stitch text-on-primary-stitch h-14 rounded-full font-bold text-sm shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 active:scale-95 border-0 transition-all"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan & Lanjutkan
        </button>
        <button 
          onClick={() => setMobilePreviewOpen(true)}
          className="w-16 h-14 shrink-0 flex items-center justify-center bg-surface-container-stitch text-primary-stitch rounded-2xl border-2 border-primary-stitch overflow-hidden relative shadow-sm"
        >
           <Eye className="w-6 h-6 z-10" />
        </button>
      </div>

      {/* ── Mobile Live Preview Sheet/Drawer ── */}
      {mobilePreviewOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex flex-col bg-surface-lowest-stitch animate-in slide-in-from-bottom-full duration-300">
          <div className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl border-b border-outline-variant-stitch/30 sticky top-0 z-50">
            <h2 className="font-bold text-primary-stitch text-sm flex items-center gap-2">
              <Eye className="w-4 h-4" /> Live Preview
            </h2>
            <button 
              onClick={() => setMobilePreviewOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-stitch text-primary-stitch"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 w-full bg-white relative overflow-hidden">
             <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                {themeLoading ? (
                   <div className="flex h-full items-center justify-center">
                     <Loader2 className="w-10 h-10 animate-spin text-tertiary-stitch" />
                   </div>
                ) : (
                  <InvitationClientWrapper data={liveData as any} theme={theme as any} />
                )}
             </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
