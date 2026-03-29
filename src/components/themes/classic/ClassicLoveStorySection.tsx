"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ClassicTheme, ClassicInvitationData } from "@/types/theme";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface LoveStoryEntry {
  date:        string;
  title:       string;
  description: string;
}

interface ClassicLoveStorySectionProps {
  theme: ClassicTheme;
  data:  ClassicInvitationData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Animation variants
// ─────────────────────────────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const slideLeft = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const slideRight = {
  hidden:  { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const dotPop = {
  hidden:  { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
};

// ─────────────────────────────────────────────────────────────────────────────
// HeartIcon — SVG inline agar tidak perlu dep tambahan
// ─────────────────────────────────────────────────────────────────────────────
function HeartIcon({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
               2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
               C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
               c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TimelineCard — satu entry cerita
// ─────────────────────────────────────────────────────────────────────────────
function TimelineCard({
  entry,
  index,
  isRight,
  primary,
  secondary,
  accent,
  fontDisplay,
  fontBody,
  fontScript,
}: {
  entry:       LoveStoryEntry;
  index:       number;
  isRight:     boolean;          // alternating side
  primary:     string;
  secondary:   string;
  accent:      string;
  fontDisplay: string;
  fontBody:    string;
  fontScript:  string;
}) {
  const cardVariant = isRight ? slideRight : slideLeft;
  const delay       = index * 0.12;

  return (
    /* Mobile: full-width column. Desktop: alternating via CSS */
    <div
      className="relative grid items-center"
      style={{
        /* desktop: 2-col grid; mobile: override via media — handled inline below */
        gridTemplateColumns: "1fr 40px 1fr",
        columnGap: "0",
      }}
    >
      {/* ── LEFT CELL — card di desktop kiri, kosong jika isRight ── */}
      <div
        style={{
          display:        isRight ? "none" : "block",
          paddingRight:   "28px",
          textAlign:      "right",
        }}
        className="hidden md:block"
      >
        {!isRight && (
          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay }}
            style={{
              backgroundColor: "white",
              borderRadius:     "12px",
              padding:          "20px 24px",
              boxShadow:        `0 2px 16px ${primary}18`,
              border:           `1px solid ${primary}22`,
              display:          "inline-block",
              maxWidth:         "340px",
              width:            "100%",
            }}
          >
            <CardContent entry={entry} primary={primary} accent={accent} fontDisplay={fontDisplay} fontBody={fontBody} fontScript={fontScript} textAlign="right" />
          </motion.div>
        )}
      </div>

      {/* ── CENTER DOT ── */}
      <div
        style={{
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          position:       "relative",
          zIndex:         2,
        }}
      >
        <motion.div
          variants={dotPop}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: delay + 0.15 }}
          style={{
            width:           "40px",
            height:          "40px",
            borderRadius:    "50%",
            backgroundColor: primary,
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            boxShadow:       `0 0 0 4px white, 0 0 0 6px ${primary}44`,
            flexShrink:      0,
          }}
        >
          <HeartIcon size={16} color="white" />
        </motion.div>
      </div>

      {/* ── RIGHT CELL — card di desktop kanan, kosong jika tidak isRight ── */}
      <div
        style={{
          paddingLeft: "28px",
          textAlign:   "left",
          display:     !isRight ? "none" : "block",
        }}
        className="hidden md:block"
      >
        {isRight && (
          <motion.div
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay }}
            style={{
              backgroundColor: "white",
              borderRadius:     "12px",
              padding:          "20px 24px",
              boxShadow:        `0 2px 16px ${primary}18`,
              border:           `1px solid ${primary}22`,
              display:          "inline-block",
              maxWidth:         "340px",
              width:            "100%",
            }}
          >
            <CardContent entry={entry} primary={primary} accent={accent} fontDisplay={fontDisplay} fontBody={fontBody} fontScript={fontScript} textAlign="left" />
          </motion.div>
        )}
      </div>

      {/* ── MOBILE: full-width card (di bawah dot) ── */}
      <div
        className="md:hidden"
        style={{
          gridColumn:  "1 / -1",
          paddingTop:  "12px",
          paddingLeft: "16px",
          paddingRight:"16px",
        }}
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay }}
          style={{
            backgroundColor: "white",
            borderRadius:     "12px",
            padding:          "20px",
            boxShadow:        `0 2px 16px ${primary}18`,
            border:           `1px solid ${primary}22`,
          }}
        >
          <CardContent entry={entry} primary={primary} accent={accent} fontDisplay={fontDisplay} fontBody={fontBody} fontScript={fontScript} textAlign="left" />
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CardContent — isi dalam card
// ─────────────────────────────────────────────────────────────────────────────
function CardContent({
  entry,
  primary,
  accent,
  fontDisplay,
  fontBody,
  fontScript,
  textAlign,
}: {
  entry:       LoveStoryEntry;
  primary:     string;
  accent:      string;
  fontDisplay: string;
  fontBody:    string;
  fontScript:  string;
  textAlign:   "left" | "right";
}) {
  return (
    <div style={{ textAlign }}>
      {/* Tanggal — script font */}
      <p
        style={{
          fontFamily: `'${fontScript}', cursive`,
          fontSize:   "14px",
          color:      accent,
          marginBottom: "6px",
          lineHeight: 1.3,
        }}
      >
        {entry.date}
      </p>

      {/* Judul */}
      <h3
        style={{
          fontFamily:   `'${fontDisplay}', serif`,
          fontSize:     "18px",
          fontWeight:   600,
          color:        primary,
          marginBottom: "8px",
          lineHeight:   1.3,
          letterSpacing:"0.02em",
        }}
      >
        {entry.title}
      </h3>

      {/* Divider kecil */}
      <div
        style={{
          height:       "1px",
          width:        "40px",
          backgroundColor: accent,
          marginBottom: "10px",
          marginLeft:   textAlign === "right" ? "auto" : "0",
          opacity:      0.6,
        }}
      />

      {/* Deskripsi */}
      <p
        style={{
          fontFamily: `'${fontBody}', sans-serif`,
          fontSize:   "14px",
          lineHeight: 1.75,
          color:      "#5a4a3a",
          margin:     0,
        }}
      >
        {entry.description}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────
export function ClassicLoveStorySection({
  theme,
  data,
}: ClassicLoveStorySectionProps) {
  const { assets } = theme;

  const primary     = assets.color_primary     ?? "#8b6c42";
  const secondary   = assets.color_secondary   ?? "#f5ede0";
  const accent      = assets.color_accent      ?? "#c9a97a";
  const bgPage      = assets.color_bg_page     ?? "#fdfaf6";
  const fontDisplay = assets.font_display      ?? "Cormorant Garamond";
  const fontBody    = assets.font_body         ?? "Didact Gothic";
  const fontScript  = assets.font_script       ?? "Sacramento";

  const entries: LoveStoryEntry[] = data.love_story ?? [];

  // Guard: jika tidak ada entry, jangan render
  if (entries.length === 0) return null;

  return (
    <section
      id="love-story"
      style={{
        position:    "relative",
        overflow:    "hidden",
        backgroundColor: bgPage,
        paddingTop:  "80px",
        paddingBottom:"80px",
      }}
    >
      {/* ── Flower ornaments ── */}
      {assets.flower_left_url && (
        <img
          src={assets.flower_left_url}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            left:     0,
            top:      "50%",
            transform:"translateY(-50%)",
            width:    "160px",
            opacity:  0.35,
            pointerEvents: "none",
          }}
        />
      )}
      {assets.flower_right_url && (
        <img
          src={assets.flower_right_url}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            right:    0,
            top:      "50%",
            transform:"translateY(-50%) scaleX(-1)",
            width:    "160px",
            opacity:  0.35,
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Section header ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        style={{ textAlign: "center", marginBottom: "64px", position: "relative", zIndex: 1 }}
      >
        {/* Script sub-title */}
        <p
          style={{
            fontFamily:    `'${fontScript}', cursive`,
            fontSize:      "22px",
            color:         accent,
            marginBottom:  "8px",
            lineHeight:    1.3,
          }}
        >
          Our Journey
        </p>

        {/* Judul utama */}
        <h2
          style={{
            fontFamily:   `'${fontDisplay}', serif`,
            fontSize:     "clamp(28px, 5vw, 44px)",
            fontWeight:   600,
            color:        primary,
            letterSpacing:"0.04em",
            marginBottom: "16px",
            lineHeight:   1.2,
          }}
        >
          Love Story
        </h2>

        {/* Ornament divider */}
        {assets.ornament_divider ? (
          <img
            src={assets.ornament_divider}
            alt=""
            aria-hidden="true"
            style={{ display: "inline-block", height: "24px", opacity: 0.7 }}
          />
        ) : (
          <div
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            "10px",
            }}
          >
            <div style={{ height: "1px", width: "48px", backgroundColor: accent, opacity: 0.6 }} />
            <HeartIcon size={14} color={accent} />
            <div style={{ height: "1px", width: "48px", backgroundColor: accent, opacity: 0.6 }} />
          </div>
        )}
      </motion.div>

      {/* ── Timeline ── */}
      <div
        style={{
          position:   "relative",
          maxWidth:   "800px",
          margin:     "0 auto",
          padding:    "0 20px",
          zIndex:     1,
        }}
      >
        {/* Garis vertikal tengah — desktop only */}
        <div
          className="hidden md:block"
          style={{
            position:        "absolute",
            left:            "50%",
            transform:       "translateX(-50%)",
            top:             "20px",
            bottom:          "20px",
            width:           "2px",
            backgroundColor: `${accent}50`,
            zIndex:          0,
          }}
        />

        {/* Garis vertikal kiri — mobile only */}
        <div
          className="md:hidden"
          style={{
            position:        "absolute",
            left:            "36px",
            top:             "20px",
            bottom:          "20px",
            width:           "2px",
            backgroundColor: `${accent}40`,
            zIndex:          0,
          }}
        />

        {/* Entry list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {entries.map((entry, i) => (
            <TimelineCard
              key={i}
              entry={entry}
              index={i}
              isRight={i % 2 === 1}  // alternating
              primary={primary}
              secondary={secondary}
              accent={accent}
              fontDisplay={fontDisplay}
              fontBody={fontBody}
              fontScript={fontScript}
            />
          ))}
        </div>
      </div>

      {/* ── Bottom accent text ── */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        style={{
          textAlign:   "center",
          marginTop:   "56px",
          fontFamily:  `'${fontScript}', cursive`,
          fontSize:    "18px",
          color:       accent,
          opacity:     0.8,
        }}
      >
        &hellip; dan perjalanan itu terus berlanjut
      </motion.p>
    </section>
  );
}
