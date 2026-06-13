-- ============================================================
-- Migration: 20260613090000_fix_theme_assets_rls.sql
-- Dibuat   : 13 Juni 2026
-- Tujuan   : Membatasi akses theme_assets global dan milik undangan.
-- ============================================================

ALTER TABLE public.theme_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read theme_assets" ON public.theme_assets;
DROP POLICY IF EXISTS "public can read assets of published themes" ON public.theme_assets;
DROP POLICY IF EXISTS "authenticated can read all theme assets" ON public.theme_assets;
DROP POLICY IF EXISTS "Public read global theme assets" ON public.theme_assets;
DROP POLICY IF EXISTS "Users read own invitation assets" ON public.theme_assets;
DROP POLICY IF EXISTS "Users manage own invitation assets" ON public.theme_assets;

CREATE POLICY "Public read global theme assets"
  ON public.theme_assets FOR SELECT
  USING (is_global = true);

CREATE POLICY "Users read own invitation assets"
  ON public.theme_assets FOR SELECT
  TO authenticated
  USING (
    invitation_id IN (
      SELECT id FROM public.invitations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users manage own invitation assets"
  ON public.theme_assets FOR ALL
  TO authenticated
  USING (
    invitation_id IN (
      SELECT id FROM public.invitations WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    invitation_id IN (
      SELECT id FROM public.invitations WHERE user_id = auth.uid()
    )
  );

-- Rollback:
-- DROP POLICY IF EXISTS "Public read global theme assets" ON public.theme_assets;
-- DROP POLICY IF EXISTS "Users read own invitation assets" ON public.theme_assets;
-- DROP POLICY IF EXISTS "Users manage own invitation assets" ON public.theme_assets;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
