"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, MailOpen } from "lucide-react"

export default function HeroSection({ onOpen }: { onOpen?: () => void }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => {
        setIsOpen(true)
        if (onOpen) onOpen()
    }

    return (
        <section className="relative w-full h-[100svh] overflow-hidden bg-emerald-950 flex items-center justify-center">
            {/* Background Image Wrapper */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
                    alt="Wedding Couple"
                    className="w-full h-full object-cover object-center scale-105 animate-slow-zoom"
                />
            </div>

            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full h-full bg-emerald-950/40 backdrop-blur-sm"
                    >
                        <p className="text-emerald-100 uppercase tracking-[0.3em] text-sm mb-6">Undangan Pernikahan</p>
                        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-4 DropShadow-lg">
                            Andika <span className="text-emerald-300 mx-2">&</span> Rania
                        </h1>
                        <p className="text-emerald-50 text-lg md:text-xl mb-12 font-light tracking-wide">
                            Minggu, 17 Agustus 2026
                        </p>

                        <div className="text-emerald-100 text-sm mb-6">Yth. Bapak/Ibu/Saudara/i</div>
                        <div className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md mb-8 max-w-xs w-full">
                            <h2 className="text-white font-bold text-lg">Tamu Undangan Pribadi</h2>
                        </div>

                        <button
                            onClick={handleOpen}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-4 rounded-full flex items-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(5,150,105,0.4)]"
                        >
                            <MailOpen className="w-5 h-5" /> Buka Undangan
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content once opened */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-20"
                    >
                        <p className="text-emerald-100 uppercase tracking-[0.2em] text-sm mb-4">Maha Suci Allah</p>
                        <p className="text-white/80 max-w-md mx-auto text-sm md:text-base leading-relaxed mb-8">
                            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya." <br /> (QS. Ar-Rum: 21)
                        </p>

                        <div className="flex items-center gap-6 md:gap-12 mt-4">
                            <div className="text-center">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-emerald-300 mb-4 mx-auto p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop" className="w-full h-full object-cover" alt="Groom" />
                                    </div>
                                </div>
                                <h3 className="font-serif text-2xl text-white">Andika Putra</h3>
                                <p className="text-emerald-200/80 text-xs mt-1">Putra dari Bpk. Budi & Ibu Ani</p>
                            </div>

                            <Heart className="w-8 h-8 text-emerald-400 animate-pulse mt-[-40px]" />

                            <div className="text-center">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-emerald-300 mb-4 mx-auto p-1">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop" className="w-full h-full object-cover" alt="Bride" />
                                    </div>
                                </div>
                                <h3 className="font-serif text-2xl text-white">Rania Jelita</h3>
                                <p className="text-emerald-200/80 text-xs mt-1">Putri dari Bpk. Joko & Ibu Siti</p>
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-70">
                            <span className="text-white text-xs tracking-widest uppercase mb-2">Gulir ke Bawah</span>
                            <div className="w-[1px] h-8 bg-emerald-400"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s ease-in-out infinite alternate;
                }
            `}</style>
        </section>
    )
}
