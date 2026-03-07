"use client"

import { motion } from "framer-motion"

export default function GallerySection() {
    const images = [
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1623087094056-b7ff83af8f13?q=80&w=1970&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
    ];

    return (
        <section className="py-24 bg-white px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto text-center"
            >
                <h2 className="font-serif text-3xl sm:text-4xl text-neutral-800 mb-4 cursor-default">Potret Kebahagiaan</h2>
                <p className="text-neutral-500 max-w-lg mx-auto mb-12 sm:mb-16 text-sm sm:text-base px-2">
                    Mengabadikan detik demi detik perjalanan cinta kami hingga sampai pada hari kebahagiaan ini.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className={`rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer border border-neutral-100/50 shadow-sm
                                ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-auto" : "aspect-[4/5]"}
                            `}
                        >
                            <img
                                src={img}
                                alt={`Gallery Photo ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
