-- phase 1: theme system for parallax invitation templates
-- creates:
-- 1) public.themes
-- 2) public.theme_assets
-- 3) public bucket: theme-assets
-- 4) basic rls + read policies
-- note:
-- - theme config is stored as jsonb for flexible layer/animation settings
-- - assets are public for fast delivery on invitation pages
-- - upload/update/delete can be handled later via server-side admin flow

create extension if not exists pgcrypto;

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- themes table
create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  preview_url text,
  is_active boolean not null default true,
  is_published boolean not null default false,

  -- flexible visual + motion config
  config jsonb not null default '{}'::jsonb,

  -- optional metadata for future dashboard filters
  category text,
  tags text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_themes_updated_at
before update on public.themes
for each row
execute function public.set_updated_at();

-- theme assets table
create table if not exists public.theme_assets (
  id uuid primary key default gen_random_uuid(),
  theme_id uuid not null references public.themes(id) on delete cascade,

  -- canonical slot names such as:
  -- bg, bg_detail, mid_left, mid_right, mid_center,
  -- deco_top, deco_bottom, overlay, texture, particle, extra_1..extra_5
  slot text not null,

  asset_url text not null,
  asset_path text,
  asset_type text not null default 'image',
  mime_type text,

  sort_order integer not null default 0,
  is_required boolean not null default false,
  is_active boolean not null default true,

  -- per-layer motion overrides
  settings jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint theme_assets_theme_slot_unique unique (theme_id, slot)
);

create trigger set_theme_assets_updated_at
before update on public.theme_assets
for each row
execute function public.set_updated_at();

-- helpful indexes
create index if not exists idx_themes_is_published
  on public.themes (is_published);

create index if not exists idx_themes_slug
  on public.themes (slug);

create index if not exists idx_theme_assets_theme_id
  on public.theme_assets (theme_id);

create index if not exists idx_theme_assets_sort_order
  on public.theme_assets (theme_id, sort_order);

create index if not exists idx_themes_config_gin
  on public.themes
  using gin (config);

create index if not exists idx_theme_assets_settings_gin
  on public.theme_assets
  using gin (settings);

-- enable rls
alter table public.themes enable row level security;
alter table public.theme_assets enable row level security;

-- public read access for published themes
drop policy if exists "public can read published themes" on public.themes;
create policy "public can read published themes"
on public.themes
for select
to anon, authenticated
using (is_published = true and is_active = true);

-- public read access for assets belonging to published themes
drop policy if exists "public can read assets of published themes" on public.theme_assets;
create policy "public can read assets of published themes"
on public.theme_assets
for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1
    from public.themes t
    where t.id = theme_assets.theme_id
      and t.is_published = true
      and t.is_active = true
  )
);

-- authenticated users can read all themes/assets in dashboard context
drop policy if exists "authenticated can read all themes" on public.themes;
create policy "authenticated can read all themes"
on public.themes
for select
to authenticated
using (true);

drop policy if exists "authenticated can read all theme assets" on public.theme_assets;
create policy "authenticated can read all theme assets"
on public.theme_assets
for select
to authenticated
using (true);

-- no insert/update/delete policies yet:
-- admin writes should happen through secure server-side flow first

-- storage bucket for theme layers
insert into storage.buckets (id, name, public)
values ('theme-assets', 'theme-assets', true)
on conflict (id) do update
set public = excluded.public;

-- public read for objects in theme-assets bucket
drop policy if exists "public can view theme assets bucket" on storage.objects;
create policy "public can view theme assets bucket"
on storage.objects
for select
to public
using (bucket_id = 'theme-assets');

-- optional seed example
insert into public.themes (
  name,
  slug,
  description,
  is_active,
  is_published,
  category,
  config
)
values (
  'Default Parallax',
  'default-parallax',
  'Base parallax engine template for layered wedding scenes',
  true,
  false,
  'parallax',
  jsonb_build_object(
    'version', 1,
    'layout', 'default-parallax',
    'tilt_strength', 12,
    'scroll_strength', 0.35,
    'zoom_enabled', true,
    'overlay_blend', 'normal',
    'fonts', jsonb_build_object(
      'heading', 'Playfair Display',
      'body', 'Inter'
    ),
    'palette', jsonb_build_object(
      'primary', '#1E1B18',
      'accent', '#D4A91C',
      'text', '#FDFCF9'
    ),
    'slots', jsonb_build_array(
      'bg',
      'bg_detail',
      'mid_left',
      'mid_right',
      'mid_center',
      'deco_top',
      'deco_bottom',
      'overlay',
      'texture',
      'particle',
      'extra_1',
      'extra_2',
      'extra_3',
      'extra_4',
      'extra_5'
    )
  )
)
on conflict (slug) do nothing;