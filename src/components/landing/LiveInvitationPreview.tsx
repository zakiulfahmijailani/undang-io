"use client";

import { useMemo } from "react";
import { InvitationPreviewRenderer } from "@/components/preview/InvitationPreviewRenderer";
import { PreviewShell, type PreviewMode } from "@/components/preview/PreviewShell";

type LiveInvitationPreviewProps = {
  groomName: string;
  brideName: string;
  selectedThemeKey: string;
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
};

export function LiveInvitationPreview({
  groomName,
  brideName,
  selectedThemeKey,
  mode,
  onModeChange,
}: LiveInvitationPreviewProps) {
  const previewData = useMemo(
    () => ({
      groomFullName: groomName.trim() || "Rizky Pratama",
      groomNickname: groomName.trim() || "Rizky",
      brideFullName: brideName.trim() || "Amara Putri",
      brideNickname: brideName.trim() || "Amara",
      akadDate: "2026-10-12",
      akadTime: "09:00",
      receptionDate: "2026-10-12",
      receptionTime: "11:00",
      venue: "The Grand Ballroom, Jakarta",
      address: "Jakarta, Indonesia",
      quote: "Cinta tumbuh ketika dua hati memilih pulang ke arah yang sama.",
    }),
    [brideName, groomName],
  );

  return (
    <PreviewShell
      mode={mode}
      onModeChange={onModeChange}
      label="Preview undanganmu"
      url="undang.io/u/rizky-amara"
      className="h-full min-h-[620px] w-full"
    >
      <InvitationPreviewRenderer themeKey={selectedThemeKey} data={previewData} />
    </PreviewShell>
  );
}
