export const DEFAULT_INVITATION_THEME_KEY = "sakinah-serenity";
export const DEFAULT_INVITATION_THEME_NAME = "Sakinah Serenity";
export const DEFAULT_INVITATION_THEME_CATEGORY = "Islami";

export function normalizeThemeSelection(themeId?: string | null) {
  const value = typeof themeId === "string" ? themeId.trim() : "";
  return value.length > 0 ? value : DEFAULT_INVITATION_THEME_KEY;
}

export function isDefaultThemeSelection(themeId?: string | null) {
  return normalizeThemeSelection(themeId) === DEFAULT_INVITATION_THEME_KEY;
}

export function isClassicThemeKey(themeId?: string | null) {
  const value = normalizeThemeSelection(themeId);
  return value.startsWith("classic");
}

export function shouldResolveAsSupabaseTheme(themeId?: string | null) {
  const value = normalizeThemeSelection(themeId);
  return value !== DEFAULT_INVITATION_THEME_KEY && !value.startsWith("classic");
}
