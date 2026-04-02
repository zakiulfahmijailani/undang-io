"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    ThemeColors, ThemeTypography, ThemeAnimationSettings, ThemeStyleSettings,
    CulturalCategory, ThemeStatus, CULTURAL_LABELS,
    HeroAnimation, AnimationIntensity, BorderRadiusStyle, ShadowStyle
} from '@/types/theme';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const fontOptions = ['Great Vibes', 'Dancing Script', 'Cormorant Garamond', 'Source Sans Pro', 'Source Serif Pro', 'Playfair Display', 'Lora', 'Montserrat'];

const emptyColors: ThemeColors = { primary: '38 70% 45%', secondary: '20 30% 30%', accent: '45 80% 60%', surface: '40 20% 95%', textPrimary: '20 30% 15%', textSecondary: '20 15% 40%' };
const emptyTypo: ThemeTypography = { headingFont: 'Great Vibes', bodyFont: 'Cormorant Garamond' };
const emptyAnim: ThemeAnimationSettings = { heroAnimation: 'none', intensity: 'medium', parallax: true, scrollReveal: true, musicAutoplay: true, videoIntro: false };
const emptyStyle: ThemeStyleSettings = { borderRadius: 'soft', shadow: 'soft' };

const tabs = [
    { key: 'info', label: 'Info Dasar' },
    { key: 'visual', label: 'Identitas Visual' },
    { key: 'animation', label: 'Animasi' },
];

export default function AdminThemeEditorForm() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    
    // Support both /admin/themes/[themeId]/edit and /admin/themes/new?edit=[id]
    const editId = (params?.themeId as string) || searchParams.get('edit');
    const isNew = !editId || params?.themeId === 'new';

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');
    
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<CulturalCategory>('modern');
    const [status, setStatus] = useState<ThemeStatus>('draft');
    const [colors, setColors] = useState<ThemeColors>(emptyColors);
    const [typography, setTypography] = useState<ThemeTypography>(emptyTypo);
    const [animSettings, setAnimSettings] = useState<ThemeAnimationSettings>(emptyAnim);
    const [styleSettings, setStyleSettings] = useState<ThemeStyleSettings>(emptyStyle);
    
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchTheme = async () => {
            if (isNew) {
                setLoading(false);
                return;
            }
            const supabase = createBrowserSupabaseClient();
            const { data, error } = await supabase.from('themes').select('*').eq('id', editId).single();
            if (error || !data) {
                // If not found by ID, try slug
                const { data: dataBySlug, error: errorBySlug } = await supabase.from('themes').select('*').eq('slug', editId).single();
                if (errorBySlug || !dataBySlug) {
                    alert('Tema tidak ditemukan');
                    router.push('/admin/themes');
                    return;
                }
                fillForm(dataBySlug);
            } else {
                fillForm(data);
            }
            setLoading(false);
        };

        const fillForm = (data: any) => {
            setName(data.name || '');
            setSlug(data.slug || '');
            setDescription(data.description || '');
            setCategory((data.cultural_category as CulturalCategory) || 'modern');
            setStatus((data.status as ThemeStatus) || 'draft');
            if (data.colors) setColors(data.colors as any);
            if (data.typography) setTypography(data.typography as any);
            if (data.animation_settings) setAnimSettings(data.animation_settings as any);
            if (data.config?.styleSettings) setStyleSettings(data.config.styleSettings);
        };

        fetchTheme();
    }, [editId, isNew, router]);

    const autoSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    const handleNameChange = (v: string) => {
        setName(v);
        if (isNew) setSlug(autoSlug(v));
    };

    const handleSave = async (activate: boolean) => {
        if (!name.trim() || !slug.trim()) {
            alert('Nama dan slug wajib diisi');
            return;
        }
        setSaving(true);
        
        const supabase = createBrowserSupabaseClient();
        const payload = {
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            cultural_category: category,
            status: activate ? 'active' : status,
            is_active: activate || status === 'active',
            is_published: activate || status === 'active',
            colors,
            typography,
            animation_settings: animSettings,
            config: { styleSettings }
        };

        let err;
        if (isNew) {
            const { error } = await supabase.from('themes').insert([payload]);
            err = error;
        } else {
            const { error } = await supabase.from('themes').update(payload).eq('id', editId);
            err = error;
        }

        setSaving(false);
        if (err) {
            alert('Gagal menyimpan tema: ' + err.message);
        } else {
            router.push('/admin/themes');
            router.refresh();
        }
    };

    const inputCls = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14213D]/30";
    const selectCls = "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14213D]/30 bg-white";
    const labelCls = "text-sm font-medium text-gray-700 mb-1 block";

    if (loading) {
        return (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10 min-h-[50vh] justify-center items-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-[#14213d] rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-500">Memuat konfigurasi...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm" onClick={() => router.push('/admin/themes')}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                    </Button>
                    <h1 className="text-xl font-bold text-[#14213D]">{isNew ? 'Buat Tema Baru' : `Config Tema — ${name}`}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => handleSave(false)} disabled={saving}>
                        <Save className="w-4 h-4 mr-1" /> {saving ? 'Menyimpan...' : 'Simpan Draft'}
                    </Button>
                    <Button onClick={() => handleSave(true)} disabled={saving} className="bg-[#14213D] hover:bg-[#1a2b50] text-white">
                        <Check className="w-4 h-4 mr-1" /> Simpan & Aktifkan
                    </Button>
                </div>
            </div>

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
                                    onClick={() => setAnimSettings((p) => ({ ...p, [key]: !p[key as keyof ThemeAnimationSettings] }))}
                                    className={`w-10 h-6 rounded-full transition-colors relative ${animSettings[key as keyof ThemeAnimationSettings] ? 'bg-[#14213D]' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${animSettings[key as keyof ThemeAnimationSettings] ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
