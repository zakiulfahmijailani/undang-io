"use client";

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Theme } from '@/types/theme';
import { demoData } from "@/data/demoInvitation";
import { InvitationData } from "@/types/invitation";
import { InvitationErrorBoundary } from './InvitationErrorBoundary';
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
  invitationData: InvitationData;
}

function InvitationContent({ invitationData }: { invitationData: InvitationData }) {
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
            <InvitationErrorBoundary sectionName="HeroSection">
              <ThemedHeroSection
                coupleShortName={invitationData.coupleShortName}
                groomName={invitationData.groom.fullName}
                brideName={invitationData.bride.fullName}
                weddingDate={invitationData.akad.date}
                calendarUrl={invitationData.calendarUrl ?? ''}
              />
            </InvitationErrorBoundary>
            
            <InvitationErrorBoundary sectionName="CoupleSection">
              <ThemedCoupleSection groom={invitationData.groom} bride={invitationData.bride} />
            </InvitationErrorBoundary>
            
            <InvitationErrorBoundary sectionName="QuoteSection">
              <ThemedQuoteSection text={invitationData.quote?.text || ""} source={invitationData.quote?.source || ""} />
            </InvitationErrorBoundary>
            
            <InvitationErrorBoundary sectionName="LoveStorySection">
              <ThemedLoveStorySection stories={invitationData.loveStory || []} />
            </InvitationErrorBoundary>
            
            <InvitationErrorBoundary sectionName="CountdownSection">
              <ThemedCountdownSection targetDate={invitationData.akad.date} />
            </InvitationErrorBoundary>
            
            <InvitationErrorBoundary sectionName="EventSection">
              <ThemedEventSection
                akad={invitationData.akad}
                reception={invitationData.reception}
                dressCode={invitationData.dressCode || { description: '', colors: [] }}
              />
            </InvitationErrorBoundary>
            
            <InvitationErrorBoundary sectionName="GallerySection">
              <ThemedGallerySection photos={invitationData.gallery || []} />
            </InvitationErrorBoundary>
            
            <InvitationErrorBoundary sectionName="LoveGiftSection">
              <ThemedLoveGiftSection
                bankAccounts={invitationData.bankAccounts || []}
                giftAddress={invitationData.giftAddress || ''}
              />
            </InvitationErrorBoundary>
            
            <InvitationErrorBoundary sectionName="RsvpSection">
              <ThemedRsvpSection initialMessages={invitationData.rsvpMessages || []} />
            </InvitationErrorBoundary>
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
  const data = invitationData;
  return (
    <InvitationThemeProvider theme={theme}>
      <InvitationContent invitationData={data} />
    </InvitationThemeProvider>
  );
}
