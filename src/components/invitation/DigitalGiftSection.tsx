"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Copy, CheckCircle2, QrCode } from "lucide-react"

export default function DigitalGiftSection() {
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedStates({ ...copiedStates, [text]: true })
        setTimeout(() => {
            setCopiedStates({ ...copiedStates, [text]: false })
        }, 2000)
    }

    return (
        <section className="py-24 bg-white px-4 sm:px-6 relative w-full overflow-hidden text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto"
            >
                <div className="inline-flex items-center justify-center p-4 sm:p-5 bg-rose-50 rounded-full mb-6">
                    <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" strokeWidth={1.5} />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl text-neutral-800 mb-4">Tanda Kasih</h2>
                <p className="text-neutral-500 text-sm sm:text-base max-w-lg mx-auto mb-16">
                    Kehadiran serta doa restu Anda adalah hadiah terindah bagi kami. Bagi Anda yang ingin memberikan tanda kasih untuk kami, dapat melalui:
                </p>

                <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* QRIS / E-Wallet Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100 flex flex-col items-center justify-center space-y-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2 text-neutral-800 font-bold font-sans">
                            <QrCode className="w-5 h-5 text-blue-600" /> E-Wallet / QRIS
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center max-w-[200px] aspect-square w-full">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="Gopay QR" className="opacity-90 mix-blend-multiply w-full h-full object-contain" />
                        </div>
                        <div className="text-center mt-2">
                            <p className="font-bold text-neutral-800 text-lg tracking-widest">0812-3456-7890</p>
                            <p className="text-sm text-neutral-500">a/n Rania Jelita (Gopay/OVO)</p>
                        </div>
                        <button
                            onClick={() => handleCopy("081234567890")}
                            className="mt-2 text-xs font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-full flex items-center gap-1.5 transition-colors"
                        >
                            {copiedStates["081234567890"] ? <><CheckCircle2 className="w-3.5 h-3.5" /> Tersalin</> : <><Copy className="w-3.5 h-3.5" /> Salin Nomor</>}
                        </button>
                    </motion.div>

                    {/* Bank Transfer Cards Stack */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100 text-left shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold text-blue-800 text-lg mb-4 flex items-center justify-between">
                                BANK BCA
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Bank_Central_Asia.svg/1200px-Bank_Central_Asia.svg.png" className="h-4 object-contain" alt="BCA" />
                            </h3>
                            <div className="text-center bg-white p-4 rounded-2xl border border-neutral-100">
                                <p className="font-mono text-2xl font-semibold tracking-wider text-neutral-800 mb-1">1234-567-890</p>
                                <p className="text-sm text-neutral-500">a/n Andika Putra</p>
                            </div>
                            <button
                                onClick={() => handleCopy("1234567890")}
                                className="mt-4 w-full text-sm font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-100 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                {copiedStates["1234567890"] ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Nomor Tersalin</> : <><Copy className="w-4 h-4" /> Salin Rekening</>}
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100 text-left shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="font-bold text-orange-600 text-lg mb-4 flex items-center justify-between">
                                BANK BNI
                                <img src="https://upload.wikimedia.org/wikipedia/id/thumb/5/55/BNI_logo.svg/1200px-BNI_logo.svg.png" className="h-4 object-contain" alt="BNI" />
                            </h3>
                            <div className="text-center bg-white p-4 rounded-2xl border border-neutral-100">
                                <p className="font-mono text-2xl font-semibold tracking-wider text-neutral-800 mb-1">0987-654-321</p>
                                <p className="text-sm text-neutral-500">a/n Rania Jelita</p>
                            </div>
                            <button
                                onClick={() => handleCopy("0987654321")}
                                className="mt-4 w-full text-sm font-semibold text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-100 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                {copiedStates["0987654321"] ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Nomor Tersalin</> : <><Copy className="w-4 h-4" /> Salin Rekening</>}
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
