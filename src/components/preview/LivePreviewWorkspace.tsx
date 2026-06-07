"use client";

import { useState, type ReactNode } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type LivePreviewWorkspaceProps = {
  form: ReactNode;
  preview: ReactNode;
  topBar?: ReactNode;
  className?: string;
  formClassName?: string;
  previewClassName?: string;
  topBarClassName?: string;
  previewVisible?: boolean;
  onPreviewVisibleChange?: (visible: boolean) => void;
  showDesktopToggle?: boolean;
};

export function LivePreviewWorkspace({
  form,
  preview,
  topBar,
  className,
  formClassName,
  previewClassName,
  topBarClassName,
  previewVisible: controlledVisible,
  onPreviewVisibleChange,
  showDesktopToggle = false,
}: LivePreviewWorkspaceProps) {
  const [internalVisible, setInternalVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const previewVisible = controlledVisible ?? internalVisible;

  function setPreviewVisible(visible: boolean) {
    setInternalVisible(visible);
    onPreviewVisibleChange?.(visible);
  }

  return (
    <div className={cn("relative min-w-0", className)}>
      {topBar ? <div className={cn("sticky top-0 z-30", topBarClassName)}>{topBar}</div> : null}

      <div
        className={cn(
          "grid min-w-0 lg:h-[calc(100dvh-3.5rem)] lg:overflow-hidden",
          previewVisible
            ? "lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] xl:grid-cols-[minmax(0,43fr)_minmax(0,57fr)] 2xl:grid-cols-[minmax(0,40fr)_minmax(0,60fr)]"
            : "lg:grid-cols-1",
        )}
      >
        <div className={cn("min-w-0 bg-white lg:h-full lg:overflow-y-auto", previewVisible && "lg:border-r lg:border-landing-border", formClassName)}>
          {showDesktopToggle ? (
            <div className="sticky top-0 z-20 hidden justify-end border-b border-landing-border bg-white/95 p-2 backdrop-blur lg:flex">
              <Button type="button" variant="secondary" size="sm" onClick={() => setPreviewVisible(!previewVisible)}>
                {previewVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                {previewVisible ? "Sembunyikan Preview" : "Tampilkan Preview"}
              </Button>
            </div>
          ) : null}
          {form}
        </div>

        {previewVisible ? (
          <aside className={cn("hidden min-w-0 bg-slate-100 p-3 lg:block lg:h-full xl:p-4", previewClassName)}>
            {preview}
          </aside>
        ) : null}
      </div>

      <Button
        type="button"
        className="fixed bottom-6 right-6 z-40 min-h-12 rounded-full px-5 shadow-lg lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Eye className="h-4 w-4" aria-hidden="true" />
        Lihat Preview
      </Button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100 lg:hidden">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-landing-border bg-white px-4">
            <strong className="font-ui text-sm text-landing-ink">Pratinjau Undangan</strong>
            <Button type="button" variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
              <X className="h-4 w-4" aria-hidden="true" />
              Tutup
            </Button>
          </div>
          <div className="min-h-0 flex-1 p-2">{preview}</div>
        </div>
      ) : null}
    </div>
  );
}
