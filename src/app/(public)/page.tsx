"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layout, 
  Navigation,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const router = useRouter();

  const showcases = [
    {
      title: "The Minimalist",
      desc: "Architectural lines meet ivory whites.",
      img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
      className: "md:col-span-2 md:row-span-2",
      gradient: "from-primary-stitch/80"
    },
    {
      title: "Luxe Rose",
      desc: "",
      img: "https://images.unsplash.com/photo-1522673607200-164883eecd4c?w=600&q=80",
      className: "md:col-span-2 h-[300px]",
      gradient: "from-tertiary-stitch/60"
    },
    {
      title: "Midnight",
      desc: "",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
      className: "md:col-span-1 h-[300px]",
      gradient: "from-primary-stitch/20"
    },
    {
      title: "Botanical",
      desc: "",
      img: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&q=80",
      className: "md:col-span-1 h-[300px]",
      gradient: "from-primary-stitch/10"
    }
  ];

  return (
    <div className="bg-surface-stitch text-on-surface-stitch selection:bg-tertiary-fixed-dim-stitch font-sans antialiased">
      
      {/* ── TopNavBar ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-outline-variant-stitch/20">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-primary-stitch">Undang-io</div>
          <div className="hidden md:flex space-x-12 items-center tracking-tight font-medium">
            <Link className="text-secondary-stitch hover:text-primary-stitch transition-colors" href="#features">Features</Link>
            <Link className="text-secondary-stitch hover:text-primary-stitch transition-colors" href="#pricing">Pricing</Link>
            <Link className="text-secondary-stitch hover:text-primary-stitch transition-colors" href="#showcase">Showcase</Link>
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => router.push('/login')}
              className="text-secondary-stitch hover:text-primary-stitch transition-all duration-300 font-medium scale-95 active:scale-90"
            >
              Login
            </button>
            <button 
              onClick={() => router.push('/register')}
              className="bg-primary-stitch text-on-primary-stitch px-8 py-3 rounded-full font-bold scale-95 active:scale-90 transition-transform hover:opacity-90 shadow-lg shadow-primary-stitch/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 px-8 overflow-hidden min-h-screen flex items-center">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 z-10">
              <span className="inline-block py-1 px-4 rounded-full bg-surface-container-highest-stitch text-primary-stitch text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
                The Digital Concierge
              </span>
              <h1 className="text-6xl md:text-8xl font-black text-primary-stitch tracking-tighter leading-[0.9] mb-12">
                Digital Elegance <br/>
                <span className="text-on-tertiary-container-stitch italic font-light">Redefined.</span>
              </h1>
              <p className="text-xl md:text-2xl text-secondary-stitch max-w-xl leading-relaxed mb-16 font-light">
                Experience the precision of high-end editorial design for your most cherished moments. Craft bespoke wedding experiences that mirror the sophistication of a luxury fashion journal.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => router.push('/buat-undangan')}
                  className="bg-primary-stitch text-on-primary-stitch px-10 py-5 rounded-full text-lg font-bold shadow-2xl shadow-primary-stitch/20 hover:scale-105 transition-transform"
                >
                  Begin Your Story
                </button>
                <button 
                  onClick={() => router.push('/invite/demo')}
                  className="bg-surface-container-highest-stitch text-primary-stitch px-10 py-5 rounded-full text-lg font-semibold hover:bg-surface-container-high-stitch transition-colors"
                >
                  Explore Templates
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative mt-12 lg:mt-0">
              {/* Asymmetrical Gallery Stack */}
              <div className="relative w-full aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl rotate-3 translate-x-12 z-20">
                <img 
                  alt="Luxury Wedding Reception" 
                  className="w-full h-full object-cover"
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80" 
                />
              </div>
              <div className="absolute -top-12 -left-12 w-2/3 aspect-[4/5] rounded-[40px] overflow-hidden shadow-xl -rotate-6 z-10 bg-surface-container-low-stitch border border-white/20 backdrop-blur-xl">
                <img 
                  alt="Wedding Ceremony" 
                  className="w-full h-full object-cover opacity-80"
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" 
                />
              </div>
              <div className="absolute -bottom-16 right-0 w-1/2 p-6 rounded-[32px] bg-tertiary-stitch text-on-tertiary-stitch z-30 shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <Sparkles className="w-5 h-5 text-tertiary-fixed-dim-stitch" />
                  <span className="text-xs font-bold tracking-widest uppercase">Premium Finish</span>
                </div>
                <p className="text-sm font-light opacity-90 leading-relaxed">
                  Every invitation is rendered in ultra-high fidelity titanium textures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Showcase: Bento Grid Layout ── */}
        <section id="showcase" className="py-24 px-8 bg-surface-container-low-stitch">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-black text-primary-stitch tracking-tighter mb-6">Editorial Showcases</h2>
                <p className="text-secondary-stitch text-lg leading-relaxed">Choose from our curated collections designed by international editorial directors.</p>
              </div>
              <button 
                onClick={() => router.push('/buat-undangan')}
                className="flex items-center gap-2 text-primary-stitch font-bold group"
              >
                View All Collections 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {showcases.map((item, i) => (
                <div key={i} className={`${item.className} relative group rounded-[40px] overflow-hidden bg-surface-container-lowest-stitch shadow-sm`}>
                  <img 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={item.img} 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} via-transparent to-transparent opacity-60`}></div>
                  <div className="absolute bottom-10 left-10 text-white">
                    <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                    {item.desc && <p className="text-white/80 font-light">{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing Section ── */}
        <section id="pricing" className="py-32 px-8 bg-surface-stitch">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <span className="text-on-tertiary-container-stitch font-black tracking-[0.3em] uppercase text-xs">Investment</span>
              <h2 className="text-5xl md:text-6xl font-black text-primary-stitch tracking-tighter mt-4">Simple, Transparent Tiering</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Essential */}
              <div className="bg-surface-container-low-stitch p-10 rounded-[48px] flex flex-col hover:translate-y-[-8px] transition-transform duration-500 border border-outline-variant-stitch/20">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary-stitch mb-2">Essential</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary-stitch">Rp 49k</span>
                    <span className="text-secondary-stitch font-medium">/event</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-secondary-stitch">
                    <CheckCircle2 className="w-5 h-5 text-primary-stitch" />
                    10 Editorial Templates
                  </li>
                  <li className="flex items-center gap-3 text-secondary-stitch">
                    <CheckCircle2 className="w-5 h-5 text-primary-stitch" />
                    Digital RSVP Tracking
                  </li>
                  <li className="flex items-center gap-3 text-secondary-stitch opacity-40">
                    <XCircle className="w-5 h-5" />
                    Custom Domain
                  </li>
                </ul>
                <button 
                  onClick={() => router.push('/buat-undangan')}
                  className="w-full py-4 rounded-full border-2 border-outline-variant-stitch text-primary-stitch font-bold hover:bg-primary-stitch hover:text-white transition-all"
                >
                  Select Plan
                </button>
              </div>

              {/* Titanium (Featured) */}
              <div className="bg-primary-stitch p-10 rounded-[48px] flex flex-col relative overflow-hidden shadow-2xl scale-105 z-10 text-white">
                <div className="absolute top-6 right-10 bg-tertiary-fixed-dim-stitch text-on-tertiary-fixed-variant-stitch px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Popular</div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-on-primary-container-stitch mb-2">Titanium Account</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">Rp 129k</span>
                    <span className="text-on-primary-container-stitch font-medium">/event</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim-stitch" />
                    Unlimited Luxury Templates
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim-stitch" />
                    Concierge Support
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim-stitch" />
                    Custom Invitation Domain
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-tertiary-fixed-dim-stitch" />
                    Guest List Automation
                  </li>
                </ul>
                <button 
                  onClick={() => router.push('/buat-undangan')}
                  className="w-full py-5 rounded-full bg-gradient-to-r from-tertiary-fixed-dim-stitch to-on-tertiary-container-stitch text-tertiary-stitch font-black shadow-xl shadow-tertiary-stitch/40 hover:scale-105 transition-transform"
                >
                  Get Premium Access
                </button>
              </div>

              {/* Bespoke */}
              <div className="bg-surface-container-low-stitch p-10 rounded-[48px] flex flex-col hover:translate-y-[-8px] transition-transform duration-500 border border-outline-variant-stitch/20">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary-stitch mb-2">Bespoke</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary-stitch">Rp 299k</span>
                    <span className="text-secondary-stitch font-medium">/event</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  <li className="flex items-center gap-3 text-secondary-stitch">
                    <CheckCircle2 className="w-5 h-5 text-primary-stitch" />
                    Custom Design Direction
                  </li>
                  <li className="flex items-center gap-3 text-secondary-stitch">
                    <CheckCircle2 className="w-5 h-5 text-primary-stitch" />
                    One-on-One Editor Call
                  </li>
                  <li className="flex items-center gap-3 text-secondary-stitch">
                    <CheckCircle2 className="w-5 h-5 text-primary-stitch" />
                    Multi-Event Coordination
                  </li>
                </ul>
                <button 
                  onClick={() => router.push('/buat-undangan')}
                  className="w-full py-4 rounded-full border-2 border-outline-variant-stitch text-primary-stitch font-bold hover:bg-primary-stitch hover:text-white transition-all"
                >
                  Inquire Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA Section ── */}
        <section className="py-24 px-8">
          <div className="max-w-5xl mx-auto rounded-[64px] bg-primary-stitch relative overflow-hidden p-16 md:p-24 text-center">
            <div className="absolute inset-0 opacity-20 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-gradient-to-tr from-on-tertiary-container-stitch to-transparent blur-3xl rounded-full"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8">Ready to define your digital legacy?</h2>
              <p className="text-on-primary-container-stitch text-xl max-w-2xl mx-auto mb-16 font-light">Join over 10,000+ couples who chose editorial excellence for their digital presence.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button 
                  onClick={() => router.push('/buat-undangan')}
                  className="bg-white text-primary-stitch px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform"
                >
                  Create My Invitation
                </button>
                <button 
                  onClick={() => router.push('/invite/demo')}
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-colors"
                >
                  Browse Gallery
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-20 px-8 bg-surface-container-low-stitch">
        <div className="max-w-7xl mx-auto border-t border-outline-variant-stitch/30 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-2xl font-black text-primary-stitch">Undang-io Luxe</div>
            <div className="flex flex-wrap justify-center gap-8 text-xs font-medium tracking-wide text-secondary-stitch uppercase">
              <Link className="hover:text-primary-stitch transition-colors" href="#">Privacy Policy</Link>
              <Link className="hover:text-primary-stitch transition-colors" href="#">Terms of Service</Link>
              <Link className="hover:text-primary-stitch transition-colors" href="#">Contact</Link>
              <Link className="hover:text-primary-stitch transition-colors" href="#">Wedding Gallery</Link>
            </div>
            <div className="text-secondary-stitch text-xs font-medium tracking-wide">
              © 2026 Undang-io Luxe. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
