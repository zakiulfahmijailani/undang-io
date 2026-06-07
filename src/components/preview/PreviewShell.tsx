"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { usePreviewScale } from "@/hooks/usePreviewScale";
import { DesktopBrowserFrame } from "./DesktopBrowserFrame";
import { MOBILE_PHONE_HEIGHT, MOBILE_PHONE_WIDTH, MobilePhoneFrame } from "./MobilePhoneFrame";
import { PreviewToggle } from "./PreviewToggle";

export type PreviewMode = "desktop" | "mobile";

type PreviewShellProps = {
  children: ReactNode;
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  className?: string;
  label?: string;
  url?: string;
};

export function PreviewShell({
  children,
  mode,
  onModeChange,
  className,
  label = "Pratinjau langsung",
  url,
}: PreviewShellProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const phoneScale = usePreviewScale(viewportRef, MOBILE_PHONE_HEIGHT, 32, MOBILE_PHONE_WIDTH);
  const [displayMode, setDisplayMode] = useState(mode);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (mode === displayMode) return;
    setTransitioning(true);
    const swapTimer = window.setTimeout(() => setDisplayMode(mode), 120);
    const finishTimer = window.setTimeout(() => setTransitioning(false), 260);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(finishTimer);
    };
  }, [displayMode, mode]);

  return (
    <section className={cn("flex min-w-0 flex-col rounded-2xl border border-landing-border bg-white/95 p-3 shadow-landing-panel sm:p-4", className)}>
      <header className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-ui text-[11px] font-bold uppercase tracking-[0.15em] text-landing-muted">{label}</p>
          <p className="mt-0.5 hidden font-ui text-xs text-landing-muted sm:block">Tampilan identik, ukuran mengikuti perangkat.</p>
        </div>
        <PreviewToggle mode={mode} onModeChange={onModeChange} />
      </header>

      <div
        ref={viewportRef}
        className={cn(
          "relative flex min-h-[520px] min-w-0 flex-1 items-start justify-center overflow-hidden rounded-xl bg-landing-cream p-3 transition-[opacity,transform] duration-200 sm:min-h-[560px] sm:p-4",
          transitioning && "scale-[0.985] opacity-0",
        )}
      >
        {displayMode === "desktop" ? (
          <DesktopBrowserFrame url={url}>{children}</DesktopBrowserFrame>
        ) : (
          <MobilePhoneFrame scale={phoneScale}>{children}</MobilePhoneFrame>
        )}
      </div>
    </section>
  );
}
