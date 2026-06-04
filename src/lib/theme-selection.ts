import type { SupabaseClient } from "@supabase/supabase-js";
import {
  DEFAULT_INVITATION_THEME_KEY,
  isClassicThemeKey,
  isCodeRenderedThemeKey,
  isDefaultThemeSelection,
  normalizeThemeSelection,
} from "@/lib/default-theme";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type InvitationThemeSelection = {
  themeId: string | null;
  themeKey: string | null;
  selection: string;
};

async function lookupThemeId(
  supabase: SupabaseClient,
  column: "slug" | "theme_key",
  selection: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("themes")
      .select("id")
      .eq(column, selection)
      .maybeSingle();

    if (error) return null;
    return typeof data?.id === "string" ? data.id : null;
  } catch {
    return null;
  }
}

export async function resolveInvitationThemeSelection(
  supabase: SupabaseClient,
  themeId?: string | null,
): Promise<InvitationThemeSelection> {
  const selection = normalizeThemeSelection(themeId);

  if (isDefaultThemeSelection(selection)) {
    return {
      themeId: null,
      themeKey: DEFAULT_INVITATION_THEME_KEY,
      selection,
    };
  }

  if (isCodeRenderedThemeKey(selection)) {
    return {
      themeId: null,
      themeKey: selection,
      selection,
    };
  }

  if (isClassicThemeKey(selection)) {
    return {
      themeId: null,
      themeKey: selection,
      selection,
    };
  }

  if (UUID_PATTERN.test(selection)) {
    return {
      themeId: selection,
      themeKey: null,
      selection,
    };
  }

  const resolvedBySlug = await lookupThemeId(supabase, "slug", selection);
  if (resolvedBySlug) {
    return {
      themeId: resolvedBySlug,
      themeKey: null,
      selection,
    };
  }

  const resolvedByThemeKey = await lookupThemeId(supabase, "theme_key", selection);
  if (resolvedByThemeKey) {
    return {
      themeId: resolvedByThemeKey,
      themeKey: null,
      selection,
    };
  }

  return {
    themeId: null,
    themeKey: selection,
    selection,
  };
}
