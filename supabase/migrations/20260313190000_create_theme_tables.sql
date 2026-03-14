-- ============================================================
-- Migration: Create Theme Engine Tables
-- 20260313190000_create_theme_tables.sql
-- ============================================================

-- 1. themes — Master theme table
CREATE TABLE IF NOT EXISTS themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  cultural_category text NOT NULL DEFAULT 'modern',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  thumbnail_url text,
  music_url text,
  video_url text,
  colors jsonb NOT NULL DEFAULT '{}'::jsonb,
  typography jsonb NOT NULL DEFAULT '{}'::jsonb,
  animation_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  style_settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Admin can do everything with themes
CREATE POLICY "Admin full access on themes"
  ON themes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'owner')
    )
  );

-- Public can read active themes
CREATE POLICY "Public read active themes"
  ON themes FOR SELECT
  USING (status = 'active');


-- 2. theme_asset_slots — Per-slot assets for each theme
CREATE TABLE IF NOT EXISTS theme_asset_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  slot_key text NOT NULL,
  slot_label text NOT NULL,
  slot_description text DEFAULT '',
  width_cm numeric(6,2) DEFAULT 0,
  height_cm numeric(6,2) DEFAULT 0,
  aspect_ratio text DEFAULT '1:1',
  asset_url text,
  asset_type text DEFAULT 'image' CHECK (asset_type IN ('image', 'png_transparent')),
  display_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (theme_id, slot_key)
);

ALTER TABLE theme_asset_slots ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access on theme_asset_slots"
  ON theme_asset_slots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'owner')
    )
  );

-- Public read for active themes
CREATE POLICY "Public read slots for active themes"
  ON theme_asset_slots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM themes
      WHERE themes.id = theme_asset_slots.theme_id
      AND themes.status = 'active'
    )
  );


-- 3. invitation_theme_preferences — User's theme choices for an invitation
CREATE TABLE IF NOT EXISTS invitation_theme_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  theme_id uuid NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  is_enabled boolean NOT NULL DEFAULT true,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (invitation_id, theme_id)
);

ALTER TABLE invitation_theme_preferences ENABLE ROW LEVEL SECURITY;

-- Users can manage their own invitation preferences
CREATE POLICY "Users manage own invitation theme prefs"
  ON invitation_theme_preferences FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM invitations
      WHERE invitations.id = invitation_theme_preferences.invitation_id
      AND invitations.user_id = auth.uid()
    )
  );

-- Admin full access
CREATE POLICY "Admin full access on invitation_theme_preferences"
  ON invitation_theme_preferences FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'owner')
    )
  );


-- 4. Add active_theme_id to invitations (if column doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invitations' AND column_name = 'active_theme_id'
  ) THEN
    ALTER TABLE invitations ADD COLUMN active_theme_id uuid REFERENCES themes(id) ON DELETE SET NULL;
  END IF;
END $$;


-- Updated_at trigger function (reusable)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at for themes
CREATE TRIGGER themes_updated_at
  BEFORE UPDATE ON themes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for theme_asset_slots
CREATE TRIGGER theme_asset_slots_updated_at
  BEFORE UPDATE ON theme_asset_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for invitation_theme_preferences
CREATE TRIGGER invitation_theme_preferences_updated_at
  BEFORE UPDATE ON invitation_theme_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
