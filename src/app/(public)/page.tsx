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
    router.push('/buat-undangan');
  };

  const scrollToForm = () => {
    document.getElementById('quick-start')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickStart = () => {
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
      router.push(`/buat-undangan?theme=${selectedTheme}`);
    } else {
      router.push('/buat-undangan');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FDF2F8', color: '#831843', fontFamily: "'Cormorant Infant', Georgia, serif" }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50" style={{ backgroundColor: 'rgba(253,242,248,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #FBCFE8' }}>
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-xl mx-auto">
          {/* Logo — Great Vibes */}
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2rem', color: '#DB2777', lineHeight: 1 }}>
            undang.io
          </div>
          <div className="hidden md:flex space-x-10 items-center" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', fontWeight: 500 }}>
            <a className="transition-colors cursor-pointer hover:text-pink-600" style={{ color: '#BE185D' }} href="#features">Fitur</a>
            <a className="transition-colors cursor-pointer hover:text-pink-600" style={{ color: '#BE185D' }} href="#pricing">Harga</a>
            <a className="transition-colors cursor-pointer hover:text-pink-600" style={{ color: '#BE185D' }} href="#showcase">Tema</a>
            <a className="transition-colors cursor-pointer hover:text-pink-600" style={{ color: '#BE185D' }} href="#testimonials">Testimoni</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="transition-colors font-medium" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', color: '#BE185D' }}>Masuk</Link>
            <button
              onClick={scrollToForm}
              className="transition-all duration-200 cursor-pointer"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#CA8A04', color: '#FFFFFF', padding: '10px 24px', borderRadius: '999px', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 12px rgba(202,138,4,0.25)' }}
            >
              Buat Undangan
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ──────────────────────────────────────────── */}
        <section id="quick-start" className="relative pt-32 pb-24 px-8 overflow-hidden min-h-[90vh] flex items-center">
          {/* Soft floral background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.15) 0%, transparent 70%)' }} />
            <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(202,138,4,0.10) 0%, transparent 70%)' }} />
          </div>

          <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left: Headline + Quick-Start Form */}
            <div className="lg:col-span-7">
              {/* Overline badge */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full" style={{ background: '#FCE7F3', border: '1px solid #FBCFE8' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#DB2777' }} />
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#DB2777', textTransform: 'uppercase' }}>Langsung Buat — Tanpa Daftar</span>
              </div>

              {/* Headline — mix Great Vibes + body */}
              <h1 className="mb-6" style={{ lineHeight: 1.1 }}>
                <span className="block" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#831843' }}>Undangan</span>
                <span className="block" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(3.5rem,9vw,7rem)', color: '#DB2777', lineHeight: 1.0 }}>Pernikahan</span>
                <span className="block" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#831843' }}>Digital Kamu</span>
              </h1>

              <p className="mb-10" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.25rem', color: '#BE185D', maxWidth: '480px', lineHeight: 1.7, fontWeight: 400 }}>
                Isi nama, pilih tema, langsung live. Gratis 25 menit.
                Bayar <strong style={{ color: '#DB2777', fontWeight: 700 }}>Rp 49.000</strong> untuk selamanya.
              </p>

              {/* Quick-Start Form */}
              <div className="max-w-lg rounded-3xl p-6 md:p-8" style={{ background: '#FFFFFF', border: '1px solid #FBCFE8', boxShadow: '0 10px 40px rgba(219,39,119,0.10)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#16A34A', textTransform: 'uppercase' }}>Buat Undangan Sekarang — Gratis</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, color: '#BE185D', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Nama Pria</label>
                    <input
                      type="text"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      placeholder="Budi"
                      className="w-full transition-all"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #FBCFE8', fontFamily: "'Inter', system-ui, sans-serif", fontSize: '15px', color: '#831843', background: '#FDF2F8', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#DB2777'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(219,39,119,0.12)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#FBCFE8'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, color: '#BE185D', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Nama Wanita</label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      placeholder="Ayu"
                      className="w-full transition-all"
                      style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #FBCFE8', fontFamily: "'Inter', system-ui, sans-serif", fontSize: '15px', color: '#831843', background: '#FDF2F8', outline: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#DB2777'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(219,39,119,0.12)'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#FBCFE8'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                <label className="block mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, color: '#BE185D', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pilih Tema</label>
                <div className="flex gap-3 mb-6">
                  {themeOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTheme(t.id)}
                      className="flex-1 relative overflow-hidden transition-all cursor-pointer"
                      style={{
                        height: '80px',
                        borderRadius: '12px',
                        border: selectedTheme === t.id ? '2px solid #DB2777' : '2px solid #FBCFE8',
                        boxShadow: selectedTheme === t.id ? '0 4px 12px rgba(219,39,119,0.20)' : 'none',
                        opacity: selectedTheme === t.id ? 1 : 0.65,
                        transform: selectedTheme === t.id ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(131,24,67,0.6), transparent)' }} />
                      <span className="absolute bottom-1.5 left-0 right-0 text-center text-white" style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }}>{t.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleQuickStart}
                  className="w-full transition-all duration-200 cursor-pointer"
                  style={{ background: '#CA8A04', color: '#FFFFFF', padding: '16px', borderRadius: '999px', fontWeight: 700, fontSize: '15px', fontFamily: "'Inter', system-ui, sans-serif", boxShadow: '0 4px 16px rgba(202,138,4,0.30)', letterSpacing: '0.02em' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Buat Undangan Gratis
                </button>
                <p className="text-center mt-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', color: '#BE185D', opacity: 0.7 }}>Tanpa login · Live dalam 5 menit · Gratis 25 menit</p>
              </div>
            </div>

            {/* Right: Photo stack */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative w-full aspect-[4/5] overflow-hidden shadow-2xl" style={{ borderRadius: '48px', transform: 'rotate(3deg) translateX(32px)', zIndex: 20 }}>
                <img alt="Undangan Pernikahan" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" />
              </div>
              <div className="absolute overflow-hidden shadow-xl" style={{ top: '-48px', left: '-48px', width: '66%', aspectRatio: '4/5', borderRadius: '40px', transform: 'rotate(-6deg)', zIndex: 10, border: '1px solid #FBCFE8', background: '#FDF2F8' }}>
                <img alt="Upacara Pernikahan" className="w-full h-full object-cover" style={{ opacity: 0.85 }} src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" />
              </div>
              {/* Floating badge */}
              <div className="absolute z-30" style={{ bottom: '-48px', right: 0, padding: '24px', borderRadius: '32px', background: '#DB2777', color: '#FFFFFF', boxShadow: '0 8px 32px rgba(219,39,119,0.30)', minWidth: '200px' }}>
                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.5rem', marginBottom: '8px', opacity: 0.9 }}>Premium Finish</p>
                <p style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '13px', opacity: 0.85, lineHeight: 1.5 }}>Setiap undangan dirender dengan desain mewah dan presisi tinggi.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────── */}
        <section id="features" className="py-24 px-8" style={{ background: '#FFFFFF', borderTop: '1px solid #FBCFE8', borderBottom: '1px solid #FBCFE8' }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <p className="mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', color: '#DB2777', textTransform: 'uppercase' }}>Fitur Unggulan</p>
              <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: '#831843', lineHeight: 1.1 }}>Kenapa undang.io</h2>
              <p className="mt-4 mx-auto" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.125rem', color: '#BE185D', maxWidth: '520px', lineHeight: 1.7 }}>Semua yang kamu butuhkan untuk undangan pernikahan digital yang sempurna.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group transition-all duration-300 cursor-default"
                  style={{ background: '#FDF2F8', padding: '32px', borderRadius: '24px', border: '1px solid #FBCFE8' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(219,39,119,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                >
                  <div className="flex items-center justify-center mb-6" style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#FCE7F3', border: '1px solid #FBCFE8' }}>
                    <span className="material-symbols-outlined" style={{ color: '#DB2777', fontSize: '26px', fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                  </div>
                  <h3 className="mb-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.2rem', fontWeight: 700, color: '#831843' }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: '#BE185D', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Showcase ──────────────────────────────────────── */}
        <section id="showcase" className="py-24 px-8" style={{ background: '#FDF2F8' }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <p className="mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', color: '#DB2777', textTransform: 'uppercase' }}>Koleksi Tema</p>
                <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: '#831843', lineHeight: 1.1 }}>Tema Pilihan</h2>
                <p className="mt-4" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.125rem', color: '#BE185D', lineHeight: 1.7 }}>Pilih dari koleksi kurasi yang dirancang dengan standar desain internasional.</p>
              </div>
              <button
                onClick={handleBegin}
                className="flex items-center gap-2 transition-all cursor-pointer"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#DB2777', fontWeight: 700, fontSize: '14px' }}
              >
                Lihat Semua
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden" style={{ borderRadius: '40px', minHeight: '400px' }}>
                <img alt="Tema Jawa Klasik" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(131,24,67,0.75) 0%, transparent 60%)' }} />
                <div className="absolute bottom-10 left-10 text-white">
                  <span className="inline-block px-3 py-1 mb-3" style={{ background: 'rgba(219,39,119,0.30)', backdropFilter: 'blur(8px)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Inter', system-ui, sans-serif" }}>Budaya</span>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', lineHeight: 1.1 }}>Jawa Klasik</h3>
                  <p style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '14px', opacity: 0.85 }}>Keanggunan tradisi Jawa yang abadi.</p>
                </div>
              </div>
              <div className="md:col-span-2 relative group overflow-hidden" style={{ borderRadius: '40px', height: '260px' }}>
                <img alt="Tema Bali Tropis" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(131,24,67,0.55) 0%, transparent 60%)' }} />
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="inline-block px-3 py-1 mb-2" style={{ background: 'rgba(219,39,119,0.30)', backdropFilter: 'blur(8px)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Inter', system-ui, sans-serif" }}>Budaya</span>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2rem' }}>Bali Tropis</h3>
                </div>
              </div>
              <div className="relative group overflow-hidden" style={{ borderRadius: '40px', height: '260px' }}>
                <img alt="Tema Modern Minimalis" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1522673607200-1648482ce486?w=400&q=80" />
                <div className="absolute inset-0" style={{ background: 'rgba(219,39,119,0.15)' }} />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="inline-block px-3 py-1 mb-2" style={{ background: 'rgba(219,39,119,0.35)', backdropFilter: 'blur(8px)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Inter', system-ui, sans-serif" }}>Modern</span>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.8rem' }}>Minimalis</h3>
                </div>
              </div>
              <div className="relative group overflow-hidden" style={{ borderRadius: '40px', height: '260px' }}>
                <img alt="Tema Botanical" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(131,24,67,0.40) 0%, transparent 60%)' }} />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="inline-block px-3 py-1 mb-2" style={{ background: 'rgba(219,39,119,0.30)', backdropFilter: 'blur(8px)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Inter', system-ui, sans-serif" }}>Nature</span>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.8rem' }}>Botanical</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────── */}
        <section id="testimonials" className="py-24 px-8" style={{ background: '#FFFFFF', borderTop: '1px solid #FBCFE8' }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <p className="mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', color: '#DB2777', textTransform: 'uppercase' }}>Testimoni</p>
              <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: '#831843', lineHeight: 1.1 }}>Kata Mereka</h2>
              <p className="mt-4 mx-auto" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.125rem', color: '#BE185D', maxWidth: '520px', lineHeight: 1.7 }}>Cerita nyata dari pasangan yang sudah mempercayakan undangan digital mereka kepada undang.io.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="transition-all duration-300"
                  style={{ background: '#FDF2F8', padding: '32px', borderRadius: '24px', border: '1px solid #FBCFE8' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(219,39,119,0.10)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                >
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="material-symbols-outlined" style={{ fontSize: '18px', color: '#CA8A04', fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="mb-6 italic" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.05rem', color: '#BE185D', lineHeight: 1.7 }}>&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center" style={{ width: '44px', height: '44px', borderRadius: '999px', background: '#FCE7F3', border: '1px solid #FBCFE8', fontSize: '13px', fontWeight: 800, color: '#DB2777', fontFamily: "'Inter', system-ui, sans-serif" }}>{t.initial}</div>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', fontWeight: 700, color: '#831843' }}>{t.name}</p>
                      <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '12px', color: '#BE185D', opacity: 0.7 }}>{t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────── */}
        <section id="pricing" className="py-32 px-8" style={{ background: '#FDF2F8', borderTop: '1px solid #FBCFE8' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <p className="mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', color: '#DB2777', textTransform: 'uppercase' }}>Investasi</p>
              <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: '#831843', lineHeight: 1.1 }}>Simpel & Transparan</h2>
              <p className="mt-4 mx-auto" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.125rem', color: '#BE185D', maxWidth: '400px', lineHeight: 1.7 }}>Bayar sekali, live selamanya. Tanpa biaya tersembunyi.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Free Trial */}
              <div className="flex flex-col p-10 transition-all duration-300" style={{ background: '#FFFFFF', borderRadius: '40px', border: '1px solid #FBCFE8', boxShadow: '0 4px 12px rgba(219,39,119,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div className="mb-8">
                  <h3 className="mb-2" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#831843' }}>Free Trial</h3>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2.25rem', fontWeight: 900, color: '#831843' }}>Rp 0</span>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', color: '#BE185D' }}>/25 menit</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {['Preview Instan','Semua Fitur Editor','Bagikan via WhatsApp'].map(item => (
                    <li key={item} className="flex items-center gap-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: '#BE185D' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#22C55E', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {item}
                    </li>
                  ))}
                  <li className="flex items-center gap-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: '#BE185D', opacity: 0.35 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
                    Live Selamanya
                  </li>
                </ul>
                <button
                  onClick={scrollToForm}
                  className="w-full py-4 transition-all cursor-pointer"
                  style={{ borderRadius: '999px', border: '2px solid #DB2777', color: '#DB2777', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, fontSize: '14px', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FCE7F3'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Mulai Gratis
                </button>
              </div>

              {/* Full Access — featured */}
              <div className="flex flex-col p-10 relative overflow-hidden" style={{ background: '#DB2777', borderRadius: '40px', boxShadow: '0 20px 48px rgba(219,39,119,0.30)', transform: 'scale(1.05)', zIndex: 10 }}>
                <div className="absolute top-6 right-8 px-4 py-1" style={{ background: '#CA8A04', borderRadius: '999px', fontSize: '10px', fontWeight: 700, color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase' }}>Popular</div>
                <div className="mb-8">
                  <h3 className="mb-2" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Full Access</h3>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2.75rem', fontWeight: 900, color: '#FFFFFF' }}>Rp 49k</span>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>/undangan</span>
                  </div>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through', marginTop: '4px' }}>Rp 99.000</p>
                  <span className="inline-block mt-2 px-3 py-1" style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '999px', fontSize: '11px', fontWeight: 700, color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>HEMAT 51%</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {['Live Selamanya','RSVP & Buku Tamu Unlimited','Bebas Edit Kapan Saja','Semua Tema Premium','Bagikan via WhatsApp'].map(item => (
                    <li key={item} className="flex items-center gap-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: '#FFFFFF' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#FDE68A', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleBegin}
                  className="w-full py-5 transition-all cursor-pointer"
                  style={{ borderRadius: '999px', background: '#CA8A04', color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800, fontSize: '15px', boxShadow: '0 4px 16px rgba(202,138,4,0.40)' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Dapatkan Akses Penuh
                </button>
              </div>

              {/* Bespoke */}
              <div className="flex flex-col p-10 transition-all duration-300" style={{ background: '#FFFFFF', borderRadius: '40px', border: '1px solid #FBCFE8', boxShadow: '0 4px 12px rgba(219,39,119,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div className="mb-8">
                  <h3 className="mb-2" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#831843' }}>Bespoke</h3>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2.25rem', fontWeight: 900, color: '#831843' }}>Tanya</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {['Desain Kustom Eksklusif','Dukungan Editor Khusus','Koordinasi Multi-Event'].map(item => (
                    <li key={item} className="flex items-center gap-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: '#BE185D' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#DB2777', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-4 transition-all cursor-pointer"
                  style={{ borderRadius: '999px', border: '2px solid #DB2777', color: '#DB2777', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, fontSize: '14px', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FCE7F3'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────── */}
        <section className="py-24 px-8" style={{ background: '#FFFFFF', borderTop: '1px solid #FBCFE8' }}>
          <div className="max-w-4xl mx-auto text-center relative overflow-hidden px-12 py-20" style={{ background: '#DB2777', borderRadius: '64px', boxShadow: '0 20px 60px rgba(219,39,119,0.25)' }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(202,138,4,0.20) 0%, transparent 70%)' }} />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.25) 0%, transparent 70%)' }} />
            </div>
            <div className="relative z-10">
              <h2 className="mb-6" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#FFFFFF', lineHeight: 1.1 }}>Siap membuat undangan tak terlupakan?</h2>
              <p className="mb-10 mx-auto" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)', maxWidth: '480px', lineHeight: 1.7 }}>Mulai gratis. Live dalam 5 menit. Tanpa coding. Bergabunglah dengan ribuan pasangan yang memilih undang.io.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={scrollToForm}
                  className="transition-all cursor-pointer"
                  style={{ background: '#CA8A04', color: '#FFFFFF', padding: '16px 40px', borderRadius: '999px', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800, fontSize: '15px', boxShadow: '0 4px 16px rgba(202,138,4,0.40)' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Mulai Sekarang
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)', padding: '16px 40px', borderRadius: '999px', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: '15px' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                >
                  Daftar Akun
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="py-12 px-8" style={{ background: '#500724', borderTop: '1px solid rgba(219,39,119,0.20)' }}>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-screen-xl mx-auto gap-6">
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.75rem', color: '#F9A8D4' }}>undang.io</div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Kebijakan Privasi','Syarat & Ketentuan','Kontak','Galeri Undangan'].map(item => (
              <a key={item} className="transition-colors cursor-pointer hover:text-pink-300" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '12px', color: '#F9A8D4', opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item}</a>
            ))}
          </div>
          <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '12px', color: '#F9A8D4', opacity: 0.5 }}>
            © 2026 undang.io
          </div>
        </div>
      </footer>
    </div>
  );
}
