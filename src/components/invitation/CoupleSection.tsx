"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CoupleSectionProps {
    groom: { fullName: string; father: string; mother: string; photo: string; instagram?: string };
    bride: { fullName: string; father: string; mother: string; photo?: string; instagram?: string };
}

const CoupleSection = ({ groom, bride }: CoupleSectionProps) => {
    return (
        <section id="couple" className="py-20 px-4 skeu-paper">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-wedding-brown mb-3 skeu-text-emboss">Mempelai</p>
                    <h2 className="font-vibes text-5xl md:text-6xl skeu-text-gold">Dua Insan Bersatu</h2>
                    {/* ornamen divider */}
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-wedding-gold/50" />
                        <span className="text-wedding-gold text-xl">✦</span>
                        <div className="h-px w-16 bg-wedding-gold/50" />
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    {[{ person: groom, label: "Mempelai Pria" }, { person: bride, label: "Mempelai Wanita" }].map(({ person, label }, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            className="text-center"
                        >
                            {person.photo && (
                                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden skeu-inset border-4 border-wedding-gold/30">
                                    <Image
                                        src={person.photo}
                                        alt={person.fullName}
                                        width={192}
                                        height={192}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                    />
                                </div>
                            )}
                            <p className="text-xs uppercase tracking-[0.2em] text-wedding-brown/70 mb-2 skeu-text-emboss">{label}</p>
                            <h3 className="font-vibes text-4xl mb-3 skeu-text-gold">{person.fullName}</h3>
                            <p className="text-sm text-stone-600">
                                Putra/i dari {person.father} &amp; {person.mother}
                            </p>
                            {person.instagram && (
                                <a href={`https://instagram.com/${person.instagram.replace('@','')}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-block mt-3 text-xs text-wedding-brown/70 hover:text-wedding-brown transition-colors">
                                    {person.instagram}
                                </a>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoupleSection;
