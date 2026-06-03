/* Invitation list cards for /dashboard/undangan, styled for the revised romantic undang.io dashboard theme. */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  CreditCard,
  Edit,
  Eye,
  Filter,
  MailOpen,
  MessageSquareHeart,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import DeleteInvitationButton from "@/components/dashboard/DeleteInvitationButton";
import { cn } from "@/lib/utils";

export type InvitationItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  status: string;
  statusLabel: string;
  statusClass: string;
  views: number;
  rsvps: number;
  messages: number;
  isPermanent: boolean;
  minutesLeft?: number;
};

type FilterStatus = "all" | "active" | "unpaid" | "draft" | "claimed" | "expired";

const statusFilters: Array<{ value: FilterStatus; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "active", label: "Tayang" },
  { value: "draft", label: "Draft" },
  { value: "claimed", label: "Menunggu Bayar" },
  { value: "unpaid", label: "Belum Aktif" },
  { value: "expired", label: "Kedaluwarsa" },
];

function getInitials(title: string) {
  return title
    .split("&")
    .map((part) => part.trim().charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function InvitationStat({
  icon: Icon,
  value,
  label,
  bordered = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center justify-center text-center", bordered && "border-l border-landing-border")}>
      <Icon className="mb-1 h-4 w-4 text-landing-gold" aria-hidden="true" />
      <span className="font-ui text-base font-bold leading-none text-landing-ink">{value}</span>
      <span className="mt-1 font-ui text-[10px] font-bold uppercase tracking-[0.16em] text-landing-muted">{label}</span>
    </div>
  );
}

function InvitationCard({ item }: { item: InvitationItem }) {
  const isClaimed = item.status === "claimed";
  const previewHref = isClaimed ? `/u/${item.slug}` : `/u/${item.slug}`;

  return (
    <article className="group overflow-hidden rounded-3xl border border-landing-border bg-white shadow-landing-card transition duration-300 hover:-translate-y-1 hover:shadow-landing-panel">
      <div className="relative min-h-44 overflow-hidden bg-landing-cream p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(201,168,76,0.22),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(139,26,43,0.12),transparent_34%),linear-gradient(135deg,rgba(255,253,249,0.55),rgba(252,244,237,0.9))]" />
        <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full border border-landing-gold/30" />
        <div className="absolute -left-12 top-16 h-28 w-28 rounded-full border border-landing-maroon/10" />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-ui text-xs font-bold", item.statusClass)}>
            {isClaimed ? <Clock className="h-3.5 w-3.5" aria-hidden="true" /> : <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
            {item.statusLabel}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 font-ui text-xs font-semibold text-landing-muted">
            <Calendar className="h-3.5 w-3.5 text-landing-gold" aria-hidden="true" />
            {isClaimed ? `${item.minutesLeft ?? 0} menit` : item.date}
          </span>
        </div>

        <div className="relative z-10 mt-10 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="font-ui text-[11px] font-bold uppercase tracking-[0.22em] text-landing-muted">The Wedding Of</p>
            <h3 className="mt-2 line-clamp-2 font-landing-serif text-3xl font-semibold leading-tight text-landing-ink">
              {item.title}
            </h3>
          </div>
          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-landing-border bg-white font-landing-serif text-2xl font-semibold text-landing-maroon shadow-sm sm:flex">
            {getInitials(item.title)}
          </div>
        </div>
      </div>

      <div className="p-5">
        {isClaimed ? (
          <div className="mb-4 rounded-2xl border border-landing-gold/35 bg-landing-gold/10 p-4">
            <p className="font-ui text-sm font-bold text-landing-ink">Preview belum permanen</p>
            <p className="mt-1 font-ui text-xs leading-5 text-landing-muted">
              Selesaikan pembayaran agar undangan aktif tanpa batas waktu.
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-3 rounded-2xl border border-landing-border bg-landing-paper px-2 py-4">
          <InvitationStat icon={Users} value={item.views} label="Tayangan" />
          <InvitationStat icon={MailOpen} value={item.rsvps} label="RSVP" bordered />
          <InvitationStat icon={MessageSquareHeart} value={item.messages} label="Ucapan" bordered />
        </div>

        <div className={cn("mt-5 grid gap-2", isClaimed ? "grid-cols-[1fr_auto]" : "grid-cols-[1fr_auto_auto]")}>
          {isClaimed ? (
            <>
              <Link
                href={`/pembayaran/${item.slug}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-landing-gold px-3 font-ui text-sm font-semibold text-white transition hover:bg-landing-gold/90"
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                Bayar
              </Link>
              <Link
                href={previewHref}
                target="_blank"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-landing-border text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
                title="Lihat undangan"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href={previewHref}
                target="_blank"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-landing-border bg-white px-3 font-ui text-sm font-semibold text-landing-maroon transition hover:border-landing-gold hover:bg-landing-cream"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Lihat Undangan
              </Link>
              <Link
                href={`/dashboard/undangan/${item.id}/edit`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-landing-border bg-white text-landing-ink transition hover:border-landing-gold hover:text-landing-maroon"
                title="Edit undangan"
              >
                <Edit className="h-4 w-4" aria-hidden="true" />
              </Link>
              <DeleteInvitationButton invitationId={item.id} invitationTitle={item.title} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function InvitationList({ items }: { items: InvitationItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredItems = useMemo(() => {
    let result = items;

    if (filterStatus !== "all") {
      result = result.filter((item) => item.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => item.title.toLowerCase().includes(query));
    }

    return result;
  }, [items, filterStatus, searchQuery]);

  const activeFilters = statusFilters.filter((filter) => filter.value === "all" || items.some((item) => item.status === filter.value));

  return (
    <section className="flex flex-col gap-5">
      <div className="rounded-3xl border border-landing-border bg-white p-4 shadow-landing-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-landing-muted" aria-hidden="true" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama pasangan..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 w-full rounded-2xl border border-landing-border bg-landing-paper pl-11 pr-4 font-ui text-sm text-landing-ink outline-none transition placeholder:text-landing-muted/65 focus:border-landing-gold focus:ring-2 focus:ring-landing-gold/20"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-landing-cream text-landing-maroon">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </span>
            {activeFilters.map((filter) => {
              const isActive = filterStatus === filter.value;
              const count = filter.value === "all" ? items.length : items.filter((item) => item.status === filter.value).length;

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setFilterStatus(filter.value)}
                  className={cn(
                    "h-9 shrink-0 rounded-full border px-4 font-ui text-xs font-bold transition",
                    isActive
                      ? "border-landing-maroon bg-landing-maroon text-white shadow-sm"
                      : "border-landing-border bg-white text-landing-muted hover:border-landing-gold hover:text-landing-maroon",
                  )}
                >
                  {filter.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-landing-border bg-white py-14 text-center shadow-landing-card">
          <Filter className="mb-3 h-10 w-10 text-landing-gold" aria-hidden="true" />
          <p className="font-ui text-sm font-bold text-landing-ink">Tidak ada undangan ditemukan</p>
          <p className="mt-1 font-ui text-sm text-landing-muted">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <InvitationCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
