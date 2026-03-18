// ============================================================
// undang-io — useTheme Hook
// Phase 2b: Supabase data fetcher for parallax theme system
// ============================================================
// Usage:
//   const { theme, isLoading, error } = useTheme({ slug: 'default-parallax' })
//   const { theme, isLoading, error } = useTheme({ id: 'default-parallax' })
// ============================================================

'use client';

import { useEffect, useState, useCallback } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import {
    ParallaxTheme,
    ParallaxAssetSlot,
    ParallaxLayerSettings,
    ParallaxAnimationConfig,
    ParallaxPalette,
    ParallaxTypography,
    ParallaxThemeConfig,
    ParallaxSlotKey,
    SupabaseThemeRow,
    SupabaseAssetSlotRow,
    CulturalCategory,
    DEFAULT_PARALLAX_ANIMATION,
    DEFAULT_LAYER_SETTINGS,
    SLOT_DEPTH_PRESETS,
    SLOT_ZINDEX_PRESETS,
} from '@/types/theme';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

type UseThemeOptions =
    | { slug: string; id?: never }
    | { id: string; slug?: never };

interface UseThemeResult {
    theme: ParallaxTheme | null;
    isLoading: boolean;
    error: string | null;
    /** Re-fetch manually (e.g. after admin publishes changes) */
    refetch: () => void;
}

// ─────────────────────────────────────────
// Mappers: Supabase raw rows → domain types
// ─────────────────────────────────────────

function mapAssetSlot(row: SupabaseAssetSlotRow): ParallaxAssetSlot {
    const slotKey = row.slot_key as ParallaxSlotKey;

    const defaultSettings: ParallaxLayerSettings = {
        ...DEFAULT_LAYER_SETTINGS,
        depth: SLOT_DEPTH_PRESETS[slotKey] ?? DEFAULT_LAYER_SETTINGS.depth,
        zIndex: SLOT_ZINDEX_PRESETS[slotKey] ?? DEFAULT_LAYER_SETTINGS.zIndex,
    };

    return {
        id: row.id,
        themeId: row.theme_id,
        slotKey,
        slotLabel: row.slot_label,
        assetUrl: row.asset_url,
        assetType: (row.asset_type as ParallaxAssetSlot['assetType']) ?? 'png_transparent',
        displayOrder: row.display_order,
        isActive: row.is_active,
        isRequired: row.is_required,
        settings: row.settings
            ? { ...defaultSettings, ...row.settings }
            : defaultSettings,
    };
}

function mapTheme(
    row: SupabaseThemeRow,
    slotRows: SupabaseAssetSlotRow[]
): ParallaxTheme {
    const animation: ParallaxAnimationConfig =
        row.animation_settings ?? DEFAULT_PARALLAX_ANIMATION;

    const colors: ParallaxPalette = row.colors ?? {
        primary: '#1E1B18',
        accent: '#D4A91C',
        text: '#FDFCF9',
    };

    const typography: ParallaxTypography = row.typography ?? {
        heading: 'Playfair Display',
        body: 'Inter',
    };

    const assetSlots: ParallaxAssetSlot[] = slotRows
        .map(mapAssetSlot)
        .sort((a, b) => a.displayOrder - b.displayOrder);

    // Build config — fall back to reconstructing from parts if config JSONB is null
    const config: ParallaxThemeConfig = row.config ?? {
        version: 1,
        animation,
        fonts: {
            heading: typography.heading,
            body: typography.body,
            accent: typography.accent,
        },
        palette: colors,
        slots: assetSlots.map((s) => s.slotKey),
    };

    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        status: (row.status as ParallaxTheme['status']) ?? 'draft',
        isPublished: row.is_published ?? false,
        culturalCategory: (row.cultural_category as CulturalCategory) ?? null,
        previewUrl: row.preview_url,
        musicUrl: row.music_url,
        tags: row.tags ?? [],
        config,
        colors,
        typography,
        animationSettings: animation,
        assetSlots,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

// ─────────────────────────────────────────
// Hook: useTheme (by slug or id)
// ─────────────────────────────────────────

export function useTheme(options: UseThemeOptions): UseThemeResult {
    const [theme, setTheme] = useState<ParallaxTheme | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fetchCount, setFetchCount] = useState(0);

    const refetch = useCallback(() => setFetchCount((c) => c + 1), []);

    useEffect(() => {
        let cancelled = false;

        async function fetchTheme() {
            setIsLoading(true);
            setError(null);

            const supabase = createBrowserSupabaseClient();
            if (!supabase) {
                setError('Supabase client tidak tersedia.');
                setIsLoading(false);
                return;
            }

            try {
                // 1. Fetch theme row
                const themeQuery = supabase
                    .from('themes')
                    .select('*')
                    .eq('is_published', true);

                const { data: themeData, error: themeError } = await (
                    options.slug
                        ? themeQuery.eq('slug', options.slug)
                        : themeQuery.eq('id', options.id)
                ).single();

                if (themeError) throw new Error(themeError.message);
                if (!themeData) throw new Error('Theme tidak ditemukan.');

                const themeRow = themeData as SupabaseThemeRow;

                // 2. Fetch asset slots untuk theme ini
                const { data: slotData, error: slotError } = await supabase
                    .from('theme_asset_slots')
                    .select('*')
                    .eq('theme_id', themeRow.id)
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (slotError) throw new Error(slotError.message);

                const slotRows = (slotData ?? []) as SupabaseAssetSlotRow[];

                if (!cancelled) {
                    setTheme(mapTheme(themeRow, slotRows));
                }
            } catch (err) {
                if (!cancelled) {
                    const message =
                        err instanceof Error ? err.message : 'Gagal memuat tema.';
                    setError(message);
                    setTheme(null);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        fetchTheme();

        return () => {
            cancelled = true;
        };
    }, [options.slug, options.id, fetchCount]); // eslint-disable-line react-hooks/exhaustive-deps

    return { theme, isLoading, error, refetch };
}

// ─────────────────────────────────────────
// Variant: useInvitationTheme
// Fetch by invitations.active_theme_id — dipakai di guest page (Phase 2d)
// ─────────────────────────────────────────

interface UseInvitationThemeResult {
    theme: ParallaxTheme | null;
    isLoading: boolean;
    error: string | null;
}

export function useInvitationTheme(
    activeThemeId: string | null | undefined
): UseInvitationThemeResult {
    const [theme, setTheme] = useState<ParallaxTheme | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        if (!activeThemeId) {
            setTheme(null);
            setIsLoading(false);
            return;
        }

        async function fetchTheme() {
            setIsLoading(true);
            setError(null);

            const supabase = createBrowserSupabaseClient();
            if (!supabase) {
                setError('Supabase client tidak tersedia.');
                setIsLoading(false);
                return;
            }

            try {
                const { data: themeData, error: themeError } = await supabase
                    .from('themes')
                    .select('*')
                    .eq('id', activeThemeId)
                    .single();

                if (themeError) throw new Error(themeError.message);
                if (!themeData) throw new Error('Theme tidak ditemukan.');

                const themeRow = themeData as SupabaseThemeRow;

                const { data: slotData, error: slotError } = await supabase
                    .from('theme_asset_slots')
                    .select('*')
                    .eq('theme_id', themeRow.id)
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (slotError) throw new Error(slotError.message);

                if (!cancelled) {
                    setTheme(mapTheme(themeRow, (slotData ?? []) as SupabaseAssetSlotRow[]));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Gagal memuat tema undangan.');
                    setTheme(null);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        fetchTheme();
        return () => { cancelled = true; };
    }, [activeThemeId]);

    return { theme, isLoading, error };
}