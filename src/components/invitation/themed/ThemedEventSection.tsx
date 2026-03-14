"use client";

import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { useInvitationTheme } from './ThemeContext';

interface EventData { date: string; venue: string; address: string; mapsUrl: string; }
interface DressCode { description: string; colors: string[]; }
interface Props { akad: EventData; reception: EventData; dressCode: DressCode; }

function EventCard({ event, title }: { event: EventData; title: string }) {
  const { theme } = useInvitationTheme();
  const c = theme.colors;
  const d = new Date(event.date);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl p-6 border"
      style={{ background: `hsl(${c.surface})`, borderColor: `hsl(${c.accent} / 0.2)` }}
    >
      <h3 className="text-2xl mb-4" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}>{title}</h3>
      <p className="text-sm font-semibold mb-1" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textPrimary})` }}>
        {format(d, 'EEEE, dd MMMM yyyy', { locale: idLocale })}
      </p>
      <p className="text-sm flex items-center gap-1 mb-3" style={{ color: `hsl(${c.textSecondary})` }}>
        <Clock className="w-3 h-3" /> {format(d, 'HH:mm')} WIB
      </p>
      <p className="text-sm font-semibold" style={{ color: `hsl(${c.textPrimary})` }}>{event.venue}</p>
      <p className="text-xs mb-4" style={{ color: `hsl(${c.textSecondary})` }}>{event.address}</p>
      <a
        href={event.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm px-4 py-2 rounded-full border"
        style={{ color: `hsl(${c.primary})`, borderColor: `hsl(${c.primary} / 0.3)` }}
      >
        <MapPin className="w-4 h-4" /> Lihat Peta
      </a>
    </motion.div>
  );
}

export default function ThemedEventSection({ akad, reception, dressCode }: Props) {
  const { theme, getSlotUrl } = useInvitationTheme();
  const bgEvent = getSlotUrl('bg_event');
  const c = theme.colors;

  return (
    <section id="lokasi" className="py-20 px-6 relative overflow-hidden">
      {bgEvent && <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${bgEvent})` }} />}
      <div className="absolute inset-0" style={{ background: `hsl(${c.surface} / 0.9)` }} />
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}>
            Save The Date
          </h2>
        </motion.div>
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <EventCard event={akad} title="Akad Nikah" />
          <EventCard event={reception} title="Resepsi" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <p className="text-sm mb-3" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textSecondary})` }}>
            Dress Code: {dressCode.description}
          </p>
          <div className="flex justify-center gap-2">
            {dressCode.colors.map((color) => (
              <div key={color} className="w-8 h-8 rounded-full border border-border" style={{ background: color }} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
