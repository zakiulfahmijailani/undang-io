"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Eye, Zap } from "lucide-react";
import {
  DEFAULT_INVITATION_THEME_KEY,
  JAWA_AGUNG_THEME_KEY,
  OBSIDIAN_LUXE_THEME_KEY,
  PETAL_SOFT_THEME_KEY,
} from "@/lib/default-theme";
import type { LandingTheme } from "./types";
import { LiveInvitationPreview } from "./LiveInvitationPreview";
import { QuickStartForm } from "./QuickStartForm";
import { LivePreviewWorkspace } from "@/components/preview/LivePreviewWorkspace";

type LandingHeroConversionProps = {
  themes: LandingTheme[];
};

const preferredThemeOrder = [
  PETAL_SOFT_THEME_KEY,
  DEFAULT_INVITATION_THEME_KEY,
  OBSIDIAN_LUXE_THEME_KEY,
  JAWA_AGUNG_THEME_KEY,
] as const;

function themeKey(theme: LandingTheme) {
  return theme.slug || theme.id;
}

export function LandingHeroConversion({ themes }: LandingHeroConversionProps) {
  const router = useRouter();
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [selectedThemeKey, setSelectedThemeKey] = useState(PETAL_SOFT_THEME_KEY);

  const heroThemes = useMemo(() => {
    const byKey = new Map(themes.map((theme) => [themeKey(theme), theme]));
    const preferred = preferredThemeOrder.map((key) => byKey.get(key)).filter((theme): theme is LandingTheme => Boolean(theme));
    const remaining = themes.filter((theme) => !preferredThemeOrder.includes(themeKey(theme) as (typeof preferredThemeOrder)[number]));
    return [...preferred, ...remaining].slice(0, 4);
  }, [themes]);

  function handleSubmit() {
    const params = new URLSearchParams({ theme: selectedThemeKey });
    const groom = groomName.trim();
    const bride = brideName.trim();
    if (groom) params.set("groom", groom);
    if (bride) params.set("bride", bride);

    try {
      window.sessionStorage.setItem(
        "undang_draft",
        JSON.stringify({
          groom_full_name: groom,
          groom_name: groom,
          bride_full_name: bride,
          bride_name: bride,
          themeId: selectedThemeKey,
        }),
      );
    } catch (error) {
      console.warn("[landing] Session draft storage is unavailable; continuing with URL draft.", error);
    }

    router.push(`/buat-undangan?${params.toString()}`);
  }

  const formPanel = (
    <div className="relative z-10 flex min-h-[calc(100dvh-4rem)] items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
          <div className="inline-flex min-h-9 items-center gap-2 rounded-full border border-landing-maroon/15 bg-white/80 px-3.5 font-ui text-[11px] font-bold uppercase tracking-[0.12em] text-landing-maroon shadow-sm backdrop-blur">
            <Zap className="h-4 w-4 fill-landing-gold text-landing-gold" aria-hidden="true" />
            Langsung buat, tanpa daftar
          </div>

          <h1 className="mt-4 max-w-2xl text-[clamp(2.5rem,9vw,5.8rem)] font-black leading-[0.94] text-landing-ink sm:mt-5">
            <span className="block">BUAT</span>
            <span className="block">UNDANGAN</span>
            <span className="mt-1 block text-landing-maroon">GRATIS!</span>
          </h1>

          <p className="mt-3 max-w-xl font-ui text-base leading-7 text-landing-muted sm:mt-4 sm:text-lg">
            Isi nama mempelai, pilih tema, dan lihat undanganmu langsung jadi.
          </p>

          <div className="mt-4 max-w-2xl sm:mt-6">
            <QuickStartForm
              groomName={groomName}
              brideName={brideName}
              selectedThemeKey={selectedThemeKey}
              themes={heroThemes}
              onGroomNameChange={setGroomName}
              onBrideNameChange={setBrideName}
              onThemeChange={setSelectedThemeKey}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-ui text-xs font-semibold text-landing-muted">
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-landing-maroon" aria-hidden="true" />
              Nama berubah langsung di preview
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="h-4 w-4 text-landing-success" aria-hidden="true" />
              Tidak perlu kartu kredit
            </span>
          </div>
      </div>
    </div>
  );

  const preview = (
    <LiveInvitationPreview
      groomName={groomName}
      brideName={brideName}
      selectedThemeKey={selectedThemeKey}
    />
  );

  return (
    <section className="relative overflow-hidden border-b border-landing-border bg-landing-paper">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(248,218,219,0.55),transparent_28%),radial-gradient(circle_at_88%_48%,rgba(168,197,160,0.24),transparent_30%)]" aria-hidden="true" />
      <LivePreviewWorkspace
        className="relative mx-auto max-w-[1600px]"
        form={formPanel}
        preview={preview}
        formClassName="bg-transparent"
        previewClassName="bg-landing-cream/70"
      />
    </section>
  );
}
