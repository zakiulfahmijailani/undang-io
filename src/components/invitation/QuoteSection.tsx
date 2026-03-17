"use client";

import { motion } from "framer-motion";

interface QuoteSectionProps {
    quote: { text: string; source: string };
}

const QuoteSection = ({ quote }: QuoteSectionProps) => {
    return (
        <section className="py-16 px-6 skeu-paper">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto text-center"
            >
                {/* ornamen quote atas */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="h-px w-12 bg-wedding-gold/40" />
                    <span className="text-wedding-gold text-2xl skeu-text-gold">❝</span>
                    <div className="h-px w-12 bg-wedding-gold/40" />
                </div>

                <div className="skeu-inset bg-white/60 rounded-2xl px-8 py-8">
                    <p className="font-serif-wedding text-lg md:text-xl text-stone-700 leading-relaxed italic skeu-text-emboss">
                        {quote.text}
                    </p>
                    <p className="mt-5 text-sm text-wedding-brown/80 font-medium tracking-widest uppercase">
                        — {quote.source}
                    </p>
                </div>

                {/* ornamen quote bawah */}
                <div className="flex items-center justify-center gap-3 mt-8">
                    <div className="h-px w-12 bg-wedding-gold/40" />
                    <span className="text-wedding-gold text-2xl skeu-text-gold">❞</span>
                    <div className="h-px w-12 bg-wedding-gold/40" />
                </div>
            </motion.div>
        </section>
    );
};

export default QuoteSection;
