/* Final call-to-action strip for the Landing Page undang-io mockup. */

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

export function CtaStrip() {
  return (
    <section className="bg-landing-maroon px-4 py-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
        <Leaf className="hidden h-16 w-16 text-landing-gold/45 md:block" aria-hidden="true" />
        <div>
          <h2 className="font-landing-serif text-3xl font-semibold sm:text-4xl">Siap membuat undangan impianmu?</h2>
          <p className="mt-1 font-ui text-sm text-white/78">Mulai gratis sekarang, tanpa perlu daftar.</p>
        </div>
        <Link
          href="/buat-undangan"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-7 font-ui text-sm font-bold text-landing-maroon shadow-landing-button transition hover:bg-landing-cream"
        >
          Buat Undangan Gratis Sekarang
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
