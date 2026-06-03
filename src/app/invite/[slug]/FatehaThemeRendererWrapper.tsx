"use client";

import { FatehaInvitationRenderer, type FatehaInvitationData } from "@/components/themes/fateha";

export default function FatehaThemeRendererWrapper({ data }: { data: FatehaInvitationData }) {
  return <FatehaInvitationRenderer data={data} />;
}
