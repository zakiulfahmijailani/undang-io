"use client";

import { InvitationPreviewShell } from "@/components/preview/InvitationPreviewShell";
import type { InvitationPreviewPayload, ThemePreviewOverride } from "@/types/preview";

type UniversalThemePreviewProps = {
  themeKey?: string | null;
  data?: InvitationPreviewPayload;
  themeOverrides?: ThemePreviewOverride;
  src?: string;
  label?: string;
  className?: string;
};

export function UniversalThemePreview({
  themeKey,
  data,
  themeOverrides,
  src,
  label = "Pratinjau tema",
  className,
}: UniversalThemePreviewProps) {
  return (
    <InvitationPreviewShell
      themeKey={themeKey}
      invitationData={data}
      themeOverrides={themeOverrides}
      src={src}
      title={label}
      url={`/invite/${themeKey || "tema-baru"}`}
      className={className}
    />
  );
}
