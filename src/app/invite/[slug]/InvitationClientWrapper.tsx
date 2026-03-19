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
    musicUrl?: string | null;
    sectionsOrder?: string[];                           // ← tambah ini
    sectionsVisibility?: Record<string, boolean>;       // ← dan ini
}

interface WrapperProps {
    data: InvitationData;
    theme?: Theme;
    invitationId?: string;
}

export default function InvitationClientWrapper({ data, theme, invitationId }: WrapperProps) {
    const [isOpened, setIsOpened] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    if (theme) {
        return <MasterInvitationRenderer theme={theme} invitationData={data as any} />;
    }

    const handleOpen = () => {
        setIsOpened(true);
        // Only play if a music URL is set
        if (audioRef.current && data.musicUrl) {
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

    // Safe quote fallback
    const safeQuote = data.quote && data.quote.text
        ? data.quote
        : { text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.", source: "QS. Ar-Rum: 21" };

    const hasMusicUrl = Boolean(data.musicUrl);

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Audio element — preload=none until opened, then auto */}
            {hasMusicUrl && (
                <audio
                    ref={audioRef}
                    loop
                    preload="none"
                    src={data.musicUrl!}
                />
            )}

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
                        {(() => {
                            const order = data.sectionsOrder || [
                                "hero", "couple", "quote", "lovestory",
                                "countdown", "event", "gallery", "gift", "rsvp"
                            ];
                            const vis = data.sectionsVisibility || {};
                            const isVisible = (id: string) => vis[id] !== false;

                            return order.map((id) => {
                                if (!isVisible(id)) return null;
                                switch (id) {
                                    case "hero": return (
                                        <HeroSection key={id}
                                            coupleShortName={data.coupleShortName}
                                            groomName={data.groom?.fullName}
                                            brideName={data.bride?.fullName}
                                            heroPhoto={data.heroPhoto}
                                            weddingDate={data.akad?.date}
                                            calendarUrl={data.calendarUrl}
                                        />
                                    );
                                    case "couple": return <CoupleSection key={id} groom={data.groom} bride={data.bride} />;
                                    case "quote": return <QuoteSection key={id} quote={safeQuote} />;
                                    case "lovestory": return <LoveStorySection key={id} stories={data.loveStory} />;
                                    case "countdown": return <CountdownSection key={id} targetDate={data.akad?.date} />;
                                    case "event": return (
                                        <EventSection key={id}
                                            akad={data.akad}
                                            reception={data.reception}
                                            dressCode={data.dressCode}
                                        />
                                    );
                                    case "gallery": return <GallerySection key={id} photos={data.gallery} />;
                                    case "gift": return (
                                        <LoveGiftSection key={id}
                                            bankAccounts={data.bankAccounts}
                                            giftAddress={data.giftAddress}
                                        />
                                    );
                                    case "rsvp": return <RsvpSection key={id} initialMessages={data.rsvpMessages} />;
                                    default: return null;
                                }
                            });
                        })()}
                        <div className="h-20" />
                        <BottomNavbar />
                        {/* Only render music button if a music URL is configured */}
                        {hasMusicUrl && (
                            <MusicButton isPlaying={isMusicPlaying} onToggle={toggleMusic} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
