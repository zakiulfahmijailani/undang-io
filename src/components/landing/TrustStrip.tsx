/* Trust strip for the Landing Page undang-io mockup. */

import { Star } from "lucide-react";
import { quickFacts } from "./data";

export function TrustStrip() {
  return (
    <section className="border-b border-landing-border bg-landing-cream">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
        {quickFacts.map((fact) => (
          <div key={fact.label} className="text-center">
            <p className="font-ui text-sm text-landing-muted">{fact.label}</p>
            <p className="font-landing-serif text-2xl font-semibold text-landing-maroon">{fact.value}</p>
          </div>
        ))}
        <div className="flex items-center justify-center gap-4">
          <div className="flex -space-x-2" aria-hidden="true">
            {["D", "S", "N", "A"].map((initial) => (
              <span
                key={initial}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-landing-cream bg-landing-maroon font-ui text-xs font-bold text-white"
              >
                {initial}
              </span>
            ))}
          </div>
          <div>
            <div className="flex text-landing-gold" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="font-ui text-xs text-landing-muted">4.8/5 rata-rata rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}
