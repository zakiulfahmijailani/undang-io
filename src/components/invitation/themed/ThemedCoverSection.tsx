"use client";

import { motion } from 'framer-motion';
import { useInvitationTheme } from './ThemeContext';

interface Props {
  coupleShortName: string;
  onOpen: () => void;
}

export default function ThemedCoverSection({ coupleShortName, onOpen }: Props) {
  const { theme, getSlotUrl } = useInvitationTheme();
  const coverBg = getSlotUrl('cover_background');
  const c = theme.colors;

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {coverBg && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverBg})` }}
        >
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to bottom, hsl(${c.secondary} / 0.6), hsl(${c.secondary} / 0.4), hsl(${c.secondary} / 0.7))` }}
          />
        </div>
      )}
      {!coverBg && (
        <div className="absolute inset-0" style={{ background: `hsl(${c.secondary})` }} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 text-center px-6"
      >
        <p
          className="text-lg tracking-widest uppercase mb-4"
          style={{
            fontFamily: `'${theme.typography.bodyFont}', serif`,
            color: `hsl(${c.surface} / 0.8)`,
          }}
        >
          The Wedding of
        </p>
        <h1
          className="text-6xl md:text-8xl mb-8 drop-shadow-lg"
          style={{
            fontFamily: `'${theme.typography.headingFont}', cursive`,
            color: `hsl(${c.surface})`,
          }}
        >
          {coupleShortName}
        </h1>
        <motion.button
          onClick={onOpen}
          className="mt-8 px-8 py-3 rounded-full text-lg tracking-wide backdrop-blur-sm border"
          style={{
            fontFamily: `'${theme.typography.bodyFont}', serif`,
            background: `hsl(${c.primary} / 0.9)`,
            color: `hsl(${c.surface})`,
            borderColor: `hsl(${c.surface} / 0.2)`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✉ Buka Undangan
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 rounded-full border-2 flex justify-center pt-2" style={{ borderColor: `hsl(${c.surface} / 0.4)` }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: `hsl(${c.surface} / 0.6)` }} />
        </div>
      </motion.div>
    </section>
  );
}
