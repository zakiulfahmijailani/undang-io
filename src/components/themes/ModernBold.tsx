import { Calendar, MapPin, Gift, Heart } from "lucide-react"
import { RSVPForm } from "../invitation/RSVPForm"
import { Guestbook } from "../invitation/Guestbook"

interface ThemeProps {
    content: any
    invitationId: string
}

export default function ModernBold({ content, invitationId }: ThemeProps) {
    // A modern, striking theme with strong typography and stark contrasts (black, white, red/accent)
    const eventDate = new Date(content.event_date || Date.now())

    return (
        <div className="bg-[#121212] min-h-screen text-white font-sans selection:bg-[#E53935] selection:text-white pb-20">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Inter:wght@300;400;600;900&display=swap');
                h1, h2, h3, h4, h5, h6 { font-family: 'Inter', sans-serif; font-weight: 900; letter-spacing: -0.05em; text-transform: uppercase; }
                p, span, div { font-family: 'Inter', sans-serif; font-weight: 400; }
                .accent { color: #E53935; }
                .accent-bg { background-color: #E53935; }
            `}</style>

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 border-b-8 border-[#E53935]">
                <p className="text-gray-400 font-bold tracking-[0.2em] mb-4 text-sm md:text-base">P R E S E N T I N G</p>
                <div className="flex flex-col gap-2">
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] break-words">
                        {content.groom_nickname}
                    </h1>
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] break-words accent">
                        AND
                    </h1>
                    <h1 className="text-6xl md:text-8xl lg:text-[10rem] leading-[0.85] break-words">
                        {content.bride_nickname}
                    </h1>
                </div>

                <div className="mt-16 flex items-end justify-between border-t border-gray-800 pt-8">
                    <div>
                        <p className="text-gray-400 font-bold mb-1">DATE</p>
                        <p className="text-2xl md:text-4xl font-bold">{eventDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>
            </section>

            {/* Greeting & Details Section */}
            <section className="py-24 px-6 sm:px-12 md:px-24 grid md:grid-cols-2 gap-16">
                <div>
                    <h2 className="text-4xl md:text-6xl mb-8">THE <br /><span className="accent">DETAILS</span></h2>
                    <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed border-l-4 border-[#E53935] pl-6">
                        {content.greeting_text || "You are cordially invited to celebrate our wedding. It wouldn't be the same without you."}
                    </p>

                    <div className="mt-16 flex flex-col gap-8">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">THE GROOM</p>
                            <h3 className="text-2xl">{content.groom_name}</h3>
                            <p className="text-sm text-gray-400 mt-1">Son of {content.groom_parents}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">THE BRIDE</p>
                            <h3 className="text-2xl">{content.bride_name}</h3>
                            <p className="text-sm text-gray-400 mt-1">Daughter of {content.bride_parents}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A1A1A] p-8 md:p-12 border border-gray-800 flex flex-col justify-center">
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="accent-bg text-black p-3"><Calendar className="w-6 h-6" /></span>
                            <h3 className="text-2xl">{content.event_type?.replace('_', ' & ') || "Event"}</h3>
                        </div>
                        <p className="text-xl">{eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-gray-400 mt-1">{content.event_time}</p>
                    </div>

                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="accent-bg text-black p-3"><MapPin className="w-6 h-6" /></span>
                            <h3 className="text-2xl">LOCATION</h3>
                        </div>
                        <p className="text-xl font-bold">{content.venue_name}</p>
                        <p className="text-gray-400 mt-2">{content.venue_address}</p>
                    </div>
                </div>
            </section>

            {/* RSVP & Envelope Section */}
            <section className="py-24 px-6 sm:px-12 md:px-24 border-t border-gray-800">
                <div className="grid md:grid-cols-[1fr_2fr] gap-16">
                    <div className="flex flex-col gap-12">
                        <div>
                            <h2 className="text-4xl md:text-5xl mb-4">DIGITAL<br /><span className="accent">GIFT</span></h2>
                            {(content.qris_image_url || content.bank_accounts) ? (
                                <div className="bg-[#1A1A1A] p-6 border border-gray-800 mt-4">
                                    <p className="text-gray-400 text-sm font-bold mb-2">QRIS / E-WALLET</p>
                                    <p className="font-mono text-xl break-all">{content.qris_image_url}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic mt-4">Not enabled</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-4xl md:text-5xl mb-8">RSVP <span className="text-gray-700">&</span> GUESTBOOK</h2>

                        <div className="bg-white text-black p-8 md:p-12 border-l-8 border-[#E53935] mb-12">
                            <h3 className="text-2xl mb-6 text-black">ATTENDANCE</h3>
                            <div className="text-black">
                                <RSVPForm invitationId={invitationId} />
                            </div>
                        </div>

                        <div className="bg-white text-black p-8 md:p-12 h-[500px] overflow-y-auto border-l-8 border-[#E53935]">
                            <h3 className="text-2xl mb-6 text-black">MESSAGES</h3>
                            <Guestbook invitationId={invitationId} />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
