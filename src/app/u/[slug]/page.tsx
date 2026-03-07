import HeroSection from "@/components/invitation/HeroSection"
import EventSection from "@/components/invitation/EventSection"
import GallerySection from "@/components/invitation/GallerySection"
import RSVPSection from "@/components/invitation/RSVPSection"
import MessageSection from "@/components/invitation/MessageSection"
import DigitalGiftSection from "@/components/invitation/DigitalGiftSection"

export default function PublicInvitationPage() {
    return (
        <main className="w-full min-h-screen bg-gray-50 overflow-x-hidden font-sans selection:bg-[#FCA311]/20">
            <HeroSection />
            <EventSection />
            <GallerySection />
            <RSVPSection />
            <MessageSection />
            <DigitalGiftSection />

            <footer className="py-8 bg-[#14213D] text-center text-xs text-gray-400 border-t border-white/5">
                <p>Made with &hearts; using <span className="text-[#FCA311] font-bold">umuman</span></p>
                <p className="mt-1 opacity-50">&copy; 2026 umuman. All Rights Reserved.</p>
            </footer>
        </main>
    )
}
