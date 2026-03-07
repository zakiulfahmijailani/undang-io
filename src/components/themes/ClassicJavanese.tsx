import { Calendar, MapPin, Gift, Heart } from "lucide-react"
import { RSVPForm } from "../invitation/RSVPForm"
import { Guestbook } from "../invitation/Guestbook"

interface ThemeProps {
    content: any
    invitationId: string
}

export default function ClassicJavanese({ content, invitationId }: ThemeProps) {
    // A majestic, traditional theme with gold and dark brown colors

    return (
        <div className="bg-[#FAF3E0] min-h-screen text-[#4A3B32] font-serif selection:bg-[#BE8C3A] selection:text-white">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
                h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', serif; }
                p, span, div { font-family: 'Lora', serif; }
            `}</style>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center p-6 border-[20px] border-[#BE8C3A]/20 m-4 rounded-3xl overflow-hidden shadow-inner">
                {/* Decorative Elements */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#BE8C3A] opacity-60"></div>
                <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-[#BE8C3A] opacity-60"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-[#BE8C3A] opacity-60"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#BE8C3A] opacity-60"></div>

                <div className="z-10 bg-[#FAF3E0]/70 backdrop-blur-sm p-8 rounded-xl ring-1 ring-[#BE8C3A]/30">
                    <p className="text-[#8C6D4C] uppercase tracking-[0.3em] font-semibold text-sm mb-6">Pernikahan Tradisional Jawa</p>
                    <h1 className="text-5xl md:text-7xl font-bold text-[#3B291A] mb-4">
                        {content.groom_nickname} <span className="text-[#BE8C3A] italic font-light">&amp;</span> {content.bride_nickname}
                    </h1>
                    <p className="text-lg md:text-xl text-[#5A4B42] italic mt-4">
                        {new Date(content.event_date || Date.now()).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Greeting & Story */}
            <section className="py-20 px-6 max-w-3xl mx-auto text-center border-b border-[#BE8C3A]/20">
                <Heart className="w-8 h-8 mx-auto text-[#BE8C3A] mb-8" />
                <p className="text-base md:text-lg leading-relaxed text-[#5A4B42] mb-12">
                    {content.greeting_text || "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir memberikan doa restu pada acara pernikahan kami."}
                </p>

                <div className="grid md:grid-cols-2 gap-12 mt-16">
                    <div>
                        <h3 className="text-3xl font-bold text-[#3B291A] mb-2">{content.groom_name}</h3>
                        <p className="text-[#8C6D4C] text-sm">Putra dari</p>
                        <p className="font-semibold text-[#5A4B42]">{content.groom_parents}</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-[#3B291A] mb-2">{content.bride_name}</h3>
                        <p className="text-[#8C6D4C] text-sm">Putri dari</p>
                        <p className="font-semibold text-[#5A4B42]">{content.bride_parents}</p>
                    </div>
                </div>
            </section>

            {/* Event Details */}
            <section className="py-20 px-6 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-[#3B291A] mb-4">Rangkaian Acara</h2>
                    <div className="w-24 h-px bg-[#BE8C3A] mx-auto"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-[#BE8C3A]/10 p-8 md:p-12 relative overflow-hidden border border-[#BE8C3A]/20">
                    <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                        <div className="p-4 bg-[#FAF3E0] rounded-full text-[#BE8C3A]">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-[#3B291A] capitalize">{content.event_type?.replace('_', ' & ') || "Akad & Resepsi"}</h3>
                            <p className="text-lg text-[#5A4B42] mt-2">
                                {new Date(content.event_date || Date.now()).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="text-lg font-semibold text-[#8C6D4C] mt-1">{content.event_time}</p>
                        </div>

                        <div className="w-16 h-px bg-[#BE8C3A]/30 my-4"></div>

                        <div className="p-4 bg-[#FAF3E0] rounded-full text-[#BE8C3A]">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-[#3B291A]">{content.venue_name}</h3>
                            <p className="text-[#5A4B42] mt-2 max-w-sm mx-auto">{content.venue_address}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* RSVP & Digital Envelope Wrapper */}
            <section className="py-20 px-6 bg-[#3B291A] text-[#FAF3E0]">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                    {/* RSVP Form */}
                    <div className="bg-[#FAF3E0] rounded-2xl p-8 text-[#4A3B32]">
                        <h2 className="text-3xl font-bold text-center mb-6">RSVP & Ucapan</h2>
                        <RSVPForm invitationId={invitationId} />
                    </div>

                    {/* Digital Envelope */}
                    <div className="flex flex-col items-center text-center">
                        <Gift className="w-12 h-12 text-[#BE8C3A] mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Tanda Kasih</h2>
                        <p className="text-[#FAF3E0]/70 mb-8 max-w-sm">
                            Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih dapat melalui amplop digital berikut.
                        </p>

                        {(content.qris_image_url || content.bank_accounts) ? (
                            <div className="bg-[#FAF3E0] w-full rounded-2xl p-6 text-[#4A3B32]">
                                {content.qris_image_url && (
                                    <div className="mb-4">
                                        <p className="font-semibold mb-2">QRIS / E-Wallet</p>
                                        <p className="font-mono bg-white p-2 rounded border">{content.qris_image_url}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="italic text-[#FAF3E0]/50">- Fitur amplop digital tidak diaktifkan -</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Guestbook Section */}
            <section className="py-20 px-6 max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-[#3B291A] text-center mb-12">Buku Tamu</h2>
                <div className="bg-white rounded-2xl shadow-xl shadow-[#BE8C3A]/10 p-8 border border-[#BE8C3A]/20 h-[500px] overflow-y-auto">
                    <Guestbook invitationId={invitationId} />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-[#5A4B42] bg-[#F2E8D5]">
                <p className="mb-2">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
                <p className="font-bold text-xl mt-4 text-[#3B291A]">{content.groom_nickname} & {content.bride_nickname}</p>
            </footer>
        </div>
    )
}
