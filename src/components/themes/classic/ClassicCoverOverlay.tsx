"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { ClassicThemeAssets, ClassicInvitationData } from "@/types/theme";

interface ClassicCoverOverlayProps {
  assets: ClassicThemeAssets;
  data: ClassicInvitationData;
  isOpen: boolean;
  onOpen: () => void;
  guestName?: string;
}

export function ClassicCoverOverlay({
  assets,
  data,
  isOpen,
  onOpen,
  guestName,
}: ClassicCoverOverlayProps) {
  const groomNick = data.groom_nickname || data.groom_full_name.split(" ")[0];
  const brideNick = data.bride_nickname || data.bride_full_name.split(" ")[0];

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="cover-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: assets.cover_bg_color ?? "#faf6f1",
            backgroundImage: assets.cover_bg_pattern_url
              ? `url(${assets.cover_bg_pattern_url})`
              : undefined,
            backgroundRepeat: "repeat",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
        >
          {/* Dekorasi bunga pojok */}
          {assets.flower_top_right_url && (
            <div className="pointer-events-none absolute right-0 top-0">
              <Image
                src={assets.flower_top_right_url}
                alt=""
                width={180}
                height={180}
                className="object-contain"
                priority
              />
            </div>
          )}
          {assets.flower_top_left_url && (
            <div className="pointer-events-none absolute left-0 top-0">
              <Image
                src={assets.flower_top_left_url}
                alt=""
                width={180}
                height={180}
                className="object-contain"
                priority
              />
            </div>
          )}

          {/* Konten tengah */}
          <motion.div
            className="flex flex-col items-center gap-6 px-8 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.7 } }}
          >
            {/* Foto utama / ornamen bulat */}
            {assets.couple_main_image_url && (
              <Image
                src={assets.couple_main_image_url}
                alt={`${groomNick} & ${brideNick}`}
                width={220}
                height={220}
                className="object-contain"
                priority
              />
            )}

            {/* Nama pasangan */}
            <h1
              className="text-4xl leading-tight"
              style={{
                fontFamily: assets.font_script ?? "'Sacramento', cursive",
                color: assets.color_primary ?? "#8b6c42",
              }}
            >
              {groomNick} &amp; {brideNick}
            </h1>

            {/* Kepada tamu */}
            {guestName ? (
              <div className="space-y-1">
                <p
                  className="text-sm"
                  style={{ color: assets.color_text_muted ?? "#9a8060" }}
                >
                  Kepada Yth.
                </p>
                <p
                  className="text-base font-medium"
                  style={{ color: assets.color_primary ?? "#8b6c42" }}
                >
                  {guestName}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p
                  className="text-sm"
                  style={{ color: assets.color_text_muted ?? "#9a8060" }}
                >
                  Kepada Bapak/Ibu/Saudara/i
                </p>
                <p
                  className="text-sm"
                  style={{ color: assets.color_text_muted ?? "#9a8060" }}
                >
                  Kami Mengundang Anda Untuk Hadir Di Acara Pernikahan Kami.
                </p>
              </div>
            )}

            {/* Tombol buka */}
            <motion.button
              onClick={onOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 rounded-full px-8 py-3 text-sm font-semibold tracking-wide text-white shadow-md transition-all"
              style={{ backgroundColor: assets.color_primary ?? "#8b6c42" }}
            >
              Buka Undangan
            </motion.button>
          </motion.div>

          {/* Dekorasi bunga pojok bawah */}
          {assets.flower_bottom_right_url && (
            <div className="pointer-events-none absolute bottom-0 right-0">
              <Image
                src={assets.flower_bottom_right_url}
                alt=""
                width={180}
                height={180}
                className="object-contain"
              />
            </div>
          )}
          {assets.flower_bottom_left_url && (
            <div className="pointer-events-none absolute bottom-0 left-0">
              <Image
                src={assets.flower_bottom_left_url}
                alt=""
                width={180}
                height={180}
                className="object-contain"
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
