"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useInvitationTheme } from './ThemeContext';

interface Props { photos: string[]; }

export default function ThemedGallerySection({ photos }: Props) {
  const { theme } = useInvitationTheme();
  const c = theme.colors;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="galeri" className="py-20 px-6" style={{ background: `hsl(${c.surface})` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}>
          Galeri
        </h2>
      </motion.div>
      <div className="relative max-w-3xl mx-auto">
        <div ref={emblaRef} className="overflow-hidden rounded-2xl">
          <div className="flex">
            {photos.map((photo, i) => (
              <div key={i} className="flex-[0_0_80%] min-w-0 px-2 cursor-pointer" onClick={() => setLightboxIndex(i)}>
                <img src={photo} alt={`Galeri ${i + 1}`} className="w-full aspect-[4/3] object-cover rounded-xl" />
              </div>
            ))}
          </div>
        </div>
        <button onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: `hsl(${c.surface} / 0.8)` }}>
          <ChevronLeft className="w-5 h-5" style={{ color: `hsl(${c.textPrimary})` }} />
        </button>
        <button onClick={scrollNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: `hsl(${c.surface} / 0.8)` }}>
          <ChevronRight className="w-5 h-5" style={{ color: `hsl(${c.textPrimary})` }} />
        </button>
      </div>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxIndex(null)}>
            <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxIndex(null)}><X className="w-8 h-8" /></button>
            <img src={photos[lightboxIndex]} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length); }}>
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % photos.length); }}>
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
