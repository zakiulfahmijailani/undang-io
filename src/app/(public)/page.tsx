"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Heart, MessageSquare, QrCode, Send, Star, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    { icon: Heart, title: "Desain Elegan", desc: "Pilihan tema undangan romantis yang bisa dikustomisasi sesuai selera Anda." },
    { icon: Send, title: "RSVP Online", desc: "Tamu bisa konfirmasi kehadiran langsung dari undangan digital." },
    { icon: MessageSquare, title: "Ucapan Digital", desc: "Terima ucapan & doa dari tamu dalam satu halaman yang indah." },
    { icon: QrCode, title: "QRIS & Amplop Digital", desc: "Terima hadiah digital dengan mudah melalui QRIS atau transfer." },
];

const pricing = [
    {
        name: "Gratis",
        price: "Rp 0",
        desc: "Mulai buat undangan tanpa biaya",
        features: ["1 desain template", "50 tamu undangan", "RSVP online", "Ucapan digital"],
        cta: "Mulai Gratis",
        popular: false,
    },
    {
        name: "Premium",
        price: "Rp 99rb",
        desc: "Fitur lengkap untuk hari spesialmu",
        features: ["10+ desain premium", "Tamu unlimited", "RSVP online", "Ucapan digital", "QRIS & amplop digital", "Custom domain", "Musik latar"],
        cta: "Pilih Premium",
        popular: true,
    },
    {
        name: "Eksklusif",
        price: "Rp 249rb",
        desc: "Pengalaman paling mewah & personal",
        features: ["Semua fitur Premium", "Desain kustom eksklusif", "Video undangan", "Gallery foto unlimited", "Prioritas support", "Analitik lengkap", "Countdown timer"],
        cta: "Pilih Eksklusif",
        popular: false,
    },
];

const testimonials = [
    { name: "Rina & Dimas", quote: "Undangan digitalnya cantik banget! Tamu-tamu kami kagum dengan desainnya.", avatar: "RD" },
    { name: "Sari & Budi", quote: "Fitur RSVP online sangat membantu kami menghitung jumlah tamu. Praktis!", avatar: "SB" },
    { name: "Maya & Eko", quote: "QRIS-nya memudahkan tamu yang ingin memberi hadiah. Recommended!", avatar: "ME" },
    { name: "Lina & Andi", quote: "Proses pembuatannya cepat dan hasilnya sangat profesional. Terima kasih umuman!", avatar: "LA" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-4">
                        <Image src="/logo.png" alt="umuman logo" width={56} height={56} className="w-14 h-14 object-contain" />
                        <span className="font-serif text-4xl font-bold text-primary tracking-tighter">umuman</span>
                    </Link>
                    <div className="hidden items-center gap-6 md:flex">
                        <Link href="#fitur" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fitur</Link>
                        <Link href="#harga" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Harga</Link>
                        <Link href="#testimoni" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimoni</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Masuk</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Daftar</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent/30" />
                <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-10 left-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
                <div className="container relative mx-auto px-4 text-center">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                        <Badge className="mb-6 bg-secondary text-secondary-foreground border-primary/20">✨ Platform Undangan #1 di Indonesia</Badge>
                    </motion.div>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
                        className="mx-auto max-w-4xl font-serif text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
                        Buat Undangan Pernikahan <span className="text-primary">Digital</span> yang Tak Terlupakan
                    </motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
                        className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                        Desain elegan, RSVP online, ucapan digital, dan QRIS — semua dalam satu platform yang mudah digunakan.
                    </motion.p>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link href="/register">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 shadow-lg shadow-primary/25">
                                Buat Undangan Sekarang <ChevronRight className="ml-1 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/u/demo">
                            <Button size="lg" variant="secondary" className="text-base px-8 py-6">
                                Lihat Contoh Undangan
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section id="fitur" className="py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">Semua yang Kamu Butuhkan</h2>
                        <p className="mt-3 text-muted-foreground">Fitur lengkap untuk undangan pernikahan digital yang sempurna</p>
                    </div>
                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((f, i) => (
                            <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <Card className="h-full border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                    <CardHeader>
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                            <f.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="font-serif text-xl">{f.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{f.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="harga" className="bg-secondary/30 py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">Pilih Paket yang Tepat</h2>
                        <p className="mt-3 text-muted-foreground">Harga terjangkau untuk hari bahagiamu</p>
                    </div>
                    <div className="mt-14 grid gap-8 md:grid-cols-3">
                        {pricing.map((p, i) => (
                            <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <Card className={`relative h-full flex flex-col ${p.popular ? "border-primary shadow-xl shadow-primary/10 scale-105" : "border-border/50"}`}>
                                    {p.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <Badge className="bg-primary text-primary-foreground">Paling Populer</Badge>
                                        </div>
                                    )}
                                    <CardHeader className="text-center">
                                        <CardTitle className="font-serif text-2xl">{p.name}</CardTitle>
                                        <CardDescription>{p.desc}</CardDescription>
                                        <div className="mt-4">
                                            <span className="font-serif text-4xl font-bold text-foreground">{p.price}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-3">
                                            {p.features.map((feat) => (
                                                <li key={feat} className="flex items-center gap-2 text-sm">
                                                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <div className="p-6 pt-0">
                                        <Link href="/register" className="w-full">
                                            <Button className={`w-full ${p.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                                                variant={p.popular ? "primary" : "secondary"}>
                                                {p.cta}
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimoni" className="py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl font-bold md:text-4xl">Cerita Bahagia Mereka</h2>
                        <p className="mt-3 text-muted-foreground">Pasangan yang telah mempercayakan undangan digitalnya kepada umuman</p>
                    </div>
                    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {testimonials.map((t, i) => (
                            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <Card className="h-full border-border/50">
                                    <CardContent className="pt-6">
                                        <div className="mb-4 flex gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-serif text-sm font-bold text-primary">
                                                {t.avatar}
                                            </div>
                                            <span className="text-sm font-medium">{t.name}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-primary/90 to-primary py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="font-serif text-3xl font-bold text-primary-foreground md:text-4xl">
                        Siap Membuat Undangan Impianmu?
                    </h2>
                    <p className="mt-4 text-primary-foreground/80 text-lg">
                        Mulai sekarang — gratis, tanpa kartu kredit.
                    </p>
                    <Link href="/register">
                        <Button size="lg" variant="secondary" className="mt-8 text-base px-8 py-6 shadow-lg">
                            Buat Undangan Sekarang <ChevronRight className="ml-1 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <Image src="/logo.png" alt="umuman logo" width={48} height={48} className="w-12 h-12 object-contain" />
                                <h3 className="font-serif text-3xl font-bold text-primary">umuman</h3>
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground">Platform undangan pernikahan digital terpercaya di Indonesia.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Produk</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#fitur" className="hover:text-foreground transition-colors">Fitur</Link></li>
                                <li><Link href="#harga" className="hover:text-foreground transition-colors">Harga</Link></li>
                                <li><Link href="/u/demo" className="hover:text-foreground transition-colors">Contoh Undangan</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Perusahaan</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-foreground transition-colors">Tentang Kami</Link></li>
                                <li><Link href="#" className="hover:text-foreground transition-colors">Karir</Link></li>
                                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3">Bantuan</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
                                <li><Link href="#" className="hover:text-foreground transition-colors">Hubungi Kami</Link></li>
                                <li><Link href="#" className="hover:text-foreground transition-colors">Kebijakan Privasi</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
                        © 2026 umuman. Semua hak dilindungi.
                    </div>
                </div>
            </footer>
        </div>
    );
}
