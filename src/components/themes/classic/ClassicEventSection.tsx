"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ClassicThemeAssets, ClassicInvitationData } from "@/types/theme";

interface ClassicEventSectionProps {
  assets: ClassicThemeAssets;
  data: ClassicInvitationData;
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

// ─── helpers ────────────────────────────────────────────────────────────────────────────
function formatTime(dt: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(new Date(dt));
}

function formatDate(dt: string): { weekday: string; date: string } {
  const d = new Date(dt);
  return {
    weekday: new Intl.DateTimeFormat("id-ID", { weekday: "long", timeZone: "Asia/Jakarta" }).format(d),
    date: new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(d),
  };
}

function buildCalendarUrl(
  datetime: string,
  title: string,
  location: string
): string {
  const start = new Date(datetime)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(".000", "");
  const end = new Date(new Date(datetime).getTime() + 2 * 60 * 60 * 1000)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(".000", "");
  return (
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&location=${encodeURIComponent(location)}`
  );
}

// ─── EventCard sub-komponen ────────────────────────────────────────────────────────────
function EventCard({
  title,
  datetime,
  locationName,
  locationAddress,
  mapsUrl,
  assets,
  delay,
}: {
  title: string;
  datetime: string | null | undefined;
  locationName?: string | null;
  locationAddress?: string | null;
  mapsUrl?: string | null;
  assets: ClassicThemeAssets;
  delay?: number;
}) {
  const time = useMemo(() => (datetime ? formatTime(datetime) : null), [datetime]);
  const dateInfo = useMemo(() => (datetime ? formatDate(datetime) : null), [datetime]);
  const calUrl = useMemo(() => {
    if (!datetime || !locationName) return null;
    return buildCalendarUrl(datetime, title, locationName);
  }, [datetime, title, locationName]);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: delay ?? 0 }}
      className="flex w-full flex-col items-center gap-5 rounded-2xl p-8 text-center shadow-sm"
      style={{
        backgroundColor: assets.event_card_bg_color ?? "#fffdf9",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: assets.color_primary
          ? `${assets.color_primary}33`
          : "#bf9b7333",
        maxWidth: 360,
      }}
    >
      {/* Judul acara */}
      <h3
        className="text-xl font-semibold tracking-wide"
        style={{
          fontFamily: assets.font_heading ?? "'Oswald', sans-serif",
          color: assets.color_primary ?? "#8b6c42",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </h3>

      {/* Divider ornamen */}
      {assets.event_divider_image_url ? (
        <Image
          src={assets.event_divider_image_url}
          alt=""
          width={120}
          height={24}
          className="object-contain opacity-60"
        />
      ) : (
        <div
          className="h-px w-20 opacity-40"
          style={{ backgroundColor: assets.color_primary ?? "#bf9b73" }}
        />
      )}

      {/* Jam */}
      {time && (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xl" aria-hidden="true">
            🕒
          </span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: assets.color_primary ?? "#8b6c42" }}
          >
            {time}
          </span>
          <span
            className="text-xs"
            style={{ color: assets.color_text_muted ?? "#9a8060" }}
          >
            s.d. selesai
          </span>
        </div>
      )}

      {/* Tanggal */}
      {dateInfo && (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xl" aria-hidden="true">
            📅
          </span>
          <span
            className="text-base font-medium"
            style={{ color: assets.color_primary ?? "#8b6c42" }}
          >
            {dateInfo.weekday}
          </span>
          <span
            className="text-sm"
            style={{ color: assets.color_text_muted ?? "#9a8060" }}
          >
            {dateInfo.date}
          </span>
        </div>
      )}

      {/* Lokasi */}
      {(locationName || locationAddress) && (
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl" aria-hidden="true">
            📍
          </span>
          {locationName && (
            <span
              className="text-sm font-semibold"
              style={{ color: assets.color_primary ?? "#8b6c42" }}
            >
              {locationName}
            </span>
          )}
          {locationAddress && (
            <p
              className="max-w-[260px] text-xs leading-relaxed"
              style={{
                color: assets.color_text_muted ?? "#9a8060",
                fontFamily: assets.font_body ?? "'Didact Gothic', sans-serif",
              }}
            >
              {locationAddress}
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 pt-1">
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-85"
            style={{ backgroundColor: assets.color_primary ?? "#8b6c42" }}
          >
            🗺️ Petunjuk Lokasi
          </a>
        )}
        {calUrl && (
          <a
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border px-5 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              borderColor: assets.color_primary ?? "#8b6c42",
              color: assets.color_primary ?? "#8b6c42",
            }}
          >
            💾 Simpan Tanggal
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Komponen utama ───────────────────────────────────────────────────────────
export function ClassicEventSection({ assets, data }: ClassicEventSectionProps) {
  const hasAkad    = Boolean(data.akad_datetime);
  const hasResepsi = Boolean(data.resepsi_datetime);

  if (!hasAkad && !hasResepsi) return null;

  return (
    <section
      id="classic-event"
      className="relative overflow-hidden py-20"
      style={{
        backgroundColor: assets.event_bg_color ?? "#fdfaf6",
        borderTop: `1px solid ${assets.color_primary ? `${assets.color_primary}22` : "#f2f2f2"}`,
      }}
    >
      {/* Dekorasi bunga atas tengah */}
      {assets.flower_top_center_url && (
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
          aria-hidden="true"
        >
          <Image
            src={assets.flower_top_center_url}
            alt=""
            width={200}
            height={80}
            className="object-contain"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Heading */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2
            className="text-3xl"
            style={{
              fontFamily: assets.font_script ?? "'Sacramento', cursive",
              color: assets.color_primary ?? "#8b6c42",
            }}
          >
            Save The Date
          </h2>
          <p
            className="mt-2 text-sm"
            style={{
              fontFamily: assets.font_body ?? "'Didact Gothic', sans-serif",
              color: assets.color_text_muted ?? "#9a8060",
            }}
          >
            Tandai kalendermu dan jangan sampai terlewat!
          </p>
        </motion.div>

        {/* Cards — 1 kolom mobile, 2 kolom desktop */}
        <div
          className={[
            "flex flex-col items-center gap-8",
            hasAkad && hasResepsi ? "sm:flex-row sm:justify-center" : "",
          ]
            .join(" ")
            .trim()}
        >
          {hasAkad && (
            <EventCard
              title="Akad Nikah"
              datetime={data.akad_datetime}
              locationName={data.akad_location_name}
              locationAddress={data.akad_location_address}
              mapsUrl={data.akad_maps_url}
              assets={assets}
              delay={0}
            />
          )}
          {hasResepsi && (
            <EventCard
              title="Walimatul 'Ursy"
              datetime={data.resepsi_datetime}
              locationName={data.resepsi_location_name}
              locationAddress={data.resepsi_location_address}
              mapsUrl={data.resepsi_maps_url}
              assets={assets}
              delay={0.15}
            />
          )}
        </div>
      </div>
    </section>
  );
}
