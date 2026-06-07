"use client";

import { useMemo } from "react";
import { InvitationPreviewShell } from "@/components/preview/InvitationPreviewShell";
import type { InvitationPreviewPayload } from "@/types/preview";

type LiveInvitationPreviewProps = {
  groomName: string;
  brideName: string;
  selectedThemeKey: string;
};

export function LiveInvitationPreview({ groomName, brideName, selectedThemeKey }: LiveInvitationPreviewProps) {
  const previewData = useMemo<InvitationPreviewPayload>(
    () => ({
      groomFullName: groomName.trim() || "Rizky Pratama",
      groomNickname: groomName.trim() || "Rizky",
      brideFullName: brideName.trim() || "Amara Putri",
      brideNickname: brideName.trim() || "Amara",
      akadDate: "2026-10-12",
      akadTime: "09:00",
      akadVenue: "The Grand Ballroom",
      akadAddress: "Jakarta, Indonesia",
      receptionDate: "2026-10-12",
      receptionTime: "11:00",
      receptionVenue: "The Grand Ballroom",
      receptionAddress: "Jakarta, Indonesia",
      quote: "Cinta tumbuh ketika dua hati memilih pulang ke arah yang sama.",
    }),
    [brideName, groomName],
  );

  return (
    <InvitationPreviewShell
      themeKey={selectedThemeKey}
      invitationData={previewData}
      isLive={false}
      url="/invite/rizky-amara"
      className="h-full min-h-[520px] w-full"
    />
  );
}
