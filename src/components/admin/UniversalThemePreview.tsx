"use client";

import { useEffect, useState } from "react";
import { InvitationPreviewRenderer } from "@/components/preview/InvitationPreviewRenderer";
import { PreviewShell, type PreviewMode } from "@/components/preview/PreviewShell";

type UniversalThemePreviewProps = {
  themeKey?: string | null;
  data?: object;
  src?: string;
  label?: string;
  className?: string;
};

export function UniversalThemePreview({
  themeKey,
  data,
  src,
  label = "Pratinjau tema",
  className,
}: UniversalThemePreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setPreviewMode("mobile");
    }
  }, []);

  return (
    <PreviewShell
      mode={previewMode}
      onModeChange={setPreviewMode}
      label={label}
      className={className}
      url={`undang.io/u/${themeKey || "tema-baru"}`}
    >
      <InvitationPreviewRenderer themeKey={themeKey} data={data} src={src} />
    </PreviewShell>
  );
}
