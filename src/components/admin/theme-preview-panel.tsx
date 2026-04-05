'use client'

import React, { Component, ErrorInfo, ReactNode, useEffect, useRef } from 'react'
import { useThemePreviewStore } from '@/stores/theme-preview-store'
import { InvitationSection, AdminTheme } from '@/types/theme'

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Preview rendering error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-red-950/20 text-red-500 p-4 rounded-lg border border-red-900 border-dashed">
           <p className="text-sm">Error rendering preview. The preview component crashed.</p>
        </div>
      );
    }
    return this.props.children; 
  }
}

interface PreviewPanelProps {
  initialTheme: AdminTheme;
}

export function ThemePreviewPanel({ initialTheme }: PreviewPanelProps) {
  const { assets, themeColors, activeSection } = useThemePreviewStore();
  const sectionConfig = initialTheme.section_config;

  const sectionRefs = useRef<Record<InvitationSection, HTMLDivElement | null>>({
    cover: null,
    ayat: null,
    couple: null,
    countdown: null,
    love_story: null,
    acara: null,
    gallery: null,
    gift: null,
    rsvp: null,
    footer: null
  });

  useEffect(() => {
    if (activeSection && sectionRefs.current[activeSection]) {
      sectionRefs.current[activeSection]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSection]);

  const getHighlightClass = (section: InvitationSection) => {
    return activeSection === section 
      ? 'ring-2 ring-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)] z-10 transition-all duration-300 transform scale-[1.01]' 
      : 'ring-1 ring-white/5 opacity-80 hover:opacity-100 transition-all duration-300';
  }

  // Helper to ensure transparent assets render correctly
  const renderAsset = (url: string | null, alt: string, classes: string = "") => {
    if (!url) return null;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={alt} className={`absolute pointer-events-none object-cover ${classes}`} />;
  }

  return (
    <ErrorBoundary>
      <div 
        className="w-full h-full overflow-y-auto bg-black p-8 pb-32 space-y-12 flex flex-col items-center custom-scrollbar"
        style={{
          ['--color-primary' as string]: themeColors.primary,
          ['--color-accent' as string]: themeColors.accent,
          ['--color-text' as string]: themeColors.text,
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .preview-text-primary { color: var(--color-primary); }
          .preview-text-accent { color: var(--color-accent); }
          .preview-text-body { color: var(--color-text); }
          .preview-bg-primary { background-color: var(--color-primary); }
          .preview-bg-accent { background-color: var(--color-accent); }
        `}} />

        {/* 1. Cover Section */}
        {sectionConfig?.show_foto_cover !== false && (
          <div 
            ref={el => { sectionRefs.current['cover'] = el; }}
            id="preview-cover"
            className={`relative w-full max-w-md aspect-[2/3] bg-surface rounded-2xl overflow-hidden ${getHighlightClass('cover')}`}
          >
            {/* Background */}
            {assets.cover_scene ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assets.cover_scene} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-surface-2 flex items-center justify-center text-white/20 text-xs">No Cover Scene</div>
            )}
            
            {/* Corners */}
            {renderAsset(assets.corner_tl, 'Corner TL', 'top-0 left-0 w-32 h-32')}
            {renderAsset(assets.corner_tr, 'Corner TR', 'top-0 right-0 w-32 h-32')}
            {renderAsset(assets.corner_bl, 'Corner BL', 'bottom-0 left-0 w-32 h-32')}
            {renderAsset(assets.corner_br, 'Corner BR', 'bottom-0 right-0 w-32 h-32')}
            
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 text-center bg-black/20 backdrop-blur-[2px]">
              <h2 className="text-3xl font-serif text-white mb-2 shadow-black drop-shadow-md">Romeo & Juliet</h2>
              <p className="text-white/80 text-sm tracking-widest uppercase shadow-black drop-shadow-md">We Are Getting Married</p>
            </div>
          </div>
        )}

        {/* 2. Ayat & Quote */}
        {sectionConfig?.show_ayat_quote !== false && (
          <div 
            ref={el => { sectionRefs.current['ayat'] = el; }}
            className={`relative w-full max-w-md p-10 bg-surface rounded-2xl text-center flex flex-col items-center ${getHighlightClass('ayat')}`}
          >
            {/* Background Pattern */}
            {assets.pattern_main && (
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none rounded-2xl" 
                style={{ backgroundImage: `url(${assets.pattern_main})`, backgroundSize: '100px 100px' }}
              />
            )}
            
            {/* Divider Top */}
            {assets.divider_main && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assets.divider_main} alt="Divider" className="w-full max-w-[200px] h-auto mb-6" />
            )}
            
            <h3 className="preview-text-primary text-xl font-serif mb-4 relative z-10">Ar-Rum: 21</h3>
            <p className="preview-text-body text-sm relative z-10">
              "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..."
            </p>
          </div>
        )}

        {/* 3. Data Mempelai */}
        {sectionConfig?.show_data_mempelai !== false && (
          <div 
            ref={el => { sectionRefs.current['couple'] = el; }}
            className={`relative w-full max-w-md p-0 bg-surface rounded-2xl overflow-hidden flex flex-col items-center ${getHighlightClass('couple')}`}
          >
            {renderAsset(assets.corner_bl, 'Corner BL', 'bottom-0 left-0 w-32 h-32 z-10')}
            {renderAsset(assets.corner_br, 'Corner BR', 'bottom-0 right-0 w-32 h-32 z-10')}

            <div className="w-full flex">
              {/* Left Panel Illustration */}
              <div className="w-1/3 relative bg-surface-2 min-h-[300px]">
                {assets.left_panel_alt && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assets.left_panel_alt} alt="Left Panel" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              
              <div className="w-2/3 p-8 flex flex-col items-center text-center">
                <div className="relative w-32 h-40 mb-4 bg-surface-2 rounded-full overflow-hidden border-2 border-white/10 flex items-center justify-center">
                  <span className="text-white/20 text-xs">Photo</span>
                  {renderAsset(assets.frame_couple, 'Frame Couple', 'top-0 left-0 w-full h-full z-10')}
                </div>
                
                <h3 className="preview-text-primary text-2xl font-serif">Romeo Montague</h3>
                <p className="preview-text-body text-xs mt-2">Putra dari Bpk. Montague & Ibu Montague</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Kisah Cinta */}
        {sectionConfig?.show_kisah_cinta !== false && (
          <div 
            ref={el => { sectionRefs.current['love_story'] = el; }}
            className={`relative w-full max-w-md p-8 bg-surface rounded-2xl flex flex-col items-center text-center ${getHighlightClass('love_story')}`}
          >
            {/* Iconic Illustration */}
            {assets.illustration_iconic && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assets.illustration_iconic} alt="Love Story Header" className="w-full max-h-48 object-contain mb-8" />
            )}
            
            <h3 className="preview-text-primary text-2xl font-serif mb-6">Kisah Cinta</h3>
            
            <div className="w-full text-left border-l-2 preview-border-primary pl-4 py-2 opacity-50">
              <h4 className="text-sm font-bold preview-text-accent">2020 - Pertemuan Pertama</h4>
              <p className="text-xs preview-text-body mt-1">Kami pertama kali bertemu di sebuah acara...</p>
            </div>
            
            {/* Divider Alt */}
            {assets.divider_alt && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={assets.divider_alt} alt="Divider Alt" className="w-full max-w-[200px] h-auto mt-8" />
            )}
          </div>
        )}

        {/* 5. Acara */}
        {sectionConfig?.show_acara !== false && (
          <div 
            ref={el => { sectionRefs.current['acara'] = el; }}
            className={`relative w-full max-w-md bg-surface rounded-2xl overflow-hidden flex flex-col items-center pt-0 pb-10 ${getHighlightClass('acara')}`}
          >
            {/* Banner Top */}
            <div className="w-full h-24 bg-surface-2 relative flex items-center justify-center">
               {assets.banner_top ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={assets.banner_top} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
               ) : (
                 <span className="text-white/20 text-xs">Banner Top</span>
               )}
            </div>

            {/* Venue Icon */}
            {assets.icon_venue && (
              // eslint-disable-next-line @next/next/no-img-element
               <img src={assets.icon_venue} alt="Venue" className="w-20 h-20 mt-6 object-contain" />
            )}
            
            <h3 className="preview-text-primary text-2xl font-serif mt-4">Akad Nikah</h3>
            <p className="preview-text-accent font-medium mt-2">Sabtu, 12 Desember 2026</p>
            <p className="preview-text-body text-sm mt-1">08:00 WIB - Selesai</p>
            <div className="preview-bg-primary text-white text-xs px-4 py-2 rounded-full mt-4">Lihat Lokasi</div>
          </div>
        )}

        {/* 6. Galeri Foto */}
        {sectionConfig?.show_galeri_foto !== false && (
          <div 
            ref={el => { sectionRefs.current['gallery'] = el; }}
            className={`relative w-full max-w-md p-8 bg-surface rounded-2xl flex flex-col items-center ${getHighlightClass('gallery')}`}
          >
             {/* Background Pattern Alt */}
             {assets.pattern_alt && (
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none rounded-2xl" 
                style={{ backgroundImage: `url(${assets.pattern_alt})`, backgroundSize: '150px 150px' }}
              />
            )}
            
            <h3 className="preview-text-primary text-2xl font-serif mb-6 relative z-10">Galeri</h3>
            <div className="grid grid-cols-2 gap-2 relative z-10 w-full">
               <div className="aspect-square bg-surface-2 rounded-lg"></div>
               <div className="aspect-square bg-surface-2 rounded-lg"></div>
               <div className="aspect-square bg-surface-2 rounded-lg col-span-2 aspect-[2/1]"></div>
            </div>
          </div>
        )}

        {/* 7. Amplop Digital */}
        {sectionConfig?.show_amplop_digital !== false && (
          <div 
            ref={el => { sectionRefs.current['gift'] = el; }}
            className={`relative w-full max-w-md p-10 bg-surface rounded-2xl flex flex-col items-center text-center ${getHighlightClass('gift')}`}
          >
             {renderAsset(assets.corner_tl, 'Corner TL', 'top-0 left-0 w-24 h-24 opacity-50')}
             {renderAsset(assets.corner_br, 'Corner BR', 'bottom-0 right-0 w-24 h-24 opacity-50')}
             <h3 className="preview-text-primary text-2xl font-serif mb-4">Amplop Digital</h3>
             <p className="preview-text-body text-sm opacity-80 mb-6">Doa restu Anda merupakan karunia yang sangat berarti.</p>
             <div className="w-full p-4 border border-white/10 rounded-xl bg-black/20 backdrop-blur-sm relative z-10">
                <p className="preview-text-accent font-medium mb-1">BCA</p>
                <p className="text-white text-lg tracking-widest">1234 5678 90</p>
                <p className="preview-text-body text-xs mt-1">a.n Romeo Montague</p>
             </div>
          </div>
        )}

        {/* 8. Musik & 9. Footer */}
        <div 
          ref={el => { sectionRefs.current['footer'] = el; }}
          className={`relative w-full max-w-md bg-surface rounded-2xl flex flex-col items-center overflow-hidden ${getHighlightClass('footer')}`}
        >
           <div className="w-full flex justify-center py-6 border-b border-white/5 bg-black/20">
             {assets.music ? (
               <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-full border border-emerald-900/50">
                  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/20">🎶</div>
                  <span className="text-xs text-emerald-400">Audio Track Loaded</span>
               </div>
             ) : (
               <span className="text-xs text-white/30">No Background Music</span>
             )}
           </div>

           <div className="w-full h-64 relative bg-surface-2 flex items-center justify-center">
             {assets.footer_scene ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={assets.footer_scene} alt="Footer" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <span className="text-white/20 text-sm">Footer Scene Illustration</span>
             )}
             <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center text-center">
                <h2 className="text-2xl font-serif text-white shadow-black drop-shadow-md">Romeo & Juliet</h2>
                <p className="text-white/60 text-xs mt-2 font-mono">undang.io</p>
             </div>
           </div>
        </div>

      </div>
    </ErrorBoundary>
  )
}
