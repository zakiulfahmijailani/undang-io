import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Nanti akan kita hubungkan ke Supabase, untuk sekarang gunakan dummy
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

// Interactive Client Wrapper (supaya Audio + Animation jalan)
import InvitationClientWrapper from './InvitationClientWrapper';

interface InvitePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: InvitePageProps
): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Dummy check
    if (slug === '404') {
        return { title: 'Not Found' };
    }

    return {
        title: `Undangan Pernikahan | ${demoData.coupleShortName}`,
        description: `Kami mengundang Anda untuk hadir di acara pernikahan kami.`,
        openGraph: {
            images: [demoData.coverPhoto],
        },
    };
}

export default async function InvitePage({ params }: InvitePageProps) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    if (slug === '404') {
        notFound();
    }

    // TODO: Fetch from supabase using slug
    const data = demoData;

    return (
        <InvitationClientWrapper
            data={data}
        />
    );
}
