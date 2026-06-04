/* Petal Soft wedding invitation renderer based on the Petal Soft reference mockups provided on June 4, 2026. */

"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Copy,
  Flower2,
  Gift,
  Heart,
  Home,
  Instagram,
  MapPin,
  MessageCircle,
  Music2,
  Navigation,
  Send,
  Share2,
  UserRound,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { FatehaEvent, FatehaGiftAccount, FatehaInvitationData, FatehaRsvpMessage } from "@/components/themes/fateha";
import { petalSoftFontClassName } from "./fonts";

type PetalSoftSectionId = "cover" | "quote" | "couple" | "story" | "event" | "gallery" | "rsvp" | "gift" | "closing";
type AttendanceChoice = "hadir" | "tidak_hadir";
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
type SectionConfigurableData = FatehaInvitationData & {
  sections_visibility?: Partial<Record<PetalSoftSectionId, boolean>>;
  sections_order?: PetalSoftSectionId[];
};

const DEFAULT_SECTION_ORDER: PetalSoftSectionId[] = ["cover", "quote", "couple", "event", "story", "gallery", "rsvp", "gift", "closing"];
const FALLBACK_BISMILLAH = "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ";
const FALLBACK_ARABIC_QUOTE =
  "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنْفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً";
const DEFAULT_AUDIO = "/themes/fateha/audio/you-are-the-one.mp3";

const navItems = [
  { href: "#cover", icon: Home, label: "Utama" },
  { href: "#couple", icon: UserRound, label: "Mempelai" },
  { href: "#event", icon: CalendarDays, label: "Acara" },
  { href: "#rsvp", icon: MessageCircle, label: "RSVP" },
  { href: "#closing", icon: Heart, label: "Penutup" },
] as const;

const petalClasses = [
  "petal-soft-float-one left-[12%] top-[18%]",
  "petal-soft-float-two right-[18%] top-[32%]",
  "petal-soft-float-three left-[22%] top-[62%]",
  "petal-soft-float-four right-[12%] top-[70%]",
  "petal-soft-float-five left-[50%] top-[26%]",
] as const;

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

function cleanArabic(value: string | null | undefined, fallback: string) {
  if (!value || value.includes("Ù") || value.includes("Ø")) return fallback;
  return value;
}

function getVisibleSections(data: FatehaInvitationData): PetalSoftSectionId[] {
  const configurable = data as SectionConfigurableData;
  const order = Array.isArray(configurable.sections_order) && configurable.sections_order.length > 0
    ? configurable.sections_order
    : DEFAULT_SECTION_ORDER;

  return order.filter((section) => configurable.sections_visibility?.[section] !== false);
}

function parentLine(kind: "Putra" | "Putri", father: string | null, mother: string | null) {
  if (!father && !mother) return `${kind} tercinta dari keluarga besar`;
  if (father && mother) return `${kind} dari ${father} dan ${mother}`;
  return `${kind} dari ${father ?? mother}`;
}

export function PetalSoftTemplate({ data }: { data: FatehaInvitationData }) {
  const sectionOrder = useMemo(() => getVisibleSections(data), [data]);

  return (
    <div className={cn("petal-soft-theme", petalSoftFontClassName)}>
      <FloatingPetals />
      <MusicToggle musicUrl={data.musicUrl || DEFAULT_AUDIO} />
      <PetalSoftNav />
      <main className="petal-soft-shell">
        {sectionOrder.map((section) => {
          if (section === "cover") return <CoverSection key={section} data={data} />;
          if (section === "quote") return <QuoteSection key={section} data={data} />;
          if (section === "couple") return <CoupleSection key={section} data={data} />;
          if (section === "event") return <EventSection key={section} data={data} />;
          if (section === "story" && data.loveStory.length > 0) return <StorySection key={section} data={data} />;
          if (section === "gallery" && data.gallery.length > 0) return <GallerySection key={section} data={data} />;
          if (section === "rsvp") return <RsvpSection key={section} data={data} />;
          if (section === "gift" && (data.giftAccounts.length > 0 || data.giftAddress)) return <GiftSection key={section} data={data} />;
          if (section === "closing") return <ClosingSection key={section} data={data} />;
          return null;
        })}
      </main>
    </div>
  );
}

function CoverSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="cover" className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-5 py-16 text-center">
      <FloralCorner position="top-left" />
      <FloralCorner position="top-right" />
      <FloralCorner position="bottom-left" />
      <FloralCorner position="bottom-right" />

      <div className="relative z-10 mx-auto w-full max-w-[430px]">
        <p className="petal-soft-kicker">Undangan Pernikahan</p>
        <h1 className="petal-soft-script mt-14 text-[6rem] leading-[0.82] text-petal-rose sm:text-[7.5rem]">
          <span className="block">{data.bride.nickname}</span>
          <span className="petal-soft-serif block py-4 text-3xl font-medium text-petal-body">&amp;</span>
          <span className="block">{data.groom.nickname}</span>
        </h1>
        <div className="petal-soft-divider my-8" aria-hidden="true">
          <Heart className="h-4 w-4 fill-current" />
        </div>
        <p className="petal-soft-serif text-2xl font-medium text-petal-body">{formatDate(data.wedding.date)}</p>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-petal-muted">
          Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada hari bahagia kami.
        </p>
      </div>
    </section>
  );
}

function QuoteSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="quote" className="petal-soft-section bg-petal-sage/35">
      <div className="mx-auto max-w-2xl text-center">
        <Ornament />
        <p className="petal-soft-arabic mt-5 text-4xl leading-relaxed text-petal-body">
          {cleanArabic(data.quote.bismillah, FALLBACK_BISMILLAH)}
        </p>
        <p className="petal-soft-arabic mt-4 text-2xl leading-relaxed text-petal-body/80">
          {cleanArabic(data.quote.arabic, FALLBACK_ARABIC_QUOTE)}
        </p>
        <p className="petal-soft-serif mx-auto mt-5 max-w-xl text-lg italic leading-8 text-petal-body">
          {data.quote.translation}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-petal-rose">{data.quote.source}</p>
        <Ornament className="mt-5 rotate-180" />
      </div>
    </section>
  );
}

function CoupleSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="couple" className="petal-soft-section relative overflow-hidden bg-petal-paper">
      <FloralCorner position="top-left" subtle />
      <FloralCorner position="bottom-right" subtle />
      <SectionTitle title="Mempelai" subtitle="Dengan memohon rahmat dan ridha Allah SWT, kami memperkenalkan kedua mempelai." />
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
        <PersonCard
          name={data.groom.fullName}
          nickname={data.groom.nickname}
          description={parentLine("Putra", data.groom.father, data.groom.mother)}
          photo={data.groom.photo}
        />
        <PersonCard
          name={data.bride.fullName}
          nickname={data.bride.nickname}
          description={parentLine("Putri", data.bride.father, data.bride.mother)}
          photo={data.bride.photo}
        />
      </div>
    </section>
  );
}

function PersonCard({ name, nickname, description, photo }: { name: string; nickname: string; description: string; photo: string }) {
  return (
    <article className="text-center">
      <div className="petal-soft-portrait mx-auto">
        <img src={photo} alt={`Foto ${nickname}`} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <h3 className="petal-soft-serif mt-5 text-3xl font-semibold text-petal-body">{nickname}</h3>
      <div className="petal-soft-divider mx-auto my-3 w-36" aria-hidden="true">
        <Heart className="h-3 w-3 fill-current" />
      </div>
      <p className="font-medium text-petal-body">{name}</p>
      <p className="mx-auto mt-2 max-w-[14rem] text-sm leading-6 text-petal-muted">{description}</p>
    </article>
  );
}

function EventSection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="event" className="petal-soft-section bg-petal-paper">
      <SectionTitle title="Rangkaian Acara" subtitle="Detail waktu dan tempat acara pernikahan kami." />
      <div className="mx-auto grid max-w-3xl gap-4">
        <EventCard event={data.wedding.akad} icon="akad" />
        <EventCard event={data.wedding.reception} icon="resepsi" />
      </div>
      <LocationBlock data={data} />
    </section>
  );
}

function EventCard({ event, icon }: { event: FatehaEvent; icon: "akad" | "resepsi" }) {
  return (
    <article className="petal-soft-card grid gap-4 p-5 sm:grid-cols-[130px_1fr] sm:items-center">
      <div className="flex flex-col items-center justify-center border-b border-petal-line pb-4 text-center sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-petal-rose/35 text-petal-rose">
          {icon === "akad" ? <Flower2 className="h-8 w-8" aria-hidden="true" /> : <Heart className="h-8 w-8" aria-hidden="true" />}
        </span>
        <h3 className="petal-soft-serif mt-3 text-3xl font-medium text-petal-body">{event.label}</h3>
      </div>
      <div className="grid gap-3 text-sm leading-6 text-petal-body">
        <p className="flex gap-3">
          <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-petal-rose" aria-hidden="true" />
          <span>{formatDate(event.date)}</span>
        </p>
        <p className="flex gap-3">
          <Music2 className="mt-0.5 h-5 w-5 shrink-0 text-petal-rose" aria-hidden="true" />
          <span>{formatTime(event)}</span>
        </p>
        <p className="flex gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-petal-rose" aria-hidden="true" />
          <span>
            <strong className="block font-semibold">{event.venue}</strong>
            {event.address}
          </span>
        </p>
      </div>
    </article>
  );
}

function LocationBlock({ data }: { data: FatehaInvitationData }) {
  const mapsUrl = data.wedding.mapsUrl || data.wedding.akad.mapsUrl || data.wedding.reception.mapsUrl;

  return (
    <div className="mx-auto mt-6 max-w-3xl rounded-[1.5rem] border border-petal-line bg-petal-sage/25 p-5 text-center">
      <MapPin className="mx-auto h-8 w-8 text-petal-rose" aria-hidden="true" />
      <h3 className="petal-soft-serif mt-3 text-3xl font-semibold text-petal-body">{data.wedding.venue}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-petal-muted">{data.wedding.address}</p>
      {mapsUrl ? (
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="petal-soft-button mt-5">
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Buka Peta
        </a>
      ) : null}
    </div>
  );
}

function StorySection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="story" className="petal-soft-section bg-petal-sage/25">
      <SectionTitle title="Kisah Kami" subtitle="Beberapa momen yang membawa kami menuju hari bahagia ini." />
      <div className="mx-auto grid max-w-3xl gap-4">
        {data.loveStory.map((story) => (
          <article key={`${story.year}-${story.title}`} className="petal-soft-card p-5">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-petal-rose">{story.year}</span>
            <h3 className="petal-soft-serif mt-2 text-3xl font-semibold text-petal-body">{story.title}</h3>
            <p className="mt-2 text-sm leading-7 text-petal-muted">{story.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ data }: { data: FatehaInvitationData }) {
  return (
    <section id="gallery" className="petal-soft-section bg-petal-paper">
      <SectionTitle title="Galeri" subtitle="Potongan kecil dari perjalanan dan kebahagiaan kami." />
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
        {data.gallery.slice(0, 6).map((item, index) => (
          <figure key={`${item.src}-${index}`} className="overflow-hidden rounded-[1.35rem] border border-petal-line bg-white shadow-[0_18px_45px_rgba(196,145,155,0.13)]">
            <img src={item.src} alt={item.alt} className="aspect-[3/4] w-full object-cover" loading="lazy" />
            {item.caption ? <figcaption className="px-3 py-2 text-center text-xs font-medium text-petal-muted">{item.caption}</figcaption> : null}
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
        // Fallback seed messages remain visible when public messages are unavailable.
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
    <section id="rsvp" className="petal-soft-section relative overflow-hidden bg-petal-sage/35">
      <FloralCorner position="bottom-left" subtle />
      <FloralCorner position="top-right" subtle />
      <SectionTitle title="Konfirmasi Kehadiran" subtitle="Mohon isi konfirmasi agar kami dapat menyambut Anda dengan baik." />
      <div className="mx-auto max-w-2xl">
        <div className="petal-soft-card p-5 sm:p-7">
          {submitted ? (
            <div className="py-8 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-petal-sage text-white">
                <Check className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="petal-soft-serif mt-5 text-4xl font-semibold text-petal-body">Terima Kasih</h3>
              <p className="mt-2 text-sm leading-6 text-petal-muted">
                {canSubmit ? "Konfirmasi dan doa Anda telah kami terima." : "Ini adalah pratinjau. Form aktif setelah undangan dipublikasikan permanen."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <label className="petal-soft-label">
                Nama
                <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Masukkan nama Anda" autoComplete="name" />
              </label>
              <label className="petal-soft-label">
                Jumlah Tamu
                <select value={form.guests} onChange={(event) => update("guests", event.target.value)}>
                  {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} orang</option>)}
                </select>
              </label>
              <label className="petal-soft-label">
                Kehadiran
                <select value={form.attendance} onChange={(event) => update("attendance", event.target.value as AttendanceChoice | "")}>
                  <option value="">Pilih kehadiran Anda</option>
                  <option value="hadir">Hadir</option>
                  <option value="tidak_hadir">Tidak Hadir</option>
                </select>
              </label>
              <label className="petal-soft-label">
                Pesan / Ucapan
                <textarea value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tulis doa atau ucapan untuk kami..." />
              </label>
              {error ? <p className="rounded-xl border border-petal-rose/25 bg-petal-blush/50 px-4 py-3 text-sm text-petal-rose">{error}</p> : null}
              <button type="submit" className="petal-soft-button mx-auto min-w-56" disabled={loading}>
                <Send className="h-4 w-4" aria-hidden="true" />
                {loading ? "Mengirim" : "Kirim Konfirmasi"}
              </button>
            </form>
          )}
        </div>
        {messages.length > 0 ? (
          <div className="mt-8 grid gap-3">
            <h3 className="petal-soft-serif text-center text-4xl font-semibold text-petal-body">Ucapan & Doa</h3>
            {messages.slice(0, 4).map((message) => (
              <article key={message.id} className="rounded-2xl border border-petal-line bg-white/75 p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm text-petal-body">{message.name}</strong>
                  {message.attendance ? <span className="rounded-full bg-petal-sage/35 px-3 py-1 text-[11px] font-semibold text-petal-body">{message.attendance}</span> : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-petal-muted">&ldquo;{message.message}&rdquo;</p>
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
    <section id="gift" className="petal-soft-section bg-petal-paper">
      <SectionTitle title="Amplop Digital" subtitle="Doa restu Anda adalah hadiah terindah. Bila berkenan, tersedia pilihan amplop digital." />
      <div className="mx-auto grid max-w-2xl gap-3">
        {data.giftAccounts.map((account) => <GiftAccountCard key={`${account.bank}-${account.number}`} account={account} />)}
        {data.giftAddress ? (
          <div className="petal-soft-card p-5 text-center">
            <Gift className="mx-auto h-8 w-8 text-petal-rose" aria-hidden="true" />
            <h3 className="petal-soft-serif mt-3 text-3xl font-semibold text-petal-body">Kirim Hadiah</h3>
            <p className="mt-2 text-sm leading-6 text-petal-muted">{data.giftAddress}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function GiftAccountCard({ account }: { account: FatehaGiftAccount }) {
  return (
    <article className="petal-soft-card grid gap-2 p-5 text-center">
      <span className="text-xs font-bold uppercase tracking-[0.24em] text-petal-rose">{account.bank}</span>
      <strong className="petal-soft-serif text-3xl font-semibold text-petal-body">{account.number}</strong>
      <span className="text-sm text-petal-muted">{account.name}</span>
      <button
        type="button"
        className="mx-auto mt-2 inline-flex items-center gap-2 text-sm font-semibold text-petal-rose"
        onClick={() => {
          void navigator.clipboard.writeText(account.number);
          toast.success("Nomor rekening disalin.");
        }}
      >
        <Copy className="h-4 w-4" aria-hidden="true" />
        Salin Nomor
      </button>
    </article>
  );
}

function ClosingSection({ data }: { data: FatehaInvitationData }) {
  const shareText = `Undangan pernikahan ${data.bride.nickname} & ${data.groom.nickname}`;

  return (
    <section id="closing" className="petal-soft-section relative overflow-hidden bg-petal-paper pb-28 text-center">
      <FloralCorner position="bottom-left" />
      <FloralCorner position="bottom-right" />
      <div className="mx-auto max-w-2xl">
        <h2 className="petal-soft-serif text-5xl font-semibold text-petal-rose">Terima Kasih</h2>
        <div className="petal-soft-divider mx-auto my-4 w-56" aria-hidden="true">
          <Heart className="h-4 w-4 fill-current" />
        </div>
        <p className="mx-auto max-w-lg text-base leading-8 text-petal-body">
          Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        <p className="petal-soft-serif mt-4 text-lg font-semibold italic text-petal-body">Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.</p>
        <div className="petal-soft-script mt-8 text-6xl leading-none text-petal-rose">
          {data.bride.nickname} &amp; {data.groom.nickname}
        </div>
        <div className="mt-8">
          <p className="text-sm font-semibold text-petal-body">Bagikan Kebahagiaan Kami</p>
          <div className="mt-4 flex justify-center gap-3">
            <ShareButton label="WhatsApp" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}>
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </ShareButton>
            <ShareButton label="Instagram" href="https://www.instagram.com/">
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </ShareButton>
            <button
              type="button"
              aria-label="Salin tautan"
              className="grid h-11 w-11 place-items-center rounded-full border border-petal-rose/45 text-petal-rose transition hover:bg-petal-blush"
              onClick={() => {
                void navigator.clipboard.writeText(window.location.href);
                toast.success("Tautan undangan disalin.");
              }}
            >
              <Copy className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShareButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-petal-rose/45 text-petal-rose transition hover:bg-petal-blush">
      {children}
    </a>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mx-auto mb-8 max-w-xl text-center">
      <h2 className="petal-soft-serif text-4xl font-semibold text-petal-body sm:text-5xl">{title}</h2>
      <div className="petal-soft-divider mx-auto my-4 w-48" aria-hidden="true">
        <Heart className="h-4 w-4 fill-current" />
      </div>
      {subtitle ? <p className="text-sm leading-7 text-petal-muted">{subtitle}</p> : null}
    </header>
  );
}

function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex w-60 items-center justify-center gap-3 text-petal-sage", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-current" />
      <Flower2 className="h-6 w-6" />
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}

function PetalSoftNav() {
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[min(calc(100%_-_1rem),430px)] items-center justify-center gap-1 rounded-full border border-petal-line bg-white/85 p-1 shadow-[0_18px_45px_rgba(196,145,155,0.18)] backdrop-blur-xl">
      {navItems.map((item) => (
        <a key={item.href} href={item.href} className="flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-petal-muted transition hover:bg-petal-blush hover:text-petal-rose">
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
          "fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-petal-line bg-white/85 text-petal-rose shadow-[0_16px_38px_rgba(196,145,155,0.18)] backdrop-blur-xl transition",
          playing && "bg-petal-rose text-white",
        )}
      >
        {playing ? <Volume2 className="h-5 w-5" aria-hidden="true" /> : <VolumeX className="h-5 w-5" aria-hidden="true" />}
      </button>
    </>
  );
}

function FloatingPetals() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {petalClasses.map((className) => (
        <span key={className} className={cn("petal-soft-floating-petal", className)} />
      ))}
    </div>
  );
}

function FloralCorner({ position, subtle = false }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right"; subtle?: boolean }) {
  return (
    <div className={cn("petal-soft-floral-corner", `is-${position}`, subtle && "is-subtle")} aria-hidden="true">
      <span className="petal-soft-leaf leaf-1" />
      <span className="petal-soft-leaf leaf-2" />
      <span className="petal-soft-leaf leaf-3" />
      <span className="petal-soft-leaf leaf-4" />
      <span className="petal-soft-rose rose-1" />
      <span className="petal-soft-rose rose-2" />
      <span className="petal-soft-rose rose-3" />
      <span className="petal-soft-baby baby-1" />
      <span className="petal-soft-baby baby-2" />
      <span className="petal-soft-baby baby-3" />
    </div>
  );
}
