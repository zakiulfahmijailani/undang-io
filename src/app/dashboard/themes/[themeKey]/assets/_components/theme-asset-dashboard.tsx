'use client'

import { useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AdminTheme, AdminThemeAsset, AssetKind, SectionConfig } from '@/types/theme'
import { useThemePreviewStore } from '@/stores/theme-preview-store'
import { ThemeAssetRow } from '@/components/admin/theme-asset-row'
import { ThemePreviewPanel } from '@/components/admin/theme-preview-panel'
import { SectionToggleBar } from '@/components/admin/section-toggle-bar'
import { ThemeInfoForm } from '@/components/admin/theme-info-form'
import { toggleThemeActive, deleteThemeAsset } from '@/app/dashboard/themes/actions'

interface Props {
  theme: AdminTheme;
  assets: AdminThemeAsset[];
}

const ASSET_SLOTS: Array<{ slot: AssetKind, label: string, description: string, idealSize: string, needsTransparent: boolean, group: string }> = [
  // Scene & Background
  { slot: 'cover_scene', label: 'Cover Scene', description: 'Full scene background cover', idealSize: '1200×1800 px', needsTransparent: false, group: 'Scene & Background' },
  { slot: 'left_panel_alt', label: 'Ilustrasi Panel Kiri', description: 'Ilustrasi untuk data mempelai', idealSize: '800×1200 px', needsTransparent: false, group: 'Scene & Background' },
  { slot: 'footer_scene', label: 'Ilustrasi Footer', description: 'Ilustrasi footer/penutup', idealSize: '1200×600 px', needsTransparent: false, group: 'Scene & Background' },
  
  // Ornamen Corner
  { slot: 'corner_tl', label: 'Pojok Kiri Atas', description: 'Ornamen pojok top-left', idealSize: '400×400 px', needsTransparent: true, group: 'Ornamen Corner' },
  { slot: 'corner_tr', label: 'Pojok Kanan Atas', description: 'Ornamen pojok top-right', idealSize: '400×400 px', needsTransparent: true, group: 'Ornamen Corner' },
  { slot: 'corner_bl', label: 'Pojok Kiri Bawah', description: 'Ornamen pojok bottom-left', idealSize: '400×400 px', needsTransparent: true, group: 'Ornamen Corner' },
  { slot: 'corner_br', label: 'Pojok Kanan Bawah', description: 'Ornamen pojok bottom-right', idealSize: '400×400 px', needsTransparent: true, group: 'Ornamen Corner' },
  
  // Divider & Pattern
  { slot: 'divider_main', label: 'Divider Utama', description: 'Pemisah utama', idealSize: '1200×120 px', needsTransparent: true, group: 'Divider & Pattern' },
  { slot: 'divider_alt', label: 'Divider Alternatif', description: 'Pemisah alternatif', idealSize: '1200×120 px', needsTransparent: true, group: 'Divider & Pattern' },
  { slot: 'pattern_main', label: 'Pattern Utama', description: 'Pola repeating utama', idealSize: '400×400 px', needsTransparent: true, group: 'Divider & Pattern' },
  { slot: 'pattern_alt', label: 'Pattern Alternatif', description: 'Pola repeating alternatif', idealSize: '400×400 px', needsTransparent: true, group: 'Divider & Pattern' },
  
  // Frame & Ikon
  { slot: 'frame_couple', label: 'Frame Foto Pengantin', description: 'Frame foto pasangan', idealSize: '500×600 px', needsTransparent: true, group: 'Frame & Ikon' },
  { slot: 'icon_venue', label: 'Ikon Venue', description: 'Ikon lokasi acara', idealSize: '200×200 px', needsTransparent: true, group: 'Frame & Ikon' },
  
  // Dekoratif
  { slot: 'illustration_iconic', label: 'Ilustrasi Ikonik', description: 'Ilustrasi ikonik daerah', idealSize: '700×400 px', needsTransparent: true, group: 'Dekoratif' },
  { slot: 'banner_top', label: 'Banner Dekoratif Atas', description: 'Banner atas lokasi acara', idealSize: '1200×200 px', needsTransparent: true, group: 'Dekoratif' },
  
  // Media
  { slot: 'music', label: 'Musik Latar', description: 'File audio .mp3', idealSize: 'Max 5MB', needsTransparent: false, group: 'Media' },
];

export function ThemeAssetDashboard({ theme, assets }: Props) {
  const store = useThemePreviewStore();

  // Initialize store on mount
  useEffect(() => {
    store.setThemeKey(theme.theme_key);
    store.setColors({
      primary: theme.color_primary || '#1B4F32',
      accent: theme.color_accent || '#D4AF37',
      text: theme.color_text || '#333333',
      cta: theme.color_cta || '#2563EB',
    });
    
    // Convert assets array to record for store
    const assetRecord: Record<string, string | null> = {};
    assets.forEach(a => {
      assetRecord[a.slot] = a.file_url || null;
    });
    store.setAllAssets(assetRecord as Record<AssetKind, string | null>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.id]); 
  // ONLY run once on mount or when theme object fully swaps. 
  // We don't want to re-run and overwrite store optimistic updates if server hasn't revalidated yet.

  const handleToggleActive = async () => {
    await toggleThemeActive(theme.theme_key, !theme.is_active);
  }

  const handleUploadSuccess = useCallback((slot: AssetKind, url: string, asset: AdminThemeAsset) => {
    store.setAsset(slot, url);
  }, [store]);

  const handleDelete = useCallback(async (slot: AssetKind) => {
    const res = await deleteThemeAsset(theme.theme_key, slot);
    if (res.success) {
      store.setAsset(slot, null);
    } else {
      alert(res.error || 'Failed to delete asset');
    }
  }, [theme.theme_key, store]);

  const handleConfigChange = useCallback((newConfig: SectionConfig) => {
    // Next.js will revalidate the server data for us,
    // but the actual Preview Panel receives its config directly from initialTheme.
    // In a fully controlled setup, we would read sectionStatus from Zustand.
    // Here we will do a light router refresh if strictly needed, or just let the Action's `revalidatePath` handle it.
  }, []);

  const SLOT_TO_SECTION: Record<AssetKind, any> = {
    cover_scene: 'cover',
    corner_tl: 'cover',
    corner_tr: 'cover',
    left_panel_alt: 'couple',
    frame_couple: 'couple',
    corner_bl: 'couple',
    corner_br: 'couple',
    divider_main: 'ayat',
    pattern_main: 'ayat',
    illustration_iconic: 'love_story',
    divider_alt: 'love_story',
    icon_venue: 'acara',
    banner_top: 'acara',
    pattern_alt: 'gallery',
    footer_scene: 'footer',
    music: 'footer',
  };

  const handleHover = useCallback((slot: AssetKind | null) => {
    store.setActiveSection(slot ? SLOT_TO_SECTION[slot] : null);
  }, [store]);

  // Grouping
  const groups = Array.from(new Set(ASSET_SLOTS.map(a => a.group)));

  return (
    <div className="flex h-screen w-full bg-[#0F0F0F] text-[#E5E5E5] overflow-hidden font-sans">
      
      {/* Panel Kiri: Form & Asset List */}
      <div className="w-[480px] shrink-0 border-r border-white/5 flex flex-col bg-[#1A1A1A]">
        
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-surface-2 z-10 sticky top-0">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
             <Link href="/dashboard/themes" className="hover:text-white flex items-center">
               <ChevronLeft className="w-4 h-4 mr-1" /> Dashboard
             </Link>
             <span>/</span>
             <Link href="/dashboard/themes" className="hover:text-white">Tema</Link>
             <span>/</span>
             <span className="text-white font-medium truncate max-w-[200px]">{theme.display_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-white">{theme.display_name}</h1>
              {theme.is_premium && (
                <span className="bg-amber-500/20 text-amber-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-amber-500/30">Premium</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                theme.is_active 
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {theme.is_active ? 'ACTIVE' : 'DRAFT'}
              </span>
              
              {/* Active Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={theme.is_active} onChange={handleToggleActive} />
                <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
           
           {/* Section 1: Info Tema */}
           <ThemeInfoForm theme={theme} />

           {/* Section 2: Upload Assets */}
           <div className="space-y-8">
             {groups.map(group => (
               <div key={group}>
                 <h2 className="text-sm font-semibold text-white/80 mb-4 px-1">{group}</h2>
                 <div className="space-y-3">
                   {ASSET_SLOTS.filter(a => a.group === group).map(spec => (
                     <ThemeAssetRow
                       key={spec.slot}
                       themeKey={theme.theme_key}
                       slot={spec.slot}
                       label={spec.label}
                       description={spec.description}
                       idealSize={spec.idealSize}
                       needsTransparent={spec.needsTransparent}
                       currentAsset={assets.find(a => a.slot === spec.slot) || null}
                       onUploadSuccess={handleUploadSuccess}
                       onDelete={handleDelete}
                       onHover={handleHover}
                     />
                   ))}
                 </div>
               </div>
             ))}
           </div>

        </div>
      </div>

      {/* Panel Kanan: Preview */}
      <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
        {/* Toggle Bar */}
        <SectionToggleBar themeKey={theme.theme_key} initialConfig={theme.section_config} onConfigChange={handleConfigChange} />
        
        {/* Preview Panel Wrapper */}
        <div className="flex-1 relative w-full h-full"> 
          <ThemePreviewPanel initialTheme={theme} />
        </div>
      </div>

    </div>
  )
}
