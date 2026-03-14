"use client";

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Theme } from '@/types/theme';
import { demoData } from "@/data/demoInvitation";
import { InvitationThemeProvider, useInvitationTheme } from '@/components/invitation/themed/ThemeContext';
import ThemedCoverSection from '@/components/invitation/themed/ThemedCoverSection';
import ThemedHeroSection from '@/components/invitation/themed/ThemedHeroSection';
import ThemedCoupleSection from '@/components/invitation/themed/ThemedCoupleSection';
import ThemedQuoteSection from '@/components/invitation/themed/ThemedQuoteSection';
import ThemedLoveStorySection from '@/components/invitation/themed/ThemedLoveStorySection';
import ThemedCountdownSection from '@/components/invitation/themed/ThemedCountdownSection';
import ThemedEventSection from '@/components/invitation/themed/ThemedEventSection';
import ThemedGallerySection from '@/components/invitation/themed/ThemedGallerySection';
import ThemedLoveGiftSection from '@/components/invitation/themed/ThemedLoveGiftSection';
import ThemedRsvpSection from '@/components/invitation/themed/ThemedRsvpSection';
import ThemedBottomNavbar from '@/components/invitation/themed/ThemedBottomNavbar';
import MusicButton from '@/components/invitation/MusicButton';

interface MasterInvitationRendererProps {
  theme: Theme;
  invitationData?: typeof demoData;
}

function InvitationContent({ invitationData }: { invitationData: typeof demoData }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { theme, getSlotUrl } = useInvitationTheme();

  const handleOpen = () => {
    setIsOpened(true);
    if (theme.animationSettings.musicAutoplay && audioRef.current) {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsMusicPlaying(!isMusicPlaying);
  };

  const musicSrc = theme.musicUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  return (
    <div className="min-h-screen" style={{ background: `hsl(${theme.colors.surface})` }}>
      <audio ref={audioRef} loop preload="auto" src={musicSrc} />

      {!isOpened && (
        <ThemedCoverSection
          coupleShortName={invitationData.coupleShortName}
          onOpen={handleOpen}
        />
      )}

      <AnimatePresence>
        {isOpened && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <ThemedHeroSection
              coupleShortName={invitationData.coupleShortName}
              groomName={invitationData.groom.fullName}
              brideName={invitationData.bride.fullName}
              weddingDate={invitationData.akad.date}
              calendarUrl={invitationData.calendarUrl}
            />
            <ThemedCoupleSection groom={invitationData.groom} bride={invitationData.bride} />
            <ThemedQuoteSection text={invitationData.quote.text} source={invitationData.quote.source} />
            <ThemedLoveStorySection stories={invitationData.loveStory} />
            <ThemedCountdownSection targetDate={invitationData.akad.date} />
            <ThemedEventSection
              akad={invitationData.akad}
              reception={invitationData.reception}
              dressCode={invitationData.dressCode}
            />
            <ThemedGallerySection photos={invitationData.gallery} />
            <ThemedLoveGiftSection
              bankAccounts={invitationData.bankAccounts}
              giftAddress={invitationData.giftAddress}
            />
            <ThemedRsvpSection initialMessages={invitationData.rsvpMessages} />
            <div className="h-20" />
            <ThemedBottomNavbar />
            <MusicButton isPlaying={isMusicPlaying} onToggle={toggleMusic} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MasterInvitationRenderer({ theme, invitationData }: MasterInvitationRendererProps) {
  const data = invitationData || demoData;
  return (
    <InvitationThemeProvider theme={theme}>
      <InvitationContent invitationData={data} />
    </InvitationThemeProvider>
  );
}
