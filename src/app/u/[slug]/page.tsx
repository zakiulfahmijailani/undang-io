/* Public invitation view for /u/[slug] based on docs/design/u[slug] — Halaman Undangan Publik.png and docs/design/undangio-freemium-invitation-flow.png. */

"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock3, Copy, Crown, ExternalLink, Lock, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import { FatehaInvitationRenderer } from "@/components/themes/fateha";
import { JawaAgungTemplate } from "@/components/themes/jawa-agung";
import { ObsidianLuxeTemplate } from "@/components/themes/obsidian-luxe";
import { PetalSoftTemplate } from "@/components/themes/petal-soft";
import { demoData } from "@/data/demoInvitation";
import { DEFAULT_INVITATION_THEME_KEY, JAWA_AGUNG_THEME_KEY, OBSIDIAN_LUXE_THEME_KEY, PETAL_SOFT_THEME_KEY } from "@/lib/default-theme";
import { mapGuestSessionToFatehaData } from "@/lib/fateha-theme-mapper";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type InvitationData = typeof demoData & {
  theme?: string;
  musicUrl?: string | null;
};

type GuestInvitationData = {
  groomNickname?: string;
  brideNickname?: string;
  groomFullName?: string;
  brideFullName?: string;
  groomFather?: string;
  groomMother?: string;
  brideFather?: string;
  brideMother?: string;
  akadDate?: string;
  akadTime?: string;
  akadVenue?: string;
  akadAddress?: string;
  receptionDate?: string;
  receptionTime?: string;
  receptionVenue?: string;
  receptionAddress?: string;
  quote?: string;
  quoteSource?: string;
};

type GuestSession = {
  id: string;
  slug: string;
  session_token: string;
  expires_at: string;
  status: "active" | "claimed" | "converted" | "expired" | string;
  theme_id: string | null;
  invitation_data: GuestInvitationData;
};

type ApiResponse<T> = {
  data: T | null;
  error: { code: string; message: string } | null;
};

type ViewerMode = "guest" | "logged-in" | "premium" | "expired";

function joinDateTime(date?: string, time?: string) {
  if (!date) return undefined;
  return time ? `${date}T${time}` : date;
}

function mapGuestSessionToInvitation(session: GuestSession): InvitationData {
  const invitation = session.invitation_data;
  const groomNickname = invitation.groomNickname || "Mempelai Pria";
  const brideNickname = invitation.brideNickname || "Mempelai Wanita";

  return {
    ...demoData,
    coupleShortName: `${groomNickname} & ${brideNickname}`,
    theme: session.theme_id || undefined,
    groom: {
      ...demoData.groom,
      fullName: invitation.groomFullName || groomNickname,
      father: invitation.groomFather ? `Bapak ${invitation.groomFather}` : demoData.groom.father,
      mother: invitation.groomMother ? `Ibu ${invitation.groomMother}` : demoData.groom.mother,
    },
    bride: {
      ...demoData.bride,
      fullName: invitation.brideFullName || brideNickname,
      father: invitation.brideFather ? `Bapak ${invitation.brideFather}` : demoData.bride.father,
      mother: invitation.brideMother ? `Ibu ${invitation.brideMother}` : demoData.bride.mother,
    },
    akad: {
      ...demoData.akad,
      date: joinDateTime(invitation.akadDate, invitation.akadTime) || demoData.akad.date,
      venue: invitation.akadVenue || demoData.akad.venue,
      address: invitation.akadAddress || demoData.akad.address,
    },
    reception: {
      ...demoData.reception,
      date: joinDateTime(invitation.receptionDate, invitation.receptionTime) || demoData.reception.date,
      venue: invitation.receptionVenue || demoData.reception.venue,
      address: invitation.receptionAddress || demoData.reception.address,
    },
    quote: {
      text: invitation.quote || demoData.quote.text,
      source: invitation.quoteSource || demoData.quote.source,
    },
  };
}

function useCountdown(expiresAt: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return undefined;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) {
    return { display: "Permanen", isExpired: false };
  }

  const remaining = Math.max(0, new Date(expiresAt).getTime() - now);
  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return {
    display: `${minutes}:${seconds.toString().padStart(2, "0")}`,
    isExpired: remaining <= 0,
  };
}

function statusContent(mode: ViewerMode) {
  const map: Record<ViewerMode, { label: string; title: string; body: string; icon: typeof Clock3; className: string }> = {
    guest: {
      label: "Preview Tamu 15 Menit",
      title: "Undangan sementara aktif",
      body: "Bagikan untuk pratinjau cepat. Masuk dan aktifkan agar waktunya lebih panjang.",
      icon: Clock3,
      className: "border-landing-gold/40 bg-landing-gold text-white",
    },
    "logged-in": {
      label: "Preview Login 25 Menit",
      title: "Waktu preview diperpanjang",
      body: "Akun sudah terhubung. Publikasikan permanen sebelum waktu preview habis.",
      icon: CheckCircle2,
      className: "border-emerald-300 bg-emerald-600 text-white",
    },
    premium: {
      label: "Premium Permanen",
      title: "Undangan sudah aktif permanen",
      body: "Tautan ini siap dibagikan tanpa batas waktu preview.",
      icon: Crown,
      className: "border-landing-gold bg-landing-maroon text-white",
    },
    expired: {
      label: "Preview Berakhir",
      title: "Masa berlaku habis",
      body: "Undangan belum dipublikasikan permanen. Pemilik bisa login untuk mengaktifkan kembali.",
      icon: AlertTriangle,
      className: "border-red-300 bg-red-600 text-white",
    },
  };

  return map[mode];
}

function StatusBar({
  mode,
  expiresAt,
  sessionToken,
  slug,
  isCreator,
}: {
  mode: ViewerMode;
  expiresAt: string | null;
  sessionToken: string;
  slug: string;
  isCreator: boolean;
}) {
  const { display } = useCountdown(expiresAt);
  const content = statusContent(mode);
  const Icon = content.icon;

  function copyLink() {
    void navigator.clipboard.writeText(window.location.href);
    toast.success("Tautan undangan disalin.");
  }

  function shareWhatsApp() {
    const text = `Kamu diundang! Buka undangan pernikahan kami: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-landing-paper/95 px-3 py-3 shadow-landing-card backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border", content.className)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-landing-cream px-3 py-1 font-ui text-xs font-bold text-landing-maroon">
                {content.label}
              </span>
              <span className="font-ui text-xs font-semibold text-landing-muted">{display}</span>
            </div>
            <p className="mt-1 font-ui text-sm font-semibold text-landing-ink">{content.title}</p>
            <p className="hidden font-ui text-xs text-landing-muted sm:block">{content.body}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-landing-maroon px-3 font-ui text-xs font-semibold text-white transition hover:bg-landing-maroon/90 sm:flex-none"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </button>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-landing-border bg-white px-3 font-ui text-xs font-semibold text-landing-ink transition hover:border-landing-gold sm:flex-none"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            Salin
          </button>
          {isCreator && mode !== "premium" ? (
            <Link
              href={`/login?guest_token=${sessionToken}&next=/u/${slug}`}
              className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-landing-gold px-3 font-ui text-xs font-semibold text-white transition hover:bg-landing-gold/90 sm:flex-none"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Aktifkan
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-landing-cream p-4">
      <div className="w-full max-w-md rounded-3xl border border-landing-border bg-white p-8 text-center shadow-landing-card">
        <Lock className="mx-auto h-12 w-12 text-landing-gold" aria-hidden="true" />
        <h1 className="mt-5 font-landing-serif text-3xl font-semibold text-landing-ink">Undangan Tidak Ditemukan</h1>
        <p className="mt-3 font-ui text-sm leading-6 text-landing-muted">
          Tautan undangan tidak tersedia atau sudah dipindahkan ke halaman permanen.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-landing-maroon px-5 font-ui text-sm font-semibold text-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

export default function GuestInvitationView(props: { params: Promise<{ slug: string }> }) {
  const { slug } = use(props.params);
  const router = useRouter();
  const [sessionData, setSessionData] = useState<GuestSession | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchInvitation() {
      try {
        try {
          const supabase = createBrowserSupabaseClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (isMounted) setIsLoggedIn(Boolean(user));
        } catch (error) {
          console.warn("[u/[slug]] auth state unavailable:", error);
        }

        const response = await fetch(`/api/guest-sessions/${slug}?by=slug`);
        const json = (await response.json()) as ApiResponse<GuestSession>;

        if (!response.ok || !json.data) {
          router.push(`/invite/${slug}`);
          return;
        }

        if (!isMounted) return;
        setSessionData(json.data);

        const rawLocal = window.localStorage.getItem("guest_session");
        if (rawLocal) {
          try {
            const parsed = JSON.parse(rawLocal) as { sessionToken?: string };
            setIsCreator(parsed.sessionToken === json.data.session_token);
          } catch (error) {
            console.warn("[u/[slug]] failed to parse guest session:", error);
          }
        }
      } catch (error) {
        console.error("[u/[slug]] failed to fetch guest invitation:", error);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void fetchInvitation();

    return () => {
      isMounted = false;
    };
  }, [router, slug]);

  const invitationData = useMemo(() => (sessionData ? mapGuestSessionToInvitation(sessionData) : null), [sessionData]);
  const isFatehaTheme = !sessionData?.theme_id || sessionData.theme_id === DEFAULT_INVITATION_THEME_KEY;
  const isPetalSoftTheme = sessionData?.theme_id === PETAL_SOFT_THEME_KEY;
  const isObsidianLuxeTheme = sessionData?.theme_id === OBSIDIAN_LUXE_THEME_KEY;
  const isJawaAgungTheme = sessionData?.theme_id === JAWA_AGUNG_THEME_KEY;
  const weddingThemeData = useMemo(
    () => (sessionData && (isFatehaTheme || isPetalSoftTheme || isObsidianLuxeTheme || isJawaAgungTheme) ? mapGuestSessionToFatehaData(sessionData) : null),
    [isFatehaTheme, isJawaAgungTheme, isObsidianLuxeTheme, isPetalSoftTheme, sessionData],
  );

  if (isLoading) {
    return <div className="min-h-screen bg-landing-cream" />;
  }

  if (notFound || !sessionData || !invitationData) {
    return <EmptyState />;
  }

  const isExpired = new Date(sessionData.expires_at).getTime() <= Date.now() && sessionData.status !== "converted";
  const mode: ViewerMode = sessionData.status === "converted" ? "premium" : isExpired ? "expired" : isLoggedIn ? "logged-in" : "guest";
  const renderedInvitation = isPetalSoftTheme && weddingThemeData ? (
    <PetalSoftTemplate data={weddingThemeData} />
  ) : isObsidianLuxeTheme && weddingThemeData ? (
    <ObsidianLuxeTemplate data={weddingThemeData} />
  ) : isJawaAgungTheme && weddingThemeData ? (
    <JawaAgungTemplate data={weddingThemeData} />
  ) : isFatehaTheme && weddingThemeData ? (
    <FatehaInvitationRenderer data={weddingThemeData} />
  ) : (
    <InvitationClientWrapper data={invitationData} />
  );

  if (mode === "expired") {
    return (
      <div className="relative min-h-screen bg-landing-cream pt-[132px] sm:pt-[92px]">
        <StatusBar mode={mode} expiresAt={sessionData.expires_at} sessionToken={sessionData.session_token} slug={sessionData.slug} isCreator={isCreator} />
        <div className="pointer-events-none select-none opacity-45 blur-sm">
          {renderedInvitation}
        </div>
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-landing-ink/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white p-8 text-center shadow-2xl">
            <Lock className="mx-auto h-12 w-12 text-landing-gold" aria-hidden="true" />
            <h2 className="mt-5 font-landing-serif text-3xl font-semibold text-landing-ink">Masa Berlaku Habis</h2>
            <p className="mt-3 font-ui text-sm leading-6 text-landing-muted">
              Undangan ini masih preview dan belum dipublikasikan permanen.
            </p>
            {isCreator ? (
              <Link
                href={`/login?guest_token=${sessionData.session_token}&next=/u/${sessionData.slug}`}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-landing-maroon px-5 font-ui text-sm font-semibold text-white"
              >
                Login untuk Mengaktifkan
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-landing-cream pt-[132px] sm:pt-[92px]">
      <StatusBar
        mode={mode}
        expiresAt={mode === "premium" ? null : sessionData.expires_at}
        sessionToken={sessionData.session_token}
        slug={sessionData.slug}
        isCreator={isCreator}
      />
      {renderedInvitation}
    </div>
  );
}
