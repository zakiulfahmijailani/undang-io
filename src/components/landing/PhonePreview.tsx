/* Phone invitation preview for the Landing Page undang-io mockup. */

import { ChevronDown, Flower2, Leaf } from "lucide-react";

export function PhonePreview() {
  return (
    <div className="relative mx-auto w-full max-w-[310px]">
      <div className="absolute -right-7 top-10 h-24 w-24 rounded-full bg-landing-gold/10" aria-hidden="true" />
      <div className="relative rounded-[2.5rem] border-[10px] border-[#171313] bg-[#171313] shadow-landing-phone">
        <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-[#171313]" aria-hidden="true" />
        <div className="relative h-[520px] overflow-hidden rounded-[1.85rem] border border-black/10 bg-landing-paper">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,168,76,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(139,26,43,0.10),transparent_32%)]" />
          <Flower2 className="absolute right-5 top-7 h-16 w-16 text-landing-maroon/35" aria-hidden="true" />
          <Leaf className="absolute left-5 top-16 h-10 w-10 text-landing-gold/60" aria-hidden="true" />
          <Flower2 className="absolute bottom-28 left-6 h-14 w-14 text-landing-maroon/30" aria-hidden="true" />
          <Leaf className="absolute bottom-20 right-6 h-12 w-12 text-landing-gold/60" aria-hidden="true" />

          <div className="relative z-10 flex h-full flex-col items-center px-8 py-14 text-center">
            <p className="font-ui text-[10px] font-bold uppercase text-landing-muted">The Wedding Of</p>
            <h2 className="mt-7 font-landing-serif text-5xl leading-tight text-landing-ink">
              Rizky
              <span className="block font-display text-4xl text-landing-maroon">&amp;</span>
              Amara
            </h2>
            <p className="mt-5 font-ui text-xs font-semibold text-landing-muted">12 . 12 . 2025</p>
            <p className="mt-1 font-ui text-xs text-landing-muted">Jakarta</p>

            <div className="mt-auto">
              <p className="mb-4 font-ui text-[11px] font-medium leading-relaxed text-landing-muted">
                Kepada Yth.
                <br />
                Bapak/Ibu/Saudara/i
              </p>
              <button
                type="button"
                className="rounded-md bg-landing-maroon px-8 py-3 font-ui text-xs font-bold text-white shadow-landing-button"
              >
                Buka Undangan
              </button>
              <ChevronDown className="mx-auto mt-7 h-5 w-5 text-landing-maroon" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
