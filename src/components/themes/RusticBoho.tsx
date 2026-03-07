import { Calendar, MapPin, Gift, Heart } from "lucide-react"
import { RSVPForm } from "../invitation/RSVPForm"
import { Guestbook } from "../invitation/Guestbook"

interface ThemeProps {
    content: any
    invitationId: string
}

export default function RusticBoho({ content, invitationId }: ThemeProps) {
    // A soft, earthy theme with terracotta, cream, olive greens
    const eventDate = new Date(content.event_date || Date.now())

    return (
        <div className="bg-[#FAF6F0] min-h-screen text-[#5D534A] font-sans selection:bg-[#C27E6A] selection:text-white pb-20">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500&display=swap');
                h1, h2, h3, h4, h5, h6 { font-family: 'Cormorant Garamond', serif; }
                p, span, div, a, button, input { font-family: 'Montserrat', sans-serif; }
            `}</style>

            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex flex-col items-center justify-center text-center p-6 border-[12px] md:border-[24px] border-white m-2 md:m-4 shadow-xl shadow-black/5 rounded-t-full">
                {/* Simulated arch overlay */}
                <div className="absolute inset-0 border-2 border-[#C27E6A]/20 m-4 rounded-t-full pointer-events-none"></div>

                <div className="z-10 bg-white/60 backdrop-blur-md p-10 md:p-16 rounded-t-full rounded-b-3xl max-w-lg w-full shadow-lg shadow-[#8B9280]/10 border border-[#8B9280]/20">
                    <p className="text-[#8B9280] tracking-[0.4em] font-medium text-xs md:text-sm mb-8 uppercase">The Wedding Of</p>
                    <h1 className="text-6xl md:text-7xl font-semibold text-[#8B9280] mb-2">
                        {content.groom_nickname}
                    </h1>
                    <span className="text-3xl text-[#C27E6A] italic">&amp;</span>
                    <h1 className="text-6xl md:text-7xl font-semibold text-[#8B9280] mt-2 mb-8">
                        {content.bride_nickname}
                    </h1>
                    <div className="w-12 h-px bg-[#C27E6A] mx-auto mb-6"></div>
                    <p className="text-[#5D534A] tracking-widest text-sm uppercase">
                        {eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Greeting */}
            <section className="py-24 px-6 max-w-2xl mx-auto text-center">
                <p className="text-lg md:text-xl leading-relaxed text-[#5D534A] font-light">
                    "{content.greeting_text || "Dengan memohon rahmat dan ridho-Nya, kami bermaksud menyelenggarakan acara pernikahan putra-putri kami."}"
                </p>

                <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24">
                    <div className="text-center">
                        <h3 className="text-4xl font-semibold text-[#8B9280] mb-4">{content.groom_name}</h3>
                        <p className="text-[#C27E6A] text-sm uppercase tracking-widest font-medium">Putra dari</p>
                        <p className="text-[#5D534A] mt-2 text-sm">{content.groom_parents}</p>
                    </div>

                    <Heart className="w-8 h-8 text-[#C27E6A] opacity-50 shrink-0" />

                    <div className="text-center">
                        <h3 className="text-4xl font-semibold text-[#8B9280] mb-4">{content.bride_name}</h3>
                        <p className="text-[#C27E6A] text-sm uppercase tracking-widest font-medium">Putri dari</p>
                        <p className="text-[#5D534A] mt-2 text-sm">{content.bride_parents}</p>
                    </div>
                </div>
            </section>

            {/* Detail Acara */}
            <section className="py-20 px-6 bg-[#8B9280] text-[#FAF6F0]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-semibold mb-16">Acara Bahagia</h2>

                    <div className="bg-[#FAF6F0] text-[#5D534A] rounded-2xl p-8 md:p-16 max-w-2xl mx-auto shadow-2xl relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#C27E6A] rounded-full flex items-center justify-center text-white border-4 border-[#FAF6F0]">
                            <Calendar className="w-6 h-6" />
                        </div>

                        <h3 className="text-3xl font-semibold text-[#8B9280] mb-2 mt-4 capitalize">{content.event_type?.replace('_', ' & ') || "Akad & Resepsi"}</h3>
                        <p className="text-lg mb-6">{eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                        <div className="w-full flex justify-center mb-6">
                            <span className="bg-[#FAF6F0] px-4 py-2 border border-[#C27E6A] rounded-full text-[#C27E6A] font-medium tracking-wide">
                                {content.event_time}
                            </span>
                        </div>

                        <div className="w-16 h-px bg-[#8B9280]/30 mx-auto my-8"></div>

                        <h4 className="text-xl font-semibold text-[#8B9280] mb-2">{content.venue_name}</h4>
                        <p className="text-sm leading-relaxed max-w-md mx-auto">{content.venue_address}</p>
                    </div>
                </div>
            </section>

            {/* RSVP, Amplop, Guestbook Grid */}
            <section className="py-24 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-12">
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#5D534A]/10">
                        <h2 className="text-4xl font-semibold text-[#8B9280] mb-8">Kehadiran</h2>
                        <RSVPForm invitationId={invitationId} />
                    </div>

                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#5D534A]/10 text-center">
                        <Gift className="w-10 h-10 text-[#C27E6A] mx-auto mb-6" />
                        <h2 className="text-4xl font-semibold text-[#8B9280] mb-4">Tanda Kasih</h2>
                        <p className="text-sm mb-6 text-[#5D534A]/80">Terima kasih atas doa dan tanda kasih yang diberikan.</p>

                        {content.qris_image_url ? (
                            <div className="p-4 bg-[#FAF6F0] rounded-lg border border-[#C27E6A]/30">
                                <p className="font-bold text-[#8B9280] mb-2">Transfer / E-Wallet</p>
                                <p className="font-mono text-lg">{content.qris_image_url}</p>
                            </div>
                        ) : (
                            <p className="italic text-sm text-[#5D534A]/50">Amplop digital dinonaktifkan</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#5D534A]/10 flex flex-col h-full">
                    <h2 className="text-4xl font-semibold text-[#8B9280] mb-8 text-center">Doa Restu</h2>
                    <div className="flex-1 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        <Guestbook invitationId={invitationId} />
                    </div>
                </div>
            </section>

            <footer className="text-center py-12 text-[#5D534A]/60 text-sm tracking-widest uppercase">
                {content.groom_nickname} & {content.bride_nickname}
            </footer>
        </div>
    )
}
