/* Hero section for the Landing Page undang-io mockup. */

import { Zap } from "lucide-react";
import { heroBenefits } from "./data";
import { PhonePreview } from "./PhonePreview";
import { QuickStartCard } from "./QuickStartCard";
import type { LandingTheme } from "./types";

type LandingHeroProps = {
  themes: LandingTheme[];
};

export function LandingHero({ themes }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-landing-border bg-landing-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.45fr_0.82fr_0.65fr] lg:gap-7 lg:px-10 lg:py-12">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-landing-border bg-white px-4 py-2 font-ui text-xs font-bold uppercase text-landing-maroon">
            <Zap className="h-4 w-4 text-landing-gold" aria-hidden="true" />
            Langsung buat, tanpa daftar
          </div>

          <h1 className="max-w-[680px] text-5xl font-black leading-[1.08] text-landing-ink sm:text-6xl lg:text-7xl">
            Undangan
            <span className="block font-display text-6xl font-normal leading-none text-landing-maroon sm:text-7xl lg:text-8xl">
              Pernikahan Digital
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl">yang Tak Terlupakan</span>
          </h1>

          <p className="mt-5 max-w-xl font-ui text-base leading-7 text-landing-ink/78 sm:text-lg">
            Buat undangan cantik dalam hitungan menit. Bagikan ke semua tamu tanpa biaya cetak.
          </p>

          <div className="mt-6 max-w-2xl lg:mt-7">
            <QuickStartCard themes={themes} />
          </div>
        </div>

        <div className="flex items-center justify-center lg:pt-5">
          <PhonePreview />
        </div>

        <aside className="grid gap-5 self-center sm:grid-cols-3 lg:grid-cols-1">
          {heroBenefits.map((benefit) => (
            <div key={benefit.title} className="grid grid-cols-[56px_1fr] items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-landing-gold/12 text-landing-gold">
                <benefit.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-landing-serif text-xl font-semibold text-landing-ink">{benefit.title}</h2>
                <p className="mt-1 font-ui text-sm leading-6 text-landing-muted">{benefit.description}</p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
