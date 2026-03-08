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
        <div className="min-h-screen bg-stone-50 font-sans selection:bg-gold-200">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gold-200/50 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-gold-300 to-amber-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity" />
                            <Image src="/logo.png" alt="umuman logo" width={56} height={56} className="relative w-14 h-14 object-contain" />
                        </div>
                        <span className="font-serif-wedding text-4xl font-bold bg-gradient-to-r from-gold-600 to-amber-700 bg-clip-text text-transparent tracking-tighter">umuman</span>
                    </Link>
                    <div className="hidden items-center gap-6 md:flex">
                        <Link href="#fitur" className="text-sm font-medium text-stone-600 hover:text-gold-600 transition-colors">Fitur</Link>
                        <Link href="#harga" className="text-sm font-medium text-stone-600 hover:text-gold-600 transition-colors">Harga</Link>
                        <Link href="#testimoni" className="text-sm font-medium text-stone-600 hover:text-gold-600 transition-colors">Testimoni</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="text-stone-600 hover:text-gold-600 hover:bg-gold-50 cursor-pointer">Masuk</Button>
                        </Link>
                        <Link href="/register">
                            <Button size="sm" className="bg-gradient-to-r from-gold-500 to-amber-600 text-white border-0 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:from-gold-600 hover:to-amber-700 cursor-pointer transition-all">Daftar</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] flex items-center justify-center -z-10 from-gold-50 via-stone-50 to-white" />
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gradient-to-br from-gold-300/30 to-rose-300/30 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-300/20 to-orange-300/20 blur-3xl" />

                <div className="container relative mx-auto px-4 text-center z-10">
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                        <Badge className="mb-6 bg-white text-gold-700 border border-gold-200 shadow-sm px-4 py-1.5 text-sm font-medium rounded-full">
                            <span className="mr-2">✨</span> Platform Undangan #1 di Indonesia
                        </Badge>
                    </motion.div>
                    <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
                        className="mx-auto max-w-4xl font-serif text-5xl font-extrabold leading-tight text-stone-800 md:text-6xl lg:text-7xl">
                        Buat Undangan Pernikahan <span className="bg-gradient-to-r from-gold-500 to-amber-600 bg-clip-text text-transparent">Digital</span> yang Tak Terlupakan
                    </motion.h1>
                    <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
                        className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 md:text-xl leading-relaxed">
                        Desain elegan, RSVP online, ucapan digital, dan QRIS — semua dalam satu platform yang mudah digunakan dan berkelas.
                    </motion.p>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link href="/register">
                            <Button size="lg" className="bg-gradient-to-r from-gold-500 to-amber-600 text-white text-base px-8 py-6 rounded-xl shadow-xl shadow-gold-500/25 hover:shadow-gold-500/40 hover:-translate-y-1 transition-all cursor-pointer border-0">
                                Buat Undangan Sekarang <ChevronRight className="ml-1 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/invite/demo">
                            <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:text-gold-600 shadow-sm cursor-pointer transition-all">
                                Lihat Contoh Undangan
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section id="fitur" className="py-20 md:py-28 relative bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-stone-800 md:text-4xl">Semua yang Kamu Butuhkan</h2>
                        <p className="mt-4 text-stone-600 text-lg">Fitur lengkap untuk undangan pernikahan digital yang sempurna dan profesional</p>
                    </div>
                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((f, i) => (
                            <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} custom={i}>
                                <Card className="h-full border border-stone-100 bg-white shadow-md shadow-stone-200/50 hover:shadow-xl hover:shadow-gold-500/10 hover:-translate-y-2 transition-all duration-300 rounded-2xl group">
                                    <CardHeader>
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-100 to-amber-50 group-hover:scale-110 transition-transform">
                                            <f.icon className="h-7 w-7 text-gold-600 drop-shadow-sm" />
                                        </div>
                                        <CardTitle className="font-serif text-2xl text-stone-800">{f.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-stone-600 leading-relaxed">{f.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="harga" className="bg-stone-50 border-y border-stone-100 py-20 md:py-32 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 h-[500px] w-[500px] bg-rose-50/50 rounded-full blur-3xl pointer-events-none" />
                <div className="container relative mx-auto px-4 z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-stone-800 md:text-4xl">Pilih Paket yang Tepat</h2>
                        <p className="mt-4 text-stone-600 text-lg">Harga terjangkau untuk momen sekali seumur hidupmu</p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-3 md:items-center">
                        {pricing.map((p, i) => (
                            <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} custom={i}>
                                <Card className={`relative h-full flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${p.popular ? "border-gold-300 shadow-2xl shadow-gold-900/10 bg-white md:scale-105 z-10" : "border-stone-200 bg-white/60 backdrop-blur shadow-lg shadow-stone-200/50 hover:bg-white"}`}>
                                    {p.popular && (
                                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gold-500 to-amber-600 py-2 text-center text-xs font-bold text-white uppercase tracking-wider">
                                            🌟 Paling Populer
                                        </div>
                                    )}
                                    <div className={p.popular ? "pt-6" : ""}></div>
                                    <CardHeader className="text-center pt-8 pb-4">
                                        <CardTitle className="font-serif text-2xl text-stone-800">{p.name}</CardTitle>
                                        <CardDescription className="text-stone-500 mt-2">{p.desc}</CardDescription>
                                        <div className="mt-6">
                                            <span className="font-sans text-5xl font-extrabold text-stone-900 tracking-tight">{p.price}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 px-8">
                                        <ul className="space-y-4 mt-4">
                                            {p.features.map((feat) => (
                                                <li key={feat} className="flex items-start gap-3 text-sm text-stone-600">
                                                    <div className={`mt-0.5 rounded-full p-1 ${p.popular ? "bg-gold-100 text-gold-600" : "bg-stone-100 text-stone-500"}`}>
                                                        <Check className="h-3 w-3 flex-shrink-0" strokeWidth={3} />
                                                    </div>
                                                    <span className="leading-tight">{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <div className="p-8 pt-6 mt-auto">
                                        <Link href="/register" className="w-full block">
                                            <Button className={`w-full py-6 rounded-xl text-base font-semibold cursor-pointer shadow-md transition-all ${p.popular
                                                    ? "bg-gradient-to-r from-gold-500 to-amber-600 text-white border-0 hover:shadow-lg hover:shadow-gold-500/30 hover:-translate-y-0.5"
                                                    : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:border-stone-300"
                                                }`}
                                                variant={p.popular ? "default" : "outline"}>
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
            <section id="testimoni" className="py-20 md:py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="font-serif text-3xl font-bold text-stone-800 md:text-4xl">Cerita Bahagia Mereka</h2>
                        <p className="mt-4 text-stone-600 text-lg">Pasangan yang telah mempercayakan undangan digitalnya kepada umuman</p>
                    </div>
                    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {testimonials.map((t, i) => (
                            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={i}>
                                <Card className="h-full border-stone-100 bg-stone-50 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 rounded-2xl relative">
                                    <div className="absolute top-6 right-6 text-gold-200 font-serif text-6xl leading-none">"</div>
                                    <CardContent className="pt-8 pb-6 px-6 relative z-10">
                                        <div className="mb-5 flex gap-1">
                                            {[...Array(5)].map((_, j) => (
                                                <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                                            ))}
                                        </div>
                                        <p className="text-base text-stone-700 italic leading-relaxed mb-6 block">"{t.quote}"</p>
                                        <div className="mt-auto flex items-center gap-4 pt-4 border-t border-stone-200/60">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold-100 to-amber-100 font-serif text-base font-bold text-gold-700 shadow-inner">
                                                {t.avatar}
                                            </div>
                                            <span className="text-sm font-bold text-stone-800 tracking-wide uppercase">{t.name}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-600 via-amber-600 to-orange-600" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay" />

                <div className="container relative mx-auto px-4 text-center z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto backdrop-blur-sm bg-white/10 p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
                        <h2 className="font-serif text-4xl font-bold text-white md:text-5xl leading-tight">
                            Siap Membuat Undangan Impianmu?
                        </h2>
                        <p className="mt-6 text-white/90 text-xl font-light">
                            Mulai sekarang — gratis selamanya untuk versi basic, tanpa kartu kredit.
                        </p>
                        <div className="mt-10">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-gold-700 hover:bg-stone-50 hover:text-amber-600 text-lg px-10 py-7 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-0 font-bold">
                                    Buat Undangan Sekarang <ChevronRight className="ml-2 h-6 w-6 stroke-[3]" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-900 pt-16 pb-8 text-stone-400">
                <div className="container mx-auto px-4">
                    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white p-1.5 rounded-xl">
                                    <Image src="/logo.png" alt="umuman logo" width={40} height={40} className="w-10 h-10 object-contain" />
                                </div>
                                <h3 className="font-serif-wedding text-4xl font-bold text-white tracking-tighter">umuman</h3>
                            </div>
                            <p className="text-sm text-stone-400 leading-relaxed pr-6">Platform undangan pernikahan digital terpercaya di Indonesia dengan desain premium dan fitur terlengkap.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-sm">Produk</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="#fitur" className="hover:text-gold-400 transition-colors">Fitur</Link></li>
                                <li><Link href="#harga" className="hover:text-gold-400 transition-colors">Harga</Link></li>
                                <li><Link href="/invite/demo" className="hover:text-gold-400 transition-colors">Contoh Undangan</Link></li>
                                <li><Link href="/themes" className="hover:text-gold-400 transition-colors">Galeri Tema</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-sm">Perusahaan</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="#" className="hover:text-gold-400 transition-colors">Tentang Kami</Link></li>
                                <li><Link href="#" className="hover:text-gold-400 transition-colors">Karir</Link></li>
                                <li><Link href="#" className="hover:text-gold-400 transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-gold-400 transition-colors">Media Kit</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-5 uppercase tracking-wider text-sm">Bantuan</h4>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="#" className="hover:text-gold-400 transition-colors">FAQ</Link></li>
                                <li><Link href="#" className="hover:text-gold-400 transition-colors">Hubungi Kami</Link></li>
                                <li><Link href="#" className="hover:text-gold-400 transition-colors">Syarat & Ketentuan</Link></li>
                                <li><Link href="#" className="hover:text-gold-400 transition-colors">Kebijakan Privasi</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                        <p>© 2026 umuman. Semua hak dilindungi.</p>
                        <p>Dibuat dengan ❤️ di Indonesia</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
