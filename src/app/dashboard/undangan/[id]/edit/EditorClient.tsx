"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, LayoutDashboard, Copy, Upload, Loader2, X, Info, Type, Image as ImageIcon, Heart, Users, MapPin, Music, Settings, Camera, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface EditorClientProps {
    initialData: any;
}

export default function EditorClient({ initialData }: EditorClientProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("infodasar");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        status: initialData.status,
        slug: initialData.slug,
        // Use flat columns from invitations table
        groom_name: initialData.groom_nickname || initialData.invitation_details?.groom_name || "",
        bride_name: initialData.bride_nickname || initialData.invitation_details?.bride_name || "",
        couple_photo_url: initialData.couple_photo_url || initialData.invitation_details?.couple_photo_url || "",

        groom_full_name: initialData.groom_full_name || initialData.invitation_details?.groom_full_name || "",
        groom_father: initialData.groom_father_name || initialData.invitation_details?.groom_father || "",
        groom_mother: initialData.groom_mother_name || initialData.invitation_details?.groom_mother || "",
        bride_full_name: initialData.bride_full_name || initialData.invitation_details?.bride_full_name || "",
        bride_father: initialData.bride_father_name || initialData.invitation_details?.bride_father || "",
        bride_mother: initialData.bride_mother_name || initialData.invitation_details?.bride_mother || "",

        akad_date: initialData.akad_datetime || initialData.invitation_details?.akad_date || "",
        akad_venue: initialData.akad_location_name || initialData.invitation_details?.akad_venue || "",
        akad_address: initialData.akad_location_address || initialData.invitation_details?.akad_address || "",
        akad_maps: initialData.invitation_details?.akad_maps || "",

        reception_date: initialData.resepsi_datetime || initialData.invitation_details?.reception_date || "",
        reception_venue: initialData.resepsi_location_name || initialData.invitation_details?.reception_venue || "",
        reception_address: initialData.resepsi_location_address || initialData.invitation_details?.reception_address || "",
        reception_maps: initialData.invitation_details?.reception_maps || "",
        dresscode: initialData.invitation_details?.dresscode || "",

        greeting_text: initialData.quote_text || initialData.invitation_details?.greeting_text || "",
        music_url: initialData.invitation_details?.music_url || "",

        love_story: initialData.invitation_details?.love_story || [],
        gallery_photos: initialData.invitation_details?.gallery_photos || [],
        bank_accounts: initialData.invitation_details?.bank_accounts || [],

        enable_rsvp: initialData.invitation_details?.enable_rsvp ?? true,
    });

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/invitations/${initialData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
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

            if (!res.ok || result.error) {
                throw new Error(result.error?.message || 'Upload gagal');
            }

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
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Link href={`/dashboard/undangan/${initialData.id}`} className="text-stone-500 hover:text-gold-600 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="font-serif font-bold text-lg text-stone-800 line-clamp-1 truncate max-w-[200px] md:max-w-none">
                                Edit: {coupleName}
                            </h1>
                            <p className="text-xs text-stone-500">umuman.com/u/{formData.slug}</p>
                        </div>
                    </div>
                    <div className="flex w-full sm:w-auto items-center gap-2">
                        <Link href={`/dashboard/undangan/${initialData.id}/edit/preview`} className="flex-1 sm:flex-none">
                            <Button variant="secondary" className="w-full h-9 border-stone-200 text-stone-700 bg-white hover:bg-stone-50 hover:text-gold-600">
                                <LayoutDashboard className="w-4 h-4 mr-2" /> Preview Panel
                            </Button>
                        </Link>
                        <Button
                            onClick={handleSaveAll}
                            disabled={isSaving}
                            className="flex-1 sm:flex-none h-9 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-white shadow-md border-0"
                        >
                            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : <><Save className="w-4 h-4 mr-2" /> Simpan Semua</>}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6 p-4">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <nav className="flex md:flex-col overflow-x-auto gap-1 pb-2 md:pb-0 scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                                        isActive
                                            ? "bg-white text-gold-700 shadow-sm border border-gold-200/50"
                                            : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
                                    }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? "text-gold-500" : "text-stone-400"}`} />
                                    {tab.label}
                                    {["amplop", "ayat", "musik", "pengaturan"].includes(tab.id) && (
                                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-500">
                                            🔒 Soon
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white border border-stone-200 rounded-2xl shadow-sm min-h-[500px] p-6">

                    {/* === INFO DASAR === */}
                    {activeTab === "infodasar" && (
                        <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-stone-800">Informasi Dasar</h2>
                                <p className="text-sm text-stone-500 mt-1">Atur nama panggilan dan status halaman publik.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700 block">Mempelai Pria (Panggilan)</label>
                                    <Input value={formData.groom_name} onChange={e => handleChange("groom_name", e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-stone-700 block">Mempelai Wanita (Panggilan)</label>
                                    <Input value={formData.bride_name} onChange={e => handleChange("bride_name", e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2 w-full">
                                <Select label="Status Undangan" id="status" value={formData.status} onChange={(e) => handleChange("status", e.target.value)}>
                                    <option value="unpaid">Belum Aktif (Draft)</option>
                                    <option value="active">Aktif (Publik)</option>
                                    <option value="expired">Kedaluwarsa</option>
                                </Select>
                                <p className="text-xs text-stone-500">Ubah menjadi Aktif agar tamu dapat melihat dan merespon RSVP.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-stone-700 block">URL Undangan Publik</label>
                                <div className="flex items-center gap-2">
                                    <Input value={`umuman.com/u/${formData.slug}`} readOnly className="bg-stone-50 text-stone-500" />
                                    <Button variant="secondary" size="sm" title="Salin Link" onClick={() => navigator.clipboard.writeText(`https://umuman.com/u/${formData.slug}`)}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === FOTO & COVER === */}
                    {activeTab === "fotocover" && (
                        <div className="space-y-6 max-w-2xl animate-in fade-in">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-stone-800">Foto & Cover</h2>
                                <p className="text-sm text-stone-500 mt-1">Upload foto utama pasangan yang akan tampil di halaman undangan.</p>
                            </div>

                            {/* Preview */}
                            {formData.couple_photo_url && (
                                <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-stone-200 shadow-sm group">
                                    <Image
                                        src={formData.couple_photo_url}
                                        alt="Foto pasangan"
                                        width={480}
                                        height={320}
                                        sizes="(max-width: 768px) 100vw, 480px"
                                        className="w-full object-cover max-h-64"
                                        unoptimized={formData.couple_photo_url.startsWith('http://localhost') || formData.couple_photo_url.startsWith('/uploads')}
                                    />
                                    <button
                                        onClick={() => handleChange('couple_photo_url', '')}
                                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                        title="Hapus foto"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Upload area */}
                            <div
                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${
                                    isUploading
                                        ? 'border-amber-300 bg-amber-50 cursor-wait'
                                        : 'border-stone-300 hover:border-amber-400 hover:bg-amber-50/40'
                                }`}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                                        <p className="text-sm text-amber-700 font-medium">Mengupload ke Supabase Storage...</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-stone-400" />
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-stone-700">
                                                {formData.couple_photo_url ? 'Ganti foto' : 'Upload foto pasangan'}
                                            </p>
                                            <p className="text-xs text-stone-400 mt-1">JPG, PNG, WebP — maks. 5MB</p>
                                        </div>
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

                            <p className="text-xs text-stone-400">
                                Foto disimpan ke Supabase Storage dan langsung tersedia secara publik melalui CDN.
                                Ukuran yang disarankan: 1200×800px atau lebih.
                            </p>
                        </div>
                    )}

                    {/* === DATA MEMPELAI === */}
                    {activeTab === "mempelai" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-stone-800">Data Mempelai</h2>
                                <p className="text-sm text-stone-500 mt-1">Informasi lengkap tentang keluarga pria dan wanita.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4 p-5 bg-stone-50 rounded-xl border border-stone-100">
                                    <h3 className="font-serif font-bold text-stone-700 flex items-center gap-2"><div className="w-2 h-2 bg-gold-500 rounded-full" /> Pria</h3>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Nama Lengkap</label><Input value={formData.groom_full_name} onChange={e => handleChange("groom_full_name", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Nama Ayah</label><Input value={formData.groom_father} onChange={e => handleChange("groom_father", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Nama Ibu</label><Input value={formData.groom_mother} onChange={e => handleChange("groom_mother", e.target.value)} /></div>
                                </div>
                                <div className="space-y-4 p-5 bg-stone-50 rounded-xl border border-stone-100">
                                    <h3 className="font-serif font-bold text-stone-700 flex items-center gap-2"><div className="w-2 h-2 bg-rose-400 rounded-full" /> Wanita</h3>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Nama Lengkap</label><Input value={formData.bride_full_name} onChange={e => handleChange("bride_full_name", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Nama Ayah</label><Input value={formData.bride_father} onChange={e => handleChange("bride_father", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Nama Ibu</label><Input value={formData.bride_mother} onChange={e => handleChange("bride_mother", e.target.value)} /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === ACARA === */}
                    {activeTab === "acara" && (
                        <div className="space-y-8 animate-in fade-in">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-stone-800">Detail Acara</h2>
                                <p className="text-sm text-stone-500 mt-1">Tentukan waktu dan lokasi untuk akad serta resepsi.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4 p-5 border border-stone-200 rounded-xl">
                                    <h3 className="font-semibold text-stone-800 border-b pb-2">Akad Nikah / Pemberkatan</h3>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Waktu</label><Input type="datetime-local" value={formData.akad_date} onChange={e => handleChange("akad_date", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Nama Gedung/Tempat</label><Input value={formData.akad_venue} onChange={e => handleChange("akad_venue", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Alamat Lengkap</label><textarea className="flex w-full rounded-md border text-sm bg-white px-3 py-2 border-stone-300 min-h-[100px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500" value={formData.akad_address} onChange={e => handleChange("akad_address", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Link Google Maps</label><Input placeholder="https://maps.app.goo.gl/..." value={formData.akad_maps} onChange={e => handleChange("akad_maps", e.target.value)} /></div>
                                </div>
                                <div className="space-y-4 p-5 border border-stone-200 rounded-xl">
                                    <h3 className="font-semibold text-stone-800 border-b pb-2">Resepsi</h3>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Waktu</label><Input type="datetime-local" value={formData.reception_date} onChange={e => handleChange("reception_date", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Nama Gedung/Tempat</label><Input value={formData.reception_venue} onChange={e => handleChange("reception_venue", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Alamat Lengkap</label><textarea className="flex w-full rounded-md border text-sm bg-white px-3 py-2 border-stone-300 min-h-[100px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500" value={formData.reception_address} onChange={e => handleChange("reception_address", e.target.value)} /></div>
                                    <div className="space-y-2"><label className="text-sm font-medium text-stone-700 block">Link Google Maps</label><Input placeholder="https://maps.app.goo.gl/..." value={formData.reception_maps} onChange={e => handleChange("reception_maps", e.target.value)} /></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* === PLACEHOLDER TABS === */}
                    {["lovestory", "galeri", "amplop", "ayat", "musik", "pengaturan"].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in">
                            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-400">
                                {activeTab === "lovestory" && <Heart className="w-8 h-8" />}
                                {activeTab === "galeri" && <Camera className="w-8 h-8" />}
                                {activeTab === "amplop" && <Gift className="w-8 h-8" />}
                                {activeTab === "ayat" && <Type className="w-8 h-8" />}
                                {activeTab === "musik" && <Music className="w-8 h-8" />}
                                {activeTab === "pengaturan" && <Settings className="w-8 h-8" />}
                            </div>
                            <h2 className="text-xl font-serif font-bold text-stone-800 capitalize mb-2">Segera Hadir</h2>
                            <p className="text-stone-500 max-w-sm">Fitur ini sedang dibangun dan akan segera tersedia. Silakan gunakan tab lain untuk mengedit konten utama.</p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
                        <Button onClick={handleSaveAll} disabled={isSaving} className="bg-stone-900 text-white hover:bg-stone-800">
                            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : "Simpan Tab Ini"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
