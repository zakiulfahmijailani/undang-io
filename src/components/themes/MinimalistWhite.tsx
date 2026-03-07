"use client"
import { useEffect, useState } from "react"
import { RSVPForm } from "../invitation/RSVPForm"
import { Guestbook } from "../invitation/Guestbook"
import { MapPin, Calendar, Clock, Copy, Gift, MoveRight } from "lucide-react"

// Clean Minimalist Theme logic
export default function MinimalistWhite({ content, invitationId }: { content: any, invitationId: string }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Ensure variables exist
    const themeVars = {
        "--theme-bg": "#FFFFFF",
        "--theme-bg-alt": "#FAFAF9",
        "--theme-primary": "#D4A91C", // Champagne Gold
        "--theme-text": "#211E1A",
        "--theme-text-muted": "#7A7169",
        "--theme-border": "#E8E5E1",
        "--theme-accent": "#D4A91C",
    } as React.CSSProperties

    return (
        <div
            className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-body mx-auto max-w-md md:max-w-2xl shadow-2xl relative overflow-hidden"
            style={themeVars}
        >
            {/* Hero Section */}
            <section className="h-screen relative flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[var(--theme-bg-alt)] to-[var(--theme-bg)]" />
                <div className="z-10 flex flex-col items-center justify-center gap-6">
                    <p className="text-overline tracking-widest text-[var(--theme-text-muted)]">THE WEDDING OF</p>
                    <h1 className="text-display-lg md:text-display-xl font-display text-[var(--theme-primary)] mt-4">
                        {content.groom_nickname} <br />
                        <span className="text-h2 md:text-h1 block my-2">&</span>
                        {content.bride_nickname}
                    </h1>
                    <div className="w-16 h-[1px] bg-[var(--theme-primary)] my-6"></div>
                    <p className="text-h4 font-display italic text-[var(--theme-text-muted)]">
                        {new Date(content.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="absolute bottom-10 animate-bounce text-[var(--theme-primary)]">
                    <MoveRight className="w-6 h-6 rotate-90" />
                </div>
            </section>

            {/* Greeting Section */}
            <section className="py-20 px-8 bg-[var(--theme-bg-alt)] text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-both">
                <h2 className="text-h2 font-display mb-6">Om Swastyastu</h2>
                <p className="text-body-md text-[var(--theme-text-muted)] max-w-lg mx-auto leading-relaxed whitespace-pre-line">
                    {content.greeting_text}
                </p>
                <div className="mt-12 mb-8 flex flex-col items-center gap-8">
                    <div className="flex flex-col items-center">
                        <h3 className="text-h3 font-display font-bold text-[var(--theme-primary)]">{content.groom_name}</h3>
                        <p className="text-caption text-[var(--theme-text-muted)] mt-1 whitespace-pre-line">Putra dari\n{content.groom_parents}</p>
                    </div>
                    <span className="text-h2 font-display text-[var(--theme-primary)]">&</span>
                    <div className="flex flex-col items-center">
                        <h3 className="text-h3 font-display font-bold text-[var(--theme-primary)]">{content.bride_name}</h3>
                        <p className="text-caption text-[var(--theme-text-muted)] mt-1 whitespace-pre-line">Putri dari\n{content.bride_parents}</p>
                    </div>
                </div>
            </section>

            {/* Event Details */}
            <section className="py-20 px-8 text-center bg-[var(--theme-bg)] relative animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
                <h2 className="text-h2 font-display mb-12 text-[var(--theme-primary)]">Jadwal Acara</h2>
                <div className="border border-[var(--theme-border)] rounded-2xl p-8 max-w-md mx-auto relative overflow-hidden bg-[var(--theme-bg-alt)] shadow-sm">
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <h3 className="text-h3 font-display font-bold">Resepsi Pernikahan</h3>
                        <div className="flex items-center gap-2 text-body-md text-[var(--theme-text-muted)]">
                            <Calendar className="w-5 h-5 text-[var(--theme-primary)]" />
                            <span>{new Date(content.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-body-md text-[var(--theme-text-muted)]">
                            <Clock className="w-5 h-5 text-[var(--theme-primary)]" />
                            <span>{content.event_time}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 mt-4 text-[var(--theme-text-muted)]">
                            <MapPin className="w-6 h-6 text-[var(--theme-primary)] mb-2" />
                            <span className="font-semibold text-[var(--theme-text)]">{content.venue_name}</span>
                            <span className="text-body-sm px-4">{content.venue_address}</span>
                        </div>
                    </div>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-body text-body-sm transition-all duration-200 outline-none w-full bg-[var(--theme-primary)] text-[var(--theme-bg)] h-12 px-6 hover:opacity-90 active:scale-95 shadow-lg">
                        Buka Google Maps
                    </a>
                </div>
            </section>

            {/* RSVP & Guestbook */}
            <section className="py-20 px-8 bg-[var(--theme-bg-alt)] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
                <div className="max-w-md mx-auto flex flex-col gap-16">
                    <div className="text-center">
                        <h2 className="text-h2 font-display mb-8 text-[var(--theme-primary)]">Konfirmasi Kehadiran</h2>
                        <div className="bg-[var(--theme-bg)] p-6 rounded-xl shadow-sm border border-[var(--theme-border)] text-left">
                            <RSVPForm invitationId={invitationId} />
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-h2 font-display mb-8 text-[var(--theme-primary)]">Buku Tamu</h2>
                        <div className="text-left">
                            <Guestbook invitationId={invitationId} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Digital Envelope */}
            <section className="py-20 px-8 text-center bg-[var(--theme-bg)] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 fill-mode-both">
                <h2 className="text-h2 font-display mb-6 text-[var(--theme-primary)] flex items-center justify-center gap-3">
                    <Gift className="w-8 h-8" /> Amplop Digital
                </h2>
                <p className="text-body-md text-[var(--theme-text-muted)] max-w-sm mx-auto mb-10">
                    Doa Restu Anda adalah karunia terindah bagi kami. Namun jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
                </p>

                <div className="max-w-xs mx-auto flex flex-col gap-6">
                    {content.bank_accounts?.map((acc: any, i: number) => (
                        <div key={i} className="bg-[var(--theme-bg-alt)] p-6 rounded-xl shadow-sm border border-[var(--theme-border)] flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                            <div className="text-caption font-bold tracking-wider text-[var(--theme-text-muted)]">{acc.bank}</div>
                            <div className="text-h3 font-mono font-bold tracking-widest">{acc.account_number}</div>
                            <div className="text-body-sm text-[var(--theme-text-muted)] mt-1">a/n {acc.account_name}</div>

                            <button className="mt-4 flex items-center justify-center gap-2 text-[var(--theme-primary)] hover:text-opacity-80 transition-colors text-body-sm font-semibold w-full border border-[var(--theme-primary)] p-2 rounded-lg" onClick={() => navigator.clipboard.writeText(acc.account_number)}>
                                <Copy className="w-4 h-4" /> Salin Nomor
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-[var(--color-surface-footer)] text-[var(--color-neutral-300)] text-center text-caption flex flex-col items-center gap-2">
                <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
                <h3 className="text-h3 font-display mt-4 mb-6">{content.groom_nickname} & {content.bride_nickname}</h3>
                <div className="w-24 h-[1px] bg-[var(--color-neutral-700)] my-2"></div>
                <p>Made with &hearts; by NikahKu</p>
            </footer>
        </div>
    )
}
