"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart, Sparkles, Clock, Palette, Share2,
  MessageSquare, ChevronRight, Star, Check, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  { icon: Sparkles, title: 'Langsung Jadi',       desc: 'Undangan lengkap dalam 5 menit. Tanpa ribet, tanpa coding.' },
  { icon: Palette,  title: 'Ratusan Tema',         desc: 'Jawa, Bali, Minang, Modern, Islami, dan masih banyak lagi.' },
  { icon: Share2,   title: 'Bagikan via WhatsApp', desc: 'Satu link untuk semua tamu. Mudah, cepat, elegan.' },
  { icon: MessageSquare, title: 'RSVP & Ucapan',  desc: 'Tamu konfirmasi kehadiran dan kirim ucapan langsung.' },
  { icon: Clock,    title: 'Live Selamanya',        desc: 'Bayar sekali, undangan aktif untuk selamanya.' },
  { icon: Heart,    title: 'Desain Premium',        desc: 'Tampilan mewah yang indah di semua perangkat.' },
];

const testimonials = [
  { name: 'Rina & Dimas', text: 'Undangan digitalnya cantik sekali dan sangat mudah dibuat. Tamu-tamu kami langsung terpesona!', location: 'Jakarta', initial: 'RD' },
  { name: 'Ayu & Budi',   text: 'Hanya 5 menit dan undangan sudah jadi. Praktis dan tampilannya mewah.', location: 'Bandung', initial: 'AB' },
  { name: 'Sari & Eko',   text: 'Tema Jawa Klasiknya membuat undangan kami terasa sangat personal dan mewah.', location: 'Yogyakarta', initial: 'SE' },
];

const themes = [
  { id: 'jawa',    name: 'Jawa Klasik',       cat: 'Budaya',   img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=560&fit=crop&q=80' },
  { id: 'bali',    name: 'Bali Tropis',        cat: 'Budaya',   img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=560&fit=crop&q=80' },
  { id: 'modern',  name: 'Modern Minimalis',   cat: 'Modern',   img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=560&fit=crop&q=80' },
];

const pricing = [
  'Undangan live selamanya',
  'Link undangan permanen',
  'Bebas edit kapan saja',
  'RSVP & ucapan tamu',
  'Ratusan tema premium',
  'Bagikan via WhatsApp',
  'Tersimpan di akun kamu',
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#1E1B18]">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 h-16 flex items-center border-b border-[#EDE6D6] bg-[#FDFCF9]/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1E1B18] flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-[#D4A91C]" fill="currentColor" />
            </div>
            <span className="font-display text-lg font-medium tracking-tight">
              undang<span className="text-[#D4A91C]">.io</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-sm text-[#4A4540] hover:text-[#1E1B18]" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" className="bg-[#1E1B18] text-[#FDFCF9] hover:bg-[#302C28] rounded-full px-5 text-sm" asChild>
              <Link href="/register">Mulai Gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        {/* subtle grain overlay */}
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-60" />
        {/* warm gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F5F0E8]/60 via-transparent to-[#FAF8F3]/40" />

        <div className="relative mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* Left: Headline */}
            <div className="animate-fade-in-up">
              <Badge className="mb-6 bg-[#F5F0E8] text-[#7D5C0C] border-[#D4A91C]/30 font-medium tracking-wide text-xs px-3 py-1.5 rounded-full">
                ✦ Coba Gratis — Tanpa Daftar
              </Badge>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.06] tracking-tight text-[#1E1B18] mb-6">
                Undangan
                <br />
                <em className="not-italic text-gold-gradient">Pernikahan</em>
                <br />
                Digital Kamu
              </h1>
              <p className="text-[#726C67] text-lg md:text-xl leading-relaxed mb-10 max-w-md">
                Buat, publish, dan bagikan undangan elegan dalam 5 menit.
                Bayar sekali <span className="font-semibold text-[#1E1B18]">Rp 49.000</span>, live selamanya.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => router.push('/buat-undangan')}
                  className="bg-[#1E1B18] hover:bg-[#302C28] text-[#FDFCF9] rounded-full px-8 py-3 h-auto text-base font-medium gap-2 group shadow-lg"
                >
                  Mulai Buat Undangan
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  onClick={() => router.push('/invite/demo')}
                  variant="outline"
                  className="rounded-full px-8 py-3 h-auto text-base border-[#EDE6D6] hover:border-[#D4A91C] hover:bg-[#FDFCF9] text-[#1E1B18]"
                >
                  Lihat Contoh
                </Button>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['RD','AB','SE','KW','FH'].map((i,n) => (
                    <div key={n} className="w-8 h-8 rounded-full bg-[#EDE6D6] border-2 border-[#FDFCF9] flex items-center justify-center text-[9px] font-bold text-[#4A4540]">{i}</div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-0.5">{[...Array(5)].map((_,j)=><Star key={j} className="w-3 h-3 fill-[#D4A91C] text-[#D4A91C]" />)}</div>
                  <p className="text-xs text-[#726C67]">1,200+ pasangan sudah memakai undang.io</p>
                </div>
              </div>
            </div>

            {/* Right: Floating card preview */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in">
              <div className="relative w-64 md:w-72">
                {/* Main card */}
                <div className="card-glass rounded-3xl overflow-hidden shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=560&fit=crop&q=80"
                    alt="Contoh undangan"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-5">
                    <p className="text-xs text-[#726C67] tracking-widest uppercase mb-1">The Wedding of</p>
                    <p className="font-script text-3xl text-[#1E1B18]">Rina & Dimas</p>
                    <p className="text-xs text-[#726C67] mt-1">15 Maret 2026 · Yogyakarta</p>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-6 card-glass rounded-2xl px-4 py-3 shadow-lg animate-float">
                  <p className="text-xs font-semibold text-[#1E1B18]">✓ Live dalam 5 menit</p>
                </div>
                {/* Floating stat */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-[#1E1B18] flex flex-col items-center justify-center shadow-xl">
                  <p className="text-lg font-bold text-[#D4A91C] leading-none">49k</p>
                  <p className="text-[8px] text-[#FDFCF9]/70 mt-0.5">Rp saja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Theme Strip ────────────────────────────────────── */}
      <section className="border-y border-[#EDE6D6] py-16 bg-[#FAF8F3]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center mb-12">
            <p className="text-overline text-[#D4A91C] mb-3">Koleksi Tema</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#1E1B18]">Pilih Gaya Kamu</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {themes.map(t => (
              <div key={t.id} className="group card-luxury overflow-hidden cursor-pointer" onClick={() => router.push('/buat-undangan')}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className="bg-[#D4A91C] text-[#1E1B18] text-[10px] px-2 py-0.5 font-semibold mb-2">{t.cat}</Badge>
                    <p className="text-white font-display text-2xl font-light">{t.name}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#1E1B18]">Rp 49.000</span>
                  <ChevronRight className="w-4 h-4 text-[#D4A91C] transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button variant="outline" className="rounded-full px-8 border-[#D4A91C]/40 text-[#7D5C0C] hover:bg-[#FAF8F3]" onClick={() => router.push('/buat-undangan')}>
              Lihat Semua Tema
            </Button>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center mb-14">
            <p className="text-overline text-[#D4A91C] mb-3">Kenapa undang.io</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#1E1B18]">Semua yang Kamu Butuhkan</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={i} className="group p-7 rounded-2xl border border-[#EDE6D6] bg-white hover:border-[#D4A91C]/50 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-[#F5F0E8] flex items-center justify-center mb-5 group-hover:bg-[#D4A91C]/10 transition-colors">
                  <f.icon className="w-5 h-5 text-[#D4A91C]" />
                </div>
                <h3 className="font-semibold text-[#1E1B18] mb-2">{f.title}</h3>
                <p className="text-sm text-[#726C67] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section className="py-20 bg-[#1E1B18]">
        <div className="mx-auto max-w-md px-5 text-center">
          <p className="text-overline text-[#D4A91C] mb-4">Harga</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#FDFCF9] mb-12">Simpel & Transparan</h2>
          <div className="rounded-3xl overflow-hidden border border-white/10">
            {/* Header */}
            <div className="bg-[#D4A91C] px-8 pt-10 pb-8 text-center">
              <p className="text-xs uppercase tracking-widest text-[#1E1B18]/70 mb-2">Per Undangan</p>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="font-display text-5xl font-light text-[#1E1B18]">Rp 49.000</span>
              </div>
              <p className="text-sm text-[#1E1B18]/60 line-through">Rp 99.000</p>
              <span className="inline-block mt-3 bg-[#1E1B18] text-[#D4A91C] text-xs font-bold px-3 py-1 rounded-full">HEMAT 51%</span>
            </div>
            {/* Features list */}
            <div className="bg-white px-8 py-8">
              <ul className="space-y-4 text-left">
                {pricing.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#D4A91C]/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#D4A91C]" strokeWidth={2.5} />
                    </div>
                    <span className="text-[#1E1B18]">{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full bg-[#1E1B18] hover:bg-[#302C28] text-[#FDFCF9] rounded-full py-3 h-auto text-base font-medium"
                onClick={() => router.push('/buat-undangan')}
              >
                Buat Undangan Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F3]">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center mb-14">
            <p className="text-overline text-[#D4A91C] mb-3">Testimoni</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-[#1E1B18]">Kata Mereka</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 border border-[#EDE6D6] hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_,j) => <Star key={j} className="w-4 h-4 fill-[#D4A91C] text-[#D4A91C]" />)}
                </div>
                <p className="text-[#4A4540] text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#EDE6D6] flex items-center justify-center text-xs font-bold text-[#4A4540]">{t.initial}</div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E1B18]">{t.name}</p>
                    <p className="text-xs text-[#726C67]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="py-20 border-t border-[#EDE6D6]">
        <div className="mx-auto max-w-2xl px-5 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-light text-[#1E1B18] mb-4">
            Siap buat undangan
            <br />
            <em className="not-italic text-gold-gradient">yang tak terlupakan?</em>
          </h2>
          <p className="text-[#726C67] mb-8">Mulai gratis. Live dalam 5 menit. Tak perlu coding.</p>
          <Button
            className="bg-[#1E1B18] hover:bg-[#302C28] text-[#FDFCF9] rounded-full px-10 py-3.5 h-auto text-base font-medium gap-2 group shadow-lg"
            onClick={() => router.push('/buat-undangan')}
          >
            Mulai Sekarang
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-[#EDE6D6] bg-[#1E1B18] py-10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#D4A91C]/20 flex items-center justify-center">
                <Heart className="w-3 h-3 text-[#D4A91C]" fill="currentColor" />
              </div>
              <span className="font-display text-lg font-medium text-[#FDFCF9]">
                undang<span className="text-[#D4A91C]">.io</span>
              </span>
            </div>
            <p className="text-sm text-[#FDFCF9]/40">
              © 2026 undang.io — Bikin undangan pernikahan digital, langsung jadi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
