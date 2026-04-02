"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import MasterInvitationRenderer from '@/components/invitation/MasterInvitationRenderer';
import { demoData } from '@/data/demoInvitation';

export default function AdminThemePreviewPage() {
    const params = useParams();
    const router = useRouter();
    const themeId = params.themeId as string;

    const [theme, setTheme] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!themeId) return;

        const supabase = createBrowserSupabaseClient();

        supabase
            .from('themes')
            .select('*')
            .eq('id', themeId)
            .single()
            .then(({ data, error }) => {
                if (error || !data) {
                    setNotFound(true);
                } else {
                    setTheme(data);
                }
                setIsLoading(false);
            });
    }, [themeId]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center text-muted-foreground animate-pulse">
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
