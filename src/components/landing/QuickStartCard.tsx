/* Quick-start form for the Landing Page undang-io mockup. */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LandingTheme } from "./types";
import { ThemePreviewCard } from "./ThemePreviewCard";

type QuickStartCardProps = {
  themes: LandingTheme[];
};

export function QuickStartCard({ themes }: QuickStartCardProps) {
  const router = useRouter();
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [selectedThemeKey, setSelectedThemeKey] = useState("");

  const quickThemes = useMemo(() => themes.slice(0, 4), [themes]);

  const selectedTheme = themes.find((theme) => theme.slug === selectedThemeKey || theme.id === selectedThemeKey);

  function handleSubmit() {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "undang_draft",
        JSON.stringify({
          groom_full_name: "",
          groom_name: groomName,
          bride_full_name: "",
          bride_name: brideName,
          themeId: selectedTheme?.id ?? "",
        }),
      );
    }

    const themeParam = selectedTheme?.slug || selectedTheme?.id || "";
    router.push(themeParam ? `/buat-undangan?theme=${encodeURIComponent(themeParam)}` : "/buat-undangan");
  }

  return (
    <section
      aria-label="Mulai buat undangan"
      className="relative rounded-2xl border border-landing-border bg-white/92 p-5 shadow-landing-panel sm:p-6"
    >
      <div className="mb-5 flex items-center gap-2 font-ui text-xs font-bold uppercase leading-none text-landing-success">
        <span className="h-2.5 w-2.5 rounded-full bg-landing-success" aria-hidden="true" />
        Buat undangan sekarang, gratis
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 font-ui text-xs font-bold uppercase text-landing-muted">
          Nama Pria
          <input
            value={groomName}
            onChange={(event) => setGroomName(event.target.value)}
            placeholder="Nama mempelai pria"
            className="h-11 rounded-xl border border-landing-border bg-landing-cream px-4 font-ui text-sm font-medium normal-case text-landing-ink outline-none transition placeholder:text-landing-muted/60 focus:border-landing-maroon focus:ring-2 focus:ring-landing-maroon/10"
          />
        </label>
        <label className="grid gap-2 font-ui text-xs font-bold uppercase text-landing-muted">
          Nama Wanita
          <input
            value={brideName}
            onChange={(event) => setBrideName(event.target.value)}
            placeholder="Nama mempelai wanita"
            className="h-11 rounded-xl border border-landing-border bg-landing-cream px-4 font-ui text-sm font-medium normal-case text-landing-ink outline-none transition placeholder:text-landing-muted/60 focus:border-landing-maroon focus:ring-2 focus:ring-landing-maroon/10"
          />
        </label>
      </div>

      <div className="mt-5">
        <div className="mb-3 font-ui text-xs font-bold uppercase text-landing-muted">Pilih tema favorit (opsional)</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <button
            type="button"
            onClick={() => setSelectedThemeKey("")}
            className={cn(
              "flex h-20 flex-col items-center justify-center rounded-xl border bg-landing-cream px-3 text-center font-ui text-xs font-semibold text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon",
              selectedThemeKey === "" ? "border-landing-gold ring-2 ring-landing-gold/20" : "border-landing-border",
            )}
          >
            Fateha Default
            <span className="mt-1 text-[10px] font-medium text-landing-muted">Elegan biru-gold</span>
          </button>
          {quickThemes.map((theme, index) => (
            <div key={theme.id} className="grid gap-1.5">
              <ThemePreviewCard
                theme={theme}
                index={index}
                compact
                selected={selectedThemeKey === theme.slug || selectedThemeKey === theme.id}
                onSelect={(nextTheme) => setSelectedThemeKey(nextTheme.slug || nextTheme.id)}
              />
              <span className="truncate text-center font-ui text-[11px] font-semibold text-landing-ink">{theme.name}</span>
            </div>
          ))}
          <a
            href="#tema"
            className={cn(
              "flex h-20 flex-col items-center justify-center gap-1 rounded-xl border border-landing-border bg-landing-cream font-ui text-xs font-semibold text-landing-muted transition hover:border-landing-gold hover:text-landing-maroon",
              quickThemes.length === 0 && "col-span-2 sm:col-span-5",
            )}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
            Lainnya
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-landing-maroon px-5 font-ui text-sm font-bold text-white shadow-landing-button transition hover:bg-landing-maroon-dark"
      >
        Buat Undangan Gratis Sekarang
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>

      <p className="mt-3 text-center font-ui text-xs font-medium text-landing-muted">
        Tanpa login <span aria-hidden="true">-</span> live dalam 5 menit <span aria-hidden="true">-</span> gratis 25 menit
      </p>

      <div className="absolute -left-14 top-7 hidden max-w-[78px] text-center font-display text-xl leading-tight text-landing-maroon md:block">
        <Zap className="mx-auto mb-1 h-5 w-5 text-landing-gold" aria-hidden="true" />
        Mulai sekarang, gratis 25 menit!
      </div>
    </section>
  );
}
