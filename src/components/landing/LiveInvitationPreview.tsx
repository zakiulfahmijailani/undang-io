"use client";

import { CalendarDays, ChevronDown, Flower2, Heart, Leaf, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_INVITATION_THEME_KEY,
  JAWA_AGUNG_THEME_KEY,
  OBSIDIAN_LUXE_THEME_KEY,
  PETAL_SOFT_THEME_KEY,
} from "@/lib/default-theme";
import { fatehaFontClassName } from "@/components/themes/fateha/fonts";
import { jawaAgungFontClassName } from "@/components/themes/jawa-agung/fonts";
import { obsidianLuxeFontClassName } from "@/components/themes/obsidian-luxe/fonts";
import { petalSoftFontClassName } from "@/components/themes/petal-soft/fonts";
import { MobilePhoneFrame } from "./MobilePhoneFrame";

type LiveInvitationPreviewProps = {
  groomName: string;
  brideName: string;
  selectedThemeKey: string;
};

type PreviewCoverProps = {
  groomName: string;
  brideName: string;
};

function PetalSoftCover({ groomName, brideName }: PreviewCoverProps) {
  return (
    <div className={cn("relative flex h-full flex-col items-center overflow-hidden bg-[#FDFAF8] px-7 pb-8 pt-16 text-center", petalSoftFontClassName)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(255,255,255,0.98),rgba(248,218,219,0.30)_62%,rgba(168,197,160,0.18))]" />
      <img src="/themes/petal-soft/floral-corner.png" alt="" className="absolute -left-12 -top-7 w-48 object-contain" />
      <img src="/themes/petal-soft/floral-corner.png" alt="" className="absolute -right-12 -top-7 w-48 scale-x-[-1] object-contain" />
      <img src="/themes/petal-soft/floral-bottom.png" alt="" className="absolute -bottom-8 left-1/2 w-[24rem] max-w-none -translate-x-1/2 object-contain" />
      <span className="absolute left-7 top-36 h-2 w-2 rounded-full bg-[#E8A0A0]/55" aria-hidden="true" />
      <span className="absolute right-8 top-48 h-1.5 w-1.5 rounded-full bg-[#E8A0A0]/45" aria-hidden="true" />

      <div className="relative z-10 flex h-full w-full flex-col items-center">
        <p className="text-[8px] font-bold uppercase tracking-[0.28em] text-[#9E8E8E] [font-family:var(--font-petal-soft-body)]">The Wedding Of</p>
        <div className="mt-12 text-[#C4919B] [font-family:var(--font-petal-soft-script)]">
          <span className="block text-[4rem] leading-[0.82]">{groomName}</span>
          <span className="my-2 block text-xl text-[#4A3F3F] [font-family:var(--font-petal-soft-serif)]">&amp;</span>
          <span className="block text-[4rem] leading-[0.82]">{brideName}</span>
        </div>
        <div className="mt-8 flex items-center gap-3 text-[#C4919B]" aria-hidden="true">
          <span className="h-px w-12 bg-[#E9C9C9]" />
          <Heart className="h-3.5 w-3.5 fill-[#F8DADB]" />
          <span className="h-px w-12 bg-[#E9C9C9]" />
        </div>
        <p className="mt-5 text-sm font-semibold text-[#4A3F3F] [font-family:var(--font-petal-soft-serif)]">Minggu, 12 Oktober 2026</p>
        <p className="mt-1 text-[10px] text-[#9E8E8E] [font-family:var(--font-petal-soft-body)]">Jakarta</p>
        <button type="button" tabIndex={-1} className="mt-auto mb-16 rounded-full bg-[#C4919B] px-7 py-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white shadow-lg [font-family:var(--font-petal-soft-body)]">
          Buka Undangan
        </button>
      </div>
    </div>
  );
}

function SakinahCover({ groomName, brideName }: PreviewCoverProps) {
  return (
    <div className={cn("relative flex h-full flex-col items-center overflow-hidden bg-[#EAF4FA] px-7 pb-8 pt-16 text-center text-[#19334A]", fatehaFontClassName)}>
      <div className="absolute inset-4 rounded-t-[8rem] border border-[#C3A36B]/60" />
      <div className="absolute inset-7 rounded-t-[7rem] border border-dashed border-[#C3A36B]/35" />
      <Leaf className="absolute -left-2 top-8 h-24 w-24 -rotate-12 text-[#9BB8A6]/60" aria-hidden="true" />
      <Flower2 className="absolute -right-2 top-10 h-20 w-20 text-white/80" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col items-center">
        <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#6C8192] [font-family:var(--font-fateha-body)]">Undangan Pernikahan</p>
        <div className="mt-16 text-[#B28A48] [font-family:var(--font-fateha-script)]">
          <span className="block text-[4.1rem] leading-[0.78]">{groomName}</span>
          <span className="my-3 block text-lg text-[#19334A] [font-family:var(--font-fateha-serif)]">dan</span>
          <span className="block text-[4.1rem] leading-[0.78]">{brideName}</span>
        </div>
        <div className="mt-8 h-px w-28 bg-[#C3A36B]/60" />
        <p className="mt-5 text-sm font-semibold [font-family:var(--font-fateha-serif)]">Minggu · 12 Oktober 2026</p>
        <button type="button" tabIndex={-1} className="mt-auto mb-8 rounded-full bg-[#B28A48] px-7 py-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white [font-family:var(--font-fateha-body)]">
          Buka Undangan
        </button>
      </div>
    </div>
  );
}

function ObsidianCover({ groomName, brideName }: PreviewCoverProps) {
  return (
    <div className={cn("relative flex h-full flex-col items-center overflow-hidden bg-[#050505] px-7 pb-8 pt-16 text-center text-[#F6EBD1]", obsidianLuxeFontClassName)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(217,180,87,0.18),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(217,180,87,0.10),transparent_38%)]" />
      <div className="absolute inset-4 border border-[#D9B457]/35" />
      <div className="absolute left-7 top-7 h-20 w-20 border-l border-t border-[#D9B457]/60" />
      <div className="absolute bottom-7 right-7 h-20 w-20 border-b border-r border-[#D9B457]/60" />
      <Sparkles className="absolute right-10 top-20 h-5 w-5 text-[#FFF1BB]" aria-hidden="true" />
      <Sparkles className="absolute bottom-40 left-10 h-3 w-3 text-[#D9B457]" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center">
        <p className="text-[8px] uppercase tracking-[0.34em] text-[#D9B457] [font-family:var(--font-obsidian-body)]">The Wedding Of</p>
        <div className="mt-16 bg-[linear-gradient(115deg,#916320,#FFF5C8_45%,#B67D24_72%,#FFE5A1)] bg-clip-text text-transparent [font-family:var(--font-obsidian-script)]">
          <span className="block text-[3.7rem] font-bold italic leading-[0.82]">{groomName}</span>
          <span className="my-3 block text-xl not-italic [font-family:var(--font-obsidian-heading)]">&amp;</span>
          <span className="block text-[3.7rem] font-bold italic leading-[0.82]">{brideName}</span>
        </div>
        <div className="mt-9 flex items-center gap-3 text-[#D9B457]">
          <span className="h-px w-12 bg-current" />
          <span className="rotate-45 border-4 border-current" />
          <span className="h-px w-12 bg-current" />
        </div>
        <p className="mt-5 text-xs tracking-[0.16em] [font-family:var(--font-obsidian-heading)]">12 · 10 · 2026</p>
        <button type="button" tabIndex={-1} className="mt-auto mb-8 border border-[#D9B457]/70 px-7 py-2.5 text-[9px] uppercase tracking-[0.2em] text-[#F3D889] [font-family:var(--font-obsidian-body)]">
          Buka Undangan
        </button>
      </div>
    </div>
  );
}

function JawaAgungCover({ groomName, brideName }: PreviewCoverProps) {
  return (
    <div className={cn("relative flex h-full flex-col items-center overflow-hidden bg-[#F5EDD6] px-7 pb-8 pt-16 text-center text-[#3D1F0A]", jawaAgungFontClassName)}>
      <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_center,#7B3F1A_1px,transparent_1px)] [background-size:12px_12px]" />
      <div className="absolute inset-4 border border-[#D4A843]/70" />
      <div className="absolute inset-7 border border-[#7B3F1A]/25" />
      <div className="absolute inset-x-8 top-7 h-16 rounded-t-full border-x border-t border-[#D4A843]/70" />
      <Flower2 className="absolute left-8 top-12 h-12 w-12 text-[#D4A843]/55" aria-hidden="true" />
      <Flower2 className="absolute right-8 top-12 h-12 w-12 text-[#D4A843]/55" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col items-center">
        <p className="text-[7px] font-bold uppercase tracking-[0.3em] text-[#7B3F1A] [font-family:var(--font-jawa-display)]">Pahargyan Temanten</p>
        <div className="mt-16 [font-family:var(--font-jawa-heading)]">
          <span className="block text-[4rem] font-bold leading-[0.8]">{groomName}</span>
          <span className="my-3 block text-xl italic text-[#C8922A]">&amp;</span>
          <span className="block text-[4rem] font-bold leading-[0.8]">{brideName}</span>
        </div>
        <div className="mt-9 h-px w-32 bg-[#D4A843]" />
        <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#7B3F1A] [font-family:var(--font-jawa-display)]">Minggu · 12 Oktober 2026</p>
        <p className="mt-2 text-xs italic text-[#7A5C3A] [font-family:var(--font-jawa-body)]">Jakarta</p>
        <button type="button" tabIndex={-1} className="mt-auto mb-8 border border-[#7B3F1A] bg-[#7B3F1A] px-7 py-2.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#F5EDD6] [font-family:var(--font-jawa-display)]">
          Buka Undangan
        </button>
      </div>
    </div>
  );
}

export function LiveInvitationPreview({ groomName, brideName, selectedThemeKey }: LiveInvitationPreviewProps) {
  const safeGroom = groomName.trim() || "Rizky";
  const safeBride = brideName.trim() || "Amara";
  const previewProps = { groomName: safeGroom, brideName: safeBride };

  let cover = <PetalSoftCover {...previewProps} />;
  if (selectedThemeKey === DEFAULT_INVITATION_THEME_KEY) cover = <SakinahCover {...previewProps} />;
  if (selectedThemeKey === OBSIDIAN_LUXE_THEME_KEY) cover = <ObsidianCover {...previewProps} />;
  if (selectedThemeKey === JAWA_AGUNG_THEME_KEY) cover = <JawaAgungCover {...previewProps} />;
  if (selectedThemeKey === PETAL_SOFT_THEME_KEY) cover = <PetalSoftCover {...previewProps} />;

  return (
    <div className="relative mx-auto w-full">
      <div className="mb-4 flex items-center justify-center gap-4 font-ui text-xs font-semibold text-landing-muted lg:justify-start">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-landing-border bg-white/85 px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-landing-success" aria-hidden="true" />
          Preview langsung
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-landing-maroon" aria-hidden="true" />
          12 Oktober 2026
        </span>
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <MapPin className="h-3.5 w-3.5 text-landing-maroon" aria-hidden="true" />
          Jakarta
        </span>
      </div>
      <div key={selectedThemeKey} className="animate-fade-in">
        <MobilePhoneFrame>{cover}</MobilePhoneFrame>
      </div>
      <ChevronDown className="mx-auto mt-4 h-5 w-5 animate-bounce text-landing-maroon/50" aria-hidden="true" />
    </div>
  );
}
