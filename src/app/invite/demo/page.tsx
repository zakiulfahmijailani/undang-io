"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { demoData } from "@/data/demoInvitation";
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

export default function InviteDemoPage() {
    const [isOpened, setIsOpened] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleOpen = () => {
        setIsOpened(true);
        // Try to play music
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsMusicPlaying(true);
            }).catch(() => {
                // Browser blocked autoplay, that's fine
            });
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
            {/* Background audio - using a royalty-free placeholder URL */}
            <audio
                ref={audioRef}
                loop
                preload="auto"
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            />

            {/* Cover Gate */}
            {!isOpened && (
                <CoverSection
                    coupleShortName={demoData.coupleShortName}
                    coverPhoto={demoData.coverPhoto}
                    onOpen={handleOpen}
                />
            )}

            {/* Main content - only visible after opening */}
            <AnimatePresence>
                {isOpened && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <HeroSection
                            coupleShortName={demoData.coupleShortName}
                            groomName={demoData.groom.fullName}
                            brideName={demoData.bride.fullName}
                            heroPhoto={demoData.heroPhoto}
                            weddingDate={demoData.akad.date}
                            calendarUrl={demoData.calendarUrl}
                        />

                        <CoupleSection groom={demoData.groom} bride={demoData.bride} />

                        <QuoteSection quote={demoData.quote} />

                        <LoveStorySection stories={demoData.loveStory} />

                        <CountdownSection targetDate={demoData.akad.date} />

                        <EventSection
                            akad={demoData.akad}
                            reception={demoData.reception}
                            dressCode={demoData.dressCode}
                        />

                        <GallerySection photos={demoData.gallery} />

                        <LoveGiftSection
                            bankAccounts={demoData.bankAccounts}
                            giftAddress={demoData.giftAddress}
                        />

                        <RsvpSection existingMessages={demoData.rsvpMessages as any} />

                        {/* Bottom padding for navbar */}
                        <div className="h-20" />

                        <BottomNavbar />
                        <MusicButton isPlaying={isMusicPlaying} onToggle={toggleMusic} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
