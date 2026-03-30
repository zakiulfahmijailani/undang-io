"use client";

import { motion } from "framer-motion";
import type { ClassicThemeAssets, ClassicInvitationData, LoveStoryEntry } from "@/types/theme";

interface Props {
  assets: ClassicThemeAssets;
  data: ClassicInvitationData;
}

export function ClassicLoveStorySection({ assets, data }: Props) {
  const stories = data.love_story as LoveStoryEntry[];
  if (!stories || stories.length === 0) return null;

  return (
    <section
      id="classic-love-story"
      className="py-16 px-4"
      style={{ backgroundColor: assets.bg_section_3 ?? "#fdfaf6" }}
    >
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p
          className="mb-2 text-xs tracking-[0.3em] uppercase"
          style={{ color: assets.color_primary ?? "#8b6c42" }}
        >
          Our Journey
        </p>
        <h2
          className="text-2xl font-semibold"
          style={{
            fontFamily: assets.font_display ?? "serif",
            color: assets.color_text_body ?? "#3d2e1e",
          }}
        >
          Kisah Cinta Kami
        </h2>
        <div
          className="mx-auto mt-3 h-px w-16"
          style={{ backgroundColor: assets.color_primary ?? "#8b6c42" }}
        />
      </motion.div>

      {/* Timeline */}
      <div className="relative mx-auto max-w-2xl">
        {/* Vertical line */}
        <div
          className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
          style={{ backgroundColor: assets.color_primary ?? "#8b6c42", opacity: 0.2 }}
          aria-hidden="true"
        />

        <ol className="space-y-10">
          {stories.map((story, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: isLeft ? -32 : 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex items-start gap-6 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Content card */}
                <div
                  className="w-[calc(50%-2rem)] rounded-xl p-5 shadow-sm"
                  style={{
                    backgroundColor: assets.color_secondary ?? "#f5ede0",
                    color: assets.color_text_body ?? "#3d2e1e",
                  }}
                >
                  {story.date && (
                    <p
                      className="mb-1 text-xs font-semibold tracking-widest uppercase"
                      style={{ color: assets.color_primary ?? "#8b6c42" }}
                    >
                      {story.date}
                    </p>
                  )}
                  <h3
                    className="mb-2 font-semibold"
                    style={{ fontFamily: assets.font_display ?? "serif" }}
                  >
                    {story.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: assets.font_body ?? "sans-serif",
                      opacity: 0.8,
                    }}
                  >
                    {story.description}
                  </p>
                  {story.photo && (
                    <img
                      src={story.photo}
                      alt={story.title}
                      width={400}
                      height={240}
                      loading="lazy"
                      className="mt-3 w-full rounded-lg object-cover"
                      style={{ maxHeight: "180px" }}
                    />
                  )}
                </div>

                {/* Center dot */}
                <div
                  className="absolute left-1/2 top-5 h-3 w-3 -translate-x-1/2 rounded-full border-2"
                  style={{
                    backgroundColor: assets.color_bg_page ?? "#fdfaf6",
                    borderColor: assets.color_primary ?? "#8b6c42",
                  }}
                  aria-hidden="true"
                />

                {/* Spacer sisi kosong */}
                <div className="w-[calc(50%-2rem)]" />
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}