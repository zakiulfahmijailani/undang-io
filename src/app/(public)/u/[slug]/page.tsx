import { notFound } from "next/navigation"
import HeroSection from "@/components/invitation/HeroSection"
import EventSection from "@/components/invitation/EventSection"
import GallerySection from "@/components/invitation/GallerySection"
import RSVPSection from "@/components/invitation/RSVPSection"
import MessageSection from "@/components/invitation/MessageSection"
import DigitalGiftSection from "@/components/invitation/DigitalGiftSection"

export default function PublicInvitationPage({
    params
}: {
    params: { slug: string }
}) {
    // For MVP if no database seeded, just show dummy UI for testing. 
    // All contents are using dummy data hardcoded in the components for now 
    // to ensure beautiful aesthetics and structure.

    // Validasi slug dummy sederhana
    if (!params.slug) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white font-sans text-neutral-800 antialiased selection:bg-emerald-200">
            {/* The individual sections manage their own layout & animations */}
            <HeroSection />
            <EventSection />
            <GallerySection />
            <RSVPSection />
            <MessageSection />
            <DigitalGiftSection />

            {/* Footer */}
            <footer className="py-10 bg-neutral-900 text-center text-neutral-400 text-xs px-4">
                <p className="mb-2">Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.</p>
                <p>Hormat kami,</p>
                <p className="font-serif italic text-lg text-white mt-1 mb-6">Andika & Rania</p>

                <div className="w-16 h-[1px] bg-neutral-700 mx-auto mb-6"></div>
                <p>Made with ❤️ for your Moment | Powered by <span className="font-bold text-emerald-500">umuman</span></p>
            </footer>
        </main>
    )
}
