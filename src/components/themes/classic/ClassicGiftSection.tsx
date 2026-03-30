"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ClassicThemeAssets, ClassicInvitationData, RekeningEntry } from "@/types/theme";

// ─── Props ────────────────────────────────────────────────────────────────────
interface ClassicGiftSectionProps {
  assets: ClassicThemeAssets;
  data: ClassicInvitationData;
}

// ─── Bank logo helper (Simple Icons CDN + inline SVG fallback) ────────────────
const BANK_ICON_MAP: Record<string, string> = {
  bca:     "https://cdn.simpleicons.org/bca",
  bri:     "https://cdn.simpleicons.org/bri",
  bni:     "https://cdn.simpleicons.org/bni",
  mandiri: "https://cdn.simpleicons.org/mandiri",
  gopay:   "https://cdn.simpleicons.org/gojek",
  ovo:     "https://cdn.simpleicons.org/ovo",
  dana:    "https://cdn.simpleicons.org/dana",
  shopeepay: "https://cdn.simpleicons.org/shopee",
};

function getBankIconUrl(bankName: string): string | null {
  const key = bankName.toLowerCase().replace(/[\s-]/g, "");
  for (const [pattern, url] of Object.entries(BANK_ICON_MAP)) {
    if (key.includes(pattern)) return url;
  }
  return null;
}

// ─── Copy-to-clipboard hook ───────────────────────────────────────────────────
function useCopyToClipboard() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return { copiedIndex, copy };
}

// ─── Single rekening card ─────────────────────────────────────────────────────
function RekeningCard({
  entry,
  index,
  assets,
  copiedIndex,
  onCopy,
}: {
  entry: RekeningEntry;
  index: number;
  assets: ClassicThemeAssets;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}) {
  const iconUrl = getBankIconUrl(entry.bank);
  const isCopied = copiedIndex === index;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3 rounded-2xl px-6 py-5"
      style={{
        backgroundColor: assets.event_card_bg_color ?? "#fffdf9",
        border: `1px solid ${assets.color_primary}28`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* Bank header */}
      <div className="flex items-center gap-3">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={entry.bank}
            width={32}
            height={32}
            loading="lazy"
            className="h-8 w-8 object-contain rounded-md"
            style={{ background: "transparent" }}
          />
        ) : (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-white"
            style={{ backgroundColor: assets.color_primary ?? "#8b6c42" }}
          >
            {entry.bank.slice(0, 2).toUpperCase()}
          </div>
        )}
        <span
          className="font-semibold tracking-wide uppercase text-sm"
          style={{
            color: assets.color_primary ?? "#8b6c42",
            fontFamily: `'${assets.font_heading ?? assets.font_body}', sans-serif`,
          }}
        >
          {entry.bank}
        </span>
      </div>

      {/* Account info */}
      <div className="flex flex-col gap-1">
        <p
          className="text-xs"
          style={{
            color: assets.color_text_muted ?? assets.color_secondary ?? "#9a8060",
            fontFamily: `'${assets.font_body}', sans-serif`,
          }}
        >
          Atas Nama
        </p>
        <p
          className="font-semibold text-base"
          style={{
            color: assets.color_text_body ?? "#3d2e1e",
            fontFamily: `'${assets.font_display}', serif`,
          }}
        >
          {entry.account_name}
        </p>
      </div>

      {/* Account number + copy button */}
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-lg font-mono tracking-wider"
          style={{ color: assets.color_text_body ?? "#3d2e1e" }}
        >
          {entry.account_number}
        </span>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onCopy(entry.account_number, index)}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white transition-all"
          style={{
            backgroundColor: isCopied
              ? "#4caf50"
              : (assets.color_accent ?? assets.color_primary ?? "#8b6c42"),
            minWidth: 80,
          }}
          aria-label={isCopied ? "Tersalin!" : `Salin nomor rekening ${entry.bank}`}
        >
          {isCopied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
              Tersalin
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Salin
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── QRIS section ─────────────────────────────────────────────────────────────
function QrisCard({
  qrisUrl,
  assets,
}: {
  qrisUrl: string;
  assets: ClassicThemeAssets;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4 rounded-2xl px-6 py-6"
        style={{
          backgroundColor: assets.event_card_bg_color ?? "#fffdf9",
          border: `1px solid ${assets.color_primary}28`,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          {/* QRIS inline icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke={assets.color_primary ?? "#8b6c42"} strokeWidth="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke={assets.color_primary ?? "#8b6c42"} strokeWidth="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke={assets.color_primary ?? "#8b6c42"} strokeWidth="1.5" />
            <rect x="5" y="5" width="3" height="3" fill={assets.color_primary ?? "#8b6c42"} />
            <rect x="16" y="5" width="3" height="3" fill={assets.color_primary ?? "#8b6c42"} />
            <rect x="5" y="16" width="3" height="3" fill={assets.color_primary ?? "#8b6c42"} />
            <path d="M14 14h2v2h-2zM16 16h2v2h-2zM18 14h2v2h-2zM14 18h4v2h-4z" fill={assets.color_primary ?? "#8b6c42"} />
          </svg>
          <span
            className="font-semibold tracking-widest text-sm uppercase"
            style={{
              color: assets.color_primary ?? "#8b6c42",
              fontFamily: `'${assets.font_heading ?? assets.font_body}', sans-serif`,
            }}
          >
            QRIS
          </span>
        </div>

        {/* QRIS image thumbnail */}
        <button
          onClick={() => setOpen(true)}
          className="group relative overflow-hidden rounded-xl"
          aria-label="Lihat QRIS lebih besar"
          style={{ border: `2px solid ${assets.color_primary}33` }}
        >
          <img
            src={qrisUrl}
            alt="Kode QRIS untuk amplop digital"
            width={180}
            height={180}
            loading="lazy"
            className="block transition-transform duration-300 group-hover:scale-105"
            style={{ objectFit: "contain" }}
          />
          <div
            className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }}
          >
            <span className="text-white text-xs font-semibold">Perbesar</span>
          </div>
        </button>

        <p
          className="text-center text-xs"
          style={{
            color: assets.color_text_muted ?? assets.color_secondary ?? "#9a8060",
            fontFamily: `'${assets.font_body}', sans-serif`,
            maxWidth: "22ch",
          }}
        >
          Scan kode QRIS di atas menggunakan aplikasi dompet digital manapun
        </p>
      </motion.div>

      {/* Lightbox */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[400] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.88)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={qrisUrl}
              alt="QRIS — klik di luar untuk tutup"
              width={320}
              height={320}
              className="block"
              style={{ objectFit: "contain", maxWidth: "min(320px, 80vw)" }}
            />
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
              aria-label="Tutup QRIS"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function ClassicGiftSection({ assets, data }: ClassicGiftSectionProps) {
  const { copiedIndex, copy } = useCopyToClipboard();
  const rekening = (data.rekening ?? []) as RekeningEntry[];
  const hasQris = !!data.qris_image;
  const hasRekening = rekening.length > 0;

  if (!hasQris && !hasRekening) return null;

  return (
    <section
      id="classic-gift"
      className="relative w-full overflow-hidden py-16 px-4"
      style={{ backgroundColor: assets.bg_section_5 ?? "#f5ede0" }}
    >
      {/* Flower ornament top */}
      {assets.flower_top_center_url && (
        <img
          src={assets.flower_top_center_url}
          alt=""
          aria-hidden="true"
          width={320}
          height={160}
          loading="lazy"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 select-none opacity-70"
          style={{ maxWidth: "min(320px, 80vw)" }}
        />
      )}

      {/* Content container */}
      <div className="mx-auto max-w-lg">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          {assets.ornament_bismillah && (
            <img
              src={assets.ornament_bismillah}
              alt=""
              aria-hidden="true"
              width={160}
              height={48}
              loading="lazy"
              className="mx-auto mb-4 opacity-80"
            />
          )}

          <p
            className="mb-1 text-xs tracking-[0.3em] uppercase"
            style={{
              color: assets.color_primary ?? "#8b6c42",
              fontFamily: `'${assets.font_heading ?? assets.font_body}', sans-serif`,
            }}
          >
            Amplop Digital
          </p>
          <h2
            className="text-2xl md:text-3xl leading-tight"
            style={{
              color: assets.color_primary ?? "#8b6c42",
              fontFamily: `'${assets.font_display}', serif`,
            }}
          >
            Kirim Hadiah
          </h2>

          {assets.ornament_divider && (
            <img
              src={assets.ornament_divider}
              alt=""
              aria-hidden="true"
              width={120}
              height={24}
              loading="lazy"
              className="mx-auto mt-4 opacity-60"
            />
          )}

          <p
            className="mx-auto mt-4 text-sm leading-relaxed"
            style={{
              color: assets.color_text_muted ?? assets.color_secondary ?? "#9a8060",
              fontFamily: `'${assets.font_body}', sans-serif`,
              maxWidth: "40ch",
            }}
          >
            Doa restu Anda adalah hadiah terbaik bagi kami. Namun jika ingin
            memberi, berikut cara yang bisa digunakan.
          </p>
        </motion.div>

        {/* Tab switcher — tampilkan hanya jika ada keduanya */}
        {hasQris && hasRekening ? (
          <GiftTabs
            assets={assets}
            rekening={rekening}
            qrisUrl={data.qris_image!}
            copiedIndex={copiedIndex}
            onCopy={copy}
          />
        ) : hasQris ? (
          <QrisCard qrisUrl={data.qris_image!} assets={assets} />
        ) : (
          <div className="flex flex-col gap-4">
            {rekening.map((entry, i) => (
              <RekeningCard
                key={`${entry.bank}-${i}`}
                entry={entry}
                index={i}
                assets={assets}
                copiedIndex={copiedIndex}
                onCopy={copy}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Tab switcher (QRIS / Rekening) ──────────────────────────────────────────
function GiftTabs({
  assets,
  rekening,
  qrisUrl,
  copiedIndex,
  onCopy,
}: {
  assets: ClassicThemeAssets;
  rekening: RekeningEntry[];
  qrisUrl: string;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}) {
  const [activeTab, setActiveTab] = useState<"qris" | "rekening">("rekening");

  return (
    <div className="flex flex-col gap-6">
      {/* Tab buttons */}
      <div
        className="flex rounded-full p-1"
        style={{ backgroundColor: `${assets.color_primary}18` }}
        role="tablist"
        aria-label="Metode amplop digital"
      >
        {(["rekening", "qris"] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 rounded-full py-2 text-sm font-semibold transition-all duration-200"
            style={{
              backgroundColor: activeTab === tab ? (assets.color_primary ?? "#8b6c42") : "transparent",
              color: activeTab === tab ? "#fff" : (assets.color_primary ?? "#8b6c42"),
              fontFamily: `'${assets.font_body}', sans-serif`,
            }}
          >
            {tab === "rekening" ? "Transfer Bank" : "QRIS"}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div role="tabpanel">
        {activeTab === "qris" ? (
          <QrisCard qrisUrl={qrisUrl} assets={assets} />
        ) : (
          <div className="flex flex-col gap-4">
            {rekening.map((entry, i) => (
              <RekeningCard
                key={`${entry.bank}-${i}`}
                entry={entry}
                index={i}
                assets={assets}
                copiedIndex={copiedIndex}
                onCopy={onCopy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
