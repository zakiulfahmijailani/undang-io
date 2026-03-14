"use client";

import { motion } from 'framer-motion';
import { useInvitationTheme } from './ThemeContext';

interface PersonData { fullName: string; father: string; mother: string; photo: string; }
interface Props { groom: PersonData; bride: PersonData; }

function PersonCard({ person, direction }: { person: PersonData; direction: 'left' | 'right' }) {
  const { theme } = useInvitationTheme();
  const c = theme.colors;
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'left' ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center text-center"
    >
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 mb-4" style={{ borderColor: `hsl(${c.accent})` }}>
        <img src={person.photo} alt={person.fullName} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-2xl mb-2" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.textPrimary})` }}>
        {person.fullName}
      </h3>
      <p className="text-sm" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textSecondary})` }}>
        Putra/i dari<br />{person.father}<br />&amp;<br />{person.mother}
      </p>
    </motion.div>
  );
}

export default function ThemedCoupleSection({ groom, bride }: Props) {
  const { theme } = useInvitationTheme();
  const c = theme.colors;

  return (
    <section id="mempelai" className="py-20 px-6" style={{ background: `hsl(${c.surface})` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <p className="tracking-[0.3em] uppercase text-sm mb-2" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textSecondary})` }}>
          Mempelai
        </p>
        <h2 className="text-4xl md:text-5xl" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}>
          Bride &amp; Groom
        </h2>
      </motion.div>
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <PersonCard person={groom} direction="left" />
        <PersonCard person={bride} direction="right" />
      </div>
    </section>
  );
}
