-- ============================================================
-- Fix RLS: add admin/owner INSERT/UPDATE/DELETE policies for
-- theme_assets (parallax system) and theme_asset_slots (classic system)
--
-- Root cause: both tables have RLS enabled but zero write policies,
-- so any INSERT/UPDATE/DELETE from authenticated admin users hits
-- the default DENY and throws "new row violates row-level security policy".
-- ============================================================

-- -------------------------------------------------------
-- 1. theme_assets (parallax / MasterInvitationRenderer)
-- -------------------------------------------------------

-- Admin/owner: full write access to ALL rows
DROP POLICY IF EXISTS "admin full access on theme_assets" ON public.theme_assets;
CREATE POLICY "admin full access on theme_assets"
  ON public.theme_assets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id   = auth.uid()
        AND profiles.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id   = auth.uid()
        AND profiles.role IN ('admin', 'owner')
    )
  );

-- -------------------------------------------------------
-- 2. themes (parent table — admin also needs write access)
-- -------------------------------------------------------

DROP POLICY IF EXISTS "admin full access on themes" ON public.themes;
CREATE POLICY "admin full access on themes"
  ON public.themes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id   = auth.uid()
        AND profiles.role IN ('admin', 'owner')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id   = auth.uid()
        AND profiles.role IN ('admin', 'owner')
    )
  );

-- -------------------------------------------------------
-- 3. theme_asset_slots (classic system, if table exists)
-- -------------------------------------------------------
-- Only runs if theme_asset_slots table exists; safe to apply regardless.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name   = 'theme_asset_slots'
  ) THEN

    -- Ensure RLS is enabled
    EXECUTE 'ALTER TABLE public.theme_asset_slots ENABLE ROW LEVEL SECURITY';

    -- Public: read any active slot
    EXECUTE '
      DROP POLICY IF EXISTS "public can read theme_asset_slots" ON public.theme_asset_slots;
      CREATE POLICY "public can read theme_asset_slots"
        ON public.theme_asset_slots
        FOR SELECT
        TO anon, authenticated
        USING (true)
    ';

    -- Admin/owner: full write access
    EXECUTE '
      DROP POLICY IF EXISTS "admin full access on theme_asset_slots" ON public.theme_asset_slots;
      CREATE POLICY "admin full access on theme_asset_slots"
        ON public.theme_asset_slots
        FOR ALL
        TO authenticated
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id   = auth.uid()
              AND profiles.role IN (''admin'', ''owner'')
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id   = auth.uid()
              AND profiles.role IN (''admin'', ''owner'')
          )
        )
    ';

  END IF;
END;
$$;
