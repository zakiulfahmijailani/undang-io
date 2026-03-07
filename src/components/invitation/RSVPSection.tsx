"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, UserPlus, Users } from "lucide-react"

export default function RSVPSection() {
    const [status, setStatus] = useState<"idle" | "success">("idle")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("success")
        setTimeout(() => setStatus("idle"), 3000)
    }

    return (
        <section className="py-24 bg-[#FAFAFA] px-4 sm:px-6 relative w-full overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-xl mx-auto"
            >
                <div className="text-center mb-10">
                    <h2 className="font-serif text-3xl sm:text-4xl text-emerald-900 mb-4">Konfirmasi Kehadiran</h2>
                    <p className="text-neutral-500 text-sm sm:text-base">
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors outline-none"
                                placeholder="Cth: Budi Santoso"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Konfirmasi Kehadiran</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center justify-center gap-2 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-500 has-[:checked]:text-emerald-700">
                                    <input type="radio" name="attendance" value="hadir" className="w-4 h-4 text-emerald-600 accent-emerald-600" required />
                                    <span className="text-sm font-medium">Hadir</span>
                                </label>
                                <label className="flex items-center justify-center gap-2 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-red-50/50 transition-colors has-[:checked]:bg-red-50 has-[:checked]:border-red-500 has-[:checked]:text-red-700">
                                    <input type="radio" name="attendance" value="tidak" className="w-4 h-4 text-red-600 accent-red-600" required />
                                    <span className="text-sm font-medium">Tidak Hadir</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Jumlah Tamu</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <select className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors outline-none appearance-none bg-white">
                                    <option value="1">1 Orang</option>
                                    <option value="2">2 Orang</option>
                                    <option value="3">3 Orang</option>
                                    <option value="4">4 Orang</option>
                                    <option value="5">5 Orang</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "success"}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                        >
                            {status === "success" ? (
                                <><CheckCircle2 className="w-5 h-5" /> Terkirim</>
                            ) : (
                                <><UserPlus className="w-5 h-5" /> Kirim Konfirmasi</>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </section>
    )
}
