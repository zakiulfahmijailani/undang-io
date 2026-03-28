"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  ArrowLeft, Save, Eye, EyeOff, Users, MapPin, ImageIcon, Loader2, Sparkles, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import MasterInvitationRenderer from "@/components/invitation/MasterInvitationRenderer";
import { dummyThemes } from "@/data/dummyThemes";
import { demoData } from "@/data/demoInvitation";

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
      <div className="space-y-5">
        {children}
      </div>
    </div>
  );
}

export default function BuatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme");

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"mempelai" | "acara" | "cover">("mempelai");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const [formData, setFormData] = useState({
    themeId: themeParam || dummyThemes[0].id,
    groomFullName: "",
    groomNickname: "",
    brideFullName: "",
    brideNickname: "",
    akadDate: "",
    akadTime: "",
    akadVenue: "",
    akadAddress: "",
    receptionDate: "",
    receptionTime: "",
    receptionVenue: "",
    receptionAddress: "",
    coverPhotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
  });

  const update = (key: string, val: string) => setFormData(p => ({ ...p, [key]: val }));

  // Load from sessionStorage & Check Auth
  useEffect(() => {
    let draftData: any = null;
    try {
      const draft = sessionStorage.getItem("undang_draft");
      if (draft) {
        draftData = JSON.parse(draft);
        setFormData(p => ({ ...p, ...draftData }));
      }
    } catch (e) {
      // ignore
    }

    const checkAuthAndAutoSave = async () => {
      const supabase = createBrowserSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      // If we came back from login and have a draft, auto-save!
      const searchKey = new URLSearchParams(window.location.search);
      const isAutoSave = searchKey.get('autosave');

      if (session?.user && draftData && isAutoSave) {
        handleSave(true, draftData, session.user.id);
      }
    };
    checkAuthAndAutoSave();
  }, []);

  // Update theme when query param changes
  useEffect(() => {
    if (themeParam && themeParam !== formData.themeId) {
      update('themeId', themeParam);
    }
  }, [themeParam]);

  // Derive InvitationData for the preview
  const activeTheme = dummyThemes.find(t => t.id === formData.themeId) || dummyThemes[0];
  
  const previewData = {
    ...demoData,
    groom: {
      ...demoData.groom,
      fullName: formData.groomFullName || "Nama Pria",
      nickname: formData.groomNickname || "Pria",
    },
    bride: {
      ...demoData.bride,
      fullName: formData.brideFullName || "Nama Wanita",
      nickname: formData.brideNickname || "Wanita",
    },
    coupleShortName: `${formData.groomNickname || "Pria"} & ${formData.brideNickname || "Wanita"}`,
    akad: {
      ...demoData.akad,
      date: formData.akadDate ? `${formData.akadDate}T${formData.akadTime || "08:00"}:00Z` : demoData.akad.date,
      locationName: formData.akadVenue || "Nama Lokasi Akad",
      address: formData.akadAddress || "Alamat Lengkap Akad",
    },
    reception: {
      ...demoData.reception,
      date: formData.receptionDate ? `${formData.receptionDate}T${formData.receptionTime || "11:00"}:00Z` : demoData.reception.date,
      locationName: formData.receptionVenue || "Nama Lokasi Resepsi",
      address: formData.receptionAddress || "Alamat Lengkap Resepsi",
    }
  };

  const handleSave = async (isAutoSave = false, forceData = formData, forceUserId?: string) => {
    setIsSaving(true);
    const supabase = createBrowserSupabaseClient();
    
    // Check if logged in if not forcing user ID
    let currentUserId = forceUserId;
    if (!currentUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      currentUserId = session?.user?.id;
    }

    if (!currentUserId) {
      // Not logged in -> save to storage and redirect
      sessionStorage.setItem("undang_draft", JSON.stringify(formData));
      router.push("/login?redirect=/buat?autosave=1&reason=simpan-undangan");
      return;
    }

    // Logged in -> POST to /api/invitations
    try {
      const payload = {
        groom_name: forceData.groomNickname || "Groom",
        bride_name: forceData.brideNickname || "Bride",
        theme_id: forceData.themeId,
        details: {
          groom_full_name: forceData.groomFullName,
          groom_nickname: forceData.groomNickname,
          bride_full_name: forceData.brideFullName,
          bride_nickname: forceData.brideNickname,
          akad_date: forceData.akadDate,
          akad_time: forceData.akadTime,
          akad_venue: forceData.akadVenue,
          akad_address: forceData.akadAddress,
          reception_date: forceData.receptionDate,
          reception_time: forceData.receptionTime,
          reception_venue: forceData.receptionVenue,
          reception_address: forceData.receptionAddress
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
          alert('Kombinasi nama ini sudah dipakai. Coba modifikasi nama sedikit.');
        } else {
          alert('Gagal menyimpan undangan: ' + error.message);
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

  return (
    <div className="min-h-screen bg-surface-lowest-stitch selection:bg-tertiary-fixed-dim-stitch flex flex-col font-['Inter']">
      
      {/* ── Top Navigation ── */}
      <header className="flex-shrink-0 h-16 bg-white/70 backdrop-blur-xl border-b border-outline-variant-stitch/30 flex items-center justify-between px-4 lg:px-8 z-50 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-secondary-stitch hover:bg-surface-stitch hover:text-primary-stitch transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-primary-stitch leading-tight text-sm lg:text-base">Buat Undangan Baru</h1>
            <p className="text-[11px] text-outline-stitch font-medium">Bisa langsung preview di sebelah kanan</p>
          </div>
        </div>
        
        {/* Desktop Save Button */}
        <div className="hidden lg:block">
          <button 
            onClick={() => handleSave()}
            disabled={isSaving}
            className="bg-primary-stitch text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-primary-stitch/90 transition flex items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />}
            Simpan & Lanjutkan
          </button>
        </div>
      </header>

      {/* ── Split Layout ── */}
      <div className="flex-1 flex overflow-hidden flex-col lg:flex-row">
        
        {/* ── LEFT: FORM PANEL ── */}
        <div className="w-full lg:w-[45%] flex flex-col overflow-y-auto bg-white relative">
          
          {/* Form Tabs */}
          <div className="flex px-6 pt-6 gap-2 border-b border-outline-variant-stitch/30 sticky top-0 bg-white/80 backdrop-blur-md z-10 pb-4">
            {[
              { id: "mempelai", label: "Mempelai", icon: Users },
              { id: "acara", label: "Acara", icon: MapPin },
              { id: "cover", label: "Cover", icon: ImageIcon }
            ].map((tab) => {
               const Icon = tab.icon;
               const active = activeTab === tab.id;
               return (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all ${
                     active ? "bg-primary-container-stitch text-primary-stitch shadow-sm" : "text-outline-stitch hover:bg-surface-stitch hover:text-secondary-stitch"
                   }`}
                 >
                   <Icon className={`w-5 h-5 ${active ? "text-primary-stitch" : "text-current"}`} />
                   <span className="text-[10px] font-bold tracking-wider uppercase">{tab.label}</span>
                 </button>
               );
             })}
          </div>

          <div className="p-6 pb-32">
            
            {/* View: Mempelai */}
            {activeTab === "mempelai" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Section title="Informasi Pria" accent="amber">
                  <div className="grid grid-cols-1 gap-5">
                    <Field label="Nama Panggilan">
                      <Input
                        value={formData.groomNickname}
                        onChange={(e) => update("groomNickname", e.target.value)}
                        placeholder="Contoh: Budi"
                        className="rounded-2xl border-outline-variant-stitch focus:ring-primary-stitch"
                      />
                    </Field>
                    <Field label="Nama Lengkap">
                      <Input
                        value={formData.groomFullName}
                        onChange={(e) => update("groomFullName", e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="rounded-2xl border-outline-variant-stitch focus:ring-primary-stitch"
                      />
                    </Field>
                  </div>
                </Section>
                
                <Section title="Informasi Wanita" accent="rose">
                  <div className="grid grid-cols-1 gap-5">
                    <Field label="Nama Panggilan">
                      <Input
                        value={formData.brideNickname}
                        onChange={(e) => update("brideNickname", e.target.value)}
                        placeholder="Contoh: Ayu"
                        className="rounded-2xl border-outline-variant-stitch focus:ring-primary-stitch"
                      />
                    </Field>
                    <Field label="Nama Lengkap">
                      <Input
                        value={formData.brideFullName}
                        onChange={(e) => update("brideFullName", e.target.value)}
                        placeholder="Contoh: Ayu Lestari"
                        className="rounded-2xl border-outline-variant-stitch focus:ring-primary-stitch"
                      />
                    </Field>
                  </div>
                </Section>
              </div>
            )}

            {/* View: Acara */}
            {activeTab === "acara" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Section title="Akad Nikah / Pemberkatan">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Tanggal">
                      <Input type="date" value={formData.akadDate} onChange={e => update("akadDate", e.target.value)} className="rounded-2xl border-outline-variant-stitch" />
                    </Field>
                    <Field label="Waktu">
                      <Input type="time" value={formData.akadTime} onChange={e => update("akadTime", e.target.value)} className="rounded-2xl border-outline-variant-stitch" />
                    </Field>
                  </div>
                  <Field label="Nama Tempat">
                    <Input value={formData.akadVenue} onChange={e => update("akadVenue", e.target.value)} placeholder="Masjid Raya..." className="rounded-2xl border-outline-variant-stitch" />
                  </Field>
                  <Field label="Alamat">
                    <Input value={formData.akadAddress} onChange={e => update("akadAddress", e.target.value)} placeholder="Jl. Raya..." className="rounded-2xl border-outline-variant-stitch" />
                  </Field>
                </Section>

                <Section title="Resepsi">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Tanggal">
                      <Input type="date" value={formData.receptionDate} onChange={e => update("receptionDate", e.target.value)} className="rounded-2xl border-outline-variant-stitch" />
                    </Field>
                    <Field label="Waktu">
                      <Input type="time" value={formData.receptionTime} onChange={e => update("receptionTime", e.target.value)} className="rounded-2xl border-outline-variant-stitch" />
                    </Field>
                  </div>
                  <Field label="Nama Tempat">
                    <Input value={formData.receptionVenue} onChange={e => update("receptionVenue", e.target.value)} placeholder="Gedung Serbaguna..." className="rounded-2xl border-outline-variant-stitch" />
                  </Field>
                  <Field label="Alamat">
                    <Input value={formData.receptionAddress} onChange={e => update("receptionAddress", e.target.value)} placeholder="Jl. Sudirman..." className="rounded-2xl border-outline-variant-stitch" />
                  </Field>
                </Section>
              </div>
            )}

            {/* View: Cover & Tema */}
            {activeTab === "cover" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Section title="Pilih Tema" accent="amber">
                   <div className="grid grid-cols-2 gap-3">
                     {dummyThemes.map(t => (
                       <button
                         key={t.id}
                         onClick={() => update("themeId", t.id)}
                         className={`relative rounded-xl overflow-hidden aspect-[3/4] border-2 transition-all ${t.id === formData.themeId ? 'border-primary-stitch ring-4 ring-primary-stitch/20 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                       >
                         <img src={t.thumbnailUrl || ''} alt={t.name} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2 text-left">
                           <span className="text-white font-bold text-xs">{t.name}</span>
                         </div>
                       </button>
                     ))}
                   </div>
                </Section>
              </div>
            )}

          </div>
        </div>

        {/* ── RIGHT: LIVE PREVIEW PANEL ── */}
        <div className="hidden lg:flex flex-1 bg-surface-lowest-stitch items-center justify-center p-8 sticky top-0 h-full relative overflow-hidden">
           
           {/* Background Grid Pattern */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
           
           <div className="bg-white px-6 pt-4 pb-6 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 border border-outline-variant-stitch/30 relative z-10">
             <div className="flex items-center justify-between w-[375px]">
               <div className="flex gap-1.5 items-center">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
               </div>
               <span className="text-[10px] font-bold tracking-widest text-outline-stitch uppercase flex items-center gap-1">
                 <Sparkles className="w-3 h-3" />
                 Live Preview
               </span>
               <div className="w-9"></div>
             </div>
             
             {/* Phone Frame */}
             <div className="w-[375px] h-[700px] bg-black rounded-[2.5rem] p-2 shadow-inner overflow-hidden relative border-4 border-slate-100">
               <div className="w-full h-full rounded-[2rem] overflow-hidden bg-white relative">
                 <div className="absolute top-0 w-full h-[812px] origin-top left-0 right-0 transform scale-[0.86] custom-scrollbar overflow-y-auto">
                    <MasterInvitationRenderer theme={activeTheme} invitationData={previewData as any} />
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* ── Mobile Save CTA & Preview Toggle ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white border-t border-outline-variant-stitch/30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex items-center gap-3 z-50">
        <button 
          onClick={() => handleSave()}
          disabled={isSaving}
          className="flex-1 bg-primary-stitch text-white px-6 py-4 rounded-full font-bold text-sm shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan & Lanjutkan
        </button>
        <button 
          onClick={() => setMobilePreviewOpen(true)}
          className="w-16 h-14 shrink-0 flex items-center justify-center bg-surface-container-stitch text-primary-stitch rounded-2xl border-2 border-primary-stitch overflow-hidden relative shadow-sm"
        >
           <Eye className="w-6 h-6 z-10" />
           {/* Mini preview hint background */}
           <img src={activeTheme.thumbnailUrl!} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[1px]" />
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
                <MasterInvitationRenderer theme={activeTheme} invitationData={previewData as any} />
             </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
