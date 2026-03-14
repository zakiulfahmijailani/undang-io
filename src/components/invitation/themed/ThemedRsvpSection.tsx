"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, User, MessageCircle } from 'lucide-react';
import { useInvitationTheme } from './ThemeContext';

interface RsvpMessage { name: string; attendance: string; message: string; createdAt: string; }
interface Props { initialMessages: RsvpMessage[]; }

const attendanceLabels: Record<string, { label: string; emoji: string }> = {
  hadir: { label: 'Hadir', emoji: '✅' },
  tidak_hadir: { label: 'Tidak Hadir', emoji: '❌' },
  ragu: { label: 'Masih Ragu', emoji: '🤔' },
};

export default function ThemedRsvpSection({ initialMessages }: Props) {
  const { theme } = useInvitationTheme();
  const c = theme.colors;
  const [messages, setMessages] = useState<RsvpMessage[]>(initialMessages);
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('hadir');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setMessages((prev) => [{ name, attendance, message, createdAt: new Date().toISOString() }, ...prev]);
      setName(''); setMessage(''); setIsSubmitting(false);
    }, 500);
  };

  const inputStyle = {
    background: `hsl(${c.surface})`,
    color: `hsl(${c.textPrimary})`,
    borderColor: `hsl(${c.accent} / 0.2)`,
    fontFamily: `'${theme.typography.bodyFont}', serif`,
  };

  return (
    <section id="ucapan" className="py-20 px-6" style={{ background: `hsl(${c.surface})` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}>
          Wishes &amp; RSVP
        </h2>
      </motion.div>
      <div className="max-w-lg mx-auto">
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl p-6 border mb-8" style={{ background: `hsl(${c.primary} / 0.05)`, borderColor: `hsl(${c.accent} / 0.2)` }}
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm mb-1 block" style={{ color: `hsl(${c.textPrimary})`, fontFamily: `'${theme.typography.bodyFont}', serif` }}>Nama</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2" style={inputStyle}
              />
            </div>
            <div>
              <label className="text-sm mb-1 block" style={{ color: `hsl(${c.textPrimary})`, fontFamily: `'${theme.typography.bodyFont}', serif` }}>Konfirmasi Kehadiran</label>
              <select value={attendance} onChange={(e) => setAttendance(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2" style={inputStyle}
              >
                <option value="hadir">✅ Hadir</option>
                <option value="tidak_hadir">❌ Tidak Hadir</option>
                <option value="ragu">🤔 Masih Ragu</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block" style={{ color: `hsl(${c.textPrimary})`, fontFamily: `'${theme.typography.bodyFont}', serif` }}>Ucapan &amp; Doa</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis ucapan..." rows={3}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 resize-none" style={inputStyle}
              />
            </div>
            <button type="submit" disabled={isSubmitting || !name.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm disabled:opacity-50 transition-colors"
              style={{ background: `hsl(${c.primary})`, color: `hsl(${c.surface})`, fontFamily: `'${theme.typography.bodyFont}', serif` }}
            >
              <Send className="w-4 h-4" /> {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </div>
        </motion.form>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {messages.map((msg, i) => (
            <motion.div key={`${msg.name}-${msg.createdAt}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl p-4 border" style={{ background: `hsl(${c.surface})`, borderColor: `hsl(${c.accent} / 0.15)` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `hsl(${c.accent} / 0.2)` }}>
                  <User className="w-4 h-4" style={{ color: `hsl(${c.accent})` }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: `hsl(${c.textPrimary})` }}>{msg.name}</p>
                  <span className="text-xs" style={{ color: `hsl(${c.textSecondary})` }}>{attendanceLabels[msg.attendance]?.emoji} {attendanceLabels[msg.attendance]?.label}</span>
                </div>
              </div>
              {msg.message && (
                <p className="text-sm ml-10 flex items-start gap-1" style={{ color: `hsl(${c.textSecondary})` }}>
                  <MessageCircle className="w-3 h-3 mt-1 shrink-0" style={{ color: `hsl(${c.accent} / 0.5)` }} />
                  {msg.message}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
