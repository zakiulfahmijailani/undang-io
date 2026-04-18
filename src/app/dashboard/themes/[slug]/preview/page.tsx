import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ClassicThemeRenderer } from "@/components/themes/classic";
import { ParallaxThemeRenderer } from "@/components/themes/parallax/ParallaxThemeRenderer";
import { mockInvitationData } from "@/lib/mock";
import type { 
  SupabaseThemeRow, 
  SupabaseAssetSlotRow, 
  ClassicTheme, 
  ClassicThemeAssets, 
  ParallaxTheme,
  ParallaxAssetSlot,
  AssetKind
} from "@/types/theme";

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Mapping AssetKind (from theme_assets table) to ClassicThemeAssets keys
 */
const KIND_TO_CLASSIC_SLOT: Partial<Record<AssetKind, (keyof ClassicThemeAssets)[]>> = {
  cover_scene:          ["bg_cover"],
  left_panel_alt:       ["bg_groom_panel"],
  corner_tl:            ["flower_top_left_url"],
  corner_tr:            ["flower_top_right_url"],
  corner_bl:            ["flower_bottom_left_url"],
  corner_br:            ["flower_bottom_right_url"],
  frame_couple:         ["ornament_half_circle"],
  pattern_main:         ["cover_bg_pattern_url"],
  divider_main:         ["ornament_divider"],
  music:                ["bg_music"],
};

export default async function ThemeLivePreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    notFound();
  }

  // 1. Fetch Theme
  const { data: themeData, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (themeError || !themeData) {
    notFound();
  }

  const themeRow = themeData as SupabaseThemeRow;

  // 2. Fetch Assets
  const { data: assetsData, error: assetsError } = await supabase
    .from("theme_assets")
    .select("*")
    .eq("theme_key", slug);

  const assets = (assetsData || []) as any[];

  // 3. Dispatch Renderer
  const isParallax = themeRow.config && (themeRow.config as any).version === 1;

  if (isParallax) {
    // Construct ParallaxTheme object
    const parallaxTheme: ParallaxTheme = {
      id: themeRow.id,
      name: themeRow.name,
      slug: themeRow.slug,
      description: themeRow.description,
      status: themeRow.status as any,
      isPublished: themeRow.is_published,
      culturalCategory: themeRow.cultural_category as any,
      previewUrl: themeRow.preview_url,
      musicUrl: themeRow.music_url,
      tags: themeRow.tags || [],
      config: themeRow.config as any,
      colors: themeRow.colors as any,
      typography: themeRow.typography as any,
      animationSettings: themeRow.animation_settings as any,
      assetSlots: assets.map((a, idx) => ({
        id: a.id,
        themeId: themeRow.id,
        slotKey: a.slot,
        slotLabel: a.label || a.slot,
        assetUrl: a.file_url,
        assetType: a.mime_type?.includes('png') ? 'png_transparent' : 'image',
        displayOrder: idx,
        isActive: true,
        isRequired: false,
        settings: {}
      } as ParallaxAssetSlot)),
      createdAt: themeRow.created_at,
      updatedAt: themeRow.updated_at,
    };

    return (
      <div className="min-h-screen bg-black">
        <ParallaxThemeRenderer theme={parallaxTheme} />
      </div>
    );
  }

  // Fallback to Classic Renderer
  // Construct ClassicTheme object
  const classicAssets: ClassicThemeAssets = {
    // Default mock backgrounds if not overridden by DB
    bg_cover: "",
    bg_section_2: "",
    bg_section_3: "",
    bg_section_4: "",
    bg_section_5: "",
    bg_groom_panel: null,
    ornament_half_circle: null,
    ornament_overlay: null,
    ornament_bismillah: null,
    ornament_divider: null,
    ornament_corner_tl: null,
    ornament_corner_br: null,
    particle_type: "petals",
    particle_color: null,
    color_primary: themeRow.color_primary || "#8b6c42",
    color_secondary: "#f5ede0",
    color_accent: themeRow.color_accent || "#c9a97a",
    color_bg_page: "#fdfaf6",
    color_text_body: themeRow.color_text || "#3d2e1e",
    color_overlay: null,
    font_display: (themeRow.typography as any)?.heading || "Playfair Display",
    font_body: (themeRow.typography as any)?.body || "Inter",
    bg_music: null,
    loader_asset: null,
  };

  // Merge DB assets into classicAssets
  for (const asset of assets) {
    const slots = KIND_TO_CLASSIC_SLOT[asset.slot as AssetKind];
    if (slots) {
      for (const slotKey of slots) {
        (classicAssets as any)[slotKey] = asset.file_url;
      }
    }
  }

  const classicTheme: ClassicTheme = {
    id: themeRow.id,
    slug: themeRow.slug,
    name: themeRow.name,
    description: themeRow.description,
    thumbnail_url: themeRow.preview_url,
    is_published: themeRow.is_published,
    cultural_category: themeRow.cultural_category as any,
    target_event: "wedding",
    assets: classicAssets,
    tags: themeRow.tags || [],
    created_by: themeRow.created_by,
    created_at: themeRow.created_at,
    updated_at: themeRow.updated_at,
  };

  return (
    <ClassicThemeRenderer 
      theme={classicTheme} 
      data={mockInvitationData}
      isPreview={true}
    />
  );
}
