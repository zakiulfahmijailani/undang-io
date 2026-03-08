"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, MessageCircle } from "lucide-react";

export interface RsvpMessage {
    name: string;
    attendance: string;
    message: string;
    createdAt: string;
}

interface RsvpSectionProps {
    initialMessages: RsvpMessage[];
}

const attendanceLabels: Record<string, { label: string; emoji: string }> = {
    hadir: { label: "Hadir", emoji: "✅" },
    tidak_hadir: { label: "Tidak Hadir", emoji: "❌" },
    ragu: { label: "Masih Ragu", emoji: "🤔" },
};

const RsvpSection = ({ initialMessages }: RsvpSectionProps) => {
    const [messages, setMessages] = useState<RsvpMessage[]>(initialMessages);
    const [name, setName] = useState("");
    const [attendance, setAttendance] = useState("hadir");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsSubmitting(true);
        // TODO: Send to actual API route
        setTimeout(() => {
            setMessages((prev) => [
                { name, attendance, message, createdAt: new Date().toISOString() },
                ...prev,
            ]);
            setName("");
            setMessage("");
            setIsSubmitting(false);
            alert("Terima kasih atas ucapan dan konfirmasi kehadiran Anda! ✨");
        }, 500);
    };

    return (
        <section id="ucapan" className="py-20 px-6 bg-card">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <p className="font-serif-wedding text-muted-foreground tracking-[0.3em] uppercase text-sm mb-2">
                    Kirim Ucapan
                </p>
                <h2 className="font-vibes text-accent text-4xl md:text-5xl">Wishes & RSVP</h2>
            </motion.div>

            <div className="max-w-lg mx-auto">
                {/* Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-background rounded-2xl p-6 border border-accent/20 shadow-sm mb-8"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="font-serif-wedding text-foreground text-sm mb-1 block">Nama</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nama lengkap"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-input bg-card font-serif-wedding text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <div>
                            <label className="font-serif-wedding text-foreground text-sm mb-1 block">Konfirmasi Kehadiran</label>
                            <select
                                value={attendance}
                                onChange={(e) => setAttendance(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-input bg-card font-serif-wedding text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="hadir">✅ Hadir</option>
                                <option value="tidak_hadir">❌ Tidak Hadir</option>
                                <option value="ragu">🤔 Masih Ragu</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-serif-wedding text-foreground text-sm mb-1 block">Ucapan & Doa</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tulis ucapan dan doa terbaik..."
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-input bg-card font-serif-wedding text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-serif-wedding text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                        </button>
                    </div>
                </motion.form>

                {/* Messages list */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={`${msg.name}-${msg.createdAt}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-background rounded-xl p-4 border border-border"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                    <User className="w-4 h-4 text-accent" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-serif-wedding text-foreground text-sm font-semibold">{msg.name}</p>
                                    <span className="text-xs text-muted-foreground">
                                        {attendanceLabels[msg.attendance]?.emoji} {attendanceLabels[msg.attendance]?.label}
                                    </span>
                                </div>
                            </div>
                            {msg.message && (
                                <p className="font-serif-wedding text-muted-foreground text-sm ml-10 flex items-start gap-1">
                                    <MessageCircle className="w-3 h-3 mt-1 shrink-0 text-accent/50" />
                                    {msg.message}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RsvpSection;
