/**
 * useClassicThemeAssets
 * ---------------------
 * Fetches theme_assets rows from Supabase for a given theme_key
 * and merges them into the ClassicThemeAssets shape.
 *
 * Pipeline:
 *   admin prompt AI → download asset → upload via dashboard
 *   → terpetakan ke theme_key di tabel theme_assets
 *   → hook ini fetch by theme_key → merge ke ClassicThemeAssets
 *
 * Fallback: jika themeKey null / fetch gagal, return propAssets apa adanya.
 *
 * Step 16A — undang.io
 */

"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { ClassicThemeAssets, AssetKind } from "@/types/theme";

// ─── Supabase row shape ───────────────────────────────────────────────────────
interface ThemeAssetRow {
  id: string;
  theme_key: string;
  kind: AssetKind;
  label: string;
  image_url: string;
  is_global: boolean;
  created_at: string;
}

// ─── Map AssetKind → ClassicThemeAssets key(s) ────────────────────────────────
// Satu kind bisa map ke beberapa slot jika diperlukan.
const KIND_TO_SLOT: Partial<Record<AssetKind, (keyof ClassicThemeAssets)[]>> = {
  background:            ["bg_section_2"],          // admin upload → override bg_section_2
  ornament_top:         ["flower_top_center_url"],
  ornament_bottom_left:  ["flower_bottom_left_url"],
  ornament_bottom_right: ["flower_bottom_right_url"],
  ornament_corner:      ["ornament_corner_tl"],
  frame:                ["ornament_half_circle"],
  pattern:              ["cover_bg_pattern_url"],
  divider:              ["ornament_divider"],
  music:                ["bg_music"],
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export interface UseClassicThemeAssetsResult {
  assets: ClassicThemeAssets | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * @param themeKey  e.g. "classic_default", "classic_jawa", "classic_aceh"
 * @param baseAssets  The hard-coded / JSONB ClassicThemeAssets from the
 *                    classic_themes table row — used as the merge base.
 */
export function useClassicThemeAssets(
  themeKey: string | null | undefined,
  baseAssets: ClassicThemeAssets
): UseClassicThemeAssetsResult {
  const [assets, setAssets] = useState<ClassicThemeAssets | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!themeKey);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No themeKey → nothing to fetch, use baseAssets directly
    if (!themeKey) {
      setAssets(baseAssets);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function fetchAssets() {
      try {
        const supabase = createBrowserSupabaseClient();
        if (!supabase) {
          // Supabase env vars not set — fallback to baseAssets
          setAssets(baseAssets);
          setIsLoading(false);
          return;
        }

        const { data, error: sbError } = await supabase
          .from("theme_assets")
          .select("id, theme_key, kind, label, image_url, is_global, created_at")
          .eq("theme_key", themeKey!)
          .order("created_at", { ascending: true });

        if (cancelled) return;

        if (sbError) {
          console.error("[useClassicThemeAssets] Supabase error:", sbError.message);
          setError(sbError.message);
          // Graceful fallback — masih pakai baseAssets
          setAssets(baseAssets);
          setIsLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          // Tidak ada aset di DB untuk theme_key ini — pakai baseAssets
          setAssets(baseAssets);
          setIsLoading(false);
          return;
        }

        // Merge rows into baseAssets
        const merged: ClassicThemeAssets = { ...baseAssets };

        for (const row of data as ThemeAssetRow[]) {
          const slots = KIND_TO_SLOT[row.kind];
          if (!slots) continue;
          for (const slotKey of slots) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (merged as any)[slotKey] = row.image_url;
          }
        }

        setAssets(merged);
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("[useClassicThemeAssets] Unexpected error:", msg);
        setError(msg);
        setAssets(baseAssets); // fallback
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAssets();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeKey]);
  // Note: baseAssets intentionally excluded — it's a static prop from
  // classic_themes row and won't change during component lifecycle.

  return { assets, isLoading, error };
}
