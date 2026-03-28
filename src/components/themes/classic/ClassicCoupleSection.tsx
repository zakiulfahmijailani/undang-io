"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ClassicThemeAssets, ClassicInvitationData } from "@/types/theme";

interface ClassicCoupleSectionProps {
  assets: ClassicThemeAssets;
  data: ClassicInvitationData;
}

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// ─── Sub-komponen: kartu per individu ────────────────────────────────────────
function PersonCard({
  photoUrl,
  fullName,
  nickname,
  fatherName,
  motherName,
  childOrder,
  gender,
  assets,
  variants,
}: {
  photoUrl?: string | null;
  fullName: string;
  nickname?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  childOrder?: string | null;
  gender: "groom" | "bride";
  assets: ClassicThemeAssets;
  variants: typeof fadeLeft;
}) {
  const label = childOrder
    ? childOrder
    : gender === "groom"
    ? "Putra"
    : "Putri";

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="flex flex-col items-center gap-4 text-center"
    >
      {/* Foto */}
      <div
        className="relative overflow-hidden rounded-full shadow-md"
        style={{
          width: 160,
          height: 160,
          borderWidth: 3,
          borderStyle: "solid",
          borderColor: assets.color_primary ?? "#bf9b73",
        }}
      >
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={fullName}
            fill
            className="object-cover"
            sizes="160px"
          />
        ) : (
          /* Placeholder inisial jika foto belum di-upload */
          <div
            className="flex h-full w-full items-center justify-center text-4xl font-bold"
            style={{
              backgroundColor: assets.color_secondary ?? "#f5ede0",
              color: assets.color_primary ?? "#bf9b73",
              fontFamily: assets.font_script ?? "'Sacramento', cursive",
            }}
          >
            {(nickname ?? fullName).charAt(0)}
          </div>
        )}
      </div>

      {/* Nama */}
      <h3
        className="text-2xl leading-tight"
        style={{
          fontFamily: assets.font_script ?? "'Sacramento', cursive",
          color: assets.color_primary ?? "#8b6c42",
        }}
      >
        {fullName}
      </h3>

      {/* Ortu */}
      {(fatherName || motherName) && (
        <p
          className="max-w-[200px] text-sm leading-relaxed"
          style={{
            fontFamily: assets.font_body ?? "'Didact Gothic', sans-serif",
            color: assets.color_text_muted ?? "#9a8060",
          }}
        >
          <span style={{ color: assets.color_primary ?? "#bf9b73" }}>
            {label} dari
          </span>
          <br />
          {fatherName && (
            <>
              {fatherName}
              <br />
            </>
          )}
          {motherName && motherName}
        </p>
      )}
    </motion.div>
  );
}

// ─── Komponen utama ───────────────────────────────────────────────────────────
export function ClassicCoupleSection({ assets, data }: ClassicCoupleSectionProps) {
  return (
    <section
      id="classic-couple"
      className="relative overflow-hidden py-20"
      style={{
        backgroundColor: assets.couple_bg_color ?? "#fdfaf6",
        backgroundImage: assets.couple_bg_pattern_url
          ? `url(${assets.couple_bg_pattern_url})`
          : undefined,
        backgroundRepeat: "repeat",
      }}
    >
      {/* Dekorasi bunga sisi kanan */}
      {assets.flower_right_url && (
        <div
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <Image
            src={assets.flower_right_url}
            alt=""
            width={120}
            height={320}
            className="object-contain"
          />
        </div>
      )}

      {/* Dekorasi bunga sisi kiri */}
      {assets.flower_left_url && (
        <div
          className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2"
          aria-hidden="true"
        >
          <Image
            src={assets.flower_left_url}
            alt=""
            width={120}
            height={320}
            className="object-contain"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        {/* Bismillah + salam */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-10 flex flex-col items-center gap-4 text-center"
        >
          {assets.bismillah_image_url ? (
            <Image
              src={assets.bismillah_image_url}
              alt="Bismillah"
              width={220}
              height={60}
              className="object-contain"
            />
          ) : (
            <p
              className="text-2xl"
              style={{
                fontFamily: assets.font_arabic ?? "'Scheherazade New', serif",
                color: assets.color_primary ?? "#8b6c42",
              }}
            >
              بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ
            </p>
          )}

          <h2
            className="text-xl font-semibold"
            style={{
              fontFamily: assets.font_body ?? "'Didact Gothic', sans-serif",
              color: assets.color_primary ?? "#8b6c42",
            }}
          >
            Assalamu&apos;alaikum Wr. Wb.
          </h2>

          <p
            className="max-w-md text-sm leading-relaxed"
            style={{
              color: assets.color_text_muted ?? "#bf9b73",
              fontFamily: assets.font_body ?? "'Didact Gothic', sans-serif",
            }}
          >
            Tanpa mengurangi rasa hormat, kami mengundang
            Bapak/Ibu/Saudara/i serta Kerabat sekalian untuk menghadiri
            acara pernikahan kami:
          </p>
        </motion.div>

        {/* Kartu pasangan */}
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-16">
          {/* Mempelai 1 (groom) */}
          <PersonCard
            photoUrl={data.groom_photo_url}
            fullName={data.groom_full_name}
            nickname={data.groom_nickname}
            fatherName={data.groom_father_name}
            motherName={data.groom_mother_name}
            childOrder={data.groom_child_order}
            gender="groom"
            assets={assets}
            variants={fadeLeft}
          />

          {/* Heart separator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
            className="text-4xl select-none"
            style={{ color: assets.color_primary ?? "#bf9b73" }}
            aria-hidden="true"
          >
            ♥
          </motion.div>

          {/* Mempelai 2 (bride) */}
          <PersonCard
            photoUrl={data.bride_photo_url}
            fullName={data.bride_full_name}
            nickname={data.bride_nickname}
            fatherName={data.bride_father_name}
            motherName={data.bride_mother_name}
            childOrder={data.bride_child_order}
            gender="bride"
            assets={assets}
            variants={fadeRight}
          />
        </div>
      </div>
    </section>
  );
}
