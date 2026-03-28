// ============================================================
// undang-io — Theme Engine Types
// Phase 2a: Parallax Theme System Extension
// Phase 2b: Classic (Rehan-style) Full-Page Theme System
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


// ─────────────────────────────────────────
// CLASSIC THEME SYSTEM — Phase 2b
// Based on: NgodingSolusi/the-wedding-of-rehan-maulidan
// Spec: CLAUDE.md § "Theme Slot Specification v1"
// Maps to: Supabase table `classic_themes` (to be migrated)
// ─────────────────────────────────────────

/**
 * Particle animation type for the classic theme.
 * Rendered as floating elements over the page via canvas or CSS animation.
 */
export type ClassicParticleType =
  | 'petals'
  | 'sparkle'
  | 'bubbles'
  | 'leaves'
  | 'snow'
  | 'none';

/**
 * THEME-SLOT keys — assets prepared by admin/owner.
 * These are consistent per theme, stored in `classic_themes.assets` JSONB.
 * Images uploaded to Supabase Storage bucket: `theme-assets`
 */
export type ClassicThemeSlotKey =
  // Backgrounds (fullscreen JPG, 1920×1080px recommended)
  | 'bg_cover'          // Cover / hero section — section 1
  | 'bg_section_2'      // Profil mempelai section
  | 'bg_section_3'      // Countdown & info acara section
  | 'bg_section_4'      // Cerita cinta & galeri section
  | 'bg_section_5'      // Ucapan, RSVP & footer section
  | 'bg_groom_panel'    // Panel sisi kiri foto pria (portrait, 800×1200px)
  // Ornaments (PNG transparent)
  | 'ornament_half_circle'  // Setengah lingkaran bunga — pojok hero & transisi
  | 'ornament_overlay'      // Tekstur di atas hero cover (opacity ~30%)
  | 'ornament_bismillah'    // Kaligrafi / teks pembuka — swap per tema / agama
  | 'ornament_divider'      // Pemisah dekoratif antar section
  | 'ornament_corner_tl'    // Ornamen pojok kiri atas
  | 'ornament_corner_br'    // Ornamen pojok kanan bawah
  // Audio & animation
  | 'bg_music'          // MP3 background music (max 5MB)
  | 'loader_asset';     // GIF / Lottie JSON loading screen

/**
 * Human-readable label for each THEME-SLOT key.
 * Used in admin dashboard upload form.
 */
export const CLASSIC_THEME_SLOT_LABELS: Record<ClassicThemeSlotKey, string> = {
  bg_cover:             'Background Cover / Hero',
  bg_section_2:         'Background Section 2 — Profil Mempelai',
  bg_section_3:         'Background Section 3 — Countdown & Acara',
  bg_section_4:         'Background Section 4 — Cerita & Galeri',
  bg_section_5:         'Background Section 5 — Ucapan & Footer',
  bg_groom_panel:       'Panel Foto Sisi Pria',
  ornament_half_circle: 'Ornamen Setengah Lingkaran Bunga',
  ornament_overlay:     'Overlay Tekstur Hero',
  ornament_bismillah:   'Ornamen Pembuka (Bismillah / Salib / dll)',
  ornament_divider:     'Pemisah Section Dekoratif',
  ornament_corner_tl:   'Ornamen Pojok Kiri Atas',
  ornament_corner_br:   'Ornamen Pojok Kanan Bawah',
  bg_music:             'Musik Latar Undangan',
  loader_asset:         'Animasi Loading Screen',
};

/**
 * Required flag per theme slot.
 * Slots marked false → template gracefully hides when null.
 */
export const CLASSIC_THEME_SLOT_REQUIRED: Record<ClassicThemeSlotKey, boolean> = {
  bg_cover:             true,
  bg_section_2:         true,
  bg_section_3:         true,
  bg_section_4:         true,
  bg_section_5:         true,
  bg_groom_panel:       false,
  ornament_half_circle: false,
  ornament_overlay:     false,
  ornament_bismillah:   false,  // agama-sensitive — wajib nullable
  ornament_divider:     false,
  ornament_corner_tl:   false,
  ornament_corner_br:   false,
  bg_music:             false,
  loader_asset:         false,
};

/**
 * All THEME-SLOT assets for one classic theme.
 * Stored as `assets` JSONB column in `classic_themes` table.
 * All values are Supabase Storage public URLs (or null if not uploaded).
 */
export interface ClassicThemeAssets {
  // Backgrounds
  bg_cover:             string;
  bg_section_2:         string;
  bg_section_3:         string;
  bg_section_4:         string;
  bg_section_5:         string;
  bg_groom_panel:       string | null;

  // Ornaments (PNG transparent)
  ornament_half_circle: string | null;
  ornament_overlay:     string | null;
  /** Swap per cultural/religious theme. Set to null for non-Islamic themes. */
  ornament_bismillah:   string | null;
  ornament_divider:     string | null;
  ornament_corner_tl:   string | null;
  ornament_corner_br:   string | null;

  // Audio & animation
  bg_music:             string | null;
  loader_asset:         string | null;

  // Particles
  particle_type:        ClassicParticleType;
  /** HEX — override warna partikel. null = ikut color_primary */
  particle_color:       string | null;

  // Palette
  color_primary:        string;  // HEX — warna dominan (heading, aksen)
  color_secondary:      string;  // HEX — aksen pendukung
  color_accent:         string;  // HEX — highlight / CTA
  color_bg_page:        string;  // HEX — background halaman
  color_text_body:      string;  // HEX — teks isi
  /** HEX + alpha, contoh: "#00000040" */
  color_overlay:        string | null;

  // Typography (Google Font names)
  font_display:         string;  // Untuk nama mempelai & heading utama
  font_body:            string;  // Untuk teks isi
}

/**
 * Classic theme record — represents one purchasable/selectable theme.
 * Mapped to `classic_themes` Supabase table.
 */
export interface ClassicTheme {
  id:               string;          // uuid
  slug:             string;          // 'jawa-batik' | 'minang-emas' | ...
  name:             string;          // Display name di halaman pilih tema
  description:      string | null;
  thumbnail_url:    string | null;   // Preview card image
  is_published:     boolean;
  cultural_category: CulturalCategory | null;
  target_event:     'wedding' | 'aqiqah' | 'graduation' | 'all';
  assets:           ClassicThemeAssets;
  tags:             string[];
  created_by:       string | null;   // uuid → auth.users
  created_at:       string;          // ISO timestamp
  updated_at:       string;
}

/**
 * USER-SLOT keys — assets & data provided by the invitation buyer.
 * These are unique per couple. Stored in the `invitations` table (or joined).
 */
export type ClassicUserSlotKey =
  // Photos
  | 'photo_groom'
  | 'photo_bride'
  | 'photo_couple_1'
  | 'photo_couple_2'
  | 'photo_couple_3'
  | 'photo_gallery'   // array — up to 9 items
  // Text — mempelai
  | 'name_groom'
  | 'name_bride'
  | 'name_groom_short'
  | 'name_bride_short'
  | 'parent_groom'
  | 'parent_bride'
  | 'bio_groom'
  | 'bio_bride'
  // Event
  | 'date_akad'
  | 'date_resepsi'
  | 'venue_akad_name'
  | 'venue_akad_address'
  | 'venue_resepsi_name'
  | 'venue_resepsi_address'
  | 'gmaps_akad_url'
  | 'gmaps_resepsi_url'
  | 'love_story'
  // Digital gift
  | 'qris_image'
  | 'rekening';

/**
 * One entry in the love story timeline.
 */
export interface LoveStoryEntry {
  date:        string;  // ISO date or free-text (e.g. "Agustus 2019")
  title:       string;
  description: string;
  photo?:      string;  // optional supporting photo URL
}

/**
 * Bank account for digital gift.
 */
export interface RekeningEntry {
  bank:           string;  // e.g. "BCA", "Mandiri", "GoPay"
  account_name:   string;
  account_number: string;
}

/**
 * All USER-SLOT data for one classic wedding invitation.
 * This is the complete data contract fed into `<ClassicThemeRenderer>`.
 * Mirrors and extends the existing `InvitationData` in `invitation.ts`.
 *
 * Note: For new code, prefer this type over the legacy `InvitationData`.
 */
export interface ClassicInvitationData {
  // === FOTO MEMPELAI ===
  photo_groom:      string;          // URL — square 1:1
  photo_bride:      string;          // URL — square 1:1
  photo_couple_1:   string;          // URL — landscape, hero cover
  photo_couple_2?:  string | null;   // URL — cerita kita section
  photo_couple_3?:  string | null;   // URL — tambahan
  photo_gallery?:   string[];        // URL[] — maks 9

  // === DATA TEKS MEMPELAI ===
  name_groom:        string;
  name_bride:        string;
  name_groom_short:  string;
  name_bride_short:  string;
  parent_groom:      string;         // e.g. "Bpk. Ahmad & Ibu Sari"
  parent_bride:      string;
  bio_groom?:        string | null;
  bio_bride?:        string | null;

  // === DATA ACARA ===
  date_akad:             string;     // ISO datetime
  date_resepsi:          string;     // ISO datetime
  venue_akad_name:       string;
  venue_akad_address:    string;
  venue_resepsi_name:    string;
  venue_resepsi_address: string;
  gmaps_akad_url:        string;
  gmaps_resepsi_url:     string;
  love_story?:           LoveStoryEntry[];

  // === AMPLOP DIGITAL ===
  qris_image?:  string | null;       // URL — foto QRIS PNG
  rekening?:    RekeningEntry[];     // daftar rekening bank
}

/**
 * The complete render props for the ClassicThemeRenderer component.
 * Combines theme assets (admin-managed) + invitation data (user-provided).
 */
export interface ClassicThemeRenderProps {
  theme:      ClassicTheme;
  data:       ClassicInvitationData;
  /** Guest name passed via query param ?to=NamaTamu */
  guestName?: string;
  /** Preview mode — disables music autoplay, shows placeholder photos */
  isPreview?: boolean;
}

/**
 * Supabase raw row for `classic_themes` table (snake_case).
 * Used for direct DB mapping before transformation.
 */
export interface SupabaseClassicThemeRow {
  id:               string;
  slug:             string;
  name:             string;
  description:      string | null;
  thumbnail_url:    string | null;
  is_published:     boolean;
  cultural_category: string | null;
  target_event:     string;
  assets:           ClassicThemeAssets;  // stored as JSONB
  tags:             string[] | null;
  created_by:       string | null;
  created_at:       string;
  updated_at:       string;
}
