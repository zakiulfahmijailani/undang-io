/* Theme preview card used by the Landing Page undang-io mockup. */

import { Check, Flower2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LandingTheme } from "./types";
import { DEFAULT_INVITATION_THEME_KEY, JAWA_AGUNG_THEME_KEY, OBSIDIAN_LUXE_THEME_KEY, PETAL_SOFT_THEME_KEY } from "@/lib/default-theme";

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
          <img src="/themes/petal-soft/floral-corner.png" alt="" className={cn("absolute -left-7 -top-5 object-contain", compact ? "w-28" : "w-44")} loading="lazy" />
          <img src="/themes/petal-soft/floral-corner.png" alt="" className={cn("absolute -right-7 -top-5 scale-x-[-1] object-contain", compact ? "w-28" : "w-44")} loading="lazy" />
          <img src="/themes/petal-soft/floral-bottom.png" alt="" className={cn("absolute -bottom-5 left-1/2 max-w-none -translate-x-1/2 object-contain opacity-85", compact ? "w-56" : "w-[22rem]")} loading="lazy" />
          <div className="relative text-center">
            <span className={cn("block font-display leading-none text-[#C4919B]", compact ? "text-2xl" : "text-5xl")}>Petal</span>
            <span className={cn("block font-display leading-none text-[#C4919B]", compact ? "text-2xl" : "text-5xl")}>Soft</span>
            <span className="mx-auto mt-2 block h-px w-10 bg-[#C4919B]/45" />
            <span className={cn("mt-2 block font-ui font-semibold uppercase text-[#9E8E8E]", compact ? "text-[6px] tracking-[0.14em]" : "text-[8px] tracking-[0.22em]")}>
              Floral Pastel
            </span>
          </div>
        </div>
      ) : theme.slug === OBSIDIAN_LUXE_THEME_KEY || theme.id === OBSIDIAN_LUXE_THEME_KEY ? (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] text-[#C9A84C]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.22),transparent_40%),radial-gradient(circle_at_bottom,rgba(232,213,163,0.1),transparent_48%)]" />
          <div className="absolute inset-3 border border-[#C9A84C]/30" />
          <div className="absolute left-3 top-3 h-10 w-10 border-l border-t border-[#C9A84C]/45" />
          <div className="absolute bottom-3 right-3 h-10 w-10 border-b border-r border-[#C9A84C]/45" />
          <div className="relative text-center">
            <span className={cn("block font-landing-serif font-semibold italic leading-none text-[#C9A84C]", compact ? "text-2xl" : "text-5xl")}>Obsidian</span>
            <span className={cn("block font-landing-serif font-semibold italic leading-none text-[#E8D5A3]", compact ? "text-2xl" : "text-5xl")}>Luxe</span>
            <span className="mx-auto mt-3 block h-px w-12 bg-[#C9A84C]/55" />
            <span className={cn("mt-3 block font-ui font-semibold uppercase text-[#8A8070]", compact ? "text-[6px] tracking-[0.14em]" : "text-[8px] tracking-[0.22em]")}>
              Dark Gold
            </span>
          </div>
        </div>
      ) : theme.slug === JAWA_AGUNG_THEME_KEY || theme.id === JAWA_AGUNG_THEME_KEY ? (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#F5EDD6] text-[#7B3F1A]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,168,67,0.24),transparent_38%),radial-gradient(circle_at_bottom,rgba(44,74,30,0.12),transparent_46%)]" />
          <div className="absolute inset-x-0 top-0 h-5 bg-[repeating-linear-gradient(90deg,rgba(212,168,67,0.85)_0_8px,transparent_8px_16px)] opacity-70" />
          <div className="absolute inset-x-0 bottom-0 h-5 bg-[repeating-linear-gradient(90deg,rgba(212,168,67,0.85)_0_8px,transparent_8px_16px)] opacity-70" />
          <div className="absolute inset-4 border border-[#D4A843]/45" />
          <div className="absolute left-4 top-4 h-10 w-10 border-l border-t border-[#7B3F1A]/50" />
          <div className="absolute bottom-4 right-4 h-10 w-10 border-b border-r border-[#7B3F1A]/50" />
          <div className="relative text-center">
            <span className={cn("block font-landing-serif font-semibold leading-none text-[#7B3F1A]", compact ? "text-2xl" : "text-5xl")}>Jawa</span>
            <span className={cn("block font-display leading-none text-[#D4A843]", compact ? "text-2xl" : "text-5xl")}>Agung</span>
            <span className="mx-auto mt-3 block h-px w-12 bg-[#D4A843]/70" />
            <span className={cn("mt-3 block font-ui font-semibold uppercase text-[#7A5C3A]", compact ? "text-[6px] tracking-[0.14em]" : "text-[8px] tracking-[0.22em]")}>
              Batik Klasik
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
