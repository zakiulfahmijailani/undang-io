"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClassicCoverOverlay } from "./ClassicCoverOverlay";
import { ClassicHeroSection } from "./ClassicHeroSection";
import { ClassicCoupleSection } from "./ClassicCoupleSection";
import { ClassicEventSection } from "./ClassicEventSection";
import type { ClassicThemeRenderProps } from "@/types/theme";
import { ClassicLoveStorySection } from './sections/ClassicLoveStorySection';

// ─── Google Fonts dynamic loader ─────────────────────────────────────────────
function useDynamicFonts(fonts: (string | null | undefined)[]) {
  useEffect(() => {
    const unique = [...new Set(fonts.filter(Boolean))] as string[];
    if (!unique.length) return;
    const families = unique
      .map((f) => f.replace(/ /g, "+"))
      .map((f) => `family=${f}:wght@400;600;700`)
      .join("&");
    const href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, [fonts]);
}

// ─── Background music player ──────────────────────────────────────────────────
function useBgMusic(musicUrl: string | null | undefined, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!musicUrl || !enabled) return;
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, [musicUrl, enabled]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().then(() => setIsPlaying(true)).catch(() => { }); }
  }, [isPlaying]);

  // autoplay setelah user tap "Buka Undangan"
  const autoplay = useCallback(() => {
    if (!audioRef.current || !enabled) return;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
  }, [enabled]);

  return { isPlaying, toggle, autoplay };
}

// ─── Particle canvas (ringan, pure CSS/canvas) ────────────────────────────────
type ParticleType = "petals" | "sparkle" | "bubbles" | "leaves" | "snow" | "none";

function ParticleCanvas({
  type,
  color,
}: {
  type: ParticleType;
  color?: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === "none" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const c = color ?? "#bf9b73";
    const N = 28;
    type P = { x: number; y: number; r: number; speed: number; opacity: number; wobble: number; phase: number };

    const particles: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 2 + Math.random() * 5,
      speed: 0.4 + Math.random() * 0.8,
      opacity: 0.3 + Math.random() * 0.5,
      wobble: (Math.random() - 0.5) * 0.8,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;
      for (const p of particles) {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = c;
        ctx.beginPath();

        if (type === "petals" || type === "leaves") {
          // Ellipse miring
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.sin(t + p.phase) * 0.6);
          ctx.scale(1, 0.55);
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
        } else if (type === "snow") {
          ctx.arc(p.x, p.y, p.r * 0.7, 0, Math.PI * 2);
        } else if (type === "sparkle") {
          // Bintang 4 sudut
          ctx.translate(p.x, p.y);
          for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -p.r * 2);
          }
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();

        // Jatuh ke bawah + wobble horizontal
        p.y += p.speed;
        p.x += Math.sin(t * 0.8 + p.phase) * p.wobble;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      }
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [type, color]);

  if (type === "none") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden="true"
      style={{ opacity: 0.55 }}
    />
  );
}

// ─── Section placeholder (sections belum diport) ──────────────────────────────
function PlaceholderSection({
  id,
  label,
  bgColor,
}: {
  id: string;
  label: string;
  bgColor?: string | null;
}) {
  return (
    <section
      id={id}
      className="flex min-h-[200px] items-center justify-center py-16"
      style={{ backgroundColor: bgColor ?? "#fdfaf6" }}
    >
      <p
        className="rounded-full border px-6 py-2 text-xs tracking-widest opacity-40"
        style={{ borderColor: "#bf9b73", color: "#8b6c42" }}
      >
        {label} — coming soon
      </p>
    </section>
  );
}

// ─── Preview banner ───────────────────────────────────────────────────────────
function PreviewBanner() {
  return (
    <div
      className="fixed left-0 right-0 top-0 z-[200] flex items-center justify-center gap-2 py-2 text-xs font-semibold tracking-widest text-white"
      style={{ backgroundColor: "#8b6c42" }}
    >
      <span>👁️</span>
      <span>MODE PREVIEW — Musik & interaksi dinonaktifkan</span>
    </div>
  );
}

// ─── Scroll-to-top button ──────────────────────────────────────────────────────
function ScrollToTopButton({ color }: { color?: string | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-md text-white text-lg"
          style={{ backgroundColor: color ?? "#8b6c42" }}
          aria-label="Kembali ke atas"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Music toggle button ──────────────────────────────────────────────────────
function MusicToggleButton({
  isPlaying,
  onToggle,
  color,
}: {
  isPlaying: boolean;
  onToggle: () => void;
  color?: string | null;
}) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onToggle}
      className="fixed bottom-6 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-md text-white text-base"
      style={{ backgroundColor: color ?? "#8b6c42" }}
      aria-label={isPlaying ? "Pause musik" : "Play musik"}
      title={isPlaying ? "Pause musik" : "Play musik"}
    >
      {isPlaying ? "⏸" : "🎵"}
    </motion.button>
  );
}

// ─── MAIN RENDERER ────────────────────────────────────────────────────────────
export function ClassicThemeRenderer({
  theme,
  data,
  guestName,
  isPreview = false,
}: ClassicThemeRenderProps) {
  const { assets } = theme;
  const [isOpen, setIsOpen] = useState(false);

  // Load Google Fonts dari assets
  useDynamicFonts([
    assets.font_display,
    assets.font_body,
    assets.font_script,
    assets.font_heading,
    assets.font_arabic,
  ]);

  // Music
  const { isPlaying, toggle, autoplay } = useBgMusic(
    assets.bg_music,
    !isPreview
  );

  // Handler buka undangan: state + autoplay musik
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    autoplay();
  }, [autoplay]);

  // Set CSS var global biar bisa dipakai di mana-mana via var(--classic-primary)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--classic-primary", assets.color_primary ?? "#8b6c42");
    root.style.setProperty("--classic-secondary", assets.color_secondary ?? "#f5ede0");
    root.style.setProperty("--classic-accent", assets.color_accent ?? "#c9a97a");
    root.style.setProperty("--classic-bg", assets.color_bg_page ?? "#fdfaf6");
    root.style.setProperty("--classic-text", assets.color_text_body ?? "#3d2e1e");
    root.style.setProperty("--classic-muted", assets.color_text_muted ?? assets.color_secondary ?? "#9a8060");
    root.style.setProperty("--classic-font-display", `'${assets.font_display}', serif`);
    root.style.setProperty("--classic-font-body", `'${assets.font_body}', sans-serif`);
    root.style.setProperty("--classic-font-script", assets.font_script ? `'${assets.font_script}', cursive` : "cursive");
  }, [assets]);

  return (
    <>
      {/* ── Preview mode banner ── */}
      {isPreview && <PreviewBanner />}

      {/* ── Particle overlay (fixed, atas semua section) ── */}
      {isOpen && (
        <ParticleCanvas
          type={assets.particle_type}
          color={assets.particle_color ?? assets.color_primary}
        />
      )}

      {/* ── Cover Overlay (fullscreen, z-50, hilang setelah dibuka) ── */}
      <ClassicCoverOverlay
        assets={assets}
        data={data}
        isOpen={isOpen}
        onOpen={handleOpen}
        guestName={guestName}
      />

      {/* ── Main content (muncul setelah overlay tutup) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.main
            key="classic-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.6 } }}
            style={{
              backgroundColor: assets.color_bg_page ?? "#fdfaf6",
              paddingTop: isPreview ? "36px" : undefined,
            }}
          >
            {/* 1. Hero — countdown + nama + foto */}
            <ClassicHeroSection assets={assets} data={data} />

            {/* 2. Couple — profil mempelai + ortu */}
            <ClassicCoupleSection assets={assets} data={data} />

            {/* 3. Event — Akad & Resepsi cards */}
            <ClassicEventSection assets={assets} data={data} />

            {/* 4. Love Story — coming Step 9 */}

            {data.loveStory && data.loveStory.length > 0 && (
              <ClassicLoveStorySection
                assets={assets}
                data={data}
              />
            )}

            {/* 5. Gallery — coming Step 10 */}
            <PlaceholderSection
              id="classic-gallery"
              label="Galeri Foto"
              bgColor={assets.bg_section_4}
            />

            {/* 6. Gift / Amplop Digital — coming Step 11 */}
            <PlaceholderSection
              id="classic-gift"
              label="Amplop Digital"
              bgColor={assets.bg_section_5}
            />

            {/* 7. RSVP & Ucapan — coming Step 12 */}
            <PlaceholderSection
              id="classic-rsvp"
              label="RSVP & Ucapan Selamat"
              bgColor={assets.bg_section_5}
            />

            {/* 8. Footer */}
            <footer
              className="py-8 text-center text-xs"
              style={{
                backgroundColor: assets.bg_section_5 ?? "#f5ede0",
                color: assets.color_text_muted ?? assets.color_secondary ?? "#9a8060",
                fontFamily: assets.font_body ?? "sans-serif",
              }}
            >
              Made with ♥ by{" "}
              <a
                href="https://undang.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: assets.color_primary ?? "#8b6c42" }}
                className="font-semibold hover:underline"
              >
                undang.io
              </a>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      {/* ── Float buttons (muncul setelah buka) ── */}
      {isOpen && !isPreview && (
        <MusicToggleButton
          isPlaying={isPlaying}
          onToggle={toggle}
          color={assets.color_primary}
        />
      )}
      {isOpen && (
        <ScrollToTopButton color={assets.color_primary} />
      )}
    </>
  );
}
