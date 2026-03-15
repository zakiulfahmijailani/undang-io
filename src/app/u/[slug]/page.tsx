"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Clock, Lock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { demoData } from "@/data/demoInvitation";
// In a real scenario we might use InvitationClientWrapper or MasterInvitationRenderer
import InvitationClientWrapper from "@/app/invite/[slug]/InvitationClientWrapper";

// Dummy themes identical to buat-undangan
const QUOTE_PRESETS = [
    { text: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu merasa tenteram kepadanya.", source: "QS. Ar-Rum: 21" },
];

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

    const [session, setSession] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isExpired, setIsExpired] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // RSVP form
    const [rsvpName, setRsvpName] = useState("");
    const [rsvpAttendance, setRsvpAttendance] = useState<"hadir" | "tidak_hadir" | "masih_ragu">("hadir");
    const [rsvpMessage, setRsvpMessage] = useState("");

    useEffect(() => {
        const raw = localStorage.getItem("guest_session");
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed.slug === slug) {
                    setSession(parsed);
                    setIsCreator(true);
                } else {
                    // Not a guest session for this slug, redirect to standard invite view
                    router.push(`/invite/${slug}`);
                }
            } catch (e) {
                router.push(`/invite/${slug}`);
            }
        } else {
            router.push(`/invite/${slug}`);
        }
        setIsLoading(false);
    }, [slug, router]);

    useEffect(() => {
        if (!session) return;
        const interval = setInterval(() => {
            const remaining = new Date(session.expiresAt).getTime() - Date.now();
            setTimeLeft(Math.max(0, remaining));
            if (remaining <= 0) {
                setIsExpired(true);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [session]);

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

    if (!session) {
        return null; // Will redirect
    }

    // Map session data to Invitation shape
    const invData = session.invitationData;
    const dataDisplay = {
        ...demoData,
        coupleShortName: `${invData.groomNickname} & ${invData.brideNickname}`,
        groom: {
            ...demoData.groom,
            fullName: invData.groomFullName,
            nickname: invData.groomNickname,
            father: invData.groomFather ? `Bapak ${invData.groomFather}` : "",
            mother: invData.groomMother ? `Ibu ${invData.groomMother}` : "",
        },
        bride: {
            ...demoData.bride,
            fullName: invData.brideFullName,
            nickname: invData.brideNickname,
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

    if (isExpired) {
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
                                💍 Undangan sedang dalam proses pembuatan
                            </h2>
                            <p className="mb-6 text-stone-500">Silakan kembali lagi nanti.</p>

                            <p className="mb-4 font-serif text-lg text-stone-800">
                                {invData.groomNickname || invData.groomFullName} &{" "}
                                {invData.brideNickname || invData.brideFullName}
                            </p>

                            <div className="mb-6 rounded-lg border border-stone-200 bg-stone-50 p-4 text-left">
                                <h3 className="mb-3 text-sm font-semibold text-stone-800">
                                    Sudah diundang? Konfirmasi kehadiran
                                </h3>
                                <form onSubmit={handleRsvp} className="space-y-3">
                                    <Input
                                        placeholder="Nama kamu"
                                        value={rsvpName}
                                        onChange={(e) => setRsvpName(e.target.value)}
                                        required
                                    />
                                    <select
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={rsvpAttendance}
                                        onChange={(e) => setRsvpAttendance(e.target.value as any)}
                                    >
                                        <option value="hadir">✅ Hadir</option>
                                        <option value="tidak_hadir">❌ Tidak Hadir</option>
                                        <option value="masih_ragu">🤔 Masih Ragu</option>
                                    </select>
                                    <Textarea
                                        placeholder="Ucapan untuk mempelai..."
                                        value={rsvpMessage}
                                        onChange={(e) => setRsvpMessage(e.target.value)}
                                        rows={2}
                                    />
                                    <Button type="submit" size="sm" className="w-full cursor-pointer">
                                        Kirim RSVP
                                    </Button>
                                </form>
                            </div>

                            {/* Creator-only action */}
                            {isCreator && (
                                <Card className="border-amber-200 bg-amber-50 shadow-none">
                                    <CardContent className="p-4 text-left pt-4">
                                        <p className="mb-2 text-sm font-semibold text-stone-800">Mau langsung live selamanya?</p>
                                        <p className="mb-3 text-xs text-stone-600">Aktifkan undangan ini sekarang.</p>
                                        <Button className="w-full gap-1 cursor-pointer bg-gradient-to-r from-gold-500 to-amber-600 border-0 text-white shadow-md hover:shadow-lg" asChild>
                                            <Link href="/register">
                                                Aktifkan Sekarang — Rp 49.000{" "}
                                                <span className="text-xs line-through opacity-60 ml-1">Rp 99.000</span>
                                            </Link>
                                        </Button>
                                        <ul className="mt-3 space-y-1 text-xs text-stone-600">
                                            <li>✅ Undangan live selamanya</li>
                                            <li>✅ Tersimpan di akun kamu</li>
                                            <li>✅ Link undangan permanen</li>
                                            <li>✅ Bebas edit kapan saja</li>
                                        </ul>
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
        <div className="relative">
            {isCreator && !isExpired && (
                <div className="fixed right-4 top-4 z-50 flex flex-col items-center gap-2 rounded-xl border border-amber-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md sm:flex-row">
                    <div className="flex items-center gap-2 text-amber-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-bold">
                            Tersisa {formatTimeLeft(timeLeft)}
                        </span>
                    </div>
                    <Button size="sm" className="h-8 text-xs cursor-pointer bg-stone-900 border-0" asChild>
                        <Link href="/register">Simpan Selamanya &rarr;</Link>
                    </Button>
                </div>
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
