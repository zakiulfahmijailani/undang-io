"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles, Clock, Palette, Share2, MessageSquare, ChevronRight, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  { icon: Sparkles, title: 'Langsung Jadi', desc: 'Buat undangan lengkap dalam 5 menit. Tanpa ribet, tanpa coding.' },
  { icon: Palette, title: 'Ratusan Tema Budaya', desc: 'Tema Jawa, Bali, Minang, Modern, Islami, dan lainnya.' },
  { icon: Share2, title: 'Bagikan via WhatsApp', desc: 'Satu link untuk semua tamu. Bisa langsung dibagikan.' },
  { icon: MessageSquare, title: 'RSVP & Ucapan', desc: 'Tamu bisa konfirmasi kehadiran dan kirim ucapan langsung.' },
  { icon: Clock, title: 'Live Selamanya', desc: 'Bayar sekali, undangan aktif selamanya. Tanpa biaya bulanan.' },
  { icon: Heart, title: 'Desain Elegan', desc: 'Tampilan premium yang indah di semua perangkat.' },
];

const testimonials = [
  { name: 'Rina & Dimas', text: 'Undangan digitalnya cantik banget dan gampang dibuat. Tamu-tamu kami langsung kagum!', location: 'Jakarta' },
  { name: 'Ayu & Budi', text: 'Cuma 5 menit dan undangan sudah jadi. Praktis banget!', location: 'Bandung' },
  { name: 'Sari & Eko', text: 'Tema Jawa Klasiknya bikin undangan kami terasa mewah dan personal.', location: 'Yogyakarta' },
];

const activeThemes = [
  {
    id: 'theme-jawa-klasik',
    name: 'Jawa Klasik',
    description: 'Tema undangan dengan nuansa Jawa klasik, ornamen batik, dan warna emas-cokelat.',
    culturalCategory: 'jawa',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=338&h=600&fit=crop'
  },
  {
    id: 'theme-bali-tropis',
    name: 'Bali Tropis',
    description: 'Nuansa tropis Bali dengan hijau daun, bunga frangipani, dan suasana pantai.',
    culturalCategory: 'bali',
    thumbnailUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=338&h=600&fit=crop'
  },
  {
    id: 'theme-modern-minimalis',
    name: 'Modern Minimalis',
    description: 'Desain bersih dan modern dengan tipografi elegan dan palet netral.',
    culturalCategory: 'minimalis',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=338&h=600&fit=crop'
  }
];

export default function Index() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-accent" fill="currentColor" />
            <span className="text-xl font-bold text-foreground">undang<span className="text-accent">.io</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Daftar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4 text-sm font-medium">
                ✨ Coba Gratis — Tanpa Daftar
              </Badge>
              <h1 className="mb-4 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Bikin Undangan Pernikahan Digital Kamu Sekarang
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Tanpa daftar, langsung coba. Undangan live 15 menit gratis.
                Bayar sekali <span className="font-semibold text-foreground">Rp 49.000</span>, live selamanya.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2 text-base cursor-pointer" onClick={() => router.push('/buat-undangan')}>
                  Mulai Buat Undangan
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="secondary" className="gap-2 text-base cursor-pointer" onClick={() => router.push('/invite/demo')}>
                  Lihat Contoh
                </Button>
              </div>
            </div>

            {/* CTA Card */}
            <Card className="relative overflow-hidden border-accent/30 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5" />
              <CardContent className="relative p-8">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <span className="font-semibold text-foreground">Coba Gratis Sekarang</span>
                </div>
                <p className="mb-6 text-muted-foreground">
                  Buat undangan lengkap dalam 5 menit — tanpa daftar, tanpa login
                </p>
                <Badge variant="outline" className="mb-6 border-accent/40 text-accent">
                  <Clock className="mr-1 h-3 w-3" /> Undangan live selama 15 menit
                </Badge>
                <div className="space-y-3">
                  {['Pilih dari ratusan tema elegan', 'Isi data mempelai & acara', 'Langsung publish & bagikan'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-accent" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button className="mt-6 w-full gap-2 text-base cursor-pointer" size="lg" onClick={() => router.push('/buat-undangan')}>
                  Mulai Buat Undangan →
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Hanya <span className="font-semibold text-foreground">Rp 49.000</span>{' '}
                  <span className="line-through">Rp 99.000</span> untuk live selamanya
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Theme Previews */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-serif text-3xl font-bold text-foreground">Tema Pilihan</h2>
            <p className="text-muted-foreground">Pilih tema yang sesuai dengan gaya pernikahanmu</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeThemes.map(theme => (
              <Card key={theme.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                <div className="aspect-[9/16] max-h-64 overflow-hidden">
                  <img
                    src={theme.thumbnailUrl || '/placeholder.svg'}
                    alt={theme.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">{theme.culturalCategory}</Badge>
                    <span className="text-sm font-semibold text-foreground">
                      Rp 49.000 <span className="text-xs text-muted-foreground line-through">Rp 99.000</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="secondary" size="lg" className="cursor-pointer" onClick={() => router.push('/buat-undangan')}>
              Lihat Semua Tema
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-serif text-3xl font-bold text-foreground">Kenapa undang.io?</h2>
            <p className="text-muted-foreground">Semua yang kamu butuhkan untuk undangan pernikahan digital</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Card key={i} className="border-transparent bg-muted/50 transition-colors hover:border-accent/20 hover:bg-card">
                <CardContent className="p-6">
                  <f.icon className="mb-3 h-8 w-8 text-accent" />
                  <h3 className="mb-1 font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-md px-4 text-center">
          <h2 className="mb-2 font-serif text-3xl font-bold text-foreground">Harga Simpel</h2>
          <p className="mb-8 text-muted-foreground">Bayar sekali, undangan live selamanya</p>
          <Card className="overflow-hidden border-accent/30 shadow-lg">
            <div className="bg-primary p-6 text-primary-foreground">
              <p className="text-sm opacity-80">Per undangan</p>
              <div className="mt-1 flex items-baseline justify-center gap-2">
                <span className="text-4xl font-bold">Rp 49.000</span>
                <span className="text-lg line-through opacity-60">Rp 99.000</span>
              </div>
              <Badge className="mt-2 text-accent-foreground" style={{ backgroundColor: 'hsl(var(--accent))' }}>Hemat 51%</Badge>
            </div>
            <CardContent className="p-6">
              <ul className="space-y-3 text-left text-sm">
                {[
                  'Undangan live selamanya',
                  'Tersimpan di akun kamu',
                  'Link undangan permanen',
                  'Bebas edit kapan saja',
                  'RSVP & ucapan tamu',
                  'Ratusan tema premium',
                  'Bagikan via WhatsApp',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground">
                    <Check className="h-4 w-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full cursor-pointer" size="lg" onClick={() => router.push('/buat-undangan')}>
                Buat Undangan Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-serif text-3xl font-bold text-foreground">Kata Mereka</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="mb-3 flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">"{t.text}"</p>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-primary py-10 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" fill="currentColor" />
              <span className="text-lg font-bold">undang<span className="text-accent">.io</span></span>
            </div>
            <p className="text-sm opacity-70">
              © 2026 undang.io — Bikin undangan pernikahan digital, langsung jadi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
