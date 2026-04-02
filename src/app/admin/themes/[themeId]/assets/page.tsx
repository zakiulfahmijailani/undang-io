"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { THEME_SLOT_DEFINITIONS, REQUIRED_SLOTS_FOR_ACTIVATION } from '@/data/themeSlots';
import { Theme } from '@/types/theme';

export default function ThemeAssetsPage() {
    const params = useParams();
    const router = useRouter();
    const themeId = params.themeId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [slots, setSlots] = useState<Record<string, string>>({}); // slotKey -> asset_url
    const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createBrowserSupabaseClient();
            
            // 1. Fetch theme metadata
            const { data: themeData } = await supabase.from('themes').select('*').eq('id', themeId).single();
            if (!themeData) {
                alert('Tema tidak ditemukan');
                router.push('/admin/themes');
                return;
            }
            setTheme(themeData as any);

            // 2. Fetch slots from DB
            const { data: slotsData } = await supabase.from('theme_asset_slots').select('slot_key, asset_url').eq('theme_id', themeId);
            const slotMap: Record<string, string> = {};
            slotsData?.forEach(s => {
                if (s.asset_url) slotMap[s.slot_key] = s.asset_url;
            });

            // 3. (Optional) In a more complex system, we'd also show mapped global `theme_assets`.
            // For now, only show the explicit overrides in C.

            setSlots(slotMap);
            setIsLoading(false);
        };
        fetchData();
    }, [themeId, router]);

    const handleUpload = async (slotKey: string, file: File) => {
        setIsUploading(prev => ({ ...prev, [slotKey]: true }));
        try {
            const supabase = createBrowserSupabaseClient();
            
            // 1. Upload to Supabase Storage
            const ext = file.name.split('.').pop();
            const filename = `themes/${themeId}/${slotKey}_${Date.now()}.${ext}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('theme-assets')
                .upload(filename, file, { cacheControl: '3600', upsert: true });

            if (uploadError || !uploadData) throw new Error(uploadError?.message || 'Gagal upload');

            const { data: { publicUrl } } = supabase.storage.from('theme-assets').getPublicUrl(filename);

            // 2. Upsert into theme_asset_slots
            const { error: dbError } = await supabase.from('theme_asset_slots').upsert({
                theme_id: themeId,
                slot_key: slotKey,
                slot_label: THEME_SLOT_DEFINITIONS.find(d => d.slotKey === slotKey)?.slotLabel || slotKey,
                asset_url: publicUrl,
                asset_type: THEME_SLOT_DEFINITIONS.find(d => d.slotKey === slotKey)?.assetType || 'image',
                display_order: THEME_SLOT_DEFINITIONS.findIndex(d => d.slotKey === slotKey),
                is_active: true,
                is_required: REQUIRED_SLOTS_FOR_ACTIVATION.includes(slotKey),
            }, { onConflict: 'theme_id, slot_key' });

            if (dbError) throw new Error(dbError.message);

            // 3. Update local state
            setSlots(prev => ({ ...prev, [slotKey]: publicUrl }));
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsUploading(prev => ({ ...prev, [slotKey]: false }));
        }
    };

    const handleRemove = async (slotKey: string) => {
        if (!confirm('Yakin ingin menghapus aset ini?')) return;
        setIsUploading(prev => ({ ...prev, [slotKey]: true }));
        try {
            const supabase = createBrowserSupabaseClient();
            // Delete from DB (which makes it fallback to null/global)
            const { error } = await supabase.from('theme_asset_slots')
                .delete()
                .eq('theme_id', themeId)
                .eq('slot_key', slotKey);
            if (error) throw new Error(error.message);
            
            setSlots(prev => {
                const updated = { ...prev };
                delete updated[slotKey];
                return updated;
            });
        } catch (e: any) {
            alert(e.message);
        } finally {
            setIsUploading(prev => ({ ...prev, [slotKey]: false }));
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10 min-h-[50vh] justify-center items-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-[#14213d] rounded-full animate-spin mb-4" />
                <p className="text-sm font-medium text-gray-500">Memuat slot aset...</p>
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
                    <div>
                        <h1 className="text-xl font-bold text-[#14213D]">Edit Aset: {theme?.name}</h1>
                        <p className="text-xs text-gray-500 mt-1">Upload aset spesifik untuk override tema global</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="default" onClick={() => router.push(`/admin/themes/${themeId}/preview`)} className="bg-[#14213D] hover:bg-[#1a2b50] text-white">
                        Lihat Preview Parallax
                    </Button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex gap-3 text-sm text-blue-800">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p>
                    <strong>Info Sistem Aset (MasterInvitationRenderer)</strong>: Aset yang diupload di sini akan disimpan ke tabel <code>theme_asset_slots</code> dan meng-override aset global (jika ada).
                </p>
            </div>

            <div className="space-y-6">
                {THEME_SLOT_DEFINITIONS.map((slot) => {
                    const isRequired = REQUIRED_SLOTS_FOR_ACTIVATION.includes(slot.slotKey);
                    const currentUrl = slots[slot.slotKey];
                    const loading = isUploading[slot.slotKey];

                    return (
                        <div key={slot.slotKey} className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-[#14213D] text-sm">{slot.slotLabel}</h4>
                                        {isRequired && <Badge variant="destructive" className="text-[10px]">Wajib</Badge>}
                                        {currentUrl && <Badge className="text-[10px] bg-green-100 text-green-700">Terisi</Badge>}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{slot.slotDescription}</p>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0 bg-gray-100 px-2 py-1 rounded">
                                    {slot.widthCm}×{slot.heightCm} cm · {slot.aspectRatio}
                                </span>
                            </div>

                            {currentUrl ? (
                                <div className="flex items-end gap-3 mt-4">
                                    <div className="relative h-24 rounded-lg overflow-hidden border bg-gray-50">
                                        <img src={currentUrl} alt={slot.slotLabel} className="h-full object-cover" />
                                    </div>
                                    <div className="flex gap-2">
                                        <label className={`cursor-pointer ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleUpload(slot.slotKey, e.target.files[0]); }} />
                                            <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border bg-white hover:bg-gray-50 transition-colors">
                                                <Upload className="w-3 h-3" /> {loading ? 'Mengunggah...' : 'Ganti Override'}
                                            </span>
                                        </label>
                                        <Button variant="secondary" size="sm" onClick={() => handleRemove(slot.slotKey)} disabled={loading} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <label className={`cursor-pointer block mt-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleUpload(slot.slotKey, e.target.files[0]); }} />
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#14213D]/30 hover:bg-[#14213D]/5 transition-colors group">
                                        <Upload className="w-6 h-6 mx-auto text-gray-400 group-hover:text-[#14213D] mb-2 transition-colors" />
                                        <p className="text-sm font-medium text-gray-600 group-hover:text-[#14213D] transition-colors">{loading ? 'Mengunggah...' : 'Pilih file untuk diupload'}</p>
                                        <p className="text-xs text-gray-400 mt-1">{slot.aspectRatio} format • {slot.assetType === 'png_transparent' ? 'PNG transparan' : 'JPG/PNG'}</p>
                                    </div>
                                </label>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
