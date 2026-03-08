"use client";

import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

interface EventData {
    date: string;
    venue: string;
    address: string;
    mapsUrl: string;
}

interface DressCode {
    description: string;
    colors: string[];
}

interface EventSectionProps {
    akad: EventData;
    reception: EventData;
    dressCode: DressCode;
}

export const EventCard = ({ event, title }: { event: EventData; title: string }) => {
    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const formattedTime = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-6 md:p-8 border border-accent/20 shadow-lg text-center"
        >
            <h3 className="font-script text-2xl md:text-3xl text-foreground mb-4">{title}</h3>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="font-serif-wedding text-sm">{formattedDate}</span>
            </div>
            <p className="font-serif-wedding text-foreground/80 text-lg mb-4">{formattedTime}</p>
            <div className="flex items-start justify-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div>
                    <p className="font-serif-wedding font-semibold text-foreground text-sm">{event.venue}</p>
                    <p className="font-serif-wedding text-xs text-muted-foreground">{event.address}</p>
                </div>
            </div>
            <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full bg-accent/10 text-accent text-sm font-serif-wedding hover:bg-accent/20 transition-colors"
            >
                <MapPin className="w-3.5 h-3.5" />
                Buka Google Maps
            </a>
        </motion.div>
    );
};

const EventSection = ({ akad, reception, dressCode }: EventSectionProps) => {
    return (
        <section id="lokasi" className="py-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <p className="font-serif-wedding text-muted-foreground tracking-[0.3em] uppercase text-sm mb-2">
                    Waktu & Tempat
                </p>
                <h2 className="font-vibes text-accent text-4xl md:text-5xl">Save The Date</h2>
            </motion.div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <EventCard event={akad} title="Akad Nikah" />
                <EventCard event={reception} title="Resepsi" />
            </div>

            {/* Dress code */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-md mx-auto mt-10 text-center"
            >
                <p className="font-serif-wedding text-muted-foreground text-sm tracking-wider uppercase mb-3">
                    Dress Code
                </p>
                <p className="font-serif-wedding text-foreground/80 mb-4">{dressCode.description}</p>
                <div className="flex justify-center gap-3">
                    {dressCode.colors.map((color, i) => (
                        <div
                            key={i}
                            className="w-10 h-10 rounded-full border-2 border-border shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default EventSection;
