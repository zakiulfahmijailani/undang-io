"use client";

import { motion } from "framer-motion";

interface QuoteSectionProps {
    text: string;
    source: string;
}

const QuoteSection = ({ text, source }: QuoteSectionProps) => {
    return (
        <section className="py-20 px-6 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-b from-card via-muted/30 to-card" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-2xl mx-auto"
            >
                <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-accent/20 shadow-lg">
                    {/* Corner ornaments */}
                    <span className="absolute top-3 left-4 font-vibes text-accent/40 text-5xl">❦</span>
                    <span className="absolute bottom-3 right-4 font-vibes text-accent/40 text-5xl rotate-180">❦</span>

                    <p className="font-serif-wedding italic text-foreground/80 text-lg md:text-xl leading-relaxed text-center px-4 md:px-8">
                        "{text}"
                    </p>
                    <p className="font-serif-wedding text-accent text-center mt-6 text-sm tracking-widest uppercase">
                        — {source}
                    </p>
                </div>
            </motion.div>
        </section>
    );
};

export default QuoteSection;
