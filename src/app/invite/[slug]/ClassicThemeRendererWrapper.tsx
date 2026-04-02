"use client";

import { ClassicThemeRenderer } from "@/components/themes/classic";
import type { ClassicTheme, ClassicInvitationData } from "@/types/theme";

interface Props {
    theme: ClassicTheme;
    data: ClassicInvitationData;
    guestName?: string;
    isPreview?: boolean;
}

/**
 * Client wrapper for ClassicThemeRenderer.
 * Needed because ClassicThemeRenderer is "use client" and the invite page
 * is a server component — we pass serialized props across the boundary.
 */
export default function ClassicThemeRendererWrapper({
    theme,
    data,
    guestName,
    isPreview,
}: Props) {
    return (
        <ClassicThemeRenderer
            theme={theme}
            data={data}
            guestName={guestName}
            isPreview={isPreview}
        />
    );
}
