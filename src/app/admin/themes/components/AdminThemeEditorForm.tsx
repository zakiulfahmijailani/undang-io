"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Upload, Trash2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import {
    ThemeColors, ThemeTypography, ThemeAnimationSettings, ThemeStyleSettings,
    CulturalCategory, ThemeStatus, CULTURAL_LABELS,
    HeroAnimation, AnimationIntensity, BorderRadiusStyle, ShadowStyle
} from '@/types/theme';
import { THEME_SLOT_DEFINITIONS, REQUIRED_SLOTS_FOR_ACTIVATION } from '@/data/themeSlots';
import { dummyThemes } from '@/data/dummyThemes';

const fontOptions = ['Great Vibes', 'Dancing Script', 'Cormorant Garamond', 'Source Sans Pro', 'Source Serif Pro', 'Playfair Display', 'Lora', 'Montserrat'];

const emptyColors: ThemeColors = { primary: '38 70% 45%', secondary: '20 30% 30%', accent: '45 80% 60%', surface: '40 20% 95%', textPrimary: '20 30% 15%', textSecondary: '20 15% 40%' };
const emptyTypo: ThemeTypography = { headingFont: 'Great Vibes', bodyFont: 'Cormorant Garamond' };
const emptyAnim: ThemeAnimationSettings = { heroAnimation: 'none', intensity: 'medium', parallax: true, scrollReveal: true, musicAutoplay: true, videoIntro: false };
const emptyStyle: ThemeStyleSettings = { borderRadius: 'soft', shadow: 'soft' };

const tabs = [
    { key: 'info', label: 'Info Dasar' },
    { key: 'visual', label: 'Identitas Visual' },
    { key: 'animation', label: 'Animasi' },
    { key: 'media', label: 'Media' },
    { key: 'slots', label: 'Slot Gambar' },
];

export default function AdminThemeEditorForm() {
    const params = useParams();
    const router = useRouter();
    const supabase = createBrowserSupabaseClient();
    const themeId = params?.themeId as string | undefined;
    const isNew = !themeId;

    const existingTheme = !isNew ? dummyThemes.find((t) => t.id === themeId) : undefined;

    const [activeTab, setActiveTab] = useState('info');
    const [name, setName] = useState(existingTheme?.name || '');
    const [slug, setSlug] = useState(existingTheme?.slug || '');
    const [description, setDescription] = useState(existingTheme?.description || '');
    const [category, setCategory] = useState<CulturalCategory>(existingTheme?.culturalCategory || 'modern');
    const [status, setStatus] = useState<ThemeStatus>(existingTheme?.status || 'draft');
    const [colors, setColors] = useState<ThemeColors>(existingTheme?.colors || emptyColors);
    const [typography, setTypography] = useState<ThemeTypography>(existingTheme?.typography || emptyTypo);
    const [animSettings, setAnimSettings] = useState<ThemeAnimationSettings>(existingTheme?.animationSettings || emptyAnim);
    const [styleSettings, setStyleSettings] = useState<ThemeStyleSettings>(existingTheme?.styleSettings || emptyStyle);
    const [slotFiles, setSlotFiles] = useState<Record<string, string>>(
        () => {
            const map: Record<string, string> = {};
            existingTheme?.assetSlots.forEach((s) => { if (s.assetUrl) map[s.slotKey] = s.assetUrl; });
            return map;
        }
    );
    // Pending File objects — staged locally, uploaded to Storage on save
    const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
    const [saving, setSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [missingSlots, setMissingSlots] = useState<string[]>([]);

    const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const handleNameChange = (v: string) => {
        setName(v);
        if (isNew) setSlug(autoSlug(v));
    };

    // Stage file locally — actual upload happens on save
    const handleSlotUpload = (slotKey: string, file: File) => {
        const previewUrl = URL.createObjectURL(file);
        setSlotFiles((prev) => ({ ...prev, [slotKey]: previewUrl }));
        setPendingFiles((prev) => ({ ...prev, [slotKey]: file }));
        // Clear missing marker for this slot immediately
        setMissingSlots((prev) => prev.filter((k) => k !== slotKey));
        setErrorMsg(null);
    };

    const handleSlotRemove = (slotKey: string) => {
        setSlotFiles((prev) => { const n = { ...prev }; delete n[slotKey]; return n; });
        setPendingFiles((prev) => { const n = { ...prev }; delete n[slotKey]; return n; });
    };

    // Upload all pending files to Supabase Storage, return map of slotKey -> publicUrl
    const uploadPendingFiles = async (resolvedThemeId: string): Promise<Record<string, string>> => {
        if (!supabase) throw new Error('Supabase client tidak tersedia. Periksa environment variables.');
        const uploadedUrls: Record<string, string> = { ...slotFiles };

        for (const [slotKey, file] of Object.entries(pendingFiles)) {
            const ext = file.name.split('.').pop() ?? 'jpg';
            const path = `themes/${resolvedThemeId}/${slotKey}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('theme-assets')
                .upload(path, file, { upsert: true, contentType: file.type });

            if (uploadError) {
                throw new Error(`Gagal upload ${slotKey}: ${uploadError.message}`);
            }

            const { data: publicData } = supabase.storage
                .from('theme-assets')
                .getPublicUrl(path);

            uploadedUrls[slotKey] = publicData.publicUrl;
        }

        return uploadedUrls;
    };

    const handleSave = async (activate: boolean) => {
        setErrorMsg(null);
        setMissingSlots([]);

        if (!supabase) {
            setErrorMsg('Supabase client tidak tersedia. Periksa environment variables.');
            return;
        }

        // --- Validation ---
        if (!name.trim()) {
            setErrorMsg('Nama tema tidak boleh kosong.');
            setActiveTab('info');
            return;
        }
        if (!slug.trim()) {
            setErrorMsg('Slug tema tidak boleh kosong.');
            setActiveTab('info');
            return;
        }

        if (activate) {
            const missing = REQUIRED_SLOTS_FOR_ACTIVATION.filter((k) => !slotFiles[k]);
            if (missing.length > 0) {
                setMissingSlots(missing);
                setActiveTab('slots');
                const missingLabels = missing.map((k) => {
                    const def = THEME_SLOT_DEFINITIONS.find((d) => d.slotKey === k);
                    return def?.slotLabel ?? k;
                });
                setErrorMsg(`Slot wajib belum diisi: ${missingLabels.join(', ')}`);
                return;
            }
        }

        setSaving(true);

        try {
            const finalStatus: ThemeStatus = activate ? 'active' : 'draft';
            let resolvedThemeId = themeId ?? '';

            if (isNew) {
                // INSERT new theme row
                const { data: inserted, error: insertError } = await supabase
                    .from('classic_themes')
                    .insert({
                        name: name.trim(),
                        slug: slug.trim(),
                        description: description.trim(),
                        cultural_category: category,
                        status: finalStatus,
                        colors,
                        typography,
                        animation_settings: animSettings,
                        style_settings: styleSettings,
                        asset_slots: [],
                    })
                    .select('id')
                    .single();

                if (insertError) throw new Error(`Gagal menyimpan tema: ${insertError.message}`);
                resolvedThemeId = inserted.id as string;
            } else {
                // UPDATE existing theme row
                const { error: updateError } = await supabase
                    .from('classic_themes')
                    .update({
                        name: name.trim(),
                        slug: slug.trim(),
                        description: description.trim(),
                        cultural_category: category,
                        status: finalStatus,
                        colors,
                        typography,
                        animation_settings: animSettings,
                        style_settings: styleSettings,
                    })
                    .eq('id', resolvedThemeId);

                if (updateError) throw new Error(`Gagal memperbarui tema: ${updateError.message}`);
            }

            // Upload pending slot files to Supabase Storage
            const uploadedUrls = await uploadPendingFiles(resolvedThemeId);

            // Build asset_slots JSONB payload
            const assetSlotsPayload = THEME_SLOT_DEFINITIONS.map((def) => ({
                slotKey: def.slotKey,
                slotLabel: def.slotLabel,
                assetUrl: uploadedUrls[def.slotKey] ?? null,
            }));

            // Persist asset_slots to DB
            const { error: slotsError } = await supabase
                .from('classic_themes')
                .update({ asset_slots: assetSlotsPayload })
                .eq('id', resolvedThemeId);

            if (slotsError) throw new Error(`Gagal menyimpan slot aset: ${slotsError.message}`);

            // Done — navigate back to themes list
            router.push('/admin/themes');
            router.refresh();

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak terduga.';
            setErrorMsg(message);
        } finally {
            setSaving(false);
        }
    };

    const inputCls = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14213D]/30";
    const selectCls = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14213D]/30 bg-white";
    const labelCls = "text-sm font-medium text-gray-700 mb-1 block";

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => router.push('/admin/themes')}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                    </Button>
                    <h1 className="text-xl font-bold text-[#14213D]">{isNew ? 'Buat Tema Baru' : `Edit Tema — ${name}`}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleSave(false)} disabled={saving}>
                        <Save className="w-4 h-4 mr-1" /> {saving ? 'Menyimpan...' : 'Simpan Draft'}
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving} className="bg-[#14213D] hover:bg-[#1a2b50] text-white">
                        <Check className="w-4 h-4 mr-1" /> {saving ? 'Menyimpan...' : 'Simpan & Aktifkan'}
                    </Button>
                </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
                            activeTab === tab.key
                                ? 'border-[#14213D] text-[#14213D]'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'info' && (
                <div className="space-y-4">
                    <div><label className={labelCls}>Nama Tema</label><input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="contoh: Jawa Klasik" className={inputCls} /></div>
                    <div><label className={labelCls}>Slug</label><input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="jawa-klasik" className={inputCls} /></div>
                    <div><label className={labelCls}>Deskripsi</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls + " resize-none"} /></div>
                    <div>
                        <label className={labelCls}>Kategori Budaya</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value as CulturalCategory)} className={selectCls}>
                            {Object.entries(CULTURAL_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value as ThemeStatus)} className={selectCls}>
                            <option value="draft">Draft</option>
                            <option value="active">Aktif</option>
                            <option value="archived">Diarsipkan</option>
                        </select>
                    </div>
                </div>
            )}

            {activeTab === 'visual' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-[#14213D] mb-3">Palet Warna (HSL)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {(Object.entries(colors) as [keyof ThemeColors, string][]).map(([key, val]) => (
                                <div key={key}>
                                    <label className="text-xs text-gray-600 mb-1 block capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                                    <input value={val} onChange={(e) => setColors((p) => ({ ...p, [key]: e.target.value }))} placeholder="H S% L%" className={inputCls} />
                                    <div className="w-full h-6 rounded mt-1 border" style={{ background: `hsl(${val})` }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#14213D] mb-3">Tipografi</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Font Judul</label>
                                <select value={typography.headingFont} onChange={(e) => setTypography((p) => ({ ...p, headingFont: e.target.value }))} className={selectCls}>
                                    {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                                </select>
                                <p className="text-2xl mt-2" style={{ fontFamily: `'${typography.headingFont}', cursive` }}>Preview Judul</p>
                            </div>
                            <div>
                                <label className={labelCls}>Font Body</label>
                                <select value={typography.bodyFont} onChange={(e) => setTypography((p) => ({ ...p, bodyFont: e.target.value }))} className={selectCls}>
                                    {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                                </select>
                                <p className="text-base mt-2" style={{ fontFamily: `'${typography.bodyFont}', serif` }}>Preview teks body</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[#14213D] mb-3">Gaya</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Border Radius</label>
                                <select value={styleSettings.borderRadius} onChange={(e) => setStyleSettings((p) => ({ ...p, borderRadius: e.target.value as BorderRadiusStyle }))} className={selectCls}>
                                    <option value="soft">Soft</option>
                                    <option value="medium">Medium</option>
                                    <option value="ornate">Ornate</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Shadow</label>
                                <select value={styleSettings.shadow} onChange={(e) => setStyleSettings((p) => ({ ...p, shadow: e.target.value as ShadowStyle }))} className={selectCls}>
                                    <option value="none">Tidak Ada</option>
                                    <option value="soft">Halus</option>
                                    <option value="medium">Sedang</option>
                                    <option value="dramatic">Dramatis</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'animation' && (
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Animasi Hero</label>
                        <select value={animSettings.heroAnimation} onChange={(e) => setAnimSettings((p) => ({ ...p, heroAnimation: e.target.value as HeroAnimation }))} className={selectCls}>
                            <option value="none">Tidak Ada</option>
                            <option value="confetti">Confetti</option>
                            <option value="petals">Kelopak Bunga</option>
                            <option value="sparkles">Sparkles</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Intensitas Animasi</label>
                        <select value={animSettings.intensity} onChange={(e) => setAnimSettings((p) => ({ ...p, intensity: e.target.value as AnimationIntensity }))} className={selectCls}>
                            <option value="low">Rendah</option>
                            <option value="medium">Sedang</option>
                            <option value="high">Tinggi</option>
                        </select>
                    </div>
                    <div className="space-y-3 mt-4">
                        {([
                            ['parallax', 'Efek Parallax'],
                            ['scrollReveal', 'Scroll Reveal'],
                            ['musicAutoplay', 'Musik Autoplay Setelah Buka'],
                            ['videoIntro', 'Video Intro Hero'],
                        ] as const).map(([key, label]) => (
                            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100">
                                <label className="text-sm text-gray-700">{label}</label>
                                <button
                                    onClick={() => setAnimSettings((p) => ({ ...p, [key]: !p[key] }))}
                                    className={`w-10 h-6 rounded-full transition-colors relative ${animSettings[key] ? 'bg-[#14213D]' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${animSettings[key] ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'media' && (
                <div className="space-y-4">
                    <div>
                        <label className={labelCls}>Musik Default (maks 2 menit)</label>
                        <input type="file" accept="audio/*" className={inputCls + " py-1.5"} />
                    </div>
                    <div>
                        <label className={labelCls}>Video Intro Opsional (maks 1 menit)</label>
                        <input type="file" accept="video/*" className={inputCls + " py-1.5"} />
                    </div>
                </div>
            )}

            {activeTab === 'slots' && (
                <div className="space-y-6">
                    {THEME_SLOT_DEFINITIONS.map((slot) => {
                        const isRequired = REQUIRED_SLOTS_FOR_ACTIVATION.includes(slot.slotKey);
                        const isMissing = missingSlots.includes(slot.slotKey);
                        const currentUrl = slotFiles[slot.slotKey];
                        return (
                            <div
                                key={slot.slotKey}
                                className={`rounded-xl border bg-white p-4 transition-colors ${isMissing ? 'border-red-400 bg-red-50' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-[#14213D] text-sm">{slot.slotLabel}</h4>
                                            {isRequired && <Badge variant="destructive" className="text-[10px]">Wajib</Badge>}
                                            {currentUrl && <Badge className="text-[10px] bg-green-100 text-green-700">Terisi</Badge>}
                                            {isMissing && <Badge className="text-[10px] bg-red-100 text-red-700">Belum diisi</Badge>}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">{slot.slotDescription}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 shrink-0">{slot.widthCm}×{slot.heightCm} cm · {slot.aspectRatio}</span>
                                </div>

                                {currentUrl ? (
                                    <div className="flex items-end gap-3">
                                        <img src={currentUrl} alt={slot.slotLabel} className="h-24 rounded-lg border object-cover" />
                                        <div className="flex gap-2">
                                            <label className="cursor-pointer">
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleSlotUpload(slot.slotKey, e.target.files[0]); }} />
                                                <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 transition-colors">
                                                    <Upload className="w-3 h-3" /> Ganti
                                                </span>
                                            </label>
                                            <Button variant="secondary" size="sm" onClick={() => handleSlotRemove(slot.slotKey)} className="text-red-600 hover:text-red-700">
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer block">
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleSlotUpload(slot.slotKey, e.target.files[0]); }} />
                                        <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-[#14213D]/30 transition-colors ${isMissing ? 'border-red-400' : 'border-gray-200'}`}>
                                            <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                                            <p className="text-xs text-gray-500">Klik untuk upload • {slot.aspectRatio} • {slot.assetType === 'png_transparent' ? 'PNG transparan' : 'JPG/PNG'}</p>
                                        </div>
                                    </label>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
