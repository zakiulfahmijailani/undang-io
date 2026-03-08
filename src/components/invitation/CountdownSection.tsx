"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownSectionProps {
    targetDate: string;
}

const CountdownSection = ({ targetDate }: CountdownSectionProps) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isPast, setIsPast] = useState(false);

    useEffect(() => {
        const target = new Date(targetDate).getTime();
        const update = () => {
            const now = Date.now();
            const diff = target - now;
            if (diff <= 0) {
                setIsPast(true);
                return;
            }
            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const units = [
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes },
        { label: "Detik", value: timeLeft.seconds },
    ];

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-muted/30 to-card">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10"
            >
                <p className="font-serif-wedding text-muted-foreground tracking-[0.3em] uppercase text-sm mb-2">
                    Menuju Hari Bahagia
                </p>
                <h2 className="font-vibes text-accent text-4xl md:text-5xl">Counting Down</h2>
            </motion.div>

            {isPast ? (
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center font-serif-wedding text-foreground/80 text-xl max-w-md mx-auto"
                >
                    Semoga menjadi keluarga yang sakinah mawaddah warahmah 🌸
                </motion.p>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center gap-4 md:gap-6"
                >
                    {units.map((unit) => (
                        <div key={unit.label} className="flex flex-col items-center">
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl bg-card border border-accent/20 shadow-lg flex items-center justify-center">
                                <span className="font-script text-3xl md:text-5xl text-foreground">
                                    {String(unit.value).padStart(2, "0")}
                                </span>
                            </div>
                            <span className="font-serif-wedding text-muted-foreground text-xs md:text-sm mt-2 tracking-wider uppercase">
                                {unit.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            )}
        </section>
    );
};

export default CountdownSection;
