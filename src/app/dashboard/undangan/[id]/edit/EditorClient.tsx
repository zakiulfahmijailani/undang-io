"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Save, Copy, Upload, Loader2, X,
    Info, Type, Image as ImageIcon, Heart, Users,
    MapPin, Music, Settings, Camera, Gift, Eye, EyeOff, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { demoData } from "@/data/demoInvitation";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import MusicPickerTab from "@/components/dashboard/MusicPickerTab";

interface EditorClientProps {
    initialData: any;
}

// ── Reusable field wrapper ──────────────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-stone-700">{label}</label>
            {children}
            {hint && <p className="text-xs text-stone-400">{hint}</p>}
        </div>
    );
}

// ── Section block ───────────────────────────────────────────────
function Section({ title, accent, children }: { title: string; accent?: "amber" | "rose"; children: React.ReactNode }) {
    const dot = accent === "rose" ? "bg-rose-400" : "bg-amber-400";
    return (
        <div className="space-y-4 p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                <h3 className="font-bold text-stone-700 text-sm uppercase tracking-wide">{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function EditorClient({ initialData }: EditorClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("infodasar");
    const [isUploading, setIsUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        status: initialData.status,
        slug: initialData.slug,
        groom_name: initialData.groom_nickname || "",
        bride_name: initialData.bride_nickname || "",
        couple_photo_url: initialData.couple_photo_url || "",
        groom_full_name: initialData.groom_full_name || "",
        groom_father: initialData.groom_father_name || "",
        groom_mother: initialData.groom_mother_name || "",
        bride_full_name: initialData.bride_full_name || "",
        bride_father: initialData.bride_father_name || "",
        bride_mother: initialData.bride_mother_name || "",
        akad_date: initialData.akad_datetime || "",
        akad_venue: initialData.akad_location_name || "",
        akad_address: initialData.akad_location_address || "",
        akad_maps: "",
        reception_date: initialData.resepsi_datetime || "",
        reception_venue: initialData.resepsi_location_name || "",
        reception_address: initialData.resepsi_location_address || "",
        reception_maps: "",
        dresscode: "",
        greeting_text: initialData.quote_text || "",
        music_url: initialData.music_url || "",
        love_story: [],
        gallery_photos: [],
        bank_accounts: [],
        enable_rsvp: true,
    });

    const liveData = {
        ...demoData,
        coupleShortName: `${formData.groom_name || demoData.coupleShortName.split(" & ")[0]} & ${formData.bride_name || demoData.coupleShortName.split(" & ")[1]}`,
        coverPhoto: formData.couple_photo_url || demoData.coverPhoto,
        heroPhoto: formData.couple_photo_url || demoData.heroPhoto,
        groom: {
            ...demoData.groom,
            fullName: formData.groom_full_name || demoData.groom.fullName,
            father: formData.groom_father ? `Bapak ${formData.groom_father}` : demoData.groom.father,
            mother: formData.groom_mother ? `Ibu ${formData.groom_mother}` : demoData.groom.mother,
            photo: formData.couple_photo_url || demoData.groom.photo,
        },
        bride: {
            ...demoData.bride,
            fullName: formData.bride_full_name || demoData.bride.fullName,
            father: formData.bride_father ? `Bapak ${formData.bride_father}` : demoData.bride.father,
            mother: formData.bride_mother ? `Ibu ${formData.bride_mother}` : demoData.bride.mother,
        },
        akad: {
            ...demoData.akad,
            date: formData.akad_date || demoData.akad.date,
            venue: formData.akad_venue || demoData.akad.venue,
            address: formData.akad_address || demoData.akad.address,
            mapsUrl: formData.akad_maps || demoData.akad.mapsUrl,
        },
        reception: {
            ...demoData.reception,
            date: formData.reception_date || demoData.reception.date,
            venue: formData.reception_venue || demoData.reception.venue,
            address: formData.reception_address || demoData.reception.address,
            mapsUrl: formData.reception_maps || demoData.reception.mapsUrl,
        },
        quote: {
            text: formData.greeting_text || demoData.quote.text,
            source: formData.greeting_text ? "Mempelai" : demoData.quote.source,
        },
        musicUrl: formData.music_url || null,
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/invitations/${initialData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error?.message || "Gagal menyimpan");
            router.refresh();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("invitation_id", initialData.id);
            fd.append("type", "cover");
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error?.message || "Upload gagal");
            handleChange("couple_photo_url", result.data.url);
        } catch (err: any) {
            alert("Upload gagal: " + err.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const tabs = [
        { id: "infodasar", label: "Informasi Dasar", icon: Info },
        { id: "fotocover", label: "Foto & Cover", icon: ImageIcon },
        { id: "mempelai", label: "Data Mempelai", icon: Users },
        { id: "acara", label: "Acara", icon: MapPin },
        { id: "lovestory", label: "Kisah Cinta", icon: Heart, soon: true },
        { id: "galeri", label: "Galeri Foto", icon: Camera, soon: true },
        { id: "amplop", label: "Amplop Digital", icon: Gift, soon: true },
        { id: "ayat", label: "Ayat & Quote", icon: Type, soon: true },
        { id: "musik", label: "Musik", icon: Music },
        { id: "pengaturan", label: "Pengaturan", icon: Settings, soon: true },
    ];

    const coupleName = `${formData.groom_name || "Mempelai Pria"} & ${formData.bride_name || "Mempelai Wanita"}`;

    return (
        <div className="flex flex-col h-full bg-stone-50 min-h-screen">

            {/* ── Sticky Header ── */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 py-3 shadow-sm">
                <div className="max-w-full mx-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link href={`/dashboard/undangan/${initialData.id}`} className="p-1.5 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="font-serif font-bold text-lg text-stone-800 line-clamp-1 truncate max-w-[200px] md:max-w-xs">
                                Edit: {coupleName}
                            </h1>
                            <p className="text-xs text-stone-400 font-mono">undang.io/invite/{formData.slug}</p>
                        </div>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <Button
                            variant="secondary"
                            className="h-9 border-stone-200 text-stone-600 bg-white hover:bg-stone-50 text-sm"
                            onClick={() => setShowPreview(p => !p)}
                        >
                            {showPreview
                                ? <><EyeOff className="w-4 h-4 mr-1.5" />Sembunyikan Preview</>
                                : <><Eye className="w-4 h-4 mr-1.5" />Tampilkan Preview</>}
                        </Button>
                        <Button
                            onClick={handleSaveAll}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none h-9 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md border-0 font-semibold"
                        >
                            {isSaving
                                ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Menyimpan...</>
                                : <><Save className="w-4 h-4 mr-1.5" />Simpan Semua</>}
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Split Pane Body ── */}
            <div className="flex flex-col md:flex-row flex-1 overflow-auto md:overflow-hidden" style={{ minHeight: "calc(100vh - 64px)" }}>

                {/* LEFT — Editor Form */}
                <div className={`flex flex-col overflow-hidden bg-stone-50 transition-all duration-300 ${showPreview ? "w-full md:w-[420px] lg:w-[460px] md:flex-shrink-0" : "w-full"}`}>

                    {/* Tab Nav — vertical sidebar style */}
                    <div className="flex md:flex-row overflow-x-auto md:overflow-visible flex-shrink-0 border-b border-stone-200 bg-white">
                        <nav className="flex md:flex-col w-full md:w-auto md:border-r md:border-stone-200 md:bg-white overflow-x-auto scrollbar-hide">
                            {/* Mobile: horizontal scroll pills */}
                            <div className="md:hidden flex gap-1 px-3 py-2.5 overflow-x-auto scrollbar-hide">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => !tab.soon && setActiveTab(tab.id)}
                                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all ${isActive
                                                ? "bg-stone-900 text-white"
                                                : tab.soon
                                                    ? "bg-stone-100 text-stone-300 cursor-not-allowed"
                                                    : "bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700"
                                                }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {tab.label}
                                            {tab.soon && <Lock className="w-3 h-3" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>

                    {/* Desktop: vertical tab list + content side by side */}
                    <div className="flex flex-1 overflow-hidden">

                        {/* Vertical tab list — desktop only */}
                        <nav className="hidden md:flex flex-col w-44 flex-shrink-0 border-r border-stone-200 bg-white overflow-y-auto py-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => !tab.soon && setActiveTab(tab.id)}
                                        disabled={!!tab.soon}
                                        className={`flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all text-left relative ${isActive
                                            ? "bg-amber-50 text-amber-800 font-semibold"
                                            : tab.soon
                                                ? "text-stone-300 cursor-not-allowed"
                                                : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                                            }`}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full" />
                                        )}
                                        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-amber-500" : tab.soon ? "text-stone-300" : "text-stone-400"}`} />
                                        <span className="truncate">{tab.label}</span>
                                        {tab.soon && <Lock className="w-3 h-3 ml-auto text-stone-300 flex-shrink-0" />}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Tab content area */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-5 space-y-6">

                                {/* ── INFO DASAR ── */}
                                {activeTab === "infodasar" && (
                                    <div className="space-y-6 animate-in fade-in duration-200">
                                        <div>
                                            <h2 className="text-xl font-serif font-bold text-stone-800">Informasi Dasar</h2>
                                            <p className="text-sm text-stone-400 mt-1">Nama panggilan dan status halaman publik.</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Panggilan Pria">
                                                <Input
                                                    value={formData.groom_name}
                                                    onChange={e => handleChange("groom_name", e.target.value)}
                                                    placeholder="Budi"
                                                    className="text-base py-3"
                                                />
                                            </Field>
                                            <Field label="Panggilan Wanita">
                                                <Input
                                                    value={formData.bride_name}
                                                    onChange={e => handleChange("bride_name", e.target.value)}
                                                    placeholder="Ayu"
                                                    className="text-base py-3"
                                                />
                                            </Field>
                                        </div>

                                        <Field label="Status Undangan" hint="Ubah ke Aktif agar tamu bisa melihat undangan.">
                                            <Select id="status" value={formData.status} onChange={e => handleChange("status", e.target.value)}>
                                                <option value="unpaid">Belum Aktif (Draft)</option>
                                                <option value="active">Aktif (Publik)</option>
                                                <option value="expired">Kedaluwarsa</option>
                                            </Select>
                                        </Field>

                                        <Field label="URL Undangan Publik">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={`undang.io/invite/${formData.slug}`}
                                                    readOnly
                                                    className="bg-stone-50 text-stone-500 text-sm font-mono"
                                                />
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    title="Salin Link"
                                                    onClick={() => navigator.clipboard.writeText(`https://undang.io/invite/${formData.slug}`)}
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Field>
                                    </div>
                                )}

                                {/* ── FOTO & COVER ── */}
                                {activeTab === "fotocover" && (
                                    <div className="space-y-5 animate-in fade-in duration-200">
                                        <div>
                                            <h2 className="text-xl font-serif font-bold text-stone-800">Foto & Cover</h2>
                                            <p className="text-sm text-stone-400 mt-1">Upload foto utama pasangan.</p>
                                        </div>

                                        {formData.couple_photo_url && (
                                            <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                                                <Image
                                                    src={formData.couple_photo_url}
                                                    alt="Foto pasangan"
                                                    width={480} height={280}
                                                    className="w-full object-cover max-h-52"
                                                    unoptimized={formData.couple_photo_url.startsWith("http://localhost") || formData.couple_photo_url.startsWith("/uploads")}
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
                                            onClick={() => !isUploading && fileInputRef.current?.click()}
                                            className={`flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${isUploading
                                                ? "border-amber-300 bg-amber-50 cursor-wait"
                                                : "border-stone-300 hover:border-amber-400 hover:bg-amber-50/40"
                                                }`}
                                        >
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-7 h-7 text-amber-500 animate-spin" />
                                                    <p className="text-sm text-amber-700 font-medium">Mengupload...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-7 h-7 text-stone-400" />
                                                    <p className="text-sm font-semibold text-stone-700">
                                                        {formData.couple_photo_url ? "Ganti foto" : "Upload foto pasangan"}
                                                    </p>
                                                    <p className="text-xs text-stone-400">JPG, PNG, WebP · maks. 5MB</p>
                                                </>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="hidden"
                                                onChange={handleCoverUpload}
                                                disabled={isUploading}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ── DATA MEMPELAI ── */}
                                {activeTab === "mempelai" && (
                                    <div className="space-y-5 animate-in fade-in duration-200">
                                        <div>
                                            <h2 className="text-xl font-serif font-bold text-stone-800">Data Mempelai</h2>
                                            <p className="text-sm text-stone-400 mt-1">Nama lengkap dan nama orang tua.</p>
                                        </div>

                                        <Section title="Pengantin Pria" accent="amber">
                                            <Field label="Nama Lengkap">
                                                <Input value={formData.groom_full_name} onChange={e => handleChange("groom_full_name", e.target.value)} placeholder="Mohammad Andi Pratama" className="text-base py-3" />
                                            </Field>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Field label="Nama Ayah">
                                                    <Input value={formData.groom_father} onChange={e => handleChange("groom_father", e.target.value)} placeholder="Fauzi" className="text-base py-3" />
                                                </Field>
                                                <Field label="Nama Ibu">
                                                    <Input value={formData.groom_mother} onChange={e => handleChange("groom_mother", e.target.value)} placeholder="Siti" className="text-base py-3" />
                                                </Field>
                                            </div>
                                        </Section>

                                        <Section title="Pengantin Wanita" accent="rose">
                                            <Field label="Nama Lengkap">
                                                <Input value={formData.bride_full_name} onChange={e => handleChange("bride_full_name", e.target.value)} placeholder="Rina Angelina Putri" className="text-base py-3" />
                                            </Field>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Field label="Nama Ayah">
                                                    <Input value={formData.bride_father} onChange={e => handleChange("bride_father", e.target.value)} placeholder="Hasan" className="text-base py-3" />
                                                </Field>
                                                <Field label="Nama Ibu">
                                                    <Input value={formData.bride_mother} onChange={e => handleChange("bride_mother", e.target.value)} placeholder="Rahayu" className="text-base py-3" />
                                                </Field>
                                            </div>
                                        </Section>
                                    </div>
                                )}

                                {/* ── ACARA ── */}
                                {activeTab === "acara" && (
                                    <div className="space-y-5 animate-in fade-in duration-200">
                                        <div>
                                            <h2 className="text-xl font-serif font-bold text-stone-800">Detail Acara</h2>
                                            <p className="text-sm text-stone-400 mt-1">Waktu dan lokasi akad serta resepsi.</p>
                                        </div>

                                        <Section title="Akad Nikah" accent="amber">
                                            <Field label="Tanggal & Waktu">
                                                <Input type="datetime-local" value={formData.akad_date} onChange={e => handleChange("akad_date", e.target.value)} className="text-base py-3" />
                                            </Field>
                                            <Field label="Nama Tempat">
                                                <Input value={formData.akad_venue} onChange={e => handleChange("akad_venue", e.target.value)} placeholder="Masjid Al-Ikhlas" className="text-base py-3" />
                                            </Field>
                                            <Field label="Alamat Lengkap">
                                                <textarea
                                                    rows={3}
                                                    className="flex w-full rounded-xl border border-stone-200 text-base bg-white px-3 py-3 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none transition-all"
                                                    value={formData.akad_address}
                                                    onChange={e => handleChange("akad_address", e.target.value)}
                                                    placeholder="Jl. Masjid No. 1, Bandung"
                                                />
                                            </Field>
                                            <Field label="Link Google Maps">
                                                <Input value={formData.akad_maps} onChange={e => handleChange("akad_maps", e.target.value)} placeholder="https://maps.app.goo.gl/..." className="text-base py-3" />
                                            </Field>
                                        </Section>

                                        <Section title="Resepsi" accent="rose">
                                            <Field label="Tanggal & Waktu">
                                                <Input type="datetime-local" value={formData.reception_date} onChange={e => handleChange("reception_date", e.target.value)} className="text-base py-3" />
                                            </Field>
                                            <Field label="Nama Tempat">
                                                <Input value={formData.reception_venue} onChange={e => handleChange("reception_venue", e.target.value)} placeholder="Gedung Serbaguna" className="text-base py-3" />
                                            </Field>
                                            <Field label="Alamat Lengkap">
                                                <textarea
                                                    rows={3}
                                                    className="flex w-full rounded-xl border border-stone-200 text-base bg-white px-3 py-3 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none transition-all"
                                                    value={formData.reception_address}
                                                    onChange={e => handleChange("reception_address", e.target.value)}
                                                    placeholder="Jl. Tamansari No. 73, Bandung"
                                                />
                                            </Field>
                                            <Field label="Link Google Maps">
                                                <Input value={formData.reception_maps} onChange={e => handleChange("reception_maps", e.target.value)} placeholder="https://maps.app.goo.gl/..." className="text-base py-3" />
                                            </Field>
                                        </Section>
                                    </div>
                                )}

                                {/* ── MUSIK ── */}
                                {activeTab === "musik" && (
                                    <MusicPickerTab
                                        invitationId={initialData.id}
                                        currentMusicUrl={formData.music_url}
                                        onChange={(url) => handleChange("music_url", url)}
                                    />
                                )}

                                {/* ── COMING SOON tabs ── */}
                                {["lovestory", "galeri", "amplop", "ayat", "pengaturan"].includes(activeTab) && (
                                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                                        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-5 text-stone-300">
                                            {activeTab === "lovestory" && <Heart className="w-7 h-7" />}
                                            {activeTab === "galeri" && <Camera className="w-7 h-7" />}
                                            {activeTab === "amplop" && <Gift className="w-7 h-7" />}
                                            {activeTab === "ayat" && <Type className="w-7 h-7" />}
                                            {activeTab === "pengaturan" && <Settings className="w-7 h-7" />}
                                        </div>
                                        <h2 className="text-lg font-serif font-bold text-stone-700 mb-2">Segera Hadir</h2>
                                        <p className="text-stone-400 text-sm max-w-xs leading-relaxed">Fitur ini sedang dibangun dan akan segera tersedia.</p>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Live Preview (unchanged) */}
                {showPreview && (
                    <div className="flex flex-col flex-1 overflow-hidden border-t md:border-t-0 md:border-l border-stone-200 bg-stone-100 min-h-[600px] md:min-h-0">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-stone-200 flex-shrink-0">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-400" />
                                <span className="w-3 h-3 rounded-full bg-amber-400" />
                                <span className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 mx-3 text-center">
                                <span className="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full font-mono">
                                    /invite/{formData.slug} — Live Preview
                                </span>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                ● LIVE
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div
                                className="origin-top-left"
                                style={{ transform: "scale(0.6)", width: "166.67%", transformOrigin: "top left" }}
                            >
                                <InvitationClientWrapper data={liveData} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}