"""
Apply missing schema changes to Supabase DB.
Uses the Supabase Management API to execute SQL.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

# Load .env.local
ENV_FILE = Path(__file__).parent.parent / '.env.local'
for line in ENV_FILE.read_text().splitlines():
    if '=' in line and not line.startswith('#'):
        k, v = line.strip().split('=', 1)
        os.environ[k] = v

SUPABASE_URL = os.environ['NEXT_PUBLIC_SUPABASE_URL']
SUPABASE_KEY = os.environ['SUPABASE_SERVICE_ROLE_KEY']

# Extract project ref
PROJECT_REF = SUPABASE_URL.split('//')[1].split('.')[0]

MIGRATION_SQL = """
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
  ADD COLUMN IF NOT EXISTS alt_text TEXT;

-- If mime_type doesn't exist (it might from old schema), add it
ALTER TABLE public.theme_assets
  ADD COLUMN IF NOT EXISTS mime_type TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_theme_assets_theme_key_v2 ON public.theme_assets(theme_key);
CREATE INDEX IF NOT EXISTS idx_theme_assets_slot_v2 ON public.theme_assets(slot);

-- Add unique constraint for upsert
-- First check if it exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'theme_assets_themeid_slot_unique'
  ) THEN
    -- Can't add unique on nullable, so we'll use a unique index instead
    CREATE UNIQUE INDEX IF NOT EXISTS theme_assets_themeid_slot_unique 
      ON public.theme_assets(theme_id, slot) 
      WHERE theme_id IS NOT NULL AND slot IS NOT NULL;
  END IF;
END
$$;

-- Ensure RLS policies allow service role access (already bypassed by service role key)
-- But add admin policy for authenticated users
DROP POLICY IF EXISTS "Admin full access theme_assets" ON public.theme_assets;
CREATE POLICY "Admin full access theme_assets" ON public.theme_assets
  FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access themes" ON public.themes;
CREATE POLICY "Admin full access themes" ON public.themes
  FOR ALL USING (true) WITH CHECK (true);
"""

print(f"Project ref: {PROJECT_REF}")
print(f"Supabase URL: {SUPABASE_URL}")
print()
print("Executing migration SQL...")
print("=" * 60)

# Execute via Supabase's pg_net or direct REST approach
# The service role key bypasses RLS but can't do DDL via PostgREST.
# We need to use supabase CLI or the SQL editor.

# Let's try the supabase management API approach
# POST https://api.supabase.com/v1/projects/{ref}/database/query

# Actually, we can try executing SQL via a custom stored procedure approach:
# Create a function that executes dynamic SQL, then call it via RPC

from supabase import create_client
sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# Split SQL into individual statements and try executing via rpc
statements = [s.strip() for s in MIGRATION_SQL.split(';') if s.strip() and not s.strip().startswith('--')]

# First, try creating a helper function for DDL execution
try:
    create_fn_sql = """
    CREATE OR REPLACE FUNCTION exec_ddl(sql_text text)
    RETURNS void AS $$
    BEGIN
      EXECUTE sql_text;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """
    # Can't create functions via PostgREST either...
    # Let's just output the SQL for manual execution
    pass
except:
    pass

print()
print("Cannot execute DDL via PostgREST API.")
print("Please copy and run the following SQL in Supabase Dashboard:")
print()
print(f"  Dashboard URL: https://supabase.com/dashboard/project/{PROJECT_REF}/sql/new")
print()
print("=" * 60)
print(MIGRATION_SQL)
print("=" * 60)
print()
print("After running the SQL, re-run the asset generator:")
print(f"  python scripts/generate_placeholder_assets.py default-parallax")
