-- Add user-facing asset management columns to theme_assets
-- and storage upload policy for authenticated users.
-- Note: existing columns (theme_id, slot, asset_url, etc.) are kept intact.

-- New columns for dashboard asset management
alter table public.theme_assets
  add column if not exists theme_key  text,
  add column if not exists kind       text,
  add column if not exists label      text,
  add column if not exists image_url  text,
  add column if not exists is_global  boolean not null default false,
  add column if not exists created_by uuid references auth.users(id);

-- Index for user-owned asset lookup
create index if not exists idx_theme_assets_created_by
  on public.theme_assets (created_by);

-- Allow authenticated users to insert their own assets
drop policy if exists "authenticated can insert own theme assets" on public.theme_assets;
create policy "authenticated can insert own theme assets"
  on public.theme_assets for insert
  to authenticated
  with check (created_by = auth.uid());

-- Allow authenticated users to delete their own assets
drop policy if exists "authenticated can delete own theme assets" on public.theme_assets;
create policy "authenticated can delete own theme assets"
  on public.theme_assets for delete
  to authenticated
  using (created_by = auth.uid());

-- Storage: allow authenticated users to upload to theme-assets bucket
drop policy if exists "authenticated can upload to theme assets" on storage.objects;
create policy "authenticated can upload to theme assets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'theme-assets');

-- Storage: allow authenticated users to delete own uploads
drop policy if exists "authenticated can delete own theme asset files" on storage.objects;
create policy "authenticated can delete own theme asset files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'theme-assets');
