-- Rebuild Jawa Agung as an SVG-only code-rendered theme.
-- No local raster decoration assets are referenced by this theme.

insert into public.classic_themes (
  slug,
  name,
  description,
  thumbnail_url,
  is_published,
  cultural_category,
  target_event,
  assets,
  tags,
  status,
  colors,
  typography,
  animation_settings,
  style_settings,
  asset_slots
)
values (
  'jawa-agung',
  'Jawa Agung',
  'Tema pernikahan adat Jawa yang megah dan bermartabat, memadukan motif batik klasik, ornamen ukiran tradisional, dan tipografi elegan untuk merayakan warisan budaya Nusantara.',
  'https://picsum.photos/seed/jawa-agung/400/600',
  true,
  'adat',
  'wedding',
  '{
    "renderer_key": "jawa-agung",
    "rendering": "svg-only",
    "decorations": "inline-svg",
    "image_assets": false
  }'::jsonb,
  array['adat','jawa','batik','tradisional','budaya','klasik','wedding'],
  'active',
  '{
    "bg_primary": "#F5EDD6",
    "bg_secondary": "#EDE0C0",
    "bg_card": "#FAF4E6",
    "color_primary": "#7B3F1A",
    "color_secondary": "#C8922A",
    "color_gold": "#D4A843",
    "color_accent": "#2C4A1E",
    "color_text_body": "#2A1A0E",
    "color_text_muted": "#7A5C3A"
  }'::jsonb,
  '{
    "font_heading": "Cormorant Garamond",
    "font_script": "Pinyon Script",
    "font_body": "Lora",
    "font_display": "Cinzel Decorative",
    "font_arabic": "Scheherazade New"
  }'::jsonb,
  '{
    "parallax": false,
    "intensity": "low",
    "scroll_reveal": true,
    "music_autoplay": false,
    "particle_type": "melati"
  }'::jsonb,
  '{
    "shadow": "warm",
    "border_radius": "none",
    "border_style": "batik-gold",
    "ornament_style": "keraton-svg"
  }'::jsonb,
  '[]'::jsonb
)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  thumbnail_url = excluded.thumbnail_url,
  is_published = excluded.is_published,
  cultural_category = excluded.cultural_category,
  target_event = excluded.target_event,
  assets = excluded.assets,
  tags = excluded.tags,
  status = excluded.status,
  colors = excluded.colors,
  typography = excluded.typography,
  animation_settings = excluded.animation_settings,
  style_settings = excluded.style_settings,
  asset_slots = excluded.asset_slots,
  updated_at = now();
