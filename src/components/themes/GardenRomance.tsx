"use client"
import { useEffect, useState } from "react"
import { RSVPForm } from "../invitation/RSVPForm"
import { Guestbook } from "../invitation/Guestbook"
import { MapPin, Calendar, Clock, Copy, Gift, MoveRight } from "lucide-react"

// Garden Romance Theme logic
export default function GardenRomance({ content, invitationId }: { content: any, invitationId: string }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Garden Romance variables
    const themeVars = {
        "--theme-bg": "#F8FAF5",
        "--theme-bg-alt": "#EEF4E8",
        "--theme-primary": "#4E7D42", // Forest Green
        "--theme-text": "#1F361A",
        "--theme-text-muted": "#5A7352",
        "--theme-border": "#C0D4B3",
        "--theme-accent": "#E0707A", // Dusty Rose
    } as React.CSSProperties

    return (
        <div
            className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] font-body mx-auto max-w-md md:max-w-2xl shadow-2xl relative overflow-hidden"
            style={themeVars}
        >
            {/* Decorative Leaves Top */}
            <div className="absolute top-0 left-0 w-full h-[120px] bg-[var(--theme-primary)] opacity-10 rounded-b-full"></div>

            {/* Hero Section */}
            <section className="min-h-[80vh] relative flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-1000">
                <div className="z-10 flex flex-col items-center justify-center gap-6 bg-white/40 p-10 rounded-[3rem] border border-[var(--theme-border)] backdrop-blur-sm m-4 w-full">
                    <p className="text-overline tracking-widest text-[var(--theme-primary)]">THE WEDDING OF</p>
                    <h1 className="text-display-lg md:text-display-xl font-display text-[var(--theme-primary)] mt-4">
                        {content.groom_nickname} <br />
                        <span className="text-h2 md:text-h1 block my-4 text-[var(--theme-accent)]">&</span>
                        {content.bride_nickname}
                    </h1>
                    <p className="text-h4 font-display italic text-[var(--theme-text-muted)] mt-4">
                        {new Date(content.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Greeting Section */}
            <section className="py-20 px-8 bg-[var(--theme-bg-alt)] text-center relative border-y border-[var(--theme-primary)] border-opacity-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-both">
                <h2 className="text-h2 font-display mb-6 text-[var(--theme-primary)]">Assalamualaikum</h2>
                <p className="text-body-md text-[var(--theme-text-muted)] max-w-lg mx-auto leading-relaxed whitespace-pre-line bg-white/60 p-6 rounded-2xl shadow-sm">
                    {content.greeting_text}
                </p>
            </section>

            {/* Event Details */}
            <section className="py-20 px-8 text-center bg-[var(--theme-bg)] relative animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 fill-mode-both">
                <h2 className="text-h2 font-display mb-12 text-[var(--theme-primary)]">Rangkaian Acara</h2>
                <div className="border border-[var(--theme-border)] rounded-[2rem] p-8 max-w-md mx-auto relative overflow-hidden bg-white shadow-md">
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <h3 className="text-h3 font-display font-bold text-[var(--theme-primary)]">Resepsi Pernikahan</h3>
                        <div className="flex items-center gap-2 text-body-md text-[var(--theme-text-muted)] mt-2">
                            <Calendar className="w-5 h-5 text-[var(--theme-accent)]" />
                            <span>{new Date(content.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-body-md text-[var(--theme-text-muted)]">
                            <Clock className="w-5 h-5 text-[var(--theme-accent)]" />
                            <span>{content.event_time}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 mt-6 text-[var(--theme-text-muted)] border-t border-[var(--theme-border)] pt-6 w-full">
                            <MapPin className="w-6 h-6 text-[var(--theme-accent)] mb-2" />
                            <span className="font-semibold text-[var(--theme-text)] text-h4 font-display">{content.venue_name}</span>
                            <span className="text-body-sm px-4 mt-2">{content.venue_address}</span>
                        </div>
                    </div>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-body text-body-sm transition-all duration-200 outline-none w-full bg-[var(--theme-primary)] text-white h-12 px-6 hover:opacity-90 shadow-lg">
                        Petunjuk Ke Lokasi
                    </a>
                </div>
            </section>

            {/* RSVP & Guestbook */}
            <section className="py-20 px-8 bg-[var(--theme-bg-alt)] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
                <div className="max-w-md mx-auto flex flex-col gap-16">
                    <div className="text-center">
                        <h2 className="text-h2 font-display mb-8 text-[var(--theme-primary)]">Konfirmasi Kehadiran</h2>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[var(--theme-border)] text-left">
                            <RSVPForm invitationId={invitationId} />
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-h2 font-display mb-8 text-[var(--theme-primary)]">Buku Tamu</h2>
                        <div className="text-left bg-white p-2 rounded-3xl shadow-sm border border-[var(--theme-border)]">
                            <Guestbook invitationId={invitationId} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Digital Envelope */}
            <section className="py-20 px-8 text-center bg-[var(--theme-bg)] border-t border-[var(--theme-border)] animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700 fill-mode-both">
                <h2 className="text-h2 font-display mb-6 text-[var(--theme-primary)] flex items-center justify-center gap-3">
                    <Gift className="w-8 h-8 text-[var(--theme-accent)]" /> Tanda Kasih
                </h2>
                <p className="text-body-md text-[var(--theme-text-muted)] max-w-sm mx-auto mb-10">
                    Doa Restu Anda adalah karunia terindah bagi kami. Namun jika memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
                </p>

                <div className="max-w-xs mx-auto flex flex-col gap-6">
                    {content.bank_accounts?.map((acc: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border-2 border-[var(--theme-border)] flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                            <div className="text-caption font-bold tracking-wider text-[var(--theme-primary)] bg-[var(--theme-bg-alt)] py-1 px-4 rounded-full">{acc.bank}</div>
                            <div className="text-h3 font-mono font-bold tracking-widest text-[var(--theme-text)] mt-2">{acc.account_number}</div>
                            <div className="text-body-sm text-[var(--theme-text-muted)] mt-1">a/n {acc.account_name}</div>

                            <button className="mt-4 flex items-center justify-center gap-2 text-[var(--theme-primary)] hover:bg-[var(--theme-bg-alt)] transition-colors text-body-sm font-semibold w-full border border-[var(--theme-primary)] p-2 rounded-full" onClick={() => navigator.clipboard.writeText(acc.account_number)}>
                                <Copy className="w-4 h-4" /> Salin Nomor Rekening
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 bg-[var(--theme-primary)] text-white text-center text-caption flex flex-col items-center gap-2 px-8">
                <p className="opacity-90 max-w-xs leading-relaxed">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
                <h3 className="text-h2 font-display mt-6 mb-8 text-[var(--theme-bg)]">{content.groom_nickname} & {content.bride_nickname}</h3>
                <div className="w-12 h-1 bg-[var(--theme-accent)] my-2 rounded-full"></div>
                <p className="opacity-70 mt-6">Made with &hearts; by NikahKu</p>
            </footer>
        </div>
    )
}
