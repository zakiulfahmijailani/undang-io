"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Calendar } from "lucide-react";

interface HeroSectionProps {
    coupleShortName: string;
    groomName: string;
    brideName: string;
    heroPhoto: string;
    weddingDate: string;
    calendarUrl: string;
}

const HeroSection = ({ coupleShortName, groomName, brideName, heroPhoto, weddingDate, calendarUrl }: HeroSectionProps) => {
    useEffect(() => {
        // Confetti burst
        const end = Date.now() + 2000;
        const colors = ["#d4a373", "#ccd5ae", "#e8c8b8", "#fefae0"];

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors,
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
    }, []);

    const dateObj = new Date(weddingDate);
    const formattedDate = dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Parallax background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${heroPhoto})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-wedding-brown/50 via-wedding-brown/30 to-wedding-brown/60" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 text-center px-6 py-20"
            >
                <p className="font-serif-wedding text-primary-foreground/80 text-base md:text-lg tracking-[0.3em] uppercase mb-6">
                    Dengan memohon rahmat dan ridho Allah SWT
                </p>

                <h2 className="font-vibes text-primary-foreground text-5xl md:text-7xl mb-2 drop-shadow-lg">
                    {groomName.split(",")[0]}
                </h2>
                <p className="font-vibes text-wedding-gold text-4xl md:text-5xl my-4">&</p>
                <h2 className="font-vibes text-primary-foreground text-5xl md:text-7xl mb-8 drop-shadow-lg">
                    {brideName.split(",")[0]}
                </h2>

                <p className="font-serif-wedding text-primary-foreground/90 text-xl md:text-2xl mt-8 tracking-wide">
                    {formattedDate}
                </p>

                <motion.a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-accent/90 text-accent-foreground font-serif-wedding text-sm tracking-wide backdrop-blur-sm hover:bg-accent transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Calendar className="w-4 h-4" />
                    Simpan ke Google Calendar
                </motion.a>
            </motion.div>
        </section>
    );
};

export default HeroSection;
