"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, User, MessageSquare, Heart, HeartOff } from "lucide-react";

export interface RsvpMessage { id: string; guestName: string; message: string; attendance: "hadir" | "tidak_hadir" | "ragu" | string; createdAt: string; }
interface RsvpSectionProps { invitationId?: string; existingMessages?: RsvpMessage[]; }

const RsvpSection = ({ invitationId, existingMessages = [] }: RsvpSectionProps) => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [attendance, setAttendance] = useState<"hadir" | "tidak_hadir">("hadir");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [messages, setMessages] = useState<RsvpMessage[]>(existingMessages);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setIsSubmitting(true);
        try {
            if (invitationId) {
                const res = await fetch(`/api/invitations/${invitationId}/rsvp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ guestName: name, message, attendance }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(prev => [data.rsvp, ...prev]);
                }
            } else {
                setMessages(prev => [{ id: Date.now().toString(), guestName: name, message, attendance, createdAt: new Date().toISOString() }, ...prev]);
            }
            setIsSubmitted(true);
            setName(""); setMessage("");
        } catch (e) { console.error(e); }
        finally { setIsSubmitting(false); }
    };

    return (
        <section id="rsvp" className="py-20 px-4 skeu-paper">
            <div className="max-w-2xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                    <p className="text-sm uppercase tracking-[0.3em] text-wedding-brown mb-3 skeu-text-emboss">Konfirmasi</p>
                    <h2 className="font-vibes text-5xl md:text-6xl skeu-text-gold">RSVP & Ucapan</h2>
                    <div className="mt-5 flex items-center justify-center gap-3">
                        <div className="h-px w-16 bg-wedding-gold/50" />
                        <MessageSquare className="w-4 h-4 text-wedding-gold" />
                        <div className="h-px w-16 bg-wedding-gold/50" />
                    </div>
                </motion.div>

                {!isSubmitted ? (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onSubmit={handleSubmit}
                        className="skeu-card bg-white rounded-3xl p-7 space-y-5"
                    >
                        <div>
                            <label className="text-xs uppercase tracking-widest text-stone-500 font-medium block mb-2">Nama Tamu</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input
                                    type="text" value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Nama Anda" required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-wedding-gold/40 skeu-inset bg-stone-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-widest text-stone-500 font-medium block mb-2">Kehadiran</label>
                            <div className="grid grid-cols-2 gap-3">
                                {(["hadir", "tidak_hadir"] as const).map(val => (
                                    <button type="button" key={val}
                                        onClick={() => setAttendance(val)}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                                            attendance === val
                                                ? "bg-wedding-gold text-white border-wedding-gold skeu-raised"
                                                : "bg-white text-stone-600 border-stone-200 hover:border-wedding-gold/50"
                                        }`}
                                    >
                                        {val === "hadir" ? <><Heart className="w-4 h-4" />Hadir</> : <><HeartOff className="w-4 h-4" />Tidak Hadir</>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-widest text-stone-500 font-medium block mb-2">Ucapan & Doa</label>
                            <textarea
                                value={message} onChange={e => setMessage(e.target.value)}
                                placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-wedding-gold/40 resize-none skeu-inset bg-stone-50"
                            />
                        </div>

                        <button
                            type="submit" disabled={isSubmitting}
                            className="w-full py-3.5 rounded-xl bg-wedding-gold text-white font-medium flex items-center justify-center gap-2 skeu-raised hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />{isSubmitting ? "Mengirim..." : "Kirim Ucapan"}
                        </button>
                    </motion.form>
                ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="skeu-card bg-white rounded-3xl p-10 text-center">
                        <CheckCircle2 className="w-16 h-16 text-wedding-gold mx-auto mb-4" />
                        <h3 className="font-vibes text-3xl skeu-text-gold mb-2">Terima Kasih!</h3>
                        <p className="text-stone-500 text-sm">Ucapan dan konfirmasi kehadiran Anda telah kami terima.</p>
                    </motion.div>
                )}

                {messages.length > 0 && (
                    <div className="mt-10 space-y-4">
                        <h3 className="text-center font-vibes text-3xl skeu-text-gold mb-6">Ucapan Tamu</h3>
                        {messages.slice(0, 10).map((msg) => (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                className="skeu-card bg-white rounded-2xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-wedding-gold/20 flex items-center justify-center flex-shrink-0 skeu-raised">
                                        <User className="w-4 h-4 text-wedding-gold" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold text-sm text-stone-800">{msg.guestName}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                                msg.attendance === "hadir" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
                                            }`}>
                                                {msg.attendance === "hadir" ? "✓ Hadir" : "Tidak Hadir"}
                                            </span>
                                        </div>
                                        {msg.message && <p className="text-sm text-stone-500 mt-1 leading-relaxed">{msg.message}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default RsvpSection;
