'use client';

import { useInvitationTheme } from '@/hooks/useTheme';
import { ParallaxThemeRenderer } from '@/components/themes/parallax/ParallaxThemeRenderer';
import InvitationClientWrapper from './InvitationClientWrapper';

interface ParallaxWrapperProps {
    data: any;
    invitationId?: string;
    activeThemeId?: string | null;
    photoGroom?: string | null;
    photoBride?: string | null;
}

export default function ParallaxWrapper({
    data,
    invitationId,
    activeThemeId,
    photoGroom,
    photoBride,
}: ParallaxWrapperProps) {
    const { theme, isLoading } = useInvitationTheme(activeThemeId);

    if (isLoading && activeThemeId) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (theme) {
        return (
            <ParallaxThemeRenderer
                theme={theme}
                photoGroom={photoGroom}
                photoBride={photoBride}
            >
                <InvitationClientWrapper data={data} invitationId={invitationId} />
            </ParallaxThemeRenderer>
        );
    }

    // Fallback flat layout
    return <InvitationClientWrapper data={data} invitationId={invitationId} />;
}