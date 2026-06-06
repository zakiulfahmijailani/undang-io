"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import type { LandingTheme } from "./types";
import { ThemeMiniSelector } from "./ThemeMiniSelector";

type QuickStartFormProps = {
  groomName: string;
  brideName: string;
  selectedThemeKey: string;
  themes: LandingTheme[];
  onGroomNameChange: (value: string) => void;
  onBrideNameChange: (value: string) => void;
  onThemeChange: (themeKey: string) => void;
  onSubmit: () => void;
};

export function QuickStartForm({
  groomName,
  brideName,
  selectedThemeKey,
  themes,
  onGroomNameChange,
  onBrideNameChange,
  onThemeChange,
  onSubmit,
}: QuickStartFormProps) {
  return (
    <section
      aria-label="Mulai buat undangan"
      className="relative min-w-0 rounded-2xl border border-landing-border/90 bg-white/95 p-4 shadow-landing-panel backdrop-blur-sm sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-landing-border/70 pb-3">
        <span className="inline-flex items-center gap-2 font-ui text-[11px] font-bold uppercase tracking-[0.14em] text-landing-success">
          <Sparkles className="h-4 w-4 text-landing-gold" aria-hidden="true" />
          Buat undangan sekarang, gratis
        </span>
        <span className="hidden font-ui text-[11px] font-semibold text-landing-maroon sm:inline">Gratis 25 menit</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5 font-ui text-xs font-semibold text-landing-ink">
          Nama mempelai pria
          <input
            value={groomName}
            onChange={(event) => onGroomNameChange(event.target.value)}
            placeholder="Contoh: Rizky"
            autoComplete="off"
            className="h-12 rounded-xl border border-landing-border bg-landing-paper px-4 font-ui text-sm font-semibold text-landing-ink outline-none transition placeholder:font-normal placeholder:text-landing-muted/65 focus:border-landing-maroon focus:ring-4 focus:ring-landing-maroon/10"
          />
        </label>
        <label className="grid gap-1.5 font-ui text-xs font-semibold text-landing-ink">
          Nama mempelai wanita
          <input
            value={brideName}
            onChange={(event) => onBrideNameChange(event.target.value)}
            placeholder="Contoh: Amara"
            autoComplete="off"
            className="h-12 rounded-xl border border-landing-border bg-landing-paper px-4 font-ui text-sm font-semibold text-landing-ink outline-none transition placeholder:font-normal placeholder:text-landing-muted/65 focus:border-landing-maroon focus:ring-4 focus:ring-landing-maroon/10"
          />
        </label>
      </div>

      <p className="mt-2 font-ui text-[11px] text-landing-muted">Nama depan saja juga bisa.</p>

      <div className="mt-4 border-t border-landing-border/70 pt-4">
        <ThemeMiniSelector
          themes={themes}
          selectedThemeKey={selectedThemeKey}
          groomName={groomName}
          brideName={brideName}
          onThemeChange={onThemeChange}
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="mt-4 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-landing-maroon px-5 py-3.5 font-ui text-sm font-bold text-white shadow-landing-button transition hover:-translate-y-0.5 hover:bg-landing-maroon-dark hover:shadow-lg active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-landing-maroon/25"
      >
        Lanjut Buat Undangan
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center font-ui text-[11px] font-medium text-landing-muted">
        <CheckCircle2 className="h-3.5 w-3.5 text-landing-success" aria-hidden="true" />
        Tanpa login · preview langsung jadi · gratis 25 menit
      </p>
    </section>
  );
}
