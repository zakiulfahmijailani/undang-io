export const DEFAULT_INVITATION_THEME_KEY = "sakinah-serenity";
export const DEFAULT_INVITATION_THEME_NAME = "Sakinah Serenity";
export const DEFAULT_INVITATION_THEME_CATEGORY = "Islami";
export const PETAL_SOFT_THEME_KEY = "petal-soft";
export const PETAL_SOFT_THEME_NAME = "Petal Soft";
export const PETAL_SOFT_THEME_CATEGORY = "Minimalis";
export const OBSIDIAN_LUXE_THEME_KEY = "obsidian-luxe";
export const OBSIDIAN_LUXE_THEME_NAME = "Obsidian Luxe";
export const OBSIDIAN_LUXE_THEME_CATEGORY = "Modern";

const CODE_RENDERED_THEME_KEYS = new Set([DEFAULT_INVITATION_THEME_KEY, PETAL_SOFT_THEME_KEY, OBSIDIAN_LUXE_THEME_KEY]);

export function normalizeThemeSelection(themeId?: string | null) {
  const value = typeof themeId === "string" ? themeId.trim() : "";
  return value.length > 0 ? value : DEFAULT_INVITATION_THEME_KEY;
}

export function isDefaultThemeSelection(themeId?: string | null) {
  return normalizeThemeSelection(themeId) === DEFAULT_INVITATION_THEME_KEY;
}

export function isCodeRenderedThemeKey(themeId?: string | null) {
  return CODE_RENDERED_THEME_KEYS.has(normalizeThemeSelection(themeId));
}

export function isClassicThemeKey(themeId?: string | null) {
  const value = normalizeThemeSelection(themeId);
  return value.startsWith("classic");
}

export function shouldResolveAsSupabaseTheme(themeId?: string | null) {
  const value = normalizeThemeSelection(themeId);
  return !CODE_RENDERED_THEME_KEYS.has(value) && !value.startsWith("classic");
}
