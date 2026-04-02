-- ============================================================
-- P0: Create classic_themes table + add theme_key to invitations
-- ============================================================

-- 1. classic_themes — stores full ClassicThemeAssets as JSONB
create table if not exists public.classic_themes (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  description       text,
  thumbnail_url     text,
  is_published      boolean not null default false,
  cultural_category text default 'modern',
  target_event      text not null default 'wedding',
  assets            jsonb not null default '{}'::jsonb,
  tags              text[] not null default '{}',
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_classic_themes_updated_at
  before update on public.classic_themes
  for each row execute function public.set_updated_at();

-- RLS
alter table public.classic_themes enable row level security;

drop policy if exists "public can read published classic themes" on public.classic_themes;
create policy "public can read published classic themes"
  on public.classic_themes for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "authenticated can read all classic themes" on public.classic_themes;
create policy "authenticated can read all classic themes"
  on public.classic_themes for select
  to authenticated
  using (true);

drop policy if exists "authenticated can manage own classic themes" on public.classic_themes;
create policy "authenticated can manage own classic themes"
  on public.classic_themes for all
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- 2. Add theme_key to invitations (default = 'classic-default')
alter table public.invitations
  add column if not exists theme_key text default 'classic-default';

-- 3. Seed: classic-default theme
insert into public.classic_themes (slug, name, description, is_published, cultural_category, target_event, assets, tags)
values (
  'classic-default',
  'Classic Default',
  'Tema klasik elegan dengan dominasi warna gold dan dekorasi floral. Cocok untuk semua jenis pernikahan.',
  true,
  'modern',
  'wedding',
  '{
    "bg_cover":             "https://picsum.photos/seed/11/1200/800",
    "bg_section_2":         "https://picsum.photos/seed/12/1200/800",
    "bg_section_3":         "https://picsum.photos/seed/13/1200/800",
    "bg_section_4":         "https://picsum.photos/seed/14/1200/800",
    "bg_section_5":         "https://picsum.photos/seed/15/1200/800",
    "bg_groom_panel":       null,

    "ornament_half_circle": null,
    "ornament_overlay":     null,
    "ornament_bismillah":   null,
    "ornament_divider":     null,
    "ornament_corner_tl":   null,
    "ornament_corner_br":   null,

    "flower_top_right_url":    null,
    "flower_top_left_url":     null,
    "flower_bottom_right_url": null,
    "flower_bottom_left_url":  null,
    "flower_right_url":        null,
    "flower_left_url":         null,
    "flower_top_center_url":   null,

    "couple_main_image_url":   "https://picsum.photos/seed/20/400/400",
    "cover_bg_color":          "#faf5ef",
    "cover_bg_pattern_url":    null,
    "hero_bg_color":           "#fdfaf6",
    "hero_bg_pattern_url":     null,
    "bismillah_image_url":     null,
    "couple_bg_color":         "#fdfaf6",
    "couple_bg_pattern_url":   null,
    "event_bg_color":          "#faf6f0",
    "event_card_bg_color":     "#fffdf9",
    "event_divider_image_url": null,

    "particle_type":     "petals",
    "particle_color":    null,

    "color_primary":     "#8b6c42",
    "color_secondary":   "#f5ede0",
    "color_text_muted":  "#9a8060",
    "color_accent":      "#c9a97a",
    "color_bg_page":     "#fdfaf6",
    "color_text_body":   "#3d2e1e",
    "color_overlay":     "#00000030",

    "font_display":  "Cormorant Garamond",
    "font_body":     "Didact Gothic",
    "font_script":   "Sacramento",
    "font_heading":  "Oswald",
    "font_arabic":   "Scheherazade New",

    "bg_music":      null,
    "loader_asset":  null
  }'::jsonb,
  ARRAY['klasik', 'gold', 'floral', 'modern']
) on conflict (slug) do nothing;
