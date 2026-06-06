/* Landing page composition for the Landing Page undang-io mockup. */

import { CtaStrip } from "./CtaStrip";
import { FeatureCards } from "./FeatureCards";
import { LandingFooter } from "./LandingFooter";
import { LandingHeroConversion } from "./LandingHeroConversion";
import { LandingNav } from "./LandingNav";
import { PricingCards } from "./PricingCards";
import { TestimonialCards } from "./TestimonialCards";
import { ThemeShowcase } from "./ThemeShowcase";
import { TrustStrip } from "./TrustStrip";
import type { LandingTheme } from "./types";

type LandingPageClientProps = {
  themes: LandingTheme[];
};

export function LandingPageClient({ themes }: LandingPageClientProps) {
  return (
    <div className="min-h-screen bg-landing-paper text-landing-ink">
      <LandingNav />
      <main>
        <LandingHeroConversion themes={themes} />
        <TrustStrip />
        <FeatureCards />
        <ThemeShowcase themes={themes} />
        <PricingCards />
        <TestimonialCards />
        <CtaStrip />
      </main>
      <LandingFooter />
    </div>
  );
}
