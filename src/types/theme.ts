// ============================================================
// undang-io — Theme Engine Types
// Phase 2a: Parallax Theme System Extension
// Phase 2b: Classic (Rehan-style) Full-Page Theme System
// Synced: Step 4 (Hero/Cover) + Step 5 (Couple) + Step 6 (Event)
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
// Maps to: Supabase table `classic_themes`
// Synced: Step 4 (Hero/Cover) · Step 5 (Couple) · Step 6 (Event)
// ─────────────────────────────────────────

/**
 * Particle animation type for the classic theme.
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
 * Stored in `classic_themes.assets` JSONB.
 * Uploaded to Supabase Storage bucket: `theme-assets`
 */
export type ClassicThemeSlotKey =
  // Backgrounds
  | 'bg_cover'
  | 'bg_section_2'
  | 'bg_section_3'
  | 'bg_section_4'
  | 'bg_section_5'
  | 'bg_groom_panel'
  // Ornaments
  | 'ornament_half_circle'
  | 'ornament_overlay'
  | 'ornament_bismillah'
  | 'ornament_divider'
  | 'ornament_corner_tl'
  | 'ornament_corner_br'
  // Flowers (per-section decorative PNGs)
  | 'flower_top_right'
  | 'flower_top_left'
  | 'flower_bottom_right'
  | 'flower_bottom_left'
  | 'flower_right'
  | 'flower_left'
  | 'flower_top_center'
  // Audio & animation
  | 'bg_music'
  | 'loader_asset';

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
  flower_top_right:     'Bunga Pojok Kanan Atas',
  flower_top_left:      'Bunga Pojok Kiri Atas',
  flower_bottom_right:  'Bunga Pojok Kanan Bawah',
  flower_bottom_left:   'Bunga Pojok Kiri Bawah',
  flower_right:         'Bunga Sisi Kanan (vertikal)',
  flower_left:          'Bunga Sisi Kiri (vertikal)',
  flower_top_center:    'Bunga Tengah Atas',
  bg_music:             'Musik Latar Undangan',
  loader_asset:         'Animasi Loading Screen',
};

export const CLASSIC_THEME_SLOT_REQUIRED: Record<ClassicThemeSlotKey, boolean> = {
  bg_cover:             true,
  bg_section_2:         true,
  bg_section_3:         true,
  bg_section_4:         true,
  bg_section_5:         true,
  bg_groom_panel:       false,
  ornament_half_circle: false,
  ornament_overlay:     false,
  ornament_bismillah:   false,
  ornament_divider:     false,
  ornament_corner_tl:   false,
  ornament_corner_br:   false,
  flower_top_right:     false,
  flower_top_left:      false,
  flower_bottom_right:  false,
  flower_bottom_left:   false,
  flower_right:         false,
  flower_left:          false,
  flower_top_center:    false,
  bg_music:             false,
  loader_asset:         false,
};

/**
 * All THEME-SLOT assets for one classic theme.
 * Stored as `assets` JSONB in `classic_themes` table.
 *
 * Sections:
 *  A. Legacy backgrounds & ornaments
 *  B. Flower decoration slots (Step 4–6)
 *  C. Section-specific bg & colors (Step 4–6)
 *  D. Palette & typography
 */
export interface ClassicThemeAssets {
  // ── A. Backgrounds ──────────────────────────────────────────
  bg_cover:             string;
  bg_section_2:         string;
  bg_section_3:         string;
  bg_section_4:         string;
  bg_section_5:         string;
  bg_groom_panel:       string | null;

  // ── A. Ornaments (PNG transparent) ──────────────────────────
  ornament_half_circle: string | null;
  ornament_overlay:     string | null;
  /** Swap per cultural/religious theme. null = non-Islamic. */
  ornament_bismillah:   string | null;
  ornament_divider:     string | null;
  ornament_corner_tl:   string | null;
  ornament_corner_br:   string | null;

  // ── B. Flower decoration slots (Step 4–6) ───────────────────
  /** Pojok kanan atas — digunakan di Cover Overlay & Hero Section */
  flower_top_right_url?:    string | null;
  /** Pojok kiri atas — digunakan di Cover Overlay & Hero Section */
  flower_top_left_url?:     string | null;
  /** Pojok kanan bawah — digunakan di Cover Overlay */
  flower_bottom_right_url?: string | null;
  /** Pojok kiri bawah — digunakan di Cover Overlay */
  flower_bottom_left_url?:  string | null;
  /** Sisi kanan vertikal — digunakan di Couple Section */
  flower_right_url?:        string | null;
  /** Sisi kiri vertikal — digunakan di Couple Section */
  flower_left_url?:         string | null;
  /** Tengah atas — digunakan di Event Section */
  flower_top_center_url?:   string | null;

  // ── C. Section-specific overrides (Step 4–6) ────────────────
  /** Warna bg Cover Overlay (hex). Default: #faf6f1 */
  cover_bg_color?:          string | null;
  /** Pattern bg Cover Overlay (URL repeating) */
  cover_bg_pattern_url?:    string | null;

  /** Foto bulat pasangan / ornamen setengah lingkaran di Hero & Cover */
  couple_main_image_url?:   string | null;
  /** Warna bg Hero Section (hex). Default: #fdfaf6 */
  hero_bg_color?:           string | null;
  /** Pattern bg Hero Section (URL repeating) */
  hero_bg_pattern_url?:     string | null;

  /** Gambar Bismillah SVG di Couple Section */
  bismillah_image_url?:     string | null;
  /** Warna bg Couple Section (hex) */
  couple_bg_color?:         string | null;
  /** Pattern bg Couple Section (URL repeating, e.g. so-white.png) */
  couple_bg_pattern_url?:   string | null;

  /** Warna bg Event Section (hex) */
  event_bg_color?:          string | null;
  /** Warna bg tiap card Akad/Resepsi (hex). Default: #fffdf9 */
  event_card_bg_color?:     string | null;
  /** Gambar divider ornamen di dalam event card */
  event_divider_image_url?: string | null;

  // ── D. Particles ─────────────────────────────────────────────
  particle_type:        ClassicParticleType;
  /** HEX — override warna partikel. null = ikut color_primary */
  particle_color:       string | null;

  // ── D. Palette (HEX) ─────────────────────────────────────────
  color_primary:        string;   // Warna dominan (heading, aksen, border)
  color_secondary:      string;   // Aksen pendukung / background ringan
  /** Alias color_secondary — digunakan sebagai warna muted text subtle */
  color_text_muted?:    string | null;
  color_accent:         string;   // Highlight / CTA button
  color_bg_page:        string;   // Background halaman
  color_text_body:      string;   // Teks isi
  /** HEX + alpha, e.g. "#00000040" */
  color_overlay:        string | null;

  // ── D. Typography (Google Font names) ────────────────────────
  font_display:         string;   // Nama mempelai & heading utama
  font_body:            string;   // Teks isi paragraf
  /** Script/cursive font — digunakan di nama pasangan & sub-heading */
  font_script?:         string | null;
  /** Display font untuk judul section ALL-CAPS (e.g. Oswald) */
  font_heading?:        string | null;
  /** Arabic/kaligrafi font untuk teks Arab (e.g. Scheherazade New) */
  font_arabic?:         string | null;

  // ── A. Audio & animation ─────────────────────────────────────
  bg_music:             string | null;
  loader_asset:         string | null;
}

/**
 * Classic theme record — represents one selectable theme.
 * Mapped to `classic_themes` Supabase table.
 */
export interface ClassicTheme {
  id:               string;
  slug:             string;
  name:             string;
  description:      string | null;
  thumbnail_url:    string | null;
  is_published:     boolean;
  cultural_category: CulturalCategory | null;
  target_event:     'wedding' | 'aqiqah' | 'graduation' | 'all';
  assets:           ClassicThemeAssets;
  tags:             string[];
  created_by:       string | null;
  created_at:       string;
  updated_at:       string;
}

/**
 * USER-SLOT keys — assets & data provided by the invitation buyer.
 */
export type ClassicUserSlotKey =
  | 'photo_groom'
  | 'photo_bride'
  | 'photo_couple_1'
  | 'photo_couple_2'
  | 'photo_couple_3'
  | 'photo_gallery'
  | 'name_groom'
  | 'name_bride'
  | 'name_groom_short'
  | 'name_bride_short'
  | 'parent_groom'
  | 'parent_bride'
  | 'bio_groom'
  | 'bio_bride'
  | 'date_akad'
  | 'date_resepsi'
  | 'venue_akad_name'
  | 'venue_akad_address'
  | 'venue_resepsi_name'
  | 'venue_resepsi_address'
  | 'gmaps_akad_url'
  | 'gmaps_resepsi_url'
  | 'love_story'
  | 'qris_image'
  | 'rekening';

export interface LoveStoryEntry {
  date:        string;
  title:       string;
  description: string;
  photo?:      string;
}

export interface RekeningEntry {
  bank:           string;
  account_name:   string;
  account_number: string;
}

/**
 * All USER-SLOT data for one classic wedding invitation.
 * Fed into `<ClassicThemeRenderer>` and all Classic section components.
 *
 * Naming convention:
 *  - `*_full_name`   → nama lengkap  (e.g. "Rayhan Yulanda")
 *  - `*_nickname`    → nama panggilan (e.g. "Rehan") — untuk heading hero
 *  - `*_photo_url`   → URL foto persegi
 *  - `*_datetime`    → ISO datetime string
 *  - `*_location_*`  → info venue
 *  - `*_maps_url`    → Google Maps link
 *
 * Legacy aliases (snake_case flat) preserved for backward compat.
 */
export interface ClassicInvitationData {
  // ── Foto mempelai ────────────────────────────────────────────
  /** URL foto mempelai pria — square 1:1 (used by ClassicCoupleSection) */
  groom_photo_url?:     string | null;
  /** URL foto mempelai wanita — square 1:1 */
  bride_photo_url?:     string | null;
  /** @deprecated alias → groom_photo_url */
  photo_groom?:         string;
  /** @deprecated alias → bride_photo_url */
  photo_bride?:         string;
  photo_couple_1?:      string;
  photo_couple_2?:      string | null;
  photo_couple_3?:      string | null;
  photo_gallery?:       string[];

  // ── Nama mempelai ────────────────────────────────────────────
  /** Nama lengkap mempelai pria (ClassicCoupleSection heading) */
  groom_full_name:      string;
  /** Nama lengkap mempelai wanita */
  bride_full_name:      string;
  /** Nama panggilan pria — ditampilkan di Hero & Cover overlay */
  groom_nickname?:      string | null;
  /** Nama panggilan wanita */
  bride_nickname?:      string | null;
  /** @deprecated alias → groom_full_name */
  name_groom?:          string;
  /** @deprecated alias → bride_full_name */
  name_bride?:          string;
  name_groom_short?:    string;
  name_bride_short?:    string;

  // ── Data orang tua ───────────────────────────────────────────
  /** Nama ayah mempelai pria */
  groom_father_name?:   string | null;
  /** Nama ibu mempelai pria */
  groom_mother_name?:   string | null;
  /** Urutan anak pria, e.g. "Putra Pertama" */
  groom_child_order?:   string | null;
  /** Nama ayah mempelai wanita */
  bride_father_name?:   string | null;
  /** Nama ibu mempelai wanita */
  bride_mother_name?:   string | null;
  /** Urutan anak wanita, e.g. "Putri Keempat" */
  bride_child_order?:   string | null;
  /** @deprecated alias → "{groom_child_order} dari {groom_father_name} & {groom_mother_name}" */
  parent_groom?:        string;
  /** @deprecated alias */
  parent_bride?:        string;
  bio_groom?:           string | null;
  bio_bride?:           string | null;

  // ── Data acara ───────────────────────────────────────────────
  /** ISO datetime Akad Nikah (ClassicHeroSection countdown + ClassicEventSection) */
  akad_datetime?:             string | null;
  /** ISO datetime Resepsi / Walimatul Ursy */
  resepsi_datetime?:          string | null;
  /** @deprecated alias → akad_datetime */
  date_akad?:                 string;
  /** @deprecated alias → resepsi_datetime */
  date_resepsi?:              string;

  /** Nama venue akad (ClassicEventSection card) */
  akad_location_name?:        string | null;
  /** Alamat lengkap venue akad */
  akad_location_address?:     string | null;
  /** Google Maps URL akad — tombol "Petunjuk Lokasi" */
  akad_maps_url?:             string | null;
  /** @deprecated alias → akad_location_name */
  venue_akad_name?:           string;
  /** @deprecated alias → akad_location_address */
  venue_akad_address?:        string;
  /** @deprecated alias → akad_maps_url */
  gmaps_akad_url?:            string;

  /** Nama venue resepsi */
  resepsi_location_name?:     string | null;
  /** Alamat lengkap venue resepsi */
  resepsi_location_address?:  string | null;
  /** Google Maps URL resepsi */
  resepsi_maps_url?:          string | null;
  /** @deprecated alias → resepsi_location_name */
  venue_resepsi_name?:        string;
  /** @deprecated alias → resepsi_location_address */
  venue_resepsi_address?:     string;
  /** @deprecated alias → resepsi_maps_url */
  gmaps_resepsi_url?:         string;

  love_story?:                LoveStoryEntry[];

  // ── Amplop digital ───────────────────────────────────────────
  qris_image?:  string | null;
  rekening?:    RekeningEntry[];
}

/**
 * The complete render props for the ClassicThemeRenderer component.
 */
export interface ClassicThemeRenderProps {
  theme:      ClassicTheme;
  data:       ClassicInvitationData;
  /** Guest name from query param ?to=NamaTamu */
  guestName?: string;
  /** Preview mode — disables music autoplay, shows placeholder photos */
  isPreview?: boolean;
}

/**
 * Supabase raw row for `classic_themes` table (snake_case).
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
  assets:           ClassicThemeAssets;
  tags:             string[] | null;
  created_by:       string | null;
  created_at:       string;
  updated_at:       string;
}

export type AssetKind =
  | 'background'
  | 'ornament_top'
  | 'ornament_bottom_left'
  | 'ornament_bottom_right'
  | 'ornament_corner'
  | 'frame'
  | 'pattern'
  | 'divider'
  | 'music'

export interface ThemeAsset {
  id: string
  theme_key: string
  kind: AssetKind
  label: string
  image_url: string
  is_global: boolean
  created_by: string | null
  created_at: string
}

export interface ThemeAssetInsert {
  theme_key: string
  kind: AssetKind
  label: string
  image_url: string
  is_global?: boolean
}
