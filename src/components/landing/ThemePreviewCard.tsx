/* Theme preview card used by the Landing Page undang-io mockup. */

import { Check, Flower2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LandingTheme } from "./types";

const variantClasses = [
  "bg-[linear-gradient(135deg,#fff7f5_0%,#ffffff_48%,#f8d5dc_100%)] text-landing-maroon",
  "bg-[linear-gradient(135deg,#ffffff_0%,#f7f2ed_52%,#d7cfc8_100%)] text-landing-ink",
  "bg-[linear-gradient(135deg,#2b170c_0%,#5b3315_52%,#c9a84c_100%)] text-landing-gold",
  "bg-[linear-gradient(135deg,#fffaf3_0%,#ead9ca_50%,#c8b59c_100%)] text-landing-ink",
  "bg-[linear-gradient(135deg,#10172a_0%,#1e2b4e_50%,#c9a84c_100%)] text-landing-gold",
  "bg-[linear-gradient(135deg,#ffffff_0%,#f7efe8_55%,#e6d8cc_100%)] text-landing-ink",
];

type ThemePreviewCardProps = {
  theme: LandingTheme;
  index: number;
  selected?: boolean;
  compact?: boolean;
  onSelect?: (theme: LandingTheme) => void;
};

export function ThemePreviewCard({ theme, index, selected = false, compact = false, onSelect }: ThemePreviewCardProps) {
  const content = (
    <>
      {theme.thumbnailUrl ? (
        <img src={theme.thumbnailUrl} alt={theme.name} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div
          className={cn(
            "relative flex h-full w-full flex-col items-center justify-center overflow-hidden",
            variantClasses[index % variantClasses.length],
          )}
        >
          <Flower2 className="absolute left-3 top-3 h-6 w-6 opacity-45" aria-hidden="true" />
          <Leaf className="absolute bottom-3 right-3 h-8 w-8 opacity-40" aria-hidden="true" />
          <div className="rounded-full border border-current/20 px-2 py-1 font-ui text-[9px] uppercase leading-none opacity-70">
            The Wedding Of
          </div>
          <div className="mt-2 text-center font-landing-serif text-xl leading-tight sm:text-2xl">
            Rizky
            <br />
            <span className="font-display text-2xl sm:text-3xl">&amp;</span>
            <br />
            Amara
          </div>
          <div className="mt-1 font-ui text-[10px] font-semibold opacity-70">12.12.2025</div>
        </div>
      )}
      {selected ? (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-landing-maroon text-white shadow-landing-button">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(theme)}
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-landing-card",
          compact ? "h-20" : "aspect-[4/3]",
          selected ? "border-landing-maroon ring-2 ring-landing-maroon/10" : "border-landing-border",
        )}
        aria-pressed={selected}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-landing-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-landing-card",
        compact ? "h-20" : "aspect-[4/3]",
      )}
    >
      {content}
    </div>
  );
}
