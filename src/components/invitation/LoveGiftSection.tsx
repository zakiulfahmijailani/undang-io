"use client";

import { motion } from "framer-motion";
import { Copy, CreditCard, Gift, QrCode } from "lucide-react";
// Since useToast doesn't exist yet, we'll gracefully fallback or use an alert
// For now, I'll provide a placeholder alert for copying.

interface BankAccount {
    bank: string;
    number: string;
    name: string;
}

interface LoveGiftSectionProps {
    bankAccounts: BankAccount[];
    giftAddress: string;
}

const LoveGiftSection = ({ bankAccounts, giftAddress }: LoveGiftSectionProps) => {

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} berhasil disalin! ✨`);
    };

    return (
        <section className="py-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <p className="font-serif-wedding text-muted-foreground tracking-[0.3em] uppercase text-sm mb-2">
                    Amplop Digital
                </p>
                <h2 className="font-vibes text-accent text-4xl md:text-5xl">Love Gift</h2>
                <p className="font-serif-wedding text-muted-foreground mt-4 max-w-md mx-auto text-sm">
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, kami menyediakan beberapa opsi berikut.
                </p>
            </motion.div>

            <div className="max-w-lg mx-auto space-y-4">
                {bankAccounts.map((account, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card rounded-xl p-5 border border-accent/20 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <CreditCard className="w-5 h-5 text-accent" />
                            <span className="font-serif-wedding text-foreground font-semibold text-sm">{account.bank}</span>
                        </div>
                        <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-3">
                            <div>
                                <p className="font-mono text-foreground text-lg tracking-wider">{account.number}</p>
                                <p className="font-serif-wedding text-muted-foreground text-xs mt-1">a.n. {account.name}</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(account.number, "Nomor rekening")}
                                className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* QRIS placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-xl p-5 border border-accent/20 shadow-sm text-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <QrCode className="w-5 h-5 text-accent" />
                        <span className="font-serif-wedding text-foreground font-semibold text-sm">QRIS</span>
                    </div>
                    <div className="w-48 h-48 mx-auto bg-muted rounded-xl flex items-center justify-center">
                        <p className="font-serif-wedding text-muted-foreground text-xs">QR Code Placeholder</p>
                    </div>
                </motion.div>

                {/* Gift address */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-xl p-5 border border-accent/20 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <Gift className="w-5 h-5 text-accent" />
                        <span className="font-serif-wedding text-foreground font-semibold text-sm">Kirim Hadiah</span>
                    </div>
                    <p className="font-serif-wedding text-muted-foreground text-sm">{giftAddress}</p>
                    <button
                        onClick={() => copyToClipboard(giftAddress, "Alamat")}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-xs font-serif-wedding hover:bg-accent/20 transition-colors cursor-pointer"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        Salin Alamat
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default LoveGiftSection;
