"use client";

import { useCallback, useEffect, useRef } from "react";
import { DEFAULT_INVITATION_THEME_KEY } from "@/lib/default-theme";
import { cn } from "@/lib/utils";
import type { InvitationPreviewPayload, PreviewMessage, ThemePreviewOverride } from "@/types/preview";

export type InvitationPreviewShellProps = {
  themeKey?: string | null;
  invitationData?: InvitationPreviewPayload;
  themeOverrides?: ThemePreviewOverride;
  src?: string;
  url?: string;
  isLive?: boolean;
  sendNamePreviewUpdate?: boolean;
  previewReloadKey?: string | number | null;
  title?: string;
  className?: string;
};

export function InvitationPreviewShell({
  themeKey,
  invitationData,
  themeOverrides,
  src,
  url = "/invite/nama-mempelai",
  isLive = true,
  sendNamePreviewUpdate = false,
  previewReloadKey,
  title = "Pratinjau undangan",
  className,
}: InvitationPreviewShellProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewSrc = src || `/invite/demo?preview=true&theme=${encodeURIComponent(themeKey || DEFAULT_INVITATION_THEME_KEY)}`;

  const send = useCallback((message: PreviewMessage) => {
    iframeRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, []);

  const sendInvitationPreview = useCallback(() => {
    if (!invitationData) return;
    send({ type: "UPDATE_INVITATION_PREVIEW", data: invitationData });
    if (sendNamePreviewUpdate) {
      send({
        type: "PREVIEW_UPDATE",
        groomName: invitationData.groomNickname || invitationData.groomFullName || "",
        brideName: invitationData.brideNickname || invitationData.brideFullName || "",
      });
    }
  }, [invitationData, send, sendNamePreviewUpdate]);

  useEffect(() => {
    sendInvitationPreview();
  }, [previewSrc, sendInvitationPreview]);

  useEffect(() => {
    if (themeOverrides) send({ type: "UPDATE_THEME_PREVIEW", data: themeOverrides });
  }, [previewSrc, send, themeOverrides]);

  useEffect(() => {
    if (!sendNamePreviewUpdate || previewReloadKey === undefined) return;
    const timer = window.setTimeout(() => {
      sendInvitationPreview();
    }, 800);

    return () => window.clearTimeout(timer);
  }, [previewReloadKey, sendInvitationPreview, sendNamePreviewUpdate]);

  return (
    <section
      className={cn(
        "flex h-full min-h-[520px] min-w-0 flex-col overflow-hidden rounded-xl border border-landing-border bg-white shadow-landing-panel",
        className,
      )}
      aria-label={title}
    >
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-landing-border bg-slate-200 px-3">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto min-w-0 max-w-xl flex-1 truncate rounded-full bg-white/85 px-4 py-1 text-center font-ui text-[11px] text-landing-muted shadow-inner">
          {url} <span className="hidden sm:inline">- Live Preview</span>
        </div>
        {isLive ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 font-ui text-[10px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            LIVE
          </span>
        ) : (
          <span className="w-10 shrink-0" aria-hidden="true" />
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          src={previewSrc}
          title={title}
          onLoad={() => {
            sendInvitationPreview();
            if (themeOverrides) send({ type: "UPDATE_THEME_PREVIEW", data: themeOverrides });
          }}
          className="block h-full min-h-full w-full border-0 bg-white"
          sandbox="allow-forms allow-scripts allow-same-origin"
        />
      </div>
    </section>
  );
}
