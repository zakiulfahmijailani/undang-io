-- Seed Petal Soft as a code-rendered wedding theme option.
-- Renderer key: petal-soft

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
  'petal-soft',
  'Petal Soft',
  'Tema pernikahan minimalis dengan estetika bunga watercolor pastel. Elegan, feminin, dan romantis.',
  'https://picsum.photos/seed/petal-soft/400/600',
  true,
  'minimalis',
  'wedding',
  '{
    "renderer_key": "petal-soft",
    "particle_type": "petals",
    "thumbnail_reference": "soft watercolor blush roses with sage leaves"
  }'::jsonb,
  array['minimalis', 'pastel', 'soft', 'floral', 'feminin', 'romantis', 'wedding'],
  'active',
  '{
    "primary": "#E8A0A0",
    "secondary": "#A8C5A0",
    "accent": "#C4919B",
    "bg": "#FDFAF8",
    "body": "#4A3F3F",
    "muted": "#9E8E8E"
  }'::jsonb,
  '{
    "font_heading": "Cormorant Garamond",
    "font_script": "Great Vibes",
    "font_body": "DM Sans",
    "font_arabic": "Scheherazade New"
  }'::jsonb,
  '{
    "parallax": true,
    "intensity": "light",
    "scroll_reveal": true,
    "music_autoplay": false
  }'::jsonb,
  '{
    "shadow": "soft",
    "radius": "soft",
    "particle_type": "petals"
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
