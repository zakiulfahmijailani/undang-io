"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { Theme } from '@/types/theme';
import { themeJawa } from '@/data/dummyThemes';
import MasterInvitationRenderer from '@/components/invitation/MasterInvitationRenderer';
import { demoData } from '@/data/demoInvitation';

/** Minimal safe Theme base — used when DB row doesn't have full Theme shape */
const BASE_THEME: Theme = themeJawa;

export default function AdminThemePreviewPage() {
    const params = useParams();
    const router = useRouter();
    const themeId = params.themeId as string;

    const [theme, setTheme] = useState<Theme | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!themeId) return;

        // Try DB first
        const supabase = createBrowserSupabaseClient();
        supabase
            .from('themes')
            .select('*')
            .eq('id', themeId)
            .single()
            .then(({ data, error }) => {
                if (!error && data) {
                    // Merge DB row on top of base — DB only has id/name/status/is_active
                    // All other required fields (colors, animationSettings, assetSlots…)
                    // fall back to BASE_THEME so MasterInvitationRenderer never crashes
                    setTheme({
                        ...BASE_THEME,
                        id: data.id,
                        name: data.name,
                        status: data.status ?? BASE_THEME.status,
                        // carry over any extra JSON columns if they exist
                        ...(data.colors && { colors: data.colors }),
                        ...(data.animation_settings && { animationSettings: data.animation_settings }),
                        ...(data.typography && { typography: data.typography }),
                        ...(data.music_url !== undefined && { musicUrl: data.music_url }),
                        ...(data.thumbnail_url !== undefined && { thumbnailUrl: data.thumbnail_url }),
                    });
                    setIsLoading(false);
                    return;
                }

                // Fallback: check dummyThemes in case themeId is a slug-style id
                // (for legacy dummy themes like "theme-jawa-klasik")
                import('@/data/dummyThemes').then(({ dummyThemes }) => {
                    const dummy = dummyThemes.find((t) => t.id === themeId);
                    if (dummy) {
                        setTheme(dummy);
                    } else {
                        setNotFound(true);
                    }
                    setIsLoading(false);
                });
            });
    }, [themeId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-muted-foreground animate-pulse text-sm">
                    Memuat preview tema...
                </div>
            </div>
        );
    }

    if (notFound || !theme) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 mb-2">Tema tidak ditemukan</p>
                    <p className="text-sm text-muted-foreground mb-4">ID: {themeId}</p>
                    <Button variant="secondary" onClick={() => router.push('/admin/themes')}>
                        Kembali ke Daftar Tema
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Floating back button */}
            <div className="fixed top-4 left-4 z-50">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/admin/themes')}
                    className="gap-1 bg-white/80 backdrop-blur-sm shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali
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
