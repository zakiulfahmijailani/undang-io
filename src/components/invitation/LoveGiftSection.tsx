"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Gift, MapPin } from "lucide-react";

interface BankAccount { bank: string; number: string; name: string; }
interface LoveGiftSectionProps {
    bankAccounts: BankAccount[];
    giftAddress?: string;
}

const LoveGiftSection = ({ bankAccounts, giftAddress }: LoveGiftSectionProps) => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(text);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <section id="gift" className="py-20 px-4 skeu-paper">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-wedding-brown mb-3 skeu-text-emboss">Tanda Kasih</p>
                    <h2 className="font-vibes text-5xl md:text-6xl skeu-text-gold">Amplop Digital</h2>
                    <div className="mt-5 flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-wedding-gold/50" />
                        <Gift className="w-4 h-4 text-wedding-gold" />
                        <div className="h-px w-16 bg-wedding-gold/50" />
                    </div>
                    <p className="mt-6 text-sm text-stone-500 max-w-sm mx-auto">Doa restu Anda adalah hadiah terbaik. Namun jika ingin memberikan tanda kasih, berikut informasinya.</p>
                </motion.div>

                <div className="space-y-4">
                    {bankAccounts.map((acc, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="skeu-card bg-white rounded-2xl p-5"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-wedding-brown/70 uppercase tracking-widest skeu-text-emboss">{acc.bank}</p>
                                    <p className="font-mono text-lg font-bold text-stone-800 mt-1">{acc.number}</p>
                                    <p className="text-sm text-stone-500">{acc.name}</p>
                                </div>
                                <button
                                    onClick={() => handleCopy(acc.number)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-wedding-gold text-white text-xs font-medium skeu-raised transition-all"
                                >
                                    {copied === acc.number ? <><Check className="w-3.5 h-3.5" />Tersalin</> : <><Copy className="w-3.5 h-3.5" />Salin</>}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {giftAddress && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-6 skeu-card bg-white rounded-2xl p-5"
                    >
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-wedding-gold mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-wedding-brown/70 uppercase tracking-widest mb-1 skeu-text-emboss">Kirim Hadiah ke</p>
                                <p className="text-sm text-stone-700 leading-relaxed">{giftAddress}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default LoveGiftSection;
