"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ClassicThemeAssets, ClassicInvitationData } from "@/types/theme";

interface Props {
  assets: ClassicThemeAssets;
  data: ClassicInvitationData;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
interface LightboxProps {
  photos: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  primaryColor: string;
}

function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  primaryColor,
}: LightboxProps) {
  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Galeri foto"
    >
      {/* Prev */}
      <button
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white text-xl opacity-80 hover:opacity-100"
        style={{ backgroundColor: primaryColor }}
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Foto sebelumnya"
      >
        ‹
      </button>

      {/* Image */}
      <motion.img
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.25 }}
        src={photos[currentIndex]}
        alt={`Galeri foto ${currentIndex + 1}`}
        width={900}
        height={600}
        loading="lazy"
        className="max-h-[85dvh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ userSelect: "none" }}
      />

      {/* Next */}
      <button
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white text-xl opacity-80 hover:opacity-100"
        style={{ backgroundColor: primaryColor }}
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Foto berikutnya"
      >
        ›
      </button>

      {/* Counter */}
      <p
        className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs tracking-widest text-white"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      >
        {currentIndex + 1} / {photos.length}
      </p>

      {/* Close */}
      <button
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white text-lg opacity-80 hover:opacity-100"
        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        onClick={onClose}
        aria-label="Tutup galeri"
      >
        ✕
      </button>
    </motion.div>
  );
}

// ─── Gallery item ─────────────────────────────────────────────────────────────
function GalleryItem({
  src,
  index,
  primaryColor,
  onClick,
}: {
  src: string;
  index: number;
  primaryColor: string;
  onClick: () => void;
}) {
  // Beri variasi aspect-ratio untuk masonry feel tanpa JS layout library
  const aspects = [
    "aspect-square",
    "aspect-[4/5]",
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[4/5]",
    "aspect-[5/4]",
  ];
  const aspect = aspects[index % aspects.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07 }}
      className={`${aspect} cursor-pointer overflow-hidden rounded-xl`}
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Buka foto ${index + 1}`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <img
        src={src}
        alt={`Galeri foto ${index + 1}`}
        width={400}
        height={400}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        style={{
          outline: `2px solid ${primaryColor}`,
          outlineOffset: "-2px",
          outlineColor: "transparent",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.outlineColor = `${primaryColor}55`)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.outlineColor = "transparent")
        }
      />
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ClassicGallerySection({ assets, data }: Props) {
  // Kumpulkan semua foto galeri: photo_gallery array + couple photos
  const galleryPhotos: string[] = [
    ...(data.photo_gallery ?? []),
    ...(data.photo_couple_1 ? [data.photo_couple_1] : []),
    ...(data.photo_couple_2 ? [data.photo_couple_2] : []),
    ...(data.photo_couple_3 ? [data.photo_couple_3] : []),
  ].filter(Boolean) as string[];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + galleryPhotos.length) % galleryPhotos.length
    );
  }, [galleryPhotos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % galleryPhotos.length
    );
  }, [galleryPhotos.length]);

  if (galleryPhotos.length === 0) return null;

  const primaryColor = assets.color_primary ?? "#8b6c42";
  const bgColor = assets.bg_section_4 ?? "#fdfaf6";

  return (
    <>
      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={galleryPhotos}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            primaryColor={primaryColor}
          />
        )}
      </AnimatePresence>

      <section
        id="classic-gallery"
        className="px-4 py-16"
        style={{ backgroundColor: bgColor }}
      >
        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          {assets.flower_top_center_url && (
            <img
              src={assets.flower_top_center_url}
              alt=""
              aria-hidden="true"
              width={120}
              height={60}
              loading="lazy"
              className="mx-auto mb-4 opacity-75"
            />
          )}
          <p
            className="mb-2 text-xs tracking-[0.3em] uppercase"
            style={{ color: primaryColor }}
          >
            Our Moments
          </p>
          <h2
            className="text-2xl font-semibold"
            style={{
              fontFamily: assets.font_display ?? "serif",
              color: assets.color_text_body ?? "#3d2e1e",
            }}
          >
            Galeri Foto
          </h2>
          <div
            className="mx-auto mt-3 h-px w-16"
            style={{ backgroundColor: primaryColor }}
          />
        </motion.div>

        {/* ── Masonry-style CSS columns grid ── */}
        <div
          className="mx-auto max-w-4xl"
          style={{
            columns: "2 160px",
            columnGap: "0.75rem",
          }}
        >
          {galleryPhotos.map((src, i) => (
            <div
              key={i}
              className="mb-3 break-inside-avoid"
            >
              <GalleryItem
                src={src}
                index={i}
                primaryColor={primaryColor}
                onClick={() => openLightbox(i)}
              />
            </div>
          ))}
        </div>

        {/* ── Caption ── */}
        {galleryPhotos.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center text-xs tracking-widest"
            style={{
              color: assets.color_text_muted ?? assets.color_secondary ?? "#9a8060",
              fontFamily: assets.font_body ?? "sans-serif",
            }}
          >
            {galleryPhotos.length} foto • Sentuh untuk perbesar
          </motion.p>
        )}
      </section>
    </>
  );
}
