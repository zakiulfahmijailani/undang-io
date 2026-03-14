"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInvitationTheme } from './ThemeContext';

interface Props { targetDate: string; }

export default function ThemedCountdownSection({ targetDate }: Props) {
  const { theme, getSlotUrl } = useInvitationTheme();
  const bgCountdown = getSlotUrl('bg_countdown');
  const c = theme.colors;

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setIsPast(true); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: `hsl(${c.primary} / 0.1)` }}>
      {bgCountdown && <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${bgCountdown})` }} />}
      <div className="relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl mb-8"
          style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}
        >
          Menghitung Hari
        </motion.h2>
        {isPast ? (
          <p className="text-xl" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textPrimary})` }}>
            🎉 Hari bahagia telah tiba!
          </p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center gap-4 md:gap-8"
          >
            {units.map((u) => (
              <div key={u.label} className="flex flex-col items-center">
                <span
                  className="text-3xl md:text-5xl font-bold w-16 md:w-20 h-16 md:h-20 flex items-center justify-center rounded-xl"
                  style={{ background: `hsl(${c.primary} / 0.15)`, color: `hsl(${c.textPrimary})`, fontFamily: `'${theme.typography.bodyFont}', serif` }}
                >
                  {String(u.value).padStart(2, '0')}
                </span>
                <span className="text-xs mt-2 uppercase tracking-wider" style={{ color: `hsl(${c.textSecondary})`, fontFamily: `'${theme.typography.bodyFont}', serif` }}>
                  {u.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
