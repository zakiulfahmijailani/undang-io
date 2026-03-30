"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ClassicThemeAssets, ClassicInvitationData, RekeningEntry } from "@/types/theme";

interface Props {
  assets: ClassicThemeAssets;
  data: ClassicInvitationData;
}

// ─── Copy to clipboard helper ─────────────────────────────────────────────────
function CopyButton({
  text,
  color,
}: {
  text: string;
  color: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider transition-all duration-200"
      style={{
        backgroundColor: copied ? "#4ade80" : color,
        color: "#fff",
        border: "none",
        cursor: "pointer",
        minWidth: "80px",
        justifyContent: "center",
      }}
      aria-label={`Salin nomor rekening ${text}`}
    >
      {copied ? "✓ Tersalin" : "Salin"}
    </motion.button>
  );
}

// ─── Single rekening card ─────────────────────────────────────────────────────
function RekeningCard({
  entry,
  index,
  assets,
}: {
  entry: RekeningEntry;
  index: number;
  assets: ClassicThemeAssets;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-5"
      style={{
        backgroundColor: assets.event_card_bg_color ?? "#fffdf9",
        border: `1px solid ${assets.color_primary}22`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Bank name badge */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="rounded-full px-3 py-0.5 text-xs font-bold tracking-widest uppercase"
          style={{
            backgroundColor: `${assets.color_primary}18`,
            color: assets.color_primary,
          }}
        >
          {entry.bank}
        </span>
      </div>

      {/* Account name */}
      <p
        className="mb-1 text-sm font-medium"
        style={{ color: assets.color_text_body ?? "#3d2e1e", fontFamily: `var(--classic-font-body)` }}
      >
        {entry.account_name}
      </p>

      {/* Account number + copy */}
      <div className="flex items-center justify-between gap-3 mt-2">
        <span
          className="text-lg font-bold tracking-widest tabular-nums"
          style={{
            color: assets.color_primary,
            fontFamily: `var(--classic-font-display)`,
            letterSpacing: "0.12em",
          }}
        >
          {entry.account_number}
        </span>
        <CopyButton text={entry.account_number} color={assets.color_primary} />
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function ClassicGiftSection({ assets, data }: Props) {
  const hasQris = !!data.qris_image;
  const hasRekening = Array.isArray(data.rekening) && data.rekening.length > 0;

  if (!hasQris && !hasRekening) return null;

  const rekening = (data.rekening ?? []) as RekeningEntry[];

  return (
    <section
      id="classic-gift"
      className="relative py-20 px-4"
      style={{ backgroundColor: assets.bg_section_4 ?? assets.color_bg_page ?? "#fdfaf6" }}
    >
      {/* Flower ornament top */}
      {assets.flower_top_center_url && (
        <img
          src={assets.flower_top_center_url}
          alt=""
          aria-hidden="true"
          width={220}
          height={120}
          loading="lazy"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 opacity-80"
          style={{ maxWidth: "55vw" }}
        />
      )}

      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 text-center"
      >
        {/* Ornament divider */}
        {assets.ornament_divider && (
          <img
            src={assets.ornament_divider}
            alt=""
            aria-hidden="true"
            width={120}
            height={24}
            loading="lazy"
            className="mx-auto mb-4 opacity-70"
          />
        )}

        <p
          className="mb-1 text-xs tracking-[0.3em] uppercase opacity-60"
          style={{
            color: assets.color_primary,
            fontFamily: `var(--classic-font-body)`,
          }}
        >
          Hadiah Pernikahan
        </p>
        <h2
          className="text-3xl font-semibold"
          style={{
            color: assets.color_primary,
            fontFamily: `var(--classic-font-display)`,
          }}
        >
          Amplop Digital
        </h2>
        <p
          className="mx-auto mt-3 max-w-md text-sm leading-relaxed opacity-75"
          style={{
            color: assets.color_text_body ?? "#3d2e1e",
            fontFamily: `var(--classic-font-body)`,
          }}
        >
          Bagi yang ingin memberikan hadiah, kami dengan tulus menerima
          melalui transfer rekening atau QRIS di bawah ini.
        </p>
      </motion.div>

      <div className="mx-auto max-w-xl">
        {/* QRIS */}
        {hasQris && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex flex-col items-center"
          >
            <div
              className="rounded-2xl p-4 shadow-md"
              style={{
                backgroundColor: assets.event_card_bg_color ?? "#fffdf9",
                border: `1px solid ${assets.color_primary}22`,
              }}
            >
              <p
                className="mb-3 text-center text-xs font-bold tracking-widest uppercase"
                style={{ color: assets.color_primary }}
              >
                QRIS
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.qris_image!}
                alt="QRIS untuk amplop digital"
                width={260}
                height={260}
                loading="lazy"
                className="mx-auto rounded-xl"
                style={{ maxWidth: "260px", objectFit: "contain" }}
              />
              <p
                className="mt-3 text-center text-xs opacity-60"
                style={{
                  color: assets.color_text_body ?? "#3d2e1e",
                  fontFamily: `var(--classic-font-body)`,
                }}
              >
                Scan dengan aplikasi e-wallet atau mobile banking
              </p>
            </div>
          </motion.div>
        )}

        {/* Divider antara QRIS dan rekening */}
        {hasQris && hasRekening && (
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: `${assets.color_primary}30` }} />
            <span
              className="text-xs tracking-widest opacity-50"
              style={{ color: assets.color_primary, fontFamily: `var(--classic-font-body)` }}
            >
              atau transfer langsung
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: `${assets.color_primary}30` }} />
          </div>
        )}

        {/* Rekening list */}
        {hasRekening && (
          <div className="flex flex-col gap-4">
            {rekening.map((entry, i) => (
              <RekeningCard
                key={`${entry.bank}-${i}`}
                entry={entry}
                index={i}
                assets={assets}
              />
            ))}
          </div>
        )}

        {/* Pesan akhir */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center text-xs leading-relaxed opacity-60"
          style={{
            color: assets.color_text_body ?? "#3d2e1e",
            fontFamily: `var(--classic-font-body)`,
          }}
        >
          Doa dan kehadiran Anda adalah hadiah yang paling berarti bagi kami. 🙏
        </motion.p>
      </div>

      {/* Flower ornament bottom-left */}
      {assets.flower_bottom_left_url && (
        <img
          src={assets.flower_bottom_left_url}
          alt=""
          aria-hidden="true"
          width={140}
          height={140}
          loading="lazy"
          className="pointer-events-none absolute bottom-0 left-0 opacity-50"
          style={{ maxWidth: "30vw" }}
        />
      )}

      {/* Flower ornament bottom-right */}
      {assets.flower_bottom_right_url && (
        <img
          src={assets.flower_bottom_right_url}
          alt=""
          aria-hidden="true"
          width={140}
          height={140}
          loading="lazy"
          className="pointer-events-none absolute bottom-0 right-0 opacity-50"
          style={{ maxWidth: "30vw" }}
        />
      )}
    </section>
  );
}