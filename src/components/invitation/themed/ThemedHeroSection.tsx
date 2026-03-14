"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useInvitationTheme } from './ThemeContext';

interface Props {
  coupleShortName: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  calendarUrl: string;
}

export default function ThemedHeroSection({ coupleShortName, groomName, brideName, weddingDate, calendarUrl }: Props) {
  const { theme, getSlotUrl } = useInvitationTheme();
  const heroBg = getSlotUrl('hero_background');
  const ornamentTop = getSlotUrl('ornament_top_hero');
  const ornamentBottom = getSlotUrl('ornament_bottom_hero');
  const c = theme.colors;
  const anim = theme.animationSettings;

  useEffect(() => {
    if (anim.heroAnimation === 'confetti') {
      const count = anim.intensity === 'high' ? 200 : anim.intensity === 'medium' ? 100 : 50;
      confetti({ particleCount: count, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#c8a961', '#b8860b'] });
    }
  }, [anim]);

  const formattedDate = format(new Date(weddingDate), 'EEEE, dd MMMM yyyy', { locale: id });

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
      {heroBg && (
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${heroBg})` }}>
          <div className="absolute inset-0" style={{ background: `hsl(${c.secondary} / 0.5)` }} />
        </div>
      )}
      {!heroBg && (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${c.primary}), hsl(${c.secondary}))` }} />
      )}

      {ornamentTop && (
        <img src={ornamentTop} alt="" className="absolute top-0 left-0 w-full h-auto z-10 pointer-events-none" />
      )}
      {ornamentBottom && (
        <img src={ornamentBottom} alt="" className="absolute bottom-0 left-0 w-full h-auto z-10 pointer-events-none" />
      )}

      <div className="relative z-20 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl mb-2"
          style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.surface})` }}
        >
          {groomName.split(',')[0]}
        </motion.p>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-3xl block my-4"
          style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}
        >
          &amp;
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-4xl md:text-5xl mb-8"
          style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.surface})` }}
        >
          {brideName.split(',')[0]}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-lg tracking-wider mb-6"
          style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.surface} / 0.8)` }}
        >
          {formattedDate}
        </motion.p>
        <motion.a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm border backdrop-blur-sm"
          style={{
            fontFamily: `'${theme.typography.bodyFont}', serif`,
            color: `hsl(${c.surface})`,
            borderColor: `hsl(${c.surface} / 0.3)`,
            background: `hsl(${c.primary} / 0.3)`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar className="w-4 h-4" />
          Simpan ke Google Calendar
        </motion.a>
      </div>
    </section>
  );
}
