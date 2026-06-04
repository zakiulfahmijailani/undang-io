import { InvitationThemePreference, Theme } from "@/types/theme";
import {
  DEFAULT_INVITATION_THEME_KEY,
  DEFAULT_INVITATION_THEME_NAME,
  PETAL_SOFT_THEME_KEY,
  PETAL_SOFT_THEME_NAME,
} from "@/lib/default-theme";

const themeSakinah: Theme = {
  id: DEFAULT_INVITATION_THEME_KEY,
  name: DEFAULT_INVITATION_THEME_NAME,
  slug: DEFAULT_INVITATION_THEME_KEY,
  description: "Tema undangan dengan nuansa elegan.",
  culturalCategory: "islami",
  status: "active",
  thumbnailUrl: null,
  musicUrl: null,
  videoUrl: null,
  colors: {
    primary: "160 50% 35%",
    secondary: "45 60% 50%",
    accent: "38 80% 55%",
    surface: "60 10% 97%",
    textPrimary: "160 40% 12%",
    textSecondary: "160 20% 40%",
  },
  typography: { headingFont: "Great Vibes", bodyFont: "Cormorant Garamond" },
  animationSettings: {
    heroAnimation: "sparkles",
    intensity: "low",
    parallax: true,
    scrollReveal: true,
    musicAutoplay: true,
    videoIntro: false,
  },
  styleSettings: { borderRadius: "ornate", shadow: "medium" },
  assetSlots: [],
  createdAt: "2026-06-01T10:00:00",
  updatedAt: "2026-06-01T10:00:00",
};

const themePetalSoft: Theme = {
  id: PETAL_SOFT_THEME_KEY,
  name: PETAL_SOFT_THEME_NAME,
  slug: PETAL_SOFT_THEME_KEY,
  description: "Tema pernikahan minimalis dengan estetika bunga watercolor pastel. Elegan, feminin, dan romantis.",
  culturalCategory: "minimalis",
  status: "active",
  thumbnailUrl: "https://picsum.photos/seed/petal-soft/400/600",
  musicUrl: null,
  videoUrl: null,
  colors: {
    primary: "#E8A0A0",
    secondary: "#A8C5A0",
    accent: "#C4919B",
    surface: "#FDFAF8",
    textPrimary: "#4A3F3F",
    textSecondary: "#9E8E8E",
  },
  typography: { headingFont: "Cormorant Garamond", bodyFont: "DM Sans" },
  animationSettings: {
    heroAnimation: "petals",
    intensity: "low",
    parallax: true,
    scrollReveal: true,
    musicAutoplay: false,
    videoIntro: false,
  },
  styleSettings: { borderRadius: "soft", shadow: "soft" },
  assetSlots: [],
  createdAt: "2026-06-04T07:14:00",
  updatedAt: "2026-06-04T07:14:00",
};

export const dummyThemes: Theme[] = [themeSakinah, themePetalSoft];

export const dummyUserPreferences: InvitationThemePreference[] = [
  {
    id: "pref-1",
    invitationId: "inv-001",
    themeId: DEFAULT_INVITATION_THEME_KEY,
    sortOrder: 1,
    isEnabled: true,
    isPrimary: true,
    theme: themeSakinah,
  },
];

export { themePetalSoft, themeSakinah };
