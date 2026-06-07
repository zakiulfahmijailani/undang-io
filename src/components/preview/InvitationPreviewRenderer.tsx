"use client";

import { useEffect, useRef } from "react";
import { DEFAULT_INVITATION_THEME_KEY } from "@/lib/default-theme";
import { cn } from "@/lib/utils";

type InvitationPreviewRendererProps = {
  themeKey?: string | null;
  data?: object;
  src?: string;
  title?: string;
  className?: string;
};

export function InvitationPreviewRenderer({
  themeKey,
  data,
  src,
  title = "Pratinjau undangan",
  className,
}: InvitationPreviewRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewSrc = src || `/invite/demo?preview=true&theme=${encodeURIComponent(themeKey || DEFAULT_INVITATION_THEME_KEY)}`;

  useEffect(() => {
    if (!data || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: "UPDATE_PREVIEW", data }, "*");
  }, [data, previewSrc]);

  return (
    <iframe
      ref={iframeRef}
      src={previewSrc}
      title={title}
      onLoad={() => {
        if (data && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: "UPDATE_PREVIEW", data }, "*");
        }
      }}
      className={cn("block h-full min-h-[100%] w-full border-0 bg-white", className)}
      sandbox="allow-forms allow-scripts allow-same-origin"
    />
  );
}
