"use client";

import { motion } from "framer-motion";

interface CoverSectionProps {
    coupleShortName: string;
    coverPhoto: string;
    onOpen: () => void;
}

const CoverSection = ({ coupleShortName, coverPhoto, onOpen }: CoverSectionProps) => {
    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Background — skeu-velvet untuk efek kain mewah */}
            <div
                className="absolute inset-0 bg-cover bg-center skeu-velvet"
                style={{ backgroundImage: `url(${coverPhoto})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-wedding-brown/60 via-wedding-brown/40 to-wedding-brown/70" />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative z-10 text-center px-6"
            >
                <p className="font-serif-wedding text-primary-foreground/80 text-lg tracking-widest uppercase mb-4 skeu-text-emboss">
                    The Wedding of
                </p>
                <h1 className="font-vibes text-6xl md:text-8xl mb-8 drop-shadow-lg skeu-text-gold">
                    {coupleShortName}
                </h1>

                <motion.button
                    onClick={onOpen}
                    className="mt-8 px-8 py-3 rounded-full bg-primary/90 text-primary-foreground font-serif-wedding text-lg tracking-wide backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary transition-all animate-pulse-soft cursor-pointer skeu-raised"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    ✉ Buka Undangan
                </motion.button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2 skeu-inset">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
                </div>
            </motion.div>
        </section>
    );
};

export default CoverSection;
