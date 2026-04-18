import { Suspense } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { BuatUndanganContent, type ActiveTheme } from "./_components/buat-undangan-content";

export const dynamic = "force-dynamic";

async function fetchActiveThemes(): Promise<ActiveTheme[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("themes")
      .select("id, name, description, cultural_category, thumbnail_url, slug")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch themes:", error);
      return [];
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? "",
      description: row.description ?? null,
      culturalCategory: row.cultural_category ?? null,
      thumbnailUrl: row.thumbnail_url ?? null,
      slug: row.slug ?? "",
    }));
  } catch (err) {
    console.error("Unexpected error fetching themes:", err);
    return [];
  }
}

export default async function BuatUndangan() {
  const themes = await fetchActiveThemes();

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-muted-foreground">Memuat tema...</div>}>
      <BuatUndanganContent themes={themes} />
    </Suspense>
  );
}
