"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  Copy,
  Gift,
  Heart,
  Home,
  MapPin,
  MessageSquareText,
  Navigation,
  Phone,
  Send,
  UserRound,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { isCanonicalSectionVisible, normalizeSectionOrder, type CanonicalSectionId } from "@/lib/preview/section-aliases";
import { cn } from "@/lib/utils";
import { fatehaFontClassName } from "./fonts";
import { PetalsCanvas, type PetalsCanvasHandle } from "./PetalsCanvas";
import type { FatehaGalleryItem, FatehaInvitationData } from "./types";

type Step = 1 | 2 | 3;

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

const DEFAULT_AUDIO = "/themes/fateha/audio/you-are-the-one.mp3";

const navItems = [
  { href: "#home", icon: Home, label: "Utama" },
  { href: "#mempelai", icon: UserRound, label: "Mempelai" },
  { href: "#acara", icon: CalendarDays, label: "Acara" },
  { href: "#lokasi", icon: MapPin, label: "Lokasi" },
  { href: "#rsvp", icon: MessageSquareText, label: "RSVP" },
  { href: "#kontak", icon: Phone, label: "Kontak" },
] as const;

function formatDateDisplay(value: string | null) {
  if (!value) return "Tanggal akan diumumkan";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function formatDay(value: string | null) {
  if (!value) return "Hari";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Hari";
  return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date);
}

function formatTime(value: string | null) {
  if (!value) return "Waktu menyusul";
  if (/^\d{2}:\d{2}/.test(value)) return `${value.slice(0, 5)} WIB`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(date)} WIB`;
}

function getInitials(groom: string, bride: string) {
  return `${bride.trim().charAt(0) || "M"} ${groom.trim().charAt(0) || "P"}`.toUpperCase();
}

export function FatehaInvitationRenderer({ data }: { data: FatehaInvitationData }) {
  const [opened, setOpened] = useState(false);
  const canvasRef = useRef<PetalsCanvasHandle>(null);

  return (
    <div className={cn("fateha-theme", fatehaFontClassName)}>
      <PetalsCanvas ref={canvasRef} />
      {!opened ? <EnvelopeIntro data={data} onOpen={() => setOpened(true)} canvasRef={canvasRef} /> : null}
      {opened ? <MainContent data={data} /> : null}
    </div>
  );
}

function EnvelopeIntro({
  data,
  onOpen,
  canvasRef,
}: {
  data: FatehaInvitationData;
  onOpen: () => void;
  canvasRef: React.RefObject<PetalsCanvasHandle | null>;
}) {
  const [phase, setPhase] = useState<"entering" | "ready" | "opening">("entering");
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase("ready"), 180);
    return () => window.clearTimeout(timer);
  }, []);

  function handleOpen() {
    if (phase === "opening") return;
    if (canvasRef.current && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      canvasRef.current.triggerPetalBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    setPhase("opening");
    window.setTimeout(onOpen, 760);
  }

  return (
    <div className={cn("fateha-intro", phase === "opening" && "is-opening")}>
      <FloralCorner corner="top-left" className="intro-flower" />
      <FloralCorner corner="bottom-right" className="intro-flower" />
      <div className="fateha-intro-card">
        <MonogramSeal initials={data.monogram} label={`${data.bride.nickname} dan ${data.groom.nickname}`} />
        <p className="fateha-intro-title">Undangan Pernikahan</p>
        <div className="fateha-script-name" aria-label={`${data.bride.nickname} dan ${data.groom.nickname}`}>
          <span>{data.bride.nickname}</span>
          <span className="fateha-and">dan</span>
          <span>{data.groom.nickname}</span>
        </div>
        <OrnamentDivider />
        <EnvelopeSvg initials={data.monogram} />
        <button ref={btnRef} type="button" className="fateha-button" onClick={handleOpen} disabled={phase !== "ready"}>
          Buka Undangan
        </button>
        <p className="fateha-intro-date">
          {data.wedding.day} <span aria-hidden="true">•</span> {data.wedding.dateDisplay}
        </p>
      </div>
    </div>
  );
}

function MainContent({ data }: { data: FatehaInvitationData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionOrder = useMemo(
    () => normalizeSectionOrder(data.sections_order).filter((section) => isCanonicalSectionVisible(data.sections_visibility, section)),
    [data.sections_order, data.sections_visibility],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    root.querySelectorAll(".fateha-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data]);

  function renderSection(section: CanonicalSectionId) {
    if (section === "cover") return <HeroSection key={section} data={data} />;
    if (section === "quote") return <QuoteSection key={section} data={data} />;
    if (section === "couple") return <MempelaiSection key={section} data={data} />;
    if (section === "countdown") return <CountdownSection key={section} targetDate={data.wedding.date} />;
    if (section === "event") {
      return (
        <div key={section}>
          <AcaraSection data={data} />
          <LokasiSection data={data} />
        </div>
      );
    }
    if (section === "story" && data.loveStory.length > 0) return <LoveStorySection key={section} data={data} />;
    if (section === "gallery" && data.gallery.length > 0) return <GallerySection key={section} gallery={data.gallery} />;
    if (section === "rsvp") return <RsvpSection key={section} data={data} />;
    if (section === "closing") {
      return (
        <div key={section}>
          <KontakSection data={data} />
          <PenutupSection data={data} />
        </div>
      );
    }
    return null;
  }

  return (
    <main ref={rootRef} className="fateha-site">
      <MusicPlayer musicUrl={data.musicUrl || DEFAULT_AUDIO} />
      <BottomNav />
      {sectionOrder.map(renderSection)}
    </main>
  );
}

function HeroSection({ data }: { data: FatehaInvitationData }) {
  const [dateNumber, ...monthParts] = data.wedding.dateDisplay.split(" ");
  const monthName = monthParts.slice(0, -1).join(" ") || monthParts.join(" ");
  const year = monthParts[monthParts.length - 1] || "";

  return (
    <section id="home" className="fateha-hero">
      <FloralCorner corner="top-left" />
      <FloralCorner corner="top-right" />
      <FloralCorner corner="bottom-left" />
      <FloralCorner corner="bottom-right" />
      <ArchFrame className="fateha-hero-arch">
        <div className="fateha-hero-card">
          <MonogramSeal initials={data.monogram} label={`${data.bride.nickname} dan ${data.groom.nickname}`} />
          <p className="fateha-arabic">{data.quote.bismillah}</p>
          <p className="fateha-kicker">Dengan penuh rasa syukur</p>
          <div className="fateha-hero-names" aria-label={`${data.bride.nickname} dan ${data.groom.nickname}`}>
            <span>{data.bride.nickname}</span>
            <span className="fateha-and">dan</span>
            <span>{data.groom.nickname}</span>
          </div>
          <OrnamentDivider />
          <p className="fateha-hero-copy">Kami memohon doa restu dan mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.</p>
          <div className="fateha-date-grid" aria-label={data.wedding.dateDisplay}>
            <span>{data.wedding.day}</span>
            <span>
              <strong>{dateNumber}</strong>
              <small>{year}</small>
            </span>
            <span>{monthName || "Bulan"}</span>
          </div>
          <p className="fateha-venue">{data.wedding.venue}</p>
          <p className="fateha-address">{data.wedding.address}</p>
        </div>
      </ArchFrame>
      <div className="fateha-scroll" aria-hidden="true">Gulir</div>
    </section>
  );
}

function QuoteSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionShell id="quote" tone="pearl" narrow>
      <div className="fateha-panel fateha-reveal fateha-quote">
        <p className="fateha-arabic">{data.quote.arabic}</p>
        <OrnamentDivider />
        <p>{data.quote.translation}</p>
        <span>{data.quote.source}</span>
      </div>
    </SectionShell>
  );
}

function MempelaiSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionShell id="mempelai" tone="blue">
      <SectionHeader kicker="Mempelai" title="Pasangan Berbahagia" subtitle="Dengan penuh hormat, perkenankan kami memperkenalkan kedua mempelai." />
      <div className="fateha-couple-grid">
        <PersonCard person={data.bride} align="left" />
        <PersonCard person={data.groom} align="right" />
      </div>
    </SectionShell>
  );
}

function PersonCard({ person, align }: { person: FatehaInvitationData["bride"]; align: "left" | "right" }) {
  return (
    <article className={cn("fateha-card fateha-person fateha-reveal", align === "right" && "is-groom")}>
      <div className="fateha-photo">
        <Image src={person.photo} alt={person.fullName} fill sizes="(max-width: 768px) 80vw, 340px" unoptimized className="object-cover" />
      </div>
      <p className="fateha-script-small">{person.nickname}</p>
      <h3>{person.fullName}</h3>
      {person.child ? <p className="fateha-muted">{person.child}</p> : null}
      {person.father || person.mother ? (
        <p className="fateha-muted">
          Putra/i dari {person.father || "Bapak"} dan {person.mother || "Ibu"}
        </p>
      ) : null}
    </article>
  );
}

function CountdownSection({ targetDate }: { targetDate: string | null }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = useMemo(() => {
    if (!targetDate) return [
      ["0", "Hari"],
      ["0", "Jam"],
      ["0", "Menit"],
      ["0", "Detik"],
    ];
    const diff = Math.max(0, new Date(targetDate).getTime() - now);
    const seconds = Math.floor(diff / 1000);
    return [
      [Math.floor(seconds / 86400).toString(), "Hari"],
      [Math.floor((seconds % 86400) / 3600).toString(), "Jam"],
      [Math.floor((seconds % 3600) / 60).toString(), "Menit"],
      [(seconds % 60).toString(), "Detik"],
    ];
  }, [now, targetDate]);

  return (
    <SectionShell id="countdown" tone="deep">
      <SectionHeader kicker="Menuju Hari Bahagia" title="Hitung Mundur" subtitle="Semoga waktu yang tersisa membawa doa dan kebahagiaan." />
      <div className="fateha-countdown fateha-reveal">
        {units.map(([value, label]) => (
          <div key={label} className="fateha-card">
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function AcaraSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionShell id="acara" tone="pearl">
      <SectionHeader kicker="Rangkaian Acara" title="Waktu & Tempat" subtitle="Kami menantikan kehadiran Anda di momen sakral dan resepsi kami." />
      <div className="fateha-event-grid">
        <EventCard event={data.wedding.akad} />
        <EventCard event={data.wedding.reception} />
      </div>
    </SectionShell>
  );
}

function EventCard({ event }: { event: FatehaInvitationData["wedding"]["akad"] }) {
  return (
    <article className="fateha-card fateha-event-card fateha-reveal">
      <CalendarDays aria-hidden="true" />
      <h3>{event.label}</h3>
      <p>{formatDateDisplay(event.date)}</p>
      <p>{formatTime(event.time || event.date)}</p>
      <OrnamentDivider />
      <strong>{event.venue}</strong>
      <span>{event.address}</span>
    </article>
  );
}

function LoveStorySection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionShell id="cerita" tone="blue">
      <SectionHeader kicker="Kisah Kami" title="Perjalanan Cinta" />
      <div className="fateha-story-list">
        {data.loveStory.map((item) => (
          <article key={`${item.year}-${item.title}`} className="fateha-card fateha-story fateha-reveal">
            <span>{item.year}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function GallerySection({ gallery }: { gallery: FatehaGalleryItem[] }) {
  return (
    <SectionShell id="galeri" tone="pearl">
      <SectionHeader kicker="Galeri" title="Momen Bahagia" />
      <div className="fateha-gallery">
        {gallery.map((item, index) => (
          <div key={`${item.src}-${index}`} className="fateha-gallery-item fateha-reveal">
            <Image src={item.src} alt={item.alt} fill sizes="(max-width: 768px) 80vw, 300px" unoptimized className="object-cover" />
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function LokasiSection({ data }: { data: FatehaInvitationData }) {
  const mapsUrl = data.wedding.mapsUrl || data.wedding.akad.mapsUrl || data.wedding.reception.mapsUrl;

  return (
    <SectionShell id="lokasi" tone="deep" narrow>
      <SectionHeader kicker="Lokasi" title="Tempat Acara" subtitle={data.wedding.address} />
      <div className="fateha-panel fateha-location fateha-reveal">
        <MapPin aria-hidden="true" />
        <h3>{data.wedding.venue}</h3>
        <p>{data.wedding.address}</p>
        {mapsUrl ? (
          <a className="fateha-button" href={mapsUrl} target="_blank" rel="noreferrer">
            <Navigation size={16} aria-hidden="true" />
            Buka Peta
          </a>
        ) : null}
      </div>
    </SectionShell>
  );
}

function RsvpSection({ data }: { data: FatehaInvitationData }) {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({ name: "", attending: "hadir", guests: "1", message: "" });
  const [messages, setMessages] = useState(data.rsvpMessages);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canSubmit = Boolean(data.slug) && !data.isPreview;

  useEffect(() => {
    if (!data.slug || data.isPreview) return;
    let isMounted = true;

    async function loadMessages() {
      try {
        const res = await fetch(`/api/public/invitations/${data.slug}/messages`);
        const json = (await res.json()) as MessageResponse;
        if (!res.ok || !json.data) return;
        if (!isMounted) return;
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
        // Keep seeded/fallback messages when public wall is unavailable.
      }
    }

    void loadMessages();
    return () => {
      isMounted = false;
    };
  }, [data.isPreview, data.slug]);

  function update(key: keyof typeof form, value: string) {
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setSubmitted(true);
      return;
    }
    if (!data.slug || !form.name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const rsvpRes = await fetch(`/api/public/invitations/${data.slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: form.name.trim(),
          attendance_status: form.attending === "hadir" ? "hadir" : "tidak_hadir",
          number_of_guests: Number.parseInt(form.guests, 10),
          message: form.message.trim(),
        }),
      });
      const rsvpJson = (await rsvpRes.json()) as { error?: { message?: string } };
      if (!rsvpRes.ok) throw new Error(rsvpJson.error?.message || "RSVP belum dapat dikirim.");

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
          attendance: form.attending,
          message: form.message.trim() || "Terima kasih, kami akan hadir.",
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
      setSubmitted(true);
      toast.success("RSVP berhasil dikirim.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "RSVP belum dapat dikirim.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionShell id="rsvp" tone="pearl" narrow>
      <SectionHeader kicker="RSVP" title="Kehadiran & Doa" subtitle="Mohon konfirmasi kehadiran dan titipkan doa terbaik untuk kedua mempelai." />
      <div className="fateha-panel fateha-rsvp fateha-reveal">
        {submitted ? (
          <div className="fateha-rsvp-success">
            <span><Check aria-hidden="true" /></span>
            <h3>Terima Kasih</h3>
            <p>{canSubmit ? "Kehadiran dan doa Anda telah kami terima." : "Ini adalah pratinjau RSVP. Form aktif setelah undangan dipublikasikan permanen."}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <StepRow step={step} />
            {step === 1 ? (
              <div className="fateha-form-grid">
                <label>
                  <span>Nama Lengkap</span>
                  <input value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Nama Anda" autoComplete="name" />
                </label>
                <button type="button" className="fateha-button" disabled={!form.name.trim()} onClick={() => setStep(2)}>Selanjutnya</button>
              </div>
            ) : null}
            {step === 2 ? (
              <div className="fateha-form-grid">
                <span className="fateha-form-label">Kehadiran</span>
                <div className="fateha-choice-row">
                  <button type="button" className={cn(form.attending === "hadir" && "is-selected")} onClick={() => update("attending", "hadir")}>Hadir</button>
                  <button type="button" className={cn(form.attending === "tidak hadir" && "is-selected")} onClick={() => update("attending", "tidak hadir")}>Tidak Hadir</button>
                </div>
                {form.attending === "hadir" ? (
                  <label>
                    <span>Jumlah Tamu</span>
                    <select value={form.guests} onChange={(event) => update("guests", event.target.value)}>
                      {[1, 2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} orang</option>)}
                    </select>
                  </label>
                ) : null}
                <div className="fateha-actions">
                  <button type="button" className="fateha-button is-secondary" onClick={() => setStep(1)}>Kembali</button>
                  <button type="button" className="fateha-button" onClick={() => setStep(3)}>Selanjutnya</button>
                </div>
              </div>
            ) : null}
            {step === 3 ? (
              <div className="fateha-form-grid">
                <label>
                  <span>Ucapan untuk Pengantin</span>
                  <textarea value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tulis ucapan atau doa singkat..." />
                </label>
                {error ? <p className="fateha-error">{error}</p> : null}
                <div className="fateha-actions">
                  <button type="button" className="fateha-button is-secondary" onClick={() => setStep(2)}>Kembali</button>
                  <button type="submit" className="fateha-button" disabled={loading}>
                    <Send size={16} aria-hidden="true" />
                    {loading ? "Mengirim" : "Kirim RSVP"}
                  </button>
                </div>
              </div>
            ) : null}
          </form>
        )}
      </div>

      <div className="fateha-wall fateha-reveal">
        <h3>Ucapan & Doa</h3>
        {messages.length === 0 ? (
          <p className="fateha-empty">Belum ada ucapan. Jadilah yang pertama menitipkan doa.</p>
        ) : (
          messages.slice(0, 6).map((message) => (
            <article key={message.id} className="fateha-card">
              <strong>{message.name}</strong>
              {message.attendance ? <span>{message.attendance}</span> : null}
              <p>&ldquo;{message.message}&rdquo;</p>
            </article>
          ))
        )}
      </div>
    </SectionShell>
  );
}

function KontakSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionShell id="kontak" tone="blue">
      <SectionHeader kicker="Kontak" title="Keluarga yang Dapat Dihubungi" />
      <div className="fateha-contact-grid">
        {data.contacts.map((contact) => (
          <article key={`${contact.name}-${contact.phone}`} className="fateha-card fateha-contact fateha-reveal">
            <Phone aria-hidden="true" />
            <h3>{contact.name}</h3>
            <p>{contact.role}</p>
            {contact.phone.trim().length > 0 ? (
              <a href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{contact.phone}</a>
            ) : (
              <span className="fateha-muted">Nomor belum tersedia</span>
            )}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

function PenutupSection({ data }: { data: FatehaInvitationData }) {
  return (
    <SectionShell id="penutup" tone="pearl" narrow>
      <div className="fateha-panel fateha-closing fateha-reveal">
        <Heart aria-hidden="true" />
        <p>Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
        <div className="fateha-script-name">
          <span>{data.bride.nickname}</span>
          <span className="fateha-and">dan</span>
          <span>{data.groom.nickname}</span>
        </div>
        {data.giftAccounts.length > 0 || data.giftAddress ? <GiftInfo data={data} /> : null}
      </div>
      <div className="fateha-bottom-space" />
    </SectionShell>
  );
}

function GiftInfo({ data }: { data: FatehaInvitationData }) {
  return (
    <div className="fateha-gift">
      <Gift aria-hidden="true" />
      <h3>Amplop Digital</h3>
      {data.giftAccounts.map((account) => (
        <div key={`${account.bank}-${account.number}`} className="fateha-gift-row">
          <span>{account.bank}</span>
          <strong>{account.number}</strong>
          <small>{account.name}</small>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(account.number);
              toast.success("Nomor rekening disalin.");
            }}
          >
            <Copy size={14} aria-hidden="true" />
            Salin
          </button>
        </div>
      ))}
      {data.giftAddress ? <p>{data.giftAddress}</p> : null}
    </div>
  );
}

function SectionShell({
  id,
  tone,
  narrow = false,
  children,
}: {
  id: string;
  tone: "blue" | "pearl" | "deep";
  narrow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("fateha-section", `is-${tone}`)}>
      <div className="fateha-grain" aria-hidden="true" />
      <div className={cn("fateha-inner", narrow && "is-narrow")}>{children}</div>
    </section>
  );
}

function SectionHeader({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: React.ReactNode }) {
  return (
    <header className="fateha-section-header fateha-reveal">
      <span>{kicker}</span>
      <h2>{title}</h2>
      <OrnamentDivider />
      {subtitle ? <div>{subtitle}</div> : null}
    </header>
  );
}

function OrnamentDivider() {
  return (
    <div className="fateha-divider" aria-hidden="true">
      <span />
    </div>
  );
}

function MonogramSeal({ initials, label }: { initials: string; label: string }) {
  return (
    <div className="fateha-seal" aria-label={label}>
      <svg viewBox="0 0 132 132" role="img">
        <defs>
          <linearGradient id="fatehaSealGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0DEB5" />
            <stop offset="48%" stopColor="#C3A36B" />
            <stop offset="100%" stopColor="#8A6F42" />
          </linearGradient>
        </defs>
        <circle cx="66" cy="66" r="52" fill="rgba(255,253,248,0.78)" stroke="url(#fatehaSealGold)" strokeWidth="2" />
        <circle cx="66" cy="66" r="43" fill="none" stroke="url(#fatehaSealGold)" strokeWidth="1" strokeDasharray="3 5" />
        <text x="66" y="74" textAnchor="middle" fill="#8A6F42" fontSize="31" letterSpacing="6">{initials}</text>
      </svg>
    </div>
  );
}

function FloralCorner({ corner, className }: { corner: "top-left" | "top-right" | "bottom-left" | "bottom-right"; className?: string }) {
  return (
    <svg className={cn("fateha-floral", `is-${corner}`, className)} viewBox="0 0 240 240" fill="none" aria-hidden="true">
      <path d="M36 205C73 154 107 111 168 45" stroke="#BDA166" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 190C64 160 85 137 116 120" stroke="#D5C18C" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M63 171C42 168 29 153 25 134C45 139 58 150 63 171Z" fill="#C5D6CF" opacity="0.82" />
      <path d="M126 107C109 88 108 68 118 51C130 67 134 87 126 107Z" fill="#C9DDEB" opacity="0.74" />
      <path d="M150 96C173 86 191 91 205 104C184 112 164 110 150 96Z" fill="#EEE6D7" opacity="0.78" />
      <circle cx="172" cy="48" r="19" fill="#D2E4F1" />
      <ellipse cx="172" cy="35" rx="12" ry="18" fill="#E5F1F8" transform="rotate(8 172 35)" />
      <ellipse cx="157" cy="50" rx="12" ry="18" fill="#C6DAEA" transform="rotate(-54 157 50)" />
      <ellipse cx="187" cy="51" rx="12" ry="18" fill="#BFD4E6" transform="rotate(54 187 51)" />
      <circle cx="172" cy="51" r="5" fill="#C3A36B" opacity="0.82" />
      <circle cx="80" cy="166" r="16" fill="#F4EFE6" />
      <ellipse cx="80" cy="154" rx="10" ry="15" fill="#FFFDF8" />
      <circle cx="80" cy="167" r="4" fill="#C3A36B" opacity="0.78" />
    </svg>
  );
}

function ArchFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("fateha-arch-frame", className)}>
      <svg className="fateha-arch-svg" viewBox="0 0 460 680" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="fatehaArchChampagne" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EBD9AE" />
            <stop offset="48%" stopColor="#C3A36B" />
            <stop offset="100%" stopColor="#8A6F42" />
          </linearGradient>
        </defs>
        <path d="M44 652V232C44 109 121 42 230 42C339 42 416 109 416 232V652" stroke="url(#fatehaArchChampagne)" strokeWidth="2.2" />
        <path d="M66 652V238C66 126 133 68 230 68C327 68 394 126 394 238V652" stroke="url(#fatehaArchChampagne)" strokeWidth="1" opacity="0.65" />
        <path d="M88 652V248C88 143 148 93 230 93C312 93 372 143 372 248V652" stroke="url(#fatehaArchChampagne)" strokeWidth="0.8" strokeDasharray="5 6" opacity="0.55" />
      </svg>
      <div className="fateha-arch-content">{children}</div>
    </div>
  );
}

function EnvelopeSvg({ initials }: { initials: string }) {
  return (
    <div className="fateha-envelope" aria-hidden="true">
      <svg viewBox="0 0 320 210" fill="none">
        <defs>
          <linearGradient id="fatehaIntroBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EFF7FB" />
            <stop offset="52%" stopColor="#DCECF5" />
            <stop offset="100%" stopColor="#C9DDEB" />
          </linearGradient>
          <linearGradient id="fatehaIntroGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EBD9AE" />
            <stop offset="55%" stopColor="#C3A36B" />
            <stop offset="100%" stopColor="#8A6F42" />
          </linearGradient>
        </defs>
        <rect x="14" y="58" width="292" height="132" rx="7" fill="url(#fatehaIntroBlue)" stroke="url(#fatehaIntroGold)" strokeWidth="1.2" />
        <path d="M15 59L160 142L305 59" stroke="url(#fatehaIntroGold)" strokeWidth="1" opacity="0.55" />
        <path d="M16 58L160 18L304 58L160 122L16 58Z" fill="rgba(255,253,248,0.62)" stroke="url(#fatehaIntroGold)" strokeWidth="1.1" />
        <circle cx="160" cy="124" r="27" fill="url(#fatehaIntroGold)" />
        <text x="160" y="130" textAnchor="middle" fill="#fffdf8" fontSize="16" letterSpacing="3">{initials}</text>
      </svg>
    </div>
  );
}

function BottomNav() {
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const onScroll = () => {
      for (const item of [...navItems].reverse()) {
        const el = document.getElementById(item.href.slice(1));
        if (el && window.scrollY >= el.offsetTop - 140) {
          setActive(item.href);
          return;
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fateha-bottom-nav" aria-label="Navigasi undangan">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <a key={item.href} href={item.href} className={active === item.href ? "is-active" : undefined}>
            <Icon strokeWidth={1.6} aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}

function MusicPlayer({ musicUrl }: { musicUrl: string }) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      audio.volume = 0.45;
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      {ready ? (
        <button className={cn("fateha-music-button", playing && "is-playing")} onClick={togglePlay} aria-label={playing ? "Jeda musik" : "Mainkan musik"}>
          {playing ? <Volume2 size={19} strokeWidth={1.7} /> : <VolumeX size={19} strokeWidth={1.7} />}
        </button>
      ) : null}
    </>
  );
}

function StepRow({ step }: { step: Step }) {
  return (
    <div className="fateha-step-row" aria-label={`Langkah ${step} dari 3`}>
      {[1, 2, 3].map((current, index) => (
        <span key={current} className="contents">
          <span className={cn("fateha-step", current === step && "is-active", current < step && "is-done")}>{current < step ? <Check size={15} /> : current}</span>
          {index < 2 ? <span className="fateha-step-line" /> : null}
        </span>
      ))}
    </div>
  );
}

export { formatDateDisplay, formatDay, formatTime, getInitials };
