'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ExternalLink, Layers, Info } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'info' | 'assets'>('assets')

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

  // Count filled assets per group for progress indication
  const filledCount = assets.length;
  const totalCount = ASSET_SLOTS.length;

  return (
    <div className="flex flex-col h-screen w-full bg-[#0A0A0A] text-[#E5E5E5] overflow-hidden font-sans">
      
      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0A0A0A] z-20">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-sm min-w-0">
          <Link 
            href="/dashboard/themes" 
            className="flex items-center gap-1 text-white/40 hover:text-white transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Themes</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-white font-medium truncate max-w-[240px]">{theme.display_name}</span>
          {theme.is_premium && (
            <span className="bg-amber-500/15 text-amber-400 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
              Premium
            </span>
          )}
        </div>

        {/* Right: Status + Toggle + Preview Link */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Status Badge */}
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            theme.is_active 
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' 
              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            {theme.is_active ? 'ACTIVE' : 'DRAFT'}
          </span>
          
          {/* Active Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={theme.is_active} onChange={handleToggleActive} />
            <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>

          {/* Divider */}
          <div className="w-px h-5 bg-white/[0.08]" />

          {/* Preview Link */}
          <Link
            href={`/preview/${theme.theme_key}`}
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all"
          >
            <span>Lihat Preview</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Panel ────────────────────────────────────── */}
        <div className="w-[460px] shrink-0 border-r border-white/[0.06] flex flex-col bg-[#111111]">
          
          {/* Tab Switcher */}
          <div className="flex items-center gap-1 px-4 pt-4 pb-3 shrink-0">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'info'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              Info Tema
            </button>
            <button
              onClick={() => setActiveTab('assets')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'assets'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Aset
              {/* Progress chip */}
              <span className={`text-[10px] ml-1 px-1.5 py-0.5 rounded-full leading-none ${
                filledCount === totalCount
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-white/[0.08] text-white/40'
              }`}>
                {filledCount}/{totalCount}
              </span>
            </button>
          </div>

          {/* Tab Content — scrollable */}
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            
            {/* ── Tab: Info Tema ─────────────────────────────── */}
            {activeTab === 'info' && (
              <ThemeInfoForm theme={theme} />
            )}

            {/* ── Tab: Aset ──────────────────────────────────── */}
            {activeTab === 'assets' && (
              <div className="space-y-5">
                {groups.map(group => {
                  const groupSlots = ASSET_SLOTS.filter(a => a.group === group);
                  const groupFilled = groupSlots.filter(s => 
                    assets.some(a => a.slot === s.slot && a.file_url)
                  ).length;

                  return (
                    <div key={group}>
                      {/* Group Header */}
                      <div className="flex items-center justify-between mb-2.5 px-0.5">
                        <h3 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">
                          {group}
                        </h3>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          groupFilled === groupSlots.length
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'text-white/25'
                        }`}>
                          {groupFilled}/{groupSlots.length}
                        </span>
                      </div>
                      
                      {/* Slot Cards */}
                      <div className="space-y-1.5">
                        {groupSlots.map(spec => (
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
                  )
                })}
              </div>
            )}

          </div>
        </div>

        {/* ── Right Panel: Preview ──────────────────────────── */}
        <div className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
          {/* Toggle Bar */}
          <SectionToggleBar themeKey={theme.theme_key} initialConfig={theme.section_config} onConfigChange={handleConfigChange} />
          
          {/* Preview Panel Wrapper */}
          <div className="flex-1 relative w-full h-full"> 
            <ThemePreviewPanel initialTheme={theme} />
          </div>
        </div>

      </div>
    </div>
  )
}
