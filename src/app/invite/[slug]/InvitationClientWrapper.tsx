"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CoverSection from "@/components/invitation/CoverSection";
import HeroSection from "@/components/invitation/HeroSection";
import CoupleSection from "@/components/invitation/CoupleSection";
import QuoteSection from "@/components/invitation/QuoteSection";
import LoveStorySection from "@/components/invitation/LoveStorySection";
import CountdownSection from "@/components/invitation/CountdownSection";
import EventSection from "@/components/invitation/EventSection";
import GallerySection from "@/components/invitation/GallerySection";
import LoveGiftSection from "@/components/invitation/LoveGiftSection";
import RsvpSection from "@/components/invitation/RsvpSection";
import BottomNavbar from "@/components/invitation/BottomNavbar";
import MusicButton from "@/components/invitation/MusicButton";
import { RsvpMessage } from "@/components/invitation/RsvpSection";
import { Theme } from "@/types/theme";
import MasterInvitationRenderer from "@/components/invitation/MasterInvitationRenderer";

// Kita mendefinisikan tipe data sesuai dengan demoData agar aman
interface InvitationData {
    coupleShortName: string;
    groom: any;
    bride: any;
    coverPhoto: string;
    heroPhoto: string;
    quote: any;
    akad: any;
    reception: any;
    dressCode: any;
    loveStory: any[];
    gallery: string[];
    bankAccounts: any[];
    giftAddress: string;
    rsvpMessages: RsvpMessage[];
    calendarUrl: string;
}

interface WrapperProps {
    data: InvitationData;
    theme?: Theme;
    invitationId?: string;
}

export default function InvitationClientWrapper({ data, theme, invitationId }: WrapperProps) {
    // If a theme is provided, use the MasterInvitationRenderer (themed engine)
    if (theme) {
        return <MasterInvitationRenderer theme={theme} invitationData={data as any} />;
    }

    // Otherwise, fall back to the original hardcoded section-based rendering
    const [isOpened, setIsOpened] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleOpen = () => {
        setIsOpened(true);
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsMusicPlaying(true);
            }).catch(() => { });
        }
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isMusicPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsMusicPlaying(!isMusicPlaying);
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <audio
                ref={audioRef}
                loop
                preload="auto"
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            />

            {!isOpened && (
                <CoverSection
                    coupleShortName={data.coupleShortName}
                    coverPhoto={data.coverPhoto}
                    onOpen={handleOpen}
                />
            )}

            <AnimatePresence>
                {isOpened && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <HeroSection
                            coupleShortName={data.coupleShortName}
                            groomName={data.groom.fullName}
                            brideName={data.bride.fullName}
                            heroPhoto={data.heroPhoto}
                            weddingDate={data.akad.date}
                            calendarUrl={data.calendarUrl}
                        />

                        <CoupleSection groom={data.groom} bride={data.bride} />
                        <QuoteSection text={data.quote.text} source={data.quote.source} />
                        <LoveStorySection stories={data.loveStory} />
                        <CountdownSection targetDate={data.akad.date} />

                        <EventSection
                            akad={data.akad}
                            reception={data.reception}
                            dressCode={data.dressCode}
                        />

                        <GallerySection photos={data.gallery} />
                        <LoveGiftSection
                            bankAccounts={data.bankAccounts}
                            giftAddress={data.giftAddress}
                        />

                        <RsvpSection initialMessages={data.rsvpMessages} />

                        <div className="h-20" />
                        <BottomNavbar />
                        <MusicButton isPlaying={isMusicPlaying} onToggle={toggleMusic} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
