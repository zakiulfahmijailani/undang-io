/* User dashboard for /dashboard based on docs/design/dashboard — User Dashboard.png. */

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Crown,
  Eye,
  HeartPulse,
  MailOpen,
  MessageSquareHeart,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import GuestConversion from "./components/GuestConversion";
import GuestSessionCard from "./components/GuestSessionCard";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { cn } from "@/lib/utils";

type InvitationStatus = "draft" | "active" | "unpaid" | "expired";

type InvitationRow = {
  id: string;
  slug: string;
  status: string | null;
  created_at: string;
  groom_full_name: string | null;
  groom_nickname: string | null;
  bride_full_name: string | null;
  bride_nickname: string | null;
  akad_datetime: string | null;
  resepsi_datetime: string | null;
};

type InvitationItem = {
  id: string;
  slug: string;
  status: InvitationStatus;
  createdAt: string;
  groomName: string;
  brideName: string;
  eventDate: string | null;
};

type GuestSessionItem = {
  id: string;
  slug: string;
  session_token: string;
  expires_at: string;
  invitation_data: {
    groomNickname?: string;
    brideNickname?: string;
    groomFullName?: string;
    brideFullName?: string;
  };
  theme_id: string;
};

type StatCardProps = {
  label: string;
  value: string | number;
  caption: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "maroon" | "gold" | "green" | "rose";
};

const validStatuses: InvitationStatus[] = ["draft", "active", "unpaid", "expired"];

function normalizeStatus(status: string | null): InvitationStatus {
  if (status && validStatuses.includes(status as InvitationStatus)) {
    return status as InvitationStatus;
  }

  return "draft";
}

function formatDate(value: string | null) {
  if (!value) return "Tanggal belum diatur";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function statusCopy(status: InvitationStatus) {
  const map: Record<InvitationStatus, { label: string; className: string }> = {
    active: {
      label: "Aktif",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    unpaid: {
      label: "Menunggu Bayar",
      className: "border-landing-gold/30 bg-landing-gold/10 text-landing-ink",
    },
    expired: {
      label: "Kedaluwarsa",
      className: "border-red-200 bg-red-50 text-red-700",
    },
    draft: {
      label: "Draft",
      className: "border-landing-border bg-white text-landing-muted",
    },
  };

  return map[status];
}

function StatCard({ label, value, caption, icon: Icon, tone = "maroon" }: StatCardProps) {
  const toneClass = {
    maroon: "bg-landing-maroon text-white",
    gold: "bg-landing-gold text-white",
    green: "bg-emerald-600 text-white",
    rose: "bg-rose-600 text-white",
  }[tone];

  return (
    <div className="rounded-2xl border border-landing-border bg-white p-5 shadow-landing-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-ui text-sm font-medium text-landing-muted">{label}</p>
          <p className="mt-2 font-ui text-3xl font-bold text-landing-ink">{value}</p>
        </div>
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneClass)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 font-ui text-xs leading-5 text-landing-muted">{caption}</p>
    </div>
  );
}

function InvitationDashboardCard({ invitation }: { invitation: InvitationItem }) {
  const status = statusCopy(invitation.status);
  const previewHref = invitation.status === "active" ? `/u/${invitation.slug}` : `/u/${invitation.slug}?preview=true`;

  return (
    <article className="overflow-hidden rounded-2xl border border-landing-border bg-white shadow-landing-card">
      <div className="relative min-h-40 bg-landing-cream p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,26,43,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(201,168,76,0.16),transparent_36%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between gap-8">
          <span className={cn("w-fit rounded-full border px-3 py-1 font-ui text-xs font-semibold", status.className)}>
            {status.label}
          </span>
          <div>
            <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-landing-muted">The Wedding Of</p>
            <h3 className="mt-2 font-landing-serif text-3xl font-semibold text-landing-ink">
              {invitation.groomName} & {invitation.brideName}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-3 font-ui text-sm text-landing-muted sm:grid-cols-2">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-landing-gold" aria-hidden="true" />
            {formatDate(invitation.eventDate)}
          </span>
          <span className="inline-flex items-center gap-2 truncate">
            <Eye className="h-4 w-4 text-landing-gold" aria-hidden="true" />
            undang.io/u/{invitation.slug}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/dashboard/undangan/${invitation.id}`}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-landing-border px-3 font-ui text-sm font-semibold text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            Dasbor
          </Link>
          <Link
            href={previewHref}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-landing-border px-3 font-ui text-sm font-semibold text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Lihat
          </Link>
          <Link
            href={`/dashboard/undangan/${invitation.id}/edit`}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-landing-maroon px-3 font-ui text-sm font-semibold text-white shadow-sm transition hover:bg-landing-maroon/90"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyDashboard() {
  return (
    <section className="rounded-3xl border border-dashed border-landing-gold/50 bg-white p-10 text-center shadow-landing-card">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-landing-maroon/10 text-landing-maroon">
        <HeartPulse className="h-10 w-10" aria-hidden="true" />
      </div>
      <h2 className="mt-6 font-landing-serif text-3xl font-semibold text-landing-ink">Belum ada undangan</h2>
      <p className="mx-auto mt-3 max-w-xl font-ui text-sm leading-6 text-landing-muted">
        Mulai dari tema yang paling cocok, isi detail acara, lalu bagikan tautan undangan ke keluarga dan sahabat.
      </p>
      <Link
        href="/buat-undangan"
        className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-landing-maroon px-5 font-ui text-sm font-semibold text-white shadow-sm transition hover:bg-landing-maroon/90"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Buat Undangan
      </Link>
    </section>
  );
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
  const userName = profile?.full_name?.split(" ")[0] || "Kak";

  const { data: invitationsRaw, error: invitationsError } = await supabase
    .from("invitations")
    .select(
      "id, slug, status, created_at, groom_full_name, groom_nickname, bride_full_name, bride_nickname, akad_datetime, resepsi_datetime",
    )
    .eq("user_id", user.id)
    .is("soft_delete_at", null)
    .order("created_at", { ascending: false });

  if (invitationsError) {
    console.error("[dashboard] invitations query error:", invitationsError);
  }

  const invitations: InvitationItem[] = ((invitationsRaw ?? []) as InvitationRow[]).map((invitation) => ({
    id: invitation.id,
    slug: invitation.slug,
    status: normalizeStatus(invitation.status),
    createdAt: invitation.created_at,
    groomName: invitation.groom_nickname || invitation.groom_full_name || "Mempelai Pria",
    brideName: invitation.bride_nickname || invitation.bride_full_name || "Mempelai Wanita",
    eventDate: invitation.resepsi_datetime || invitation.akad_datetime,
  }));

  let claimedGuestSessions: GuestSessionItem[] = [];
  const adminClient = getAdminClient();
  if (adminClient) {
    const { data: guestSessions, error: guestSessionError } = await adminClient
      .from("guest_sessions")
      .select("id, slug, session_token, expires_at, invitation_data, theme_id")
      .eq("user_id", user.id)
      .eq("status", "claimed")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (guestSessionError) {
      console.error("[dashboard] guest_sessions query error:", guestSessionError);
    }

    claimedGuestSessions = (guestSessions ?? []) as GuestSessionItem[];
  }

  const slugs = invitations.map((invitation) => invitation.slug).filter(Boolean);
  const { count: rsvpCount } =
    slugs.length > 0
      ? await supabase.from("rsvp_messages").select("*", { count: "exact", head: true }).in("invitation_id", slugs)
      : { count: 0 };

  const totalRsvps = rsvpCount || 0;
  const totalInvitations = invitations.length + claimedGuestSessions.length;
  const activeInvitations = invitations.filter((invitation) => invitation.status === "active").length;
  const totalViews = 0;

  return (
    <>
      <GuestConversion />
      <div className="mx-auto flex max-w-7xl flex-col gap-7 pb-10">
        <section className="overflow-hidden rounded-3xl border border-landing-border bg-landing-paper shadow-landing-card">
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_340px] lg:p-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-landing-gold/30 bg-landing-gold/10 px-3 py-1 font-ui text-xs font-semibold text-landing-ink">
                <Sparkles className="h-3.5 w-3.5 text-landing-gold" aria-hidden="true" />
                Ringkasan Undangan
              </span>
              <h1 className="mt-4 font-landing-serif text-4xl font-semibold tracking-normal text-landing-ink">
                Halo, {userName}. Kelola momen spesialmu dengan tenang.
              </h1>
              <p className="mt-3 max-w-2xl font-ui text-sm leading-6 text-landing-muted">
                Pantau undangan aktif, RSVP, dan ucapan tamu dari satu tempat yang rapi dan mudah dipakai.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/buat-undangan"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-landing-maroon px-5 font-ui text-sm font-semibold text-white shadow-sm transition hover:bg-landing-maroon/90"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Buat Undangan
                </Link>
                <Link
                  href="/dashboard/tema"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-landing-border bg-white px-5 font-ui text-sm font-semibold text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
                >
                  Lihat Tema
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-landing-gold/30 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-landing-gold text-white">
                  <Crown className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-ui text-sm font-bold text-landing-ink">Paket Basic</p>
                  <p className="font-ui text-xs text-landing-muted">Mulai gratis, upgrade kapan saja.</p>
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-landing-cream p-4 font-ui text-sm leading-6 text-landing-muted">
                Aktifkan Premium untuk masa tayang permanen, domain rapi, dan akses semua tema elegan.
              </div>
              <Link
                href="/dashboard/akun"
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md bg-landing-gold font-ui text-sm font-semibold text-white transition hover:bg-landing-gold/90"
              >
                Upgrade Paket
              </Link>
            </aside>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Tayangan" value={totalViews} caption="Akan terisi saat pelacakan tayangan aktif." icon={Users} />
          <StatCard label="Total RSVP" value={totalRsvps} caption="Konfirmasi kehadiran dari semua undangan." icon={MailOpen} tone="gold" />
          <StatCard
            label="Ucapan Baru"
            value={totalRsvps}
            caption="Pesan tamu yang masuk bersama RSVP."
            icon={MessageSquareHeart}
            tone="rose"
          />
          <StatCard
            label="Undangan Aktif"
            value={activeInvitations}
            caption={`${totalInvitations} undangan tersimpan di akunmu.`}
            icon={ShieldCheck}
            tone="green"
          />
        </section>

        <section>
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-landing-serif text-3xl font-semibold text-landing-ink">Undangan Saya</h2>
              <p className="mt-1 font-ui text-sm text-landing-muted">Kelola draft, pratinjau, dan undangan yang sudah aktif.</p>
            </div>
            {totalInvitations > 0 ? (
              <Link
                href="/buat-undangan"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-landing-border bg-white px-4 font-ui text-sm font-semibold text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Tambah Undangan
              </Link>
            ) : null}
          </div>

          {totalInvitations === 0 ? (
            <EmptyDashboard />
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {claimedGuestSessions.map((guestSession) => (
                <GuestSessionCard key={guestSession.id} guestSession={guestSession} />
              ))}
              {invitations.map((invitation) => (
                <InvitationDashboardCard key={invitation.id} invitation={invitation} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
