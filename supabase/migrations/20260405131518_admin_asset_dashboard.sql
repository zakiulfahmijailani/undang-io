-- Tabel daftar tema
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'themes'
    ) THEN
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'themes' 
            AND column_name = 'theme_key'
        ) THEN
            -- In case themes table is totally different
            DROP TABLE public.theme_assets CASCADE;
            DROP TABLE public.themes CASCADE;
        END IF;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_key TEXT UNIQUE NOT NULL,            -- contoh: "vintage_botanica", "aceh_serenity"
  display_name TEXT NOT NULL,               -- contoh: "Vintage Botanica"
  culture TEXT,                             -- contoh: "Acehnese (Aceh Province)"
  color_primary TEXT,                       -- hex, contoh: "#1B4F32"
  color_accent TEXT,                        -- hex
  color_text TEXT,                          -- hex
  color_cta TEXT,                           -- hex
  mood_keywords TEXT[],                     -- array of strings
  is_active BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  section_config JSONB DEFAULT '{
    "show_foto_cover": true,
    "show_data_mempelai": true,
    "show_ayat_quote": true,
    "show_kisah_cinta": true,
    "show_acara": true,
    "show_galeri_foto": true,
    "show_amplop_digital": true,
    "show_musik": true
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enum untuk jenis aset
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'asset_kind') THEN
        CREATE TYPE asset_kind AS ENUM (
          'cover_scene',           -- 01: Full scene background cover (1200x1800)
          'left_panel_alt',        -- 02: Ilustrasi panel kiri (800x1200)
          'corner_tl',             -- 03: Ornamen pojok top-left (400x400, transparent)
          'corner_tr',             -- 04: Ornamen pojok top-right (400x400, transparent)
          'corner_bl',             -- 05: Ornamen pojok bottom-left (400x400, transparent)
          'corner_br',             -- 06: Ornamen pojok bottom-right (400x400, transparent)
          'divider_main',          -- 07: Divider/separator utama (1200x120, transparent)
          'divider_alt',           -- 08: Divider/separator alternatif (1200x120, transparent)
          'frame_couple',          -- 09: Frame foto pengantin (500x600, transparent)
          'pattern_main',          -- 10: Pola/pattern repeating utama (400x400, transparent)
          'pattern_alt',           -- 11: Pola/pattern repeating alternatif (400x400, transparent)
          'icon_venue',            -- 12: Ikon gedung/venue (200x200, transparent)
          'illustration_iconic',   -- 13: Ilustrasi ikonik khas daerah (700x400, transparent)
          'banner_top',            -- 14: Banner dekoratif atas (1200x200, transparent)
          'footer_scene',          -- 15: Ilustrasi footer/penutup (1200x600)
          'music'                  -- 16: File audio .mp3 untuk background musik
        );
    END IF;
END $$;

-- Tabel aset tema
CREATE TABLE IF NOT EXISTS public.theme_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  theme_key TEXT NOT NULL,                  -- denormalized untuk query cepat
  slot asset_kind NOT NULL,
  file_url TEXT,                            -- public URL dari Supabase Storage
  storage_path TEXT,                        -- path di bucket, contoh: "themes/vintage_botanica/cover_scene.png"
  file_size_bytes BIGINT,
  mime_type TEXT,
  width_px INT,
  height_px INT,
  is_transparent BOOLEAN DEFAULT false,
  alt_text TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id),
  UNIQUE(theme_id, slot)                    -- 1 file per slot per tema
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_theme_assets_theme_key ON public.theme_assets(theme_key);
CREATE INDEX IF NOT EXISTS idx_theme_assets_slot ON public.theme_assets(slot);

-- RLS: hanya superadmin
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_assets ENABLE ROW LEVEL SECURITY;

-- Policy: admin bisa CRUD, user biasa hanya bisa SELECT themes aktif
DROP POLICY IF EXISTS "Admin full access themes" ON public.themes;
CREATE POLICY "Admin full access themes" ON public.themes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'superadmin'
    )
  );

DROP POLICY IF EXISTS "Public read active themes" ON public.themes;
CREATE POLICY "Public read active themes" ON public.themes
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access theme_assets" ON public.theme_assets;
CREATE POLICY "Admin full access theme_assets" ON public.theme_assets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'superadmin'
    )
  );

DROP POLICY IF EXISTS "Public read theme_assets" ON public.theme_assets;
CREATE POLICY "Public read theme_assets" ON public.theme_assets
  FOR SELECT USING (true);


-- Storage Bucket theme-assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'theme-assets', 
  'theme-assets', 
  true, 
  10485760, 
  ARRAY['image/png', 'image/webp', 'image/svg+xml', 'audio/mpeg']
)
ON CONFLICT (id) DO UPDATE SET 
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage Policies
DROP POLICY IF EXISTS "Public can view theme-assets bucket" ON storage.objects;
CREATE POLICY "Public can view theme-assets bucket" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'theme-assets');

DROP POLICY IF EXISTS "Superadmin can manage theme-assets bucket" ON storage.objects;
CREATE POLICY "Superadmin can manage theme-assets bucket" ON storage.objects
FOR ALL USING (
  bucket_id = 'theme-assets' AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.uid() = id
    AND raw_user_meta_data->>'role' = 'superadmin'
  )
);
