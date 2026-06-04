import { InvitationThemePreference, Theme } from "@/types/theme";
import {
  DEFAULT_INVITATION_THEME_KEY,
  DEFAULT_INVITATION_THEME_NAME,
  JAWA_AGUNG_THEME_KEY,
  JAWA_AGUNG_THEME_NAME,
  OBSIDIAN_LUXE_THEME_KEY,
  OBSIDIAN_LUXE_THEME_NAME,
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

const themeObsidianLuxe: Theme = {
  id: OBSIDIAN_LUXE_THEME_KEY,
  name: OBSIDIAN_LUXE_THEME_NAME,
  slug: OBSIDIAN_LUXE_THEME_KEY,
  description: "Tema pernikahan mewah berkelas dengan estetika hitam dan emas. Dramatis, sinematik, dan timeless untuk pasangan modern.",
  culturalCategory: "modern",
  status: "active",
  thumbnailUrl: "https://picsum.photos/seed/obsidian-luxe/400/600",
  musicUrl: null,
  videoUrl: null,
  colors: {
    primary: "#C9A84C",
    secondary: "#E8D5A3",
    accent: "#8A8070",
    surface: "#0A0A0A",
    textPrimary: "#F5F0E8",
    textSecondary: "#8A8070",
  },
  typography: { headingFont: "Cormorant Garamond", bodyFont: "Jost" },
  animationSettings: {
    heroAnimation: "sparkles",
    intensity: "medium",
    parallax: true,
    scrollReveal: true,
    musicAutoplay: false,
    videoIntro: false,
  },
  styleSettings: { borderRadius: "medium", shadow: "dramatic" },
  assetSlots: [],
  createdAt: "2026-06-04T08:30:00",
  updatedAt: "2026-06-04T08:30:00",
};

const themeJawaAgung: Theme = {
  id: JAWA_AGUNG_THEME_KEY,
  name: JAWA_AGUNG_THEME_NAME,
  slug: JAWA_AGUNG_THEME_KEY,
  description: "Tema pernikahan adat Jawa yang megah dan bermartabat dengan motif batik klasik dan ornamen tradisional.",
  culturalCategory: "jawa",
  status: "active",
  thumbnailUrl: "https://picsum.photos/seed/jawa-agung/400/600",
  musicUrl: null,
  videoUrl: null,
  colors: {
    primary: "#7B3F1A",
    secondary: "#C8922A",
    accent: "#2C4A1E",
    surface: "#F5EDD6",
    textPrimary: "#2A1A0E",
    textSecondary: "#7A5C3A",
  },
  typography: { headingFont: "Cormorant Garamond", bodyFont: "Lora" },
  animationSettings: {
    heroAnimation: "petals",
    intensity: "low",
    parallax: true,
    scrollReveal: true,
    musicAutoplay: false,
    videoIntro: false,
  },
  styleSettings: { borderRadius: "ornate", shadow: "medium" },
  assetSlots: [],
  createdAt: "2026-06-04T22:00:00",
  updatedAt: "2026-06-04T22:00:00",
};

export const dummyThemes: Theme[] = [themeSakinah, themePetalSoft, themeObsidianLuxe, themeJawaAgung];

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

export { themeJawaAgung, themeObsidianLuxe, themePetalSoft, themeSakinah };
