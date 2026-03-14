"use client";

import { motion } from 'framer-motion';
import { Copy, Gift, MapPin } from 'lucide-react';
import { useInvitationTheme } from './ThemeContext';

interface BankAccount { bank: string; number: string; name: string; }
interface Props { bankAccounts: BankAccount[]; giftAddress: string; }

export default function ThemedLoveGiftSection({ bankAccounts, giftAddress }: Props) {
  const { theme } = useInvitationTheme();
  const c = theme.colors;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section className="py-20 px-6" style={{ background: `hsl(${c.primary} / 0.05)` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl" style={{ fontFamily: `'${theme.typography.headingFont}', cursive`, color: `hsl(${c.accent})` }}>
          Love Gift
        </h2>
        <p className="mt-2 text-sm" style={{ fontFamily: `'${theme.typography.bodyFont}', serif`, color: `hsl(${c.textSecondary})` }}>
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
        </p>
      </motion.div>

      <div className="max-w-md mx-auto space-y-4">
        {bankAccounts.map((acc, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-xl p-5 border" style={{ background: `hsl(${c.surface})`, borderColor: `hsl(${c.accent} / 0.2)` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4" style={{ color: `hsl(${c.accent})` }} />
              <span className="text-sm font-semibold" style={{ color: `hsl(${c.textPrimary})` }}>{acc.bank}</span>
            </div>
            <p className="text-lg font-mono mb-1" style={{ color: `hsl(${c.textPrimary})` }}>{acc.number}</p>
            <p className="text-xs mb-3" style={{ color: `hsl(${c.textSecondary})` }}>a.n. {acc.name}</p>
            <button onClick={() => copy(acc.number)}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border"
              style={{ color: `hsl(${c.primary})`, borderColor: `hsl(${c.primary} / 0.3)` }}
            >
              <Copy className="w-3 h-3" /> Salin
            </button>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-xl p-5 border" style={{ background: `hsl(${c.surface})`, borderColor: `hsl(${c.accent} / 0.2)` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4" style={{ color: `hsl(${c.accent})` }} />
            <span className="text-sm font-semibold" style={{ color: `hsl(${c.textPrimary})` }}>Kirim Hadiah</span>
          </div>
          <p className="text-sm mb-3" style={{ color: `hsl(${c.textSecondary})` }}>{giftAddress}</p>
          <button onClick={() => copy(giftAddress)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border"
            style={{ color: `hsl(${c.primary})`, borderColor: `hsl(${c.primary} / 0.3)` }}
          >
            <Copy className="w-3 h-3" /> Salin Alamat
          </button>
        </motion.div>
      </div>
    </section>
  );
}
