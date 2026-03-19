"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default function LandingPage() {
  const router = useRouter();

  const handleBegin = () => {
    router.push('/buat-undangan');
  };

  return (
    <div className="bg-background text-on-background selection:bg-tertiary-fixed-dim min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl bg-gradient-to-b from-slate-200/20 to-transparent shadow-none">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-primary">Undang-io</div>
          <div className="hidden md:flex space-x-12 items-center font-['Inter'] tracking-tight font-medium">
            <a className="text-slate-500 hover:text-primary transition-colors cursor-pointer" href="#features">Features</a>
            <a className="text-slate-500 hover:text-primary transition-colors cursor-pointer" href="#pricing">Pricing</a>
            <a className="text-slate-500 hover:text-primary transition-colors cursor-pointer" href="#showcase">Showcase</a>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-slate-500 hover:text-primary transition-all duration-300 font-medium scale-95 active:scale-90">Login</Link>
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
        {/* Hero Section: Editorial Focus */}
        <section className="relative pt-32 pb-24 px-8 overflow-hidden min-h-[90vh] flex items-center">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-surface-container-highest text-primary text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                The Digital Concierge
              </span>
              <h1 className="text-6xl md:text-8xl font-black text-primary tracking-tighter leading-[0.9] mb-12">
                Digital Elegance <br/>
                <span className="text-on-tertiary-container italic font-light">Redefined.</span>
              </h1>
              <p className="text-xl md:text-2xl text-secondary max-w-xl leading-relaxed mb-16 font-light">
                Experience the precision of high-end editorial design for your most cherished moments. Craft bespoke wedding experiences that mirror the sophistication of a luxury fashion journal.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-16">
                <button 
                  onClick={handleBegin}
                  className="bg-primary text-on-primary px-10 py-5 rounded-full text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Mulai Cerita Anda
                </button>
                <button 
                  onClick={() => router.push('/invite/demo')}
                  className="bg-surface-container-highest text-primary px-10 py-5 rounded-full text-lg font-semibold hover:bg-surface-container-high transition-colors"
                >
                  Lihat Demo
                </button>
              </div>

              {/* AARRR Status / Trust Line: Pirate Metrics Focused */}
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black tracking-[0.3em] uppercase text-secondary">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                  <span className="text-emerald-600 font-black">Activation Lock: 15-Min Free Trial</span>
                </div>
                <div className="w-px h-4 bg-outline-variant/30" />
                <span>Zero Authorization (No Login)</span>
                <div className="w-px h-4 bg-outline-variant/30" />
                <span>Immediate Deployment</span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              {/* Asymmetrical Gallery Stack */}
              <div className="relative w-full aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl rotate-3 translate-x-12 z-20">
                <img 
                  alt="Luxury Wedding Reception" 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80"
                />
              </div>
              <div className="absolute -top-12 -left-12 w-2/3 aspect-[4/5] rounded-[40px] overflow-hidden shadow-xl -rotate-6 z-10 bg-surface-container-low border border-white/20 backdrop-blur-xl">
                <img 
                  alt="Wedding Ceremony" 
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
                  Setiap undangan dirender dengan tekstur titanium yang mewah dan presisi tinggi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Pirate's wealth: AARRR Funnel Visualized */}
        <section className="py-24 px-8 bg-surface-container-low border-y border-outline-variant/10 overflow-hidden relative">
          <div className="max-w-screen-2xl mx-auto">
              <div className="bg-white border border-outline-variant/10 rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 scale-150 blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col gap-12">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                      <h3 className="text-3xl font-black text-primary tracking-tighter italic font-light">The Pirate Metrics Journey</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-2 font-bold">A World-Class Conversion Flow</p>
                    </div>
                    <div className="hidden md:flex gap-2">
                        {['A','A','R','R','R'].map((l, i) => (
                           <div key={i} className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-[10px] font-black text-on-tertiary-container shadow-sm">{l}</div>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                      {/* Step 1: Acquisition */}
                      <div className="flex flex-col gap-4">
                        <div className="text-4xl font-black text-slate-100 group-hover:text-primary/10 transition-colors">01</div>
                        <div>
                            <span className="text-[9px] font-black text-on-tertiary-container uppercase tracking-widest bg-tertiary-container/40 px-2 py-0.5 rounded-full mb-2 inline-block">Acquisition</span>
                            <h4 className="text-sm font-bold text-primary mb-2">Discovery</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Explore editorial masterpieces and select your unique design direction.</p>
                        </div>
                      </div>

                      {/* Step 2: Activation */}
                      <div className="flex flex-col gap-4 border-l-0 md:border-l border-outline-variant/10 md:pl-8">
                        <div className="text-4xl font-black text-slate-100 group-hover:text-emerald-500/10 transition-colors">02</div>
                        <div>
                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-100 px-2 py-0.5 rounded-full mb-2 inline-block">Activation</span>
                            <h4 className="text-sm font-bold text-primary mb-2">Free Trial</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Create instantly. No login. <span className="text-emerald-600 font-bold">15-minute live preview</span> for the world to see.</p>
                        </div>
                      </div>

                      {/* Step 3: Retention */}
                      <div className="flex flex-col gap-4 border-l-0 md:border-l border-outline-variant/10 md:pl-8">
                        <div className="text-4xl font-black text-slate-100 group-hover:text-blue-500/10 transition-colors">03</div>
                        <div>
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded-full mb-2 inline-block">Retention</span>
                            <h4 className="text-sm font-bold text-primary mb-2">Secure Drafts</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Register to save progress. Unlock <span className="text-blue-600 font-bold">+10 minutes</span> and deep customization.</p>
                        </div>
                      </div>

                      {/* Step 4: Referral */}
                      <div className="flex flex-col gap-4 border-l-0 md:border-l border-outline-variant/10 md:pl-8">
                        <div className="text-4xl font-black text-slate-100 group-hover:text-purple-500/10 transition-colors">04</div>
                        <div>
                            <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest bg-purple-100 px-2 py-0.5 rounded-full mb-2 inline-block">Referral</span>
                            <h4 className="text-sm font-bold text-primary mb-2">Viral Growth</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Share with tamu. See your narrative go viral with built-in attribution.</p>
                        </div>
                      </div>

                      {/* Step 5: Revenue */}
                      <div className="flex flex-col gap-4 border-l-0 md:border-l border-outline-variant/10 md:pl-8">
                        <div className="text-4xl font-black text-slate-100 group-hover:text-amber-500/10 transition-colors">05</div>
                        <div>
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded-full mb-2 inline-block">Revenue</span>
                            <h4 className="text-sm font-bold text-primary mb-2">Digital Legacy</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">Upgrade for Rp 49k. One-time payment for <span className="text-amber-600 font-bold">Permanent Online Existence</span>.</p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
          </div>
        </section>

        {/* Showcase: Bento Grid Layout */}
        <section id="showcase" className="py-24 px-8 bg-surface">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tighter mb-6">Editorial Showcases</h2>
                <p className="text-secondary text-lg leading-relaxed">Pilih dari koleksi kurasi direktur editorial internasional kami.</p>
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
              {/* Bento Item 1 */}
              <div className="md:col-span-2 md:row-span-2 relative group rounded-[40px] overflow-hidden bg-surface-container-lowest">
                <img 
                  alt="Minimalist Design" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-3xl font-bold mb-2">The Minimalist</h3>
                  <p className="text-white/80 font-light">Architectural lines meet ivory whites.</p>
                </div>
              </div>
              {/* Bento Item 2 */}
              <div className="md:col-span-2 h-[300px] relative group rounded-[40px] overflow-hidden bg-surface-container-lowest">
                <img 
                  alt="Rose Gold Accents" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tertiary/60 via-transparent to-transparent opacity-40"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-2xl font-bold">Luxe Rose</h3>
                </div>
              </div>
              {/* Bento Item 3 */}
              <div className="md:col-span-1 h-[300px] relative group rounded-[40px] overflow-hidden bg-surface-container-lowest">
                <img 
                  alt="Midnight Indigo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1522673607200-1648482ce486?w=400&q=80"
                />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-xl font-bold">Midnight</h3>
                </div>
                <div className="absolute inset-0 bg-primary/20"></div>
              </div>
              {/* Bento Item 4 */}
              <div className="md:col-span-1 h-[300px] relative group rounded-[40px] overflow-hidden bg-surface-container-lowest">
                <img 
                  alt="Modern Botanical" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80"
                />
                <div className="absolute bottom-6 left-6 text-white z-10">
                  <h3 className="text-xl font-bold">Botanical</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing: Tonal Depth Sections */}
        <section id="pricing" className="py-32 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-secondary font-black tracking-[0.3em] uppercase text-xs">Investasi</span>
              <h2 className="text-5xl md:text-6xl font-black text-primary tracking-tighter mt-4">Simpel & Transparan</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Essential */}
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
              {/* Titanium (Featured) */}
              <div className="bg-primary p-10 rounded-[48px] flex flex-col relative overflow-hidden shadow-2xl scale-105 z-10">
                <div className="absolute top-6 right-10 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Popular</div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-on-primary-fixed-variant mb-2">Full Access</h3>
                  <div className="flex items-baseline gap-1 text-white">
                    <span className="text-5xl font-black">Rp 49k</span>
                    <span className="text-on-primary-container font-medium">/undangan</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Live Selamanya
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    RSVP & Guestbook Unlimited
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Bebas Edit Kapan Saja
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Buku Tamu Digital
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
                    Custom Design Direction
                  </li>
                  <li className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-primary scale-75">check_circle</span>
                    Privilege Editor Support
                  </li>
                  <li className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined text-primary scale-75">check_circle</span>
                    Multi-Event Coordination
                  </li>
                </ul>
                <button className="w-full py-4 rounded-full border-2 border-outline-variant text-primary font-bold hover:bg-surface-container-high transition-colors">Hubungi Kami</button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA: Glassmorphism */}
        <section className="py-24 px-8">
          <div className="max-w-5xl mx-auto rounded-[64px] bg-primary relative overflow-hidden p-16 md:p-24 text-center">
            <div className="absolute inset-0 opacity-20 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-tr from-[#ce9e99] to-transparent blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 italic font-light">
                Ready to define your <br/>digital legacy?
              </h2>
              <p className="text-on-primary-container text-xl max-w-2xl mx-auto mb-16 font-light">Bergabunglah dengan 10.000+ pasangan yang memilih keunggulan editorial untuk kehadiran digital mereka.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button 
                  onClick={handleBegin}
                  className="bg-white text-primary px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform"
                >
                  Buat Undangan Saya
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

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-surface-container-low border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto space-y-8 md:space-y-0 text-secondary">
          <div className="text-lg font-black text-primary">Undang-io Luxe</div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-light tracking-wide uppercase">
            <a className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Contact</a>
            <a className="hover:text-primary transition-colors cursor-pointer">Wedding Gallery</a>
          </div>
          <div className="text-xs font-light tracking-wide">
            © 2024 Undang-io Luxe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
