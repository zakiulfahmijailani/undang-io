/* Invitation list dashboard for /dashboard/undangan, revised to match the romantic undang.io dashboard theme. */

import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Crown, LayoutTemplate, Plus, Sparkles } from "lucide-react";
import InvitationList, { type InvitationItem } from "@/components/dashboard/InvitationList";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

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

type GuestSessionRow = {
  id: string;
  slug: string;
  invitation_data: {
    groomNickname?: string;
    groomFullName?: string;
    brideNickname?: string;
    brideFullName?: string;
    akadDate?: string;
    receptionDate?: string;
  } | null;
  expires_at: string;
  created_at: string;
};

const validStatuses: InvitationStatus[] = ["draft", "active", "unpaid", "expired"];

function normalizeStatus(status: string | null): InvitationStatus {
  return status && validStatuses.includes(status as InvitationStatus) ? (status as InvitationStatus) : "draft";
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Tanggal belum ditentukan";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getStatusCopy(status: InvitationStatus) {
  const copy: Record<InvitationStatus, { label: string; className: string }> = {
    active: {
      label: "Tayang",
      className: "border-landing-success/25 bg-emerald-50 text-landing-success",
    },
    unpaid: {
      label: "Belum Aktif",
      className: "border-landing-gold/35 bg-landing-gold/10 text-landing-ink",
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

  return copy[status];
}

export default async function MyInvitationsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user || !supabase) {
    redirect("/login");
  }

  const { data: invitationsRaw, error: invitationsError } = await supabase
    .from("invitations")
    .select(
      "id, slug, status, created_at, groom_full_name, groom_nickname, bride_full_name, bride_nickname, akad_datetime, resepsi_datetime",
    )
    .eq("user_id", user.id)
    .is("soft_delete_at", null)
    .order("created_at", { ascending: false });

  if (invitationsError) {
    console.error("[undangan] invitations query error:", invitationsError);
  }

  const permanentInvitations: InvitationItem[] = ((invitationsRaw ?? []) as InvitationRow[]).map((invitation) => {
    const groomName = invitation.groom_nickname || invitation.groom_full_name || "Mempelai Pria";
    const brideName = invitation.bride_nickname || invitation.bride_full_name || "Mempelai Wanita";
    const status = normalizeStatus(invitation.status);
    const statusCopy = getStatusCopy(status);

    return {
      id: invitation.id,
      slug: invitation.slug,
      title: `${groomName} & ${brideName}`,
      date: formatDate(invitation.resepsi_datetime || invitation.akad_datetime),
      status,
      statusLabel: statusCopy.label,
      statusClass: statusCopy.className,
      views: 0,
      rsvps: 0,
      messages: 0,
      isPermanent: true,
    };
  });

  const slugs = permanentInvitations.map((invitation) => invitation.slug).filter(Boolean);
  if (slugs.length > 0) {
    const { data: rsvpRows } = await supabase.from("rsvp_messages").select("invitation_id").in("invitation_id", slugs);

    if (rsvpRows) {
      const countMap: Record<string, number> = {};
      for (const row of rsvpRows) {
        countMap[row.invitation_id] = (countMap[row.invitation_id] || 0) + 1;
      }

      for (const invitation of permanentInvitations) {
        const count = countMap[invitation.slug] || 0;
        invitation.rsvps = count;
        invitation.messages = count;
      }
    }
  }

  let claimedSessions: InvitationItem[] = [];
  const adminClient = getAdminClient();
  if (adminClient) {
    const { data: guestSessions, error: guestSessionError } = await adminClient
      .from("guest_sessions")
      .select("id, slug, invitation_data, expires_at, created_at")
      .eq("user_id", user.id)
      .eq("status", "claimed")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (guestSessionError) {
      console.error("[undangan] guest_sessions query error:", guestSessionError);
    }

    claimedSessions = ((guestSessions ?? []) as GuestSessionRow[]).map((session) => {
      const invitation = session.invitation_data || {};
      const groomName = invitation.groomNickname || invitation.groomFullName || "Mempelai Pria";
      const brideName = invitation.brideNickname || invitation.brideFullName || "Mempelai Wanita";
      const expiresAt = new Date(session.expires_at);
      const minutesLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000));

      return {
        id: session.id,
        slug: session.slug,
        title: `${groomName} & ${brideName}`,
        date: formatDate(invitation.receptionDate || invitation.akadDate),
        status: "claimed",
        statusLabel: "Menunggu Bayar",
        statusClass: "border-landing-gold/45 bg-landing-gold/15 text-landing-ink",
        views: 0,
        rsvps: 0,
        messages: 0,
        isPermanent: false,
        minutesLeft,
      };
    });
  }

  const allItems = [...claimedSessions, ...permanentInvitations];
  const activeCount = allItems.filter((item) => item.status === "active").length;
  const draftCount = allItems.filter((item) => item.status === "draft").length;
  const totalMessages = allItems.reduce((sum, item) => sum + item.messages, 0);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-7 pb-12">
      <section className="overflow-hidden rounded-3xl border border-landing-border bg-landing-paper shadow-landing-panel">
        <div className="relative grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(201,168,76,0.18),transparent_30%),radial-gradient(circle_at_84%_20%,rgba(139,26,43,0.10),transparent_32%)]" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-landing-gold/35 bg-white/75 px-3 py-1 font-ui text-xs font-bold text-landing-maroon">
              <Sparkles className="h-3.5 w-3.5 text-landing-gold" aria-hidden="true" />
              Studio Undangan
            </span>
            <h1 className="mt-4 max-w-2xl font-landing-serif text-4xl font-semibold leading-tight text-landing-ink md:text-5xl">
              Undangan Saya
            </h1>
            <p className="mt-3 max-w-2xl font-ui text-sm leading-6 text-landing-muted md:text-base">
              Kelola undangan digital, pantau RSVP, dan lanjutkan publikasi dari satu ruang kerja yang hangat dan rapi.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/buat-undangan"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-landing-maroon px-5 font-ui text-sm font-semibold text-white shadow-landing-button transition hover:bg-landing-maroon-dark"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Buat Undangan Baru
              </Link>
              <Link
                href="/dashboard/tema"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-landing-border bg-white px-5 font-ui text-sm font-semibold text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
              >
                <LayoutTemplate className="h-4 w-4" aria-hidden="true" />
                Pilih Tema
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl border border-landing-border bg-white/80 p-5 shadow-landing-card backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-landing-gold text-white">
                <Crown className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-ui text-sm font-bold text-landing-ink">Ringkasan</p>
                <p className="font-ui text-xs text-landing-muted">Status undangan saat ini</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { label: "Total", value: allItems.length },
                { label: "Tayang", value: activeCount },
                { label: "Draft", value: draftCount },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-landing-border bg-landing-cream px-3 py-4 text-center">
                  <p className="font-ui text-2xl font-bold text-landing-ink">{stat.value}</p>
                  <p className="mt-1 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-landing-muted">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-landing-maroon px-4 py-3 font-ui text-sm font-semibold text-white">
              <CalendarDays className="h-4 w-4 text-landing-gold" aria-hidden="true" />
              {totalMessages} ucapan tamu terkumpul
            </div>
          </div>
        </div>
      </section>

      {allItems.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-landing-gold/50 bg-white p-10 text-center shadow-landing-card">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-landing-maroon/10 text-landing-maroon">
            <LayoutTemplate className="h-10 w-10" aria-hidden="true" />
          </div>
          <h2 className="mt-6 font-landing-serif text-3xl font-semibold text-landing-ink">Belum ada undangan</h2>
          <p className="mx-auto mt-3 max-w-xl font-ui text-sm leading-6 text-landing-muted">
            Mulai dari tema yang paling cocok, isi data acara, lalu bagikan undangan digital pertama Anda.
          </p>
          <Link
            href="/buat-undangan"
            className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-landing-maroon px-5 font-ui text-sm font-semibold text-white shadow-landing-button transition hover:bg-landing-maroon-dark"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Buat Undangan Pertama
          </Link>
        </section>
      ) : (
        <InvitationList items={allItems} />
      )}
    </div>
  );
}
