/* Pricing cards for the Landing Page undang-io mockup. */

import Link from "next/link";
import { Check, CornerRightDown } from "lucide-react";
import { pricingBullets } from "./data";

export function PricingCards() {
  return (
    <section id="harga" className="bg-landing-paper px-4 py-7 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 font-landing-serif text-3xl font-semibold text-landing-ink sm:text-4xl">Paket yang Fleksibel</h2>
        <div className="grid gap-4 lg:grid-cols-[0.86fr_1fr]">
          <article className="rounded-2xl border border-landing-border bg-white p-6 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto_auto] sm:items-end">
              <div>
                <h3 className="font-landing-serif text-3xl font-semibold text-landing-ink">Gratis</h3>
                <p className="font-ui text-sm text-landing-muted">Cocok untuk kamu yang ingin mencoba</p>
                <ul className="mt-4 grid gap-2 font-ui text-sm text-landing-ink">
                  {pricingBullets.free.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-landing-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="font-landing-serif text-2xl text-landing-ink">
                Rp <span className="text-5xl">0</span>
              </div>
              <Link
                href="/buat-undangan"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-landing-gold px-7 font-ui text-sm font-bold text-landing-gold transition hover:bg-landing-gold hover:text-white"
              >
                Mulai Gratis
              </Link>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-2xl border border-landing-gold bg-white p-6 shadow-landing-card">
            <div className="absolute right-0 top-0 bg-landing-gold px-9 py-2 font-ui text-xs font-bold uppercase text-white [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]">
              Best Value
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h3 className="font-landing-serif text-3xl font-semibold text-landing-maroon">Premium</h3>
                <p className="font-ui text-sm text-landing-muted">Semua fitur lengkap untuk hari spesialmu</p>
                <ul className="mt-4 grid gap-x-8 gap-y-2 font-ui text-sm text-landing-ink sm:grid-cols-2">
                  {pricingBullets.premium.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-landing-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-4">
                <div className="font-landing-serif text-2xl text-landing-ink">
                  Rp <span className="text-5xl">49.000</span>
                </div>
                <Link
                  href="/buat-undangan"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-landing-maroon px-9 font-ui text-sm font-bold text-white shadow-landing-button transition hover:bg-landing-maroon-dark"
                >
                  Mulai Sekarang
                  <CornerRightDown className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
