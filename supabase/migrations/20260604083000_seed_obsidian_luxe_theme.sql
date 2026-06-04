-- Seed Obsidian Luxe as a code-rendered wedding theme option.
-- Renderer key: obsidian-luxe

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
  'obsidian-luxe',
  'Obsidian Luxe',
  'Tema pernikahan mewah berkelas dengan estetika hitam dan emas. Dramatis, sinematik, dan timeless untuk pasangan modern.',
  'https://picsum.photos/seed/obsidian-luxe/400/600',
  true,
  'modern',
  'wedding',
  '{
    "renderer_key": "obsidian-luxe",
    "particle_type": "gold-dust",
    "thumbnail_reference": "black and gold cinematic luxury wedding invitation"
  }'::jsonb,
  array['modern', 'premium', 'luxury', 'dark', 'gold', 'cinematic', 'wedding'],
  'active',
  '{
    "bg_primary": "#0A0A0A",
    "bg_secondary": "#141414",
    "bg_card": "#0F0F1A",
    "color_primary": "#C9A84C",
    "color_secondary": "#E8D5A3",
    "color_text_body": "#F5F0E8",
    "color_text_muted": "#8A8070"
  }'::jsonb,
  '{
    "font_heading": "Cormorant Garamond",
    "font_script": "Bodoni Moda",
    "font_body": "Jost",
    "font_arabic": "Scheherazade New"
  }'::jsonb,
  '{
    "parallax": true,
    "intensity": "medium",
    "scroll_reveal": true,
    "music_autoplay": false,
    "particle_type": "gold-dust"
  }'::jsonb,
  '{
    "shadow": "dramatic",
    "border_radius": "none",
    "border_style": "gold-thin"
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
