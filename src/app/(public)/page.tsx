/* Landing page for / based on docs/design/Landing Page undang-io.png. */

import type { SupabaseClient } from "@supabase/supabase-js";
import { LandingPageClient } from "@/components/landing/LandingPageClient";
import { fallbackThemes } from "@/components/landing/data";
import type { LandingTheme } from "@/components/landing/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ThemeRow = {
  id: string | null;
  name: string | null;
  slug: string | null;
  cultural_category: string | null;
  thumbnail_url: string | null;
};

function normalizeTheme(row: ThemeRow): LandingTheme | null {
  const id = row.id?.trim();
  const name = row.name?.trim();
  const slug = row.slug?.trim() || id;

  if (!id || !name || !slug) return null;

  return {
    id,
    name,
    slug,
    thumbnailUrl: row.thumbnail_url || null,
    culturalCategory: row.cultural_category,
  };
}

async function fetchLandingThemes(): Promise<LandingTheme[]> {
  try {
    const supabase = (await createServerSupabaseClient()) as SupabaseClient | null;
    if (!supabase) return fallbackThemes;

    const { data, error } = await supabase
      .from("classic_themes")
      .select("id, name, slug, cultural_category, thumbnail_url")
      .eq("status", "active")
      .eq("is_published", true)
      .order("created_at", { ascending: true })
      .limit(6);

    if (error) {
      console.error("[landing] Failed to fetch themes:", error);
      return fallbackThemes;
    }

    const themes = ((data ?? []) as ThemeRow[]).map(normalizeTheme).filter((theme): theme is LandingTheme => theme !== null);

    return themes.length > 0 ? themes : fallbackThemes;
  } catch (error) {
    console.error("[landing] Unexpected theme fetch error:", error);
    return fallbackThemes;
  }
}

export default async function LandingPage() {
  const themes = await fetchLandingThemes();

  return <LandingPageClient themes={themes} />;
}
