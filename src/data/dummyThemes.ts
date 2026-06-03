import { Theme, ThemeAssetSlot, InvitationThemePreference } from '@/types/theme';
import { THEME_SLOT_DEFINITIONS } from './themeSlots';
import { DEFAULT_INVITATION_THEME_KEY, DEFAULT_INVITATION_THEME_NAME, DEFAULT_INVITATION_THEME_CATEGORY } from "@/lib/default-theme";

const themeSakinah: Theme = {
  id: DEFAULT_INVITATION_THEME_KEY,
  name: DEFAULT_INVITATION_THEME_NAME,
  slug: 'sakinah',
  description: 'Tema undangan dengan nuansa elegan.',
  culturalCategory: 'islami',
  status: 'active',
  thumbnailUrl: null,
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
  assetSlots: [],
  createdAt: '2026-06-01T10:00:00',
  updatedAt: '2026-06-01T10:00:00',
};

// ── Export all dummy themes ──
export const dummyThemes: Theme[] = [themeSakinah];

// ── Dummy user theme preferences ──
export const dummyUserPreferences: InvitationThemePreference[] = [
  {
    id: 'pref-1',
    invitationId: 'inv-001',
    themeId: DEFAULT_INVITATION_THEME_KEY,
    sortOrder: 1,
    isEnabled: true,
    isPrimary: true,
    theme: themeSakinah,
  }
];

export { themeSakinah };
