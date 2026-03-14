"use client";

import { motion } from 'framer-motion';
import { useInvitationTheme } from './ThemeContext';

interface Props { text: string; source: string; }

export default function ThemedQuoteSection({ text, source }: Props) {
  const { theme, getSlotUrl } = useInvitationTheme();
  const bgQuote = getSlotUrl('bg_quote');
  const c = theme.colors;

  return (
    <section className="py-16 px-6 relative overflow-hidden" style={{ background: `hsl(${c.primary} / 0.1)` }}>
      {bgQuote && (
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${bgQuote})` }} />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-lg mx-auto text-center relative z-10"
      >
        <p className="text-lg italic leading-relaxed mb-4" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textPrimary})` }}>
          &ldquo;{text}&rdquo;
        </p>
        <p className="text-sm font-semibold" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.accent})` }}>
          — {source}
        </p>
      </motion.div>
    </section>
  );
}
