"use client"

import { motion } from "framer-motion"
import { CalendarHeart, MapPin, Clock, Navigation } from "lucide-react"

export default function EventSection() {
    return (
        <section className="py-24 px-6 bg-[#FAFAFA] text-center w-full relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-stone-200 rounded-full blur-[100px] opacity-50 translate-y-1/4 -translate-x-1/4"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 max-w-4xl mx-auto"
            >
                <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-emerald-50 rounded-full mb-6">
                    <CalendarHeart className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-700" strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-neutral-800 mb-4">Agenda Bahagia</h2>
                <p className="text-neutral-500 max-w-lg mx-auto mb-16 px-4">
                    Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan rangkaian acara pernikahan kami pada:
                </p>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative px-4">
                    {/* Divider for desktop */}
                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-emerald-200/50 -translate-x-1/2"></div>

                    {/* Akad Nikah */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-neutral-100 relative group hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all"
                    >
                        <h3 className="font-serif text-2xl text-emerald-800 mb-6">Akad Nikah</h3>

                        <div className="space-y-6 text-left">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                                    <CalendarHeart className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-800">Minggu, 17 Agustus 2026</p>
                                    <p className="text-sm text-neutral-500">Bulan Penuh Berkah</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-800">Pukul 08:00 - 10:00 WIB</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-800">Masjid Agung Al-Akbar</p>
                                    <p className="text-sm text-neutral-500 leading-relaxed mt-1">Jl. Masjid Raya No. 1, Kelurahan Bahagia, Kecamatan Damai, Kota Sejahtera.</p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-8 w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                            <Navigation className="w-4 h-4" /> Buka Google Maps
                        </button>
                    </motion.div>

                    {/* Resepsi */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-emerald-900 p-8 sm:p-10 rounded-3xl shadow-xl relative group"
                    >
                        <h3 className="font-serif text-2xl text-white mb-6">Resepsi Pernikahan</h3>

                        <div className="space-y-6 text-left">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-emerald-800 text-emerald-200 rounded-xl shrink-0">
                                    <CalendarHeart className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Minggu, 17 Agustus 2026</p>
                                    <p className="text-sm text-emerald-200/80">Sesi Penuh Tawa</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-emerald-800 text-emerald-200 rounded-xl shrink-0">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Pukul 11:00 - 14:00 WIB</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-emerald-800 text-emerald-200 rounded-xl shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">Grand Ballroom Hotel Mulia</p>
                                    <p className="text-sm text-emerald-200/80 leading-relaxed mt-1">Jl. Jendral Sudirman Kav. 99, Jakarta Pusat. Masuk lewat lobby utama.</p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-8 w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                            <Navigation className="w-4 h-4" /> Buka Google Maps
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}
