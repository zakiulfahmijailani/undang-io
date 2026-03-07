"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, MessageSquareHeart } from "lucide-react"

export default function MessageSection() {
    const dummyMessages = [
        { id: 1, name: "Tante Rina & Keluarga", relation: "Keluarga", message: "Selamat menempuh hidup baru Andika dan Rania. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.", time: "2 jam yang lalu" },
        { id: 2, name: "Budi Sahabat SMA", relation: "Teman", message: "Happy wedding bro! Sorry banget belum bisa hadir langsung, semoga lancar luncur yaa. Ditunggu kedatangannya balik ke Jakarta 🥳", time: "5 jam yang lalu" },
        { id: 3, name: "Pak RT 05", relation: "Kerabat", message: "Barakallahulakum wa baraka 'alaikum. Doa terbaik untuk kedua mempelai.", time: "1 hari yang lalu" },
    ]

    return (
        <section className="py-24 bg-emerald-900 px-4 sm:px-6 relative w-full overflow-hidden text-center">
            {/* Soft backdrop decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/30 rounded-full blur-[120px] -translate-y-1/2"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                <MessageSquareHeart className="w-12 h-12 text-emerald-400 mx-auto mb-6 opacity-80" strokeWidth={1.5} />
                <h2 className="font-serif text-3xl sm:text-4xl text-white mb-4">Ucapan & Doa</h2>
                <p className="text-emerald-100/70 text-sm sm:text-base mb-12 max-w-lg mx-auto">
                    Kirimkan pesan bahagia dan doa restu untuk kami melalui kolom di bawah ini.
                </p>

                <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl text-left">
                    <form className="flex flex-col gap-4 mb-10">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nama Anda"
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-emerald-100/50 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-colors"
                            />
                            <select className="w-full px-4 py-3 bg-emerald-800/50 border border-white/20 text-emerald-50 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-colors appearance-none">
                                <option value="Keluarga">Keluarga</option>
                                <option value="Teman">Teman</option>
                                <option value="Rekan Kerja">Rekan Kerja</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        <textarea
                            rows={4}
                            placeholder="Tulis ucapan bahagia..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 text-white placeholder-emerald-100/50 rounded-xl focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-colors resize-none"
                        ></textarea>

                        <button
                            type="button"
                            className="w-full md:w-auto md:self-end px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
                        >
                            Kirim Ucapan <Send className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {dummyMessages.map((msg) => (
                            <div key={msg.id} className="bg-emerald-950/50 border border-emerald-800/50 p-5 rounded-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-emerald-50 flex items-center gap-2">
                                        {msg.name}
                                        <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">{msg.relation}</span>
                                    </h4>
                                    <span className="text-xs text-emerald-300/60 hidden sm:block">{msg.time}</span>
                                </div>
                                <p className="text-emerald-100/80 text-sm leading-relaxed">
                                    "{msg.message}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
