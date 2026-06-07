import type { ReactNode } from "react";

type DesktopBrowserFrameProps = {
  children: ReactNode;
  url?: string;
};

export function DesktopBrowserFrame({ children, url = "undang.io/u/nama-mempelai" }: DesktopBrowserFrameProps) {
  return (
    <div className="flex h-full min-h-[500px] w-full flex-col overflow-hidden rounded-xl border border-landing-border bg-white shadow-landing-phone">
      <div className="flex h-10 shrink-0 items-center gap-3 border-b border-landing-border bg-landing-cream px-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="mx-auto max-w-lg flex-1 truncate rounded-full bg-white px-4 py-1 text-center font-ui text-[11px] text-landing-muted shadow-inner">
          {url}
        </div>
        <div className="w-10" aria-hidden="true" />
      </div>
      <div className="min-h-0 flex-1 overflow-auto bg-white">{children}</div>
    </div>
  );
}
