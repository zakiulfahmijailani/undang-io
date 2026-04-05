import { create } from 'zustand';
import { AssetKind, InvitationSection } from '@/types/theme';

export interface ThemeColors {
  primary: string;
  accent: string;
  text: string;
  cta: string;
}

export interface ThemePreviewStore {
  themeKey: string;
  assets: Record<AssetKind, string | null>; // slot → URL
  themeColors: ThemeColors;
  activeSection: InvitationSection | null; // section mana yang sedang di-highlight
  
  // Actions
  setThemeKey: (key: string) => void;
  setAsset: (slot: AssetKind, url: string | null) => void;
  setColors: (colors: ThemeColors) => void;
  setActiveSection: (section: InvitationSection | null) => void;
  setAllAssets: (assets: Record<AssetKind, string | null>) => void;
}

const defaultAssets: Record<AssetKind, string | null> = {
  cover_scene: null,
  left_panel_alt: null,
  corner_tl: null,
  corner_tr: null,
  corner_bl: null,
  corner_br: null,
  divider_main: null,
  divider_alt: null,
  frame_couple: null,
  pattern_main: null,
  pattern_alt: null,
  icon_venue: null,
  illustration_iconic: null,
  banner_top: null,
  footer_scene: null,
  music: null,
};

export const useThemePreviewStore = create<ThemePreviewStore>((set) => ({
  themeKey: '',
  assets: defaultAssets,
  themeColors: {
    primary: '#1B4F32',
    accent: '#D4AF37',
    text: '#333333',
    cta: '#2563EB',
  },
  activeSection: null,

  setThemeKey: (key) => set({ themeKey: key }),
  
  setAsset: (slot, url) =>
    set((state) => ({
      assets: {
        ...state.assets,
        [slot]: url,
      },
    })),
    
  setAllAssets: (assets) => set({ assets }),
  
  setColors: (colors) => set({ themeColors: colors }),
  
  setActiveSection: (section) => set({ activeSection: section }),
}));
