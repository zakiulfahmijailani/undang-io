/* Theme preview card used by the Landing Page undang-io mockup. */

import { Check, Flower2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LandingTheme } from "./types";
import { DEFAULT_INVITATION_THEME_KEY, PETAL_SOFT_THEME_KEY } from "@/lib/default-theme";

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
  groomName?: string;
  brideName?: string;
  onSelect?: (theme: LandingTheme) => void;
};

export function ThemePreviewCard({ theme, index, selected = false, compact = false, groomName, brideName, onSelect }: ThemePreviewCardProps) {
  const content = (
    <>
      {theme.thumbnailUrl ? (
        <img src={theme.thumbnailUrl} alt={theme.name} className="h-full w-full object-cover" loading="lazy" />
      ) : theme.slug === PETAL_SOFT_THEME_KEY || theme.id === PETAL_SOFT_THEME_KEY ? (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#FDFAF8] text-[#C4919B]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,218,219,0.95),transparent_34%),radial-gradient(circle_at_bottom,rgba(168,197,160,0.32),transparent_42%)]" />
          <Flower2 className={cn("absolute left-2 top-2 opacity-45", compact ? "h-6 w-6" : "h-9 w-9")} aria-hidden="true" />
          <Flower2 className={cn("absolute right-2 top-3 rotate-45 opacity-35", compact ? "h-7 w-7" : "h-11 w-11")} aria-hidden="true" />
          <Leaf className={cn("absolute bottom-2 left-3 -rotate-12 text-[#A8C5A0] opacity-55", compact ? "h-7 w-7" : "h-12 w-12")} aria-hidden="true" />
          <Leaf className={cn("absolute bottom-2 right-3 rotate-12 text-[#A8C5A0] opacity-55", compact ? "h-7 w-7" : "h-12 w-12")} aria-hidden="true" />
          <div className="relative text-center">
            <span className={cn("block font-display leading-none text-[#C4919B]", compact ? "text-2xl" : "text-5xl")}>Petal</span>
            <span className={cn("block font-display leading-none text-[#C4919B]", compact ? "text-2xl" : "text-5xl")}>Soft</span>
            <span className="mx-auto mt-2 block h-px w-10 bg-[#C4919B]/45" />
            <span className={cn("mt-2 block font-ui font-semibold uppercase text-[#9E8E8E]", compact ? "text-[6px] tracking-[0.14em]" : "text-[8px] tracking-[0.22em]")}>
              Floral Pastel
            </span>
          </div>
        </div>
      ) : theme.slug === DEFAULT_INVITATION_THEME_KEY || theme.id === DEFAULT_INVITATION_THEME_KEY ? (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#14213D] via-[#1e305a] to-[#14213D]">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_50%)]" />
           <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full border border-[#C3A36B]/20 bg-[#C3A36B]/5 blur-sm" />
           <div className="absolute -bottom-6 -right-6 h-20 w-20 rounded-full border border-white/10 bg-white/5 blur-sm" />
           <div className="relative flex flex-col items-center justify-center text-center p-2 rounded-xl border border-[#C3A36B]/20 bg-white/5 backdrop-blur-sm shadow-xl">
             <span className={cn("font-serif font-semibold text-[#C3A36B] leading-none mb-1", compact ? "text-xl" : "text-3xl")}>SS</span>
             <span className={cn("h-px bg-[#C3A36B]/50 mb-1.5", compact ? "w-5" : "w-8")} />
             <span className={cn("font-semibold uppercase text-[#9bb0c7]", compact ? "text-[6px] tracking-[0.15em]" : "text-[8px] tracking-[0.25em]")}>Sakinah</span>
           </div>
        </div>
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
            {groomName || "Mempelai Pria"}
            <br />
            <span className="font-display text-2xl sm:text-3xl">&amp;</span>
            <br />
            {brideName || "Mempelai Wanita"}
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
