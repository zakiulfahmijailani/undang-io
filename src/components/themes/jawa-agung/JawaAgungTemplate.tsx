/* Jawa Agung wedding invitation renderer based on the traditional Javanese theme spec in the provided task attachment. */

"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Check, Copy, Gift, Heart, MapPin, MessageCircle, Navigation, Send, UserRound, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { FatehaEvent, FatehaGiftAccount, FatehaInvitationData, FatehaRsvpMessage, FatehaStoryItem } from "@/components/themes/fateha";
import { batikBorderSVG, cornerOrnamentSVG, dividerOrnamentSVG, melatiBulletSVG, wayangSilhouetteSVG } from "./ornaments";
import { jawaAgungFontClassName } from "./fonts";

type JawaAgungSectionId = "cover" | "quote" | "couple" | "story" | "event" | "gallery" | "rsvp" | "gift" | "closing";
type AttendanceChoice = "hadir" | "tidak_hadir" | "masih_ragu";
type RsvpFormState = {
  name: string;
  guests: string;
  attendance: AttendanceChoice | "";
  message: string;
};
type MessageResponseItem = {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
};
type MessageResponse = {
  data: { items: MessageResponseItem[] } | null;
  error: { message?: string } | null;
};

const DEFAULT_SECTION_ORDER: JawaAgungSectionId[] = ["cover", "quote", "couple", "event", "story", "gallery", "rsvp", "gift", "closing"];
const FALLBACK_ARABIC_QUOTE =
  "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً";

const sectionAliases: Record<string, JawaAgungSectionId> = {
  hero: "cover",
  cover: "cover",
  ayat: "quote",
  quote: "quote",
  mempelai: "couple",
  couple: "couple",
  love_story: "story",
  lovestory: "story",
  story: "story",
  acara: "event",
  event: "event",
  galeri: "gallery",
  gallery: "gallery",
  rsvp: "rsvp",
  gift: "gift",
  hadiah: "gift",
  footer: "closing",
  closing: "closing",
  penutup: "closing",
};

const navItems = [
  { href: "#cover", icon: UserRound, label: "Utama" },
  { href: "#couple", icon: Heart, label: "Mempelai" },
  { href: "#event", icon: CalendarDays, label: "Acara" },
  { href: "#rsvp", icon: MessageCircle, label: "RSVP" },
  { href: "#closing", icon: Gift, label: "Penutup" },
] as const;

const melatiParticles = Array.from({ length: 10 }, (_, index) => `melati-${index + 1}`);

const jawaAssets = {
  heroOrnament: { src: "/themes/jawa-agung/hero-ornament.webp", width: 1254, height: 1254 },
  batikKawungPanel: "/themes/jawa-agung/batik-kawung-panel.webp",
  janurKuning: { src: "/themes/jawa-agung/janur-kuning.webp", width: 1400, height: 788 },
  wayangArjuna: { src: "/themes/jawa-agung/wayang-arjuna.webp", width: 600, height: 1200 },
  melatiCloseup: { src: "/themes/jawa-agung/melati-closeup.webp", width: 1200, height: 675 },
  kerisOrnament: { src: "/themes/jawa-agung/keris-ornament.webp", width: 1200, height: 1200 },
  goldLeafTexture: "/themes/jawa-agung/gold-leaf-texture.webp",
} as const;

const jawaAgungStyles = `
.jawa-agung-theme {
  --jawa-bg-primary: #F5EDD6;
  --jawa-bg-secondary: #EDE0C0;
  --jawa-bg-card: #FAF4E6;
  --jawa-soga: #7B3F1A;
  --jawa-gold: #D4A843;
  --jawa-gold-deep: #C8922A;
  --jawa-green: #2C4A1E;
  --jawa-body: #2A1A0E;
  --jawa-muted: #7A5C3A;
  font-family: var(--font-jawa-body), Georgia, serif;
}
.jawa-agung-theme *, .jawa-agung-theme *::before, .jawa-agung-theme *::after { box-sizing: border-box; }
.jawa-agung-theme a { color: inherit; text-decoration: none; }
.jawa-agung-theme button, .jawa-agung-theme input, .jawa-agung-theme textarea, .jawa-agung-theme select { font: inherit; }
.jawa-agung-shell {
  max-width: 480px;
  margin: 0 auto;
  background: var(--jawa-bg-primary);
  color: var(--jawa-body);
  box-shadow: 0 30px 90px rgba(73, 38, 12, 0.16);
}
.jawa-paper {
  position: relative;
  isolation: isolate;
}
.jawa-paper::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url('${jawaAssets.goldLeafTexture}');
  background-size: 400px;
  opacity: .04;
  mix-blend-mode: multiply;
  pointer-events: none;
  animation: goldShimmer 8s ease-in-out infinite;
}
.jawa-kawung-texture {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url('${jawaAssets.batikKawungPanel}');
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  opacity: .08;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.jawa-cover-glow {
  background:
    radial-gradient(circle at 50% 36%, rgba(250, 244, 230, .96) 0 28%, rgba(245, 237, 214, .88) 52%, rgba(237, 224, 192, .76) 100%),
    linear-gradient(180deg, rgba(212, 168, 67, .08), rgba(123, 63, 26, .06));
}
.jawa-hero-ornament {
  filter: drop-shadow(0 22px 34px rgba(123, 63, 26, .16));
}
.jawa-janur {
  filter: drop-shadow(0 -18px 32px rgba(123, 63, 26, .16));
  mix-blend-mode: multiply;
}
.jawa-melati-corner {
  mix-blend-mode: multiply;
  mask-image: linear-gradient(135deg, #000 0%, rgba(0,0,0,.72) 48%, transparent 82%);
}
.jawa-wayang-image {
  mix-blend-mode: multiply;
}
.jawa-reveal {
  opacity: 0;
  transform: translateY(24px);
}
.jawa-revealed {
  animation: revealUp .8s ease-out forwards;
}
.jawa-divider svg path {
  stroke-dasharray: 320;
  stroke-dashoffset: 320;
  animation: drawLine 1.5s ease-out .18s forwards;
}
.jawa-display { font-family: var(--font-jawa-display), serif; }
.jawa-heading { font-family: var(--font-jawa-heading), Georgia, serif; }
.jawa-script { font-family: var(--font-jawa-script), cursive; }
.jawa-arabic { font-family: var(--font-jawa-arabic), serif; }
.jawa-batik svg, .jawa-divider svg, .jawa-corner svg, .jawa-wayang svg {
  width: 100%;
  height: 100%;
  display: block;
}
.jawa-corner {
  color: var(--jawa-gold);
  filter: drop-shadow(0 5px 12px rgba(123, 63, 26, .14));
}
.melati-particle {
  position: absolute;
  width: .84rem;
  height: .84rem;
  color: rgba(255, 255, 255, .9);
  filter: drop-shadow(0 4px 10px rgba(212, 168, 67, .35));
  opacity: 0;
  animation: melatiFloat 4s ease-in-out infinite;
}
.melati-particle:nth-child(1) { left: 8%; bottom: 8%; animation-duration: 3.2s; animation-delay: 0s; }
.melati-particle:nth-child(2) { left: 19%; bottom: 16%; animation-duration: 3.8s; animation-delay: .6s; }
.melati-particle:nth-child(3) { left: 31%; bottom: 11%; animation-duration: 4.2s; animation-delay: 1.2s; }
.melati-particle:nth-child(4) { left: 46%; bottom: 20%; animation-duration: 4.6s; animation-delay: 1.8s; }
.melati-particle:nth-child(5) { left: 62%; bottom: 7%; animation-duration: 5s; animation-delay: 2.4s; }
.melati-particle:nth-child(6) { left: 76%; bottom: 17%; animation-duration: 5.4s; animation-delay: 3s; }
.melati-particle:nth-child(7) { left: 87%; bottom: 10%; animation-duration: 5.8s; animation-delay: 3.6s; }
.melati-particle:nth-child(8) { left: 95%; bottom: 19%; animation-duration: 6.2s; animation-delay: 4.2s; }
.melati-particle:nth-child(9) { left: 14%; bottom: 24%; animation-duration: 4.4s; animation-delay: 4.8s; }
.melati-particle:nth-child(10) { left: 71%; bottom: 25%; animation-duration: 5.2s; animation-delay: 5.4s; }
.jawa-input {
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgba(212, 168, 67, .72);
  background: transparent;
  padding: .72rem 0;
  color: var(--jawa-body);
  outline: none;
}
.jawa-input::placeholder { color: rgba(122, 92, 58, .7); }
.jawa-input:focus { border-color: var(--jawa-soga); }
.jawa-radio-input:checked + .jawa-radio-mark {
  background: radial-gradient(circle at 50% 50%, var(--jawa-gold) 0 28%, transparent 30%), conic-gradient(from 45deg, transparent 0 15%, var(--jawa-soga) 15% 25%, transparent 25% 40%, var(--jawa-soga) 40% 50%, transparent 50% 65%, var(--jawa-soga) 65% 75%, transparent 75% 90%, var(--jawa-soga) 90%);
  border-color: var(--jawa-soga);
}
@keyframes melatiFloat {
  0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
  10% { opacity: .6; }
  90% { opacity: .4; }
  100% { transform: translateY(-80px) translateX(15px) rotate(45deg); opacity: 0; }
}
@keyframes goldShimmer {
  0%, 100% { opacity: .03; }
  50% { opacity: .07; }
}
@keyframes revealUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes drawLine {
  from { stroke-dashoffset: 320; }
  to { stroke-dashoffset: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .melati-particle,
  .jawa-reveal,
  .jawa-revealed,
  .gold-shimmer {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .jawa-paper::before,
  .jawa-divider svg path {
    animation: none !important;
    stroke-dashoffset: 0 !important;
  }
}
`;

function formatDate(value: string | null) {
  if (!value) return "Tanggal akan diumumkan";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function formatDateCompact(value: string | null) {
  if (!value) return "Tanggal menyusul";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const parts = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return [day, month, year].filter(Boolean).join(" • ");
}

function formatTime(event: FatehaEvent) {
  const value = event.time ?? event.date;
  if (!value) return "Waktu menyusul";
  if (/^\d{2}:\d{2}/.test(value)) return `${value.slice(0, 5)} WIB`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(date)} WIB`;
}

function cleanArabic(value: string | null | undefined) {
  if (!value || value.includes("Ã") || value.includes("Ù") || value.includes("Ø")) return FALLBACK_ARABIC_QUOTE;
  return value;
}

function getVisibleSections(data: FatehaInvitationData): JawaAgungSectionId[] {
  const order = Array.isArray(data.sections_order) && data.sections_order.length > 0 ? data.sections_order : DEFAULT_SECTION_ORDER;
  const normalized = order.map((section) => sectionAliases[section] ?? null).filter((section): section is JawaAgungSectionId => section !== null);
  const safeOrder = normalized.length > 0 ? normalized : DEFAULT_SECTION_ORDER;
  return safeOrder.filter((section) => isSectionVisible(data, section));
}

function isSectionVisible(data: FatehaInvitationData, section: JawaAgungSectionId) {
  const visibility = data.sections_visibility;
  if (!visibility) return true;
  if (visibility[section] === false) return false;
  return !Object.entries(sectionAliases).some(([alias, normalized]) => normalized === section && visibility[alias] === false);
}

function parentLine(kind: "Putra" | "Putri", father: string | null, mother: string | null) {
  if (!father && !mother) return `${kind} tercinta dari keluarga besar`;
  if (father && mother) return `${kind} dari ${father} dan ${mother}`;
  return `${kind} dari ${father ?? mother}`;
}

function closingGreetings(data: FatehaInvitationData) {
  const marker = `${data.quote.translation} ${data.quote.source} ${data.quote.arabic}`.toLowerCase();
  const isIslamic = /allah|ar-rum|assalamu|bismillah|rahmat|quran|qs\./i.test(marker);
  const isNonIslamic = /rahayu|pemberkatan|gereja|om swastiastu|namaste/i.test(marker);
  if (isIslamic) return ["Wassalamualaikum Warahmatullahi Wabarakatuh"];
  if (isNonIslamic) return ["Salam Rahayu"];
  return ["Wassalamualaikum Warahmatullahi Wabarakatuh", "Salam Rahayu"];
}

export function JawaAgungTemplate({ data }: { data: FatehaInvitationData }) {
  const sectionOrder = useMemo(() => getVisibleSections(data), [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("jawa-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    const elements = document.querySelectorAll(".jawa-reveal");
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sectionOrder]);

  return (
    <div className={cn("jawa-agung-theme min-h-screen bg-[#E8D6AD] text-[#2A1A0E]", jawaAgungFontClassName)}>
      <style>{jawaAgungStyles}</style>
      <FloatingMelati />
      <MusicToggle musicUrl={data.musicUrl} />
      <JawaNav />
      <main className="jawa-agung-shell">
        {sectionOrder.map((section) => {
          if (section === "cover") return <CoverSection key={section} data={data} />;
          if (section === "quote") return <OpeningQuoteSection key={section} data={data} />;
          if (section === "couple") return <CoupleSection key={section} data={data} />;
          if (section === "event") return <EventSection key={section} data={data} />;
          if (section === "story" && data.loveStory.length > 0) return <LoveStorySection key={section} items={data.loveStory} />;
          if (section === "gallery" && data.show_prewed_gallery !== false && data.gallery.length > 0) return <GallerySection key={section} data={data} />;
          if (section === "rsvp") return <RsvpSection key={section} data={data} />;
          if (section === "gift" && data.show_gift_section !== false && (data.giftAccounts.length > 0 || data.giftAddress)) return <GiftSection key={section} data={data} />;
          if (section === "closing") return <ClosingSection key={section} data={data} />;
          return null;
        })}
      </main>
    </div>
  );
}

function CoverSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="cover" className="jawa-paper jawa-cover-glow relative isolate flex min-h-svh flex-col overflow-hidden bg-[#F5EDD6] text-center">
      <BatikStrip className="text-[#D4A843]" />
      <CornerOrnaments />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-7 py-16 pb-28 md:pb-36">
        <p className="jawa-display text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#7B3F1A]">Undangan Pernikahan</p>
        <div className="mt-8 grid w-full place-items-center">
          <h1 className="jawa-script text-[clamp(3.8rem,16vw,6.8rem)] leading-[0.82] text-[#D4A843] drop-shadow-[0_8px_18px_rgba(123,63,26,0.14)]">
            <span className="block">{data.bride.nickname}</span>
            <span className="jawa-heading block py-3 text-3xl italic leading-none text-[#7B3F1A]">&amp;</span>
            <span className="block">{data.groom.nickname}</span>
          </h1>
        </div>
        <img
          src={jawaAssets.heroOrnament.src}
          alt=""
          width={jawaAssets.heroOrnament.width}
          height={jawaAssets.heroOrnament.height}
          loading="lazy"
          decoding="async"
          role="presentation"
          aria-hidden="true"
          className="jawa-hero-ornament gold-shimmer mt-8 w-[min(300px,80vw)] opacity-90"
        />
        <Divider className="mt-10 w-72 max-w-full text-[#D4A843]" />
        <p className="jawa-heading mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#7B3F1A]">{formatDateCompact(data.wedding.date)}</p>
        <p className="mx-auto mt-5 max-w-xs text-sm leading-7 text-[#7A5C3A]">
          Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia kami.
        </p>
      </div>
      <img
        src={jawaAssets.janurKuning.src}
        alt=""
        width={jawaAssets.janurKuning.width}
        height={jawaAssets.janurKuning.height}
        loading="lazy"
        decoding="async"
        role="presentation"
        aria-hidden="true"
        className="jawa-janur pointer-events-none absolute inset-x-0 bottom-16 z-0 hidden h-[120px] w-full object-contain opacity-45 md:block"
      />
      <BatikStrip className="rotate-180 text-[#D4A843]" />
    </section>
  );
}

function OpeningQuoteSection({ data }: { data: FatehaInvitationData }) {
  const quoteText = data.quote.translation.trim();
  const quoteSource = data.quote.source.trim();
  if (!quoteText && !quoteSource && !data.quote.arabic) return null;

  return (
    <section id="quote" className="jawa-paper jawa-reveal relative isolate overflow-hidden bg-[#EDE0C0] px-7 py-20 text-center">
      <div className="jawa-kawung-texture" aria-hidden="true" />
      <CornerOrnaments subtle />
      <SvgOrnament svg={wayangSilhouetteSVG} className="jawa-wayang pointer-events-none absolute -right-12 top-8 h-72 w-36 text-[#7B3F1A] opacity-[0.035]" />
      <div className="relative mx-auto max-w-xl">
        <Divider className="mx-auto mb-8 w-64 text-[#D4A843]" />
        <p className="jawa-arabic text-4xl leading-relaxed text-[#7B3F1A]">{cleanArabic(data.quote.arabic)}</p>
        {quoteText ? <p className="mx-auto mt-6 max-w-md text-base italic leading-8 text-[#7A5C3A]">&ldquo;{quoteText}&rdquo;</p> : null}
        {quoteSource ? <p className="jawa-display mt-5 text-[0.64rem] font-bold uppercase tracking-[0.28em] text-[#7B3F1A]">{quoteSource}</p> : null}
        <Divider className="mx-auto mt-8 w-64 rotate-180 text-[#D4A843]" />
      </div>
    </section>
  );
}

function CoupleSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="couple" className="jawa-paper jawa-reveal relative isolate overflow-hidden bg-[#FAF4E6] px-7 py-20">
      <img
        src={jawaAssets.melatiCloseup.src}
        alt=""
        width={jawaAssets.melatiCloseup.width}
        height={jawaAssets.melatiCloseup.height}
        loading="lazy"
        decoding="async"
        role="presentation"
        aria-hidden="true"
        className="jawa-melati-corner pointer-events-none absolute -right-20 top-6 z-0 w-[200px] opacity-[0.12]"
      />
      <SectionHeading eyebrow="Mempelai" title="Dua Keluarga, Satu Restu" />
      <div className="mx-auto mt-12 grid max-w-xl gap-12 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-7">
        <PersonCard kind="Putri" person={data.bride} showPhoto={data.show_couple_photos !== false} />
        <div className="jawa-heading hidden text-5xl italic text-[#D4A843] sm:block" aria-hidden="true">❧</div>
        <PersonCard kind="Putra" person={data.groom} showPhoto={data.show_couple_photos !== false} />
      </div>
    </section>
  );
}

function PersonCard({ kind, person, showPhoto }: { kind: "Putra" | "Putri"; person: FatehaInvitationData["bride"]; showPhoto: boolean }) {
  return (
    <article className="text-center">
      {showPhoto ? (
        <div className="mx-auto h-44 w-44 rounded-full border-2 border-[#7B3F1A] bg-[#EDE0C0] p-1 shadow-[0_22px_46px_rgba(123,63,26,0.18)] outline outline-2 outline-offset-[6px] outline-[#D4A843]">
          <img src={person.photo} alt={`Foto ${person.nickname}`} className="h-full w-full rounded-full object-cover sepia-[0.16]" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <p className="jawa-display mt-8 text-[0.62rem] font-bold uppercase tracking-[0.26em] text-[#7B3F1A]">{kind}</p>
      <h3 className="jawa-heading mt-3 text-3xl font-bold text-[#7B3F1A]">{person.fullName}</h3>
      <Divider className="mx-auto my-4 w-40 text-[#D4A843]" />
      <p className="text-sm italic leading-7 text-[#7A5C3A]">{parentLine(kind, person.father, person.mother)}</p>
    </article>
  );
}

function LoveStorySection({ items }: { items: FatehaStoryItem[] }) {
  return (
    <section id="story" className="jawa-paper jawa-reveal relative isolate overflow-hidden bg-[#F5EDD6] px-7 py-20">
      <SectionHeading eyebrow="Kisah" title="Langkah Menuju Janji" />
      <div className="mx-auto mt-12 max-w-xl border-l border-dashed border-[#7B3F1A]/45 pl-7">
        {items.map((item, index) => (
          <article key={`${item.year}-${item.title}-${index}`} className="relative mb-7 bg-[#FAF4E6]/78 p-5 shadow-[0_18px_36px_rgba(123,63,26,0.08)]">
            <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner absolute -left-[2.35rem] top-5 h-6 w-6 rotate-45 bg-[#F5EDD6]" />
            <p className="jawa-display text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#D4A843]">{item.year}</p>
            <h3 className="jawa-heading mt-3 text-2xl font-bold text-[#7B3F1A]">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#2A1A0E]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventSection({ data }: { data: FatehaInvitationData }) {
  const showKeris = Boolean(data.wedding.akad.date && data.wedding.reception.date);

  return (
    <section id="event" className="jawa-paper jawa-reveal relative isolate overflow-hidden bg-[#EDE0C0] px-7 py-20">
      <SectionHeading eyebrow="Rangkaian Acara" title="Hari Bahagia" />
      <div className={cn("mx-auto mt-12 grid max-w-xl gap-5 sm:items-center", showKeris ? "sm:grid-cols-[1fr_60px_1fr]" : "sm:grid-cols-2")}>
        <EventCard event={data.wedding.akad} title="Akad Nikah" />
        {showKeris ? (
          <img
            src={jawaAssets.kerisOrnament.src}
            alt=""
            width={jawaAssets.kerisOrnament.width}
            height={jawaAssets.kerisOrnament.height}
            loading="lazy"
            decoding="async"
            role="presentation"
            aria-hidden="true"
            className="hidden w-[60px] rotate-45 rounded-full border border-[#D4A843]/50 object-cover opacity-60 shadow-[0_18px_30px_rgba(123,63,26,0.16)] sm:block"
          />
        ) : null}
        <EventCard event={data.wedding.reception} title="Resepsi" />
      </div>
    </section>
  );
}

function EventCard({ event, title }: { event: FatehaEvent; title: string }) {
  return (
    <article className="relative overflow-hidden border border-[#D4A843]/50 bg-[#FAF4E6] p-5 shadow-[0_18px_40px_rgba(123,63,26,0.1)]">
      <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner absolute left-3 top-3 h-10 w-10 opacity-55" />
      <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner absolute right-3 top-3 h-10 w-10 scale-x-[-1] opacity-55" />
      <div className="relative z-10 pt-4 text-center">
        <p className="jawa-display text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#7B3F1A]">{title}</p>
        <h3 className="jawa-heading mt-5 text-2xl font-bold text-[#7B3F1A]">{formatDate(event.date)}</h3>
        <p className="mt-3 text-sm text-[#7A5C3A]">{formatTime(event)}</p>
        <Divider className="mx-auto my-5 w-36 text-[#D4A843]" />
        <p className="jawa-heading text-xl font-semibold text-[#2A1A0E]">{event.venue}</p>
        <p className="mt-2 text-sm leading-6 text-[#7A5C3A]">{event.address}</p>
        {event.mapsUrl ? (
          <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="jawa-display mt-6 inline-flex items-center justify-center gap-2 border border-[#7B3F1A] px-4 py-3 text-[0.63rem] font-bold uppercase tracking-[0.18em] text-[#7B3F1A] transition hover:bg-[#7B3F1A] hover:text-[#F5EDD6]">
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Lihat Lokasi
          </a>
        ) : null}
      </div>
    </article>
  );
}

function GallerySection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="gallery" className="jawa-paper jawa-reveal relative isolate overflow-hidden bg-[#FAF4E6] px-7 py-20">
      <SectionHeading eyebrow="Kenangan Kami" title="Galeri" />
      <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-3">
        {data.gallery.slice(0, 6).map((item, index) => (
          <figure key={`${item.src}-${index}`} className="group overflow-hidden border border-[#D4A843]/35 bg-[#EDE0C0]">
            <img src={item.src} alt={item.alt} className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105 group-hover:sepia-[0.2]" loading="lazy" decoding="async" />
            {item.caption ? <figcaption className="px-3 py-2 text-center text-xs italic text-[#7A5C3A]">{item.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function RsvpSection({ data }: { data: FatehaInvitationData }) {
  const [form, setForm] = useState<RsvpFormState>({ name: "", guests: "1", attendance: "", message: "" });
  const [messages, setMessages] = useState<FatehaRsvpMessage[]>(data.rsvpMessages);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canSubmit = Boolean(data.slug) && !data.isPreview;

  useEffect(() => {
    if (!data.slug || data.isPreview) return;
    let isMounted = true;

    async function loadMessages() {
      try {
        const response = await fetch(`/api/public/invitations/${data.slug}/messages`);
        const json = (await response.json()) as MessageResponse;
        if (!response.ok || !json.data || !isMounted) return;
        setMessages(
          json.data.items.map((item) => ({
            id: item.id,
            name: item.guest_name,
            attendance: null,
            message: item.message,
            createdAt: item.created_at,
          })),
        );
      } catch {
        // Keep seed messages visible when public messages are unavailable.
      }
    }

    void loadMessages();
    return () => {
      isMounted = false;
    };
  }, [data.isPreview, data.slug]);

  function update<K extends keyof RsvpFormState>(key: K, value: RsvpFormState[K]) {
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.attendance) {
      setError("Mohon lengkapi nama dan status kehadiran.");
      return;
    }

    if (!canSubmit || !data.slug) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/public/invitations/${data.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: form.name.trim(),
          attendance_status: form.attendance,
          number_of_guests: Number.parseInt(form.guests, 10),
          message: form.message.trim(),
        }),
      });
      const json = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) throw new Error(json.error?.message || "Konfirmasi belum dapat dikirim.");

      if (form.message.trim()) {
        await fetch(`/api/public/invitations/${data.slug}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guest_name: form.name.trim(), message: form.message.trim() }),
        });
      }

      setMessages((current) => [
        {
          id: `local-${Date.now()}`,
          name: form.name.trim(),
          attendance: form.attendance,
          message: form.message.trim() || "Terima kasih, kami akan hadir.",
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      setSubmitted(true);
      toast.success("Konfirmasi berhasil dikirim.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Konfirmasi belum dapat dikirim.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="rsvp" className="jawa-paper jawa-reveal relative isolate overflow-hidden bg-[#EDE0C0] px-7 py-20">
      <div className="jawa-kawung-texture" aria-hidden="true" />
      <BatikStrip className="absolute inset-x-0 top-0 text-[#D4A843]" />
      <BatikStrip className="absolute inset-x-0 bottom-0 rotate-180 text-[#D4A843]" />
      <SectionHeading eyebrow="Konfirmasi Kehadiran" title="Kehadiran Anda" subtitle="Kehadiran Anda adalah kehormatan bagi kami." />
      <div className="mx-auto mt-10 max-w-xl border border-[#D4A843]/45 bg-[#FAF4E6]/82 p-5 shadow-[0_20px_42px_rgba(123,63,26,0.1)]">
        {submitted ? (
          <div className="py-10 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#7B3F1A] text-[#F5EDD6]">
              <Check className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="jawa-heading mt-5 text-4xl font-semibold text-[#7B3F1A]">Terima Kasih</h3>
            <p className="mt-3 text-sm leading-6 text-[#7A5C3A]">
              {canSubmit ? "Konfirmasi dan doa Anda telah kami terima." : "Ini adalah pratinjau. Form aktif setelah undangan dipublikasikan permanen."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <JawaField label="Nama">
              <input className="jawa-input" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Masukkan nama Anda" autoComplete="name" />
            </JawaField>
            <JawaField label="Jumlah Tamu">
              <select className="jawa-input" value={form.guests} onChange={(event) => update("guests", event.target.value)}>
                {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} orang</option>)}
              </select>
            </JawaField>
            <div>
              <p className="jawa-display mb-3 text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#7B3F1A]">Kehadiran</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ["hadir", "Hadir"],
                  ["tidak_hadir", "Tidak Hadir"],
                  ["masih_ragu", "Masih Ragu"],
                ].map(([value, label]) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2 border border-[#D4A843]/35 bg-[#F5EDD6]/55 px-3 py-3 text-xs font-semibold text-[#7B3F1A]">
                    <input
                      type="radio"
                      name="attendance"
                      value={value}
                      checked={form.attendance === value}
                      onChange={(event) => update("attendance", event.target.value as AttendanceChoice)}
                      className="jawa-radio-input sr-only"
                    />
                    <span className="jawa-radio-mark h-4 w-4 rounded-full border border-[#D4A843]" aria-hidden="true" />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <JawaField label="Pesan / Ucapan">
              <textarea className="jawa-input min-h-28 resize-none" value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tulis doa atau ucapan untuk kami..." />
            </JawaField>
            {error ? <p className="border border-[#7B3F1A]/20 bg-[#EDE0C0] px-4 py-3 text-sm text-[#7B3F1A]">{error}</p> : null}
            <button type="submit" className="jawa-display inline-flex items-center justify-center gap-2 bg-[#7B3F1A] px-6 py-4 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-[#F5EDD6] transition hover:bg-[#C8922A] hover:text-[#2A1A0E]" disabled={loading}>
              <Send className="h-4 w-4" aria-hidden="true" />
              {loading ? "Mengirim" : "Kirim Konfirmasi"}
            </button>
          </form>
        )}
      </div>
      {messages.length > 0 ? (
        <div className="mx-auto mt-9 grid max-w-xl gap-3">
          {messages.slice(0, 4).map((message) => (
            <article key={message.id} className="border border-[#D4A843]/30 bg-[#FAF4E6]/72 p-4">
              <strong className="text-sm text-[#7B3F1A]">{message.name}</strong>
              <p className="mt-2 text-sm italic leading-6 text-[#7A5C3A]">&ldquo;{message.message}&rdquo;</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function GiftSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="gift" className="jawa-paper jawa-reveal relative isolate overflow-hidden bg-[#FAF4E6] px-7 py-20">
      <SectionHeading eyebrow="Doa & Hadiah" title="Amplop Digital" subtitle="Doa restu Anda adalah hadiah yang paling bermakna bagi kami." />
      <div className="mx-auto mt-10 grid max-w-xl gap-4">
        {data.giftAccounts.map((account) => <GiftAccountCard key={`${account.bank}-${account.number}`} account={account} />)}
        {data.giftAddress ? (
          <article className="relative border border-[#D4A843]/45 bg-[#EDE0C0] p-5 text-center">
            <MapPin className="mx-auto h-7 w-7 text-[#7B3F1A]" aria-hidden="true" />
            <h3 className="jawa-heading mt-3 text-2xl font-semibold text-[#7B3F1A]">Alamat Hadiah</h3>
            <p className="mt-3 text-sm leading-7 text-[#7A5C3A]">{data.giftAddress}</p>
          </article>
        ) : null}
      </div>
    </section>
  );
}

function GiftAccountCard({ account }: { account: FatehaGiftAccount }) {
  return (
    <article className="relative overflow-hidden border border-[#D4A843]/50 bg-[#EDE0C0] p-5 text-center">
      <CornerOrnaments small />
      <p className="jawa-display text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#7B3F1A]">{account.bank}</p>
      <strong className="jawa-heading mt-4 block text-3xl font-bold text-[#2A1A0E]">{account.number}</strong>
      <p className="mt-2 text-sm text-[#7A5C3A]">a.n. {account.name}</p>
      <button
        type="button"
        className="mt-5 inline-flex items-center justify-center gap-2 border border-[#7B3F1A] px-4 py-3 text-xs font-semibold text-[#7B3F1A] transition hover:bg-[#7B3F1A] hover:text-[#F5EDD6]"
        onClick={() => {
          void navigator.clipboard.writeText(account.number);
          toast.success("Nomor rekening disalin.");
        }}
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
        Salin Rekening
      </button>
    </article>
  );
}

function ClosingSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="closing" className="jawa-paper jawa-reveal relative isolate overflow-hidden bg-[#EDE0C0] px-7 py-24 pb-36 text-center">
      <BatikStrip className="absolute inset-x-0 top-0 text-[#D4A843]" />
      <img
        src={jawaAssets.wayangArjuna.src}
        alt=""
        width={jawaAssets.wayangArjuna.width}
        height={jawaAssets.wayangArjuna.height}
        loading="lazy"
        decoding="async"
        role="presentation"
        aria-hidden="true"
        className="jawa-wayang-image pointer-events-none absolute right-[-5rem] top-1/2 h-[80%] w-auto -translate-y-1/2 opacity-[0.06]"
      />
      <div className="relative mx-auto max-w-xl">
        <Divider className="mx-auto w-72 max-w-full text-[#D4A843]" />
        <div className="mt-10 grid gap-3">
          {closingGreetings(data).map((greeting) => (
            <p key={greeting} className={cn("leading-tight", greeting === "Salam Rahayu" ? "jawa-heading text-3xl italic text-[#7B3F1A]" : "jawa-script text-5xl text-[#D4A843]")}>
              {greeting}
            </p>
          ))}
        </div>
        <h2 className="jawa-script mt-12 text-6xl leading-none text-[#7B3F1A]">
          {data.bride.fullName}
          <span className="jawa-heading block py-3 text-2xl italic text-[#D4A843]">&amp;</span>
          {data.groom.fullName}
        </h2>
        <p className="mx-auto mt-8 max-w-md text-sm italic leading-7 text-[#7A5C3A]">
          Terima kasih atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i pada hari bahagia kami.
        </p>
      </div>
      <BatikStrip className="absolute inset-x-0 bottom-0 rotate-180 text-[#D4A843]" />
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <header className="mx-auto max-w-xl text-center">
      <p className="jawa-display text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#7B3F1A]">{eyebrow}</p>
      <h2 className="jawa-heading mt-4 text-4xl font-bold text-[#7B3F1A]">{title}</h2>
      <Divider className="mx-auto my-5 w-56 text-[#D4A843]" />
      {subtitle ? <p className="text-sm italic leading-7 text-[#7A5C3A]">{subtitle}</p> : null}
    </header>
  );
}

function JawaField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="jawa-display text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#7B3F1A]">{label}</span>
      {children}
    </label>
  );
}

function JawaNav() {
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[min(calc(100%_-_1rem),430px)] items-center justify-center border border-[#D4A843]/55 bg-[#FAF4E6]/90 p-1 shadow-[0_18px_45px_rgba(123,63,26,0.16)] backdrop-blur-xl">
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#7A5C3A] transition hover:bg-[#EDE0C0] hover:text-[#7B3F1A]">
          <item.icon className="h-4 w-4" aria-hidden="true" />
          <span className="truncate">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function MusicToggle({ musicUrl }: { musicUrl: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !musicUrl) return;

    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [musicUrl, playing]);

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />
      <button
        type="button"
        aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
        onClick={() => setPlaying((current) => !current)}
        className={cn(
          "fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center border border-[#D4A843] bg-[#FAF4E6]/92 text-[#7B3F1A] shadow-[0_14px_36px_rgba(123,63,26,0.18)] backdrop-blur-xl transition hover:bg-[#EDE0C0]",
          playing && "bg-[#7B3F1A] text-[#F5EDD6]",
        )}
      >
        {playing ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
      </button>
    </>
  );
}

function FloatingMelati() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {melatiParticles.map((item) => <SvgOrnament key={item} svg={melatiBulletSVG} className="melati-particle" />)}
    </div>
  );
}

function BatikStrip({ className }: { className?: string }) {
  return <SvgOrnament svg={batikBorderSVG} className={cn("jawa-batik h-6 w-full shrink-0", className)} />;
}

function Divider({ className }: { className?: string }) {
  return <SvgOrnament svg={dividerOrnamentSVG} className={cn("jawa-divider h-9", className)} />;
}

function CornerOrnaments({ subtle = false, small = false }: { subtle?: boolean; small?: boolean }) {
  const size = small ? "h-10 w-10" : "h-16 w-16";
  const opacity = subtle ? "opacity-35" : "opacity-75";
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <SvgOrnament svg={cornerOrnamentSVG} className={cn("jawa-corner absolute left-4 top-4", size, opacity)} />
      <SvgOrnament svg={cornerOrnamentSVG} className={cn("jawa-corner absolute right-4 top-4 scale-x-[-1]", size, opacity)} />
      <SvgOrnament svg={cornerOrnamentSVG} className={cn("jawa-corner absolute bottom-4 left-4 scale-y-[-1]", size, opacity)} />
      <SvgOrnament svg={cornerOrnamentSVG} className={cn("jawa-corner absolute bottom-4 right-4 scale-x-[-1] scale-y-[-1]", size, opacity)} />
    </div>
  );
}

function SvgOrnament({ svg, className }: { svg: string; className?: string }) {
  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}
