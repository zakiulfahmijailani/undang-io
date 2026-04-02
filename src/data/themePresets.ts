import { ThemeColors, ThemeTypography, ThemeAnimationSettings, CulturalCategory, ThemeStyleSettings } from '@/types/theme';

export interface ThemePreset {
  colors: ThemeColors;
  typography: ThemeTypography;
  animationSettings: ThemeAnimationSettings;
  styleSettings: ThemeStyleSettings;
}

const defaultColors: ThemeColors = {
  primary: '38 70% 45%',
  secondary: '20 30% 30%',
  accent: '45 80% 60%',
  surface: '40 20% 95%',
  textPrimary: '20 30% 15%',
  textSecondary: '20 15% 40%',
};

const defaultTypography: ThemeTypography = {
  headingFont: 'Great Vibes',
  bodyFont: 'Cormorant Garamond',
};

const defaultAnimationSettings: ThemeAnimationSettings = {
  heroAnimation: 'confetti',
  intensity: 'medium',
  parallax: true,
  scrollReveal: true,
  musicAutoplay: true,
  videoIntro: false,
};

const defaultStyleSettings: ThemeStyleSettings = {
  borderRadius: 'soft',
  shadow: 'soft',
};

export const CATEGORY_THEME_PRESETS: Record<CulturalCategory | 'default', ThemePreset> = {
  jawa: {
    colors: defaultColors,
    typography: defaultTypography,
    animationSettings: defaultAnimationSettings,
    styleSettings: { borderRadius: 'ornate', shadow: 'soft' },
  },
  bali: {
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
  },
  minimalis: {
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
  },
  islami: {
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
  },
  // Add copies of default for remaining categories so mapping doesn't break
  sunda: { colors: defaultColors, typography: defaultTypography, animationSettings: defaultAnimationSettings, styleSettings: { borderRadius: 'ornate', shadow: 'soft' } },
  minang: { colors: defaultColors, typography: defaultTypography, animationSettings: defaultAnimationSettings, styleSettings: defaultStyleSettings },
  bugis: { colors: defaultColors, typography: defaultTypography, animationSettings: defaultAnimationSettings, styleSettings: defaultStyleSettings },
  betawi: { colors: defaultColors, typography: defaultTypography, animationSettings: defaultAnimationSettings, styleSettings: defaultStyleSettings },
  melayu: { colors: defaultColors, typography: defaultTypography, animationSettings: defaultAnimationSettings, styleSettings: defaultStyleSettings },
  modern: { colors: defaultColors, typography: defaultTypography, animationSettings: defaultAnimationSettings, styleSettings: defaultStyleSettings },
  rustic: { colors: defaultColors, typography: defaultTypography, animationSettings: defaultAnimationSettings, styleSettings: defaultStyleSettings },
  other: { colors: defaultColors, typography: defaultTypography, animationSettings: defaultAnimationSettings, styleSettings: defaultStyleSettings },
  default: {
    colors: defaultColors,
    typography: defaultTypography,
    animationSettings: defaultAnimationSettings,
    styleSettings: defaultStyleSettings,
  },
};
