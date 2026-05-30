/* Feature cards for the Landing Page undang-io mockup. */

import { features } from "./data";

export function FeatureCards() {
  return (
    <section id="fitur" className="bg-landing-paper px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <h2 className="font-landing-serif text-3xl font-semibold text-landing-ink sm:text-4xl">Fitur Utama Undang.io</h2>
          <div className="mx-auto mt-2 h-px w-20 bg-landing-gold" aria-hidden="true" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-landing-border bg-white p-5 shadow-sm">
              <feature.icon className="mb-4 h-7 w-7 text-landing-gold" aria-hidden="true" />
              <h3 className="font-landing-serif text-lg font-semibold text-landing-ink">{feature.title}</h3>
              <p className="mt-2 font-ui text-sm leading-6 text-landing-muted">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
