"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ClassicThemeAssets, ClassicInvitationData } from "@/types/theme";
import { useCountdown } from "@/hooks/useCountdown";

interface ClassicHeroSectionProps {
  assets: ClassicThemeAssets;
  data: ClassicInvitationData;
}

// Animasi slide-up untuk children staggered
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export function ClassicHeroSection({ assets, data }: ClassicHeroSectionProps) {
  const groomNick = data.groom_nickname || data.groom_full_name.split(" ")[0];
  const brideNick = data.bride_nickname || data.bride_full_name.split(" ")[0];

  // Ambil tanggal acara utama (akad lebih prioritas, fallback resepsi)
  const eventDate = useMemo(() => {
    const raw = data.akad_datetime ?? data.resepsi_datetime;
    return raw ? new Date(raw) : null;
  }, [data.akad_datetime, data.resepsi_datetime]);

  const countdown = useCountdown(eventDate);

  // Format tanggal display
  const formattedDate = useMemo(() => {
    if (!eventDate) return null;
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(eventDate);
  }, [eventDate]);

  // Google Calendar URL
  const calendarUrl = useMemo(() => {
    if (!eventDate) return null;
    const start = eventDate
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(".000", "");
    const end = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(".000", "");
    const title = encodeURIComponent(
      `Pernikahan ${groomNick} & ${brideNick}`
    );
    const details = encodeURIComponent(
      data.akad_location_name ||
        data.resepsi_location_name ||
        ""
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`;
  }, [eventDate, groomNick, brideNick, data]);

  return (
    <section
      id="classic-hero"
      className="relative overflow-hidden py-20 text-center"
      style={{
        backgroundColor: assets.hero_bg_color ?? "#fdfaf6",
        backgroundImage: assets.hero_bg_pattern_url
          ? `url(${assets.hero_bg_pattern_url})`
          : undefined,
        backgroundRepeat: "repeat",
      }}
    >
      {/* Bunga pojok kanan atas */}
      {assets.flower_top_right_url && (
        <div
          className="pointer-events-none absolute right-0 top-0"
          aria-hidden="true"
        >
          <Image
            src={assets.flower_top_right_url}
            alt=""
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
      )}

      {/* Bunga pojok kiri atas */}
      {assets.flower_top_left_url && (
        <div
          className="pointer-events-none absolute -left-6 top-0"
          aria-hidden="true"
        >
          <Image
            src={assets.flower_top_left_url}
            alt=""
            width={200}
            height={200}
            className="object-contain"
          />
        </div>
      )}

      {/* Konten hero staggered */}
      <motion.div
        className="relative z-10 mx-auto max-w-xl px-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Sub-title */}
        <motion.p
          variants={itemVariants}
          className="mb-4 text-sm uppercase tracking-widest"
          style={{
            fontFamily: assets.font_body ?? "'Didact Gothic', sans-serif",
            color: assets.color_text_muted ?? "#9a8060",
          }}
        >
          The Wedding Of
        </motion.p>

        {/* Foto / ornamen utama */}
        {assets.couple_main_image_url && (
          <motion.div
            variants={itemVariants}
            className="mx-auto mb-6 flex justify-center"
          >
            <Image
              src={assets.couple_main_image_url}
              alt={`${groomNick} & ${brideNick}`}
              width={280}
              height={280}
              className="object-contain"
              priority
            />
          </motion.div>
        )}

        {/* Nama pasangan */}
        <motion.h1
          variants={itemVariants}
          className="mb-3 text-5xl leading-tight"
          style={{
            fontFamily: assets.font_script ?? "'Sacramento', cursive",
            color: assets.color_primary ?? "#8b6c42",
          }}
        >
          {groomNick} &amp; {brideNick}
        </motion.h1>

        {/* Sub-tagline */}
        <motion.p
          variants={itemVariants}
          className="mb-8 text-sm"
          style={{
            fontFamily: assets.font_body ?? "'Didact Gothic', sans-serif",
            color: assets.color_text_muted ?? "#bf9b73",
          }}
        >
          Kami berharap Anda menjadi bagian dari hari istimewa kami!
        </motion.p>

        {/* Countdown */}
        {countdown && eventDate && (
          <motion.div variants={itemVariants} className="mb-8">
            {countdown.isPast ? (
              <p
                className="text-sm italic"
                style={{ color: assets.color_text_muted ?? "#9a8060" }}
              >
                Alhamdulillah, acara telah berlangsung.
              </p>
            ) : (
              <>
                <p
                  className="mb-3 text-xs uppercase tracking-widest"
                  style={{ color: assets.color_text_muted ?? "#9a8060" }}
                >
                  {formattedDate}
                </p>
                <div className="flex justify-center gap-4">
                  {([
                    { value: countdown.days,    label: "Hari" },
                    { value: countdown.hours,   label: "Jam" },
                    { value: countdown.minutes, label: "Menit" },
                    { value: countdown.seconds, label: "Detik" },
                  ] as const).map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-center">
                      <span
                        className="text-3xl font-bold tabular-nums"
                        style={{ color: assets.color_primary ?? "#8b6c42" }}
                      >
                        {String(value).padStart(2, "0")}
                      </span>
                      <span
                        className="text-xs uppercase tracking-wide"
                        style={{ color: assets.color_text_muted ?? "#9a8060" }}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Tombol Save the Date */}
        {calendarUrl && !countdown?.isPast && (
          <motion.div variants={itemVariants}>
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium transition-all hover:opacity-80"
              style={{
                borderColor: assets.color_primary ?? "#8b6c42",
                color: assets.color_primary ?? "#8b6c42",
              }}
            >
              💾 Save the Date
            </a>
            <p
              className="mt-2 text-xs italic"
              style={{ color: assets.color_text_muted ?? "#9a8060" }}
            >
              *Klik untuk menyimpan tanggal di Google Kalender
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
