"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

/* ─── Data Arrays ───────────────────────────────────────────── */

const features = [
  { icon: 'auto_awesome', title: 'Langsung Jadi', desc: 'Undangan lengkap dalam 5 menit. Tanpa ribet, tanpa coding.' },
  { icon: 'palette', title: 'Ratusan Tema', desc: 'Jawa, Bali, Minang, Modern, Islami, dan masih banyak lagi.' },
  { icon: 'share', title: 'Bagikan via WhatsApp', desc: 'Satu link untuk semua tamu. Mudah, cepat, elegan.' },
  { icon: 'forum', title: 'RSVP & Ucapan', desc: 'Tamu konfirmasi kehadiran dan kirim ucapan langsung.' },
  { icon: 'schedule', title: 'Live Selamanya', desc: 'Bayar sekali, undangan aktif untuk selamanya.' },
  { icon: 'diamond', title: 'Desain Premium', desc: 'Tampilan mewah yang indah di semua perangkat.' },
];

const testimonials = [
  { name: 'Rina & Dimas', text: 'Undangan digitalnya cantik sekali dan sangat mudah dibuat. Tamu-tamu kami langsung terpesona!', location: 'Jakarta', initial: 'RD' },
  { name: 'Ayu & Budi', text: 'Hanya 5 menit dan undangan sudah jadi. Praktis dan tampilannya mewah. Sangat recommended!', location: 'Bandung', initial: 'AB' },
  { name: 'Sari & Eko', text: 'Tema Jawa Klasiknya membuat undangan kami terasa sangat personal dan mewah. Terima kasih undang.io!', location: 'Yogyakarta', initial: 'SE' },
];

/* ─── Token helpers ────────────────────────────────────────── */
// Using CSS variables from Blush Ivory design system (globals.css)
const t = {
  bg:           'var(--color-background)',       // #FAF7F4 warm ivory
  bgWhite:      'var(--color-surface)',           // #FFFFFF
  primary:      'var(--color-primary)',           // #B5737A dusty rose
  primaryLight: 'var(--color-primary-light)',     // #F2E4E5
  primaryDark:  'var(--color-primary-dark)',      // #8A5258
  secondary:    'var(--color-secondary)',         // #CFADB1 muted blush
  cta:          'var(--color-cta)',               // #9B6B4A warm mocha
  ctaLight:     'var(--color-cta-light)',         // #F5EDE7
  text:         'var(--color-text)',              // #4A3235 deep brown
  textMuted:    'var(--color-muted-foreground)',  // #9B7479
  border:       'var(--color-border)',            // #E8D5D5
  borderSoft:   'var(--color-border-soft)',       // #F2E4E5
  footer:       'var(--color-surface-footer)',    // #3A2225
  footerText:   'var(--color-inverse-primary)',   // #CFADB1
};

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

  const handleBegin = () => router.push('/buat-undangan');

  const scrollToForm = () => {
    document.getElementById('quick-start')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickStart = () => {
    if (groomName || brideName) {
      sessionStorage.setItem('undang_draft', JSON.stringify({
        groom_full_name: '', groom_name: groomName,
        bride_full_name: '', bride_name: brideName,
        themeId: selectedTheme
      }));
    }
    router.push(selectedTheme ? `/buat-undangan?theme=${selectedTheme}` : '/buat-undangan');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: t.bg, color: t.text, fontFamily: "'Cormorant Infant', Georgia, serif" }}>

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50" style={{
        backgroundColor: 'rgba(250,247,244,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${t.border}`
      }}>
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-xl mx-auto">
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2rem', color: t.primary, lineHeight: 1 }}>
            undang.io
          </div>
          <div className="hidden md:flex space-x-10 items-center" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', fontWeight: 500 }}>
            {['#features', '#pricing', '#showcase', '#testimonials'].map((href, i) => (
              <a key={href} href={href}
                className="transition-colors cursor-pointer"
                style={{ color: t.primaryDark }}
                onMouseEnter={e => (e.currentTarget.style.color = t.primary)}
                onMouseLeave={e => (e.currentTarget.style.color = t.primaryDark)}
              >
                {['Fitur', 'Harga', 'Tema', 'Testimoni'][i]}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login"
              className="transition-colors font-medium"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', color: t.primaryDark }}
            >
              Masuk
            </Link>
            <button
              onClick={scrollToForm}
              className="transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                background: t.cta, color: '#FFFFFF',
                padding: '10px 24px', borderRadius: '999px',
                fontWeight: 700, fontSize: '14px',
                boxShadow: '0 4px 12px rgba(155,107,74,0.28)'
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Buat Undangan
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section id="quick-start" className="relative pt-32 pb-24 px-8 overflow-hidden min-h-[90vh] flex items-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
              style={{ background: `radial-gradient(circle, rgba(181,115,122,0.12) 0%, transparent 70%)` }} />
            <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full"
              style={{ background: `radial-gradient(circle, rgba(155,107,74,0.09) 0%, transparent 70%)` }} />
          </div>

          <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Left */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
                style={{ background: t.primaryLight, border: `1px solid ${t.border}` }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: t.primary }} />
                <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: t.primary, textTransform: 'uppercase' }}>
                  Langsung Buat — Tanpa Daftar
                </span>
              </div>

              {/* Headline */}
              <h1 className="mb-6" style={{ lineHeight: 1.1 }}>
                <span className="block" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: t.text }}>Undangan</span>
                <span className="block" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(3.5rem,9vw,7rem)', color: t.primary, lineHeight: 1.0 }}>Pernikahan</span>
                <span className="block" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: t.text }}>Digital Kamu</span>
              </h1>

              <p className="mb-10" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.25rem', color: t.primaryDark, maxWidth: '480px', lineHeight: 1.7 }}>
                Isi nama, pilih tema, langsung live. Gratis 25 menit.
                Bayar <strong style={{ color: t.primary, fontWeight: 700 }}>Rp 49.000</strong> untuk selamanya.
              </p>

              {/* Quick-Start Form Card */}
              <div className="max-w-lg rounded-3xl p-6 md:p-8" style={{
                background: t.bgWhite,
                border: `1px solid ${t.border}`,
                boxShadow: '0 10px 40px rgba(181,115,122,0.12)'
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: '#16A34A', textTransform: 'uppercase' }}>
                    Buat Undangan Sekarang — Gratis
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[['Nama Pria', groomName, setGroomName, 'Budi'], ['Nama Wanita', brideName, setBrideName, 'Ayu']].map(([label, val, setter, ph]: any) => (
                    <div key={label as string}>
                      <label className="block mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, color: t.primaryDark, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</label>
                      <input
                        type="text"
                        value={val}
                        onChange={e => setter(e.target.value)}
                        placeholder={ph}
                        className="w-full transition-all"
                        style={{ padding: '12px 16px', borderRadius: '12px', border: `1px solid ${t.border}`, fontFamily: "'Inter', system-ui, sans-serif", fontSize: '15px', color: t.text, background: t.bg, outline: 'none' }}
                        onFocus={e => { e.currentTarget.style.borderColor = t.primary; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(181,115,122,0.14)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.boxShadow = 'none'; }}
                      />
                    </div>
                  ))}
                </div>

                <label className="block mb-2" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, color: t.primaryDark, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Pilih Tema</label>
                <div className="flex gap-3 mb-6">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className="flex-1 relative overflow-hidden transition-all cursor-pointer"
                      style={{
                        height: '80px', borderRadius: '12px',
                        border: selectedTheme === theme.id ? `2px solid ${t.primary}` : `2px solid ${t.border}`,
                        boxShadow: selectedTheme === theme.id ? '0 4px 12px rgba(181,115,122,0.22)' : 'none',
                        opacity: selectedTheme === theme.id ? 1 : 0.65,
                        transform: selectedTheme === theme.id ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <img src={theme.img} alt={theme.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(74,50,53,0.65), transparent)` }} />
                      <span className="absolute bottom-1.5 left-0 right-0 text-center text-white" style={{ fontSize: '10px', fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }}>{theme.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleQuickStart}
                  className="w-full transition-all duration-200 cursor-pointer"
                  style={{
                    background: t.cta, color: '#FFFFFF',
                    padding: '16px', borderRadius: '999px',
                    fontWeight: 700, fontSize: '15px',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    boxShadow: '0 4px 16px rgba(155,107,74,0.30)',
                    letterSpacing: '0.02em'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Buat Undangan Gratis
                </button>
                <p className="text-center mt-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', color: t.textMuted }}>
                  Tanpa login · Live dalam 5 menit · Gratis 25 menit
                </p>
              </div>
            </div>

            {/* Right: Photo stack */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative w-full aspect-[4/5] overflow-hidden shadow-2xl"
                style={{ borderRadius: '48px', transform: 'rotate(3deg) translateX(32px)', zIndex: 20 }}>
                <img alt="Undangan Pernikahan" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" />
              </div>
              <div className="absolute overflow-hidden shadow-xl"
                style={{ top: '-48px', left: '-48px', width: '66%', aspectRatio: '4/5', borderRadius: '40px', transform: 'rotate(-6deg)', zIndex: 10, border: `1px solid ${t.border}`, background: t.bg }}>
                <img alt="Upacara Pernikahan" className="w-full h-full object-cover" style={{ opacity: 0.85 }} src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" />
              </div>
              {/* Floating badge */}
              <div className="absolute z-30"
                style={{ bottom: '-48px', right: 0, padding: '24px', borderRadius: '32px', background: t.primary, color: '#FFFFFF', boxShadow: '0 8px 32px rgba(181,115,122,0.30)', minWidth: '200px' }}>
                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.5rem', marginBottom: '8px', opacity: 0.9 }}>Premium Finish</p>
                <p style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '13px', opacity: 0.85, lineHeight: 1.5 }}>
                  Setiap undangan dirender dengan desain mewah dan presisi tinggi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────── */}
        <section id="features" className="py-24 px-8" style={{ background: t.bgWhite, borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <p className="mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', color: t.primary, textTransform: 'uppercase' }}>Fitur Unggulan</p>
              <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: t.text, lineHeight: 1.1 }}>Kenapa undang.io</h2>
              <p className="mt-4 mx-auto" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.125rem', color: t.primaryDark, maxWidth: '520px', lineHeight: 1.7 }}>
                Semua yang kamu butuhkan untuk undangan pernikahan digital yang sempurna.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group transition-all duration-300 cursor-default"
                  style={{ background: t.bg, padding: '32px', borderRadius: '24px', border: `1px solid ${t.border}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(181,115,122,0.14)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                >
                  <div className="flex items-center justify-center mb-6"
                    style={{ width: '52px', height: '52px', borderRadius: '14px', background: t.primaryLight, border: `1px solid ${t.borderSoft}` }}>
                    <span className="material-symbols-outlined" style={{ color: t.primary, fontSize: '26px', fontVariationSettings: "'FILL' 1" }}>{f.icon}</span>
                  </div>
                  <h3 className="mb-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.2rem', fontWeight: 700, color: t.text }}>{f.title}</h3>
                  <p style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: t.primaryDark, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Showcase ──────────────────────────────────────────────── */}
        <section id="showcase" className="py-24 px-8" style={{ background: t.bg }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <p className="mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', color: t.primary, textTransform: 'uppercase' }}>Koleksi Tema</p>
                <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: t.text, lineHeight: 1.1 }}>Tema Pilihan</h2>
                <p className="mt-4" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.125rem', color: t.primaryDark, lineHeight: 1.7 }}>
                  Pilih dari koleksi kurasi yang dirancang dengan standar desain internasional.
                </p>
              </div>
              <button
                onClick={handleBegin}
                className="flex items-center gap-2 transition-all cursor-pointer"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", color: t.primary, fontWeight: 700, fontSize: '14px' }}
              >
                Lihat Semua
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden" style={{ borderRadius: '40px', minHeight: '400px' }}>
                <img alt="Tema Jawa Klasik" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(74,50,53,0.75) 0%, transparent 60%)' }} />
                <div className="absolute bottom-10 left-10 text-white">
                  <span className="inline-block px-3 py-1 mb-3" style={{ background: 'rgba(181,115,122,0.35)', backdropFilter: 'blur(8px)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Inter', system-ui, sans-serif" }}>Budaya</span>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', lineHeight: 1.1 }}>Jawa Klasik</h3>
                  <p style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '14px', opacity: 0.85 }}>Keanggunan tradisi Jawa yang abadi.</p>
                </div>
              </div>
              <div className="md:col-span-2 relative group overflow-hidden" style={{ borderRadius: '40px', height: '260px' }}>
                <img alt="Tema Bali Tropis" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(74,50,53,0.55) 0%, transparent 60%)' }} />
                <div className="absolute bottom-8 left-8 text-white">
                  <span className="inline-block px-3 py-1 mb-2" style={{ background: 'rgba(181,115,122,0.35)', backdropFilter: 'blur(8px)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Inter', system-ui, sans-serif" }}>Budaya</span>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2rem' }}>Bali Tropis</h3>
                </div>
              </div>
              <div className="relative group overflow-hidden" style={{ borderRadius: '40px', height: '260px' }}>
                <img alt="Tema Modern Minimalis" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1522673607200-1648482ce486?w=400&q=80" />
                <div className="absolute inset-0" style={{ background: 'rgba(181,115,122,0.15)' }} />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="inline-block px-3 py-1 mb-2" style={{ background: 'rgba(181,115,122,0.35)', backdropFilter: 'blur(8px)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Inter', system-ui, sans-serif" }}>Modern</span>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.8rem' }}>Minimalis</h3>
                </div>
              </div>
              <div className="relative group overflow-hidden" style={{ borderRadius: '40px', height: '260px' }}>
                <img alt="Tema Botanical" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(74,50,53,0.40) 0%, transparent 60%)' }} />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <span className="inline-block px-3 py-1 mb-2" style={{ background: 'rgba(181,115,122,0.30)', backdropFilter: 'blur(8px)', borderRadius: '999px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Inter', system-ui, sans-serif" }}>Nature</span>
                  <h3 style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.8rem' }}>Botanical</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ──────────────────────────────────────────── */}
        <section id="testimonials" className="py-24 px-8" style={{ background: t.bgWhite, borderTop: `1px solid ${t.border}` }}>
          <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-16">
              <p className="mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', color: t.primary, textTransform: 'uppercase' }}>Testimoni</p>
              <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: t.text, lineHeight: 1.1 }}>Kata Mereka</h2>
              <p className="mt-4 mx-auto" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.125rem', color: t.primaryDark, maxWidth: '520px', lineHeight: 1.7 }}>
                Cerita nyata dari pasangan yang sudah mempercayakan undangan digital mereka kepada undang.io.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item, i) => (
                <div
                  key={i}
                  className="transition-all duration-300"
                  style={{ background: t.bg, padding: '32px', borderRadius: '24px', border: `1px solid ${t.border}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(181,115,122,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                >
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="material-symbols-outlined" style={{ fontSize: '18px', color: t.cta, fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="mb-6 italic" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.05rem', color: t.primaryDark, lineHeight: 1.7 }}>&ldquo;{item.text}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center"
                      style={{ width: '44px', height: '44px', borderRadius: '999px', background: t.primaryLight, border: `1px solid ${t.border}`, fontSize: '13px', fontWeight: 800, color: t.primary, fontFamily: "'Inter', system-ui, sans-serif" }}>
                      {item.initial}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', fontWeight: 700, color: t.text }}>{item.name}</p>
                      <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '12px', color: t.textMuted }}>{item.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ────────────────────────────────────────────────── */}
        <section id="pricing" className="py-32 px-8" style={{ background: t.bg, borderTop: `1px solid ${t.border}` }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <p className="mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.20em', color: t.primary, textTransform: 'uppercase' }}>Investasi</p>
              <h2 style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,6vw,4.5rem)', color: t.text, lineHeight: 1.1 }}>Simpel &amp; Transparan</h2>
              <p className="mt-4 mx-auto" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.125rem', color: t.primaryDark, maxWidth: '400px', lineHeight: 1.7 }}>
                Bayar sekali, live selamanya. Tanpa biaya tersembunyi.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Free Trial */}
              <div className="flex flex-col p-10 transition-all duration-300"
                style={{ background: t.bgWhite, borderRadius: '40px', border: `1px solid ${t.border}`, boxShadow: '0 4px 12px rgba(181,115,122,0.07)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div className="mb-8">
                  <h3 className="mb-2" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: t.text }}>Free Trial</h3>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2.25rem', fontWeight: 900, color: t.text }}>Rp 0</span>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', color: t.primaryDark }}>/25 menit</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {['Preview Instan', 'Semua Fitur Editor', 'Bagikan via WhatsApp'].map(item => (
                    <li key={item} className="flex items-center gap-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: t.primaryDark }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#22C55E', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {item}
                    </li>
                  ))}
                  <li className="flex items-center gap-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: t.textMuted, opacity: 0.5 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
                    Live Selamanya
                  </li>
                </ul>
                <button
                  onClick={scrollToForm}
                  className="w-full py-4 transition-all cursor-pointer"
                  style={{ borderRadius: '999px', border: `2px solid ${t.primary}`, color: t.primary, fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, fontSize: '14px', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.primaryLight; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Mulai Gratis
                </button>
              </div>

              {/* Full Access — featured */}
              <div className="flex flex-col p-10 relative overflow-hidden"
                style={{ background: t.primary, borderRadius: '40px', boxShadow: '0 20px 48px rgba(181,115,122,0.35)', transform: 'scale(1.05)', zIndex: 10 }}>
                <div className="absolute top-6 right-8 px-4 py-1"
                  style={{ background: t.cta, borderRadius: '999px', fontSize: '10px', fontWeight: 700, color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Popular
                </div>
                <div className="mb-8">
                  <h3 className="mb-2" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: 'rgba(255,255,255,0.90)' }}>Full Access</h3>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2.75rem', fontWeight: 900, color: '#FFFFFF' }}>Rp 49k</span>
                    <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>/undangan</span>
                  </div>
                  <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through', marginTop: '4px' }}>Rp 99.000</p>
                  <span className="inline-block mt-2 px-3 py-1"
                    style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '999px', fontSize: '11px', fontWeight: 700, color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif" }}>
                    HEMAT 51%
                  </span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {['Live Selamanya', 'RSVP & Buku Tamu Unlimited', 'Bebas Edit Kapan Saja', 'Semua Tema Premium', 'Bagikan via WhatsApp'].map(item => (
                    <li key={item} className="flex items-center gap-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: '#FFFFFF' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#FDE68A', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleBegin}
                  className="w-full py-5 transition-all cursor-pointer"
                  style={{ borderRadius: '999px', background: t.cta, color: '#FFFFFF', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800, fontSize: '15px', boxShadow: '0 4px 16px rgba(155,107,74,0.40)' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Dapatkan Akses Penuh
                </button>
              </div>

              {/* Bespoke */}
              <div className="flex flex-col p-10 transition-all duration-300"
                style={{ background: t.bgWhite, borderRadius: '40px', border: `1px solid ${t.border}`, boxShadow: '0 4px 12px rgba(181,115,122,0.07)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                <div className="mb-8">
                  <h3 className="mb-2" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: t.text }}>Bespoke</h3>
                  <span style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '2.25rem', fontWeight: 900, color: t.text }}>Tanya</span>
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                  {['Desain Kustom Eksklusif', 'Dukungan Editor Khusus', 'Koordinasi Multi-Event'].map(item => (
                    <li key={item} className="flex items-center gap-3" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1rem', color: t.primaryDark }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: t.primary, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-4 transition-all cursor-pointer"
                  style={{ borderRadius: '999px', border: `2px solid ${t.primary}`, color: t.primary, fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, fontSize: '14px', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.primaryLight; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────── */}
        <section className="py-24 px-8" style={{ background: t.bgWhite, borderTop: `1px solid ${t.border}` }}>
          <div className="max-w-4xl mx-auto text-center relative overflow-hidden px-12 py-20"
            style={{ background: t.primary, borderRadius: '64px', boxShadow: '0 20px 60px rgba(181,115,122,0.30)' }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(155,107,74,0.22) 0%, transparent 70%)' }} />
              <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(250,247,244,0.15) 0%, transparent 70%)' }} />
            </div>
            <div className="relative z-10">
              <h2 className="mb-6" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2.5rem,7vw,5rem)', color: '#FFFFFF', lineHeight: 1.1 }}>
                Siap membuat undangan tak terlupakan?
              </h2>
              <p className="mb-10 mx-auto" style={{ fontFamily: "'Cormorant Infant', Georgia, serif", fontSize: '1.2rem', color: 'rgba(255,255,255,0.88)', maxWidth: '480px', lineHeight: 1.7 }}>
                Mulai gratis. Live dalam 5 menit. Tanpa coding. Bergabunglah dengan ribuan pasangan yang memilih undang.io.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={scrollToForm}
                  className="transition-all cursor-pointer"
                  style={{ background: t.cta, color: '#FFFFFF', padding: '16px 40px', borderRadius: '999px', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 800, fontSize: '15px', boxShadow: '0 4px 16px rgba(155,107,74,0.40)' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  Mulai Sekarang
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.28)', padding: '16px 40px', borderRadius: '999px', fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, fontSize: '15px' }}
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

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-12 px-8" style={{ background: t.footer, borderTop: `1px solid rgba(181,115,122,0.20)` }}>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-screen-xl mx-auto gap-6">
          <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.75rem', color: t.footerText }}>undang.io</div>
          <div className="flex flex-wrap justify-center gap-8">
            {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Kontak', 'Galeri Undangan'].map(item => (
              <a key={item}
                className="transition-colors cursor-pointer"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '12px', color: t.footerText, opacity: 0.7, letterSpacing: '0.08em', textTransform: 'uppercase' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
              >{item}</a>
            ))}
          </div>
          <div style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '12px', color: t.footerText, opacity: 0.5 }}>© 2026 undang.io</div>
        </div>
      </footer>
    </div>
  );
}
