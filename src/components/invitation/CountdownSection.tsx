"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownSectionProps {
    targetDate: string;
}

const CountdownSection = ({ targetDate }: CountdownSectionProps) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculate = () => {
            const diff = new Date(targetDate).getTime() - Date.now();
            if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };
        calculate();
        const id = setInterval(calculate, 1000);
        return () => clearInterval(id);
    }, [targetDate]);

    const units = [
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes },
        { label: "Detik", value: timeLeft.seconds },
    ];

    return (
        <section className="py-20 px-4 bg-wedding-brown skeu-velvet">
            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-wedding-gold/80 mb-3 skeu-text-emboss">Menuju Hari Bahagia</p>
                    <h2 className="font-vibes text-4xl md:text-5xl text-white mb-12 skeu-text-emboss">Hitung Mundur</h2>
                </motion.div>

                <div className="grid grid-cols-4 gap-3 md:gap-6">
                    {units.map(({ label, value }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="skeu-card bg-white/10 backdrop-blur-sm rounded-2xl py-5 px-2 border border-white/20"
                        >
                            <div className="font-serif text-4xl md:text-5xl font-bold text-white skeu-text-emboss">
                                {String(value).padStart(2, "0")}
                            </div>
                            <div className="text-wedding-gold/90 text-xs md:text-sm mt-2 uppercase tracking-widest">{label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CountdownSection;
