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
  "left-[9%] top-[76%] h-1 w-1 [animation-delay:-1s] [animation-duration:9s]",
  "left-[18%] top-[58%] h-1.5 w-1.5 [animation-delay:-5s] [animation-duration:12s]",
  "left-[26%] top-[84%] h-1 w-1 [animation-delay:-8s] [animation-duration:10s]",
  "left-[37%] top-[70%] h-1.5 w-1.5 [animation-delay:-3s] [animation-duration:13s]",
  "left-[48%] top-[88%] h-1 w-1 [animation-delay:-11s] [animation-duration:11s]",
  "left-[58%] top-[62%] h-1.5 w-1.5 [animation-delay:-6s] [animation-duration:12s]",
  "left-[69%] top-[79%] h-1 w-1 [animation-delay:-9s] [animation-duration:10s]",
  "left-[78%] top-[54%] h-1.5 w-1.5 [animation-delay:-2s] [animation-duration:14s]",
  "left-[88%] top-[82%] h-1 w-1 [animation-delay:-12s] [animation-duration:11s]",
  "left-[94%] top-[67%] h-1.5 w-1.5 [animation-delay:-4s] [animation-duration:13s]",
  "left-[14%] top-[35%] h-1 w-1 [animation-delay:-7s] [animation-duration:12s]",
  "left-[83%] top-[31%] h-1 w-1 [animation-delay:-10s] [animation-duration:12s]",
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
  if (!value || value.includes("Ø") || value.includes("Ù")) return FALLBACK_ARABIC_QUOTE;
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
  const sectionOrder = useMemo(() => getVisibleSections(data), [data]);

  return (
    <div className={cn("relative min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#F5F0E8] [font-family:var(--font-obsidian-body)]", obsidianLuxeFontClassName)}>
      <main>
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
    </div>
  );
}

function CoverSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="cover" className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-[#0A0A0A] px-6 py-16 text-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(201,168,76,0.18),transparent_25rem),radial-gradient(circle_at_15%_85%,rgba(232,213,163,0.08),transparent_18rem),linear-gradient(180deg,#0A0A0A_0%,#141414_62%,#0A0A0A_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.035] bg-[radial-gradient(circle_at_center,#C9A84C_1px,transparent_1px)] [background-size:22px_22px]" />
      <GoldDust />
      <ArtDecoCorners />

      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <p className="text-xs font-light tracking-[0.46em] text-[#C9A84C]/80 [font-family:var(--font-obsidian-heading)]">{shortInitials(data)}</p>
        <div className="mx-auto mt-8 h-px w-44 bg-[#C9A84C]/60" />
        <h1 className="mx-auto mt-12 bg-[linear-gradient(110deg,#A67C2D,#C9A84C_35%,#F4E5B8_58%,#C9A84C)] bg-clip-text text-transparent [font-family:var(--font-obsidian-script)] text-[clamp(2.2rem,8vw,4.8rem)] font-bold italic leading-[0.95] tracking-wide">
          {data.bride.nickname} &amp; {data.groom.nickname}
        </h1>
        <div className="mx-auto mt-10 flex max-w-xs items-center justify-center gap-4 text-[#C9A84C]">
          <span className="h-px flex-1 bg-current/45" />
          <span className="text-sm">✦</span>
          <span className="h-px flex-1 bg-current/45" />
        </div>
        <p className="mt-8 text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#E8D5A3]">Mengundang Anda</p>
        <p className="mt-5 [font-family:var(--font-obsidian-heading)] text-lg font-light text-[#E8D5A3]">{formatDate(data.wedding.date)}</p>
      </div>
    </section>
  );
}

function OpeningQuoteSection({ data }: { data: FatehaInvitationData }) {
  const quoteText = data.quote.translation.trim();

  if (!quoteText && !data.quote.source) return null;

  return (
    <section id="quote" className="bg-[#141414] px-6 py-24 text-center">
      <div className="mx-auto max-w-3xl border-y border-[#C9A84C]/35 py-14">
        <p className="mx-auto max-w-2xl text-3xl leading-[2.1] text-[#C9A84C] [font-family:var(--font-obsidian-arabic)] sm:text-4xl">
          {cleanArabic(data.quote.arabic)}
        </p>
        {quoteText ? (
          <p className="mx-auto mt-8 max-w-2xl [font-family:var(--font-obsidian-heading)] text-xl italic leading-9 text-[#F5F0E8]">
            &ldquo;{quoteText}&rdquo;
          </p>
        ) : null}
        {data.quote.source ? <p className="mt-5 text-xs uppercase tracking-[0.28em] text-[#8A8070]">{data.quote.source}</p> : null}
      </div>
    </section>
  );
}

function CoupleSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="couple" className="relative overflow-hidden bg-[#0A0A0A] px-6 py-24">
      <SectionHeading eyebrow="Mempelai" title="Dua Hati, Satu Janji" />
      <div className="mx-auto mt-14 grid max-w-5xl gap-10 md:grid-cols-2">
        <PersonCard person={data.bride} kind="Putri" showPhoto={data.show_couple_photos !== false} />
        <PersonCard person={data.groom} kind="Putra" showPhoto={data.show_couple_photos !== false} />
      </div>
    </section>
  );
}

function PersonCard({ person, kind, showPhoto }: { person: FatehaPerson; kind: "Putra" | "Putri"; showPhoto: boolean }) {
  return (
    <article className="text-center">
      {showPhoto ? (
        <div className="relative mx-auto h-48 w-48">
          <div className="absolute inset-4 rounded-full bg-[#C9A84C]/15 blur-3xl" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#C9A84C] bg-[#141414] p-1 shadow-[0_0_40px_rgba(201,168,76,0.15)]">
            <img src={person.photo} alt={person.fullName} className="h-full w-full rounded-full object-cover grayscale-[0.18]" loading="lazy" />
          </div>
        </div>
      ) : null}
      <h3 className="mt-7 [font-family:var(--font-obsidian-heading)] text-3xl font-semibold text-[#C9A84C]">{person.fullName}</h3>
      <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[#8A8070]">{kind} dari:</p>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#F5F0E8]/88">{parentLine(kind, person.father, person.mother)}</p>
    </article>
  );
}

function LoveStorySection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="story" className="bg-[#141414] px-6 py-24">
      <SectionHeading eyebrow="Kisah" title="Perjalanan Kami" />
      <div className="mx-auto mt-14 max-w-3xl">
        <div className="relative border-l border-dashed border-[#C9A84C]/55 pl-8">
          {data.loveStory.map((story, index) => (
            <article key={`${story.year}-${story.title}`} className={cn("relative mb-6 p-6", index % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#141414]")}>
              <span className="absolute -left-[42px] top-7 text-lg text-[#C9A84C]">✦</span>
              <p className="text-xs uppercase tracking-[0.24em] text-[#E8D5A3]">{story.year}</p>
              <h3 className="mt-3 [font-family:var(--font-obsidian-heading)] text-2xl font-semibold text-[#C9A84C]">{story.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/82">{story.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="event" className="bg-[#0A0A0A] px-6 py-24">
      <SectionHeading eyebrow="Rangkaian Acara" title="Hari Bahagia" />
      <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2">
        <EventCard event={data.wedding.akad} />
        <EventCard event={data.wedding.reception} />
      </div>
    </section>
  );
}

function EventCard({ event }: { event: FatehaEvent }) {
  return (
    <article className="border border-[#C9A84C]/40 bg-[#0F0F1A] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.25em] text-[#C9A84C]">{event.label}</p>
      <h3 className="mt-6 [font-family:var(--font-obsidian-heading)] text-2xl font-semibold text-[#C9A84C]">{formatDate(event.date)}</h3>
      <p className="mt-3 text-sm text-[#F5F0E8]">{formatTime(event)}</p>
      <p className="mt-6 font-medium text-[#F5F0E8]">{event.venue}</p>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#8A8070]">{event.address}</p>
      {event.mapsUrl ? (
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 border border-[#C9A84C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Buka Maps
        </a>
      ) : null}
    </article>
  );
}

function GallerySection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="gallery" className="bg-[#141414] px-6 py-24">
      <SectionHeading eyebrow="Galeri" title="Momen Terpilih" />
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-2">
        {data.gallery.map((item) => (
          <figure key={`${item.src}-${item.alt}`} className="group relative aspect-[4/5] overflow-hidden bg-[#0F0F1A]">
            <img src={item.src} alt={item.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-[#C9A84C]/0 transition group-hover:bg-[#C9A84C]/15" />
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
    <section id="rsvp" className="border-y border-[#C9A84C]/35 bg-[#0F0F1A] px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center [font-family:var(--font-obsidian-heading)] text-4xl font-semibold text-[#C9A84C]">Konfirmasi Kehadiran</h2>
        <div className="mx-auto mt-4 h-px w-24 bg-[#C9A84C]/55" />
        <div className="mt-10 border border-[#C9A84C]/35 bg-[#0A0A0A]/65 p-6 sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#C9A84C] text-[#0A0A0A]">
                <Check className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="mt-6 [font-family:var(--font-obsidian-heading)] text-3xl font-semibold text-[#C9A84C]">Terima Kasih</h3>
              <p className="mt-3 text-sm leading-6 text-[#8A8070]">
                {canSubmit ? "Konfirmasi dan doa Anda telah kami terima." : "Ini adalah pratinjau. Form aktif setelah undangan dipublikasikan permanen."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-6">
              <ObsidianField label="Nama">
                <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Masukkan nama Anda" autoComplete="name" />
              </ObsidianField>
              <ObsidianField label="Jumlah Tamu">
                <select value={form.guests} onChange={(event) => update("guests", event.target.value)}>
                  {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} orang</option>)}
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
              <ObsidianField label="Pesan / Ucapan">
                <textarea value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tulis doa atau ucapan untuk kami..." rows={4} />
              </ObsidianField>
              {error ? <p className="border border-[#C9A84C]/35 bg-[#C9A84C]/10 px-4 py-3 text-sm text-[#E8D5A3]">{error}</p> : null}
              <button type="submit" className="inline-flex items-center justify-center gap-3 bg-[#C9A84C] px-7 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#0A0A0A] transition hover:bg-[#E8D5A3]" disabled={loading}>
                <Send className="h-4 w-4" aria-hidden="true" />
                {loading ? "Mengirim" : "Kirim Konfirmasi"}
              </button>
            </form>
          )}
        </div>
        {messages.length > 0 ? (
          <div className="mt-10 grid gap-3">
            {messages.slice(0, 4).map((message) => (
              <article key={message.id} className="border border-[#C9A84C]/25 bg-[#141414] p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-[#E8D5A3]">{message.name}</strong>
                  {message.attendance ? <span className="text-xs uppercase tracking-[0.18em] text-[#8A8070]">{message.attendance}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#F5F0E8]/82">&ldquo;{message.message}&rdquo;</p>
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
    <section id="gift" className="bg-[#141414] px-6 py-24">
      <SectionHeading eyebrow="Hadiah" title="Hadiah & Doa" />
      <div className="mx-auto mt-12 grid max-w-2xl gap-4">
        {data.giftAccounts.map((account) => <GiftAccountCard key={`${account.bank}-${account.number}`} account={account} />)}
        {data.giftAddress ? (
          <div className="border border-[#C9A84C]/35 bg-[#0F0F1A] p-6 text-center">
            <MapPin className="mx-auto h-6 w-6 text-[#C9A84C]" aria-hidden="true" />
            <h3 className="mt-4 [font-family:var(--font-obsidian-heading)] text-2xl font-semibold text-[#C9A84C]">Alamat Pengiriman</h3>
            <p className="mt-3 text-sm leading-7 text-[#F5F0E8]/82">{data.giftAddress}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function GiftAccountCard({ account }: { account: FatehaGiftAccount }) {
  return (
    <article className="border border-[#C9A84C]/40 bg-[#0F0F1A] p-6 text-center">
      <Gift className="mx-auto h-7 w-7 text-[#C9A84C]" aria-hidden="true" />
      <p className="mt-4 text-xs uppercase tracking-[0.26em] text-[#C9A84C]">{account.bank}</p>
      <strong className="mt-3 block [font-family:var(--font-obsidian-heading)] text-3xl font-semibold text-[#F5F0E8]">{account.number}</strong>
      <p className="mt-2 text-sm text-[#8A8070]">{account.name}</p>
      <button
        type="button"
        className="mt-5 inline-flex items-center gap-2 border border-[#C9A84C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-[#0A0A0A]"
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
    <section id="closing" className="relative overflow-hidden bg-[#0A0A0A] px-6 py-28 pb-36 text-center">
      <GoldDust />
      <div className="mx-auto max-w-3xl">
        <ArtDecoOrnament />
        <p className="mt-10 [font-family:var(--font-obsidian-heading)] text-2xl italic leading-9 text-[#E8D5A3]">
          Terima kasih atas doa dan kehadiran Anda
        </p>
        <div className="mx-auto mt-8 h-px w-44 bg-[#C9A84C]/55" />
        <h2 className="mt-10 bg-[linear-gradient(110deg,#C9A84C,#F4E5B8,#C9A84C)] bg-clip-text [font-family:var(--font-obsidian-script)] text-5xl font-bold italic leading-tight text-transparent sm:text-6xl">
          {data.bride.fullName}
          <span className="block text-3xl text-[#E8D5A3]">&amp;</span>
          {data.groom.fullName}
        </h2>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.32em] text-[#8A8070]">{eyebrow}</p>
      <h2 className="mt-4 [font-family:var(--font-obsidian-heading)] text-4xl font-semibold text-[#C9A84C] sm:text-5xl">{title}</h2>
      <div className="mx-auto mt-5 flex w-44 items-center justify-center gap-3 text-[#C9A84C]">
        <span className="h-px flex-1 bg-current/45" />
        <span className="text-xs">✦</span>
        <span className="h-px flex-1 bg-current/45" />
      </div>
    </header>
  );
}

function ObsidianField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[#C9A84C] [&_input]:border-0 [&_input]:border-b [&_input]:border-[#C9A84C]/45 [&_input]:bg-transparent [&_input]:px-0 [&_input]:py-3 [&_input]:text-base [&_input]:normal-case [&_input]:tracking-normal [&_input]:text-[#F5F0E8] [&_input]:outline-none [&_input]:placeholder:text-[#8A8070] [&_select]:border-0 [&_select]:border-b [&_select]:border-[#C9A84C]/45 [&_select]:bg-[#0A0A0A] [&_select]:px-0 [&_select]:py-3 [&_select]:text-base [&_select]:normal-case [&_select]:tracking-normal [&_select]:text-[#F5F0E8] [&_select]:outline-none [&_textarea]:border-0 [&_textarea]:border-b [&_textarea]:border-[#C9A84C]/45 [&_textarea]:bg-transparent [&_textarea]:px-0 [&_textarea]:py-3 [&_textarea]:text-base [&_textarea]:normal-case [&_textarea]:tracking-normal [&_textarea]:text-[#F5F0E8] [&_textarea]:outline-none [&_textarea]:placeholder:text-[#8A8070]">
      {label}
      {children}
    </label>
  );
}

function ObsidianNav() {
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[min(calc(100%_-_1rem),430px)] items-center justify-center border border-[#C9A84C]/35 bg-[#0A0A0A]/82 p-1 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-[#8A8070] transition hover:bg-[#C9A84C]/12 hover:text-[#C9A84C]">
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
          "fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center border border-[#C9A84C]/45 bg-[#0A0A0A]/86 text-[#C9A84C] shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:bg-[#141414]",
          playing && "bg-[#C9A84C] text-[#0A0A0A]",
        )}
      >
        {playing ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
      </button>
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
            "absolute rounded-full bg-[#C9A84C] opacity-0 shadow-[0_0_14px_rgba(201,168,76,0.75)] [animation:obsidianGoldDust_ease-in-out_infinite]",
            classes,
          )}
        />
      ))}
    </div>
  );
}

function ArtDecoCorners() {
  const base = "absolute h-24 w-24 border-[#C9A84C]/45";

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <span className={cn(base, "left-5 top-5 border-l border-t")} />
      <span className={cn(base, "right-5 top-5 border-r border-t")} />
      <span className={cn(base, "bottom-5 left-5 border-b border-l")} />
      <span className={cn(base, "bottom-5 right-5 border-b border-r")} />
    </div>
  );
}

function ArtDecoOrnament() {
  return (
    <div className="mx-auto flex w-64 items-center justify-center gap-4 text-[#C9A84C]" aria-hidden="true">
      <span className="h-px flex-1 bg-current/45" />
      <span className="border border-current px-3 py-2 text-xs tracking-[0.32em]">✦</span>
      <span className="h-px flex-1 bg-current/45" />
    </div>
  );
}
