"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GallerySectionProps {
    photos: string[];
}

const GallerySection = ({ photos }: GallerySectionProps) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + photos.length) % photos.length : null));
    const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % photos.length : null));

    return (
        <section id="gallery" className="py-20 px-4 skeu-paper">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-wedding-brown mb-3 skeu-text-emboss">Momen Berharga</p>
                    <h2 className="font-vibes text-5xl md:text-6xl skeu-text-gold">Galeri Foto</h2>
                    <div className="mt-5 flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-wedding-gold/50" />
                        <span className="text-wedding-gold text-xl skeu-text-gold">✦</span>
                        <div className="h-px w-16 bg-wedding-gold/50" />
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {photos.map((photo, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer skeu-inset"
                            onClick={() => setLightboxIndex(i)}
                        >
                            <Image
                                src={photo}
                                alt={`Gallery ${i + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                                unoptimized
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {lightboxIndex !== null && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <div className="relative max-w-3xl w-full skeu-card rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                                <Image src={photos[lightboxIndex]} alt="Lightbox" width={900} height={600} className="w-full object-contain max-h-[80vh]" unoptimized />
                                <button onClick={() => setLightboxIndex(null)} className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center skeu-raised"><X className="w-4 h-4" /></button>
                                <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center skeu-raised"><ChevronLeft className="w-5 h-5" /></button>
                                <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center skeu-raised"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default GallerySection;
