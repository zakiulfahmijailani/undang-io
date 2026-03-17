"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Calendar } from "lucide-react";

interface EventSectionProps {
    akad: { date: string; venue: string; address: string; mapsUrl?: string };
    reception: { date: string; venue: string; address: string; mapsUrl?: string };
    dressCode?: { colors: string[]; note: string };
    calendarUrl?: string;
}

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

const EventCard = ({ title, event }: { title: string; event: EventSectionProps["akad"] }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="skeu-card bg-white rounded-3xl p-8 text-center"
    >
        {/* gold ornamen top */}
        <div className="flex items-center justify-center gap-2 mb-5">
            <div className="h-px w-10 bg-wedding-gold/50" />
            <span className="text-wedding-gold skeu-text-gold text-lg">✦</span>
            <div className="h-px w-10 bg-wedding-gold/50" />
        </div>

        <h3 className="font-vibes text-4xl mb-6 skeu-text-gold">{title}</h3>

        <div className="space-y-4 text-sm text-stone-600">
            <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4 text-wedding-gold" />
                <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-wedding-gold" />
                <span>{formatTime(event.date)} WIB</span>
            </div>
            <div className="skeu-inset bg-stone-50 rounded-xl p-4 text-center">
                <p className="font-semibold text-stone-800">{event.venue}</p>
                <p className="text-stone-500 text-xs mt-1">{event.address}</p>
            </div>
        </div>

        {event.mapsUrl && (
            <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full bg-wedding-gold text-white text-sm font-medium skeu-raised hover:opacity-90 transition-opacity"
            >
                <MapPin className="w-4 h-4" /> Lihat di Maps
            </a>
        )}
    </motion.div>
);

const EventSection = ({ akad, reception, dressCode }: EventSectionProps) => (
    <section id="event" className="py-20 px-4 skeu-paper">
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <p className="text-sm uppercase tracking-[0.3em] text-wedding-brown mb-3 skeu-text-emboss">Rangkaian Acara</p>
                <h2 className="font-vibes text-5xl md:text-6xl skeu-text-gold">Waktu & Tempat</h2>
                <div className="mt-5 flex items-center justify-center gap-3">
                    <div className="h-px w-16 bg-wedding-gold/50" />
                    <span className="text-wedding-gold text-xl skeu-text-gold">✦</span>
                    <div className="h-px w-16 bg-wedding-gold/50" />
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
                <EventCard title="Akad Nikah" event={akad} />
                <EventCard title="Resepsi" event={reception} />
            </div>

            {dressCode && dressCode.colors.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-10 skeu-card bg-white rounded-3xl p-8 text-center"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-wedding-brown mb-4 skeu-text-emboss">Dress Code</p>
                    <div className="flex justify-center gap-3 flex-wrap mb-3">
                        {dressCode.colors.map((c, i) => (
                            <span key={i}
                                className="inline-block w-8 h-8 rounded-full border-2 border-stone-200 skeu-raised"
                                style={{ backgroundColor: c }}
                                title={c}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-stone-500">{dressCode.note}</p>
                </motion.div>
            )}
        </div>
    </section>
);

export default EventSection;
