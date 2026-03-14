// ============================================================
// UMUMAN — Theme Engine Types
// ============================================================

export type ThemeStatus = 'draft' | 'active' | 'archived';

export type CulturalCategory =
  | 'jawa'
  | 'sunda'
  | 'minang'
  | 'bugis'
  | 'bali'
  | 'betawi'
  | 'melayu'
  | 'modern'
  | 'islami'
  | 'rustic'
  | 'minimalis'
  | 'other';

export const CULTURAL_LABELS: Record<CulturalCategory, string> = {
  jawa: 'Jawa',
  sunda: 'Sunda',
  minang: 'Minang',
  bugis: 'Bugis',
  bali: 'Bali',
  betawi: 'Betawi',
  melayu: 'Melayu',
  modern: 'Modern',
  islami: 'Islami',
  rustic: 'Rustic Nusantara',
  minimalis: 'Minimalis',
  other: 'Lainnya',
};

export type HeroAnimation = 'none' | 'confetti' | 'petals' | 'sparkles';
export type AnimationIntensity = 'low' | 'medium' | 'high';
export type BorderRadiusStyle = 'soft' | 'medium' | 'ornate';
export type ShadowStyle = 'none' | 'soft' | 'medium' | 'dramatic';

export interface ThemeColors {
  primary: string;       // HSL string e.g. "350 40% 75%"
  secondary: string;
  accent: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
}

export interface ThemeAnimationSettings {
  heroAnimation: HeroAnimation;
  intensity: AnimationIntensity;
  parallax: boolean;
  scrollReveal: boolean;
  musicAutoplay: boolean;
  videoIntro: boolean;
}

export interface ThemeStyleSettings {
  borderRadius: BorderRadiusStyle;
  shadow: ShadowStyle;
}

export interface ThemeAssetSlot {
  id: string;
  themeId: string;
  slotKey: string;
  slotLabel: string;
  slotDescription: string;
  widthCm: number;
  heightCm: number;
  aspectRatio: string;
  assetUrl: string | null;
  assetType: 'image' | 'png_transparent';
  displayOrder: number;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  culturalCategory: CulturalCategory;
  status: ThemeStatus;
  thumbnailUrl: string | null;
  musicUrl: string | null;
  videoUrl: string | null;
  colors: ThemeColors;
  typography: ThemeTypography;
  animationSettings: ThemeAnimationSettings;
  styleSettings: ThemeStyleSettings;
  assetSlots: ThemeAssetSlot[];
  createdAt: string;
  updatedAt: string;
}

/** User's theme preference for a specific invitation */
export interface InvitationThemePreference {
  id: string;
  invitationId: string;
  themeId: string;
  sortOrder: number;
  isEnabled: boolean;
  isPrimary: boolean;
  theme?: Theme; // joined
}

/** Slot definition template (used by admin form) */
export interface SlotDefinition {
  slotKey: string;
  slotLabel: string;
  slotDescription: string;
  widthCm: number;
  heightCm: number;
  aspectRatio: string;
  assetType: 'image' | 'png_transparent';
  required: boolean;
  maxFiles?: number; // for particles slot
}
