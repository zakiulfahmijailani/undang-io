"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MasterInvitationRenderer from '@/components/invitation/MasterInvitationRenderer';
import { demoData } from '@/data/demoInvitation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Theme, ThemeAssetSlot, ThemeStatus } from '@/types/theme';
import { CATEGORY_THEME_PRESETS } from '@/data/themePresets';
import { THEME_SLOT_DEFINITIONS } from '@/data/themeSlots';

export default function AdminThemePreviewPage() {
    const params = useParams();
    const router = useRouter();
    const themeId = params.themeId as string;
    
    const [theme, setTheme] = useState<Theme | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchThemeData = async () => {
            const supabase = createBrowserSupabaseClient();
            
            // 1. Fetch theme
            const { data: themeData, error: themeError } = await supabase
                .from('themes')
                .select('*')
                .or(`id.eq.${themeId},slug.eq.${themeId}`)
                .single();
                
            if (themeError || !themeData) {
                setIsLoading(false);
                return;
            }

            // 2. Resolve preset fallbacks
            const preset = CATEGORY_THEME_PRESETS[themeData.cultural_category as keyof typeof CATEGORY_THEME_PRESETS] || CATEGORY_THEME_PRESETS.default;
            
            const resolvedColors = themeData.colors && Object.keys(themeData.colors).length > 0 ? themeData.colors : preset.colors;
            const resolvedTypography = themeData.typography && Object.keys(themeData.typography).length > 0 ? themeData.typography : preset.typography;
            const resolvedAnimationSettings = themeData.animation_settings && Object.keys(themeData.animation_settings).length > 0 ? themeData.animation_settings : preset.animationSettings;
            
            const resolvedStyleSettings = preset.styleSettings;

            // 3. Fetch theme_asset_slots (SISTEM C)
            const { data: slotsData } = await supabase
                .from('theme_asset_slots')
                .select('*')
                .eq('theme_id', themeData.id);

            // 4. Fetch theme_assets (SISTEM A)
            const { data: globalAssetsData } = await supabase
                .from('theme_assets')
                .select('*')
                .eq('theme_key', themeData.slug);

            // 5. Merge Asset Slots
            const dbSlotsMap = new Map<string, string>();
            slotsData?.forEach((s: any) => {
                if (s.asset_url) dbSlotsMap.set(s.slot_key, s.asset_url);
            });

            // Map global assets -> Parallax slots
            const GLOBAL_ASSET_SLOT_MAP: Record<string, string[]> = {
                background: ['cover_background', 'hero_background'],
                ornament_top: ['ornament_top_hero'],
                ornament_bottom_left: ['ornament_bottom_left'],
                ornament_bottom_right: ['ornament_bottom_right'],
                ornament_corner: ['ornament_corner_tl', 'ornament_corner_br'],
                frame: ['hero_frame'],
                pattern: ['cover_pattern'],
                divider: ['divider'],
                music: ['bg_music'],
            };

            const globalSlotsMap = new Map<string, string>();
            globalAssetsData?.forEach((ga: any) => {
                const targetSlots = GLOBAL_ASSET_SLOT_MAP[ga.kind] || [];
                targetSlots.forEach(ts => {
                    globalSlotsMap.set(ts, ga.image_url);
                });
            });

            // Reconstruct the full assetSlots array required by Parallax Theme
            const assetSlots: ThemeAssetSlot[] = THEME_SLOT_DEFINITIONS.map((def, i) => {
                // Priority: SISTEM C (theme_asset_slots) > SISTEM A (theme_assets) > fallback null
                const assetUrl = dbSlotsMap.get(def.slotKey) || globalSlotsMap.get(def.slotKey) || null;
                return {
                    id: `${themeData.id}-slot-${i}`,
                    themeId: themeData.id,
                    slotKey: def.slotKey,
                    slotLabel: def.slotLabel,
                    slotDescription: def.slotDescription,
                    widthCm: def.widthCm,
                    heightCm: def.heightCm,
                    aspectRatio: def.aspectRatio,
                    assetUrl,
                    assetType: def.assetType,
                    displayOrder: i,
                };
            });

            const reconstructedTheme: Theme = {
                id: themeData.id,
                name: themeData.name,
                slug: themeData.slug,
                description: themeData.description || '',
                culturalCategory: themeData.cultural_category as any,
                status: themeData.status as ThemeStatus,
                thumbnailUrl: themeData.preview_url || null,
                musicUrl: themeData.music_url || assetSlots.find((s) => s.slotKey === 'bg_music')?.assetUrl || null,
                videoUrl: null,
                colors: resolvedColors,
                typography: resolvedTypography,
                animationSettings: resolvedAnimationSettings,
                styleSettings: resolvedStyleSettings,
                assetSlots: assetSlots,
                createdAt: themeData.created_at,
                updatedAt: themeData.updated_at,
            };

            setTheme(reconstructedTheme);
            setIsLoading(false);
        };

        fetchThemeData();
    }, [themeId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-[#14213d] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-500">Memuat tema...</p>
                </div>
            </div>
        );
    }

    if (!theme) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 mb-2">Tema tidak ditemukan</p>
                    <p className="text-sm text-gray-500 mb-4">ID/Slug: {themeId}</p>
                    <Button variant="secondary" onClick={() => router.push('/admin/themes')}>
                        Kembali ke Daftar Tema
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Floating back & edit button */}
            <div className="fixed bottom-4 left-4 z-50 flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => router.push('/admin/themes')} className="gap-1 bg-white/80 backdrop-blur-sm shadow-md">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Button>
                <Button variant="default" size="sm" onClick={() => router.push(`/admin/themes/${theme.id}/assets`)} className="gap-1 shadow-md bg-[#14213D] hover:bg-[#1a2b50] text-white">
                    Edit Aset
                </Button>
            </div>
            {/* Preview badge */}
            <div className="fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white shadow-md">
                PREVIEW: {theme.name}
            </div>
            {/* Render */}
            <MasterInvitationRenderer theme={theme} invitationData={demoData as any} />
        </div>
    );
}
