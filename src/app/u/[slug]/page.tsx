"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { demoData } from "@/data/demoInvitation";
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import GuestCountdownBanner from "@/components/invitation/GuestCountdownBanner";

function formatTimeLeft(ms: number) {
    if (ms <= 0) return "00:00";
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function GuestInvitationView(props: { params: Promise<{ slug: string }> }) {
    const params = use(props.params);
    const { slug } = params;
    const router = useRouter();

    const [sessionData, setSessionData] = useState<any>(null);
    const [isPermanent, setIsPermanent] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // RSVP form
    const [rsvpName, setRsvpName] = useState("");
    const [rsvpAttendance, setRsvpAttendance] = useState<"hadir" | "tidak_hadir" | "masih_ragu">("hadir");
    const [rsvpMessage, setRsvpMessage] = useState("");

    useEffect(() => {
        const fetchInvitation = async () => {
            const supabase = createBrowserSupabaseClient();
            
            // 1. Try to load from authentic invitations table first (permanent)
            const { data: permInv, error: permError } = await supabase
                .from('invitations')
                .select('*')
                .eq('slug', slug)
                .single();

            if (permInv && !permError) {
                // Formatting data for permInv omitted setup for brevity; assuming details exist
                setIsPermanent(true);
                // For this demo, we'll just redirect to the real invite viewer if it's permanent
                // since the real invite viewer is typically the source of truth for permanent links.
                router.push(`/invite/${slug}`);
                return;
            }

            // 2. Try guest_sessions
            const { data: guestInv, error: guestError } = await supabase
                .from('guest_sessions')
                .select('*')
                .eq('slug', slug)
                .single();

            if (guestError || !guestInv) {
                // Neither found
                setIsLoading(false);
                return; 
            }

            // Found guest session
            const expiresTime = new Date(guestInv.expires_at).getTime();
            if (expiresTime <= Date.now() && guestInv.status !== 'converted') {
                setIsExpired(true);
            } else {
                setTimeLeft(Math.max(0, expiresTime - Date.now()));
            }

            setSessionData(guestInv);

            // Check if current user is the creator (by local token match)
            const rawLocal = localStorage.getItem("guest_session");
            if (rawLocal) {
                try {
                    const parsed = JSON.parse(rawLocal);
                    if (parsed.sessionToken === guestInv.session_token) {
                        setIsCreator(true);
                    }
                } catch (e) {}
            }

            setIsLoading(false);
        };

        fetchInvitation();
    }, [slug, router]);

    useEffect(() => {
        if (!sessionData || isPermanent || isExpired) return;
        const interval = setInterval(() => {
            const remaining = new Date(sessionData.expires_at).getTime() - Date.now();
            setTimeLeft(Math.max(0, remaining));
            if (remaining <= 0) {
                setIsExpired(true);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionData, isPermanent, isExpired]);

    const handleRsvp = (e: React.FormEvent) => {
        e.preventDefault();
        toast("Terima kasih!", { description: "RSVP dan ucapan kamu sudah terkirim." });
        setRsvpName("");
        setRsvpMessage("");
    };

    const handleShare = () => {
        const url = window.location.href;
        const text = `Kamu diundang! Buka undangan pernikahan kami: ${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    if (isLoading) {
        return <div className="min-h-screen bg-stone-50" />;
    }

    if (!sessionData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <Card className="max-w-md p-6 text-center shadow-lg">
                    <h2 className="text-xl font-bold text-stone-800">Undangan Tidak Ditemukan</h2>
                    <p className="mt-2 text-stone-600">Undangan yang Anda cari tidak ada atau masa berlakunya sudah habis.</p>
                    <Button className="mt-6" asChild>
                        <Link href="/">Kembali ke Beranda</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    // Map session data to Invitation shape
    const invData = sessionData.invitation_data;
    const dataDisplay = {
        ...demoData,
        coupleShortName: `${invData.groomNickname} & ${invData.brideNickname}`,
        theme: sessionData.theme_id,
        groom: {
            ...demoData.groom,
            fullName: invData.groomFullName || "Mempelai Pria",
            nickname: invData.groomNickname || "Pria",
            father: invData.groomFather ? `Bapak ${invData.groomFather}` : "",
            mother: invData.groomMother ? `Ibu ${invData.groomMother}` : "",
        },
        bride: {
            ...demoData.bride,
            fullName: invData.brideFullName || "Mempelai Wanita",
            nickname: invData.brideNickname || "Wanita",
            father: invData.brideFather ? `Bapak ${invData.brideFather}` : "",
            mother: invData.brideMother ? `Ibu ${invData.brideMother}` : "",
        },
        akad: {
            date: invData.akadDate,
            time: invData.akadTime,
            venue: invData.akadVenue,
            address: invData.akadAddress,
            mapsUrl: "",
        },
        reception: {
            date: invData.receptionDate,
            time: invData.receptionTime,
            venue: invData.receptionVenue,
            address: invData.receptionAddress,
            mapsUrl: "",
        },
        quote: {
            text: invData.quote,
            source: invData.quoteSource,
        }
    };

    if (isExpired && sessionData.status !== 'converted') {
        return (
            <div className="relative min-h-screen">
                <div className="pointer-events-none select-none blur-md opacity-60">
                    <InvitationClientWrapper data={dataDisplay} />
                </div>

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm">
                    <Card className="mx-4 max-w-md shadow-2xl">
                        <CardContent className="p-8 text-center pt-8">
                            <Lock className="mx-auto mb-4 h-12 w-12 text-stone-400" />

                            <h2 className="mb-2 font-serif text-2xl font-bold text-stone-800">
                                💍 Masa Berlaku Habis (Expired)
                            </h2>
                            <p className="mb-6 text-stone-500">Undangan ini belum dipublikasikan permanen sehingga terhapus dari sistem sementara.</p>

                            <p className="mb-4 font-serif text-lg text-stone-800">
                                {invData.groomNickname || invData.groomFullName} &{" "}
                                {invData.brideNickname || invData.brideFullName}
                            </p>

                            {/* Creator-only action */}
                            {isCreator && (
                                <Card className="border-amber-200 bg-amber-50 shadow-none">
                                    <CardContent className="p-4 text-left pt-4">
                                        <p className="mb-2 text-sm font-semibold text-stone-800">Mau langsung live selamanya?</p>
                                        <p className="mb-3 text-xs text-stone-600">Aktifkan undangan ini sekarang.</p>
                                        <Button className="w-full gap-1 cursor-pointer bg-gradient-to-r from-gold-500 to-amber-600 border-0 text-white shadow-md hover:shadow-lg" asChild>
                                            <Link href={`/login?guest_token=${sessionData.session_token}`}>
                                                Login untuk Mengaktifkan
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="relative pt-[56px] min-h-screen">
            {!isPermanent && !isExpired && (
                <GuestCountdownBanner 
                    expiresAt={sessionData.expires_at}
                    sessionToken={sessionData.session_token}
                    slug={sessionData.slug}
                    status={sessionData.status}
                />
            )}

            {isCreator && !isExpired && (
                <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-stone-200 bg-white/95 px-4 py-2 shadow-xl backdrop-blur-md">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-9 gap-1 text-xs rounded-full font-semibold cursor-pointer"
                        onClick={handleShare}
                    >
                        <ExternalLink className="h-4 w-4" /> WhatsApp
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 gap-1 text-xs rounded-full cursor-pointer hover:bg-stone-100"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast("Link disalin!");
                        }}
                    >
                        Salin Link
                    </Button>
                </div>
            )}

            <InvitationClientWrapper data={dataDisplay} />
        </div>
    );
}
