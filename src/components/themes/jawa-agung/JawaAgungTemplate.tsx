/* Full-page Jawa Agung royal Javanese wedding invitation renderer based on the June 5 visual implementation spec. */

"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Gift, Heart, MapPin, MessageCircle, Navigation, Send, UserRound, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import type { FatehaEvent, FatehaGiftAccount, FatehaInvitationData, FatehaRsvpMessage, FatehaStoryItem } from "@/components/themes/fateha";
import { cn } from "@/lib/utils";
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

const DEFAULT_SECTION_ORDER: JawaAgungSectionId[] = ["cover", "quote", "couple", "story", "event", "gallery", "rsvp", "gift", "closing"];
const FALLBACK_ARABIC_QUOTE =
  "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً";

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
  { href: "#event", icon: Gift, label: "Acara" },
  { href: "#rsvp", icon: MessageCircle, label: "RSVP" },
  { href: "#closing", icon: Gift, label: "Penutup" },
] as const;

const melatiParticles = Array.from({ length: 10 }, (_, index) => `melati-${index + 1}`);

const jawaAssets = {
  heroOrnament: { src: "/themes/jawa-agung/hero-ornament.webp", width: 1254, height: 1254 },
  batikKawungPanel: { src: "/themes/jawa-agung/batik-kawung-panel.webp", width: 1400, height: 933 },
  janurKuning: { src: "/themes/jawa-agung/janur-kuning.webp", width: 933, height: 1400 },
  wayangArjuna: { src: "/themes/jawa-agung/wayang-arjuna.webp", width: 800, height: 1200 },
  melatiCloseup: { src: "/themes/jawa-agung/melati-closeup.webp", width: 1200, height: 900 },
  kerisOrnament: { src: "/themes/jawa-agung/keris-ornament.webp", width: 1400, height: 933 },
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
  max-width: 520px;
  margin: 0 auto;
  background: var(--jawa-bg-primary);
  color: var(--jawa-body);
  box-shadow: 0 30px 100px rgba(73, 38, 12, 0.22);
  overflow: hidden;
}
.jawa-section {
  position: relative;
  min-height: 100dvh;
  isolation: isolate;
  overflow: hidden;
}
.jawa-section-inner {
  position: relative;
  z-index: 10;
  min-height: inherit;
}
.jawa-gold-text {
  color: #D4A843;
  background: linear-gradient(135deg, #F2D879 0%, #D4A843 45%, #C8922A 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba(123, 63, 26, .12);
}
.jawa-display { font-family: var(--font-jawa-display), serif; }
.jawa-heading { font-family: var(--font-jawa-heading), Georgia, serif; }
.jawa-script { font-family: var(--font-jawa-script), cursive; }
.jawa-arabic { font-family: var(--font-jawa-arabic), serif; }
.jawa-batik svg, .jawa-divider svg, .jawa-corner svg, .jawa-wayang svg, .jawa-melati-svg svg {
  width: 100%;
  height: 100%;
  display: block;
}
.jawa-divider svg path {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
}
.jawa-revealed .jawa-divider svg path {
  animation: drawDivider 1.5s ease-out .15s forwards;
}
#cover .jawa-divider svg path {
  animation: drawDivider 1.5s ease-out .25s forwards;
}
.jawa-corner {
  color: var(--jawa-gold);
  filter: drop-shadow(0 5px 12px rgba(123, 63, 26, .14));
}
.jawa-kawung-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: url('${jawaAssets.batikKawungPanel.src}');
  background-size: cover;
  background-position: center;
  opacity: .05;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.jawa-texture-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url('${jawaAssets.goldLeafTexture}');
  background-size: 500px;
  background-repeat: repeat;
  opacity: .04;
  mix-blend-mode: multiply;
  pointer-events: none;
  animation: goldPulse 8s ease-in-out infinite;
}
.jawa-cover-bg {
  background:
    radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,168,67,.12) 0%, transparent 70%),
    linear-gradient(180deg, #F5EDD6 0%, #FAF4E6 48%, #EDE0C0 100%);
}
.jawa-hero-ornament {
  filter: drop-shadow(0 8px 32px rgba(123,63,26,.15));
}
.jawa-melati-corner {
  mix-blend-mode: multiply;
  mask-image: linear-gradient(135deg, #000 0%, rgba(0,0,0,.74) 48%, transparent 84%);
}
.jawa-image-formal {
  transition: transform .4s ease, filter .4s ease;
}
.jawa-image-formal:hover {
  transform: scale(1.03);
  filter: sepia(.25);
}
.jawa-reveal {
  opacity: 0;
  transform: translateY(28px);
}
.jawa-revealed {
  animation: revealUp .9s ease-out forwards;
}
.jawa-stagger > * {
  opacity: 0;
  transform: translateY(16px);
}
.jawa-section:not(.jawa-reveal) .jawa-stagger > * {
  opacity: 1;
  transform: none;
}
.jawa-revealed .jawa-stagger > * {
  animation: revealUp .8s ease-out forwards;
}
.jawa-revealed .jawa-stagger > *:nth-child(1) { animation-delay: .05s; }
.jawa-revealed .jawa-stagger > *:nth-child(2) { animation-delay: .15s; }
.jawa-revealed .jawa-stagger > *:nth-child(3) { animation-delay: .25s; }
.jawa-revealed .jawa-stagger > *:nth-child(4) { animation-delay: .35s; }
.jawa-revealed .jawa-stagger > *:nth-child(5) { animation-delay: .45s; }
.jawa-revealed .jawa-stagger > *:nth-child(6) { animation-delay: .55s; }
.jawa-input {
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgba(212, 168, 67, .82);
  background: transparent;
  padding: .65rem 0 .55rem;
  color: var(--jawa-body);
  outline: none;
  transition: border-color .2s ease;
}
.jawa-input::placeholder { color: rgba(122, 92, 58, .72); }
.jawa-input:focus { border-color: var(--jawa-soga); }
.jawa-radio-input:checked + .jawa-radio-mark {
  background: var(--jawa-gold);
  border-color: var(--jawa-gold);
}
.jawa-radio-input:checked + .jawa-radio-mark::after {
  content: "✓";
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: white;
  font-size: .68rem;
  font-weight: 700;
}
.melati-particle {
  position: absolute;
  width: .58rem;
  height: .58rem;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 0 14px rgba(255,255,255,.55), 0 0 18px rgba(212,168,67,.3);
  opacity: 0;
  animation: melatiFloat 4s ease-in-out infinite;
}
.melati-particle:nth-child(1) { left: 8%; bottom: 7%; animation-duration: 3.2s; animation-delay: 0s; }
.melati-particle:nth-child(2) { left: 19%; bottom: 16%; animation-duration: 3.8s; animation-delay: .6s; }
.melati-particle:nth-child(3) { left: 31%; bottom: 11%; animation-duration: 4.2s; animation-delay: 1.2s; }
.melati-particle:nth-child(4) { left: 46%; bottom: 20%; animation-duration: 4.6s; animation-delay: 1.8s; }
.melati-particle:nth-child(5) { left: 62%; bottom: 7%; animation-duration: 5s; animation-delay: 2.4s; }
.melati-particle:nth-child(6) { left: 76%; bottom: 17%; animation-duration: 5.4s; animation-delay: 3s; }
.melati-particle:nth-child(7) { left: 87%; bottom: 10%; animation-duration: 5.8s; animation-delay: 3.6s; }
.melati-particle:nth-child(8) { left: 95%; bottom: 19%; animation-duration: 6.2s; animation-delay: 4.2s; }
.melati-particle:nth-child(9) { left: 14%; bottom: 24%; animation-duration: 4.4s; animation-delay: 4.8s; }
.melati-particle:nth-child(10) { left: 71%; bottom: 25%; animation-duration: 5.2s; animation-delay: 5.4s; }
.jawa-copy-bounce {
  animation: copyBounce .42s ease-out;
}
@keyframes melatiFloat {
  0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
  15% { opacity: .65; }
  85% { opacity: .4; }
  100% { transform: translateY(-100px) translateX(20px) rotate(60deg); opacity: 0; }
}
@keyframes revealUp {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes goldPulse {
  0%, 100% { opacity: .03; }
  50% { opacity: .08; }
}
@keyframes drawDivider {
  from { stroke-dashoffset: 400; }
  to { stroke-dashoffset: 0; }
}
@keyframes copyBounce {
  0% { transform: scale(1); }
  45% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .jawa-agung-theme *,
  .jawa-agung-theme *::before,
  .jawa-agung-theme *::after {
    animation: none !important;
    transition-duration: .01ms !important;
  }
  .melati-particle,
  .jawa-reveal,
  .jawa-stagger > *,
  .jawa-revealed {
    opacity: 1 !important;
    transform: none !important;
  }
  .jawa-divider svg path {
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

function formatDateUpper(value: string | null) {
  return formatDate(value).replace(",", " -").toUpperCase();
}

function formatDateCompact(value: string | null) {
  if (!value) return "Tanggal menyusul";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const parts = new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return [day, month, year].filter(Boolean).join(" • ").toUpperCase();
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
  if (!value || value.includes("Ãƒ") || value.includes("Ã™") || value.includes("Ã˜") || value.includes("Ù")) return FALLBACK_ARABIC_QUOTE;
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
  const parentNames = [father, mother].filter(Boolean).join(" dan ");
  if (!parentNames) return `${kind} tercinta dari keluarga besar`;
  return `${kind} dari: ${parentNames}`;
}

function closingGreetings(data: FatehaInvitationData) {
  const marker = `${data.quote.translation} ${data.quote.source} ${data.quote.arabic}`.toLowerCase();
  const isIslamic = /allah|ar-rum|assalamu|bismillah|rahmat|quran|qs\./i.test(marker);
  const isNonIslamic = /rahayu|pemberkatan|gereja|om swastiastu|namaste/i.test(marker);
  if (isIslamic) return "Wassalamualaikum Warahmatullahi Wabarakatuh";
  if (isNonIslamic) return "Salam Rahayu";
  return "Salam Rahayu";
}

function eventExists(event: FatehaEvent) {
  return Boolean(event.date || event.time || event.venue || event.address);
}

function cityFromEvent(event: FatehaEvent) {
  const parts = event.address.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.at(-1) || event.venue || "Lokasi akan diumumkan";
}

export function JawaAgungTemplate({ data }: { data: FatehaInvitationData }) {
  const sectionOrder = useMemo(() => getVisibleSections(data), [data]);
  const [closingVisible, setClosingVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("jawa-revealed");
          if (entry.target.id === "closing") setClosingVisible(true);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    const elements = document.querySelectorAll(".jawa-reveal");
    elements.forEach((element) => observer.observe(element));

    const closing = document.getElementById("closing");
    let closingObserver: IntersectionObserver | null = null;
    if (closing) {
      closingObserver = new IntersectionObserver(
        ([entry]) => setClosingVisible(Boolean(entry?.isIntersecting)),
        { threshold: 0.35 },
      );
      closingObserver.observe(closing);
    }

    return () => {
      observer.disconnect();
      closingObserver?.disconnect();
    };
  }, [sectionOrder]);

  return (
    <div className={cn("jawa-agung-theme min-h-screen bg-[#E8D6AD] text-[#2A1A0E]", jawaAgungFontClassName)}>
      <style>{jawaAgungStyles}</style>
      <FloatingMelati />
      <MusicToggle musicUrl={data.musicUrl} closingVisible={closingVisible} />
      <JawaNav />
      <main className="jawa-agung-shell">
        {sectionOrder.map((section) => {
          if (section === "cover") return <CoverSection key={section} data={data} />;
          if (section === "quote") return <OpeningQuoteSection key={section} data={data} />;
          if (section === "couple") return <CoupleSection key={section} data={data} />;
          if (section === "story" && data.loveStory.length > 0) return <LoveStorySection key={section} items={data.loveStory} />;
          if (section === "event") return <EventSection key={section} data={data} />;
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

function SectionWrapper({
  id,
  children,
  className,
  innerClassName,
  withBatik,
  reveal = true,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  withBatik?: boolean;
  reveal?: boolean;
}) {
  return (
    <section id={id} className={cn("jawa-section", reveal && "jawa-reveal", className)}>
      <div className="jawa-texture-layer" aria-hidden="true" />
      {withBatik ? <div className="jawa-kawung-layer" aria-hidden="true" /> : null}
      <div className={cn("jawa-section-inner", innerClassName)}>{children}</div>
    </section>
  );
}

function CoverSection({ data }: { data: FatehaInvitationData }) {
  const location = cityFromEvent(data.wedding.akad);

  return (
    <SectionWrapper id="cover" className="jawa-cover-bg text-center" innerClassName="flex flex-col" reveal={false}>
      <BatikStrip className="text-[#D4A843]" />
      <CornerOrnaments />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-7 py-20 pb-28">
        <div className="jawa-stagger grid place-items-center">
          <p className="jawa-display text-[0.55rem] font-bold uppercase tracking-[0.35em] text-[#7B3F1A]">Mengundang Anda Untuk Hadir</p>
          <img
            src={jawaAssets.heroOrnament.src}
            alt=""
            width={jawaAssets.heroOrnament.width}
            height={jawaAssets.heroOrnament.height}
            loading="lazy"
            decoding="async"
            role="presentation"
            aria-hidden="true"
            className="jawa-hero-ornament mt-8 w-[min(280px,70vw)] opacity-[0.92]"
          />
          <h1 className="mt-7 text-center">
            <span className="jawa-script jawa-gold-text block text-[clamp(3rem,10vw,5.5rem)] leading-[0.82]">{data.bride.nickname}</span>
            <span className="jawa-heading block py-4 text-xl text-[#D4A843]" aria-hidden="true">✦</span>
            <span className="jawa-script jawa-gold-text block text-[clamp(3rem,10vw,5.5rem)] leading-[0.82]">{data.groom.nickname}</span>
          </h1>
          <Divider className="mt-8 w-[min(280px,70vw)] text-[#D4A843]" />
          <p className="jawa-display mt-6 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#7B3F1A]">{formatDateUpper(data.wedding.date)}</p>
          <p className="mt-3 text-[0.85rem] italic leading-6 text-[#7A5C3A]">{location}</p>
        </div>
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
        className="pointer-events-none absolute inset-x-0 bottom-5 z-[2] hidden max-h-[140px] w-full object-contain object-bottom opacity-75 sm:block"
      />
      <BatikStrip className="absolute inset-x-0 bottom-0 rotate-180 text-[#D4A843]" />
    </SectionWrapper>
  );
}

function OpeningQuoteSection({ data }: { data: FatehaInvitationData }) {
  const quoteText = data.quote.translation.trim();
  const quoteSource = data.quote.source.trim();
  const arabic = cleanArabic(data.quote.arabic);
  if (!quoteText && !quoteSource && !arabic) return null;

  return (
    <SectionWrapper id="quote" className="bg-[#EDE0C0] text-center" innerClassName="flex flex-col" withBatik>
      <BatikStrip className="text-[#D4A843]" />
      <CornerOrnaments subtle />
      <div className="jawa-stagger mx-auto flex flex-1 max-w-xl flex-col items-center justify-center px-8 py-20">
        <Divider className="w-72 max-w-full text-[#D4A843]" />
        {arabic ? <p className="jawa-arabic mt-10 text-3xl leading-[2] text-[#7B3F1A]">{arabic}</p> : null}
        {quoteText ? <p className="mx-auto mt-8 max-w-[55ch] text-base italic leading-[1.8] text-[#2A1A0E]">&ldquo;{quoteText}&rdquo;</p> : null}
        {quoteSource ? <p className="jawa-display mt-4 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#7A5C3A]">{quoteSource}</p> : null}
        <Divider className="mt-10 w-72 max-w-full rotate-180 text-[#D4A843]" />
      </div>
      <BatikStrip className="rotate-180 text-[#D4A843]" />
    </SectionWrapper>
  );
}

function CoupleSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionWrapper id="couple" className="bg-[#FAF4E6]" innerClassName="flex items-center px-7 py-20">
      <img
        src={jawaAssets.melatiCloseup.src}
        alt=""
        width={jawaAssets.melatiCloseup.width}
        height={jawaAssets.melatiCloseup.height}
        loading="lazy"
        decoding="async"
        role="presentation"
        aria-hidden="true"
        className="jawa-melati-corner pointer-events-none absolute -right-20 top-8 z-[1] w-[220px] opacity-10"
      />
      <div className="jawa-stagger mx-auto w-full max-w-xl">
        <SectionHeading eyebrow="Mempelai" title="Dua Keluarga, Satu Restu" />
        <div className="relative mt-14 grid gap-14 text-center sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-7">
          <PersonCard kind="Putri" label="Mempelai Wanita" person={data.bride} showPhoto={data.show_couple_photos !== false} />
          <div className="jawa-heading hidden text-5xl italic text-[#D4A843] sm:block" aria-hidden="true">❧</div>
          <PersonCard kind="Putra" label="Mempelai Pria" person={data.groom} showPhoto={data.show_couple_photos !== false} />
        </div>
      </div>
    </SectionWrapper>
  );
}

function PersonCard({
  kind,
  label,
  person,
  showPhoto,
}: {
  kind: "Putra" | "Putri";
  label: string;
  person: FatehaInvitationData["bride"];
  showPhoto: boolean;
}) {
  return (
    <article>
      {showPhoto ? (
        <div className="mx-auto h-[140px] w-[140px] rounded-full border-2 border-[#7B3F1A] bg-[#EDE0C0] p-1 shadow-[0_8px_32px_rgba(123,63,26,0.2)] outline outline-[3px] outline-offset-[5px] outline-[#D4A843]">
          <img src={person.photo} alt={`Foto ${person.nickname}`} width={140} height={140} className="h-full w-full rounded-full object-cover sepia-[0.12]" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <p className="jawa-display mt-8 text-[0.55rem] font-bold uppercase tracking-[0.2em] text-[#7A5C3A]">{label}</p>
      <h3 className="jawa-heading mt-3 text-[1.3rem] font-bold leading-tight text-[#7B3F1A]">{person.fullName}</h3>
      <p className="mt-3 text-[0.8rem] italic text-[#7A5C3A]">{kind} dari:</p>
      <p className="mt-1 text-[0.85rem] leading-7 text-[#2A1A0E]">{parentLine(kind, person.father, person.mother).replace(`${kind} dari: `, "")}</p>
      <SvgOrnament svg={melatiBulletSVG} className="jawa-melati-svg mx-auto mt-4 h-4 w-4 text-[#D4A843]" />
    </article>
  );
}

function LoveStorySection({ items }: { items: FatehaStoryItem[] }) {
  return (
    <SectionWrapper id="story" className="bg-[#F5EDD6]" innerClassName="flex items-center px-7 py-20">
      <div className="jawa-stagger mx-auto w-full max-w-xl">
        <SectionHeading eyebrow="Perjalanan Cinta Kami" title="Kisah Kami" />
        <div className="relative mx-auto mt-12 max-w-lg">
          <div className="absolute left-4 top-3 h-[calc(100%-1.5rem)] border-l border-dashed border-[#C8922A]" aria-hidden="true" />
          {items.map((item, index) => (
            <article key={`${item.year}-${item.title}-${index}`} className={cn("relative mb-5 ml-10 border border-[#D4A843]/35 p-6 shadow-[0_18px_36px_rgba(123,63,26,0.08)]", index % 2 === 0 ? "bg-[#FAF4E6]" : "bg-[#F5EDD6]")}>
              <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner absolute -left-[2.8rem] top-6 h-5 w-5 rotate-45 bg-[#F5EDD6]" />
              <p className="jawa-display text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#D4A843]">{item.year}</p>
              <h3 className="jawa-heading mt-3 text-[1.1rem] font-bold text-[#7B3F1A]">{item.title}</h3>
              <p className="mt-3 text-[0.9rem] leading-7 text-[#2A1A0E]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

function EventSection({ data }: { data: FatehaInvitationData }) {
  const showKeris = eventExists(data.wedding.akad) && eventExists(data.wedding.reception);

  return (
    <SectionWrapper id="event" className="bg-[#EDE0C0]" innerClassName="flex flex-col px-7 py-20" withBatik>
      <BatikStrip className="absolute inset-x-0 top-0 text-[#D4A843]" />
      <div className="jawa-stagger mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        <SectionHeading eyebrow="Rangkaian Acara" title="Hari Bahagia" />
        <div className={cn("mt-12 grid gap-5 sm:items-center", showKeris ? "sm:grid-cols-[1fr_80px_1fr]" : "sm:grid-cols-2")}>
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
              className="hidden w-20 rotate-45 object-contain opacity-50 sm:block"
            />
          ) : null}
          <EventCard event={data.wedding.reception} title="Resepsi Pernikahan" />
        </div>
      </div>
      <BatikStrip className="absolute inset-x-0 bottom-0 rotate-180 text-[#D4A843]" />
    </SectionWrapper>
  );
}

function EventCard({ event, title }: { event: FatehaEvent; title: string }) {
  return (
    <article className="relative min-h-[24rem] overflow-hidden border border-[#D4A843]/50 bg-[#FAF4E6] px-6 py-10 text-center shadow-[0_18px_40px_rgba(123,63,26,0.1)] sm:px-8">
      <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner absolute left-3 top-3 h-12 w-12 opacity-55" />
      <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner absolute right-3 top-3 h-12 w-12 scale-x-[-1] opacity-55" />
      <div className="relative z-10">
        <p className="jawa-display text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#7B3F1A]">{title}</p>
        <Divider className="mx-auto my-6 w-40 scale-75 text-[#D4A843]" />
        <h3 className="jawa-heading text-[1.4rem] font-bold leading-tight text-[#7B3F1A]">{formatDate(event.date)}</h3>
        <p className="mt-3 text-[0.9rem] italic text-[#7A5C3A]">{formatTime(event)}</p>
        <p className="jawa-heading mt-7 text-[1.1rem] font-semibold text-[#2A1A0E]">{event.venue}</p>
        <p className="mt-2 line-clamp-2 text-[0.85rem] leading-6 text-[#7A5C3A]">{event.address}</p>
        {event.mapsUrl ? (
          <a href={event.mapsUrl} target="_blank" rel="noreferrer" className="jawa-display mt-8 inline-flex min-h-11 items-center justify-center gap-2 border border-[#7B3F1A] px-6 py-3 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#7B3F1A] transition duration-300 hover:bg-[#7B3F1A] hover:text-[#F5EDD6]">
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
    <SectionWrapper id="gallery" className="bg-[#FAF4E6]" innerClassName="flex flex-col px-7 py-20">
      <BatikStrip className="absolute inset-x-0 top-0 text-[#D4A843]" />
      <div className="jawa-stagger mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        <SectionHeading eyebrow="Kenangan Kami" title="Galeri" />
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {data.gallery.slice(0, 6).map((item, index) => (
            <figure key={`${item.src}-${index}`} className="group overflow-hidden border border-[#D4A843]/35 bg-[#EDE0C0]">
              <img src={item.src} alt={item.alt} width={320} height={index % 3 === 1 ? 320 : 426} className={cn("jawa-image-formal w-full object-cover", index % 3 === 1 ? "aspect-square" : "aspect-[3/4]")} loading="lazy" decoding="async" />
              {item.caption ? <figcaption className="px-3 py-2 text-center text-xs italic text-[#7A5C3A]">{item.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    </SectionWrapper>
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
    <SectionWrapper id="rsvp" className="bg-[#EDE0C0]" innerClassName="flex flex-col px-7 py-20" withBatik>
      <BatikStrip className="absolute inset-x-0 top-0 text-[#D4A843]" />
      <BatikStrip className="absolute inset-x-0 bottom-0 rotate-180 text-[#D4A843]" />
      <CornerOrnaments subtle />
      <div className="jawa-stagger mx-auto flex w-full max-w-xl flex-1 flex-col justify-center">
        <SectionHeading eyebrow="Konfirmasi Kehadiran" title="Kehadiran Anda" subtitle="Kehadiran Anda adalah kehormatan bagi kami." />
        <div className="mx-auto mt-10 w-full max-w-[480px] border border-[#D4A843]/45 bg-[#FAF4E6]/88 p-5 shadow-[0_20px_42px_rgba(123,63,26,0.1)]">
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
                <p className="jawa-display mb-3 text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#7B3F1A]">Kehadiran</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ["hadir", "Hadir"],
                    ["tidak_hadir", "Tidak Hadir"],
                    ["masih_ragu", "Belum Pasti"],
                  ].map(([value, label]) => (
                    <label key={value} className="flex min-h-11 cursor-pointer items-center gap-2 border border-[#D4A843]/35 bg-[#F5EDD6]/55 px-3 py-3 text-xs font-semibold text-[#7B3F1A]">
                      <input
                        type="radio"
                        name="attendance"
                        value={value}
                        checked={form.attendance === value}
                        onChange={(event) => update("attendance", event.target.value as AttendanceChoice)}
                        className="jawa-radio-input sr-only"
                      />
                      <span className="jawa-radio-mark relative h-4 w-4 rounded-full border border-[#7B3F1A]" aria-hidden="true" />
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <JawaField label="Pesan / Ucapan">
                <textarea className="jawa-input min-h-28 resize-none" value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tulis doa atau ucapan untuk kami..." />
              </JawaField>
              {error ? <p className="border border-[#7B3F1A]/20 bg-[#EDE0C0] px-4 py-3 text-sm text-[#7B3F1A]">{error}</p> : null}
              <button type="submit" className="jawa-display inline-flex min-h-11 w-full items-center justify-center gap-2 bg-[#7B3F1A] px-12 py-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#F5EDD6] transition duration-300 hover:bg-[#C8922A] hover:text-[#2A1A0E]" disabled={loading}>
                <Send className="h-4 w-4" aria-hidden="true" />
                {loading ? "Mengirim" : "Kirim Konfirmasi"}
              </button>
            </form>
          )}
        </div>
        {messages.length > 0 ? (
          <div className="mx-auto mt-8 grid max-w-[480px] gap-3">
            {messages.slice(0, 3).map((message) => (
              <article key={message.id} className="border border-[#D4A843]/30 bg-[#FAF4E6]/72 p-4">
                <strong className="text-sm text-[#7B3F1A]">{message.name}</strong>
                <p className="mt-2 text-sm italic leading-6 text-[#7A5C3A]">&ldquo;{message.message}&rdquo;</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </SectionWrapper>
  );
}

function GiftSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionWrapper id="gift" className="bg-[#FAF4E6]" innerClassName="flex items-center px-7 py-20">
      <div className="jawa-stagger mx-auto w-full max-w-xl">
        <SectionHeading eyebrow="Doa & Hadiah" title="Amplop Digital" subtitle="Doa restu Anda adalah hadiah yang paling bermakna bagi kami." />
        <div className="mx-auto mt-10 grid max-w-lg gap-4">
          {data.giftAccounts.map((account) => <GiftAccountCard key={`${account.bank}-${account.number}`} account={account} />)}
          {data.giftAddress ? (
            <article className="relative border border-[#D4A843]/45 bg-[#EDE0C0] p-6 text-center">
              <MapPin className="mx-auto h-7 w-7 text-[#7B3F1A]" aria-hidden="true" />
              <h3 className="jawa-heading mt-3 text-2xl font-semibold text-[#7B3F1A]">Alamat Hadiah</h3>
              <p className="mt-3 text-sm leading-7 text-[#7A5C3A]">{data.giftAddress}</p>
            </article>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
  );
}

function GiftAccountCard({ account }: { account: FatehaGiftAccount }) {
  const [copied, setCopied] = useState(false);

  function copyNumber() {
    void navigator.clipboard.writeText(account.number);
    setCopied(true);
    toast.success("Nomor rekening disalin.");
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="relative overflow-hidden border border-[#D4A843]/60 bg-[#EDE0C0] p-8 text-center">
      <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner absolute left-3 top-3 h-12 w-12 opacity-55" />
      <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner absolute right-3 top-3 h-12 w-12 scale-x-[-1] opacity-55" />
      <p className="jawa-display text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#7B3F1A]">{account.bank}</p>
      <strong className="jawa-heading mt-4 block text-[1.3rem] font-bold text-[#7B3F1A]">{account.number}</strong>
      <p className="mt-2 text-sm text-[#7A5C3A]">a.n. {account.name}</p>
      <button
        type="button"
        className={cn("mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-[#7B3F1A] px-4 py-3 text-xs font-semibold text-[#7B3F1A] transition hover:bg-[#7B3F1A] hover:text-[#F5EDD6]", copied && "jawa-copy-bounce")}
        onClick={copyNumber}
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
        {copied ? "Tersalin ✓" : "Salin Nomor Rekening"}
      </button>
    </article>
  );
}

function ClosingSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionWrapper id="closing" className="bg-[#EDE0C0] text-center" innerClassName="flex flex-col" withBatik>
      <BatikStrip className="text-[#D4A843]" />
      <CornerOrnaments subtle />
      <img
        src={jawaAssets.wayangArjuna.src}
        alt=""
        width={jawaAssets.wayangArjuna.width}
        height={jawaAssets.wayangArjuna.height}
        loading="lazy"
        decoding="async"
        role="presentation"
        aria-hidden="true"
        className="pointer-events-none absolute right-[-7rem] top-1/2 z-[2] h-[70%] w-auto -translate-y-1/2 object-contain opacity-[0.07]"
      />
      <div className="jawa-stagger mx-auto flex flex-1 max-w-xl flex-col items-center justify-center px-8 py-20 pb-32">
        <Divider className="w-80 max-w-full text-[#D4A843]" />
        <p className="jawa-script mt-10 text-[clamp(1.5rem,5vw,2.5rem)] leading-tight text-[#D4A843]">{closingGreetings(data)}</p>
        <h2 className="jawa-script mt-8 text-[clamp(2rem,7vw,4rem)] leading-none text-[#7B3F1A]">
          {data.bride.fullName}
          <span className="jawa-heading block py-3 text-2xl italic text-[#D4A843]">&amp;</span>
          {data.groom.fullName}
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[0.9rem] italic leading-7 text-[#7A5C3A]">Terima kasih atas doa dan kehadiran Anda</p>
        <img
          src={jawaAssets.heroOrnament.src}
          alt=""
          width={jawaAssets.heroOrnament.width}
          height={jawaAssets.heroOrnament.height}
          loading="lazy"
          decoding="async"
          role="presentation"
          aria-hidden="true"
          className="jawa-hero-ornament mt-10 w-[min(160px,40vw)] opacity-70"
        />
        <Divider className="mt-10 w-80 max-w-full rotate-180 text-[#D4A843]" />
      </div>
      <BatikStrip className="absolute inset-x-0 bottom-0 rotate-180 text-[#D4A843]" />
    </SectionWrapper>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <header className="mx-auto max-w-xl text-center">
      <Divider className="mx-auto w-56 text-[#D4A843]" />
      <p className="jawa-display mt-5 text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#7B3F1A]">{eyebrow}</p>
      <h2 className="jawa-heading mt-4 text-4xl font-bold text-[#7B3F1A]">{title}</h2>
      <Divider className="mx-auto my-5 w-56 rotate-180 text-[#D4A843]" />
      {subtitle ? <p className="text-sm italic leading-7 text-[#7A5C3A]">{subtitle}</p> : null}
    </header>
  );
}

function JawaField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="jawa-display text-[0.55rem] font-bold uppercase tracking-[0.15em] text-[#7B3F1A]">{label}</span>
      {children}
    </label>
  );
}

function JawaNav() {
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[min(calc(100%_-_2rem),430px)] items-center justify-center border border-[#D4A843]/55 bg-[#FAF4E6]/90 p-1 shadow-[0_18px_45px_rgba(123,63,26,0.16)] backdrop-blur-xl">
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className="flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[9px] font-semibold uppercase tracking-wide text-[#7A5C3A] transition hover:bg-[#EDE0C0] hover:text-[#7B3F1A]">
          <item.icon className="h-4 w-4" aria-hidden="true" />
          <span className="truncate">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function MusicToggle({ musicUrl, closingVisible }: { musicUrl: string | null; closingVisible: boolean }) {
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
          "fixed bottom-24 right-4 z-50 grid min-h-11 min-w-11 place-items-center border border-[#D4A843] bg-[#FAF4E6]/92 text-[#7B3F1A] opacity-80 shadow-[0_14px_36px_rgba(123,63,26,0.18)] backdrop-blur-xl transition duration-500 hover:bg-[#EDE0C0]",
          playing && "bg-[#7B3F1A] text-[#F5EDD6]",
          closingVisible && "opacity-100",
        )}
      >
        <SvgOrnament svg={cornerOrnamentSVG} className="jawa-corner pointer-events-none absolute left-0 top-0 h-5 w-5 opacity-50" />
        {playing ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
      </button>
    </>
  );
}

function FloatingMelati() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {melatiParticles.map((item) => <span key={item} className="melati-particle" />)}
    </div>
  );
}

function BatikStrip({ className }: { className?: string }) {
  return <SvgOrnament svg={batikBorderSVG} className={cn("jawa-batik h-7 w-full shrink-0", className)} />;
}

function Divider({ className }: { className?: string }) {
  return <SvgOrnament svg={dividerOrnamentSVG} className={cn("jawa-divider h-9", className)} />;
}

function CornerOrnaments({ subtle = false }: { subtle?: boolean }) {
  const opacity = subtle ? "opacity-35" : "opacity-75";
  return (
    <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden="true">
      <SvgOrnament svg={cornerOrnamentSVG} className={cn("jawa-corner absolute left-5 top-10 h-16 w-16", opacity)} />
      <SvgOrnament svg={cornerOrnamentSVG} className={cn("jawa-corner absolute right-5 top-10 h-16 w-16 scale-x-[-1]", opacity)} />
      <SvgOrnament svg={cornerOrnamentSVG} className={cn("jawa-corner absolute bottom-10 left-5 h-16 w-16 scale-y-[-1]", opacity)} />
      <SvgOrnament svg={cornerOrnamentSVG} className={cn("jawa-corner absolute bottom-10 right-5 h-16 w-16 scale-x-[-1] scale-y-[-1]", opacity)} />
    </div>
  );
}

function SvgOrnament({ svg, className }: { svg: string; className?: string }) {
  return <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
}
