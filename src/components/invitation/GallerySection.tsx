"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface GallerySectionProps {
    photos: string[];
}

const GallerySection = ({ photos }: GallerySectionProps) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <section id="galeri" className="py-20 px-6 bg-card">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <p className="font-serif-wedding text-muted-foreground tracking-[0.3em] uppercase text-sm mb-2">
                    Momen Kami
                </p>
                <h2 className="font-vibes text-accent text-4xl md:text-5xl">Gallery</h2>
            </motion.div>

            <div className="max-w-4xl mx-auto relative">
                <div ref={emblaRef} className="overflow-hidden rounded-2xl">
                    <div className="flex">
                        {photos.map((photo, i) => (
                            <div
                                key={i}
                                className="flex-[0_0_85%] md:flex-[0_0_60%] min-w-0 pl-4 first:pl-0"
                            >
                                <img
                                    src={photo}
                                    alt={`Gallery ${i + 1}`}
                                    className="w-full h-64 md:h-96 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setLightboxIndex(i)}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={scrollPrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-md flex items-center justify-center hover:bg-card transition-colors cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-md flex items-center justify-center hover:bg-card transition-colors cursor-pointer"
                >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button
                            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-card/20 flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-colors cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            src={photos[lightboxIndex]}
                            alt="Full view"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/20 flex items-center justify-center text-primary-foreground cursor-pointer hover:bg-card/40 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length); }}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/20 flex items-center justify-center text-primary-foreground cursor-pointer hover:bg-card/40 transition-colors"
                            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % photos.length); }}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GallerySection;
