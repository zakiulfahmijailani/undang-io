"use client";

import { motion } from 'framer-motion';
import { useInvitationTheme } from './ThemeContext';

interface StoryItem { date: string; title: string; description: string; photo: string; }
interface Props { stories: StoryItem[]; }

export default function ThemedLoveStorySection({ stories }: Props) {
  const { theme } = useInvitationTheme();
  const c = theme.colors;

  return (
    <section className="py-20 px-6" style={{ background: `hsl(${c.surface})` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <p className="tracking-[0.3em] uppercase text-sm mb-2" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textSecondary})` }}>
          Perjalanan Kami
        </p>
        <h2 className="text-4xl md:text-5xl" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}>
          Love Story
        </h2>
      </motion.div>
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" style={{ background: `hsl(${c.accent} / 0.3)` }} />
        {stories.map((story, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`relative flex items-start gap-6 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
          >
            <div className="flex-1 text-center md:text-left">
              <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: `hsl(${c.accent})` }}>{story.date}</span>
              <h3 className="text-xl mb-2" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.textPrimary})` }}>{story.title}</h3>
              <p className="text-sm" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textSecondary})` }}>{story.description}</p>
            </div>
            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border-2" style={{ borderColor: `hsl(${c.accent} / 0.3)` }}>
              <img src={story.photo} alt={story.title} className="w-full h-full object-cover" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
