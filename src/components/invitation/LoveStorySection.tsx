"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface LoveStorySectionProps {
    stories: Array<{ year: string; title: string; description: string }>;
}

const LoveStorySection = ({ stories }: LoveStorySectionProps) => (
    <section id="lovestory" className="py-20 px-4 skeu-paper">
        <div className="max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-14"
            >
                <p className="text-sm uppercase tracking-[0.3em] text-wedding-brown mb-3 skeu-text-emboss">Perjalanan Cinta</p>
                <h2 className="font-vibes text-5xl md:text-6xl skeu-text-gold">Kisah Kita</h2>
                <div className="mt-5 flex items-center justify-center gap-3">
                    <div className="h-px w-16 bg-wedding-gold/50" />
                    <Heart className="w-4 h-4 text-wedding-gold fill-wedding-gold" />
                    <div className="h-px w-16 bg-wedding-gold/50" />
                </div>
            </motion.div>

            <div className="relative">
                {/* vertical line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-wedding-gold/25" />

                {stories.map((story, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={`relative flex mb-12 ${
                            i % 2 === 0 ? "justify-start pr-8 md:pr-1/2" : "justify-end pl-8 md:pl-1/2"
                        }`}
                    >
                        {/* dot on timeline */}
                        <div className="absolute left-1/2 top-5 -translate-x-1/2 w-4 h-4 rounded-full bg-wedding-gold skeu-raised z-10" />

                        <div className={`skeu-card bg-white rounded-2xl p-5 max-w-xs ${
                            i % 2 === 0 ? "text-right" : "text-left"
                        }`}>
                            <span className="text-xs font-bold text-wedding-gold tracking-widest uppercase">{story.year}</span>
                            <h4 className="font-serif font-bold text-stone-800 mt-1 mb-2">{story.title}</h4>
                            <p className="text-sm text-stone-500 leading-relaxed">{story.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export default LoveStorySection;
