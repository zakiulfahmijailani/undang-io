/**
 * Classic Theme Loader — server-side utilities for loading classic themes
 * and mapping invitation DB rows to ClassicInvitationData.
 *
 * Usage:
 *   const theme = await fetchClassicTheme('classic-default');
 *   const data = mapInvitationToClassicData(invitationRow);
 *   <ClassicThemeRenderer theme={theme} data={data} />
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ClassicTheme, ClassicInvitationData } from "@/types/theme";

/**
 * Fetch a published ClassicTheme by slug from the `classic_themes` table.
 * Returns null if not found or not published.
 */
export async function fetchClassicTheme(
    themeSlug: string
): Promise<ClassicTheme | null> {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
        .from("classic_themes")
        .select("*")
        .eq("slug", themeSlug)
        .eq("is_published", true)
        .single();

    if (error || !data) {
        console.error("[classic-theme-loader] fetch error:", error?.message);
        return null;
    }

    // Map DB row → ClassicTheme (column names match interface)
    return data as ClassicTheme;
}

/**
 * Map a raw Supabase `invitations` row → ClassicInvitationData.
 * Fills in nulls for any missing fields so the renderer fallbacks work.
 */
export function mapInvitationToClassicData(
    inv: Record<string, any>
): ClassicInvitationData {
    return {
        // ── Photos ─────────────────────────────────────────────────
        groom_photo_url: inv.groom_photo_url ?? null,
        bride_photo_url: inv.bride_photo_url ?? null,
        photo_couple_1: inv.photo_couple_1 ?? null,
        photo_couple_2: inv.photo_couple_2 ?? null,
        photo_couple_3: inv.photo_couple_3 ?? null,
        photo_gallery: inv.photo_gallery ?? [],

        // ── Names ──────────────────────────────────────────────────
        groom_full_name: inv.groom_full_name || "Mempelai Pria",
        bride_full_name: inv.bride_full_name || "Mempelai Wanita",
        groom_nickname: inv.groom_nickname ?? null,
        bride_nickname: inv.bride_nickname ?? null,

        // ── Parents ────────────────────────────────────────────────
        groom_father_name: inv.groom_father_name ?? null,
        groom_mother_name: inv.groom_mother_name ?? null,
        groom_child_order: inv.groom_child_order ?? null,
        bride_father_name: inv.bride_father_name ?? null,
        bride_mother_name: inv.bride_mother_name ?? null,
        bride_child_order: inv.bride_child_order ?? null,

        // ── Bio ────────────────────────────────────────────────────
        bio_groom: inv.bio_groom ?? null,
        bio_bride: inv.bio_bride ?? null,

        // ── Event dates & venues ───────────────────────────────────
        akad_datetime: inv.akad_datetime ?? null,
        resepsi_datetime: inv.resepsi_datetime ?? null,
        akad_location_name: inv.akad_location_name ?? null,
        akad_location_address: inv.akad_location_address ?? null,
        akad_maps_url: inv.akad_maps_url ?? null,
        resepsi_location_name: inv.resepsi_location_name ?? null,
        resepsi_location_address: inv.resepsi_location_address ?? null,
        resepsi_maps_url: inv.resepsi_maps_url ?? null,

        // ── Love story ─────────────────────────────────────────────
        love_story: inv.love_story ?? [],

        // ── Gift / amplop digital ──────────────────────────────────
        qris_image: inv.qris_image ?? null,
        rekening: inv.rekening ?? [],
    };
}
