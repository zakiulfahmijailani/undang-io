"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

/* ─── Data Arrays ──────────────────────────────────────────────── */

const features = [
  {
    icon: 'auto_awesome',
    title: 'Langsung Jadi',
    desc: 'Undangan lengkap dalam 5 menit. Tanpa ribet, tanpa coding.',
  },
  {
    icon: 'palette',
    title: 'Ratusan Tema',
    desc: 'Jawa, Bali, Minang, Modern, Islami, dan masih banyak lagi.',
  },
  {
    icon: 'share',
    title: 'Bagikan via WhatsApp',
    desc: 'Satu link untuk semua tamu. Mudah, cepat, elegan.',
  },
  {
    icon: 'forum',
    title: 'RSVP & Ucapan',
    desc: 'Tamu konfirmasi kehadiran dan kirim ucapan langsung.',
  },
  {
    icon: 'schedule',
    title: 'Live Selamanya',
    desc: 'Bayar sekali, undangan aktif untuk selamanya.',
  },
  {
    icon: 'diamond',
    title: 'Desain Premium',
    desc: 'Tampilan mewah yang indah di semua perangkat.',
  },
];

const testimonials = [
  {
    name: 'Rina & Dimas',
    text: 'Undangan digitalnya cantik sekali dan sangat mudah dibuat. Tamu-tamu kami langsung terpesona!',
    location: 'Jakarta',
    initial: 'RD',
  },
  {
    name: 'Ayu & Budi',
    text: 'Hanya 5 menit dan undangan sudah jadi. Praktis dan tampilannya mewah. Sangat recommended!',
    location: 'Bandung',
    initial: 'AB',
  },
  {
    name: 'Sari & Eko',
    text: 'Tema Jawa Klasiknya membuat undangan kami terasa sangat personal dan mewah. Terima kasih undang.io!',
    location: 'Yogyakarta',
    initial: 'SE',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  
  const [themeOptions, setThemeOptions] = useState<any[]>([
    { id: 'loading-1', name: 'Loading...', img: '' },
    { id: 'loading-2', name: 'Loading...', img: '' },
    { id: 'loading-3', name: 'Loading...', img: '' },
  ]);

  useEffect(() => {
    async function loadThemes() {
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.from('themes').select('*').eq('is_published', true).limit(3);
      if (data && data.length > 0) {
        setThemeOptions(data.map((t: any) => ({
          id: t.id,
          name: t.name,
          img: t.preview_url || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=560&fit=crop&q=80'
        })));
        setSelectedTheme(data[0].id);
      }
    }
    loadThemes();
  }, []);

  const handleBegin = () => {
    router.push('/buat');
  };

  const handleQuickStart = () => {
    // Save minimal draft info
    if (groomName || brideName) {
      sessionStorage.setItem('undang_draft', JSON.stringify({
        groom_full_name: '',
        groom_name: groomName,
        bride_full_name: '',
        bride_name: brideName,
        themeId: selectedTheme
      }));
    }
    if (selectedTheme) {
      router.push(`/buat/${selectedTheme}`);
    } else {
      router.push('/buat');
    }
  };

  return (
    <div className="bg-background text-on-background selection:bg-tertiary-fixed-dim min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl bg-gradient-to-b from-slate-200/20 to-transparent shadow-none">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-primary">undang.io</div>
          <div className="hidden md:flex space-x-12 items-center font-['Inter'] tracking-tight font-medium">
            <a className="text-slate-500 hover:text-primary transition-colors cursor-pointer" href="#features">Fitur</a>
            <a className="text-slate-500 hover:text-primary transition-colors cursor-pointer" href="#pricing">Harga</a>
            <a className="text-slate-500 hover:text-primary transition-colors cursor-pointer" href="#showcase">Tema</a>
            <a className="text-slate-500 hover:text-primary transition-colors cursor-pointer" href="#testimonials">Testimoni</a>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-slate-500 hover:text-primary transition-all duration-300 font-medium scale-95 active:scale-90">Masuk</Link>
            <button 
              onClick={handleBegin}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold scale-95 active:scale-90 transition-transform hover:opacity-80 shadow-lg shadow-primary/20"
            >
              Coba Gratis
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero + Inline Quick-Start Form (AARRR: Acquisition & Activation) ── */}
        <section className="relative pt-32 pb-24 px-8 overflow-hidden min-h-[90vh] flex items-center">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Headline + Quick-Start Form */}
            <div className="lg:col-span-7 z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-surface-container-highest text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                ✪ Langsung Buat — Tanpa Daftar
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-primary tracking-tighter leading-[0.9] mb-6">
                Undangan
                <br/>
                <span className="text-on-tertiary-container italic font-light">Pernikahan</span>
                <br/>
                Digital Kamu
              </h1>
              <p className="text-xl md:text-2xl text-secondary max-w-xl leading-relaxed mb-10 font-light">
                Isi nama, pilih tema, langsung live. Gratis 15 menit.
                Bayar <span className="font-semibold text-primary">Rp 49.000</span> untuk selamanya.
              </p>

              {/* ── INLINE QUICK-START FORM ─────────────────── */}
              <div className="bg-white border border-outline-variant/10 rounded-[32px] p-6 md:p-8 shadow-2xl max-w-lg">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-600">Buat Undangan Sekarang — Gratis</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Pria</label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="Budi"
                      className="w-full px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-primary font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Wanita</label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="Ayu"
                      className="w-full px-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 text-primary font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                    />
                  </div>
                </div>

                {/* Theme Quick-Select */}
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pilih Tema</label>
                <div className="flex gap-3 mb-6">
                  {themeOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id)}
                      className={`flex-1 relative rounded-2xl overflow-hidden h-20 transition-all border-2 ${
                        selectedTheme === t.id
                          ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                          : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-1.5 left-0 right-0 text-center text-white text-[10px] font-bold tracking-wide">{t.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleQuickStart}
                  className="w-full bg-primary text-on-primary py-4 rounded-full font-black text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  🚀 Buat Undangan Gratis
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-3">Tanpa login · Live dalam 5 menit · Gratis 15 menit</p>
              </div>
            </div>

            {/* Right: Gallery Stack */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative w-full aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl rotate-3 translate-x-12 z-20">
                <img 
                  alt="Undangan Pernikahan Mewah" 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
                />
              </div>
              <div className="absolute -top-12 -left-12 w-2/3 aspect-[4/5] rounded-[40px] overflow-hidden shadow-xl -rotate-6 z-10 bg-surface-container-low border border-white/20 backdrop-blur-xl">
                <img 
                  alt="Upacara Pernikahan" 
                  className="w-full h-full object-cover opacity-80" 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
                />
              </div>
              <div className="absolute -bottom-16 right-0 w-1/2 p-6 rounded-[32px] bg-tertiary text-on-tertiary z-30 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <span className="text-xs font-bold tracking-widest uppercase">Premium Finish</span>
                </div>
                <p className="text-sm font-light opacity-90 leading-relaxed">
                  Setiap undangan dirender dengan desain mewah dan presisi tinggi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features: Kenapa undang.io ────────────────────── */}
        <section id="features" className="py-24 px-8 bg-surface-container-low border-y border-outline-variant/10">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-secondary font-black tracking-[0.3em] uppercase text-xs">Fitur Unggulan</span>
              <h2 className="text-4xl md:text-6xl font-black text-primary tracking-tighter mt-4">Kenapa undang.io</h2>
              <p className="text-secondary text-lg mt-4 max-w-2xl mx-auto leading-relaxed font-light">Semua yang kamu butuhkan untuk undangan pernikahan digital yang sempurna.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 hover:border-primary/20 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}
                    >
                      {f.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">{f.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Showcase: Bento Grid ─────────────────────────── */}
        <section id="showcase" className="py-24 px-8 bg-surface">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <span className="text-secondary font-black tracking-[0.3em] uppercase text-xs">Koleksi Tema</span>
                <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter mt-4">Tema Pilihan Editorial</h2>
                <p className="text-secondary text-lg leading-relaxed mt-4">Pilih dari koleksi kurasi yang dirancang dengan standar desain internasional.</p>
              </div>
              <button 
                onClick={handleBegin}
                className="flex items-center gap-2 text-primary font-bold group"
              >
                Lihat Semua Koleksi 
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Bento Item 1: Jawa Klasik */}
              <div className="md:col-span-2 md:row-span-2 relative group rounded-[40px] overflow-hidden bg-surface-container-lowest">
                <img 
                  alt="Tema Jawa Klasik" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase mb-3">Budaya</span>
                  <h3 className="text-3xl font-bold mb-2">Jawa Klasik</h3>
                  <p className="text-white/80 font-light">Keanggunan tradisi Jawa yang abadi.</p>
                </div>
              </div>
              {/* Bento Item 2: Bali Tropis */}
              <div className="md:col-span-2 h-[300px] relative group rounded-[40px] overflow-hidden bg-surface-container-lowest">
                <img 
                  alt="Tema Bali Tropis" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tertiary/60 via-transparent to-transparent opacity-40"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase mb-3">Budaya</span>
                  <h3 className="text-2xl font-bold">Bali Tropis</h3>
                </div>
              </div>
              {/* Bento Item 3: Modern Minimalis */}
              <div className="md:col-span-1 h-[300px] relative group rounded-[40px] overflow-hidden bg-surface-container-lowest">
                <img 
                  alt="Tema Modern Minimalis" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1522673607200-1648482ce486?w=400&q=80"
                />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase mb-2">Modern</span>
                  <h3 className="text-xl font-bold">Minimalis</h3>
                </div>
                <div className="absolute inset-0 bg-primary/20"></div>
              </div>
              {/* Bento Item 4: Botanical */}
              <div className="md:col-span-1 h-[300px] relative group rounded-[40px] overflow-hidden bg-surface-container-lowest">
                <img 
                  alt="Tema Botanical" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80"
                />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase mb-2">Nature</span>
                  <h3 className="text-xl font-bold">Botanical</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────── */}
        <section id="testimonials" className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-secondary font-black tracking-[0.3em] uppercase text-xs">Testimoni</span>
              <h2 className="text-4xl md:text-6xl font-black text-primary tracking-tighter mt-4">Kata Mereka</h2>
              <p className="text-secondary text-lg mt-4 max-w-2xl mx-auto leading-relaxed font-light">Cerita nyata dari pasangan yang sudah mempercayakan undangan digital mereka kepada undang.io.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest p-8 rounded-[32px] border border-outline-variant/10 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500"
                >
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="material-symbols-outlined text-amber-400" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-secondary text-sm leading-relaxed mb-8 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-black text-primary">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{t.name}</p>
                      <p className="text-xs text-secondary">{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing: 3-Tier ──────────────────────────────── */}
        <section id="pricing" className="py-32 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-secondary font-black tracking-[0.3em] uppercase text-xs">Investasi</span>
              <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mt-4">Simpel & Transparan</h2>
              <p className="text-secondary text-lg mt-4 max-w-xl mx-auto leading-relaxed font-light">Bayar sekali, live selamanya. Tanpa biaya tersembunyi.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Trial */}
              <div className="bg-surface-container-lowest p-10 rounded-[48px] flex flex-col hover:translate-y-[-8px] transition-transform duration-500 shadow-sm">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary mb-2">Free Trial</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary">Rp 0</span>
                    <span className="text-secondary font-medium">/15 menit</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500 scale-75">check_circle</span>
                    Preview Instan
                  </li>
                  <li className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500 scale-75">check_circle</span>
                    Semua Fitur Editor
                  </li>
                  <li className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-emerald-500 scale-75">check_circle</span>
                    Bagikan via WhatsApp
                  </li>
                  <li className="flex items-center gap-3 text-secondary opacity-40">
                    <span className="material-symbols-outlined scale-75">cancel</span>
                    Live Selamanya
                  </li>
                </ul>
                <button 
                  onClick={handleBegin}
                  className="w-full py-4 rounded-full border-2 border-outline-variant text-primary font-bold hover:bg-surface-container-high transition-colors"
                >
                  Coba Gratis
                </button>
              </div>
              {/* Full Access (Featured) */}
              <div className="bg-primary p-10 rounded-[48px] flex flex-col relative overflow-hidden shadow-2xl scale-105 z-10">
                <div className="absolute top-6 right-10 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Popular</div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-on-primary-fixed-variant mb-2">Full Access</h3>
                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-5xl font-black">Rp 49k</span>
                    <span className="text-on-primary-container font-medium">/undangan</span>
                  </div>
                  <p className="text-white/50 text-sm line-through mt-1">Rp 99.000</p>
                  <span className="inline-block mt-2 bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">HEMAT 51%</span>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Live Selamanya
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    RSVP & Buku Tamu Unlimited
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Bebas Edit Kapan Saja
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Semua Tema Premium
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Bagikan via WhatsApp
                  </li>
                </ul>
                <button 
                  onClick={handleBegin}
                  className="w-full py-5 rounded-full bg-gradient-to-r from-tertiary-fixed-dim to-[#ce9e99] text-tertiary font-black shadow-xl shadow-tertiary/40 hover:opacity-90 transition-opacity"
                >
                  Dapatkan Akses Penuh
                </button>
              </div>
              {/* Bespoke */}
              <div className="bg-surface-container-lowest p-10 rounded-[48px] flex flex-col hover:translate-y-[-8px] transition-transform duration-500 shadow-sm">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary mb-2">Bespoke</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary">Tanya</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-primary scale-75">check_circle</span>
                    Desain Kustom Eksklusif
                  </li>
                  <li className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-primary scale-75">check_circle</span>
                    Dukungan Editor Khusus
                  </li>
                  <li className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-primary scale-75">check_circle</span>
                    Koordinasi Multi-Event
                  </li>
                </ul>
                <button className="w-full py-4 rounded-full border-2 border-outline-variant text-primary font-bold hover:bg-surface-container-high transition-colors">Hubungi Kami</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────── */}
        <section className="py-24 px-8">
          <div className="max-w-5xl mx-auto rounded-[64px] bg-primary relative overflow-hidden p-16 md:p-24 text-center">
            <div className="absolute inset-0 opacity-20 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-tr from-[#ce9e99] to-transparent blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8">
                Siap buat undangan<br/>yang tak terlupakan?
              </h2>
              <p className="text-on-primary-container text-xl max-w-2xl mx-auto mb-16 font-light">Mulai gratis. Live dalam 5 menit. Tanpa coding. Bergabunglah dengan ribuan pasangan yang memilih undang.io.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button 
                  onClick={handleBegin}
                  className="bg-white text-primary px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform"
                >
                  Mulai Sekarang
                </button>
                <button 
                  onClick={() => router.push('/register')}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-colors"
                >
                  Daftar Akun
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="w-full py-12 px-8 bg-surface-container-low border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto space-y-8 md:space-y-0 text-secondary">
          <div className="text-lg font-black text-primary">undang.io</div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-light tracking-wide uppercase">
            <a className="hover:text-primary transition-colors cursor-pointer">Kebijakan Privasi</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Syarat & Ketentuan</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Kontak</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Galeri Undangan</a>
          </div>
          <div className="text-xs font-light tracking-wide">
            © 2026 undang.io — Bikin undangan pernikahan digital, langsung jadi.
          </div>
        </div>
      </footer>
    </div>
  );
}
