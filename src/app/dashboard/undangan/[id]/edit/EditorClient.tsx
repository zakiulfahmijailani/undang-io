"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft, Save, Copy, Upload, Loader2, X,
    Info, Type, Image as ImageIcon, Heart, Users,
    MapPin, Music, Settings, Camera, Gift, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { demoData } from "@/data/demoInvitation";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";

interface EditorClientProps {
    initialData: any;
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
        music_url: "",
        love_story: [],
        gallery_photos: [],
        bank_accounts: [],
        enable_rsvp: true,
    });

    // ─── Live preview data — rebuilt on every formData change ───────────────
    const liveData = {
        ...demoData,
        coupleShortName: `${formData.groom_name || demoData.coupleShortName.split(' & ')[0]} & ${formData.bride_name || demoData.coupleShortName.split(' & ')[1]}`,
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
            source: formData.greeting_text ? 'Mempelai' : demoData.quote.source,
        },
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
            alert("Perubahan berhasil disimpan!");
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
            fd.append('file', file);
            fd.append('invitation_id', initialData.id);
            fd.append('type', 'cover');
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const result = await res.json();
            if (!res.ok || result.error) throw new Error(result.error?.message || 'Upload gagal');
            handleChange('couple_photo_url', result.data.url);
        } catch (err: any) {
            alert('Upload gagal: ' + err.message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const tabs = [
        { id: "infodasar", label: "Informasi Dasar", icon: Info },
        { id: "fotocover", label: "Foto & Cover", icon: ImageIcon },
        { id: "mempelai", label: "Data Mempelai", icon: Users },
        { id: "acara", label: "Acara", icon: MapPin },
        { id: "lovestory", label: "Kisah Cinta", icon: Heart },
        { id: "galeri", label: "Galeri Foto", icon: Camera },
        { id: "amplop", label: "Amplop Digital", icon: Gift },
        { id: "ayat", label: "Ayat & Quote", icon: Type },
        { id: "musik", label: "Musik", icon: Music },
        { id: "pengaturan", label: "Pengaturan", icon: Settings },
    ];

    const coupleName = `${formData.groom_name || 'Mempelai Pria'} & ${formData.bride_name || 'Mempelai Wanita'}`;

    return (
        <div className="flex flex-col h-full bg-stone-50 min-h-screen">

            {/* ── Sticky Header ─────────────────────────────────────────────── */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 py-3 shadow-sm">
                <div className="max-w-full mx-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link href={`/dashboard/undangan/${initialData.id}`} className="text-stone-500 hover:text-amber-600 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="font-serif font-bold text-lg text-stone-800 line-clamp-1 truncate max-w-[200px] md:max-w-none">
                                Edit: {coupleName}
                            </h1>
                            <p className="text-xs text-stone-500">undang.io/invite/{formData.slug}</p>
                        </div>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                        {/* Toggle preview button */}
                        <Button
                            variant="secondary"
                            className="h-9 border-stone-200 text-stone-700 bg-white hover:bg-stone-50"
                            onClick={() => setShowPreview(p => !p)}
                            title={showPreview ? 'Sembunyikan preview' : 'Tampilkan preview'}
                        >
                            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                            {showPreview ? 'Sembunyikan Preview' : 'Tampilkan Preview'}
                        </Button>
                        <Button
                            onClick={handleSaveAll}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none h-9 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md border-0"
                        >
                            {isSaving
                                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</>
                                : <><Save className="w-4 h-4 mr-2" />Simpan Semua</>}
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── Split Pane Body ───────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

                {/* LEFT — Editor Form */}
                <div className={`flex flex-col overflow-y-auto bg-stone-50 transition-all duration-300 ${
                    showPreview ? 'w-full md:w-[420px] lg:w-[460px] flex-shrink-0' : 'w-full'
                }`}>
                    <div className="flex flex-col gap-4 p-4">

                        {/* Sidebar Tab Nav */}
                        <nav className="flex md:flex-col overflow-x-auto gap-1 pb-1 scrollbar-hide">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                                            isActive
                                                ? 'bg-white text-amber-700 shadow-sm border border-amber-200/50'
                                                : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                                        }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-stone-400'}`} />
                                        {tab.label}
                                        {['amplop', 'ayat', 'musik', 'pengaturan'].includes(tab.id) && (
                                            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-500">
                                                🔒 Soon
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Tab Content */}
                        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-5">

                            {/* INFO DASAR */}
                            {activeTab === 'infodasar' && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-stone-800">Informasi Dasar</h2>
                                        <p className="text-sm text-stone-500 mt-1">Nama panggilan dan status halaman publik.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-stone-700 block">Panggilan Pria</label>
                                            <Input value={formData.groom_name} onChange={e => handleChange('groom_name', e.target.value)} placeholder="Contoh: Budi" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-stone-700 block">Panggilan Wanita</label>
                                            <Input value={formData.bride_name} onChange={e => handleChange('bride_name', e.target.value)} placeholder="Contoh: Ayu" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Select label="Status Undangan" id="status" value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                                            <option value="unpaid">Belum Aktif (Draft)</option>
                                            <option value="active">Aktif (Publik)</option>
                                            <option value="expired">Kedaluwarsa</option>
                                        </Select>
                                        <p className="text-xs text-stone-500">Ubah ke Aktif agar tamu bisa melihat undangan.</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-stone-700 block">URL Undangan Publik</label>
                                        <div className="flex items-center gap-2">
                                            <Input value={`undang.io/invite/${formData.slug}`} readOnly className="bg-stone-50 text-stone-500 text-sm" />
                                            <Button variant="secondary" size="sm" title="Salin Link" onClick={() => navigator.clipboard.writeText(`https://undang.io/invite/${formData.slug}`)}>
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FOTO & COVER */}
                            {activeTab === 'fotocover' && (
                                <div className="space-y-5 animate-in fade-in">
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-stone-800">Foto & Cover</h2>
                                        <p className="text-sm text-stone-500 mt-1">Upload foto utama pasangan.</p>
                                    </div>
                                    {formData.couple_photo_url && (
                                        <div className="relative w-full rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                                            <Image src={formData.couple_photo_url} alt="Foto pasangan" width={480} height={280}
                                                className="w-full object-cover max-h-52"
                                                unoptimized={formData.couple_photo_url.startsWith('http://localhost') || formData.couple_photo_url.startsWith('/uploads')} />
                                            <button onClick={() => handleChange('couple_photo_url', '')}
                                                className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                    <div
                                        onClick={() => !isUploading && fileInputRef.current?.click()}
                                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                                            isUploading ? 'border-amber-300 bg-amber-50 cursor-wait' : 'border-stone-300 hover:border-amber-400 hover:bg-amber-50/40'
                                        }`}
                                    >
                                        {isUploading
                                            ? <><Loader2 className="w-7 h-7 text-amber-500 animate-spin" /><p className="text-sm text-amber-700">Mengupload...</p></>
                                            : <><Upload className="w-7 h-7 text-stone-400" /><p className="text-sm font-medium text-stone-700">{formData.couple_photo_url ? 'Ganti foto' : 'Upload foto pasangan'}</p><p className="text-xs text-stone-400">JPG, PNG, WebP — maks. 5MB</p></>}
                                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverUpload} disabled={isUploading} />
                                    </div>
                                </div>
                            )}

                            {/* DATA MEMPELAI */}
                            {activeTab === 'mempelai' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-stone-800">Data Mempelai</h2>
                                        <p className="text-sm text-stone-500 mt-1">Nama lengkap dan nama orang tua.</p>
                                    </div>
                                    <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
                                        <h3 className="font-semibold text-stone-700 text-sm flex items-center gap-2"><span className="w-2 h-2 bg-amber-400 rounded-full inline-block" />Pria</h3>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Nama Lengkap</label><Input value={formData.groom_full_name} onChange={e => handleChange('groom_full_name', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Nama Ayah</label><Input value={formData.groom_father} onChange={e => handleChange('groom_father', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Nama Ibu</label><Input value={formData.groom_mother} onChange={e => handleChange('groom_mother', e.target.value)} /></div>
                                    </div>
                                    <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-100">
                                        <h3 className="font-semibold text-stone-700 text-sm flex items-center gap-2"><span className="w-2 h-2 bg-rose-400 rounded-full inline-block" />Wanita</h3>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Nama Lengkap</label><Input value={formData.bride_full_name} onChange={e => handleChange('bride_full_name', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Nama Ayah</label><Input value={formData.bride_father} onChange={e => handleChange('bride_father', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Nama Ibu</label><Input value={formData.bride_mother} onChange={e => handleChange('bride_mother', e.target.value)} /></div>
                                    </div>
                                </div>
                            )}

                            {/* ACARA */}
                            {activeTab === 'acara' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <div>
                                        <h2 className="text-xl font-serif font-bold text-stone-800">Detail Acara</h2>
                                        <p className="text-sm text-stone-500 mt-1">Waktu dan lokasi akad serta resepsi.</p>
                                    </div>
                                    <div className="space-y-3 p-4 border border-stone-200 rounded-xl">
                                        <h3 className="font-semibold text-stone-800 text-sm border-b pb-2">Akad Nikah</h3>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Waktu</label><Input type="datetime-local" value={formData.akad_date} onChange={e => handleChange('akad_date', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Nama Tempat</label><Input value={formData.akad_venue} onChange={e => handleChange('akad_venue', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Alamat</label><textarea className="flex w-full rounded-md border text-sm bg-white px-3 py-2 border-stone-300 min-h-[80px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500" value={formData.akad_address} onChange={e => handleChange('akad_address', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Link Google Maps</label><Input placeholder="https://maps.app.goo.gl/..." value={formData.akad_maps} onChange={e => handleChange('akad_maps', e.target.value)} /></div>
                                    </div>
                                    <div className="space-y-3 p-4 border border-stone-200 rounded-xl">
                                        <h3 className="font-semibold text-stone-800 text-sm border-b pb-2">Resepsi</h3>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Waktu</label><Input type="datetime-local" value={formData.reception_date} onChange={e => handleChange('reception_date', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Nama Tempat</label><Input value={formData.reception_venue} onChange={e => handleChange('reception_venue', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Alamat</label><textarea className="flex w-full rounded-md border text-sm bg-white px-3 py-2 border-stone-300 min-h-[80px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500" value={formData.reception_address} onChange={e => handleChange('reception_address', e.target.value)} /></div>
                                        <div className="space-y-1.5"><label className="text-sm font-medium text-stone-700 block">Link Google Maps</label><Input placeholder="https://maps.app.goo.gl/..." value={formData.reception_maps} onChange={e => handleChange('reception_maps', e.target.value)} /></div>
                                    </div>
                                </div>
                            )}

                            {/* PLACEHOLDER TABS */}
                            {['lovestory', 'galeri', 'amplop', 'ayat', 'musik', 'pengaturan'].includes(activeTab) && (
                                <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in">
                                    <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-400">
                                        {activeTab === 'lovestory' && <Heart className="w-7 h-7" />}
                                        {activeTab === 'galeri' && <Camera className="w-7 h-7" />}
                                        {activeTab === 'amplop' && <Gift className="w-7 h-7" />}
                                        {activeTab === 'ayat' && <Type className="w-7 h-7" />}
                                        {activeTab === 'musik' && <Music className="w-7 h-7" />}
                                        {activeTab === 'pengaturan' && <Settings className="w-7 h-7" />}
                                    </div>
                                    <h2 className="text-lg font-serif font-bold text-stone-800 mb-2">Segera Hadir</h2>
                                    <p className="text-stone-500 text-sm max-w-xs">Fitur ini sedang dibangun dan akan segera tersedia.</p>
                                </div>
                            )}

                            <div className="mt-6 pt-5 border-t border-stone-100 flex justify-end">
                                <Button onClick={handleSaveAll} disabled={isSaving} className="bg-stone-900 text-white hover:bg-stone-800">
                                    {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : 'Simpan Tab Ini'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Live Preview (hidden on mobile, toggle-able) */}
                {showPreview && (
                    <div className="hidden md:flex flex-col flex-1 overflow-hidden border-l border-stone-200 bg-stone-100">
                        {/* Preview header bar */}
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

                        {/* Scaled invitation preview */}
                        <div className="flex-1 overflow-y-auto">
                            <div
                                className="origin-top-left"
                                style={{
                                    transform: 'scale(0.6)',
                                    width: '166.67%',
                                    transformOrigin: 'top left',
                                }}
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
