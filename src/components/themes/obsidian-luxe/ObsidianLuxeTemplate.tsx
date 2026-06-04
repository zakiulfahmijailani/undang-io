/* Obsidian Luxe wedding invitation renderer based on the dark luxury theme spec in the June 4, 2026 task attachment. */

"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Copy,
  Gift,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  Navigation,
  Send,
  UserRound,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { FatehaEvent, FatehaGiftAccount, FatehaInvitationData, FatehaPerson, FatehaRsvpMessage } from "@/components/themes/fateha";
import { obsidianLuxeFontClassName } from "./fonts";

type ObsidianSectionId = "cover" | "quote" | "couple" | "story" | "event" | "gallery" | "rsvp" | "gift" | "closing";
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

const DEFAULT_SECTION_ORDER: ObsidianSectionId[] = ["cover", "quote", "couple", "story", "event", "gallery", "rsvp", "gift", "closing"];
const OBSIDIAN_DIVIDER_SRC = "/themes/obsidian-luxe/obsidian-divider.png";
const OBSIDIAN_CORNER_SRC = "/themes/obsidian-luxe/obsidian-corner.png";
const FALLBACK_ARABIC_QUOTE =
  "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً";

const sectionAliases: Record<string, ObsidianSectionId> = {
  hero: "cover",
  cover: "cover",
  quote: "quote",
  ayat: "quote",
  couple: "couple",
  mempelai: "couple",
  lovestory: "story",
  loveStory: "story",
  story: "story",
  event: "event",
  acara: "event",
  gallery: "gallery",
  galeri: "gallery",
  rsvp: "rsvp",
  gift: "gift",
  closing: "closing",
  penutup: "closing",
};

const navItems = [
  { href: "#cover", icon: Home, label: "Utama" },
  { href: "#couple", icon: UserRound, label: "Mempelai" },
  { href: "#event", icon: CalendarDays, label: "Acara" },
  { href: "#rsvp", icon: MessageCircle, label: "RSVP" },
  { href: "#closing", icon: Heart, label: "Penutup" },
] as const;

const dustParticles = [
  "left-[6%] top-[76%] h-1 w-1 [animation-delay:-1s] [animation-duration:9s]",
  "left-[10%] top-[18%] h-0.5 w-0.5 [animation-delay:-9s] [animation-duration:12s]",
  "left-[13%] top-[42%] h-1.5 w-1.5 [animation-delay:-4s] [animation-duration:13s]",
  "left-[17%] top-[64%] h-1 w-1 [animation-delay:-7s] [animation-duration:10s]",
  "left-[22%] top-[82%] h-0.5 w-0.5 [animation-delay:-2s] [animation-duration:11s]",
  "left-[25%] top-[27%] h-1.5 w-1.5 [animation-delay:-12s] [animation-duration:15s]",
  "left-[29%] top-[55%] h-1 w-1 [animation-delay:-5s] [animation-duration:12s]",
  "left-[33%] top-[72%] h-0.5 w-0.5 [animation-delay:-8s] [animation-duration:10s]",
  "left-[37%] top-[13%] h-1 w-1 [animation-delay:-11s] [animation-duration:14s]",
  "left-[41%] top-[88%] h-1.5 w-1.5 [animation-delay:-3s] [animation-duration:12s]",
  "left-[46%] top-[34%] h-0.5 w-0.5 [animation-delay:-10s] [animation-duration:13s]",
  "left-[49%] top-[69%] h-1 w-1 [animation-delay:-6s] [animation-duration:11s]",
  "left-[54%] top-[18%] h-1.5 w-1.5 [animation-delay:-14s] [animation-duration:16s]",
  "left-[58%] top-[51%] h-0.5 w-0.5 [animation-delay:-1s] [animation-duration:12s]",
  "left-[61%] top-[86%] h-1 w-1 [animation-delay:-5s] [animation-duration:10s]",
  "left-[65%] top-[38%] h-1.5 w-1.5 [animation-delay:-8s] [animation-duration:15s]",
  "left-[69%] top-[75%] h-0.5 w-0.5 [animation-delay:-13s] [animation-duration:11s]",
  "left-[73%] top-[22%] h-1 w-1 [animation-delay:-2s] [animation-duration:14s]",
  "left-[77%] top-[58%] h-1.5 w-1.5 [animation-delay:-9s] [animation-duration:13s]",
  "left-[81%] top-[84%] h-0.5 w-0.5 [animation-delay:-6s] [animation-duration:10s]",
  "left-[86%] top-[32%] h-1 w-1 [animation-delay:-12s] [animation-duration:12s]",
  "left-[90%] top-[67%] h-1.5 w-1.5 [animation-delay:-4s] [animation-duration:15s]",
  "left-[94%] top-[49%] h-0.5 w-0.5 [animation-delay:-10s] [animation-duration:11s]",
  "left-[96%] top-[80%] h-1 w-1 [animation-delay:-15s] [animation-duration:14s]",
] as const;

const sparkleStars = [
  "left-[12%] top-[21%] h-8 w-8 [animation-delay:-1s] [animation-duration:5.5s]",
  "left-[78%] top-[19%] h-6 w-6 [animation-delay:-3s] [animation-duration:6.2s]",
  "left-[88%] top-[42%] h-4 w-4 [animation-delay:-4s] [animation-duration:5.8s]",
  "left-[20%] top-[68%] h-5 w-5 [animation-delay:-2s] [animation-duration:6.5s]",
  "left-[64%] top-[83%] h-7 w-7 [animation-delay:-5s] [animation-duration:7s]",
] as const;

const foilShards = [
  "left-[7%] top-[-12%] h-8 w-3 [animation-delay:-2s] [animation-duration:15s]",
  "left-[15%] top-[-18%] h-6 w-2.5 [animation-delay:-9s] [animation-duration:18s]",
  "left-[23%] top-[-10%] h-10 w-3 [animation-delay:-5s] [animation-duration:17s]",
  "left-[34%] top-[-16%] h-7 w-2 [animation-delay:-12s] [animation-duration:16s]",
  "left-[44%] top-[-11%] h-9 w-3.5 [animation-delay:-7s] [animation-duration:19s]",
  "left-[53%] top-[-20%] h-6 w-2.5 [animation-delay:-3s] [animation-duration:14s]",
  "left-[62%] top-[-13%] h-10 w-3 [animation-delay:-11s] [animation-duration:18s]",
  "left-[71%] top-[-17%] h-7 w-2 [animation-delay:-6s] [animation-duration:15s]",
  "left-[82%] top-[-9%] h-8 w-3 [animation-delay:-13s] [animation-duration:20s]",
  "left-[91%] top-[-15%] h-6 w-2.5 [animation-delay:-4s] [animation-duration:16s]",
  "left-[18%] top-[-28%] h-9 w-3 [animation-delay:-16s] [animation-duration:21s]",
  "left-[76%] top-[-26%] h-10 w-3.5 [animation-delay:-18s] [animation-duration:22s]",
] as const;

function normalizeSection(section: string): ObsidianSectionId | null {
  return sectionAliases[section] ?? null;
}

function getVisibleSections(data: FatehaInvitationData): ObsidianSectionId[] {
  const rawOrder = Array.isArray(data.sections_order) && data.sections_order.length > 0 ? data.sections_order : DEFAULT_SECTION_ORDER;
  const seen = new Set<ObsidianSectionId>();
  const order = rawOrder
    .map((section) => normalizeSection(section))
    .filter((section): section is ObsidianSectionId => section !== null)
    .filter((section) => {
      if (seen.has(section)) return false;
      seen.add(section);
      return true;
    });
  const withFallback = order.length > 0 ? order : DEFAULT_SECTION_ORDER;

  return withFallback.filter((section) => isSectionVisible(data, section));
}

function isSectionVisible(data: FatehaInvitationData, section: ObsidianSectionId) {
  const visibility = data.sections_visibility ?? {};
  const aliases = Object.entries(sectionAliases)
    .filter(([, normalized]) => normalized === section)
    .map(([alias]) => alias);

  if (aliases.some((alias) => visibility[alias] === false)) return false;
  if (section === "couple" && data.show_couple_photos === false) return true;
  if (section === "gallery" && data.show_prewed_gallery === false) return false;
  if (section === "gift" && data.show_gift_section === false) return false;
  return true;
}

function formatDate(value: string | null) {
  if (!value) return "Tanggal akan diumumkan";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(date);
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
  if (!value || value.includes("Ã˜") || value.includes("Ã™")) return FALLBACK_ARABIC_QUOTE;
  return value;
}

function parentLine(kind: "Putra" | "Putri", father: string | null, mother: string | null) {
  if (!father && !mother) return `${kind} tercinta dari keluarga besar`;
  if (father && mother) return `${kind} dari ${father} dan ${mother}`;
  return `${kind} dari ${father ?? mother}`;
}

function shortInitials(data: FatehaInvitationData) {
  const bride = data.bride.nickname.trim().charAt(0) || "M";
  const groom = data.groom.nickname.trim().charAt(0) || "P";
  return `${bride} ✦ ${groom}`.toUpperCase();
}

export function ObsidianLuxeTemplate({ data }: { data: FatehaInvitationData }) {
  const [opened, setOpened] = useState(false);
  const sectionOrder = useMemo(() => getVisibleSections(data), [data]);

  return (
    <div
      className={cn(
        "obsidian-luxe-theme relative min-h-screen overflow-x-hidden bg-[#020202] text-[#F6EBD1] [font-family:var(--font-obsidian-body)]",
        obsidianLuxeFontClassName,
      )}
    >
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,rgba(201,168,76,0.15),transparent_28rem),linear-gradient(120deg,#020202,#101010_45%,#030303)]" />
      {!opened ? <EnvelopeIntro data={data} onOpen={() => setOpened(true)} /> : null}
      {opened ? (
        <>
          <main className="relative min-h-screen w-full overflow-hidden bg-[#060606] shadow-[0_0_120px_rgba(201,168,76,0.18)]">
            {sectionOrder.map((section) => {
              if (section === "cover") return <CoverSection key={section} data={data} />;
              if (section === "quote") return <OpeningQuoteSection key={section} data={data} />;
              if (section === "couple") return <CoupleSection key={section} data={data} />;
              if (section === "story" && data.loveStory.length > 0) return <LoveStorySection key={section} data={data} />;
              if (section === "event") return <EventSection key={section} data={data} />;
              if (section === "gallery" && data.gallery.length > 0) return <GallerySection key={section} data={data} />;
              if (section === "rsvp") return <RsvpSection key={section} data={data} />;
              if (section === "gift" && (data.giftAccounts.length > 0 || data.giftAddress)) return <GiftSection key={section} data={data} />;
              if (section === "closing") return <ClosingSection key={section} data={data} />;
              return null;
            })}
          </main>
          <ObsidianNav />
          {data.musicUrl ? <MusicToggle musicUrl={data.musicUrl} /> : null}
        </>
      ) : null}
    </div>
  );
}

function EnvelopeIntro({ data, onOpen }: { data: FatehaInvitationData; onOpen: () => void }) {
  const [phase, setPhase] = useState<"ready" | "opening">("ready");
  const openTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) window.clearTimeout(openTimerRef.current);
    };
  }, []);

  function handleOpen() {
    if (phase === "opening") return;
    setPhase("opening");
    openTimerRef.current = window.setTimeout(onOpen, 780);
  }

  return (
    <section
      className={cn(
        "relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#050505] px-5 py-12 text-center shadow-[0_0_120px_rgba(201,168,76,0.18)] transition duration-700",
        phase === "opening" && "scale-[1.02] opacity-0",
      )}
    >
      <LuxuryBackdrop frame />
      <div className="absolute inset-5 border border-[#F3D889]/28" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex w-full max-w-[430px] flex-col items-center">
        <div className="grid h-20 w-20 place-items-center rounded-full border border-[#F3D889]/65 bg-[#070707]/78 text-[#F3D889] shadow-[0_0_48px_rgba(217,180,87,0.32)] backdrop-blur-sm">
          <span className="[font-family:var(--font-obsidian-heading)] text-lg tracking-[0.28em]">{shortInitials(data).replace(" ✦ ", "")}</span>
        </div>
        <p className="mt-8 text-[0.68rem] font-semibold uppercase tracking-[0.5em] text-[#F3D889]/90 [text-shadow:0_0_18px_rgba(217,180,87,0.45)]">
          Undangan Pernikahan
        </p>
        <h1 className="mt-6 bg-[linear-gradient(115deg,#916320,#D9B457_22%,#FFF5C8_40%,#B67D24_62%,#FFE5A1_82%)] bg-[length:260%_100%] bg-clip-text text-transparent [animation:obsidianShimmer_7s_ease-in-out_infinite] [font-family:var(--font-obsidian-script)] [filter:drop-shadow(0_0_18px_rgba(217,180,87,0.28))]">
          <span className="block text-[clamp(3.7rem,16vw,6.6rem)] font-bold italic leading-[0.82]">{data.bride.nickname}</span>
          <span className="block py-2 text-[clamp(1.55rem,6vw,2.6rem)] leading-none text-[#F7E1A1]">&amp;</span>
          <span className="block text-[clamp(3.6rem,15vw,6.3rem)] font-bold italic leading-[0.82]">{data.groom.nickname}</span>
        </h1>
        <DiamondRule className="mt-7 w-64 max-w-full" />
        <ObsidianEnvelopeCard initials={data.monogram || shortInitials(data).replace(" ✦ ", "")} opening={phase === "opening"} />
        <button
          type="button"
          onClick={handleOpen}
          disabled={phase === "opening"}
          className="mt-8 inline-flex items-center justify-center border border-[#F3D889]/70 bg-[linear-gradient(135deg,#9A6A25,#F4D984,#B78128)] px-8 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[#050505] shadow-[0_18px_54px_rgba(217,180,87,0.28)] transition hover:scale-[1.02] hover:brightness-110 disabled:pointer-events-none disabled:opacity-70"
        >
          {phase === "opening" ? "Membuka" : "Buka Undangan"}
        </button>
        <p className="mt-5 [font-family:var(--font-obsidian-heading)] text-sm tracking-[0.22em] text-[#F6EBD1]/80">
          {formatDate(data.wedding.date)}
        </p>
      </div>
    </section>
  );
}

function ObsidianEnvelopeCard({ initials, opening }: { initials: string; opening: boolean }) {
  const seal = initials.replace(/\s+/g, " ").trim() || "OL";

  return (
    <div className={cn("obsidian-envelope-card relative mt-10 h-40 w-72 max-w-full", opening && "is-opening")} aria-hidden="true">
      <div className="absolute inset-x-7 -top-7 flex h-28 flex-col items-center justify-center border border-[#F3D889]/52 bg-[linear-gradient(145deg,rgba(23,23,23,0.96),rgba(5,5,5,0.96))] px-5 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <span className="text-[0.56rem] font-semibold uppercase tracking-[0.34em] text-[#D9B457]/80">Kepada Yth.</span>
        <span className="mt-3 [font-family:var(--font-obsidian-heading)] text-lg italic text-[#F6EBD1]/82">Bapak/Ibu/Saudara/i</span>
        <span className="mt-3 h-px w-28 bg-gradient-to-r from-transparent via-[#D9B457]/70 to-transparent" />
      </div>
      <div className="obsidian-envelope-back absolute inset-x-0 bottom-0 h-32 overflow-hidden border border-[#F3D889]/58 bg-[linear-gradient(145deg,#111111,#050505_62%,#18140B)] shadow-[0_26px_80px_rgba(0,0,0,0.45)]">
        <span className="absolute inset-3 border border-[#D9B457]/24" />
        <span className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_50%_10%,rgba(243,216,137,0.18),transparent_55%)]" />
      </div>
      <div className="obsidian-envelope-flap absolute inset-x-0 top-8 h-24 origin-top border-x border-t border-[#F3D889]/66 bg-[linear-gradient(160deg,#211A0D,#090909_54%,#30230F)] shadow-[0_18px_48px_rgba(0,0,0,0.42)] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
      <div className="absolute bottom-0 left-0 h-32 w-1/2 border-b border-l border-[#F3D889]/58 bg-[linear-gradient(145deg,rgba(13,13,13,0.94),rgba(47,35,14,0.72))] [clip-path:polygon(0_0,100%_50%,0_100%)]" />
      <div className="absolute bottom-0 right-0 h-32 w-1/2 border-b border-r border-[#F3D889]/58 bg-[linear-gradient(215deg,rgba(13,13,13,0.94),rgba(47,35,14,0.72))] [clip-path:polygon(100%_0,0_50%,100%_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-24 border-x border-b border-[#F3D889]/66 bg-[linear-gradient(180deg,rgba(8,8,8,0.8),rgba(18,13,6,0.95))] [clip-path:polygon(0_100%,50%_14%,100%_100%)]" />
      <div className="obsidian-envelope-seal absolute left-1/2 top-[5.2rem] grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full border border-[#FFF1BB]/80 bg-[radial-gradient(circle_at_35%_30%,#FFE9A8,#B9852B_58%,#5E3A10)] text-[#050505] shadow-[0_0_36px_rgba(217,180,87,0.55)]">
        <span className="[font-family:var(--font-obsidian-heading)] text-[0.7rem] font-semibold tracking-[0.18em]">{seal}</span>
      </div>
    </div>
  );
}

function CoverSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="cover" className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-6 pb-32 pt-16 text-center sm:py-16">
      <LuxuryBackdrop frame />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(255,231,168,0.2),transparent_32rem)]" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="grid h-20 w-20 place-items-center rounded-full border border-[#F3D889]/70 bg-[#070707]/70 text-[#F3D889] shadow-[0_0_52px_rgba(217,180,87,0.3)] backdrop-blur-sm">
          <span className="[font-family:var(--font-obsidian-heading)] text-lg tracking-[0.28em]">{shortInitials(data).replace(" ✦ ", "")}</span>
        </div>
        <DiamondRule className="mt-8 w-64" />
        <p className="mt-10 bg-[#070707]/72 px-4 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.48em] text-[#F3D889]/90 shadow-[0_0_28px_rgba(0,0,0,0.62)] backdrop-blur-sm [text-shadow:0_0_18px_rgba(217,180,87,0.45)]">
          Undangan Pernikahan
        </p>
        <h1 className="mt-8 w-full bg-[linear-gradient(115deg,#916320,#D9B457_22%,#FFF5C8_38%,#B67D24_58%,#FFE5A1_78%,#A87324)] bg-[length:260%_100%] bg-clip-text text-transparent [animation:obsidianShimmer_7s_ease-in-out_infinite] [font-family:var(--font-obsidian-script)] [filter:drop-shadow(0_0_20px_rgba(217,180,87,0.32))_drop-shadow(0_12px_24px_rgba(0,0,0,0.65))]">
          <span className="block text-[clamp(5.2rem,20vw,12rem)] font-bold italic leading-[0.7]">{data.bride.nickname}</span>
          <span className="block py-5 text-[clamp(2.1rem,8vw,4.2rem)] leading-none text-[#F7E1A1]">&amp;</span>
          <span className="block text-[clamp(5rem,19vw,11.2rem)] font-bold italic leading-[0.7]">{data.groom.nickname}</span>
        </h1>
        <DiamondRule className="mt-12 w-96 max-w-full" />
        <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.5em] text-[#F3D889] [text-shadow:0_0_18px_rgba(217,180,87,0.42)]">Mengundang Anda</p>
        <p className="mt-5 [font-family:var(--font-obsidian-heading)] text-xl font-light text-[#F6EBD1] sm:text-2xl">{formatDate(data.wedding.date)}</p>
      </div>
    </section>
  );
}

function OpeningQuoteSection({ data }: { data: FatehaInvitationData }) {
  const quoteText = data.quote.translation.trim();

  if (!quoteText && !data.quote.source) return null;

  return (
    <section id="quote" className="relative isolate overflow-hidden bg-[#111111] px-5 py-20 text-center">
      <LuxuryBackdrop muted />
      <GoldFloralCorner className="left-0 top-0 w-48 -translate-x-20 -translate-y-8 rotate-12 opacity-50" />
      <GoldFloralCorner className="right-0 bottom-0 w-48 translate-x-20 translate-y-8 rotate-180 opacity-50" />
      <div className="relative mx-auto max-w-3xl overflow-hidden border border-[#D9B457]/40 bg-[linear-gradient(135deg,rgba(8,8,8,0.92),rgba(28,28,25,0.86),rgba(8,8,8,0.96))] px-5 py-12 shadow-[0_28px_90px_rgba(0,0,0,0.45)] sm:px-10">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#F3D889]/70 to-transparent" />
        <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#F3D889]/60 to-transparent" />
        <GoldFloralSpray className="mx-auto mb-8 h-14 w-64 text-[#D9B457]" />
        <p className="mx-auto max-w-2xl text-3xl leading-[2.1] text-[#D9B457] [font-family:var(--font-obsidian-arabic)] sm:text-4xl">
          {cleanArabic(data.quote.arabic)}
        </p>
        {quoteText ? (
          <p className="mx-auto mt-8 max-w-2xl [font-family:var(--font-obsidian-heading)] text-lg italic leading-8 text-[#F6EBD1] sm:text-xl sm:leading-9">
            &ldquo;{quoteText}&rdquo;
          </p>
        ) : null}
        {data.quote.source ? <p className="mt-6 text-xs uppercase tracking-[0.32em] text-[#D7BD76]/75">{data.quote.source}</p> : null}
        <DiamondRule className="mx-auto mt-8 w-64" />
      </div>
    </section>
  );
}

function CoupleSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="couple" className="relative isolate overflow-hidden bg-[#070707] px-5 py-24">
      <LuxuryBackdrop muted />
      <SectionHeading eyebrow="Mempelai" title="Dua Hati, Satu Janji" />
      <div className="relative mx-auto mt-14 grid max-w-4xl gap-10 md:grid-cols-[1fr_auto_1fr] md:items-start">
        <PersonCard person={data.bride} kind="Putri" showPhoto={data.show_couple_photos !== false} />
        <div className="hidden h-full min-h-72 items-center justify-center md:flex">
          <div className="flex h-full flex-col items-center gap-4 text-[#D9B457]/70">
            <span className="h-24 w-px bg-current/45" />
            <span className="h-3 w-3 rotate-45 border border-current bg-[#060606]" />
            <span className="h-24 w-px bg-current/45" />
          </div>
        </div>
        <PersonCard person={data.groom} kind="Putra" showPhoto={data.show_couple_photos !== false} />
      </div>
    </section>
  );
}

function PersonCard({ person, kind, showPhoto }: { person: FatehaPerson; kind: "Putra" | "Putri"; showPhoto: boolean }) {
  return (
    <article className="relative overflow-hidden border border-[#D9B457]/35 bg-[linear-gradient(180deg,rgba(17,17,17,0.88),rgba(5,5,5,0.96))] px-5 py-8 text-center shadow-[0_26px_90px_rgba(0,0,0,0.34)]">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#F3D889]/70 to-transparent" />
      <GoldFloralSpray className="absolute -top-6 left-1/2 h-16 w-56 -translate-x-1/2 text-[#D9B457]/40" />
      {showPhoto ? (
        <div className="relative mx-auto h-52 w-52">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#D9B457_0%,transparent_62%)] opacity-20 blur-2xl" />
          <div className="absolute inset-4 rounded-full border border-[#D9B457]/35" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#D9B457] bg-[#141414] p-1 shadow-[0_0_52px_rgba(217,180,87,0.2)]">
            <img src={person.photo} alt={person.fullName} className="h-full w-full rounded-full object-cover grayscale-[0.35] sepia-[0.12]" loading="lazy" />
            <div className="absolute inset-1 rounded-full bg-[radial-gradient(circle_at_50%_35%,transparent_36%,rgba(0,0,0,0.5)_100%)]" />
          </div>
        </div>
      ) : null}
      <h3 className="mt-7 [font-family:var(--font-obsidian-heading)] text-4xl font-semibold text-[#D9B457]">{person.fullName}</h3>
      <DiamondRule className="mx-auto mt-5 w-44" />
      <p className="mt-5 text-xs uppercase tracking-[0.28em] text-[#D7BD76]/75">{kind} dari</p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#F6EBD1]/84">{parentLine(kind, person.father, person.mother)}</p>
    </article>
  );
}

function LoveStorySection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="story" className="relative isolate overflow-hidden bg-[#101010] px-5 py-24">
      <LuxuryBackdrop muted />
      <SectionHeading eyebrow="Kisah" title="Perjalanan Kami" />
      <div className="mx-auto mt-14 max-w-3xl">
        <div className="relative border-l border-dashed border-[#D9B457]/55 pl-8">
          {data.loveStory.map((story, index) => (
            <article
              key={`${story.year}-${story.title}`}
              className="relative mb-6 border border-[#D9B457]/30 bg-[linear-gradient(135deg,rgba(7,7,7,0.9),rgba(20,20,20,0.82))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.25)]"
            >
              <span className="absolute -left-[42px] top-7 h-4 w-4 rotate-45 border border-[#D9B457] bg-[#080808]" />
              <p className="text-xs uppercase tracking-[0.28em] text-[#D7BD76]">{story.year}</p>
              <h3 className="mt-3 [font-family:var(--font-obsidian-heading)] text-3xl font-semibold text-[#D9B457]">{story.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#F6EBD1]/82">{story.description}</p>
              {index % 2 === 0 ? <GoldFloralSpray className="absolute bottom-2 right-3 h-12 w-40 text-[#D9B457]/20" /> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="event" className="relative isolate overflow-hidden bg-[#060606] px-5 py-24">
      <LuxuryBackdrop muted />
      <SectionHeading eyebrow="Rangkaian Acara" title="Hari Bahagia" />
      <div className="mx-auto mt-14 grid max-w-3xl gap-5">
        <EventCard event={data.wedding.akad} variant="akad" />
        <EventCard event={data.wedding.reception} variant="resepsi" />
      </div>
    </section>
  );
}

function EventCard({ event, variant }: { event: FatehaEvent; variant: "akad" | "resepsi" }) {
  return (
    <article className="relative overflow-hidden border border-[#D9B457]/55 bg-[linear-gradient(135deg,rgba(13,15,28,0.92),rgba(5,5,5,0.96))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:p-6">
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#F3D889]/70 to-transparent" />
      <div className="grid gap-5 sm:grid-cols-[112px_1fr_auto] sm:items-center">
        <div className="mx-auto grid h-24 w-24 place-items-center border border-[#D9B457]/50 bg-[#080808]/70 text-[#D9B457]">
          <EventOrnament variant={variant} />
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.42em] text-[#D9B457]">{event.label}</p>
          <div className="mt-4 grid gap-2 text-sm leading-6 text-[#F6EBD1]/86">
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              <CalendarDays className="h-4 w-4 text-[#D9B457]" aria-hidden="true" />
              {formatDate(event.date)}
            </p>
            <p>{formatTime(event)}</p>
            <p className="font-medium text-[#F6EBD1]">{event.venue}</p>
            <p className="flex items-start justify-center gap-2 text-[#BFAE86] sm:justify-start">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#D9B457]" aria-hidden="true" />
              <span>{event.address}</span>
            </p>
          </div>
        </div>
        {event.mapsUrl ? (
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-[#D9B457] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#D9B457] transition hover:bg-[#D9B457] hover:text-[#050505]"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Buka Maps
          </a>
        ) : null}
      </div>
    </article>
  );
}

function GallerySection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="gallery" className="relative isolate overflow-hidden bg-[#101010] px-5 py-24">
      <LuxuryBackdrop muted />
      <SectionHeading eyebrow="Galeri" title="Momen Terpilih" />
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-2 sm:grid-cols-3">
        {data.gallery.map((item, index) => (
          <figure
            key={`${item.src}-${item.alt}`}
            className={cn(
              "group relative overflow-hidden border border-[#D9B457]/25 bg-[#0F0F1A]",
              index === 0 || index === 3 ? "aspect-[4/5] sm:row-span-2 sm:aspect-auto" : "aspect-square",
            )}
          >
            <img src={item.src} alt={item.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.45))]" />
            <div className="absolute inset-2 border border-[#D9B457]/20 opacity-0 transition group-hover:opacity-100" />
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
        // Seed messages stay visible when public messages are unavailable.
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
    <section id="rsvp" className="relative isolate overflow-hidden border-y border-[#D9B457]/35 bg-[#0A1020] px-5 py-24">
      <LuxuryBackdrop muted />
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="RSVP" title="Konfirmasi Kehadiran" />
        <div className="mt-10 border border-[#D9B457]/40 bg-[linear-gradient(135deg,rgba(8,12,25,0.94),rgba(8,8,8,0.98))] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.4)] sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[linear-gradient(135deg,#A87324,#F3D889,#B9872D)] text-[#050505] shadow-[0_0_42px_rgba(217,180,87,0.35)]">
                <Check className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="mt-6 [font-family:var(--font-obsidian-heading)] text-4xl font-semibold text-[#D9B457]">Terima Kasih</h3>
              <p className="mt-3 text-sm leading-6 text-[#BFAE86]">
                {canSubmit ? "Konfirmasi dan doa Anda telah kami terima." : "Ini adalah pratinjau. Form aktif setelah undangan dipublikasikan permanen."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
              <ObsidianField label="Nama">
                <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Masukkan nama Anda" autoComplete="name" />
              </ObsidianField>
              <ObsidianField label="Jumlah Tamu">
                <select value={form.guests} onChange={(event) => update("guests", event.target.value)}>
                  {[1, 2, 3, 4, 5].map((count) => (
                    <option key={count} value={count}>
                      {count} orang
                    </option>
                  ))}
                </select>
              </ObsidianField>
              <ObsidianField label="Kehadiran">
                <select value={form.attendance} onChange={(event) => update("attendance", event.target.value as AttendanceChoice | "")}>
                  <option value="">Pilih kehadiran Anda</option>
                  <option value="hadir">Ya, Hadir</option>
                  <option value="tidak_hadir">Tidak Hadir</option>
                  <option value="masih_ragu">Mungkin</option>
                </select>
              </ObsidianField>
              <ObsidianField label="Pesan / Ucapan" className="sm:col-span-2">
                <textarea value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tulis doa atau ucapan untuk kami..." rows={4} />
              </ObsidianField>
              {error ? <p className="border border-[#D9B457]/35 bg-[#D9B457]/10 px-4 py-3 text-sm text-[#F3D889] sm:col-span-2">{error}</p> : null}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-3 bg-[linear-gradient(135deg,#A87324,#F3D889,#B9872D)] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#050505] shadow-[0_14px_42px_rgba(217,180,87,0.22)] transition hover:brightness-110 sm:col-span-2"
                disabled={loading}
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {loading ? "Mengirim" : "Kirim Konfirmasi"}
              </button>
            </form>
          )}
        </div>
        {messages.length > 0 ? (
          <div className="mt-10 grid gap-3">
            {messages.slice(0, 4).map((message) => (
              <article key={message.id} className="border border-[#D9B457]/25 bg-[#090909]/88 p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-[#F3D889]">{message.name}</strong>
                  {message.attendance ? <span className="text-xs uppercase tracking-[0.18em] text-[#BFAE86]">{message.attendance}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#F6EBD1]/82">&ldquo;{message.message}&rdquo;</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function GiftSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="gift" className="relative isolate overflow-hidden bg-[#0B0B0B] px-5 py-24">
      <LuxuryBackdrop muted />
      <SectionHeading eyebrow="Hadiah" title="Hadiah & Doa" />
      <div className="mx-auto mt-12 grid max-w-2xl gap-4">
        {data.giftAccounts.map((account) => (
          <GiftAccountCard key={`${account.bank}-${account.number}`} account={account} />
        ))}
        {data.giftAddress ? (
          <div className="border border-[#D9B457]/35 bg-[linear-gradient(135deg,rgba(8,8,8,0.92),rgba(22,20,16,0.9))] p-6 text-center">
            <MapPin className="mx-auto h-6 w-6 text-[#D9B457]" aria-hidden="true" />
            <h3 className="mt-4 [font-family:var(--font-obsidian-heading)] text-3xl font-semibold text-[#D9B457]">Alamat Pengiriman</h3>
            <p className="mt-3 text-sm leading-7 text-[#F6EBD1]/82">{data.giftAddress}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function GiftAccountCard({ account }: { account: FatehaGiftAccount }) {
  return (
    <article className="border border-[#D9B457]/40 bg-[linear-gradient(135deg,rgba(8,8,8,0.95),rgba(18,18,28,0.92))] p-6 text-center shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
      <Gift className="mx-auto h-7 w-7 text-[#D9B457]" aria-hidden="true" />
      <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[#D9B457]">{account.bank}</p>
      <strong className="mt-3 block [font-family:var(--font-obsidian-heading)] text-3xl font-semibold text-[#F6EBD1]">{account.number}</strong>
      <p className="mt-2 text-sm text-[#BFAE86]">{account.name}</p>
      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 border border-[#D9B457] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#D9B457] transition hover:bg-[#D9B457] hover:text-[#050505]"
        onClick={() => {
          void navigator.clipboard.writeText(account.number);
          toast.success("Nomor rekening disalin.");
        }}
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
        Salin Nomor Rekening
      </button>
    </article>
  );
}

function ClosingSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="closing" className="relative isolate overflow-hidden bg-[#050505] px-5 py-28 pb-36 text-center">
      <LuxuryBackdrop frame />
      <GoldFloralCorner className="bottom-0 left-0 w-72 -translate-x-24 translate-y-8 opacity-85" />
      <GoldFloralCorner className="bottom-0 right-0 w-72 translate-x-24 translate-y-8 scale-x-[-1] opacity-85" />
      <div className="relative mx-auto max-w-3xl">
        <ArtDecoCrown className="mx-auto h-32 w-64 text-[#D9B457]" />
        <p className="mt-8 [font-family:var(--font-obsidian-heading)] text-2xl italic leading-9 text-[#F3D889]">
          Terima kasih atas doa, restu, dan kehadiran Bapak/Ibu/Saudara/i.
        </p>
        <DiamondRule className="mx-auto mt-8 w-72 max-w-full" />
        <h2 className="mt-10 bg-[linear-gradient(110deg,#9C6A24,#F3D889,#D9B457,#FFF1BB)] bg-[length:220%_100%] bg-clip-text [animation:obsidianShimmer_9s_ease-in-out_infinite] [font-family:var(--font-obsidian-script)] text-6xl font-bold italic leading-[0.95] text-transparent sm:text-7xl">
          {data.bride.nickname}
          <span className="block py-3 text-3xl text-[#F3D889]">&amp;</span>
          {data.groom.nickname}
        </h2>
        <GoldFloralSpray className="mx-auto mt-8 h-20 w-80 max-w-full text-[#D9B457]" />
        <p className="mt-8 text-xs uppercase tracking-[0.34em] text-[#D7BD76]/80">Bagikan kebahagiaan ini</p>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="relative mx-auto max-w-2xl text-center">
      <GoldFloralSpray className="mx-auto mb-3 h-16 w-72 max-w-full text-[#D9B457]/75" />
      <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#BFAE86]">{eyebrow}</p>
      <h2 className="mt-4 [font-family:var(--font-obsidian-heading)] text-4xl font-semibold text-[#D9B457] sm:text-5xl">{title}</h2>
      <DiamondRule className="mx-auto mt-5 w-56" />
    </header>
  );
}

function ObsidianField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label
      className={cn(
        "grid gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#D9B457] [&_input]:border-0 [&_input]:border-b [&_input]:border-[#D9B457]/55 [&_input]:bg-transparent [&_input]:px-0 [&_input]:py-3 [&_input]:text-base [&_input]:normal-case [&_input]:tracking-normal [&_input]:text-[#F6EBD1] [&_input]:outline-none [&_input]:placeholder:text-[#9E906F] [&_select]:border-0 [&_select]:border-b [&_select]:border-[#D9B457]/55 [&_select]:bg-[#0A1020] [&_select]:px-0 [&_select]:py-3 [&_select]:text-base [&_select]:normal-case [&_select]:tracking-normal [&_select]:text-[#F6EBD1] [&_select]:outline-none [&_textarea]:border-0 [&_textarea]:border-b [&_textarea]:border-[#D9B457]/55 [&_textarea]:bg-transparent [&_textarea]:px-0 [&_textarea]:py-3 [&_textarea]:text-base [&_textarea]:normal-case [&_textarea]:tracking-normal [&_textarea]:text-[#F6EBD1] [&_textarea]:outline-none [&_textarea]:placeholder:text-[#9E906F]",
        className,
      )}
    >
      {label}
      {children}
    </label>
  );
}

function ObsidianNav() {
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[min(calc(100%_-_1rem),430px)] items-center justify-center border border-[#D9B457]/40 bg-[#060606]/88 p-1 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#BFAE86] transition hover:bg-[#D9B457]/14 hover:text-[#F3D889]"
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
          <span className="truncate">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

function MusicToggle({ musicUrl }: { musicUrl: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing]);

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="none" />
      <button
        type="button"
        aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
        onClick={() => setPlaying((current) => !current)}
        className={cn(
          "fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center border border-[#D9B457]/55 bg-[#060606]/88 text-[#D9B457] shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:bg-[#151515]",
          playing && "bg-[#D9B457] text-[#050505]",
        )}
      >
        {playing ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
      </button>
    </>
  );
}

function LuxuryBackdrop({ muted = false, frame = false }: { muted?: boolean; frame?: boolean }) {
  return (
    <>
      {frame ? (
        <div
          className="absolute inset-0 -z-10 bg-[url('/themes/obsidian-luxe/obsidian-luxe-frame.png')] bg-contain bg-center bg-no-repeat opacity-95 saturate-[1.08] [filter:drop-shadow(0_0_46px_rgba(217,180,87,0.14))]"
          aria-hidden="true"
        />
      ) : null}
      <div
        className={cn(
          "absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_7%,rgba(217,180,87,0.22),transparent_22rem),radial-gradient(circle_at_12%_58%,rgba(217,180,87,0.1),transparent_16rem),radial-gradient(circle_at_82%_72%,rgba(217,180,87,0.13),transparent_18rem),linear-gradient(180deg,#050505_0%,#101010_48%,#050505_100%)]",
          frame && "bg-[radial-gradient(circle_at_50%_42%,rgba(0,0,0,0.08),rgba(0,0,0,0.74)_62%,rgba(0,0,0,0.38)_100%)]",
          muted && "opacity-55",
        )}
      />
      <div className={cn("absolute inset-0 -z-10 opacity-[0.11] bg-[radial-gradient(circle_at_center,#D9B457_0.9px,transparent_1px)] [background-size:17px_17px]", muted && "opacity-[0.055]")} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,transparent_0%,rgba(255,241,187,0.035)_45%,transparent_58%)]" />
      <GoldDust />
      <SparkleField />
      <AurumFoilRain />
    </>
  );
}

function GoldDust() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {dustParticles.map((classes, index) => (
        <span
          key={`dust-${index}`}
          className={cn(
            "absolute rounded-full bg-[#D9B457] opacity-0 shadow-[0_0_16px_rgba(217,180,87,0.78)] [animation:obsidianGoldDust_ease-in-out_infinite]",
            classes,
          )}
        />
      ))}
    </div>
  );
}

function SparkleField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {sparkleStars.map((classes, index) => (
        <span key={`sparkle-${index}`} className={cn("absolute text-[#F8E7A8] opacity-70 [animation:obsidianTwinkle_ease-in-out_infinite]", classes)}>
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-current to-transparent" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-current to-transparent" />
          <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current shadow-[0_0_22px_rgba(248,231,168,0.9)]" />
        </span>
      ))}
    </div>
  );
}

function AurumFoilRain() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {foilShards.map((classes, index) => (
        <span
          key={`foil-${index}`}
          className={cn(
            "absolute rounded-[1px] bg-[linear-gradient(110deg,rgba(130,82,18,0.2),#F6D77A_34%,#FFF2BD_52%,#A87324_78%)] opacity-0 shadow-[0_0_18px_rgba(217,180,87,0.5)] [animation:obsidianFoilDrift_linear_infinite] [clip-path:polygon(42%_0%,100%_18%,62%_100%,0%_76%)]",
            classes,
          )}
        />
      ))}
    </div>
  );
}

function ArtDecoCrown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 190" className={className} fill="none" aria-hidden="true">
      <path d="M38 152H322" stroke="currentColor" strokeWidth="2" opacity="0.78" />
      <path d="M78 152C93 97 119 67 151 55" stroke="currentColor" strokeWidth="2" opacity="0.82" />
      <path d="M282 152C267 97 241 67 209 55" stroke="currentColor" strokeWidth="2" opacity="0.82" />
      <path d="M118 152V80L152 111V42L180 14L208 42V111L242 80V152" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M145 152V94L165 112V53L180 34L195 53V112L215 94V152" stroke="currentColor" strokeWidth="1.8" opacity="0.7" />
      <path d="M92 152V119L120 131V152" stroke="currentColor" strokeWidth="2" opacity="0.72" />
      <path d="M268 152V119L240 131V152" stroke="currentColor" strokeWidth="2" opacity="0.72" />
      <path d="M114 152C126 114 147 90 180 76C213 90 234 114 246 152" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <path d="M180 14V170" stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
      <path d="M180 174L186 168L180 162L174 168L180 174Z" stroke="currentColor" strokeWidth="2" />
      <path d="M38 152H78M282 152H322" stroke="currentColor" strokeWidth="4" opacity="0.3" />
    </svg>
  );
}

function GoldFloralCorner({ className }: { className?: string }) {
  return (
    <img
      src={OBSIDIAN_CORNER_SRC}
      alt=""
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-0 select-none object-contain [filter:drop-shadow(0_0_18px_rgba(217,180,87,0.24))]", className)}
      loading="lazy"
    />
  );
}

function GoldFloralSpray({ className }: { className?: string }) {
  return (
    <img
      src={OBSIDIAN_DIVIDER_SRC}
      alt=""
      aria-hidden="true"
      className={cn("pointer-events-none select-none object-contain [filter:drop-shadow(0_0_16px_rgba(217,180,87,0.2))]", className)}
      loading="lazy"
    />
  );
}

function DiamondRule({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 text-[#D9B457]", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-current/60" />
      <span className="h-3 w-3 rotate-45 border border-current bg-[#060606] shadow-[0_0_16px_rgba(217,180,87,0.35)]" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-current to-current/60" />
    </div>
  );
}

function EventOrnament({ variant }: { variant: "akad" | "resepsi" }) {
  if (variant === "akad") {
    return (
      <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none" aria-hidden="true">
        <path d="M18 64V39C18 27 28 17 40 17C52 17 62 27 62 39V64" stroke="currentColor" strokeWidth="2" />
        <path d="M27 64V41C27 34 33 28 40 28C47 28 53 34 53 41V64" stroke="currentColor" strokeWidth="1.6" opacity="0.72" />
        <path d="M12 64H68" stroke="currentColor" strokeWidth="2" />
        <path d="M40 17V10M34 12H46" stroke="currentColor" strokeWidth="1.6" opacity="0.85" />
        <path d="M20 54C29 47 35 47 40 54C45 47 51 47 60 54" stroke="currentColor" strokeWidth="1.4" opacity="0.65" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16" fill="none" aria-hidden="true">
      <path d="M18 64V39C18 26 28 16 40 16C52 16 62 26 62 39V64" stroke="currentColor" strokeWidth="2" />
      <path d="M12 64H68" stroke="currentColor" strokeWidth="2" />
      <path d="M20 39C30 30 50 30 60 39" stroke="currentColor" strokeWidth="1.5" opacity="0.72" />
      <path d="M28 64V46M52 64V46" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <circle cx="29" cy="41" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="51" cy="41" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M34 41H46" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
