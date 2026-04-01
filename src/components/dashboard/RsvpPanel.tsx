"use client";

import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface RsvpPanelProps {
    total: number;
    hadir: number;
    tidakHadir: number;
    masihRagu: number;
}

export default function RsvpPanel({ total, hadir, tidakHadir, masihRagu }: RsvpPanelProps) {
    if (total === 0) return null;

    const pctHadir = total > 0 ? Math.round((hadir / total) * 100) : 0;
    const pctTidak = total > 0 ? Math.round((tidakHadir / total) * 100) : 0;
    const pctRagu = total > 0 ? Math.round((masihRagu / total) * 100) : 0;

    const items = [
        {
            label: "Hadir",
            count: hadir,
            pct: pctHadir,
            icon: <CheckCircle2 className="w-5 h-5" />,
            barColor: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-700",
            borderColor: "border-green-200",
        },
        {
            label: "Tidak Hadir",
            count: tidakHadir,
            pct: pctTidak,
            icon: <XCircle className="w-5 h-5" />,
            barColor: "bg-red-400",
            bgColor: "bg-red-50",
            textColor: "text-red-700",
            borderColor: "border-red-200",
        },
        {
            label: "Masih Ragu",
            count: masihRagu,
            pct: pctRagu,
            icon: <HelpCircle className="w-5 h-5" />,
            barColor: "bg-amber-400",
            bgColor: "bg-amber-50",
            textColor: "text-amber-700",
            borderColor: "border-amber-200",
        },
    ];

    return (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-foreground mb-1">Ringkasan Kehadiran</h3>
            <p className="text-sm text-muted-foreground mb-5">
                {total} tamu telah mengonfirmasi.
            </p>

            {/* Visual bar */}
            <div className="flex h-3 rounded-full overflow-hidden bg-secondary mb-6">
                {pctHadir > 0 && (
                    <div
                        className="bg-green-500 transition-all duration-500"
                        style={{ width: `${pctHadir}%` }}
                    />
                )}
                {pctTidak > 0 && (
                    <div
                        className="bg-red-400 transition-all duration-500"
                        style={{ width: `${pctTidak}%` }}
                    />
                )}
                {pctRagu > 0 && (
                    <div
                        className="bg-amber-400 transition-all duration-500"
                        style={{ width: `${pctRagu}%` }}
                    />
                )}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className={`flex items-center gap-3 p-4 rounded-xl border ${item.bgColor} ${item.borderColor}`}
                    >
                        <div className={`${item.textColor}`}>{item.icon}</div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${item.textColor}`}>{item.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.pct}% dari total</p>
                        </div>
                        <div className={`text-2xl font-black tabular-nums ${item.textColor}`}>
                            {item.count}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
