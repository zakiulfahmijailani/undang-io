import { Theme, ThemeAssetSlot, InvitationThemePreference } from '@/types/theme';
import { THEME_SLOT_DEFINITIONS } from './themeSlots';

function generateSlots(themeId: string, fills: Record<string, string>): ThemeAssetSlot[] {
  return THEME_SLOT_DEFINITIONS.map((def, i) => ({
    id: `${themeId}-slot-${i}`,
    themeId,
    slotKey: def.slotKey,
    slotLabel: def.slotLabel,
    slotDescription: def.slotDescription,
    widthCm: def.widthCm,
    heightCm: def.heightCm,
    aspectRatio: def.aspectRatio,
    assetUrl: fills[def.slotKey] ?? null,
    assetType: def.assetType,
    displayOrder: i,
  }));
}

// ── Theme 1: Jawa Klasik ──
const javaSlotFills: Record<string, string> = {
  cover_background: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=1067&fit=crop',
  hero_background: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=1067&fit=crop',
  ornament_top_hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=300&fit=crop',
  bg_event: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=720&h=600&fit=crop',
  bg_rsvp: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=480&fit=crop',
  thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=338&h=600&fit=crop',
};

const themeJawa: Theme = {
  id: 'theme-jawa-klasik',
  name: 'Jawa Klasik',
  slug: 'jawa-klasik',
  description: 'Tema undangan dengan nuansa Jawa klasik, ornamen batik, dan warna emas-cokelat.',
  culturalCategory: 'jawa',
  status: 'active',
  thumbnailUrl: javaSlotFills.thumbnail,
  musicUrl: null,
  videoUrl: null,
  colors: {
    primary: '38 70% 45%',
    secondary: '20 30% 30%',
    accent: '45 80% 60%',
    surface: '40 20% 95%',
    textPrimary: '20 30% 15%',
    textSecondary: '20 15% 40%',
  },
  typography: { headingFont: 'Great Vibes', bodyFont: 'Cormorant Garamond' },
  animationSettings: {
    heroAnimation: 'confetti',
    intensity: 'medium',
    parallax: true,
    scrollReveal: true,
    musicAutoplay: true,
    videoIntro: false,
  },
  styleSettings: { borderRadius: 'ornate', shadow: 'soft' },
  assetSlots: generateSlots('theme-jawa-klasik', javaSlotFills),
  createdAt: '2026-01-15T10:00:00',
  updatedAt: '2026-01-20T14:30:00',
};

// ── Theme 2: Bali Tropis ──
const baliSlotFills: Record<string, string> = {
  cover_background: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=1067&fit=crop',
  hero_background: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&h=1067&fit=crop',
  ornament_top_hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=300&fit=crop',
  bg_event: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=720&h=600&fit=crop',
  bg_rsvp: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=480&fit=crop',
  thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=338&h=600&fit=crop',
};

const themeBali: Theme = {
  id: 'theme-bali-tropis',
  name: 'Bali Tropis',
  slug: 'bali-tropis',
  description: 'Nuansa tropis Bali dengan hijau daun, bunga frangipani, dan suasana pantai.',
  culturalCategory: 'bali',
  status: 'active',
  thumbnailUrl: baliSlotFills.thumbnail,
  musicUrl: null,
  videoUrl: null,
  colors: {
    primary: '150 35% 40%',
    secondary: '30 50% 55%',
    accent: '45 85% 65%',
    surface: '120 15% 96%',
    textPrimary: '150 30% 15%',
    textSecondary: '150 15% 40%',
  },
  typography: { headingFont: 'Dancing Script', bodyFont: 'Cormorant Garamond' },
  animationSettings: {
    heroAnimation: 'petals',
    intensity: 'medium',
    parallax: true,
    scrollReveal: true,
    musicAutoplay: true,
    videoIntro: false,
  },
  styleSettings: { borderRadius: 'soft', shadow: 'medium' },
  assetSlots: generateSlots('theme-bali-tropis', baliSlotFills),
  createdAt: '2026-02-01T09:00:00',
  updatedAt: '2026-02-05T11:00:00',
};

// ── Theme 3: Modern Minimalis ──
const modernSlotFills: Record<string, string> = {
  cover_background: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=1067&fit=crop',
  hero_background: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=1067&fit=crop',
  ornament_top_hero: 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=900&h=300&fit=crop',
  bg_event: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=720&h=600&fit=crop',
  bg_rsvp: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=480&fit=crop',
  thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=338&h=600&fit=crop',
};

const themeModern: Theme = {
  id: 'theme-modern-minimalis',
  name: 'Modern Minimalis',
  slug: 'modern-minimalis',
  description: 'Desain bersih dan modern dengan tipografi elegan dan palet netral.',
  culturalCategory: 'minimalis',
  status: 'active',
  thumbnailUrl: modernSlotFills.thumbnail,
  musicUrl: null,
  videoUrl: null,
  colors: {
    primary: '0 0% 20%',
    secondary: '0 0% 50%',
    accent: '38 70% 55%',
    surface: '0 0% 98%',
    textPrimary: '0 0% 10%',
    textSecondary: '0 0% 45%',
  },
  typography: { headingFont: 'Great Vibes', bodyFont: 'Source Sans Pro' },
  animationSettings: {
    heroAnimation: 'none',
    intensity: 'low',
    parallax: false,
    scrollReveal: true,
    musicAutoplay: false,
    videoIntro: false,
  },
  styleSettings: { borderRadius: 'medium', shadow: 'soft' },
  assetSlots: generateSlots('theme-modern-minimalis', modernSlotFills),
  createdAt: '2026-02-10T08:00:00',
  updatedAt: '2026-02-12T16:00:00',
};

// ── Theme 4: Islami Elegan (Draft) ──
const islamiSlotFills: Record<string, string> = {
  cover_background: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=1067&fit=crop',
  hero_background: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=1067&fit=crop',
  thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=338&h=600&fit=crop',
};

const themeIslami: Theme = {
  id: 'theme-islami-elegan',
  name: 'Islami Elegan',
  slug: 'islami-elegan',
  description: 'Tema Islami dengan ornamen geometri, palet hijau-emas, dan nuansa spiritual.',
  culturalCategory: 'islami',
  status: 'draft',
  thumbnailUrl: islamiSlotFills.thumbnail,
  musicUrl: null,
  videoUrl: null,
  colors: {
    primary: '160 50% 35%',
    secondary: '45 60% 50%',
    accent: '38 80% 55%',
    surface: '60 10% 97%',
    textPrimary: '160 40% 12%',
    textSecondary: '160 20% 40%',
  },
  typography: { headingFont: 'Great Vibes', bodyFont: 'Cormorant Garamond' },
  animationSettings: {
    heroAnimation: 'sparkles',
    intensity: 'low',
    parallax: true,
    scrollReveal: true,
    musicAutoplay: true,
    videoIntro: false,
  },
  styleSettings: { borderRadius: 'ornate', shadow: 'medium' },
  assetSlots: generateSlots('theme-islami-elegan', islamiSlotFills),
  createdAt: '2026-03-01T10:00:00',
  updatedAt: '2026-03-01T10:00:00',
};

// ── Export all dummy themes ──
export const dummyThemes: Theme[] = [themeJawa, themeBali, themeModern, themeIslami];

// ── Dummy user theme preferences ──
export const dummyUserPreferences: InvitationThemePreference[] = [
  {
    id: 'pref-1',
    invitationId: 'inv-001',
    themeId: 'theme-jawa-klasik',
    sortOrder: 1,
    isEnabled: true,
    isPrimary: true,
    theme: themeJawa,
  },
  {
    id: 'pref-2',
    invitationId: 'inv-001',
    themeId: 'theme-bali-tropis',
    sortOrder: 2,
    isEnabled: true,
    isPrimary: false,
    theme: themeBali,
  },
  {
    id: 'pref-3',
    invitationId: 'inv-001',
    themeId: 'theme-modern-minimalis',
    sortOrder: 3,
    isEnabled: false,
    isPrimary: false,
    theme: themeModern,
  },
];

export { themeJawa, themeBali, themeModern, themeIslami };
