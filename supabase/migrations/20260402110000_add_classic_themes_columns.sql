-- ============================================================
-- Add missing columns to classic_themes
-- Required by AdminThemeEditorForm insert/update payload
-- ============================================================

-- Status column (active / draft / archived)
alter table public.classic_themes
  add column if not exists status text not null default 'draft'
  constraint classic_themes_status_check
    check (status in ('draft', 'active', 'archived'));

-- Replace is_published with status where needed (keep is_published for backward compat)
-- is_published stays, status is the new canonical field.
-- Sync existing rows: published → active, unpublished → draft
update public.classic_themes
  set status = case when is_published then 'active' else 'draft' end
  where status = 'draft';

-- Colors (JSONB) — HSL palette keyed by role
alter table public.classic_themes
  add column if not exists colors jsonb not null default '{}'::jsonb;

-- Typography (JSONB) — headingFont, bodyFont
alter table public.classic_themes
  add column if not exists typography jsonb not null default '{}'::jsonb;

-- Animation settings (JSONB) — heroAnimation, intensity, parallax, scrollReveal, etc.
alter table public.classic_themes
  add column if not exists animation_settings jsonb not null default '{}'::jsonb;

-- Style settings (JSONB) — borderRadius, shadow
alter table public.classic_themes
  add column if not exists style_settings jsonb not null default '{}'::jsonb;

-- Asset slots (JSONB array) — [{slotKey, slotLabel, assetUrl}]
alter table public.classic_themes
  add column if not exists asset_slots jsonb not null default '[]'::jsonb;

-- Index on status for dashboard queries
create index if not exists idx_classic_themes_status
  on public.classic_themes (status);
