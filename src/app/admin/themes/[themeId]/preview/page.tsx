"use client";

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dummyThemes } from '@/data/dummyThemes';
import MasterInvitationRenderer from '@/components/invitation/MasterInvitationRenderer';

export default function AdminThemePreviewPage() {
    const params = useParams();
    const router = useRouter();
    const themeId = params.themeId as string;
    const theme = dummyThemes.find((t) => t.id === themeId);

    if (!theme) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700 mb-2">Tema tidak ditemukan</p>
                    <Button variant="secondary" onClick={() => router.push('/admin/themes')}>Kembali</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Floating back button */}
            <div className="fixed top-4 left-4 z-50">
                <Button variant="secondary" size="sm" onClick={() => router.push('/admin/themes')} className="gap-1 bg-white/80 backdrop-blur-sm shadow-md">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Button>
            </div>
            {/* Preview badge */}
            <div className="fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white shadow-md">
                PREVIEW: {theme.name}
            </div>
            {/* Render */}
            <MasterInvitationRenderer theme={theme} />
        </div>
    );
}
