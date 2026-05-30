/* Theme showcase for the Landing Page undang-io mockup. */

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { LandingTheme } from "./types";
import { ThemePreviewCard } from "./ThemePreviewCard";

type ThemeShowcaseProps = {
  themes: LandingTheme[];
};

export function ThemeShowcase({ themes }: ThemeShowcaseProps) {
  return (
    <section id="tema" className="bg-landing-paper px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-landing-serif text-3xl font-semibold text-landing-ink sm:text-4xl">Pilih Tema Favoritmu</h2>
          <Link href="/buat-undangan" className="hidden items-center gap-2 font-ui text-sm font-semibold text-landing-maroon sm:inline-flex">
            Lihat semua tema
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {themes.slice(0, 6).map((theme, index) => (
            <Link key={theme.id} href={`/buat-undangan?theme=${encodeURIComponent(theme.slug || theme.id)}`} className="group">
              <ThemePreviewCard theme={theme} index={index} />
              <div className="mt-2 text-center font-ui text-sm font-bold text-landing-ink">{theme.name}</div>
            </Link>
          ))}
          <Link
            href="/buat-undangan"
            className="flex min-h-[156px] items-center justify-center rounded-2xl border border-landing-border bg-white text-landing-gold shadow-sm transition hover:border-landing-gold hover:text-landing-maroon md:hidden"
            aria-label="Lihat semua tema"
          >
            <ChevronRight className="h-7 w-7" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
