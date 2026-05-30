/* Testimonial cards for the Landing Page undang-io mockup. */

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "./data";

export function TestimonialCards() {
  return (
    <section id="testimoni" className="bg-landing-paper px-4 py-7 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 font-landing-serif text-3xl font-semibold text-landing-ink sm:text-4xl">Apa Kata Mereka</h2>
        <div className="grid grid-cols-[44px_1fr_44px] items-center gap-3">
          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-landing-border bg-white text-landing-gold shadow-sm transition hover:border-landing-gold md:flex"
            aria-label="Testimoni sebelumnya"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="col-span-full grid gap-4 md:col-span-1 md:grid-cols-3">
            {testimonials.map((item) => (
              <article key={item.name} className="rounded-2xl border border-landing-border bg-white p-5 shadow-sm">
                <Quote className="mb-3 h-7 w-7 fill-landing-gold/20 text-landing-gold/45" aria-hidden="true" />
                <p className="font-ui text-sm leading-6 text-landing-ink">{item.quote}</p>
                <p className="mt-4 font-ui text-sm font-bold text-landing-ink">{item.name}</p>
                <p className="font-ui text-xs text-landing-muted">{item.detail}</p>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-landing-border bg-white text-landing-gold shadow-sm transition hover:border-landing-gold md:flex"
            aria-label="Testimoni berikutnya"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
