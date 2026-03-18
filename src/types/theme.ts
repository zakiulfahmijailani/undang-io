// ============================================================
// undang-io — Theme Engine Types
// Phase 2a: Parallax Theme System Extension
// ============================================================

// ─────────────────────────────────────────
// LEGACY TYPES (preserved — used by existing components)
// ─────────────────────────────────────────

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
  primary: string;
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

export interface InvitationThemePreference {
  id: string;
  invitationId: string;
  themeId: string;
  sortOrder: number;
  isEnabled: boolean;
  isPrimary: boolean;
  theme?: Theme;
}

export interface SlotDefinition {
  slotKey: string;
  slotLabel: string;
  slotDescription: string;
  widthCm: number;
  heightCm: number;
  aspectRatio: string;
  assetType: 'image' | 'png_transparent';
  required: boolean;
  maxFiles?: number;
}


// ─────────────────────────────────────────
// PARALLAX THEME SYSTEM — Phase 2a
// Maps to: themes, theme_asset_slots, invitation_theme_preferences
// ─────────────────────────────────────────

export type ParallaxSlotKey =
  | 'bg'
  | 'bg_detail'
  | 'mid_left'
  | 'mid_right'
  | 'mid_center'
  | 'deco_top'
  | 'deco_bottom'
  | 'overlay'
  | 'texture'
  | 'particle'
  | 'extra_1'
  | 'extra_2'
  | 'extra_3'
  | 'extra_4'
  | 'extra_5'
  | 'photo_groom'   // user-provided — never from admin upload
  | 'photo_bride';  // user-provided — never from admin upload

export const PARALLAX_SLOT_LABELS: Record<ParallaxSlotKey, string> = {
  bg: 'Background (Sky/Landscape)',
  bg_detail: 'Mountain / Hills Silhouette',
  mid_left: 'Trees / Archway Left',
  mid_right: 'Trees / Archway Right',
  mid_center: 'Gazebo / Arch Centerpiece',
  deco_top: 'Hanging Florals / Vines',
  deco_bottom: 'Ground Flowers / Petals',
  overlay: 'Light Rays / Bokeh',
  texture: 'Paper Grain / Gold Foil',
  particle: 'Floating Petals / Dust',
  extra_1: 'Extra Layer 1',
  extra_2: 'Extra Layer 2',
  extra_3: 'Extra Layer 3',
  extra_4: 'Extra Layer 4',
  extra_5: 'Extra Layer 5',
  photo_groom: 'Foto Mempelai Pria',
  photo_bride: 'Foto Mempelai Wanita',
};

export interface ParallaxLayerSettings {
  /** Depth factor: 0.0 (no movement) → 1.0 (full movement). Default: 0.5 */
  depth: number;
  zIndex: number;
  opacity: number;
  scrollZoom: boolean;
  floatLoop: boolean;
  floatDuration?: number;
  blendMode?: string;
  offsetTransform?: string;
}

export interface ParallaxPalette {
  primary: string;
  accent: string;
  text: string;
  surface?: string;
  overlay?: string;
}

export interface ParallaxTypography {
  heading: string;
  body: string;
  accent?: string;
}

export interface ParallaxAnimationConfig {
  tiltStrength: number;
  scrollStrength: number;
  zoomEnabled: boolean;
  lerpFactor: number;
  gyroEnabled: boolean;
}

export interface ParallaxThemeConfig {
  version: 1;
  animation: ParallaxAnimationConfig;
  fonts: ParallaxTypography;
  palette: ParallaxPalette;
  slots: ParallaxSlotKey[];
}

export interface ParallaxAssetSlot {
  id: string;
  themeId: string;
  slotKey: ParallaxSlotKey;
  slotLabel: string;
  assetUrl: string | null;
  assetType: 'image' | 'png_transparent' | 'svg';
  displayOrder: number;
  isActive: boolean;
  isRequired: boolean;
  settings: ParallaxLayerSettings;
}

export interface ParallaxTheme {
  id: string;                        // text PK (not uuid — matches live DB)
  name: string;
  slug: string;
  description: string | null;
  status: 'draft' | 'active' | 'archived';
  isPublished: boolean;
  culturalCategory: CulturalCategory | null;
  previewUrl: string | null;
  musicUrl: string | null;
  tags: string[];
  config: ParallaxThemeConfig;
  colors: ParallaxPalette;
  typography: ParallaxTypography;
  animationSettings: ParallaxAnimationConfig;
  assetSlots: ParallaxAssetSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface InvitationParallaxPreference {
  id: string;
  invitationId: string;
  themeId: string;
  isPrimary: boolean;
  isEnabled: boolean;
  sortOrder: number;
  photoGroom: string | null;
  photoBride: string | null;
  configOverride?: Partial<ParallaxThemeConfig>;
  theme?: ParallaxTheme;
}

export interface ParallaxRenderState {
  tiltX: number;
  tiltY: number;
  scrollProgress: number;
  isMobile: boolean;
  reducedMotion: boolean;
}

export interface ParallaxLayerProps {
  slot: ParallaxAssetSlot;
  renderState: ParallaxRenderState;
  srcOverride?: string;
}

// ─────────────────────────────────────────
// SUPABASE RAW TYPES (snake_case — pre-mapping)
// ─────────────────────────────────────────

export interface SupabaseThemeRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  is_published: boolean;
  cultural_category: string | null;
  preview_url: string | null;
  music_url: string | null;
  tags: string[] | null;
  config: ParallaxThemeConfig | null;
  colors: ParallaxPalette | null;
  typography: ParallaxTypography | null;
  animation_settings: ParallaxAnimationConfig | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAssetSlotRow {
  id: string;
  theme_id: string;
  slot_key: string;
  slot_label: string;
  asset_url: string | null;
  asset_type: string;
  display_order: number;
  is_active: boolean;
  is_required: boolean;
  settings: ParallaxLayerSettings | null;
}

export interface SupabaseThemePreferenceRow {
  id: string;
  invitation_id: string;
  theme_id: string;
  is_primary: boolean;
  is_enabled: boolean;
  sort_order: number;
}

// ─────────────────────────────────────────
// DEFAULT VALUES & PRESETS
// ─────────────────────────────────────────

export const DEFAULT_PARALLAX_ANIMATION: ParallaxAnimationConfig = {
  tiltStrength: 12,
  scrollStrength: 0.35,
  zoomEnabled: true,
  lerpFactor: 0.08,
  gyroEnabled: true,
};

export const DEFAULT_LAYER_SETTINGS: ParallaxLayerSettings = {
  depth: 0.5,
  zIndex: 0,
  opacity: 1,
  scrollZoom: false,
  floatLoop: false,
  blendMode: 'normal',
};

export const SLOT_DEPTH_PRESETS: Partial<Record<ParallaxSlotKey, number>> = {
  bg: 0.05,
  bg_detail: 0.12,
  mid_left: 0.25,
  mid_right: 0.25,
  mid_center: 0.40,
  deco_top: 0.55,
  deco_bottom: 0.50,
  overlay: 0.65,
  texture: 0.0,
  particle: 0.80,
  photo_groom: 0.45,
  photo_bride: 0.45,
};

export const SLOT_ZINDEX_PRESETS: Partial<Record<ParallaxSlotKey, number>> = {
  bg: 0,
  bg_detail: 1,
  mid_left: 2,
  mid_right: 2,
  mid_center: 3,
  deco_bottom: 4,
  photo_groom: 5,
  photo_bride: 5,
  deco_top: 6,
  overlay: 7,
  texture: 8,
  particle: 9,
  extra_1: 10,
  extra_2: 11,
  extra_3: 12,
  extra_4: 13,
  extra_5: 14,
};