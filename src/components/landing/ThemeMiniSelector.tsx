"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { isCodeRenderedThemeKey } from "@/lib/default-theme";
import { ThemePreviewCard } from "./ThemePreviewCard";
import type { LandingTheme } from "./types";

type ThemeMiniSelectorProps = {
  themes: LandingTheme[];
  selectedThemeKey: string;
  groomName: string;
  brideName: string;
  onThemeChange: (themeKey: string) => void;
};

export function ThemeMiniSelector({
  themes,
  selectedThemeKey,
  groomName,
  brideName,
  onThemeChange,
}: ThemeMiniSelectorProps) {
  return (
    <div className="min-w-0">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <p className="font-ui text-[11px] font-bold uppercase tracking-[0.16em] text-landing-muted">Pilih tema</p>
        <span className="font-ui text-[11px] font-medium text-landing-muted">Bisa diganti nanti</span>
      </div>

      <div className="-mx-1 flex w-[calc(100%+0.5rem)] max-w-[calc(100%+0.5rem)] snap-x gap-2.5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {themes.map((theme, index) => {
          const themeKey = theme.slug || theme.id;
          const previewTheme = isCodeRenderedThemeKey(themeKey) ? { ...theme, thumbnailUrl: null } : theme;

          return (
            <div key={theme.id} className="w-[88px] shrink-0 snap-start">
              <ThemePreviewCard
                theme={previewTheme}
                index={index}
                compact
                selected={selectedThemeKey === themeKey}
                onSelect={() => onThemeChange(themeKey)}
                groomName={groomName}
                brideName={brideName}
              />
              <span className="mt-1.5 block truncate text-center font-ui text-[10px] font-semibold text-landing-ink">
                {theme.name}
              </span>
            </div>
          );
        })}

        <Link
          href="#tema"
          className="flex h-20 w-[88px] shrink-0 snap-start flex-col items-center justify-center gap-1.5 rounded-xl border border-landing-border bg-landing-cream font-ui text-[10px] font-semibold text-landing-muted transition hover:border-landing-maroon hover:text-landing-maroon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-landing-maroon/30"
        >
          <LayoutGrid className="h-5 w-5" aria-hidden="true" />
          Lainnya
        </Link>
      </div>
    </div>
  );
}
