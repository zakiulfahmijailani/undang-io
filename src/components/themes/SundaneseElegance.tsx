import { Calendar, MapPin, Gift, Heart } from "lucide-react"
import { RSVPForm } from "../invitation/RSVPForm"
import { Guestbook } from "../invitation/Guestbook"

interface ThemeProps {
    content: any
    invitationId: string
}

export default function SundaneseElegance({ content, invitationId }: ThemeProps) {
    // Elegant maroon, cream, and subtle gold theme
    const eventDate = new Date(content.event_date || Date.now())

    return (
        <div className="bg-[#FFFDF9] min-h-screen text-[#4A2C2A] font-serif selection:bg-[#7D2731] selection:text-[#FFFDF9]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap');
                h1, .script-font { font-family: 'Pinyon Script', cursive; }
                h2, h3, h4, h5, h6, p, span, div { font-family: 'PT Serif', serif; }
            `}</style>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center p-6 border-[8px] border-double border-[#7D2731]/30 m-4 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-[#7D2731]/5 to-transparent"></div>

                {/* Gunungan / Megamendung subtle background abstract */}
                <div className="absolute inset-x-0 bottom-0 h-[300px] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/floral-motif.png')] pointer-events-none"></div>

                <div className="z-10 bg-[#FFFDF9]/80 backdrop-blur-md p-10 rounded-2xl border border-[#7D2731]/20 shadow-2xl shadow-[#7D2731]/10 max-w-2xl w-full">
                    <p className="text-[#C5A365] tracking-widest text-sm mb-6 uppercase">Walimatul Ursy</p>
                    <h1 className="text-7xl md:text-8xl text-[#7D2731] leading-tight mb-2">
                        {content.groom_nickname}
                    </h1>
                    <span className="text-2xl text-[#C5A365] italic tracking-widest my-2 block">dengan</span>
                    <h1 className="text-7xl md:text-8xl text-[#7D2731] leading-tight mt-2 mb-8">
                        {content.bride_nickname}
                    </h1>
                    <div className="w-16 h-[2px] bg-[#C5A365]/60 mx-auto my-6"></div>
                    <p className="text-[#4A2C2A] text-lg">
                        {eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Mukadimah */}
            <section className="py-24 px-6 max-w-3xl mx-auto text-center relative">
                <Heart className="w-8 h-8 text-[#7D2731]/40 mx-auto mb-8 absolute -top-4 left-1/2 -translate-x-1/2" />
                <p className="text-lg md:text-xl leading-relaxed text-[#4A2C2A]/90 italic px-4 py-8 border-y border-[#7D2731]/10">
                    "{content.greeting_text || "Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Ya Allah perkenankanlah kami merangkaikan kasih sayang yang Kau ciptakan di antara putra-putri kami."}"
                </p>

                <div className="grid md:grid-cols-2 gap-16 mt-20">
                    <div>
                        <h3 className="text-4xl text-[#7D2731] font-bold mb-4">{content.groom_name}</h3>
                        <p className="text-[#C5A365] italic text-sm mb-1">Putra Bp/Ibu</p>
                        <p className="text-[#4A2C2A] font-semibold">{content.groom_parents}</p>
                    </div>
                    <div>
                        <h3 className="text-4xl text-[#7D2731] font-bold mb-4">{content.bride_name}</h3>
                        <p className="text-[#C5A365] italic text-sm mb-1">Putri Bp/Ibu</p>
                        <p className="text-[#4A2C2A] font-semibold">{content.bride_parents}</p>
                    </div>
                </div>
            </section>

            {/* Waktu & Lokasi */}
            <section className="py-24 px-6 bg-[#7D2731] text-[#FFFDF9] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/floral-motif.png')]"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="script-font text-6xl text-[#C5A365] mb-16">Acara Bahagia</h2>

                    <div className="bg-[#FFFDF9]/10 backdrop-blur-sm rounded-3xl p-10 md:p-16 max-w-2xl mx-auto border border-[#C5A365]/30">
                        <div className="flex flex-col items-center">
                            <Calendar className="w-8 h-8 text-[#C5A365] mb-6" />
                            <h3 className="text-3xl font-bold mb-4 tracking-wide capitalize">{content.event_type?.replace('_', ' & ') || "Akad & Resepsi"}</h3>
                            <p className="text-xl mb-4 text-[#FFFDF9]/90">{eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <span className="bg-[#C5A365]/20 text-[#C5A365] px-6 py-2 rounded-full font-bold tracking-widest text-sm mb-10">PIKUL {content.event_time}</span>

                            <MapPin className="w-8 h-8 text-[#C5A365] mb-6" />
                            <h4 className="text-2xl font-bold mb-3">{content.venue_name}</h4>
                            <p className="text-[#FFFDF9]/80 leading-relaxed px-4">{content.venue_address}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RSVP, Ucapan, Amplop Grid */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">

                    {/* Left Column: RSVP & Tanda Kasih */}
                    <div className="flex flex-col gap-12">
                        <div className="bg-white p-10 rounded-3xl shadow-lg border border-[#7D2731]/10 h-min">
                            <h2 className="text-3xl text-[#7D2731] font-bold mb-8 text-center">Kehadiran</h2>
                            <RSVPForm invitationId={invitationId} />
                        </div>

                        <div className="bg-white p-10 rounded-3xl shadow-lg border border-[#7D2731]/10 text-center h-min">
                            <Gift className="w-10 h-10 text-[#C5A365] mx-auto mb-6" />
                            <h2 className="text-3xl text-[#7D2731] font-bold mb-4">Tanda Kasih</h2>
                            <p className="text-[#4A2C2A]/70 mb-8 italic">Pemberian tanda kasih dapat disalurkan melalui fitur digital di bawah ini.</p>

                            {content.qris_image_url ? (
                                <div className="bg-[#FFFDF9] border border-[#C5A365]/40 p-6 rounded-xl">
                                    <p className="text-sm font-bold text-[#7D2731] tracking-widest mb-2 uppercase">Nomor Rekening / QRIS</p>
                                    <p className="font-mono text-lg font-bold">{content.qris_image_url}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-[#4A2C2A]/40 uppercase tracking-widest">- Fitur nonaktif -</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Guestbook */}
                    <div className="bg-white p-10 rounded-3xl shadow-lg border border-[#7D2731]/10 flex flex-col">
                        <h2 className="text-3xl text-[#7D2731] font-bold mb-8 text-center">Doa Restu</h2>
                        <div className="flex-1 h-[650px] overflow-y-auto pr-4 custom-scrollbar">
                            <Guestbook invitationId={invitationId} />
                        </div>
                    </div>

                </div>
            </section>

            <footer className="bg-[#7D2731] py-16 text-center text-[#FFFDF9]">
                <p className="mb-4 italic opacity-80 decoration-slice max-w-md mx-auto">Diiringi doa restu, kami mengucapkan terima kasih atas perhatian Bapak/Ibu/Saudara/i.</p>
                <h3 className="text-4xl text-[#C5A365] script-font">{content.groom_nickname} & {content.bride_nickname}</h3>
            </footer>
        </div>
    )
}
