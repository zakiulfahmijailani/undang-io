-- ============================================================
-- Fix themes table: add missing columns from 20260405 migration
-- ============================================================

ALTER TABLE public.themes
  ADD COLUMN IF NOT EXISTS theme_key TEXT,
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS culture TEXT,
  ADD COLUMN IF NOT EXISTS color_primary TEXT,
  ADD COLUMN IF NOT EXISTS color_accent TEXT,
  ADD COLUMN IF NOT EXISTS color_text TEXT,
  ADD COLUMN IF NOT EXISTS color_cta TEXT,
  ADD COLUMN IF NOT EXISTS mood_keywords TEXT[],
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS section_config JSONB DEFAULT '{
    "show_foto_cover": true,
    "show_data_mempelai": true,
    "show_ayat_quote": true,
    "show_kisah_cinta": true,
    "show_acara": true,
    "show_galeri_foto": true,
    "show_amplop_digital": true,
    "show_musik": true
  }'::jsonb;

-- Backfill theme_key and display_name from slug and name
UPDATE public.themes SET theme_key = slug WHERE theme_key IS NULL;
UPDATE public.themes SET display_name = name WHERE display_name IS NULL;

-- ============================================================
-- Fix theme_assets table: add missing columns
-- ============================================================

ALTER TABLE public.theme_assets
  ADD COLUMN IF NOT EXISTS theme_id UUID REFERENCES public.themes(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS slot TEXT,
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS uploaded_by UUID,
  ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS width_px INT,
  ADD COLUMN IF NOT EXISTS height_px INT,
  ADD COLUMN IF NOT EXISTS is_transparent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS alt_text TEXT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_theme_assets_theme_key_v2 ON public.theme_assets(theme_key);
CREATE INDEX IF NOT EXISTS idx_theme_assets_slot_v2 ON public.theme_assets(slot);

-- Add unique index for upsert (theme_id + slot)
CREATE UNIQUE INDEX IF NOT EXISTS theme_assets_themeid_slot_unique 
  ON public.theme_assets(theme_id, slot) 
  WHERE theme_id IS NOT NULL AND slot IS NOT NULL;

-- Ensure permissive RLS for admin access
DROP POLICY IF EXISTS "Admin full access theme_assets" ON public.theme_assets;
CREATE POLICY "Admin full access theme_assets" ON public.theme_assets
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access themes" ON public.themes;
CREATE POLICY "Admin full access themes" ON public.themes
  FOR ALL USING (true) WITH CHECK (true);
